"""
Graph nodes for IP-SAKTI.

Each node takes the running GraphState and returns a dict of only the keys
it changes — LangGraph merges that into the state. The real logic already
lives in retrieval/ and generation/; nodes just call into it, they don't
reimplement it.
"""

from __future__ import annotations

import logging

from generation.citation import attach_citations, is_abstention
from generation.llm_client import complete, generate
from graph.state import GraphState
from retrieval.bm25_search import search as bm25_search
from retrieval.dense_search import search as dense_search
from retrieval.fusion import fuse
from retrieval.reranker import rerank

log = logging.getLogger(__name__)

# 20 was the original value but measurably too shallow on this corpus: RRF
# fusion penalizes a chunk that ranks reasonably in only ONE of BM25/dense
# (vs. appearing in both), so a chunk sitting just past the individual
# top_k cutoff in one retriever gets fused out entirely even when it's the
# single most relevant chunk in the corpus. Verified case: the Patent
# Office Manual's own explanation of Section 3(p) ranked BM25 #20 / dense
# #24 — both just outside a top_k=20 cutoff — which caused the system to
# abstain on "What does Section 3(p) say about traditional knowledge?"
# even though the answer is directly in the indexed corpus. Raising to 40
# fixed this specific case in testing; revisit if it's still too shallow
# as the corpus grows, or trade off against latency if reranking 40
# candidates per query becomes a bottleneck.
FUSED_TOP_K = 40
RERANK_TOP_K = 5

# ms-marco cross-encoder outputs raw logits (observed range roughly -3 to
# +9 on this corpus): positive scores tracked genuinely relevant chunks in
# testing, negative scores tracked irrelevant ones. 0.0 is a reasonable
# starting cutoff, not a rigorously tuned one — revisit if the retry fires
# too often or too rarely in practice.
RERANK_SCORE_THRESHOLD = 0.0


def rewrite_query(state: GraphState) -> dict:
    """Standalone-question rewrite from chat history, plus category context.

    A no-op without history, so a single-turn query passes through
    unchanged end to end — this keeps single-turn graph output identical
    to calling retrieval/generation directly. `category` (from the Step 0
    intake flow) is prepended as a short context clause when present —
    this is a single-point integration: it flows into both retrieval
    (biases dense search semantically, doesn't hurt BM25 since the
    original terms are still present) and generation (the LLM sees the
    same rewritten_query), without needing to touch every downstream
    function separately.
    """
    history = state.get("history") or []
    query = state["query"]
    category = state.get("category")

    if not history:
        rewritten = query
    else:
        transcript = "\n".join(f"{turn['role']}: {turn['content']}" for turn in history)
        prompt = (
            "Rewrite the latest user question as a standalone question that "
            "makes sense without the prior conversation below. Keep it short. "
            "Output only the rewritten question, nothing else.\n\n"
            f"{transcript}\nuser: {query}"
        )
        rewritten = complete(prompt) or query

    if category:
        rewritten = f"For a {category} formulation: {rewritten}"

    return {"rewritten_query": rewritten}


def retrieve(state: GraphState) -> dict:
    """Hybrid retrieval (BM25 + dense, fused by RRF) on the current query."""
    query = state["rewritten_query"]
    jurisdiction = state.get("jurisdiction")
    bm25_results = bm25_search(query, top_k=FUSED_TOP_K, jurisdiction=jurisdiction)
    dense_results = dense_search(query, top_k=FUSED_TOP_K, jurisdiction=jurisdiction)
    candidates = fuse(bm25_results, dense_results, top_k=FUSED_TOP_K)
    return {"candidates": candidates}


def rerank_node(state: GraphState) -> dict:
    query = state["rewritten_query"]
    reranked = rerank(query, state["candidates"], top_k=RERANK_TOP_K)
    return {"reranked": reranked}


def should_retry(state: GraphState) -> str:
    """Conditional edge after reranking.

    Retries retrieval once, and only once, if the top rerank score looks
    weak. flags["retried"] guards against a second retry — once set, this
    always routes to "generate" regardless of score, so the branch is
    bounded, never a loop.
    """
    flags = state.get("flags") or {}
    if flags.get("retried"):
        return "generate"

    reranked = state.get("reranked") or []
    if not reranked or reranked[0]["rerank_score"] < RERANK_SCORE_THRESHOLD:
        log.info(
            "Top rerank score %.3f below threshold %.1f — retrying retrieval once",
            reranked[0]["rerank_score"] if reranked else float("-inf"),
            RERANK_SCORE_THRESHOLD,
        )
        return "retry"
    return "generate"


def retry_rewrite_query(state: GraphState) -> dict:
    """Only reached on the bounded retry path: ask the LLM to rephrase the
    query differently, in case the original phrasing just didn't match the
    corpus well, then mark flags["retried"] so should_retry can't loop again.
    """
    original = state["rewritten_query"]
    prompt = (
        "This search query returned weak results from a document search "
        "system: " + original + "\n\n"
        "Rephrase it as a different, more specific search query that might "
        "match better. Output only the rephrased query, nothing else."
    )
    rephrased = complete(prompt)

    flags = dict(state.get("flags") or {})
    flags["retried"] = True
    return {"rewritten_query": rephrased or original, "flags": flags}


def generate_answer(state: GraphState) -> dict:
    query = state["rewritten_query"]
    answer = generate(query, state["reranked"])

    flags = dict(state.get("flags") or {})
    flags["abstained"] = is_abstention(answer)
    return {"answer": answer, "flags": flags}


def attach_citations_node(state: GraphState) -> dict:
    """No sources on an abstention — nothing was actually used to answer."""
    if (state.get("flags") or {}).get("abstained"):
        return {"citations": []}
    return {"citations": attach_citations(state["reranked"])}

"""
Citation attachment for IP-SAKTI.

The LLM never writes citations — this module takes the chunks that were
actually retrieved (not anything the model said) and turns them into the
source list shown to the user. A citation here cannot be hallucinated
because it never passes through the model.
"""

from __future__ import annotations

import math

from generation.prompts import ABSTENTION_MARKER


def is_abstention(answer: str) -> bool:
    """True if the model used the fixed abstention prefix from prompts.py."""
    return answer.strip().startswith(ABSTENTION_MARKER)


def _confidence_pct(rerank_score: float) -> int:
    """Squash the cross-encoder's raw logit into a 0-100 confidence a
    non-technical user can read.

    ms-marco's cross-encoder outputs unbounded logits (observed range
    roughly -3 to +9 on this corpus, per retrieval/reranker.py) -- a
    sigmoid centered at 0 maps that to a smooth 0-100 scale: negative
    scores (weak match) land under 50, positive scores (real relevance)
    climb toward 100. This is NOT a calibrated probability of correctness
    -- it's a readable transform of the same score already used to select
    these chunks, nothing more. Don't oversell it as more than that.
    """
    return round(100 / (1 + math.exp(-rerank_score)))


def attach_citations(chunks: list[dict]) -> list[dict]:
    """Build the source list from retrieved chunks, deduped by chunk_id.

    Takes only the chunks the retrieval pipeline actually returned — the
    model has no input into which chunks appear here or what their metadata
    says.
    """
    seen: set[str] = set()
    citations = []
    for chunk in chunks:
        chunk_id = chunk["chunk_id"]
        if chunk_id in seen:
            continue
        seen.add(chunk_id)
        citations.append(
            {
                "chunk_id": chunk_id,
                "source_file": chunk["source_file"],
                "page_number": chunk["page_number"],
                "section_heading": chunk["section_heading"],
                "text": chunk["text"],
                "confidence": _confidence_pct(chunk["rerank_score"]),
            }
        )
    return citations

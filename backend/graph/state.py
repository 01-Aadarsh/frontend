"""
Graph state for IP-SAKTI.

A single TypedDict threaded through every node. LangGraph merges each node's
returned dict into this state, so a node only needs to return the keys it
actually changes.
"""

from __future__ import annotations

from typing import TypedDict


class GraphState(TypedDict, total=False):
    query: str
    history: list[dict]  # optional prior turns: [{"role": ..., "content": ...}]
    # "national" | "international" | None (None/absent = no filter, search
    # everything). Set by the frontend's jurisdiction toggle -- see
    # ingestion/indexer.py's INTERNATIONAL_DOCUMENTS for which documents
    # are tagged which way. Filters retrieval, not generation directly.
    jurisdiction: str | None
    # Free-text formulation category from the Step 0 intake flow (e.g.
    # "classical medicine", "new drug") -- prepended as context ahead of
    # the query before retrieval/generation. Optional; None if the user
    # skipped classification.
    category: str | None
    rewritten_query: str
    candidates: list[dict]  # fused top-20, before reranking
    reranked: list[dict]  # reranked top-5
    answer: str
    citations: list[dict]
    flags: dict


# Callers must seed state with this, not {} — nodes only ever set flags they
# have a reason to change (e.g. retry_rewrite_query only runs on the retry
# path), so starting from {} means "retried" is simply absent from the
# response on the common no-retry path instead of present-and-False. That
# makes the API response shape inconsistent for callers checking flags["retried"].
DEFAULT_FLAGS = {"abstained": False, "retried": False}

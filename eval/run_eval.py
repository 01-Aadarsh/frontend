"""
Evaluation runner for IP-SAKTI Sahayak (Module 6.5).

Runs every question in test_set.json through the real, live graph -- same
code path as a real user request via /query, not a shortcut -- and scores:
  (a) citation correctness: does at least one of the citations returned
      match one of the case's expected_source_files?
  (b) answer accuracy: cosine similarity between the generated answer and
      the case's hand-written expected_answer, using the same embedding
      model already in the pipeline (no new dependency, and it's the same
      "does this mean the same thing" signal dense retrieval already
      relies on elsewhere in this codebase).
  (c) safe abstention: does flags.abstained match the case's expected
      should_abstain?

This is NOT a substitute for a human reading every answer -- similarity
scoring can pass a technically-different-but-superficially-similar answer,
and it can fail a correct answer phrased very differently from
expected_answer. Treat the printed score as a real, useful signal, not a
guarantee. Read scored_results.json afterward and spot-check a few
"failed" cases by eye before trusting the number in a demo/PPT.

Usage (run from the repo root, same as any other backend command):
    python -m eval.run_eval                 # full run, writes eval/scored_results.json
    python -m eval.run_eval --case q1        # single case, verbose, no file written
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
# backend/.env's paths (BM25_INDEX_PATH, DATA_DIR) are relative to backend/,
# same as every other backend command in this repo -- chdir there before
# anything downstream reads them, rather than special-casing eval/ to
# understand paths differently from the rest of the app.
os.chdir(BACKEND_DIR)

from sentence_transformers import SentenceTransformer

sys.path.insert(0, str(BACKEND_DIR))

from graph.build_graph import build_graph  # noqa: E402
from graph.state import DEFAULT_FLAGS  # noqa: E402

TEST_SET_PATH = Path(__file__).parent / "test_set.json"
RESULTS_PATH = Path(__file__).parent / "scored_results.json"

# Same model the pipeline already uses for dense retrieval (see
# backend/.env's EMBED_MODEL) -- reused here rather than pulling in a
# second embedding model just for eval scoring.
SIMILARITY_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
SIMILARITY_PASS_THRESHOLD = 0.55

_embed_model: SentenceTransformer | None = None


def _get_embed_model() -> SentenceTransformer:
    global _embed_model
    if _embed_model is None:
        _embed_model = SentenceTransformer(SIMILARITY_MODEL)
    return _embed_model


def _cosine_similarity(a: str, b: str) -> float:
    model = _get_embed_model()
    vecs = model.encode([a, b], normalize_embeddings=True)
    return float(vecs[0] @ vecs[1])


def run_case(graph, case: dict) -> dict:
    t0 = time.monotonic()
    result = graph.invoke(
        {
            "query": case["question"],
            "history": [],
            "jurisdiction": case.get("jurisdiction"),
            "category": case.get("category"),
            "flags": dict(DEFAULT_FLAGS),
        }
    )
    elapsed = time.monotonic() - t0

    actual_abstained = result["flags"]["abstained"]
    abstention_correct = actual_abstained == case["should_abstain"]

    actual_sources = {c["source_file"] for c in result.get("citations", [])}
    expected_sources = set(case.get("expected_source_files", []))
    # Out-of-scope cases have no expected sources -- citation correctness
    # only applies to in-scope cases, and is trivially "correct" (no
    # citations expected) if abstention behaved as expected.
    if case["should_abstain"]:
        citation_correct = actual_abstained and len(actual_sources) == 0
    else:
        citation_correct = bool(actual_sources & expected_sources)

    similarity = None
    answer_correct = None
    if not case["should_abstain"] and case.get("expected_answer"):
        similarity = _cosine_similarity(result["answer"], case["expected_answer"])
        answer_correct = similarity >= SIMILARITY_PASS_THRESHOLD
    elif case["should_abstain"]:
        # "Correct" here means it abstained, which is checked above --
        # there's no expected_answer to compare against for these.
        answer_correct = abstention_correct

    return {
        "id": case["id"],
        "question": case["question"],
        "elapsed_s": round(elapsed, 1),
        "expected_abstain": case["should_abstain"],
        "actual_abstain": actual_abstained,
        "abstention_correct": abstention_correct,
        "expected_sources": sorted(expected_sources),
        "actual_sources": sorted(actual_sources),
        "citation_correct": citation_correct,
        "similarity": round(similarity, 3) if similarity is not None else None,
        "answer_correct": answer_correct,
        "answer": result["answer"],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Run IP-SAKTI's held-out eval set")
    parser.add_argument("--case", help="Run only this case id, verbose, no file written")
    args = parser.parse_args()

    cases = json.loads(TEST_SET_PATH.read_text(encoding="utf-8"))["cases"]
    if args.case:
        cases = [c for c in cases if c["id"] == args.case]
        if not cases:
            print(f"No case with id {args.case!r}")
            sys.exit(1)

    print(f"Building graph, running {len(cases)} case(s) against the live pipeline...")
    graph = build_graph()

    results = []
    for i, case in enumerate(cases, start=1):
        print(f"  [{i}/{len(cases)}] {case['id']}: {case['question'][:70]}...")
        results.append(run_case(graph, case))

    if args.case:
        print(json.dumps(results[0], indent=2, ensure_ascii=False))
        return

    total = len(results)
    abstention_ok = sum(r["abstention_correct"] for r in results)
    citation_ok = sum(r["citation_correct"] for r in results)
    answer_ok = sum(1 for r in results if r["answer_correct"])

    in_scope = [r for r in results if not r["expected_abstain"]]
    out_of_scope = [r for r in results if r["expected_abstain"]]
    in_scope_citation_ok = sum(r["citation_correct"] for r in in_scope)
    out_of_scope_abstain_ok = sum(r["abstention_correct"] for r in out_of_scope)

    summary = {
        "total_cases": total,
        "abstention_correct": f"{abstention_ok}/{total}",
        "citation_correct_overall": f"{citation_ok}/{total}",
        "citation_correct_in_scope_only": f"{in_scope_citation_ok}/{len(in_scope)}",
        "correct_abstentions_on_out_of_scope": f"{out_of_scope_abstain_ok}/{len(out_of_scope)}",
        "answer_similarity_pass": f"{answer_ok}/{total}",
        "similarity_threshold": SIMILARITY_PASS_THRESHOLD,
    }

    print("\n" + "=" * 60)
    print("RESULTS")
    print("=" * 60)
    for key, value in summary.items():
        print(f"  {key}: {value}")
    print("=" * 60)
    print(f"\nHeadline for the PPT: {in_scope_citation_ok}/{len(in_scope)} correctly cited, "
          f"{out_of_scope_abstain_ok}/{len(out_of_scope)} correct abstentions")

    RESULTS_PATH.write_text(
        json.dumps({"summary": summary, "results": results}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"\nFull results written to {RESULTS_PATH}")


if __name__ == "__main__":
    main()

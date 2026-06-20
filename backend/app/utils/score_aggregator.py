def aggregate_scores(question_grades: list) -> dict:
    """
    Computes the final aggregated score from individual question grades.
    Only sums questions where is_counted = True.
    """
    counted = [g for g in question_grades if g.get("is_counted")]
    needs_educator_choice = any(g.get("needs_educator_choice") for g in question_grades)

    final_score = 0.0
    for g in counted:
        if g.get("educator_override") is not None:
            final_score += float(g["educator_override"])
        else:
            final_score += float(g.get("ai_score") or 0.0)

    max_possible = sum(g.get("max_score") or 0 for g in counted)

    breakdown = []
    for g in question_grades:
        score = g.get("educator_override")
        if score is None:
            score = g.get("ai_score") or 0
        
        breakdown.append({
            "question_label": g.get("question_label"),
            "score": score,
            "max": g.get("max_score"),
            "is_counted": bool(g.get("is_counted", False)),
            "confidence": g.get("confidence"),
            "needs_educator_choice": bool(g.get("needs_educator_choice", False))
        })

    low_confidence_count = sum(1 for g in question_grades if g.get("confidence") == "low")

    return {
        "finalScore": round(final_score, 1),
        "maxPossible": max_possible,
        "breakdown": breakdown,
        "needsEducatorChoice": needs_educator_choice,
        "lowConfidenceCount": low_confidence_count
    }

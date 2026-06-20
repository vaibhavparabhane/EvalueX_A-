def apply_optional_question_rules(question_grades: list, policy: str = "educator_choice") -> list:
    """
    Handles the business logic for optional questions.
    When a student attempts both Q1 and Q2 (where only one is required),
    this determines which answer to count based on the policy.
    """
    groups = {}
    ungrouped = []

    for grade in question_grades:
        g = dict(grade)
        opt_group = g.get("optional_group")
        if opt_group:
            if opt_group not in groups:
                groups[opt_group] = []
            groups[opt_group].append(g)
        else:
            g["is_counted"] = True
            ungrouped.append(g)

    result = list(ungrouped)

    for group_id, group_grades in groups.items():
        attempted = [g for g in group_grades if g.get("attempted") is not False]

        if len(attempted) <= 1:
            for g in group_grades:
                if len(attempted) == 1:
                    g["is_counted"] = (g.get("question_id") == attempted[0].get("question_id"))
                else:
                    g["is_counted"] = False
                result.append(g)
            continue

        # Multiple attempted
        if policy == "auto_higher":
            # Sort by score percentage descending
            def sort_key(x):
                mx = float(x.get("max_score") or 1.0)
                if mx == 0.0:
                    mx = 1.0
                return float(x.get("ai_score") or 0.0) / mx

            sorted_attempted = sorted(attempted, key=sort_key, reverse=True)
            winner_id = sorted_attempted[0].get("question_id")
            winner_label = sorted_attempted[0].get("question_label")

            for g in group_grades:
                is_winner = (g.get("question_id") == winner_id)
                g["is_counted"] = is_winner
                if not is_winner:
                    g["not_counted_reason"] = f"Optional: auto-selected higher score ({winner_label})"
                else:
                    g["not_counted_reason"] = None
                result.append(g)
        else:
            # educator_choice
            for g in group_grades:
                g["is_counted"] = False
                g["needs_educator_choice"] = True
                g["optional_group"] = group_id
                result.append(g)

    return result

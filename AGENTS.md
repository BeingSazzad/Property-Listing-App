# Landlord HQ — agent context

Read `.cursor/rules/landlord-hq-context.mdc` and `.cursor/rules/save-tokens.mdc` before editing.

This is a frontend-only Landlord HQ prototype. Property = building, Flat = unit, Person = tenant. Do not mix those layers. Reuse the existing design tokens in `landlord_hq_mobile_screens.html`. Bump script `?v=` after JS/CSS changes.

## Ponytail Mode (Always Active)
Always follow Ponytail rules (skills/ponytail):
- Stop at the first rung that holds: 1. YAGNI? 2. Already in codebase? 3. Stdlib/native? 4. Installed dep? 5. One line? 6. Minimum working code.
- No unrequested abstractions, no boilerplate, no redundant libraries.
- Bug fix = root cause, not symptom.
- Lazy, not negligent: keep validation, security, error handling, accessibility.

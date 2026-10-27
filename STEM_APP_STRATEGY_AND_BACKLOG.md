# STEM Adventure App Strategy and Backlog (Grades 3–6)

## 1) Benchmark of strong existing apps

| App | What it does well | Key weakness to address |
|---|---|---|
| Khan Academy Kids / Khan Academy | Structured curriculum and high content depth | Less game-loop motivation for older elementary learners |
| Prodigy Math | Highly engaging RPG-style motivation | Can become grindy; conceptual depth can feel shallow; paywall friction |
| Tynker / Code.org / Scratch | Strong coding creativity and project expression | Onboarding can be overwhelming without guided progression |
| BrainPOP / Mystery Science | Clear explanations and strong lesson media | Lower hands-on interactivity in every lesson |
| Duolingo Math / DragonBox | Excellent bite-sized practice and quick feedback | Narrow STEM breadth and limited project-based work |

## 2) Common weaknesses to beat

1. Engagement drops after novelty wears off.
2. Drill-heavy flow with insufficient real problem-solving.
3. Weak personalization for mixed skill levels.
4. Limited visibility for parent/teacher intervention.
5. Fragmented math/science/coding experiences across multiple tools.
6. UX/accessibility friction for younger learners (text-heavy, cluttered screens).

## 3) Product direction

Build a mission-based STEM adventure app with:
- Unified STEM journeys (math + science + coding in one narrative).
- Adaptive difficulty based on mastery trends, not only correctness.
- Hands-on mini-projects (sim labs, logic puzzles, simple coding builds).
- Scaffolded feedback and hints (supportive, non-spoiler guidance).
- Safe social motivation (team quests/class goals without toxic ranking).
- Parent/teacher dashboard (mastery, struggle points, next-step recommendations).

## 4) MVP scope

- 3 worlds: **Math Quest**, **Science Lab**, **Code Builder**.
- 20–30 missions, each 10–15 minutes.
- Skills map + spaced review mastery model.
- Reward loop: badges, unlockables, streaks tied to learning quality.
- Weekly dashboard with concept heatmap and intervention suggestions.

## 5) Success metrics

- Weekly active learners (WAU).
- 4-week retention.
- Mission completion quality (including reattempt quality).
- Mastery growth by concept.
- Parent/teacher satisfaction and intervention effectiveness.
- Healthy time-on-task (no major drop-off spikes).

---

## 6) Concrete feature backlog for this React + Tauri architecture

### A. Data model and persistence (Rust + SQLite)
1. Add `learning_worlds`, `missions`, `mission_steps`, `skills`, `mission_skill_map`.
2. Add learner progression tables: `learner_skill_mastery`, `mission_attempts`, `step_attempts`, `spaced_review_queue`.
3. Add motivation/safety tables: `badges`, `learner_badges`, `team_quests`, `team_quest_progress`.
4. Add educator insights tables: `learning_sessions`, `intervention_recommendations`.
5. Keep soft-delete and timestamp conventions aligned with existing schema.

### B. Backend services and Tauri commands
1. `services/worlds.rs`: world and mission catalog listing.
2. `services/learning.rs`: attempt submission, scoring, mastery updates, hint logic.
3. `services/review.rs`: spaced-review queue generation and scheduling.
4. `services/rewards.rs`: badge/streak evaluation.
5. `services/dashboard.rs`: learner + parent/teacher summaries and heatmaps.
6. Expose each service via thin `commands/*` wrappers and register in `lib.rs`.

### C. Frontend domain layers
1. Add domain types in `src/types/index.ts` (mirror Rust models).
2. Add `src/api/index.ts` invoke wrappers for worlds, attempts, review, rewards, dashboard.
3. Add hooks:
   - `useLearningWorlds.ts`
   - `useMissions.ts`
   - `useMissionAttempts.ts`
   - `useMastery.ts`
   - `useDashboard.ts`
4. Define explicit query keys and invalidation rules for each domain.

### D. UI and learning experience
1. **World Select** page (Math Quest / Science Lab / Code Builder cards).
2. **Mission Player** (step-by-step flow with immediate scaffolded feedback).
3. **Hint Panel** with progressive hints.
4. **Progress & Rewards** panel (streaks, unlockables, badges).
5. **Parent/Teacher Dashboard** with mastery heatmap and “next best mission” suggestions.
6. Keep UX simple and low-text with large touch targets and clear visual hierarchy.

### E. Telemetry and analytics foundation
1. Local event logging for mission start/complete, hint use, retry events.
2. Metric aggregator queries for WAU, retention proxy, completion quality, mastery growth.
3. Dashboard-level metric cards aligned to success criteria.

### F. Testing and quality
1. Rust service tests for mastery updates, spaced review, and reward rules.
2. Frontend tests for mission flow, hint behavior, and dashboard rendering.
3. Typecheck/lint/tests integrated with existing scripts.

---

## 7) Phased release plan

### Phase 1 — Core playable learning loop
- Deliver world selection, mission player, step attempts, and immediate feedback.
- Track completion and retries.
- Enable Math Quest with starter missions.

### Phase 2 — Personalization and retention
- Add mastery model and adaptive difficulty.
- Enable spaced review queue and streak/badge loop.
- Expand into Science Lab and Code Builder starter missions.

### Phase 3 — Parent/teacher visibility
- Ship dashboard with concept heatmap and intervention suggestions.
- Add class/team quest basics with safe social mechanics.
- Improve accessibility polish from observed usage patterns.

### Phase 4 — Content scale and optimization
- Increase mission catalog depth to target 20–30 missions.
- Tune pacing, hints, and difficulty based on metrics.
- Improve retention and mastery outcomes against success targets.

---

## 8) Definition of done for initial implementation milestone

- Learner can complete at least one mission in each world.
- System records attempts and updates mastery state.
- Spaced review queue is generated and surfaced.
- Parent/teacher dashboard shows usable concept-level insight.
- Baseline success metrics can be calculated from collected data.

# Incident Response Simulator

Peterson's module. The player works through an incident one decision at a time and gets feedback after each choice. At the end they see their score and a review of their decisions, and the score saves to the dashboard.

## Files

- `types.ts`: what a scenario, step and choice look like
- `engine.ts`: the game rules (start, choose, scoring) and `validateScenario`, which checks scenario data for mistakes
- `scenarios/`: one file per scenario, listed in `scenarios/index.ts`
- `IncidentResponse.tsx` and `components/`: the screens
- `IncidentResponse.css`: styles (all classes start with `ir-`)

## Adding a scenario

1. Copy `scenarios/usbDrop.ts` and rename it.
2. Give it a new `id`, a title, a one-line summary and a briefing.
3. Write the steps. Each choice has `next` (the id of the next step, or `null` to end) and points: 10 for the best answer, 2 to 4 for partly right, 0 for a bad call. Only one choice per step should get 10.
4. A wrong answer can go to a short "consequence" step that shows what happened, then rejoin the main path. Keep those at 0 or 1 points. We set them too high at first and a wrong first answer still scored 96%.
5. Add it to `scenarios/index.ts` and run `npm test`. The tests catch typos in step ids, steps you can't reach, loops, and scoring problems.

Content comes from the Security+ exam objectives in our own words. Use the made-up company (Harbor Point Supply), example.com-style domains, and IPs from the example ranges (192.0.2.x, 198.51.100.x, 203.0.113.x).

## Still to do

- Ransomware and data transfer scenarios
- Timer

import { bestPath, choose, maxScore, startScenario, bestChoice, validateScenario } from '../engine'
import { SCENARIOS } from './index'

// Runs the same checks on every scenario in the list, including new ones.
describe.each(SCENARIOS.map((s) => [s.title, s] as const))('scenario: %s', (_title, scenario) => {
  it('has no structural problems', () => {
    expect(validateScenario(scenario)).toEqual([])
  })

  it('gives every step at least two choices', () => {
    for (const step of scenario.steps) {
      expect(step.choices.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('has exactly one best choice (10 points) on every main step', () => {
    for (const step of bestPath(scenario)) {
      expect(step.choices.filter((c) => c.points === 10)).toHaveLength(1)
    }
  })

  it('reaches the maximum score by always picking the best choice', () => {
    let state = startScenario(scenario)
    for (const step of bestPath(scenario)) state = choose(scenario, state, bestChoice(step).id)
    expect(state.currentStepId).toBeNull()
    expect(state.score).toBe(maxScore(scenario))
  })

  it('uses unique scenario ids', () => {
    expect(SCENARIOS.filter((s) => s.id === scenario.id)).toHaveLength(1)
  })
})

import {
  bestChoice,
  bestPath,
  choose,
  getCurrentStep,
  isFinished,
  maxScore,
  startScenario,
  validateScenario,
} from './engine'
import type { Scenario } from './types'

// Small made-up scenario just for testing the engine.
const sample: Scenario = {
  id: 'sample',
  title: 'Sample',
  summary: 'Test scenario',
  briefing: 'Test briefing',
  start: 'one',
  steps: [
    {
      id: 'one',
      phase: 'Detection',
      prompt: 'First decision',
      choices: [
        { id: 'good', label: 'Good', next: 'two', points: 10, feedback: 'Good' },
        { id: 'bad', label: 'Bad', next: 'detour', points: 0, feedback: 'Bad' },
      ],
    },
    {
      id: 'detour',
      phase: 'Detection',
      prompt: 'Consequence of the bad choice',
      choices: [{ id: 'recover', label: 'Recover', next: 'two', points: 3, feedback: 'Late' }],
    },
    {
      id: 'two',
      phase: 'Containment',
      prompt: 'Last decision',
      choices: [
        { id: 'best', label: 'Best', next: null, points: 10, feedback: 'Best' },
        { id: 'weak', label: 'Weak', next: null, points: 4, feedback: 'Weak' },
      ],
    },
  ],
}

describe('incident response engine', () => {
  it('starts on the first step with no points', () => {
    const state = startScenario(sample)
    expect(state).toEqual({ scenarioId: 'sample', currentStepId: 'one', score: 0, decisions: [] })
    expect(getCurrentStep(sample, state)?.prompt).toBe('First decision')
    expect(isFinished(state)).toBe(false)
  })

  it('moves to the next step and adds points', () => {
    const state = choose(sample, startScenario(sample), 'good')
    expect(state.currentStepId).toBe('two')
    expect(state.score).toBe(10)
    expect(state.decisions).toEqual([{ stepId: 'one', choiceId: 'good', points: 10 }])
  })

  it('does not change the old state', () => {
    const start = startScenario(sample)
    choose(sample, start, 'good')
    expect(start.score).toBe(0)
    expect(start.currentStepId).toBe('one')
  })

  it('follows a branch and finishes', () => {
    let state = startScenario(sample)
    state = choose(sample, state, 'bad')
    expect(state.currentStepId).toBe('detour')
    state = choose(sample, state, 'recover')
    state = choose(sample, state, 'weak')
    expect(isFinished(state)).toBe(true)
    expect(getCurrentStep(sample, state)).toBeNull()
    expect(state.score).toBe(7)
    expect(state.decisions).toHaveLength(3)
  })

  it('rejects a choice that is not on the current step', () => {
    expect(() => choose(sample, startScenario(sample), 'best')).toThrow()
  })

  it('rejects choices after the scenario is finished', () => {
    let state = startScenario(sample)
    state = choose(sample, state, 'good')
    state = choose(sample, state, 'best')
    expect(() => choose(sample, state, 'best')).toThrow('already finished')
  })

  it('calculates the highest possible score', () => {
    expect(maxScore(sample)).toBe(20)
  })

  it('finds the best choice and the best path', () => {
    expect(bestChoice(sample.steps[2]).id).toBe('best')
    expect(bestPath(sample).map((s) => s.id)).toEqual(['one', 'two'])
  })

  it('accepts a valid scenario', () => {
    expect(validateScenario(sample)).toEqual([])
  })

  it('reports a choice that leads to a missing step', () => {
    const broken: Scenario = {
      ...sample,
      steps: sample.steps.map((s) =>
        s.id === 'two' ? { ...s, choices: [{ ...s.choices[0], next: 'typo' }] } : s,
      ),
    }
    expect(validateScenario(broken)).toContain('Choice "best" on step "two" leads to missing step "typo"')
  })

  it('reports a missing start step', () => {
    expect(validateScenario({ ...sample, start: 'nope' })).toContain('Start step "nope" does not exist')
  })

  it('reports a step that can never be reached', () => {
    const orphan: Scenario = {
      ...sample,
      steps: [...sample.steps, { ...sample.steps[2], id: 'orphan' }],
    }
    expect(validateScenario(orphan)).toContain('Step "orphan" can never be reached')
  })

  it('reports a scenario that loops forever', () => {
    const loop: Scenario = {
      ...sample,
      steps: sample.steps.map((s) =>
        s.id === 'two' ? { ...s, choices: [{ ...s.choices[0], next: 'one' }] } : s,
      ),
    }
    expect(validateScenario(loop).some((p) => p.includes('loops back'))).toBe(true)
  })
})

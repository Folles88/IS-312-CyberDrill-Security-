// Game rules for the Incident Response Simulator.
// These functions never change the state they're given. They return a new one,
// which keeps React updates simple and makes everything easy to test.
import type { Choice, PlayState, Scenario, Step } from './types'

export function getStep(scenario: Scenario, stepId: string): Step {
  const step = scenario.steps.find((s) => s.id === stepId)
  if (!step) throw new Error(`Scenario "${scenario.id}" has no step "${stepId}"`)
  return step
}

export function startScenario(scenario: Scenario): PlayState {
  getStep(scenario, scenario.start) // throws if the start step is missing
  return { scenarioId: scenario.id, currentStepId: scenario.start, score: 0, decisions: [] }
}

export function isFinished(state: PlayState): boolean {
  return state.currentStepId === null
}

export function getCurrentStep(scenario: Scenario, state: PlayState): Step | null {
  return state.currentStepId === null ? null : getStep(scenario, state.currentStepId)
}

// Applies the player's choice and returns the updated state.
export function choose(scenario: Scenario, state: PlayState, choiceId: string): PlayState {
  const step = getCurrentStep(scenario, state)
  if (!step) throw new Error('The scenario is already finished')
  const choice = step.choices.find((c) => c.id === choiceId)
  if (!choice) throw new Error(`Step "${step.id}" has no choice "${choiceId}"`)
  return {
    ...state,
    currentStepId: choice.next,
    score: state.score + choice.points,
    decisions: [...state.decisions, { stepId: step.id, choiceId: choice.id, points: choice.points }],
  }
}

export function bestChoice(step: Step): Choice {
  return step.choices.reduce((best, c) => (c.points > best.points ? c : best))
}

// Highest possible score, following the best route through the branches.
// Used as the "out of" number on the results screen.
export function maxScore(scenario: Scenario): number {
  const memo = new Map<string, number>()
  const visiting = new Set<string>()

  const bestFrom = (stepId: string): number => {
    const known = memo.get(stepId)
    if (known !== undefined) return known
    if (visiting.has(stepId)) throw new Error(`Scenario "${scenario.id}" loops back to step "${stepId}"`)
    visiting.add(stepId)
    const step = getStep(scenario, stepId)
    const best = Math.max(...step.choices.map((c) => c.points + (c.next === null ? 0 : bestFrom(c.next))))
    visiting.delete(stepId)
    memo.set(stepId, best)
    return best
  }

  return bestFrom(scenario.start)
}

// The steps you go through if you always pick the best answer.
export function bestPath(scenario: Scenario): Step[] {
  const path: Step[] = []
  let stepId: string | null = scenario.start
  while (stepId !== null && path.length <= scenario.steps.length) {
    const step = getStep(scenario, stepId)
    path.push(step)
    stepId = bestChoice(step).next
  }
  return path
}

// Checks a scenario for mistakes like a typo in a step id. Returns a list of problems.
// The tests run this on every scenario so broken content gets caught early.
export function validateScenario(scenario: Scenario): string[] {
  const problems: string[] = []
  const ids = new Set<string>()

  for (const step of scenario.steps) {
    if (ids.has(step.id)) problems.push(`Duplicate step id "${step.id}"`)
    ids.add(step.id)
    if (step.choices.length === 0) problems.push(`Step "${step.id}" has no choices`)
    const choiceIds = new Set<string>()
    for (const choice of step.choices) {
      if (choiceIds.has(choice.id)) problems.push(`Step "${step.id}" repeats choice id "${choice.id}"`)
      choiceIds.add(choice.id)
      if (choice.next !== null && !scenario.steps.some((s) => s.id === choice.next)) {
        problems.push(`Choice "${choice.id}" on step "${step.id}" leads to missing step "${choice.next}"`)
      }
      if (choice.points < 0) problems.push(`Choice "${choice.id}" on step "${step.id}" has negative points`)
      if (!choice.feedback.trim()) problems.push(`Choice "${choice.id}" on step "${step.id}" has no feedback`)
    }
  }

  if (!ids.has(scenario.start)) {
    problems.push(`Start step "${scenario.start}" does not exist`)
    return problems
  }
  if (problems.length > 0) return problems

  // Make sure every step can actually be reached from the start.
  const reached = new Set<string>()
  const queue = [scenario.start]
  while (queue.length > 0) {
    const id = queue.shift()!
    if (reached.has(id)) continue
    reached.add(id)
    for (const c of getStep(scenario, id).choices) if (c.next !== null) queue.push(c.next)
  }
  for (const id of ids) if (!reached.has(id)) problems.push(`Step "${id}" can never be reached`)

  // maxScore throws if the scenario loops forever.
  try {
    maxScore(scenario)
  } catch (error) {
    problems.push((error as Error).message)
  }

  return problems
}

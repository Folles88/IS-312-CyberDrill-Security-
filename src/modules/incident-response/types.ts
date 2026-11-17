// Data types for the Incident Response Simulator.
// A scenario is just data (steps and choices), so new scenarios don't need new code.

// Incident response steps from the Security+ objectives.
export type IrPhase =
  | 'Preparation'
  | 'Detection'
  | 'Analysis'
  | 'Containment'
  | 'Eradication'
  | 'Recovery'
  | 'Lessons learned'

export interface Choice {
  id: string
  label: string
  next: string | null // id of the next step, or null if this choice ends the scenario
  points: number // 10 = best, 2-4 = partly right, 0 = bad call
  feedback: string
}

export interface Step {
  id: string
  phase: IrPhase
  prompt: string
  evidence?: string[] // log lines or email details shown in a box
  choices: Choice[]
}

export interface Scenario {
  id: string
  title: string
  summary: string
  briefing: string
  start: string // id of the first step
  steps: Step[]
}

export interface Decision {
  stepId: string
  choiceId: string
  points: number
}

export interface PlayState {
  scenarioId: string
  currentStepId: string | null // null once the scenario is over
  score: number
  decisions: Decision[]
}

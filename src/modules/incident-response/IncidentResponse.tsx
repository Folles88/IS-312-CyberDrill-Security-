// Incident Response Simulator (Peterson)
// Flow: scenario list -> briefing -> one decision per step -> results.
// Rules are in engine.ts and the scenario text is in scenarios/. This file just picks the screen.
import { useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { saveScore } from '../../shared/scoring'
import { choose, getCurrentStep, getStep, isFinished, maxScore, startScenario } from './engine'
import { SCENARIOS } from './scenarios'
import type { Choice, PlayState, Scenario } from './types'
import ScenarioList from './components/ScenarioList'
import Briefing from './components/Briefing'
import StepView from './components/StepView'
import Results from './components/Results'
import './IncidentResponse.css'

// The answer the player just picked. We show feedback for it until they hit Next.
interface Pending {
  stepId: string
  choice: Choice
}

export default function IncidentResponse() {
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [play, setPlay] = useState<PlayState | null>(null)
  const [pending, setPending] = useState<Pending | null>(null)
  const [showResults, setShowResults] = useState(false)

  const openScenario = (next: Scenario) => {
    setScenario(next)
    setPlay(null)
    setPending(null)
    setShowResults(false)
  }

  const backToList = () => {
    setScenario(null)
    setPlay(null)
    setPending(null)
    setShowResults(false)
  }

  const begin = () => {
    if (!scenario) return
    setPlay(startScenario(scenario))
    setPending(null)
    setShowResults(false)
  }

  const pick = (choice: Choice) => {
    if (!scenario || !play || pending) return
    const stepId = play.currentStepId!
    const next = choose(scenario, play, choice.id)
    setPlay(next)
    setPending({ stepId, choice })
    // Save right away on the last choice so the score counts even if they leave before results.
    if (isFinished(next)) saveScore('incident-response', next.score, maxScore(scenario))
  }

  const continueOn = () => {
    setPending(null)
    if (play && isFinished(play)) setShowResults(true)
  }

  let screen
  if (!scenario) {
    screen = <ScenarioList scenarios={SCENARIOS} onSelect={openScenario} />
  } else if (!play) {
    screen = <Briefing scenario={scenario} onBegin={begin} onBack={backToList} />
  } else if (showResults) {
    screen = <Results scenario={scenario} play={play} onReplay={begin} onBack={backToList} />
  } else {
    // Keep showing the step they just answered while the feedback is up.
    const step = pending ? getStep(scenario, pending.stepId) : getCurrentStep(scenario, play)!
    screen = (
      <StepView
        scenario={scenario}
        step={step}
        stepNumber={play.decisions.length + (pending ? 0 : 1)}
        score={play.score}
        picked={pending?.choice ?? null}
        isLast={isFinished(play)}
        onPick={pick}
        onContinue={continueOn}
        onQuit={backToList}
      />
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <section className="page ir">{screen}</section>
    </MotionConfig>
  )
}

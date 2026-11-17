import { motion } from 'framer-motion'
import { bestChoice, getStep, maxScore } from '../engine'
import type { PlayState, Scenario } from '../types'
import { rating } from './rating'

interface Props {
  scenario: Scenario
  play: PlayState
  onReplay: () => void
  onBack: () => void
}

// Final score plus a list of every decision and the best answer for the ones they missed.
export default function Results({ scenario, play, onReplay, onBack }: Props) {
  const max = maxScore(scenario)
  const percent = Math.round((play.score / max) * 100)

  return (
    <>
      <p className="ir-eyebrow">Scenario complete</p>
      <h1>{scenario.title}</h1>

      <motion.div
        className="ir-score"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="ir-score-number">
          {play.score} / {max}
        </p>
        <p className="ir-score-percent">{percent}%</p>
        <p>{rating(percent)}</p>
      </motion.div>

      <h2>Your decisions</h2>
      <ol className="ir-review">
        {play.decisions.map((d) => {
          const step = getStep(scenario, d.stepId)
          const chosen = step.choices.find((c) => c.id === d.choiceId)!
          const best = bestChoice(step)
          const wasBest = chosen.points === best.points
          return (
            <li key={d.stepId} className={wasBest ? 'is-correct' : 'is-wrong'}>
              <span className="ir-phase">{step.phase}</span>
              <p>
                <strong>{wasBest ? 'Best choice: ' : 'You chose: '}</strong>
                {chosen.label} <span className="ir-points">(+{d.points})</span>
              </p>
              {!wasBest && (
                <p>
                  <strong>Best response:</strong> {best.label}
                </p>
              )}
            </li>
          )
        })}
      </ol>

      <div className="ir-actions">
        <button type="button" className="ir-button" onClick={onReplay}>
          Play again
        </button>
        <button type="button" className="ir-button ir-button--quiet" onClick={onBack}>
          Choose another scenario
        </button>
      </div>
    </>
  )
}

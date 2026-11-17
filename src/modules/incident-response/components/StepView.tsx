import { motion } from 'framer-motion'
import { bestChoice } from '../engine'
import type { Choice, Scenario, Step } from '../types'

interface Props {
  scenario: Scenario
  step: Step
  stepNumber: number
  score: number
  picked: Choice | null // null while they're still deciding
  isLast: boolean // true if the picked choice ended the scenario
  onPick: (choice: Choice) => void
  onContinue: () => void
  onQuit: () => void
}

const LETTERS = ['A', 'B', 'C', 'D', 'E']

// One decision: the prompt, any evidence, the choices, then feedback once they pick.
export default function StepView({ scenario, step, stepNumber, score, picked, isLast, onPick, onContinue, onQuit }: Props) {
  const best = bestChoice(step)
  const pickedBest = picked !== null && picked.points === best.points

  return (
    <>
      <div className="ir-status">
        <span className="ir-phase">{step.phase}</span>
        <span>Decision {stepNumber}</span>
        <span>Score: {score}</span>
      </div>

      <p className="ir-eyebrow">{scenario.title}</p>
      <h1 className="ir-prompt">{step.prompt}</h1>

      {step.evidence && (
        <div className="ir-evidence" aria-label="Evidence">
          {step.evidence.map((line) => (
            <code key={line}>{line}</code>
          ))}
        </div>
      )}

      <ul className="ir-choices">
        {step.choices.map((choice, i) => {
          const state =
            picked === null ? '' : choice.id === picked.id ? (pickedBest ? ' is-correct' : ' is-wrong') : choice.id === best.id ? ' is-best' : ' is-dimmed'
          return (
            <li key={choice.id}>
              <button
                type="button"
                className={`ir-choice${state}`}
                onClick={() => onPick(choice)}
                disabled={picked !== null}
              >
                <span className="ir-letter" aria-hidden="true">
                  {LETTERS.at(i)}
                </span>
                <span>{choice.label}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <div aria-live="polite">
        {picked && (
          <motion.div
            key={`${step.id}-${picked.id}`}
            className={`ir-feedback ${pickedBest ? 'is-correct' : 'is-wrong'}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="ir-feedback-title">
              {pickedBest ? 'Best choice' : 'Not the best choice'}{' '}
              <span className="ir-points">+{picked.points} points</span>
            </p>
            <p>{picked.feedback}</p>
            {!pickedBest && (
              <p className="ir-best">
                <strong>Best response:</strong> {best.label}
              </p>
            )}
            <button type="button" className="ir-button" onClick={onContinue} autoFocus>
              {isLast ? 'See results' : 'Next decision'}
            </button>
          </motion.div>
        )}
      </div>

      {!picked && (
        <button type="button" className="ir-button ir-button--quiet ir-quit" onClick={onQuit}>
          Quit scenario
        </button>
      )}
    </>
  )
}

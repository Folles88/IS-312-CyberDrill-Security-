import type { Scenario } from '../types'

interface Props {
  scenario: Scenario
  onBegin: () => void
  onBack: () => void
}

// Intro text shown before the first decision.
export default function Briefing({ scenario, onBegin, onBack }: Props) {
  return (
    <>
      <p className="ir-eyebrow">Briefing</p>
      <h1>{scenario.title}</h1>
      <p className="ir-briefing">{scenario.briefing}</p>
      <div className="ir-actions">
        <button type="button" className="ir-button" onClick={onBegin}>
          Begin
        </button>
        <button type="button" className="ir-button ir-button--quiet" onClick={onBack}>
          Back to scenarios
        </button>
      </div>
    </>
  )
}

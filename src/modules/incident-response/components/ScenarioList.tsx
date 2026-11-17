import { bestPath, maxScore } from '../engine'
import type { Scenario } from '../types'

interface Props {
  scenarios: Scenario[]
  onSelect: (scenario: Scenario) => void
}

export default function ScenarioList({ scenarios, onSelect }: Props) {
  return (
    <>
      <h1>Incident Response Simulator</h1>
      <p className="lead">
        You're the security analyst. Work an incident from the first report to the lessons learned, and pick
        what you would do at each step.
      </p>
      <ul className="ir-scenarios">
        {scenarios.map((s) => (
          <li key={s.id} className="ir-card">
            <h2>{s.title}</h2>
            <p>{s.summary}</p>
            <p className="ir-meta">
              {bestPath(s).length} decisions · up to {maxScore(s)} points
            </p>
            <button type="button" className="ir-button" onClick={() => onSelect(s)} aria-label={`Start ${s.title}`}>
              Start
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

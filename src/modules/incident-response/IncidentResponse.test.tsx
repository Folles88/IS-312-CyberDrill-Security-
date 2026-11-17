import { fireEvent, render, screen } from '@testing-library/react'
import IncidentResponse from './IncidentResponse'
import { clearScores, getScores } from '../../shared/scoring'
import { rating } from './components/rating'

const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }))

describe('Incident Response Simulator screen', () => {
  beforeEach(() => clearScores())

  it('lists the scenarios', () => {
    render(<IncidentResponse />)
    expect(screen.getByRole('heading', { level: 1, name: 'Incident Response Simulator' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start Warm-up: The Found USB Drive' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start Phishing Account Takeover' })).toBeInTheDocument()
  })

  it('plays the warm-up with the best choices and saves a perfect score', () => {
    render(<IncidentResponse />)
    click('Start Warm-up: The Found USB Drive')
    expect(screen.getByText(/Harbor Point Supply/)).toBeInTheDocument()
    click('Begin')

    click(/Keep it sealed/)
    expect(screen.getByText('Best choice')).toBeInTheDocument()
    click('Next decision')

    expect(screen.getByLabelText('Evidence')).toHaveTextContent('Salary_Review.pdf.exe')
    click(/It is malicious/)
    click('Next decision')

    click(/Record the incident/)
    click('See results')

    expect(screen.getByText('30 / 30')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(getScores()).toEqual([
      expect.objectContaining({ moduleId: 'incident-response', score: 30, maxScore: 30 }),
    ])
  })

  it('explains a wrong choice and shows the best response', () => {
    render(<IncidentResponse />)
    click('Start Warm-up: The Found USB Drive')
    click('Begin')
    click(/Plug it into your work computer/)

    expect(screen.getByText('Not the best choice')).toBeInTheDocument()
    expect(screen.getByText(/baiting attack/)).toBeInTheDocument()
    expect(screen.getByText('Best response:')).toBeInTheDocument()
    // Choices are locked once one is picked.
    expect(screen.getByRole('button', { name: /Hand it in/ })).toBeDisabled()
  })

  it('lets the player quit back to the scenario list', () => {
    render(<IncidentResponse />)
    click('Start Phishing Account Takeover')
    click('Begin')
    click('Quit scenario')
    expect(screen.getByRole('heading', { level: 1, name: 'Incident Response Simulator' })).toBeInTheDocument()
    expect(getScores()).toEqual([])
  })

  it('gives a verdict for each score range', () => {
    expect(rating(100)).toMatch(/Perfect/)
    expect(rating(90)).toMatch(/Strong/)
    expect(rating(70)).toMatch(/Getting there/)
    expect(rating(20)).toMatch(/Keep practicing/)
  })
})

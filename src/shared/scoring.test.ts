import {
  clearScores,
  getAttempts,
  getBestPercent,
  getModuleStats,
  getScores,
  saveScore,
  toPercent,
} from './scoring'

describe('scoring', () => {
  beforeEach(() => {
    clearScores()
    jest.useRealTimers()
  })

  it('starts with no scores', () => {
    expect(getScores()).toEqual([])
    expect(getBestPercent('log-analysis')).toBeNull()
    expect(getModuleStats('log-analysis')).toBeNull()
    expect(getAttempts('log-analysis')).toEqual([])
  })

  it('saves and returns a score', () => {
    saveScore('log-analysis', 8, 10)
    const scores = getScores()
    expect(scores).toHaveLength(1)
    expect(scores[0]).toMatchObject({ moduleId: 'log-analysis', score: 8, maxScore: 10 })
  })

  it('reports the best percentage for a module', () => {
    saveScore('port-protocol', 5, 10)
    saveScore('port-protocol', 9, 10)
    saveScore('link-analyzer', 1, 4)
    expect(getBestPercent('port-protocol')).toBe(90)
    expect(getBestPercent('link-analyzer')).toBe(25)
  })

  it('rejects impossible scores', () => {
    expect(() => saveScore('incident-response', 11, 10)).toThrow()
    expect(() => saveScore('incident-response', -1, 10)).toThrow()
    expect(() => saveScore('incident-response', 0, 0)).toThrow()
    expect(() => saveScore('incident-response', Number.NaN, 10)).toThrow()
  })

  it('rounds percentages to whole numbers', () => {
    expect(toPercent({ moduleId: 'log-analysis', score: 2, maxScore: 3, completedAt: '' })).toBe(67)
  })

  it('lists attempts for one module, newest first', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-11-01T10:00:00Z'))
    saveScore('incident-response', 30, 70)
    jest.setSystemTime(new Date('2026-11-02T10:00:00Z'))
    saveScore('port-protocol', 10, 10)
    jest.setSystemTime(new Date('2026-11-03T10:00:00Z'))
    saveScore('incident-response', 63, 70)

    const attempts = getAttempts('incident-response')
    expect(attempts).toHaveLength(2)
    expect(attempts[0].score).toBe(63)
    expect(attempts[1].score).toBe(30)
  })

  it('summarizes a module for the dashboard', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-11-01T10:00:00Z'))
    saveScore('link-analyzer', 9, 10)
    jest.setSystemTime(new Date('2026-11-05T10:00:00Z'))
    saveScore('link-analyzer', 6, 10)

    expect(getModuleStats('link-analyzer')).toEqual({
      attempts: 2,
      bestPercent: 90,
      latestPercent: 60,
      latestAt: '2026-11-05T10:00:00.000Z',
    })
  })

  it('keeps working when saved data is corrupted', () => {
    localStorage.setItem('cyberdrill-scores', 'not valid json')
    expect(getScores()).toEqual([])
  })
})
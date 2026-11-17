// Shared scoring for every module. Each module calls saveScore() when the player finishes.
// The dashboard reads scores back with getModuleStats() and getAttempts().
// Other modules depend on these names, so check with Peterson before renaming anything.

export type ModuleId = 'incident-response' | 'port-protocol' | 'log-analysis' | 'link-analyzer'

export interface ScoreRecord {
  moduleId: ModuleId
  score: number
  maxScore: number
  completedAt: string // ISO date
}

const STORAGE_KEY = 'cyberdrill-scores'

// Gets every saved attempt. Returns an empty list if nothing is saved yet.
export function getScores(): ScoreRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ScoreRecord[]) : []
  } catch {
    // Bad data or storage turned off (private browsing).
    return []
  }
}

// Saves a finished attempt, e.g. saveScore('log-analysis', 8, 10).
export function saveScore(moduleId: ModuleId, score: number, maxScore: number): ScoreRecord {
  if (!Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore <= 0 || score < 0 || score > maxScore) {
    throw new Error('score must be between 0 and maxScore, and maxScore must be above 0')
  }
  const record: ScoreRecord = { moduleId, score, maxScore, completedAt: new Date().toISOString() }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...getScores(), record]))
  } catch {
    // If storage is blocked the score just doesn't save. The app still works.
  }
  return record
}

export function toPercent(record: ScoreRecord): number {
  return Math.round((record.score / record.maxScore) * 100)
}

// Attempts for one module, newest first.
export function getAttempts(moduleId: ModuleId): ScoreRecord[] {
  return getScores()
    .filter((r) => r.moduleId === moduleId)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
}

// Best score as a percent, or null if the module hasn't been played.
export function getBestPercent(moduleId: ModuleId): number | null {
  const attempts = getAttempts(moduleId)
  if (attempts.length === 0) return null
  return Math.max(...attempts.map(toPercent))
}

export interface ModuleStats {
  attempts: number
  bestPercent: number
  latestPercent: number
  latestAt: string
}

// Everything the dashboard needs for one module card.
export function getModuleStats(moduleId: ModuleId): ModuleStats | null {
  const attempts = getAttempts(moduleId)
  if (attempts.length === 0) return null
  const latest = attempts[0]
  return {
    attempts: attempts.length,
    bestPercent: Math.max(...attempts.map(toPercent)),
    latestPercent: toPercent(latest),
    latestAt: latest.completedAt,
  }
}

export function clearScores(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to clear.
  }
}
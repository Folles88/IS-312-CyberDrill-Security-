// Message under the final score.
export function rating(percent: number): string {
  if (percent >= 100) return 'Perfect score. You made the best call every time.'
  if (percent >= 85) return 'Strong response. One or two calls could have been better.'
  if (percent >= 60) return 'Getting there. Check the decisions below and try again.'
  return 'Keep practicing. Look over the best answers below, then replay it.'
}

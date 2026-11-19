
export function checkMatch(
  selectedPort: number,
  correctPort: number
): boolean {
  return selectedPort === correctPort;
}

// Checks whether the user has used all three attempts.
export function hasReachedAttemptLimit(
  incorrectAttempts: number
): boolean {
  return incorrectAttempts >= 3;
}

// Calculates the percentage of correct answers.
export function calculateScore(
  correctAnswers: number,
  totalQuestions: number
): number {
  if (totalQuestions === 0) return 0;

  return Math.round(
    (correctAnswers / totalQuestions) * 100
  );
}

// Calculates accuracy based on all attempts.
export function calculateAccuracy(
  correctAnswers: number,
  totalAttempts: number
): number {
  if (totalAttempts === 0) return 0;

  return Math.round(
    (correctAnswers / totalAttempts) * 100
  );
}


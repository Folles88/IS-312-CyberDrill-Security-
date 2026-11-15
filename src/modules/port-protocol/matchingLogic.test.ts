
import { describe, test, expect } from "@jest/globals";
import {
  checkMatch,
  hasReachedAttemptLimit,
  calculateScore,
  calculateAccuracy,
} from "./matchingLogic";

// Tests the port and protocol matching logic.
describe("Port and Protocol Matching", () => {

  // A matching port should return true.
  test("returns true for a correct port", () => {
    expect(checkMatch(22, 22)).toBe(true);
  });

  // An incorrect port should return false.
  test("returns false for an incorrect port", () => {
    expect(checkMatch(22, 23)).toBe(false);
  });

  // Two different ports should not match.
  test("does not match HTTP with HTTPS", () => {
    expect(checkMatch(80, 443)).toBe(false);
  });

});

// Tests the three-attempt limit.
describe("Three Attempt Limit", () => {

  // One incorrect attempt should allow another try.
  test("allows another try after one mistake", () => {
    expect(hasReachedAttemptLimit(1)).toBe(false);
  });

  // Two incorrect attempts should still allow another try.
  test("allows another try after two mistakes", () => {
    expect(hasReachedAttemptLimit(2)).toBe(false);
  });

  // Three incorrect attempts should end the question.
  test("ends the question after three mistakes", () => {
    expect(hasReachedAttemptLimit(3)).toBe(true);
  });

});

// Tests the final assessment score.
describe("Assessment Scoring", () => {

  // All correct answers should give a perfect score.
  test("returns 100% for all correct answers", () => {
    expect(calculateScore(10, 10)).toBe(100);
  });

  // Eight correct answers should give an 80% score.
  test("returns 80% for eight correct answers", () => {
    expect(calculateScore(8, 10)).toBe(80);
  });

  // No correct answers should give a zero score.
  test("returns 0% for no correct answers", () => {
    expect(calculateScore(0, 10)).toBe(0);
  });

  // Prevents errors when there are no questions.
  test("handles zero total questions", () => {
    expect(calculateScore(0, 0)).toBe(0);
  });

});

// Tests accuracy based on the number of attempts.
describe("Attempt Accuracy", () => {

  // Every attempt was correct.
  test("returns 100% when all attempts are correct", () => {
    expect(calculateAccuracy(10, 10)).toBe(100);
  });

  // Half of the attempts were correct.
  test("returns 50% when half the attempts are correct", () => {
    expect(calculateAccuracy(5, 10)).toBe(50);
  });

  // Checks the results from our completed game.
  test("returns 32% for 6 correct out of 19 attempts", () => {
    expect(calculateAccuracy(6, 19)).toBe(32);
  });

  // Prevents division by zero.
  test("handles zero attempts", () => {
    expect(calculateAccuracy(0, 0)).toBe(0);
  });

});


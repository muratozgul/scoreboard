import { Scoreboard } from "../scoreboard";

describe("Scoreboard", () => {
  let scoreboard: Scoreboard;

  beforeEach(() => {
    scoreboard = new Scoreboard();
  });

  test("should start a new match", () => {
    scoreboard.startMatch("Mexico", "Canada");
    const summary = scoreboard.getSummary();
    expect(summary.length).toBe(1);
    const match = summary[0];
    expect(match.homeTeam).toBe("Mexico");
    expect(match.awayTeam).toBe("Canada");
    expect(match.homeScore).toBe(0);
    expect(match.awayScore).toBe(0);
    expect(match.startTime).toBeInstanceOf(Date);
  });

  test("should throw error for empty team names", () => {
    expect(() => scoreboard.startMatch("", "Canada")).toThrow();
    expect(() => scoreboard.startMatch("Mexico", "")).toThrow();
  });

  test("should not start duplicate matches", () => {
    scoreboard.startMatch("Mexico", "Canada");
    expect(() => scoreboard.startMatch("Mexico", "Canada")).toThrow();
  });

  test("should update match score", () => {
    scoreboard.startMatch("Mexico", "Canada");
    scoreboard.updateScore("Mexico", "Canada", 0, 5);
    const summary = scoreboard.getSummary();
    expect(summary[0].homeScore).toBe(0);
    expect(summary[0].awayScore).toBe(5);
  });

  test("should throw error for negative scores", () => {
    scoreboard.startMatch("Mexico", "Canada");
    expect(() => scoreboard.updateScore("Mexico", "Canada", -1, 5)).toThrow();
    expect(() => scoreboard.updateScore("Mexico", "Canada", 0, -5)).toThrow();
  });

  test("should finish a match", () => {
    scoreboard.startMatch("Mexico", "Canada");
    expect(scoreboard.getSummary().length).toBe(1);
    scoreboard.finishMatch("Mexico", "Canada");
    expect(scoreboard.getSummary().length).toBe(0);
  });

  test("should throw error when finishing non-existent match", () => {
    expect(() => scoreboard.finishMatch("Mexico", "Canada")).toThrow();
  });

  test("should order summary by total score and start time", () => {
    // Start matches in sequence
    scoreboard.startMatch("Mexico", "Canada");
    scoreboard.startMatch("Spain", "Brazil");
    scoreboard.startMatch("Germany", "France");
    scoreboard.startMatch("Uruguay", "Italy");
    scoreboard.startMatch("Argentina", "Australia");

    // Update scores
    scoreboard.updateScore("Mexico", "Canada", 0, 5);
    scoreboard.updateScore("Spain", "Brazil", 10, 2);
    scoreboard.updateScore("Germany", "France", 2, 2);
    scoreboard.updateScore("Uruguay", "Italy", 6, 6);
    scoreboard.updateScore("Argentina", "Australia", 3, 1);

    const summary = scoreboard.getSummary();

    // Verify order matches the example in requirements
    expect(summary[0].homeTeam).toBe("Uruguay");
    expect(summary[1].homeTeam).toBe("Spain");
    expect(summary[2].homeTeam).toBe("Mexico");
    expect(summary[3].homeTeam).toBe("Argentina");
    expect(summary[4].homeTeam).toBe("Germany");
  });
});

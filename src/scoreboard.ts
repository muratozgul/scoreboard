import { z } from "zod";
import { Match, MatchSchema, ScoreSchema, TeamNameSchema } from "./schema";

export class Scoreboard {
  private matches: Match[] = [];

  startMatch(homeTeam: string, awayTeam: string): void {
    const validatedTeams = z
      .object({
        homeTeam: TeamNameSchema,
        awayTeam: TeamNameSchema,
      })
      .parse({ homeTeam, awayTeam });

    if (
      this.matches.some(
        (m) =>
          (m.homeTeam === validatedTeams.homeTeam &&
            m.awayTeam === validatedTeams.awayTeam) ||
          (m.homeTeam === validatedTeams.awayTeam &&
            m.awayTeam === validatedTeams.homeTeam)
      )
    ) {
      throw new Error("This match is already in progress");
    }

    const match: Match = {
      ...validatedTeams,
      homeScore: 0,
      awayScore: 0,
      startTime: new Date(),
    };

    MatchSchema.parse(match); // Validate match object
    this.matches.push(match);
  }

  updateScore(
    homeTeam: string,
    awayTeam: string,
    homeScore: number,
    awayScore: number
  ): void {
    const match = this.findMatch(homeTeam, awayTeam);
    if (!match) {
      throw new Error("Match not found");
    }

    const validatedScores = z
      .object({
        homeScore: ScoreSchema,
        awayScore: ScoreSchema,
      })
      .parse({ homeScore, awayScore });

    match.homeScore = validatedScores.homeScore;
    match.awayScore = validatedScores.awayScore;
  }

  finishMatch(homeTeam: string, awayTeam: string): void {
    const validatedTeams = z
      .object({
        homeTeam: TeamNameSchema,
        awayTeam: TeamNameSchema,
      })
      .parse({ homeTeam, awayTeam });

    const matchIndex = this.matches.findIndex(
      (m) =>
        m.homeTeam === validatedTeams.homeTeam &&
        m.awayTeam === validatedTeams.awayTeam
    );

    if (matchIndex === -1) {
      throw new Error("Match not found");
    }

    this.matches.splice(matchIndex, 1);
  }

  getSummary(): Match[] {
    return [...this.matches]
      .map((match, index) => ({ match, index }))
      .sort((a, b) => {
        const totalScoreA = a.match.homeScore + a.match.awayScore;
        const totalScoreB = b.match.homeScore + b.match.awayScore;

        if (totalScoreA !== totalScoreB) {
          return totalScoreB - totalScoreA; // Higher scores first
        }

        const startTimeA = a.match.startTime.getTime();
        const startTimeB = b.match.startTime.getTime();

        if (startTimeA === startTimeB) {
          return b.index - a.index; // If started at same time, higher index is first
        }

        return startTimeB - startTimeA; // Most recent first
      })
      .map((tuple) => tuple.match);
  }

  private findMatch(homeTeam: string, awayTeam: string): Match | undefined {
    return this.matches.find(
      (m) => m.homeTeam === homeTeam && m.awayTeam === awayTeam
    );
  }
}

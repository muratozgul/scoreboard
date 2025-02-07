import { Match } from "./schema";

export class Scoreboard {
  startMatch(_homeTeam: string, _awayTeam: string): void {}

  updateScore(
    _homeTeam: string,
    _awayTeam: string,
    _homeScore: number,
    _awayScore: number
  ): void {}

  finishMatch(_homeTeam: string, _awayTeam: string): void {}

  getSummary(): Match[] {
    return [];
  }
}

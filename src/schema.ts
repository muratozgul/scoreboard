import { z } from "zod";

export const TeamNameSchema = z.string().min(1, "Team name cannot be empty");
export const ScoreSchema = z.number().int().min(0, "Score cannot be negative");

export const MatchSchema = z.object({
  homeTeam: TeamNameSchema,
  awayTeam: TeamNameSchema,
  homeScore: ScoreSchema,
  awayScore: ScoreSchema,
  startTime: z.date(),
});

export type Match = z.infer<typeof MatchSchema>;

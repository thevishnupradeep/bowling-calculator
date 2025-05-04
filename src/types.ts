import { z } from "zod";

export const ScoreSchema = z.number().int().nonnegative().max(10);
export const ScoreFrameSchema = z.array(ScoreSchema).min(1).max(2)
export const ScoreFramesSchema = z.array(ScoreFrameSchema)

export const CalculateScorePayload = z.object({
    scores: ScoreFramesSchema
})
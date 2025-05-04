import { z } from "zod";

export const ScoreSchema = z.number().int().nonnegative().max(10);

// Maximum three rolls to accomodate the 10th frame.
export const ScoreFrameSchema = z.array(ScoreSchema).min(1).max(3);
export const ScoreFramesSchema = z.array(ScoreFrameSchema)

export const CalculateScorePayloadSchema = z.object({
    scores: ScoreFramesSchema
})

export type ScoreFramesType = z.infer<typeof ScoreFramesSchema>;
export type CalculateScorePayloadType = z.infer<typeof CalculateScorePayloadSchema>;
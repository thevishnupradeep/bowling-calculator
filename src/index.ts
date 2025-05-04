import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';
import { CalculateScorePayloadSchema, type CalculateScorePayloadType } from './types.js';
import { calculateScores, scoreStringToArray } from './utils.js';
import { z } from 'zod';

const app = new Hono()

app.get(
  '/', 
  (c) => {
    return c.text('Hello, World!')
  }
)

app.post(
  '/calculate/scores',
  zValidator('json', CalculateScorePayloadSchema),
  async (c) => {
    const body: CalculateScorePayloadType = await c.req.json();

    const score = calculateScores(body.scores);

    return c.json({ score })
  }
);

app.post(
  '/calculate/raw-scores',
  zValidator('json', z.object({ scoreString: z.string() })),
  async (c) => {
    const body = await c.req.json();

    console.log("String: ", body.scoreString)
    const scores = scoreStringToArray(body.scoreString)
    console.log("scores: ", scores)
    const score = calculateScores(scores);

    return c.json({ score })
  }
)

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});

export default app

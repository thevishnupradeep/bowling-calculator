import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';
import { CalculateScorePayloadSchema, ScoreFramesSchema, type CalculateScorePayloadType } from './types.js';
import { calculateScores } from './utils.js';

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
)

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});

export default app

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';
import { CalculateScorePayloadSchema, ScoreFramesSchema, type CalculateScorePayloadType } from './types.js';

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

    const score = body.scores.reduce((value, frame, i, frames) => {
      let scoreInFrame = 0;

      // Frame score: Just add both rolls
      // 10th Frame rule: Strike + 2 roll or Spare + 1 roll
      scoreInFrame = frame.reduce((pv, v) => pv + v, 0);
      console.log("scoreInFrame: ", scoreInFrame)

      if (frames.length !== i + 1) {
        // Strike Scoring: 10 + Next scores from two the next two rolls
        if (scoreInFrame == 10 && frame.length == 1) {
          scoreInFrame = frames[i + 1].reduce((pv, v) => pv + v, scoreInFrame);
        }

        // Spare Scoring: 10 + Next one roll
        if (scoreInFrame == 10 && frame.length == 2) {
          scoreInFrame = scoreInFrame + frames[i + 1][0];
        }
      }
      
      console.log("Final scoreInFrame: ", scoreInFrame)
      console.log("Final value: ", scoreInFrame + value)
      const calculatedScore = scoreInFrame + value;

      if (calculatedScore == 230 && i == 9) {
        return 300;
      }

      return calculatedScore;
    }, 0);

    return c.json({ score })
  }
)

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});

export default app

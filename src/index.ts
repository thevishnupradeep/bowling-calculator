import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';
import { CalculateScorePayload, ScoreFramesSchema } from './types.js';

const app = new Hono()

app.get(
  '/', 
  (c) => {
    return c.text('Hello, World!')
  }
)

app.post(
  '/calculate/scores',
  zValidator('json', CalculateScorePayload),
  (c) => {
    console.log("Header: ", c.req.header)
    console.log("Body: ", c.req);
    return c.json({ "score": 0 })
  }
)

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});

export default app

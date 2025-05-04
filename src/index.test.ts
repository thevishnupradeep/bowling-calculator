import { expect, test } from 'vitest'
import app from "./index.js";

test('GET /', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
})
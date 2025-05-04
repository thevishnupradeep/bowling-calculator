import { expect, test } from 'vitest'
import app from "./index.js";

test('GET /', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
})

test("Calculate scores return 400 on empty input", async () => {
    const res = await app.request("/calculate/scores", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({})
    });

    expect(res.status).toBe(400)
})

test("Calculate scores return 400 on invalid inputs", async () => {
    let res = await app.request("/calculate/scores", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "scores": [0, "/"]
        })
    });

    expect(res.status).toBe(400)

    res = await app.request("/calculate/scores", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "scores": ["x"]
        })
    });

    expect(res.status).toBe(400)

    res = await app.request("/calculate/scores", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "scores": [0, "/"]
        })
    });

    expect(res.status).toBe(400)
})

test("Calculate scores return 200 on string input", async () => {
    const res = await app.request("/calculate/scores", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "scores": [[0, 10]]
        })
    });

    console.log("res.status: ", res.status)
    expect(res.status).toBe(200)
});
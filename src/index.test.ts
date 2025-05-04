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

test("Calculate simple frames correctly", async () => {
    const res = await app.request("/calculate/scores", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "scores": [
                [3, 5],
                [4, 4]
            ]
        })
    });
    const body = await res.json()

    expect(body.score).toBe(16)
});

test("Calculate strike frames correctly", async () => {
    const res = await app.request("/calculate/scores", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "scores": [
                [3, 5], // 8
                [4, 4], // 16
                [10], // 26 + 4 + 3 = 33
                [4, 3], // 40
            ]
        })
    });
    const body = await res.json()

    expect(body.score).toBe(40)
});

test("Calculate spare frames to correctly", async () => {
    const res = await app.request("/calculate/scores", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "scores": [
                [3, 5], // 8
                [4, 4], // 16
                [5, 5], // 26 + 4 = 30
                [4, 3], // 37
            ]
        })
    });
    const body = await res.json()

    expect(body.score).toBe(37)
});

test("Follow 10th frame rules on strike @ 10th frame", async () => {
    const res = await app.request("/calculate/scores", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "scores": [
                [3, 5], // 8
                [4, 4], // 16
                [5, 5], // 26 + 4 = 30
                [4, 3], // 37
                [10], // 47 + 5 + 4 = 56
                [5, 4], // 65
                [10], // 75 + 5 + 5 = 85
                [5, 5], // 95 + 2 = 97
                [2, 3], // 102
                [10, 5, 2] // 112 + 5 + 2 = 119
            ]
        })
    });
    const body = await res.json()

    expect(body.score).toBe(119)
});

test("Follow 10th frame rules on spare @ 10th frame", async () => {
    const res = await app.request("/calculate/scores", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "scores": [
                [3, 5], // 8
                [4, 4], // 16
                [5, 5], // 26 + 4 = 30
                [4, 3], // 37
                [10], // 47 + 5 + 4 = 56
                [5, 4], // 65
                [10], // 75 + 5 + 5 = 85
                [5, 5], // 95 + 2 = 97
                [2, 3], // 102
                [4, 6, 2] // 112 + 2 = 114
            ]
        })
    });
    const body = await res.json()

    expect(body.score).toBe(114)
});


test("On Perfect Score", async () => {
    const res = await app.request("/calculate/scores", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "scores": [
                [10],
                [10],
                [10],
                [10],
                [10],
                [10],
                [10],
                [10],
                [10],
                [10, 10, 10],
            ]
        })
    });
    const body = await res.json()

    expect(body.score).toBe(300)
});
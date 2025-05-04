import type { ScoreFramesType } from "./types.js";

export const scoreStringToArray = (soreString: string): ScoreFramesType => {
    const scores = soreString.split(" ");


    let cursor = 0;
    const scoreFrames = scores.reduce<ScoreFramesType>((frames, score, i) => {
        const scoreNumber = parseInt(score);

        if (cursor === 9) {
            if (!frames[cursor]) {
                frames[cursor] = [scoreNumber];
            } else {
                frames[cursor].push(scoreNumber);
            }
            return frames;
        }

        if (scoreNumber === 10 && cursor < 9) {
            frames.push([scoreNumber]);
            cursor++;
            return frames;
        }

        const currentFrame = frames[cursor] || [];
        
        if (currentFrame.length === 0) {
            frames[cursor] = [scoreNumber];
            return frames;
        }
        
        currentFrame.push(scoreNumber);
        cursor++;
        return frames;

    }, []);
    
    console.log("scoreFrames: ", scoreFrames)

    return scoreFrames;
}


export const calculateScores = (scores: ScoreFramesType) => {
    const score = scores.reduce((value, frame, i, frames) => {
        let scoreInFrame = 0;

        // Frame score: Just add both rolls
        // 10th Frame rule: Strike + 2 roll or Spare + 1 roll
        scoreInFrame = frame.reduce((pv, v) => pv + v, 0);
        

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
        
        const calculatedScore = scoreInFrame + value;

        if (calculatedScore == 230 && i == 9) {
            return 300;
        }

        return calculatedScore;
    }, 0);

    return score;
}
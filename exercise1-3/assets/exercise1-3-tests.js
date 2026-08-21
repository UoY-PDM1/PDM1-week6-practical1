import { TestResults, advanceToFrame, canvasStatus, getShapes } from "https://cdn.jsdelivr.net/gh/Supportive-IDE/p5js-testing-demo@latest/p5jsTestingLibrary.js";

/**
 * A hacky solution to wait for p5js to load the canvas. Include in all exercise test files.
 */
function waitForP5() {
    const canvases = document.getElementsByTagName("canvas");
    if (canvases.length > 0) {
        clearInterval(loadTimer);
        runTests(canvases[0]);
    }
}

async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    const resultsDiv = document.getElementById("results");
    const frame1 = getShapes().filter(s => s.type === TEXT);
    if (frame1.length !== 1) {
        TestResults.addFail(`Expected one text object. Found ${frame1.length}.`);
    } else {
        let currentFrameRate = canvasStatus.frameRate;
        if (currentFrameRate === Infinity) {
            currentFrameRate = 60;
        }
        if (currentFrameRate === 2) {
            await advanceToFrame(frameCount + 1);
        }
        else {
            await advanceToFrame(Math.max(Math.floor(currentFrameRate / 2), frameCount + 1));
        }
        const frame2 = getShapes().filter(s => s.type === TEXT);
        if (frame2.length === 0) {
            TestResults.addFail(`No text was found at frame ${frameCount}. Unable to run any more tests.`);
        } else {
            const oldMsg = frame1[0].msg;
            const newMsg = frame2[frame2.length - 1].msg;
            if (newMsg.length === oldMsg.length + 1) {
                TestResults.addPass("The displayed message increases by one character after half a second.");
            } else {
                if (currentFrameRate > 2) {
                    await advanceToFrame(frameCount + 1);
                    const frame3 = getShapes().filter(s => s.type === TEXT);
                    if (frame3.length === 0) {
                        TestResults.addFail(`No text was found at frame ${frameCount}. Unable to run any more tests.`);
                    } else {
                        const newMsg2 = frame3[frame3.length - 1].msg;
                        if (newMsg2.length === oldMsg.length + 1) {
                            TestResults.addPass("The displayed message increases by one character after half a second.");
                        } else {
                            TestResults.addFail(`Expected the displayed message to increase in length by 1 character after half a second. At the start of the sketch, the message is ${oldMsg.length} characters long and after half a second it is ${newMsg.length} characters long. If your sketch appears to work as expected, you've probably just used an unanticipated approach, which is fine! You can move on to the next exercise.`);
                        }
                    }
                }
                else {
                    TestResults.addFail(`Expected the displayed message to increase in length by 1 character after half a second. At the start of the sketch, the message is ${oldMsg.length} characters long and after half a second it is ${newMsg.length} characters long. If your sketch appears to work as expected, you've probably just used an unanticipated approach, which is fine! You can move on to the next exercise.`);
                }
                
            }
        }
    }
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);

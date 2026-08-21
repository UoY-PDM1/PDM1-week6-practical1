import { simulateMousePosition, TestResults, advanceToFrame, getShapes } from "https://cdn.jsdelivr.net/gh/Supportive-IDE/p5js-testing-demo@latest/p5jsTestingLibrary.js";

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

function textIsKey(msg, x, y) {
    if (keys) {
        for (const k of keys) {
            if (msg === k.name && x === k.x && y === k.y) {
                return true;
            }
        }
    }
    return false;
}

async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    const resultsDiv = document.getElementById("results");
    // remove text that's part of a key
    let actualText = getShapes().filter(shape => shape.type === TEXT && (shape.msg.length === 0 || shape.msg.length > 1 || !textIsKey(shape.msg, shape.x, shape.y)));
    if (actualText.length === 1) {
        if (actualText[0].msg === "") {
            TestResults.addPass("Before any virtual keys are clicked, <code>text()</code> is called with an empty string.");
        } else {
            TestResults.addFail(`Before any virtual keys are clicked, no text should be displayed. <code>text()</code> was called with the string, "${actualText[0].msg}".`);
        }
        if (window.hasOwnProperty("mouseClicked")) {
            // mouseX = 350;
            // mouseY = 510;
            simulateMousePosition(350, 510);
            mouseClicked();
            await advanceToFrame(frameCount + 1);
            actualText = getShapes().filter(shape => shape.type === TEXT && (shape.msg.length === 0 || shape.msg.length > 1 || !textIsKey(shape.msg, shape.x, shape.y)));
            if (actualText.length === 1 && actualText[0].msg === "H") {
                TestResults.addPass("When the mouse clicks for the first time (at 350, 510), \"H\" is displayed.");
            } else {
                TestResults.addFail(`After the first click (at 350, 510), expected one call to <code>text()</code> with the letter "H". Found ${actualText.length} calls to <code>text()</code>.`);
            }
        } else {
            TestResults.addFail("<code>mouseClicked()</code> has not been implemented.");
        }
    } else {
        TestResults.addFail(`Expected one text (aside from the keyboard). Found ${actualText.length}.`);
    }
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);

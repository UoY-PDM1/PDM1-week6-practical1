import { SHAPE, TestResults, canvasStatus, checkBackgroundIsCalledInDraw, checkCanvasSize, getShapes } from "https://cdn.jsdelivr.net/gh/Supportive-IDE/p5js-testing-demo@latest/p5jsTestingLibrary.js";

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
    const msg = "Lorem ipsum dolor sit amet"
    checkCanvasSize(600, 600);
    checkBackgroundIsCalledInDraw();
    const actual = getShapes();
    if (actual.length !== 1) {
        TestResults.addFail(`Expected only text. Found ${actual.length} shapes.`);
    } else {
        if (actual[0].type !== SHAPE.TEXT) {
            TestResults.addFail(`Expected text, found a ${actual[0].type}.`);
        } else {
            if (actual[0].msg !== msg) {
                TestResults.addFail(`Expected the text to be ${msg}, found ${actual[0].msg}. Check spelling and case of the text.`);
            } else {
                TestResults.addPass("The expected string is displayed on the canvas.");
            }
            if (canvasStatus.textAlign.horizontal === RIGHT && canvasStatus.textAlign.vertical === BOTTOM) {
                TestResults.addPass("The text is aligned right, bottom.");
            } else {
                TestResults.addFail(`Expected the text to be aligned right, bottom. Found text aligned ${canvasStatus.horizontal, canvasStatus.vertical}.`);
            }
            if (actual[0].x === width / 2 && actual[0].y === height / 2) {
                TestResults.addPass("The text is positioned correctly.");
            } else {
                TestResults.addFail(`The text should be positioned at ${width / 2}, ${height / 2} (if using the default CORNER mode). The text is positioned at ${actual[0].x}, ${actual[0].y} in ${actual[0].drawMode} mode.`);
            }
            if (actual[0].w > -1 && actual[0].h > -1) {
                TestResults.addPass("A bounding box has been set to wrap the text.");
            } else {
                TestResults.addFail(`The width and height of the text box should be set to get the string to wrap. ${actual[0].w === -1 ? "The width has not been set.": ""}`);
            }
        }
    }
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);

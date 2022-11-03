const canvas = document.getElementById('mz700');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio;
const canvasContainer = document.getElementById('maincanvasContainer');
canvas.width = 320;
canvas.height = 200;
ctx.scale(1, 1);
let canvasScale = 4; // default value to multiply canvas size with



// elements 
const reload = document.getElementById('loadButton');
const save = document.getElementById('saveButton');
const fileInput = document.getElementById('input');
const selector = document.getElementById('selected');
const swap = document.getElementById('swap');
const saveNewFile = document.getElementById('textSave');
const colLists = document.getElementById('colorLists');
const upsize = document.getElementById('scaleUp');
const dosize = document.getElementById('scaleDown');
const pal1 = document.getElementById('pal1');
const applyPalette = document.getElementById('applyPalette');

const gridCanvas = document.getElementById('gridCanvas');
const gridCanvasContainer = document.getElementById('canvasContainer');
gridCanvas.width = 128;
gridCanvas.height = 176;
scaleCanvas(gridCanvas.width, gridCanvas.height, window.devicePixelRatio, 4, gridCanvas, gridCanvasContainer); // scale canvas to correct screen size
const gridctx = gridCanvas.getContext('2d');
gridctx.scale(1, 1);


let charList;

const updatePixelRatio = () => { // make sure the canvas isn't scaled incorrectly, like on monitors with uneven device pixel ratios
    let pr = window.devicePixelRatio;
    scaleCanvas(canvas.width, canvas.height, pr, canvasScale, canvas, canvasContainer);
    scaleCanvas(gridCanvas.width, gridCanvas.height, window.devicePixelRatio, canvasScale, gridCanvas, gridCanvasContainer);
    selector.style.border = `${canvasScale * (1 / pr)}px solid white`;
    // console.log(pr,"ratio!");
    matchMedia(`(resolution: ${pr}dppx)`).addEventListener("change", updatePixelRatio, { once: true }) // this updates if the screen changes,
                                                                                                       // like if you change what screen the window is on
}

updatePixelRatio();


function scaleCanvas(x, y, dpr, scale, canvas, container) {
    let dprScale = (1 / dpr) * scale;
    let s = { x: x * dprScale, y: y * dprScale };
    canvas.style.left = `${(s.x - x) / 2}px`;
    canvas.style.top = `${(s.y - y) / 2}px`;
    canvas.style.transform = `scale(${dprScale})`;
    container.style.minWidth = `${canvas.width * dprScale}px`;   // this is the container the canvas is inside
    container.style.minHeight = `${canvas.height * dprScale}px`; // scaled correctly so the other elements
    container.style.width = `${canvas.width * dprScale}px`;      // dont go over or under the canvas itself
    container.style.height = `${canvas.height * dprScale}px`;    // because the canvas is scaled with the transform: scale() style.
}


// hex to RGB //
String.prototype.convertToRGB = function () {
    let aRgbHex;
    if (this.length != 6) {
        if (this[0] != '#') {
            throw "Only six-digit hex colors are allowed.";
        } else {
            aRgbHex = this.substring(1).match(/.{1,2}/g);
        }
    } else {
        aRgbHex = this.match(/.{1,2}/g);
    }

    let aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];
    return aRgb;
}

const gSize = 8; // grid size

//  V this is the file that's saved currently, default is just a color palette test. V 
let currentFile = [0, 60, 62, 126, 58, 54, 112, 0, 60, 62, 126, 0, 54, 112, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 62, 126, 122, 54, 112, 0, 60, 62, 126, 122, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 62, 126, 58, 54, 112, 0, 60, 62, 126, 0, 0, 112, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 62, 126, 122, 54, 112, 0, 60, 62, 126, 122, 54, 112, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 88, 88, 88, 88, 88, 88, 88, 88, 90, 90, 90, 90, 90, 90, 90, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 88, 88, 88, 88, 88, 88, 88, 88, 90, 90, 90, 90, 90, 90, 90, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 88, 88, 88, 88, 88, 88, 88, 88, 90, 90, 90, 90, 90, 90, 90, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 62, 126, 58, 54, 112, 67, 60, 124, 56, 120, 52, 116, 48, 112, 88, 88, 88, 88, 88, 88, 88, 88, 90, 90, 90, 90, 90, 90, 90, 90, 0, 0, 0, 0, 0, 0, 0, 0, 67, 60, 62, 126, 122, 54, 112, 0, 113, 118, 119, 374, 375, 228, 229, 230, 88, 88, 88, 88, 88, 88, 88, 88, 90, 90, 90, 90, 90, 90, 90, 90, 0, 0, 0, 0, 0, 0, 0, 0, 113, 113, 78, 77, 86, 66, 114, 115, 49, 109, 27, 45, 89, 227, 231, 232, 88, 88, 88, 88, 88, 88, 88, 88, 90, 90, 90, 90, 90, 90, 90, 90, 0, 0, 0, 0, 0, 0, 0, 0, 55, 55, 66, 86, 77, 78, 50, 51, 117, 95, 94, 92, 93, 238, 224, 233, 88, 88, 88, 88, 88, 88, 88, 88, 90, 90, 90, 90, 90, 90, 90, 90, 0, 0, 0, 0, 0, 0, 0, 0, 59, 123, 90, 88, 239, 74, 71, 72, 53, 30, 31, 28, 29, 225, 226, 234, 88, 88, 88, 88, 88, 88, 88, 88, 90, 90, 90, 90, 90, 90, 90, 90, 0, 0, 0, 0, 0, 0, 0, 0, 127, 127, 65, 70, 83, 68, 206, 207, 121, 75, 76, 114, 115, 235, 236, 237, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 63, 108, 91, 104, 105, 81, 87, 57, 111, 110, 50, 51, 200, 201, 223, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61, 61, 191, 42, 82, 84, 157, 177, 125, 98, 188, 444, 128, 80, 64, 69, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 67, 185, 46, 445, 189, 184, 433, 61, 437, 181, 103, 202, 203, 204, 205, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 248, 252, 244, 254, 253, 247, 243, 251, 241, 242, 277, 21, 193, 194, 195, 196, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 250, 255, 245, 251, 247, 245, 240, 250, 244, 248, 278, 22, 280, 24, 10, 12, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 242, 243, 241, 249, 246, 253, 252, 254, 246, 249, 279, 23, 13, 20, 25, 221, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 99, 107, 106, 43, 79, 44, 47, 186, 165, 9, 8, 130, 137, 139, 171, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 155, 172, 142, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 1, 1, 1, 1, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 0, 0, 0, 0, 6, 6, 6, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 7, 7, 6, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 1, 7, 7, 7, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 1, 7, 7, 7, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 0, 0, 6, 6, 6, 6, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 1, 1, 1, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 1, 1, 1, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 7, 7, 7, 7, 1, 6, 6, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 1, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//  V this is the  order of characters in the paint menu, copied from the original program
const gridOrder = [0, 60, 62, 126, 58, 122, 54, 112, 67, 61, 63, 127, 59, 123, 55, 113, 60, 124, 56, 120, 52, 116, 48, 112, 113, 49, 117, 53, 121, 57, 125, 61, 75, 76, 92, 93, 95, 94, 27, 224, 114, 115, 78, 77, 118, 119, 374, 375, 111, 110, 28, 29, 30, 31, 225, 226, 50, 51, 66, 86, 109, 0, 108, 91, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 90, 88, 239, 74, 227, 238, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 65, 70, 83, 68, 71, 72, 206, 207, 202, 203, 204, 205, 200, 201, 223, 199, 0, 97, 98, 99, 100, 101, 102, 103, 104, 105, 81, 87, 82, 84, 45, 89, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 79, 44, 107, 43, 106, 42, 85, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 47, 46, 73, 221, 222, 96, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 192, 128, 80, 64, 69, 189, 445, 157, 177, 433, 181, 437, 158, 178, 182, 186, 190, 159, 179, 183, 187, 163, 133, 164, 165, 166, 148, 135, 136, 156, 130, 152, 132, 146, 144, 131, 188, 145, 129, 154, 151, 147, 149, 137, 161, 175, 139, 134, 150, 162, 171, 170, 184, 138, 142, 176, 173, 141, 167, 168, 169, 143, 140, 174, 172, 155, 160, 180, 153, 193, 194, 195, 196, 197, 198, 185, 414, 434, 438, 442, 446, 415, 435, 439, 443, 419, 389, 420, 421, 422, 404, 391, 392, 412, 386, 408, 388, 402, 400, 387, 444, 401, 385, 410, 407, 403, 405, 393, 417, 431, 395, 390, 406, 418, 427, 426, 191, 394, 398, 432, 429, 397, 423, 424, 425, 399, 396, 430, 428, 411, 416, 436, 409, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220];
let saveFile = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let pixelNum = 0; // dont remember
let paint = { color: { FG: 3, BG: 6 }, char: 0, gridPos: { id: 0, x: 0, y: 0 }, coloringMode: false }; // paintbrush parameters
const defaultColors = ["#000000", "#120EFD", "#FF0302", "#FF10FD", "#00FE1E", "#00FFFF", "#FEFE1F", "#FFFFFF"]; 
let colors = [{ r: 0, g: 0, b: 0 }, { r: 18, g: 14, b: 253 }, { r: 255, g: 3, b: 2 }, { r: 255, g: 16, b: 253 }, { r: 0, g: 254, b: 30 }, { r: 0, g: 255, b: 255 }, { r: 254, g: 254, b: 31 }, { r: 255, g: 255, b: 255 }];
let currentMenu = "";

let editMode = false;
// image data 
// first third is what character it is
// second third and last third is color one and color two
let split = { shape: [], col1: [], col2: [] };

// const posText = document.getElementById('position');


selector.style.border = `${canvasScale * (1 / window.devicePixelRatio)}px solid white`;

window.onLoad = preloadChars();
function preloadChars() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,canvas.width,canvas.height); // fill canvas so it's not transparent if you dont paint on every tile
    let fr = new FileReader();
    url = `./char/chars.png`; // load 8x4096 image
    image = new Image();
    image.src = url;
    charList = image;
}

loadPalette(defaultColors);

applyPalette.addEventListener('click', () => {
    setPaletteColors();
    loadCGE7(saveFile);
});


function loadPalette(defaultColors) {
    for (let i = 0; i < 8; i++) {
        let inputColor = document.createElement('input');
        inputColor.type = 'color';
        inputColor.value = defaultColors[i];
        pal1.appendChild(inputColor);
    }
}

function setPaletteColors() {
    for (let i = 0; i < 8; i++) {
        let prm = pal1.children[i].value.convertToRGB();
        colors[i].r = prm[0];
        colors[i].g = prm[1];
        colors[i].b = prm[2];
    }
}

function selectColor(num) {
    return colors[num].hex;
}


let mousePosY = 0;
let mousePosX = 0;
let lastSpaceX = -1;
let lastSpaceY = -1;

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
canvas.addEventListener('mousemove', function (evt) {
    if (editMode) {

        let mousePos = getMousePos(canvas, evt);
        let rect = canvas.getBoundingClientRect();

        if (mousedown && (lastSpaceX != mousePosX || lastSpaceY != mousePosY)) {
            let dx = Math.abs(lastSpaceX - mousePosX);
            let dy = Math.abs(lastSpaceY - mousePosY);

            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) { // if the mouse is more than one tile away, fill tiles in a line from the old position to the new position
                line(mousePosX, mousePosY, lastSpaceX, lastSpaceY);
            } else {
                paintChar(mousePosX * gSize, mousePosY * gSize);
            }

            lastSpaceX = mousePosX;
            lastSpaceY = mousePosY;


        }
        mousePosY = Math.floor(mousePos.y / (rect.right / 40));
        mousePosX = Math.floor(mousePos.x / (rect.right / 40));
    }
}, false);


function line(x0, y0, x1, y1) { // draw line between two points
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        paintChar(x0 * gSize, y0 * gSize);
        // console.log(x0,x1);
        if ((x0 === x1) && (y0 === y1)) break;
        let e2 = err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
}




let mousedown = false;
canvas.addEventListener('mousedown', function (evt) {
    if (editMode && evt.buttons == 1) { // if edit mode is true and pressing left click specifically
        mousedown = true;
        paintPosX = lastSpaceX;
        paintPosY = lastSpaceY;
        let mousePos = getMousePos(canvas, evt);
        let rect = canvas.getBoundingClientRect();
        lastSpaceX = Math.floor(mousePos.x / (rect.right / 40));
        lastSpaceY = Math.floor(mousePos.y / (rect.right / 40));
        paintChar(mousePosX * gSize, mousePosY * gSize);
    }

}, false);

document.addEventListener('mouseup', function (evt) {
    mousedown = false;
});


canvas.addEventListener('contextmenu', function (evt) { // 'contextmenu' is checking for right clicks on canvas // could remove this by checking mousedown function for right clicks
    if (editMode) {
        evt.preventDefault();
        let mousePos = getMousePos(canvas, evt);
        let rect = canvas.getBoundingClientRect();
        let gridX = Math.floor(mousePos.x / (rect.right / 40));
        let gridY = Math.floor(mousePos.y / (rect.right / 40));
        let id = gridX + (40 * gridY);
        copyChar(id, gridX, gridY, rect); // copy the selected tiles color
        return false;
    }
}, false);

reload.addEventListener('click', () => { // doesn't really do anything anymore
    loadCGE7(currentFile); 
});

save.addEventListener('click', () => { // save canvas as a png
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'Output.png');
    let dataURL = canvas.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
    downloadLink.setAttribute('href', url);
    downloadLink.click();
    downloadLink.remove();
});

fileInput.onchange = () => { // select a file -> read it and load it to the canvas
    const selectedFile = fileInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.addEventListener('load', (event) => {
        let result = event.target.result;
        result = JSON.parse(`[${atob(result.substr(23))}]`);
        currentFile = result;
        loadCGE7(result);
    });
    //   console.log(fileInput);
    //   console.log(selectedFile);
}

function loadCGE7(string) { // load the file , check if the string is too short and separate the three parts
    if (string.length != 3000) {
        console.warn(`String not correct length! ${string.length} needs to be 3000`);
        return;
    }
    saveFile = string;

    for (let i = 0; i < 1000; i++) {
        split.shape[i] = string[i]; // what character it is
        split.col1[i] = string[i + 1000]; // color 1
        split.col2[i] = string[i + 2000]; // color 2
    }
    ctx.imageSmoothingEnabled = false; // just in case. again
    renderAllChunks(split);
}

function renderAllChunks(split) { // render the whole canvas
    let x = 0;
    let y = 0;
    for (let i = 0; i < split.shape.length; i++) {
        // ctx.imageSmoothingEnabled = false;
        renderChar(x, y, split.shape[i], split.col2[i], split.col1[i], ctx);
        x += gSize;
        if (x >= gSize * 40) {
            y += gSize;
            x = 0;
        }
    }
}



function renderChar(posX, posY, char, col1, col2, ctx) { // draw a character on the canvas
    let charfrontOffset = (char) * gSize; // what part of the image the character is in

    const BGcolor = colors[col1]; // background color
    const FRcolor = colors[col2]; // foreground color
    ctx.clearRect(posX, posY, gSize, gSize); // empty chunk
    ctx.globalCompositeOperation = "source-over"; // set to draw normally just in case
    ctx.drawImage(charList, charfrontOffset, 0, 8, 8, posX, posY, gSize, gSize); // draw black character 
    ctx.globalCompositeOperation = "source-atop"; // set to draw only on drawn pixels
    ctx.fillStyle = `rgb(${FRcolor.r},${FRcolor.g},${FRcolor.b})`; // set character color
    ctx.fillRect(posX, posY, gSize, gSize);  // fill character
    ctx.globalCompositeOperation = "destination-over"; // set to draw only on empty pixels
    ctx.fillStyle = `rgb(${BGcolor.r},${BGcolor.g},${BGcolor.b})`; // set bg color
    ctx.fillRect(posX, posY, gSize, gSize); // draw background

    // could MAYBE be more optimized if you use two canvases, one for the background color and one for the
    // character color but could also be worse and also would have to combine them to save to an image. not worth it!


}



loadRadioMenu('menuButtons', [{ name: ["", "folder.png"], id: "Options", parentElement: "menu", targetElement: "options", pageFunction: () => { editMode = false } }, // options menu
{ name: ["", "pen.png"], id: "Edit", parentElement: "menu", targetElement: "edit", pageFunction: () => { editMode = true; loadPaintMenu(); } },                       // paint menu
{ name: ["", "question.png"], id: "Faq", parentElement: "menu", targetElement: "faq", pageFunction: () => { editMode = false } }]);                                   // Faq menu 

function loadRadioMenu(element = 'menu', menu = [{ name: "", parentElement: "", targetElement: "", pageFunction: () => { console.log("") } }]) { // very quick and bad options meny. well it's not important to the project
    let menuElement = document.getElementById(element)
    for (let i = 0; i < menu.length; i++) { // construct all menu parts
        const element = menu[i];
        let menuButton = document.createElement('button');
        menuButton.type = 'button';
        menuButton.classList.add('menuButton');
        if (i == 0) {
            menuButton.classList.add('high');
        }
        if (element.name[0] == "") { // if element name is empty check if it's supposed to have an icon // BAD way of doing it and ugly.....
            let buttonImage = document.createElement('img');
            buttonImage.src = `./images/${element.name[1]}`;
            buttonImage.classList.add('buttonImage');
            menuButton.appendChild(buttonImage);
            menuButton.title = element.id;
        } else {
            menuButton.innerText = element.name[0];
            menuButton.title = element.name[0];
        }
        menuButton.id = element.id;
        menuButton.addEventListener('click', () => {
            selectMenu(element);
            element.pageFunction();
        });
        menuElement.appendChild(menuButton);
    }
    currentMenu = menu[0];
}

function selectMenu(element) { // select current menu and hide the old one 
    if (currentMenu != element) {

        let menuElement = document.getElementById(element.targetElement);
        let oldMenu = document.getElementById(currentMenu.targetElement);
        oldMenu.classList.add('hiddenMenu');
        menuElement.classList.remove('hiddenMenu');
        let newButton = document.getElementById(element.id);
        let oldButton = document.getElementById(currentMenu.id);
        newButton.classList.add('high');
        oldButton.classList.remove('high');
        currentMenu = element;
    }
}

function paintChar(posX, posY, char, FG, BG) { // draw character on canvas and save it to array
    let id = (posX + (40 * posY)) / gSize;     // what position in the array the character is in
    let paintchar = 0;                      
    if (paint.coloringMode) {
        paintchar = saveFile[id];
    } else {
        paintchar = paint.char;
    }
    renderChar(posX, posY, paintchar, paint.color.FG, paint.color.BG, ctx);
    // console.log("id",(posX+(40*posY))/8);
    saveFile[id] = paintchar;
    saveFile[id + 1000] = paint.color.BG;
    saveFile[id + 2000] = paint.color.FG;

}

function loadPaintMenu() {
    renderGrid();   // render paint grid
    updateColors(); // update colors in case custom palette change
}

function renderGrid() {
    let x = 0;
    let y = 0;
    for (let i = 0; i < 512; i++) {
        renderChar(x, y, gridOrder[i], paint.color.FG, paint.color.BG, gridctx);
        x += gSize;

        if (x >= gSize * 16) {
            y += gSize;
            x = 0;
        }
    }

}

function updateColors() { // update colors of the painting menu if palette has been changed
    const lists = colLists.children;
    for (let i = 0; i < 8; i++) {
        lists[0].children[i].style.backgroundColor = `rgb(${colors[i].r},${colors[i].g},${colors[i].b})`;
        lists[2].children[i].style.backgroundColor = `rgb(${colors[i].r},${colors[i].g},${colors[i].b})`;
    }
}

function selectCol(FBG, color) { // paint menu color selector, FBG = 0 is  background color and FBG = 1 is foreground
    if (FBG) {
        if (paint.color.FG != color) {
            colLists.children[0].children[paint.color.FG].innerHTML = "";
            colLists.children[0].children[color].innerHTML = "<p>+</p>";
            paint.color.FG = color;
            renderGrid();
        }
    } else {
        if (paint.color.BG != color) {
            colLists.children[2].children[paint.color.BG].innerHTML = "";
            colLists.children[2].children[color].innerHTML = "<p>+</p>";
            paint.color.BG = color;
            renderGrid();
        }
    }
}

swap.addEventListener('click', () => { // swap foreground and background colors
    let FG = paint.color.FG;
    let BG = paint.color.BG;

    colLists.children[0].children[paint.color.FG].innerHTML = "";
    colLists.children[0].children[BG].innerHTML = "<p>+</p>";

    colLists.children[2].children[paint.color.BG].innerHTML = "";
    colLists.children[2].children[FG].innerHTML = "<p>+</p>";

    paint.color.FG = BG;
    paint.color.BG = FG;
    renderGrid();
});


gridCanvas.addEventListener('mousedown', function (evt) { // paint menu select character

    let mousePos = getMousePos(gridCanvas, evt);
    let rect = gridCanvas.getBoundingClientRect();
    let gridX = Math.floor(mousePos.x / ((rect.right - rect.x) / 16));
    let gridY = Math.floor(mousePos.y / ((rect.bottom - rect.y) / 22));
    selectChar(gridX + (16 * gridY), gridX, gridY, rect);

}, false);

function selectChar(id, posX, posY, rect) {
    selector.style.left = `${posX * (rect.right - rect.x) / 16}px`
    selector.style.top = `${posY * (rect.bottom - rect.y) / 22}px`
    paint.char = gridOrder[id];
    paint.gridPos.id = id;
    paint.gridPos.x = posX;
    paint.gridPos.y = posY;
}

saveNewFile.addEventListener('click', () => {
    saveText(saveFile);
});


function saveText(text) {
    let link = document.createElement('a');
    link.href = 'data:text/plain;charset=UTF-8,' + text;
    link.download = 'output.txt';
    link.click();
}

document.onkeydown = function (e) { // key shortcuts
    e = e || window.event;

    let rect = gridCanvas.getBoundingClientRect();
    switch (window.event.key) {
        case "Shift": // while pressing shift, dont update what character you paint on, only colors
            paint.coloringMode = true;
            break;
        case "ArrowUp": // move selector up
            if (paint.gridPos.y - 1 <= -1) {
                paint.gridPos.y = 21;
            } else {
                paint.gridPos.y -= 1;
            }
            selectChar(paint.gridPos.x + (16 * paint.gridPos.y), paint.gridPos.x, paint.gridPos.y, rect);
            break;
        case "ArrowLeft": // move selector left
            if (paint.gridPos.x - 1 <= -1) {
                paint.gridPos.x = 15;
            } else {
                paint.gridPos.x -= 1;
            }
            selectChar(paint.gridPos.x + (16 * paint.gridPos.y), paint.gridPos.x, paint.gridPos.y, rect);
            break;
        case "ArrowDown": // move selector down
            if (paint.gridPos.y + 1 >= 22) {
                paint.gridPos.y = 0;
            } else {
                paint.gridPos.y += 1;
            }
            selectChar(paint.gridPos.x + (16 * paint.gridPos.y), paint.gridPos.x, paint.gridPos.y, rect);
            break;
        case "ArrowRight": // move selector right
            if (paint.gridPos.x + 1 >= 16) {
                paint.gridPos.x = 0;
            } else {
                paint.gridPos.x += 1;
            }
            selectChar(paint.gridPos.x + (16 * paint.gridPos.y), paint.gridPos.x, paint.gridPos.y, rect);
            break;
        default:
            // console.log(window.event.key);
            break;
    }
};

document.onkeyup = function (e) {
    e = e || window.event;
    if (window.event.key == "Shift") {
        paint.coloringMode = false;
    }
}

upsize.addEventListener('click', () => { // +1 size to the canvas
    canvasScale += 1;
    scaleCanvas(canvas.width, canvas.height, window.devicePixelRatio, canvasScale, canvas, canvasContainer);
    selector.style.border = `${canvasScale * (1 / window.devicePixelRatio)}px solid white`;
    scaleCanvas(gridCanvas.width, gridCanvas.height, window.devicePixelRatio, canvasScale, gridCanvas, gridCanvasContainer);

});
dosize.addEventListener('click', () => { // -1 size to the canvas
    canvasScale -= 1;
    scaleCanvas(canvas.width, canvas.height, window.devicePixelRatio, canvasScale, canvas, canvasContainer);
    selector.style.border = `${canvasScale * (1 / window.devicePixelRatio)}px solid white`;
    scaleCanvas(gridCanvas.width, gridCanvas.height, window.devicePixelRatio, canvasScale, gridCanvas, gridCanvasContainer);

});

function copyChar(id, posX, posY, rect) {
    const char = { char: saveFile[id], BG: saveFile[id + 1000], FG: saveFile[id + 2000] };

    colLists.children[0].children[paint.color.FG].innerHTML = "";
    colLists.children[0].children[char.FG].innerHTML = "<p>+</p>";
    paint.color.FG = char.FG;

    colLists.children[2].children[paint.color.BG].innerHTML = "";
    colLists.children[2].children[char.BG].innerHTML = "<p>+</p>";
    paint.color.BG = char.BG;

    // paint.char = char.char;
    // selectChar(char.char,posX,posY,rect)

    renderGrid();
}

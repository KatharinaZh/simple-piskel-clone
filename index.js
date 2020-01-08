/* eslint no-bitwise: ["error", { "allow": ["|", "<<"] }] */
/* eslint no-cond-assign: 2 */
/* eslint no-console: ["error", { allow: ["error"] }] */
/* eslint radix: ["error", "as-needed"] */
/* eslint no-param-reassign: "error" */
/* eslint no-undef: "error" */
/* eslint-env browser */
/* eslint-env node */
/* eslint max-len: ["error", { "code": 115 }] */
/* global GIFEncoder, APNGencoder, bytesToBase64 */
/* eslint no-undef: ["error", { "typeof": true }] */
/* eslint no-inner-declarations: 0 */
/* eslint no-param-reassign: 0 */
/* eslint no-unused-vars: 0 */


let animationRunning = false;
const FPS = 'FPS';
let fps = 60;

const fpsInput = document.getElementById('fps_input');
const fpsLabel = document.querySelector('#fps_label');

fpsInput.addEventListener('change', (event) => {
  fps = event.target.value;

  fpsLabel.innerHTML = `${fps} FPS`;
});

const requestAnimFrame = (function anim() {
  return function animat(callback) {
    window.setTimeout(callback, 1000 / fps);
  };
}());

const A = [
  ['00BCD4', 'FFEB3B', 'FFEB3B', '00BCD4'],
  ['FFEB3B', 'FFC107', 'FFC107', 'FFEB3B'],
  ['FFEB3B', 'FFC107', 'FFC107', 'FFEB3B'],
  ['00BCD4', 'FFEB3B', 'FFEB3B', '00BCD4'],
];

const first = document.getElementById('first');
const second = document.getElementById('second');
const third = document.getElementById('third');

const pencilLine = document.querySelector('#pencil');
const fillLine = document.querySelector('#fill_bucket');
const pipetteLine = document.querySelector('#pipette');
const strokeLine = document.querySelector('#stroke');
const eraserLine = document.querySelector('#eraser');
const settingsPanel = document.querySelector('#settings_panel');

const currentColor = document.querySelector('#current_color');
const prevColor = document.querySelector('#prev_color');
const redColor = document.querySelector('#red_color');
const blueColor = document.querySelector('#blue_color');

const widthframe = A[0].length;
const heightframe = A.length;
const scaleframe = 128;
const CURRENT_INDEX_NAME = 'currentFrame';
const FRAMES_COUNT = 'framesCount';

// индекс текущего фрейма
let currentFrameIndex = -1;

const getFrameId = (index) => `#canvas_frame_${index}`;
const getCurrentFrameId = () => getFrameId(currentFrameIndex);

// массив кадров
const frames = [];

const getFrameContext = (index) => {
  const canvasframe = document.querySelector(getFrameId(index));
  return canvasframe.getContext('2d');
};

const getCurrentFrameContext = () => getFrameContext(currentFrameIndex);

// const getCurrentTime = () => ((new Date()).getTime());

const animationPlayerCanvas = document.getElementById('animation_player');
const animationPlayerContext = animationPlayerCanvas.getContext('2d');

animationPlayerCanvas.width = widthframe * scaleframe;
animationPlayerCanvas.height = heightframe * scaleframe;

const animate = (index = 0, totalFrames) => {
  if (!animationRunning) {
    return;
  }

  const dataFrameURL = localStorage.getItem(getFrameId(index));
  if (dataFrameURL) {
    animationPlayerContext
      .clearRect(0, 0, animationPlayerCanvas.width, animationPlayerCanvas.height);
    const savedImage = new Image();
    savedImage.src = dataFrameURL;
    savedImage.onload = function drawSavedCanvas() {
      animationPlayerContext.drawImage(savedImage, 0, 0);
    };
  }

  if (index >= totalFrames) {
    index = -1;
  }

  requestAnimFrame(() => {
    animate(index + 1, totalFrames);
  });
};

const toggleAnimationPlaying = (value) => {
  animationRunning = value;
  if (value) {
    animate(0, frames.length);
  }
};

const playButton = document.getElementById('play_btn');
const stopButton = document.getElementById('stop_btn');
playButton.addEventListener('click', () => toggleAnimationPlaying(true));
stopButton.addEventListener('click', () => toggleAnimationPlaying(false));

const mainCanvas = document.querySelector('#canvas');
const mainCtx = mainCanvas.getContext('2d');
let width = A[0].length;
let height = A.length;
let scale = 128;

mainCanvas.width = width * scale;
mainCanvas.height = height * scale;

const addFrameBtn = document.querySelector('#add_new_frame_btn');
// const frameSection = document.querySelector('#frame_section');
const frameContainer = document.querySelector('#frame_section--container');

const redrawMainFrame = (dataFrameURL) => {
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  if (dataFrameURL) {
    const savedImage = new Image();
    savedImage.src = dataFrameURL;
    savedImage.onload = function drawSavedCanvas() {
      mainCtx.drawImage(savedImage, 0, 0);
    };
  }
};

const selectFrame = (index) => {
  const frameId = getFrameId(index);
  const dataFrameURL = localStorage.getItem(frameId);
  redrawMainFrame(dataFrameURL);
  currentFrameIndex = index;
};

const addFrame = (dataURLframe) => {
  currentFrameIndex = frames.length;
  const newFrameCanvas = document.createElement('canvas');
  frameContainer.appendChild(newFrameCanvas);
  newFrameCanvas.classList.add('frame_section--frame_canvas');
  newFrameCanvas.dataset.index = currentFrameIndex;
  newFrameCanvas.id = `canvas_frame_${currentFrameIndex}`;
  frames.push(newFrameCanvas);

  newFrameCanvas.width = widthframe * scaleframe;
  newFrameCanvas.height = heightframe * scaleframe;

  if (dataURLframe) {
    const savedImageframe = new Image();
    savedImageframe.src = dataURLframe;
    savedImageframe.onload = function drawSavedCanvasFrame() {
      const ctxframe = newFrameCanvas.getContext('2d');
      ctxframe.drawImage(savedImageframe, 0, 0);
    };
  }

  newFrameCanvas.addEventListener('click', () => {
    selectFrame(newFrameCanvas.dataset.index);
  });

  frameContainer.addEventListener('click', () => {
    frameContainer.lastChild.classList.toggle('last_frame');
    newFrameCanvas.classList.toggle('last_frame');
    // const frame = event.target.closest('.frame_section--frame_canvas');
    document.querySelectorAll('.frame_section--frame_canvas').forEach((el) => el.classList.remove('last_frame'));
    const lastFrame = frameContainer.lastChild;
    lastFrame.classList.add('last_frame');
  });
};

const onAddFrameClick = () => {
  redrawMainFrame();
  addFrame();
};

// добавление фреймов
addFrameBtn.addEventListener('click', onAddFrameClick);

// for pencil to save color
let xx; // cur color

const loadPicBtn = document.querySelector('#loadPic');
const makeBWBtn = document.querySelector('#makeBW');

function showFirst() {
  width = A[0].length;
  height = A.length;
  scale = 128;
  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      mainCtx.fillStyle = `#${A[row][col]}`;
      mainCtx.fillRect(col * scale, row * scale, scale, scale);
    }
  }
}

function showSecond() {
  scale = 16;
}

function showThird() {
  const img1 = new Image();

  img1.onload = function showThirdImg() {
    mainCtx.drawImage(img1, 0, 0, mainCanvas.width, mainCanvas.height);
  };
  img1.src = 'assets/images/image.png';
}

first.addEventListener('click', showFirst);
second.addEventListener('click', showSecond);
third.addEventListener('click', showThird);

// add cursor
function setCursorClass() {
  if (pencilLine.classList.contains('active_tool')) {
    mainCanvas.classList.add('active_pencil');
    mainCanvas.classList.remove('active_fill');
    mainCanvas.classList.remove('active_pipette');
    mainCanvas.classList.remove('active_stroke');
    mainCanvas.classList.remove('active_eraser');
  } else if (fillLine.classList.contains('active_tool')) {
    mainCanvas.classList.remove('active_pencil');
    mainCanvas.classList.add('active_fill');
    mainCanvas.classList.remove('active_pipette');
    mainCanvas.classList.remove('active_stroke');
    mainCanvas.classList.remove('active_eraser');
  } else if (pipetteLine.classList.contains('active_tool')) {
    mainCanvas.classList.remove('active_pencil');
    mainCanvas.classList.remove('active_fill');
    mainCanvas.classList.add('active_pipette');
    mainCanvas.classList.remove('active_stroke');
    mainCanvas.classList.remove('active_eraser');
  } else if (strokeLine.classList.contains('active_tool')) {
    mainCanvas.classList.remove('active_pencil');
    mainCanvas.classList.remove('active_fill');
    mainCanvas.classList.remove('active_pipette');
    mainCanvas.classList.add('active_stroke');
    mainCanvas.classList.remove('active_eraser');
  } else if (eraserLine.classList.contains('active_tool')) {
    mainCanvas.classList.remove('active_pencil');
    mainCanvas.classList.remove('active_fill');
    mainCanvas.classList.remove('active_pipette');
    mainCanvas.classList.remove('active_stroke');
    mainCanvas.classList.add('active_eraser');
  }
}

// for drawWithPencil
const mouse = { x: 0, y: 0 };
let isMouseDown = false;

// draw with pencil
function drawWithPencil() {
  mainCanvas.addEventListener('mousedown', function drawWithPencilDown(e) {
    if (pencilLine.classList.contains('active_tool')) {
      isMouseDown = true;
      mainCtx.beginPath();
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
      mainCtx.moveTo(mouse.x, mouse.y);
    }
  });

  mainCanvas.addEventListener('mousemove', function drawWithPencilMove(e) {
    if (pencilLine.classList.contains('active_tool')) {
      if (isMouseDown) {
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        mainCtx.lineTo(mouse.x, mouse.y);
        mainCtx.strokeStyle = xx;
        mainCtx.stroke();
      }
    }
  });

  mainCanvas.addEventListener('mouseup', function drawWithPencilUp(e) {
    if (pencilLine.classList.contains('active_tool')) {
      mainCtx.beginPath();
      isMouseDown = false;
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
      mainCtx.lineTo(mouse.x, mouse.y);
      mainCtx.stroke();
      mainCtx.closePath();
    }
  });
}

if (pencilLine.classList.contains('active_tool')) {
  drawWithPencil();
}

// clear canvas
const clearCanvasBtn = document.getElementById('clear_canvas_btn');

clearCanvasBtn.addEventListener('click', () => {
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
});

function chooseCurrentColor(event) {
  xx = event.target.value;
}

function addPrevToCurColor(event) {
  event.preventDefault();
  currentColor.value = event.target.value;
  xx = event.target.value;
}

function addPrevColor(event) {
  prevColor.value = event.target.value;
}

function addPredefinedColor(event) {
  event.preventDefault();
  prevColor.value = currentColor.value;
}

function chooseRedColor(event) {
  event.preventDefault();

  currentColor.value = event.target.value;
  xx = event.target.value;
}

function chooseBlueColor(event) {
  event.preventDefault();

  currentColor.value = event.target.value;
  xx = event.target.value;
}

// save current color
currentColor.addEventListener('input', chooseCurrentColor);
prevColor.addEventListener('click', addPrevToCurColor);
// for prev color
currentColor.addEventListener('click', addPrevColor);
redColor.addEventListener('click', addPredefinedColor);
redColor.addEventListener('click', chooseRedColor);
blueColor.addEventListener('click', addPredefinedColor);
blueColor.addEventListener('click', chooseBlueColor);

// fill bucket
function fillBucket() {
  mainCanvas.addEventListener('click', () => {
    if (fillLine.classList.contains('active_tool')) {
      mainCtx.beginPath();
      mainCtx.rect(0, 0, mainCanvas.width, mainCanvas.height);
      mainCtx.fillStyle = currentColor.value;
      mainCtx.fill();
    }
  });
}

// pipette
function getColor() {
  mainCanvas.addEventListener('mousedown', function getColorDown(e) {
    function findPos(obj) {
      let curLeft = 0; let
        curTop = 0;
      if (obj.offsetParent) {
        do {
          curLeft += obj.offsetLeft;
          curTop += obj.offsetTop;
        } while (obj === obj.offsetParent);
        return { x: curLeft, y: curTop };
      }
      return undefined;
    }

    function rgbToHex(r, g, b) {
      return ((r << 16) | (g << 8) | b).toString(16);
    }

    if (pipetteLine.classList.contains('active_tool')) {
      const pos = findPos(this);
      const x = e.pageX - pos.x;
      const y = e.pageY - pos.y;
      const canv = this.getContext('2d');
      const p = canv.getImageData(x, y, 1, 1).data;
      const hex = `#${rgbToHex(p[0], p[1], p[2])}`;
      currentColor.value = hex;
      const prevColPipette = currentColor.value;

      mainCanvas.addEventListener('mousedown', () => {
        prevColor.value = prevColPipette;
      });
    }
  });
}

// stroke
function drawStroke() {
  if (strokeLine.classList.contains('active_tool')) {
    const offsetX = mainCanvas.offsetLeft;
    const offsetY = mainCanvas.offsetTop;

    const storedLines = [];
    let startX = 0;
    let startY = 0;
    let isDown;

    mainCtx.strokeStyle = currentColor.value;
    mainCtx.lineWidth = 3;

    function handleMouseDown(e) {
      const mouseX = parseInt(e.clientX - offsetX);
      const mouseY = parseInt(e.clientY - offsetY);
      isDown = true;
      startX = mouseX;
      startY = mouseY;
    }

    function redrawStoredLines() {
      mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
      if (storedLines.length === 0) {
        return;
      }
      // redraw each stored line
      for (let i = 0; i < storedLines.length; i += 1) {
        mainCtx.beginPath();
        mainCtx.moveTo(storedLines[i].x1, storedLines[i].y1);
        mainCtx.lineTo(storedLines[i].x2, storedLines[i].y2);
        mainCtx.stroke();
      }
    }

    function handleMouseMove(e) {
      if (!isDown) {
        return;
      }
      redrawStoredLines();
      const mouseX = parseInt(e.clientX - offsetX);
      const mouseY = parseInt(e.clientY - offsetY);
      // draw the current line
      mainCtx.beginPath();
      mainCtx.moveTo(startX, startY);
      mainCtx.lineTo(mouseX, mouseY);
      mainCtx.stroke();
    }

    function handleMouseUp(e) {
      isDown = false;
      const mouseX = parseInt(e.clientX - offsetX);
      const mouseY = parseInt(e.clientY - offsetY);
      storedLines.push({
        x1: startX,
        y1: startY,
        x2: mouseX,
        y2: mouseY,
      });
      redrawStoredLines();
    }

    mainCanvas.addEventListener('mousedown', (e) => {
      if (strokeLine.classList.contains('active_tool')) {
        handleMouseDown(e);
      }
    });
    mainCanvas.addEventListener('mousemove', (e) => {
      if (strokeLine.classList.contains('active_tool')) {
        handleMouseMove(e);
      }
    });
    mainCanvas.addEventListener('mouseup', (e) => {
      if (strokeLine.classList.contains('active_tool')) {
        handleMouseUp(e);
      }
    });
  }
}

// if (strokeLine.classList.contains('active_tool')) {
//   drawStroke();
// }

// eraser
function eraserDraw(e) {
  if (eraserLine.classList.contains('active_tool')) {
    if (isMouseDown) {
      const penX = e.offsetX;
      const penY = e.offsetY;
      const eraserWidth = 10;
      const eraserHeight = 10;
      mainCtx.clearRect(penX, penY, eraserWidth, eraserHeight);
    }
    mainCtx.globalCompositeOperation = 'source-over';
    mainCanvas.removeEventListener('mousemove', () => eraserDraw());
  }
}

function erase() {
  isMouseDown = false;

  mainCanvas.addEventListener('mousedown', () => {
    isMouseDown = true;
  });

  mainCanvas.addEventListener('mousemove', (e) => eraserDraw(e));

  document.body.addEventListener('mouseup', () => {
    isMouseDown = false;
  });
}
// }

// if(eraserLine.classList.contains('active_tool')) {
//   erase();
// }


// choose tool on click
settingsPanel.addEventListener('click', (event) => {
  const tool = event.target.closest('.settings_panel--item');
  document.querySelectorAll('.settings_panel--item').forEach((el) => el.classList.remove('active_tool'));
  tool.classList.add('active_tool');
  getColor();
  fillBucket();
  drawWithPencil();
  setCursorClass();
  drawStroke();
  erase();
});

const fullScreenBtn = document.getElementById('full_screen_btn');
// fullScreenBtn.addEventListener('click', () => {
//   fullScreenBtn.requestFullScreen ()
// })

function toggleFullScreen() {
  if (!animationPlayerCanvas.fullscreenElement) {
    animationPlayerCanvas.requestFullscreen();
  } else if (animationPlayerCanvas.exitFullscreen) {
    animationPlayerCanvas.exitFullscreen();
  }
}

fullScreenBtn.addEventListener('click', () => {
  toggleFullScreen();
}, false);

// choose tool on keyboard
const KEY_ENTER = 13;
const KEY_P = 80;
const KEY_B = 66;
const KEY_C = 67;
const KEY_S = 83;
const KEY_E = 69;

document.addEventListener('keydown', (e) => {
  if (e.keyCode === KEY_ENTER) {
    toggleFullScreen();
  }
  if (e.keyCode === KEY_P) {
    // paint pencil
    pencilLine.classList.add('active_tool');
    fillLine.classList.remove('active_tool');
    pipetteLine.classList.remove('active_tool');
    strokeLine.classList.remove('active_tool');
    eraserLine.classList.remove('active_tool');
    setCursorClass();
    drawWithPencil();
  }

  if (e.keyCode === KEY_B) {
    // fill bucket
    pencilLine.classList.remove('active_tool');
    fillLine.classList.add('active_tool');
    pipetteLine.classList.remove('active_tool');
    strokeLine.classList.remove('active_tool');
    eraserLine.classList.remove('active_tool');
    setCursorClass();
    fillBucket();
  }

  if (e.keyCode === KEY_C) {
    // pipette
    pencilLine.classList.remove('active_tool');
    fillLine.classList.remove('active_tool');
    pipetteLine.classList.add('active_tool');
    strokeLine.classList.remove('active_tool');
    eraserLine.classList.remove('active_tool');
    setCursorClass();
    getColor();
  }
  if (e.keyCode === KEY_S) {
    // stroke
    pencilLine.classList.remove('active_tool');
    fillLine.classList.remove('active_tool');
    pipetteLine.classList.remove('active_tool');
    strokeLine.classList.add('active_tool');
    eraserLine.classList.remove('active_tool');
    setCursorClass();
    drawStroke();
  }
  if (e.keyCode === KEY_E) {
    // pipette
    pencilLine.classList.remove('active_tool');
    fillLine.classList.remove('active_tool');
    pipetteLine.classList.remove('active_tool');
    strokeLine.classList.remove('active_tool');
    eraserLine.classList.add('active_tool');
    setCursorClass();
    getColor();
  }
});

// Save frames to local storage
window.onbeforeunload = function beforeLoad() {
  localStorage.setItem(FPS, fps);
  localStorage.setItem(FRAMES_COUNT, frames.length);
  localStorage.setItem(mainCanvas, mainCanvas.toDataURL());
  localStorage.setItem(CURRENT_INDEX_NAME, currentFrameIndex);
  frames.forEach((value, index) => {
    this.localStorage.setItem(getFrameId(index), value.toDataURL());
  });

  return false;
};

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem(FPS)) {
    fps = localStorage.getItem(FPS);
  }
  fpsInput.value = fps;
  const initialFramesCount = localStorage.getItem(FRAMES_COUNT);
  for (let i = 0; i < initialFramesCount; i += 1) {
    const dataURLframe = localStorage.getItem(getFrameId(i));
    addFrame(dataURLframe);
  }

  currentFrameIndex = 0;
  selectFrame(currentFrameIndex);
});

mainCanvas.addEventListener('mouseup', () => {
  localStorage.setItem(getCurrentFrameId(), mainCanvas.toDataURL());
  const dataURLframe = localStorage.getItem(getCurrentFrameId());
  const savedImageframe = new Image();
  savedImageframe.src = dataURLframe;
  savedImageframe.onload = function drawSavedCanvasFrame() {
    const ctxFrame = getCurrentFrameContext();
    ctxFrame.drawImage(savedImageframe, 0, 0);
  };
});

// save gif
const saveGif = document.getElementById('save_gif');

function saveGifImg() {
  const encoder = new GIFEncoder();
  encoder.setRepeat(0);
  encoder.setDelay(fps);
  encoder.start();
  for (let i = 0; i < frames.length; i += 1) {
    encoder.addFrame(frames[i].getContext('2d'));
  }
  encoder.finish();
  encoder.download('download.gif');
}

saveGif.addEventListener('click', saveGifImg);

// save apng
function downloadAPNG(iLink) {
  const encoder = new APNGencoder(animationPlayerCanvas);
  encoder.setRepeat(0); 
  encoder.setDelay(fps);
  encoder.setDispose(0);
  encoder.setBlend(1);

  encoder.start();
  for (let i = 0; i < frames.length; i += 1) {
    encoder.addFrame(frames[i].getContext('2d'));
  }
  encoder.finish();

  const base64Out = bytesToBase64(encoder.stream().bin); // ANIMATION

  // var img = document.getElementById("imgAnimPNG");
  const imgAPNG = animationPlayerCanvas;
  imgAPNG.style.width = animationPlayerCanvas.width;
  imgAPNG.style.height = animationPlayerCanvas.height;
  imgAPNG.src = `data:image/png;base64,${base64Out}`;

  // if (typeof encoder === 'undefined' || encoder.stream() == null || encoder.closeStream==false) {
  //   alert("Please call start method and add frames and call finish method before calling download");
  //   return 0;
  // }
  const out = encoder.stream();
  const href = URL.createObjectURL(new Blob([new Uint8Array(out.bin)], { type: 'image/png' }));
  iLink.href = href;
  iLink.download = 'animation.png'; // filename
  return 0;
}

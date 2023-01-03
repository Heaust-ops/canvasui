import { CanvasUIDom } from "./lib/dom";
import { CanvasUIDiv } from "./lib/elements/div";
import "./style.css";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById(
  "typing_game_canvas"
) as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

/** SETUP CANVAS RESPONSIVENESS */

/**
 * Take canvas width as computed by CSS,
 * and use it to infer aspect ratio and
 * canvas resolution
 */
const resizeCanvas = () => {
  const scale = window.devicePixelRatio;
  const ws = getComputedStyle(canvas).getPropertyValue(`width`);
  const w = +ws.slice(0, ws.length - 2);

  const h = (3 * w) / 4;

  canvas.style.height = `${h}px`;
  canvas.width = Math.floor(w * scale);
  canvas.height = Math.floor(h * scale);
};

resizeCanvas();

/**
 * LIBRARY STUFF
 */

const dom = new CanvasUIDom(canvas, ctx);
const { aspectCorrect } = dom;

const testDiv = new CanvasUIDiv({
  left: aspectCorrect(20).x,
  top: 20,
  width: aspectCorrect(50).x,
  height: 50,
  rotation: 45,
  bgColor: "#79A99D",
  borderColor: "#ffffff",
  borderWidth: 5,
});

const testDiv2 = new CanvasUIDiv({
  ...testDiv.style,
  bgColor: "#DB9471",
  rotation: 23,
  opacity: 0.95,
  blend: "overlay",
});

testDiv.appendChild(testDiv2);
dom.appendChild(testDiv);

/**
 * LIBRARY STUFF END
 */

const resizeObserver = new ResizeObserver(() => setTimeout(resizeCanvas, 15));
resizeObserver.observe(canvas);

let prevTime = Date.now();
const animate = () => {
  requestAnimationFrame(animate);
  const delta = Date.now() - prevTime;

  if (delta < 1000 / 120)
    /** cap @ 60?fps */
    return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  prevTime = Date.now();
  dom.cycle(delta);
};

animate();

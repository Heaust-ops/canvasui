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

const dom = new CanvasUIDom(canvas, ctx);
const { aspectCorrect } = dom;

const testDiv = new CanvasUIDiv({
  left: aspectCorrect(1).x,
  top: 1,
  width: aspectCorrect(50).x,
  height: 50,
  rotation: 0,
  pivot: [0, 0],
});
dom.appendChild(testDiv);

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

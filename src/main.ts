import { CanvasUIDom } from "./lib/dom";
import { CanvasUIDiv } from "./lib/elements/div";
import { CanvasUIImage } from "./lib/elements/image";
import "./style.css";

const imageurl1 =
  "https://upload.wikimedia.org/wikipedia/commons/e/eb/Ash_Tree_-_geograph.org.uk_-_590710.jpg";
const imageurl2 =
  "https://daily.jstor.org/wp-content/uploads/2020/06/why_you_should_learn_the_names_of_trees_1050x700.jpg";

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
  borderWidth: 10,
  cursor: "grab",
  hover: {
    bgColor: "#CC7B1E",
    rotation: 0,
  },
  active: {
    bgColor: "#AF1ECC",
    scale: [0.5, 1],
    cursor: "grabbing",
  },
});

const testImage = new CanvasUIImage(imageurl1, {
  top: 0,
  left: 0,
  width: 100,
  height: 100,
  rotation: 23,
  orientation: "inherit",
}).preload([imageurl2]);

testDiv.appendChild(testImage);
testDiv.onClick = () => {
  testImage.src = testImage.src === imageurl2 ? imageurl1 : imageurl2;
};

dom.appendChild(testDiv);

dom.hookListeners();

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
  // dom.translate(
  //   10 * Math.sin(Date.now() / 100),
  //   10 * Math.cos(Date.now() / 100)
  // );
  dom.cycle(delta);
};

animate();

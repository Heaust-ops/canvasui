import { Buffer, Option } from "../utils/types";
import { Vector } from "../utils/vector";
import { CanvasUIDom } from "./dom";
import { EventManager } from "./events";

export interface CanvasUIBaseStyle {
  /** Orientation */
  top: number;
  left: number;
  rotation: number;
  scale: number;
  /** Size */
  width: number;
  height: number;
  /** transparency */
  opacity: number;
  /** pivot of rotation, 0 = center, 1 = right / bottom, -1 = left / top */
  pivot: [number, number];
  /** for animation purposes */
  transition: Option<number>;
  /** null for normal, 'color-dodge', 'overlay' and stuff like that */
  blend: Option<string>;
  /** is the given orientation */
  orientation: "inherit" | "absolute";
}

const defaultCanvasUIBaseStyle = {
  top: 0,
  left: 0,
  rotation: 0,
  scale: 1,
  width: 0,
  height: 0,
  opacity: 0,
  pivot: [0, 0],
  transition: null,
  blend: null,
  orientation: "absolute",
} as CanvasUIBaseStyle;

export class CanvasUIElement extends EventManager {
  style: CanvasUIBaseStyle;
  children: CanvasUIElement[];
  id: string;
  parent: Option<CanvasUIElement>;
  dom: Option<CanvasUIDom>;

  constructor(
    style: Partial<CanvasUIBaseStyle & { right: number; bottom: number }>
  ) {
    super();
    const { right, bottom, ...baseStyles } = style;
    let inferred = {} as { top?: number; left?: number };
    if (right) inferred.left = 100 - right;
    if (bottom) inferred.top = 100 - bottom;

    this.style = {
      ...defaultCanvasUIBaseStyle,
      ...baseStyles,
      ...inferred,
    };

    this.children = [];
    this.id = crypto.randomUUID();
  }

  draw = (_ctx: CanvasRenderingContext2D): void => {
    throw new Error(
      "You're using the base Element abstract method, please override"
    );
  };

  update = (_delay: number): void => {
    throw new Error(
      "You're using the base Element abstract method, please override"
    );
  };

  push(child: CanvasUIElement) {
    child.parent = this;
    this.children.push(child);
  }

  private _canvasUIElementPreCycle = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.resetTransform();

    ctx.translate(...this.center.buffer);
    const pivot = this.pivot;

    ctx.translate(...pivot.buffer); /** Go to Pivot */
    ctx.rotate((Math.PI / 180) * this.style.rotation); /** Rotate */
    ctx.translate(...pivot.mul(-1).buffer); /** Return back to center */
    ctx.translate(...this.dimensions.mul(-0.5).buffer); /** Go to top Left */
  };

  private _canvasUIElementPostCycle = (ctx: CanvasRenderingContext2D) => {
    ctx.restore();
  };

  readonly cycle = (ctx: CanvasRenderingContext2D, delay: number) => {
    if (!this.dom) return;
    this._canvasUIElementPreCycle(ctx);

    this.update(delay);
    this.draw(ctx);

    /** Cycle the children that inherit before reversing transforms */
    const pending = [] as CanvasUIElement[];
    for (const child of this.children) {
      if (child.style.orientation === "inherit") child.cycle(ctx, delay);
      else pending.push(child);
    }

    this._canvasUIElementPostCycle(ctx);

    for (const child of pending) child.cycle(ctx, delay);
  };

  /** Get stuff in vector format */

  get center() {
    return this.position.add(this.dimensions.div(2));
  }

  get pivot() {
    return (new Vector(this.style.pivot.slice() as Buffer<2>) as Vector<2>).mul(
      this.dimensions.clone.div(2)
    );
  }

  get position() {
    const { left, top } = this.style;
    return new Vector([left, top])
      .div(100)
      .mul([this.dom!.canvas.width, this.dom!.canvas.height]) as Vector<2>;
  }

  get dimensions() {
    const { width, height } = this.style;
    return new Vector([width, height])
      .div(100)
      .mul([this.dom!.canvas.width, this.dom!.canvas.height]) as Vector<2>;
  }
}
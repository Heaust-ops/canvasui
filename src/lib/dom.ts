import { Vector } from "../utils/vector";
import { CanvasUIElement } from "./element";

export class CanvasUIDom {
  nodes: CanvasUIElement[];
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  pointer: Vector<2>;
  hotkeyStack: string[];
  camera: { position: Vector<2>; rotation: number; scale: number };
  currentCursor: string;
  revertCursor: boolean;
  standbyCursor: string;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.nodes = [];
    this.canvas = canvas;
    this.ctx = ctx;
    this.pointer = new Vector([-1, -1]);
    this.hotkeyStack = [];
    this.currentCursor = this.standbyCursor = "auto";
    this.revertCursor = true;

    this.camera = {
      position: new Vector([0, 0]),
      rotation: 0,
      scale: 1,
    };
  }

  set cursor(arg: string) {
    if (arg !== this.currentCursor) {
      this.canvas.style.cursor = arg;
      this.currentCursor = arg;
    }
  }

  readonly cycle = (delay: number) => {
    this.revertCursor = true;
    for (const node of this.nodes) node.cycle(this.ctx, delay);

    this.ctx.save();

    this.ctx.resetTransform();
    const { position, rotation, scale } = this.camera;

    this.ctx.translate(...position.clone.mul(-1).buffer);
    this.ctx.rotate(rotation);
    this.ctx.scale(scale, scale);

    this.ctx.restore();

    if (this.revertCursor) this.cursor = this.standbyCursor;
  };

  aspectCorrect = (arg: number) => {
    const aspect = this.canvas.width / this.canvas.height;

    return {
      x: arg / aspect,
      y: arg * aspect,
    };
  };

  readonly appendChild = (node: CanvasUIElement) => {
    node.dom = this;
    this._traverseNode(node, (el) => {
      el.dom = this;
    });
    node.id = crypto.randomUUID();
    node.style.orientation = "absolute";
    this.nodes.push(node);
  };

  getElementById = (id: string) => {
    let queriedNode = null as CanvasUIElement | null;

    this._traverseNodes((node) => {
      if (node.id === id) queriedNode = node;
    });

    return queriedNode;
  };

  private _traverseNode = (
    node: CanvasUIElement,
    func: (node: CanvasUIElement) => void
  ) => {
    func(node);
    if (!node.children) return;
    for (const child of node.children) {
      this._traverseNode(child, func);
    }
  };

  private _traverseNodes = (func: (node: CanvasUIElement) => void) => {
    for (const node of this.nodes) {
      this._traverseNode(node, func);
    }
  };

  /**
   * EVENT MANAGEMENT
   */
  /**
   * Subscribes to all the events and propagates
   */
  readonly hookListeners = () => {
    document.addEventListener("mousemove", this._onMouseMove);
    document.addEventListener("mousedown", this._onMouseDown);
    document.addEventListener("mouseup", this._onMouseUp);
    document.addEventListener("keydown", this._onKeyDown);
    document.addEventListener("keyup", this._onKeyUp);
  };

  /**
   * Unsubscribes to events and stops propagation
   */
  readonly unhookListeners = () => {
    document.removeEventListener("mousemove", this._onMouseMove);
    document.removeEventListener("mousedown", this._onMouseDown);
    document.removeEventListener("mouseup", this._onMouseUp);
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("keyup", this._onKeyUp);
  };

  private _refreshPointer = (e: MouseEvent) => {
    const { top, left } = this.canvas.getBoundingClientRect();
    const x = (e.clientX - left) * window.devicePixelRatio;
    const y = (e.clientY - top) * window.devicePixelRatio;

    if (x < 0 || x > this.canvas.width) return false;
    if (y < 0 || y > this.canvas.height) return false;

    this.pointer.x = x;
    this.pointer.y = y;

    // Math.random() < 0.2 &&
    //   console.log("Mouse pointer is at:", ...this.pointer.buffer);
    return true;
  };

  private _onMouseUp = (e: MouseEvent) => {
    if (!this._refreshPointer(e)) return;

    /** run the event for all children  */
    for (const node of this.nodes) node._onMouseUp(this.pointer);
  };

  private _onMouseDown = (e: MouseEvent) => {
    if (!this._refreshPointer(e)) return;

    /** run the event for all children  */
    for (const node of this.nodes) node._onMouseDown(this.pointer);
  };

  private _onMouseMove = (e: MouseEvent) => {
    if (!this._refreshPointer(e)) return;

    /** run the event for all children  */
    for (const node of this.nodes) node._onMouseMove(this.pointer);
  };

  private _onKeyDown = (e: KeyboardEvent) => {
    /** Update hotkeyStack */
    const targetKey = e.key.toLowerCase();

    const existingIndex = this.hotkeyStack.indexOf(targetKey);
    if (existingIndex !== -1)
      /** Ensure the key isn't already in the stack, it was just pressed */
      this.hotkeyStack = this.hotkeyStack.filter((el) => el !== targetKey);

    this.hotkeyStack.push(targetKey);

    /** run the event for all children  */
    for (const node of this.nodes) node._onKeyDown(e.key, this.hotkeyStack);
  };

  private _onKeyUp = (e: KeyboardEvent) => {
    const targetKey = e.key.toLowerCase();
    if (this.hotkeyStack.indexOf(targetKey) !== -1)
      this.hotkeyStack = this.hotkeyStack.filter((el) => el !== targetKey);

    /** run the event for all children  */
    for (const node of this.nodes) node._onKeyUp(e.key, this.hotkeyStack);
  };
}

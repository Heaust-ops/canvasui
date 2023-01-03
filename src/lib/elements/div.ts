import { CanvasUIBaseStyle, CanvasUIElement } from "../element";

export {};

export class CanvasUIDiv extends CanvasUIElement {
  constructor(
    style: Partial<CanvasUIBaseStyle & { right: number; bottom: number }> = {}
  ) {
    super(style);
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#07AAB9";
    ctx.fillRect(0, 0, ...this.dimensions.buffer);
  };
  update = () => {};
}

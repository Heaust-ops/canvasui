import { Color } from "../../utils/color";
import { Option } from "../../utils/types";
import { CanvasUIBaseStyle, CanvasUIElement } from "../element";

export interface CanvasUIDivStyle {
  bgColor: Color | string;
  borderType: "dashed" | "dotted" | "line";
  borderRadius: Option<number>;
  borderWidth: number;
  borderColor: Color | string;
}

const defaultStyles = {
  bgColor: new Color(),
  borderColor: new Color(),
  borderWidth: 0,
  borderType: "line",
} as CanvasUIDivStyle;

export class CanvasUIDiv extends CanvasUIElement {
  declare style: CanvasUIDivStyle &
    CanvasUIBaseStyle & { bgColor: Color; borderColor: Color };

  constructor(
    style: Partial<
      CanvasUIBaseStyle & {
        right: number;
        bottom: number;
      } & CanvasUIDivStyle
    > = {}
  ) {
    if (typeof style.bgColor === "string")
      style.bgColor = new Color(style.bgColor);
    if (typeof style.borderColor === "string")
      style.borderColor = new Color(style.borderColor);

    style = {
      ...defaultStyles,
      ...style,
    };

    super(style);
  }

  readonly draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = this.style.bgColor.rgba;
    ctx.strokeStyle = this.style.borderColor.rgba;
    ctx.lineWidth = this.style.borderWidth;

    this.setCtxSettings(ctx);
    ctx.fillRect(0, 0, ...this.dimensions.buffer);
    if (ctx.lineWidth) ctx.strokeRect(0, 0, ...this.dimensions.buffer);
  };
  readonly update = () => {};
}

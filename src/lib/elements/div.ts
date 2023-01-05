import { Color } from "../../utils/color";
import { Option } from "../../utils/types";
import { CanvasUIBaseStyle, CanvasUIElement } from "../element";

export interface CanvasUIDivStyle extends CanvasUIBaseStyle {
  bgColor: Color | string;
  borderType: "dashed" | "dotted" | "line";
  borderRadius: Option<number>;
  borderWidth: number;
  borderColor: Color | string;
  hover: Option<Partial<CanvasUIDivStyle>>;
  active: Option<Partial<CanvasUIDivStyle>>;
}

const defaultStyles = {
  bgColor: new Color(),
  borderColor: new Color(),
  borderWidth: 0,
  borderType: "line",
} as CanvasUIDivStyle;

export class CanvasUIDiv extends CanvasUIElement {
  declare style: CanvasUIDivStyle;

  constructor(
    style: Partial<
      CanvasUIDivStyle & {
        right: number;
        bottom: number;
      }
    > = {}
  ) {
    style = {
      ...defaultStyles,
      ...style,
    };

    super(style);
  }

  readonly draw = (ctx: CanvasRenderingContext2D) => {
    if (typeof this.style.bgColor === "string")
      this.style.bgColor = new Color(this.style.bgColor);
    if (typeof this.style.borderColor === "string")
      this.style.borderColor = new Color(this.style.borderColor);

    ctx.fillStyle = this.style.bgColor.rgba;
    ctx.strokeStyle = this.style.borderColor.rgba;
    ctx.lineWidth = this.style.borderWidth;

    this.setCtxSettings(ctx);
    ctx.fillRect(0, 0, ...this.dimensions.buffer);
    if (ctx.lineWidth) ctx.strokeRect(0, 0, ...this.dimensions.buffer);
  };
  readonly update = () => {};
}

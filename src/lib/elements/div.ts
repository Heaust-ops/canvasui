import { Color } from "../../utils/color";
import { Buffer, Option } from "../../utils/types";
import { Vector } from "../../utils/vector";
import { CanvasUIBaseStyle, CanvasUIElement } from "../element";

export interface CanvasUIDivStyle extends CanvasUIBaseStyle {
  bgColor: Color | string;
  borderType: "dashed" | "dotted" | "line";
  borderRadius: Option<number | Buffer<4>>;
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

  get borderRadius() {
    return new Vector([0, 0, 0, 0])
      .add(this.style.borderRadius ?? 0)
      .mul(this.dimensions.x! / 100);
  }

  readonly draw = (ctx: CanvasRenderingContext2D) => {
    if (typeof this.style.bgColor === "string")
      this.style.bgColor = new Color(this.style.bgColor);
    if (typeof this.style.borderColor === "string")
      this.style.borderColor = new Color(this.style.borderColor);

    ctx.fillStyle = this.style.bgColor.rgba;
    ctx.strokeStyle = this.style.borderColor.rgba;
    ctx.lineWidth = (this.style.borderWidth / 1080) * this.dom!.canvas.width;

    this.setCtxSettings(ctx);
    if (this.style.borderRadius) {
      const radius = this.borderRadius;

      const [width, height] = this.dimensions.buffer;

      // Set the border radii for each corner
      const topLeftRadius = radius.r!;
      const topRightRadius = radius.g!;
      const bottomRightRadius = radius.b!;
      const bottomLeftRadius = radius.a!;

      // Set up the clip path
      ctx.beginPath();
      ctx.moveTo(topLeftRadius, 0);
      ctx.lineTo(width - topRightRadius, 0);
      ctx.quadraticCurveTo(width, 0, width, topRightRadius);
      ctx.lineTo(width, height - bottomRightRadius);
      ctx.quadraticCurveTo(width, height, width - bottomRightRadius, height);
      ctx.lineTo(bottomLeftRadius, height);
      ctx.quadraticCurveTo(0, height, 0, height - bottomLeftRadius);
      ctx.lineTo(0, topLeftRadius);
      ctx.quadraticCurveTo(0, 0, topLeftRadius, 0);
      ctx.closePath();

      ctx.fill();
      if (ctx.lineWidth) ctx.stroke();
    } else {
      ctx.fillRect(0, 0, ...this.dimensions.buffer);
      if (ctx.lineWidth) ctx.strokeRect(0, 0, ...this.dimensions.buffer);
    }
  };
  readonly update = () => {};
}

import { Color } from "../../utils/color";
import { Buffer, Option } from "../../utils/types";
import { Vector } from "../../utils/vector";
import { CanvasUIBaseStyle, CanvasUIElement } from "../element";

export interface CanvasUIImageStyle extends CanvasUIBaseStyle {
  borderType: "dashed" | "dotted" | "line";
  borderRadius: Option<number | Buffer<4>>;
  borderWidth: number;
  borderColor: Color | string;
  hover: Option<Partial<CanvasUIImageStyle>>;
  active: Option<Partial<CanvasUIImageStyle>>;
}

const defaultStyles = {
  borderColor: new Color(),
  borderWidth: 0,
  borderType: "line",
} as CanvasUIImageStyle;

export class CanvasUIImage extends CanvasUIElement {
  declare style: CanvasUIImageStyle;
  private _src: string;
  private _preloaded: Record<string, HTMLCanvasElement>;
  cache: HTMLCanvasElement;

  constructor(
    src: string,
    style: Partial<
      CanvasUIImageStyle & {
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

    this._preloaded = {};
    this._src = src;
    this.cache = document.createElement("canvas");
    this.preload([src]);
    this.refreshCache();
  }

  set src(url: string) {
    this._src = url;
    if (this._preloaded[url]) this.cache = this._preloaded[url];
    else this.refreshCache();
  }

  get src() {
    return this._src;
  }

  preload(urls: string[]) {
    for (const url of urls) {
      const canvas = document.createElement("canvas");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
        this._preloaded[url] = canvas;
      };
      img.src = url;
    }

    return this;
  }

  refreshCache() {
    const img = new Image();
    img.onload = () => {
      this.cache.width = img.naturalWidth;
      this.cache.height = img.naturalHeight;
      const ctx = this.cache.getContext("2d")!;
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    };
    img.src = this._src;
  }

  get borderRadius() {
    return new Vector([0, 0, 0, 0]).add(this.style.borderRadius ?? 0);
  }

  readonly draw = (ctx: CanvasRenderingContext2D) => {
    if (typeof this.style.borderColor === "string")
      this.style.borderColor = new Color(this.style.borderColor);

    ctx.strokeStyle = this.style.borderColor.rgba;
    ctx.lineWidth = this.style.borderWidth;

    this.setCtxSettings(ctx);
    ctx.drawImage(this.cache, 0, 0, ...this.dimensions.buffer);
    if (ctx.lineWidth) ctx.strokeRect(0, 0, ...this.dimensions.buffer);
  };
  readonly update = () => {};
}

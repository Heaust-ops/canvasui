import { getFirstGroup } from "./regex";
import { Buffer } from "./types";
import { Vector, Vectorizable } from "./vector";

export type Colorizable = Vectorizable<4> | string;

export class Color extends Vector<4> {
  declare add: (arg: Colorizable) => this;
  declare sub: (arg: Colorizable) => this;
  declare div: (arg: Colorizable) => this;
  declare mul: (arg: Colorizable) => this;
  declare lerp: (destination: Colorizable, fraction: number) => this;

  constructor(color: string | Buffer<4> | null) {
    super([0, 0, 0, 0]);
    if (color) this.buffer = this._standardized(color);
  }

  _standardized = (arg: Colorizable): Buffer<4> => {
    if (typeof arg === "string") {
      let res = null as Buffer<4> | null;
      if (res === null) res = Color.parseHex(arg);
      if (res === null) res = Color.parseRGBA(arg);
      if (res === null) throw new Error("improper color value provided");
      arg = res;
    }

    if (typeof arg === "number")
      arg = new Array(this.buffer.length).fill(arg) as Buffer<4>;

    if (!(arg instanceof Array)) arg = arg.buffer;
    return arg;
  };

  public static parseRGBA = (arg: string) => {
    arg = arg.toLowerCase().trim();
    const rgx =
      /rgba? *\(( *(\d+(\.\d+)?) *, *(\d+(\.\d+)?) *, *(\d+(\.\d+)?) *(, *(\d+(\.\d+)?) *)?)\) *;?/g;
    const parsed = getFirstGroup(rgx, arg);
    if (parsed === null) return null;

    const arr = parsed.split(",").map((el) => +el.replaceAll(" ", ""));
    if (arr.length < 3 || arr.length > 4) return null;
    if (arr.length === 3) arr.push(1);

    return arr as Buffer<4>;
  };

  public static parseHex(arg: string) {
    arg = arg.trim();
    if (!arg.includes("#") || arg.length !== 7) return null;
    const hexNum = parseInt(arg.slice(1), 16);
    const r = (hexNum >> 16) & 0xff;
    const g = (hexNum >> 8) & 0xff;
    const b = (hexNum >> 0) & 0xff;

    for (const c of [r, g, b]) {
      if (typeof c !== "number") return null;
      if (c < 0 || c > 255) return null;
    }

    return [r, g, b, 1] as Buffer<4>;
  }
}

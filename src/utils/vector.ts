import { Buffer, Tuple } from "./types";

export type Vectorizable<T extends number> = Vector<T> | Buffer<T> | number;

export class Vector<T extends number> {
  buffer: Buffer<T>;

  constructor(arr: Tuple<number, T>) {
    this.buffer = arr;
  }

  get mag() {
    let sum = 0;
    for (const num of this.buffer) {
      sum += num * num;
    }

    return Math.pow(sum, 1 / this.buffer.length);
  }

  get clone() {
    return new Vector(this.buffer.slice() as Buffer<T>) as Vector<T>;
  }

  get array() {
    return this.buffer.slice() as Buffer<T>;
  }

  get angle() {
    if (this.buffer.length !== 2)
      throw new Error("angle property only exits for 2D vectors");

    if (!this.buffer[0]) return 90 * Math.sign(this.buffer[1]);
    return (180 * Math.atan(this.buffer[1] / this.buffer[0])) / Math.PI;
  }

  set angle(deg: number) {
    if (this.buffer.length !== 2)
      throw new Error("angle property only exits for 2D vectors");

    const mag = this.mag;
    this.buffer[0] = mag * Math.cos((deg * Math.PI) / 180);
    this.buffer[1] = mag * Math.sin((deg * Math.PI) / 180);
  }

  lerp = (destination: Vectorizable<T>, fraction: number) => {
    const bufferA = this.array; /** preserving A */
    this.sub(destination).mul(-fraction); /** (A - B) * -t */
    this.add(bufferA); /** ((A - B) * -t) + A */
    return this; /** A + (B - A) * t // Standard formula for lerp */
  };

  /**
   * BASIC ARITHMETIC OPERATIONS
   * THEY TAKE IN A VECTOR / BUFFER / SCALAR (SAY A)
   * STANDARDIZE IT TO A VECTOR (B)
   *
   * AND PERFORM THE BASIC OPERATION BETWEEN THIS VECTOR
   * AND ITSELF (A <operation> B)
   */

  _standardized = (arg: Vectorizable<T>): Buffer<T> => {
    if (typeof arg === "number")
      arg = new Array(this.buffer.length).fill(arg) as Buffer<T>;
    if (!(arg instanceof Array)) arg = arg.buffer;
    return arg;
  };

  add = (arg: Vectorizable<T>) => {
    arg = this._standardized(arg);
    for (let i = 0; i < this.buffer.length; i++) {
      this.buffer[i] += arg[i];
    }
    return this;
  };

  sub = (arg: Vectorizable<T>) => {
    arg = this._standardized(arg);
    for (let i = 0; i < this.buffer.length; i++) {
      this.buffer[i] -= arg[i];
    }
    return this;
  };

  mul = (arg: Vectorizable<T>) => {
    arg = this._standardized(arg);
    for (let i = 0; i < this.buffer.length; i++) {
      this.buffer[i] *= arg[i];
    }
    return this;
  };

  div = (arg: Vectorizable<T>) => {
    arg = this._standardized(arg);

    for (let i = 0; i < this.buffer.length; i++) {
      if (arg[i] === 0) continue;
      this.buffer[i] /= arg[i];
    }
    return this;
  };

  multiplyDomMatrix(matrix: DOMMatrix) {
    if (this.buffer.length !== 2)
      throw new Error("DOM Matrix can only be multiplied to 2D Vectors");

    const { a, b, c, d, e, f } = matrix;
    const x = a * this.buffer[0] + c * this.buffer[1] + e;
    const y = b * this.buffer[0] + d * this.buffer[1] + f;
    this.buffer[0] = x;
    this.buffer[1] = y;

    return this;
  }

  /**
   * Ease of use accessors, xyzw
   */

  // x
  get x() {
    if (this.buffer.length > 0) return this.buffer[0];
    return null;
  }
  set x(arg: number | null) {
    if (arg === null) return;
    if (this.buffer.length > 0) this.buffer[0] = arg;
  }

  // y
  get y() {
    if (this.buffer.length > 1) return this.buffer[1];
    return null;
  }
  set y(arg: number | null) {
    if (arg === null) return;
    if (this.buffer.length > 1) this.buffer[1] = arg;
  }

  // z
  get z() {
    if (this.buffer.length > 2) return this.buffer[2];
    return null;
  }
  set z(arg: number | null) {
    if (arg === null) return;
    if (this.buffer.length > 2) this.buffer[2] = arg;
  }

  // w
  get w() {
    if (this.buffer.length > 3) return this.buffer[3];
    return null;
  }
  set w(arg: number | null) {
    if (arg === null) return;
    if (this.buffer.length > 3) this.buffer[3] = arg;
  }

  /**
   * Ease of use accessors, rgba
   */

  // r
  get r() {
    if (this.buffer.length > 0) return this.buffer[0];
    return null;
  }
  set r(arg: number | null) {
    if (arg === null) return;
    if (this.buffer.length > 0) this.buffer[0] = arg;
  }

  // g
  get g() {
    if (this.buffer.length > 1) return this.buffer[1];
    return null;
  }
  set g(arg: number | null) {
    if (arg === null) return;
    if (this.buffer.length > 1) this.buffer[1] = arg;
  }

  // b
  get b() {
    if (this.buffer.length > 2) return this.buffer[2];
    return null;
  }
  set b(arg: number | null) {
    if (arg === null) return;
    if (this.buffer.length > 2) this.buffer[2] = arg;
  }

  // a
  get a() {
    if (this.buffer.length > 3) return this.buffer[3];
    return null;
  }
  set a(arg: number | null) {
    if (arg === null) return;
    if (this.buffer.length > 3) this.buffer[3] = arg;
  }
}

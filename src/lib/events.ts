import { Vector } from "../utils/vector";

export class EventManager {
  isHovered: boolean;
  isActive: boolean;
  onMouseUp: (mouseCoords: Vector<2>) => void;
  onMouseDown: (mouseCoords: Vector<2>) => void;
  onMouseMove: (mouseCoords: Vector<2>) => void;
  onClick: (mouseCoords: Vector<2>) => void;
  onKeyDown: (key: string, hotkeyStack: string[]) => void;
  onKeyUp: (key: string, hotkeyStack: string[]) => void;
  private _onClickCounter: Boolean;

  constructor() {
    this.isHovered = false;
    this.isActive = false;

    this._onClickCounter = false;

    this.onMouseUp = () => {};
    this.onMouseDown = () => {};
    this.onMouseMove = () => {};
    this.onKeyDown = () => {};
    this.onKeyUp = () => {};
    this.onClick = () => {};
  }

  protected _isMouseEventValid = (_mouseCoords: Vector<2>): boolean => {
    throw new Error("Please implement mouse event validator");
  };

  /** INTERNAL LOGIC */
  /**
   * HANDLE MOUSE UP
   */
  readonly _onMouseUp = (_mouseCoords: Vector<2>) => {
    this.isActive = false;
    const fireClick = this._onClickCounter;
    this._onClickCounter = false;

    if (!this._isMouseEventValid(_mouseCoords)) return;

    /** Fire user defined event */
    this.onMouseUp(_mouseCoords);
    if (fireClick) this.onClick(_mouseCoords);
  };

  /**
   * HANDLE MOUSE DOWN
   */
  readonly _onMouseDown = (_mouseCoords: Vector<2>) => {
    if (!this._isMouseEventValid(_mouseCoords)) return;

    this._onClickCounter = true;

    /** Fire user defined event */
    this.onMouseDown(_mouseCoords);
  };

  /**
   * HANDLE MOUSE MOVE
   */
  readonly _onMouseMove = (_mouseCoords: Vector<2>) => {
    this.isHovered = false;

    if (!this._isMouseEventValid(_mouseCoords)) return;
    this.isHovered = true;

    /** Fire user defined event */
    this.onMouseMove(_mouseCoords);
  };

  /**
   * HANDLE KEY DOWN
   */
  readonly _onKeyDown = (_key: string, _hotkeyStack: string[]) => {
    /** Fire user defined event */
    this.onKeyDown(_key, _hotkeyStack);
  };

  /**
   * HANDLE KEY UP
   */
  readonly _onKeyUp = (_key: string, _hotkeyStack: string[]) => {
    /** Fire user defined event */
    this.onKeyUp(_key, _hotkeyStack);
  };
}

import { Vector } from "../utils/vector";

export class EventManager {
  isHovered: boolean;
  isActive: boolean;
  onMouseUp: (mouseCoords: Vector<2>) => void;
  onMouseDown: (mouseCoords: Vector<2>) => void;
  onMouseMove: (mouseCoords: Vector<2>) => void;
  onMouseEnter: (mouseCoords: Vector<2>) => void;
  onMouseExit: (mouseCoords: Vector<2>) => void;
  onActiveStart: (mouseCoords: Vector<2>) => void;
  onActiveEnd: (mouseCoords: Vector<2>) => void;
  onClick: (mouseCoords: Vector<2>) => void;
  onKeyDown: (key: string, hotkeyStack: string[]) => void;
  onKeyUp: (key: string, hotkeyStack: string[]) => void;
  protected _onClickCounter: Boolean;

  constructor() {
    this.isHovered = false;
    this.isActive = false;

    this._onClickCounter = false;

    this.onMouseUp = () => {};
    this.onMouseDown = () => {};
    this.onMouseMove = () => {};
    this.onMouseEnter = () => {};
    this.onMouseExit = () => {};
    this.onKeyDown = () => {};
    this.onKeyUp = () => {};
    this.onActiveStart = () => {};
    this.onActiveEnd = () => {};
    this.onClick = () => {};
  }

  protected _onMouseEnter = (_mouseCoords: Vector<2>) => {
    this.onMouseEnter(_mouseCoords);
  };

  protected _onMouseExit = (_mouseCoords: Vector<2>) => {
    this.onMouseExit(_mouseCoords);
  };

  protected _onActiveStart = (_mouseCoords: Vector<2>) => {
    this.onActiveStart(_mouseCoords);
  };

  protected _onActiveEnd = (_mouseCoords: Vector<2>) => {
    this.onActiveEnd(_mouseCoords);
  };

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
    this._onActiveEnd(_mouseCoords);

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
    this.isActive = true;
    this._onActiveStart(_mouseCoords);

    /** Fire user defined event */
    this.onMouseDown(_mouseCoords);
  };

  /**
   * HANDLE MOUSE MOVE
   */
  readonly _onMouseMove = (_mouseCoords: Vector<2>) => {
    const wasHovered = this.isHovered;
    this.isHovered = false;

    if (!this._isMouseEventValid(_mouseCoords)) {
      if (wasHovered) this._onMouseExit(_mouseCoords);
      return;
    }
    if (!wasHovered) this._onMouseEnter(_mouseCoords);
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

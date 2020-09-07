import { accept, UniversalElementSelector } from '@compactjs/uea';
import { cap } from '@compactjs/cap';

const isTouch = 'ontouchstart' in window;
const startEvent = isTouch ? 'touchstart' : 'mousedown';
const moveEvent = isTouch ? 'touchmove' : 'mousemove';
const endEvent = isTouch ? 'touchend' : 'mouseup';

export const draggable = (
  element: UniversalElementSelector,
  {
    limit = {
      x: { min: 0, max: window.innerWidth },
      y: { min: 0, max: window.innerHeight },
    },
    cancelWhenOutOfBoundary = false,
    dontTouchStyles = false,
    onDragStart = null,
    onDragEnd = null,
  }: DraggableOptions = {}
): DraggableAPI => {
  const elements = accept(element);
  let draggable = true;

  elements.forEach((element) => {
    const translate = { x: 0, y: 0 };

    if (!dontTouchStyles) initStyles(element);

    element.addEventListener(startEvent, (e: MouseEvent | TouchEvent) => {
      const event: MouseEvent | Touch = /touch/.test(e.type)
        ? (e as TouchEvent).targetTouches[0]
        : (e as MouseEvent);

      const dimensions = getDimensions(element);

      const initialMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
      const initialTranslate = { ...translate };
      if (onDragStart)
        onDragStart({
          x: dimensions.left + translate.x,
          y: dimensions.top + translate.y,
        });
      e.preventDefault();

      document.addEventListener(moveEvent, onMouseMove);
      document.addEventListener(endEvent, onMouseUp);

      function onMouseMove(e: MouseEvent | TouchEvent) {
        if (!draggable) return;
        const event: MouseEvent | Touch = /touch/.test(e.type)
          ? (e as TouchEvent).targetTouches[0]
          : (e as MouseEvent);
        if (
          cancelWhenOutOfBoundary &&
          isOutOfBoundary(event.clientX, event.clientY, limit)
        ) {
          removeListener(onMouseMove, onMouseUp);
          return;
        }
        const mouseMoveDistance = {
          x: event.clientX - initialMousePosition.x,
          y: event.clientY - initialMousePosition.y,
        };
        translate.x = initialTranslate.x + mouseMoveDistance.x;
        translate.y = initialTranslate.y + mouseMoveDistance.y;

        if (limit) {
          translate.x = cap(
            translate.x,
            limit.x.min - dimensions.left,
            limit.x.max - dimensions.width - dimensions.left
          );
          translate.y = cap(
            translate.y,
            limit.y.min - dimensions.top,
            limit.y.max - dimensions.height - dimensions.top
          );
        }

        element.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
      }

      function onMouseUp() {
        if (onDragEnd)
          onDragEnd({
            x: dimensions.left + translate.x,
            y: dimensions.top + translate.y,
          });
        removeListener(onMouseMove, onMouseUp);
      }
    });
  });
  return {
    setDraggableState(state) {
      draggable = state;
    },
  };
};

const getDimensions = (element: HTMLElement) => ({
  width: element.offsetWidth,
  height: element.offsetHeight,
  top: element.offsetTop,
  left: element.offsetLeft,
});

const initStyles = (element: HTMLElement) => {
  element.style.zIndex = '99';
};

const isOutOfBoundary = (x: number, y: number, limit: Limit) =>
  !limit ||
  x <= limit.x.min ||
  x >= limit.x.max ||
  y <= limit.y.min ||
  y >= limit.y.max;

const removeListener = (
  onMouseMove: EventListener,
  onMouseUp: EventListener
) => {
  document.removeEventListener(moveEvent, onMouseMove);
  document.removeEventListener(endEvent, onMouseUp);
};

// TODO: move to types.ts when bug is fixed: https://github.com/developit/microbundle/issues/669

export type Limit = {
  x: { min: number; max: number };
  y: { min: number; max: number };
};

export type DraggableOptions = {
  /**
   * limit dragging to a boundary box
   * set it to 'null' to disable
   * defaults to window width/height
   */
  limit?: Limit;
  /**
   * stop dragging when mouse is out of boundaries
   * @default false
   */
  cancelWhenOutOfBoundary?: boolean;
  /**
   * draggins by default changes z-index to 99
   * @default false
   */
  dontTouchStyles?: boolean;

  /**
   * Run when dragging has started
   */
  onDragStart?: (position: { x: number; y: number }) => void;

  /**
   * Run when dragging has ended
   */
  onDragEnd?: (position: { x: number; y: number }) => void;
};

export type DraggableAPI = {
  /**
   * disable / enable dragging
   * @param state draggable
   */
  setDraggableState(state: boolean): void;
};

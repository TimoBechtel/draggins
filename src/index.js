import { accept } from '@compactjs/uea';

const isTouch = 'ontouchstart' in window;
const startEvent = isTouch ? 'touchstart' : 'mousedown';
const moveEvent = isTouch ? 'touchmove' : 'mousemove';
const endEvent = isTouch ? 'touchend' : 'mouseup';

const getDimensions = (element) => ({
  width: element.offsetWidth,
  height: element.offsetHeight,
  top: element.offsetTop,
  left: element.offsetLeft,
});

export const draggable = (
  element,
  {
    limit = {
      x: { min: 0, max: window.innerWidth },
      y: { min: 0, max: window.innerHeight },
    },
    cancelWhenOutOfBoundary = false,
    dontTouchStyles = false,
    onDragStart = () => {},
    onDragEnd = () => {},
  } = {}
) => {
  const elements = accept(element);
  let draggable = true;
  elements.forEach((element) => {
    if (!dontTouchStyles) initStyles(element, getDimensions(element));
    element.addEventListener(startEvent, (e) => {
      const event = /touch/.test(e.type) ? e.targetTouches[0] : e;
      const dimensions = getDimensions(element);
      const mouseStartPosition = {
        x: event.clientX,
        y: event.clientY,
      };
      onDragStart({ x: dimensions.left, y: dimensions.top });
      e.preventDefault();
      function onMouseMove(e) {
        if (!draggable) return;
        const event = /touch/.test(e.type) ? e.targetTouches[0] : e;
        if (
          cancelWhenOutOfBoundary &&
          isOutOfBoundary(event.clientX, event.clientY, limit)
        ) {
          removeListener(onMouseMove, onMouseUp);
          return;
        }
        const mouseMoveDistance = {
          x: event.clientX - mouseStartPosition.x,
          y: event.clientY - mouseStartPosition.y,
        };
        let newElementTop = dimensions.top + mouseMoveDistance.y;
        if (limit)
          newElementTop = limitValue(
            newElementTop,
            limit.y.min,
            limit.y.max - dimensions.height
          );
        let newElementLeft = dimensions.left + mouseMoveDistance.x;
        if (limit)
          newElementLeft = limitValue(
            newElementLeft,
            limit.x.min,
            limit.x.max - dimensions.width
          );
        element.style.top = `${newElementTop}px`;
        element.style.left = `${newElementLeft}px`;
      }
      function onMouseUp() {
        onDragEnd({ x: dimensions.left, y: dimensions.top });
        removeListener(onMouseMove, onMouseUp);
      }
      document.addEventListener(moveEvent, onMouseMove);
      document.addEventListener(endEvent, onMouseUp);
    });
  });
  return {
    setDraggableState(state) {
      draggable = state;
    },
  };
};

const initStyles = (element, { top, left, width, height }) => {
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  element.style.position = 'absolute';
  element.style.zIndex = 99;
};

const limitValue = (value, from, to) => {
  return Math.min(Math.max(value, from), to);
};

const isOutOfBoundary = (x, y, limit) =>
  !limit ||
  x <= limit.x.min ||
  x >= limit.x.max ||
  y <= limit.y.min ||
  y >= limit.y.max;

const removeListener = (onMouseMove, onMouseUp) => {
  document.removeEventListener(moveEvent, onMouseMove);
  document.removeEventListener(endEvent, onMouseUp);
};

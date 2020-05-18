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
    if (!dontTouchStyles) initStyles(element);
    const translate = { x: 0, y: 0 };
    element.addEventListener(startEvent, (e) => {
      const event = /touch/.test(e.type) ? e.targetTouches[0] : e;
      const dimensions = getDimensions(element);

      const initialMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
      const initialTranslate = { ...translate };
      onDragStart({
        x: dimensions.left + translate.x,
        y: dimensions.top + translate.y,
      });
      e.preventDefault();

      document.addEventListener(moveEvent, onMouseMove);
      document.addEventListener(endEvent, onMouseUp);

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
          x: event.clientX - initialMousePosition.x,
          y: event.clientY - initialMousePosition.y,
        };
        translate.x = initialTranslate.x + mouseMoveDistance.x;
        translate.y = initialTranslate.y + mouseMoveDistance.y;

        if (limit) {
          translate.x = limitValue(
            translate.x,
            limit.x.min - dimensions.left,
            limit.x.max - dimensions.width - dimensions.left
          );
          translate.y = limitValue(
            translate.y,
            limit.y.min - dimensions.top,
            limit.y.max - dimensions.height - dimensions.top
          );
        }

        element.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
      }
      function onMouseUp() {
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

const initStyles = (element) => {
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

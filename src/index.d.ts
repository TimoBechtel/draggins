declare module 'draggins';

interface DraggableAPI {
  /**
   * disable / enable dragging
   * @param state draggable
   */
  setDraggableState(state: boolean): void;
}

interface DraggableOptions {
  /**
   * limit dragging to a boundary box
   * set it to 'null' to disable
   * defaults to window width/height
   */
  limit: { x: { min: number; max: number }; y: { min: number; max: number } };
  /**
   * stop dragging when mouse is out of boundaries
   * @default false
   */
  cancelWhenOutOfBoundary: boolean;
  /**
   * draggins by default changes styles to absolute
   * @default false
   */
  dontTouchStyles: boolean;

  /**
   * Run when dragging has started
   */
  onDragStart: (position: { x: number; y: number }) => void;

  /**
   * Run when dragging has ended
   */
  onDragEnd: (position: { x: number; y: number }) => void;
}

/**
 * Make things draggable
 * @param element can be a range of different inputs, see https://github.com/CompactJS/uea
 * @param options draggable options
 * @returns returns api
 */
export function draggable(
  element: string | HTMLElement | HTMLElement[] | HTMLCollection | NodeList,
  options: DraggableOptions
): DraggableAPI;

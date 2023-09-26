
export const CANVAS_OFFSET = 70;
export const GRAVITY = 0.7;

export const CANVAS: HTMLCanvasElement | null = document.querySelector('canvas');
export const CONTEXT: CanvasRenderingContext2D | null | undefined = CANVAS?.getContext('2d');
export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 576;

// import { ground1 } from "../assets/ground-1";

// export const GROUND_SPRITES = [
//   ground1
// ]
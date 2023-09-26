import {
  CONTEXT,
  CANVAS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from '../const/const';

// Si CANVAS existe, establece su ancho y alto
if (CANVAS) {
  CANVAS.width = CANVAS_WIDTH;
  CANVAS.height = CANVAS_HEIGHT;
}
// Clase base Sprite para representar un sprite genérico
export class Sprite {
  position: { x: number; y: number };
  width: number;
  height: number;
  image: HTMLImageElement;
  scale: number;
  framesMax: number;
  framesCurrent: number;
  framesElapsed: number;
  framesHold: number;
  offset: { x: number; y: number };
  horizontalScale: number;
  label: string;
  collisionAreas: { x: number; y: number; width: number; height: number }[];


  constructor({
    position = { x: 0, y: 0 },
    imageSrc = '',
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    label = '',
    collisionAreas = [],
  }: {
    position?: { x: number; y: number };
    imageSrc?: string;
    scale?: number;
    framesMax?: number;
    offset?: { x: number; y: number };
    label?: string;
    collisionAreas?: { x: number; y: number; width: number; height: number }[];

  }) {
    this.position = position;
    this.width = 0;
    this.height = 0;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
    this.horizontalScale = 1.0;
    this.label = label;
    this.collisionAreas = collisionAreas;
  }

  // Método para dibujar el sprite en el contexto gráfico
  draw() {
    if (CONTEXT) {
      CONTEXT.save(); // Guarda el contexto actual
      CONTEXT.scale(this.horizontalScale, 1.0); // Aplica la escala horizontal
      CONTEXT.drawImage(
        this.image,
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax,
        this.image.height,
        (this.position.x - this.offset.x) * this.horizontalScale,
        this.position.y - this.offset.y,
        (this.image.width / this.framesMax) * this.scale,
        this.image.height * this.scale
      );
      CONTEXT.restore(); // Restaura el contexto para evitar que la escala se aplique a otros elementos
    }
  }
  // Nuevo método para dibujar una imagen de fondo
  drawBackground(backgroundImage: HTMLImageElement) {
    if (CONTEXT && CANVAS) {
      CONTEXT.drawImage(
        backgroundImage,
        0, // posición X de la imagen de fondo
        0, // posición Y de la imagen de fondo
        CANVAS.width, // ancho de la imagen de fondo igual al ancho del canvas
        CANVAS.height // alto de la imagen de fondo igual al alto del canvas
      );
    }
  }

  // Método para animar los frames del sprite
  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  // Método para actualizar el sprite en cada fotograma
  update() {
    this.draw();
    this.animateFrames();
  }

}

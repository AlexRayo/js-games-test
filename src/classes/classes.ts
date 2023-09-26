import {
  CANVAS_OFFSET,
  GRAVITY,
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

let ground: Sprite = null;

// Definición de las interfaces para el estado y los datos de los sprites
interface SpriteState {
  image?: HTMLImageElement;
  imageSrc: string;
  framesMax: number;
}

interface SpriteData {
  [key: string]: {
    imageSrc: string;
    // Otros campos relevantes de SpriteData
  };
  idle: SpriteState;
  run: SpriteState;
  jump: SpriteState;
  fall: SpriteState;
  attack1: SpriteState;
  takeHit: SpriteState;
  death: SpriteState;
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
    this.width = 50;
    this.height = 150;
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
    if (this.label === 'ground' && !ground) {
      console.log('setting position once only...')
      ground = this
    }
  }

}

// Clase Fighter que hereda de Sprite para representar a un personaje de combate
export class Fighter extends Sprite {
  velocity: { x: number; y: number };
  lastKey: string | undefined;
  isJumping: boolean;
  attackBox: {
    position: { x: number; y: number };
    offset: { x: number; y: number };
    width: number | undefined;
    height: number | undefined;
  };
  color: string;
  isAttacking: boolean = false;
  health: number;
  sprites: SpriteData;
  dead: boolean;

  constructor({
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset, width: undefined, height: undefined },
  }: {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    color?: string;
    image: HTMLImageElement;
    imageSrc: string;
    scale?: number;
    framesMax?: number;
    offset?: { x: number; y: number };
    sprites: SpriteData;
    attackBox?: {
      offset: { x: number; y: number };
      width?: number;
      height?: number;
    };
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.isJumping = false;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false;

    // Inicializa las imágenes de los sprites
    for (const spriteKey in this.sprites) {
      if (Object.prototype.hasOwnProperty.call(this.sprites, spriteKey)) {
        const sprite = this.sprites[spriteKey];
        sprite.image = new Image();
        sprite.image.src = sprite.imageSrc;
      }
    }
  }


  // Método para actualizar al luchador en cada fotograma
  update() {
    this.draw();
    if (!this.dead) this.animateFrames();

    // Calcula la posición del suelo
    const groundY = CANVAS_HEIGHT - CANVAS_OFFSET;

    // Verifica si el sprite ha alcanzado el suelo
    const scaledHeight = this.height * this.scale; // Altura escalada
    if (this.position.y + scaledHeight + this.velocity.y >= groundY) {
      this.velocity.y = 0; // Detén la velocidad vertical
      this.position.y = groundY - scaledHeight; // Establece la posición en el suelo
      this.isJumping = false; // Restablece la bandera de salto
    }

    // Actualiza las coordenadas de la caja de ataque
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // Dibuja la caja de ataque en el contexto gráfico
    // if (CONTEXT) {
    //   CONTEXT.fillRect(
    //     this.attackBox.position.x,
    //     this.attackBox.position.y,
    //     this.attackBox.width || 0,
    //     this.attackBox.height || 0
    //   );
    // }

    // Actualiza las coordenadas y la gravedad
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Aplica la gravedad
    if (this.position.y + this.height + this.velocity.y >= CANVAS_HEIGHT - CANVAS_OFFSET) {
      this.velocity.y = 0;
      this.position.y = groundY - scaledHeight;
    } else this.velocity.y += GRAVITY;
  }

  // Método para iniciar un ataque
  attack() {
    this.switchSprite('attack1');
    this.isAttacking = true;
  }

  // Método para manejar el impacto del luchador
  takeHit() {
    this.health -= 20;

    if (this.health <= 0) {
      this.switchSprite('death');
    } else this.switchSprite('takeHit');
  }

  // Método para cambiar el sprite del luchador
  switchSprite(sprite: string) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1) this.dead = true;
      return;
    }

    // Anula todas las demás animaciones con la animación de ataque
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;

    // Anula cuando el luchador recibe un golpe
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;

    // Cambia el sprite según la animación deseada
    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image && this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image && this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image && this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case 'fall':
        if (this.image !== this.sprites.fall.image && this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case 'attack1':
        if (this.image !== this.sprites.attack1.image && this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image && this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case 'death':
        if (this.image !== this.sprites.death.image && this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}

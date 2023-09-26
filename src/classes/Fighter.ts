import {
  CANVAS_OFFSET,
  GRAVITY,
  CANVAS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CONTEXT,
} from '../const/const';
import { Sprite } from './classes';

// Si CANVAS existe, establece su ancho y alto
if (CANVAS) {
  CANVAS.width = CANVAS_WIDTH;
  CANVAS.height = CANVAS_HEIGHT;
}

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

// Clase Fighter que hereda de Sprite para representar a un personaje de combate
export class Fighter extends Sprite {
  velocity: { x: number; y: number };
  lastKey: string | undefined;
  isJumping: boolean;
  boxCollider: {
    position: { x: number; y: number };
    offset: { x: number; y: number };
    width: number | undefined;
    height: number | undefined;
  }
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
    boxCollider = {
      position, offset, width: undefined, height: undefined
    },
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
    boxCollider?: {
      position: { x: number; y: number };
      offset: { x: number; y: number };
      width?: number;
      height?: number;
    };
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
    this.boxCollider = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: {
        x: this.position.x,
        y: this.position.y
      },
      height: 0,
      width: 0,
    }
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
    if (this.position.y + this.height + this.velocity.y >= groundY) {
      this.velocity.y = 0; // Detén la velocidad vertical
      this.position.y = groundY - this.height; // Establece la posición en el suelo
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
    //   //console.log('this.attackBox.position.x', this.attackBox.position.x)
    //   CONTEXT.fillRect(
    //     this.position.x,
    //     this.position.y,
    //     this.width || 0,
    //     this.height || 0
    //   );
    //   //console.log('this.position.x,', this.position.x)
    // }

    // Actualiza las coordenadas y la gravedad
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Aplica la gravedad
    if (this.position.y + this.height + this.velocity.y >= groundY) {
      this.velocity.y = 0;
      this.position.y = groundY - this.height;
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

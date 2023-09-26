import { Fighter } from "../classes/Fighter";

export const enemy = new Fighter({
  position: {
    x: 900,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  imageSrc: '/img/enemy/Idle.png',
  framesMax: 4,
  scale: 1,
  offset: {
    x: 500,
    y: 152
  },
  sprites: {
    idle: {
      imageSrc: '/img/enemy/idle.png',
      framesMax: 5
    },
    run: {
      imageSrc: '/img/enemy/run.png',
      framesMax: 6
    },
    jump: {
      imageSrc: '/img/enemy/jump.png',
      framesMax: 3
    },
    fall: {
      imageSrc: '/img/enemy/fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: '/img/enemy/attack.png',
      framesMax: 5
    },
    takeHit: {
      imageSrc: '/img/enemy/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: '/img/enemy/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
})
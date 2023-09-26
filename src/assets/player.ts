import { Fighter } from "../classes/Fighter"

export const player = new Fighter({
  //imageSrc: '/img/knight/idle.png',
  framesMax: 10,
  scale: 1,

  sprites: {
    idle: {
      imageSrc: '/img/knight/idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: '/img/knight/Run.png',
      framesMax: 9
    },
    jump: {
      imageSrc: '/img/knight/jump.png',
      framesMax: 3
    },
    fall: {
      imageSrc: '/img/knight/fall.png',
      framesMax: 3
    },
    attack1: {
      imageSrc: '/img/knight/attack.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: '/img/knight/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: '/img/knight/Death.png',
      framesMax: 6
    }
  },
});

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

player.height = 60
player.width = 35
player.offset = {
  x: 45,
  y: 50
}
player.position = {
  x: 0,
  y: 0
}
player.velocity = {
  x: 0,
  y: 0
}
player.attackBox = {
  position: {
    x: player.position.x,
    y: player.position.y
  },
  offset: {
    x: 45,
    y: 1
  },
  width: 100,
  height: 50
}
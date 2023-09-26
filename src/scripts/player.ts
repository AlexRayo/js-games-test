import { CANVAS, CANVAS_OFFSET, CONTEXT } from "../const/const";
import { rectangularCollision } from "../utils";

//sprites must to be imported last
import { enemy } from "../assets/enemy";
import { player } from "../assets/player";

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
export const playerUpdate = () => {
  if (CANVAS && CONTEXT) {
    player.update()
    player.velocity.x = 0

    //enable jump
    if (CANVAS.height - player.position.y === player.height + CANVAS_OFFSET) {
      player.isJumping = false; // Restablecer isJumping cuando el jugador toca el suelo
    }

    //
    if (keys.a.pressed && player.lastKey === 'a') {
      //console.log('player  position', player.lastKey)
      player.velocity.x = -5
      player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
      player.velocity.x = 5
      player.switchSprite('run')
    } else {
      player.switchSprite('idle')
    }

    // jumping
    if (player.velocity.y < 0) {
      player.switchSprite('jump')
    }
    else if (player.velocity.y > 0) {
      player.switchSprite('fall')
    }

    // detect for collision & enemy gets hit
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
      }) &&
      player.isAttacking &&
      player.framesCurrent === 4
    ) {
      enemy.takeHit()
      player.isAttacking = false

      //gsap belongs to imported cdn library from index.html
      //CONSIDER REPLACE IT FOR VANILLA JS
      gsap.to('#enemyHealth', {
        width: enemy.health + '%'
      })

    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
      player.isAttacking = false
    }
    if (player.isAttacking) {

    }
    ////Dibuja el rectángulo de ataque solo cuando el jugador está atacando.
    if (CONTEXT) {
      CONTEXT.fillRect(
        player.attackBox.position.x,
        player.attackBox.position.y,
        player.attackBox.width || 0,
        player.attackBox.height || 0
      );

      CONTEXT.fillRect(
        player.position.x,
        player.position.y,
        player.width || 0,
        player.height || 0
      );
    }

    // this is where our player gets hit
    if (
      rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
      }) &&
      enemy.isAttacking &&
      enemy.framesCurrent === 2
    ) {
      player.takeHit()
      enemy.isAttacking = false

      gsap.to('#playerHealth', {
        width: player.health + '%'
      })
    }

    //
  }
}

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        console.log('player', player.position.x)
        if (player.horizontalScale === -1) {
          player.position.x = player.position.x - player.image.width / player.framesMax
        }
        player.horizontalScale = 1.0;
        break
      case 'a':

        keys.a.pressed = true
        player.lastKey = 'a'
        console.log(player.image)
        if (player.horizontalScale === 1) {
          player.position.x = player.position.x + player.image.width / player.framesMax
        }
        player.horizontalScale = -1.0;

        break
      case ' ':
        if (!player.isJumping) {
          player.velocity.y = -20;
          player.isJumping = true;
        }
        break
      case 'm':
        player.attack()
        break
    }
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }
});
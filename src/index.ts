import './body'

import { CONTEXT, CANVAS } from './const/const'
import { determineWinner } from './utils.ts'
import { playerUpdate } from './scripts/player.ts'

//sprites must to be imported last
import { player } from './assets/player.ts'
import { enemy } from './assets/enemy.ts'
import { enemyUpdate } from './scripts/enemy.ts'
import { background } from './assets/background.ts'
import { ground1 } from './assets/ground-1.ts'
//import { shop } from './assets/shop.ts'

function Update() {
  if (CANVAS && CONTEXT) {

    window.requestAnimationFrame(Update)//re rendering
    //first screen as transition
    CONTEXT.fillStyle = 'black'
    CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height)

    //render scene
    // Dibuja la imagen de fondo
    player.drawBackground(background.image);
    //shop.update()

    //fog
    CONTEXT.fillStyle = 'rgba(255, 255, 255, 0.15)'
    CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height)

    ground1.update()
    playerUpdate()
    enemyUpdate()
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy })
  }
}

Update()
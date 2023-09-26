import { Sprite } from "../classes/Sprite";
import { CANVAS_HEIGHT, CANVAS_OFFSET, CANVAS_WIDTH } from "../const/const";

export const ground1 = new Sprite({
  position: { x: 0, y: CANVAS_HEIGHT - CANVAS_OFFSET }, // Ajusta la altura según tus necesidades
  imageSrc: '/img/grounds/ground-1.png',
  label: 'ground',
  collisionAreas: [
    {
      x: 0,                   // Coordenada X del área de colisión
      y: 70,                 // Coordenada Y del área de colisión
      width: CANVAS_WIDTH,    // Ancho del área de colisión (ancho del canvas en este caso)
      height: 20,             // Altura del área de colisión (ajusta según tus necesidades)
    },
  ],
});

import { setupScene } from './SceneSetup.js';
import { createSun } from './Sun.js';
import { loadEarth } from './Earth.js';
import { initTimeController } from './TimeController.js'; 
import { playIntro } from './Intro.js';

const { scene, camera, renderer, controls, directionalLight } = setupScene();

const sunGroup = createSun(scene, directionalLight);
loadEarth(scene);

initTimeController(scene, camera, renderer, controls, sunGroup);

playIntro().then(() => console.log('Intro finished'));

function animate() {
  requestAnimationFrame(animate);

  const delta = 0.016; 
  sunGroup.rotateSun?.(delta);

  controls.update();
  renderer.render(scene, camera);
}

animate();
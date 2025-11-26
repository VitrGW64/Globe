export function initTimeController(scene, camera, renderer, controls, sunGroup) {
  const timeInput = document.getElementById('timeInput');
  const currentTimeDisplay = document.getElementById('currentTime');

  const keys = {};
  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);

  timeInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = timeInput.value.trim();
      const match = val.match(/^(\d{1,2})(?::|\.)?(\d{0,2})$/);
      if (match) {
        let h = parseInt(match[1]);
        let m = match[2] ? parseInt(match[2]) || 0 : 0;
        if (h >= 0 && h < 24 && m < 60) {
          const angle = (h + m/60 - 12) * Math.PI * 2 / 24;
          sunGroup.setAngle(angle);
          updateDisplay(h, m);
        }
      }
      timeInput.value = '';
    }
  });

  function updateDisplay(h, m) {
    currentTimeDisplay.textContent = `Current time: ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
  }

  function animate() {
    requestAnimationFrame(animate);

    if (keys['ArrowLeft']) sunGroup.setAngle(sunGroup.getAngle() - 0.02);
    if (keys['ArrowRight']) sunGroup.setAngle(sunGroup.getAngle() + 0.02);

    const h = ((sunGroup.getAngle() / (Math.PI*2) * 24) + 12 + 24) % 24;
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    updateDisplay(hrs, mins);

    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
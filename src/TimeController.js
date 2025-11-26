export function initTimeController(scene, camera, renderer, controls, sunGroup) {
  const timeInput = document.getElementById('timeInput');
  const currentTimeDisplay = document.getElementById('currentTime');

  const INITIAL_LOCAL_HOUR = 7;
  const INITIAL_LOCAL_MINUTE = 0;
  const WIB_OFFSET = 7;
 
  const initialLocalHours = INITIAL_LOCAL_HOUR + INITIAL_LOCAL_MINUTE / 60;
  const initialUtcHours = (initialLocalHours - WIB_OFFSET + 24) % 24;
  const initialAngle = (initialUtcHours - 12) * (Math.PI * 2 / 24);
 
  sunGroup.setAngle(initialAngle);
  updateDisplay(INITIAL_LOCAL_HOUR, INITIAL_LOCAL_MINUTE);

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
          const localHours = h + m/60;
          const utcHours = (localHours - 7 + 24) % 24;
          const angle = (utcHours - 12) * (Math.PI * 2 / 24);

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

    const TIMEZONE_OFFSET = 7;
    const utcHours = (sunGroup.getAngle() / (Math.PI * 2) * 24 + 12 + 24) % 24;
    const h = (utcHours + 7) % 24;
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    updateDisplay(hrs, mins);

    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
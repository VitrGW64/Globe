export async function playIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;

  const video = intro.querySelector('video');
  
  if (!video || !video.querySelector('source')?.src) {
    intro.remove();
    return;
  }

  const finish = () => {
    intro.classList.add('hidden');
    setTimeout(() => intro.remove(), 2500); 
  };

  video.onended = video.onerror = finish;
  setTimeout(finish, 8000); 

  await video.play().catch(finish);
}
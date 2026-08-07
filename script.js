const aeroWindow = document.querySelector('.aero-window');
const titlebar = aeroWindow.querySelector('.aero-titlebar');
const themeToggle = document.querySelector('#theme-toggle');
const modeStatus = document.querySelector('#mode-status');

let pointerOffsetX = 0;
let pointerOffsetY = 0;

titlebar.addEventListener('pointerdown', (event) => {
  // Window controls remain clickable instead of starting a drag.
  if (event.target.closest('button')) return;

  const bounds = aeroWindow.getBoundingClientRect();
  pointerOffsetX = event.clientX - bounds.left;
  pointerOffsetY = event.clientY - bounds.top;

  aeroWindow.style.position = 'fixed';
  aeroWindow.style.left = `${bounds.left}px`;
  aeroWindow.style.top = `${bounds.top}px`;
  aeroWindow.classList.add('is-dragging');
  titlebar.setPointerCapture(event.pointerId);
});

titlebar.addEventListener('pointermove', (event) => {
  if (!titlebar.hasPointerCapture(event.pointerId)) return;

  const maxLeft = window.innerWidth - aeroWindow.offsetWidth;
  const maxTop = window.innerHeight - aeroWindow.offsetHeight;
  const left = Math.min(Math.max(0, event.clientX - pointerOffsetX), Math.max(0, maxLeft));
  const top = Math.min(Math.max(0, event.clientY - pointerOffsetY), Math.max(0, maxTop));

  aeroWindow.style.left = `${left}px`;
  aeroWindow.style.top = `${top}px`;
});

function stopDragging(event) {
  if (titlebar.hasPointerCapture(event.pointerId)) {
    titlebar.releasePointerCapture(event.pointerId);
  }
  aeroWindow.classList.remove('is-dragging');
}

titlebar.addEventListener('pointerup', stopDragging);
titlebar.addEventListener('pointercancel', stopDragging);

themeToggle.addEventListener('click', () => {
  const isNight = document.body.classList.toggle('night');

  modeStatus.textContent = `Mode: ${isNight ? 'Night' : 'Day'}`;
  themeToggle.setAttribute('aria-pressed', String(isNight));
  themeToggle.setAttribute('aria-label', isNight ? 'Ativar modo diurno' : 'Ativar modo noturno');
  themeToggle.title = isNight ? 'Ativar modo diurno' : 'Ativar modo noturno';
});

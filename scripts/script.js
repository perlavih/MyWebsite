const aeroWindow = document.querySelector('#window-home');
const titlebar = aeroWindow.querySelector('.aero-titlebar');
const taskbarTime = document.querySelector('#taskbar-time');
const taskbarDate = document.querySelector('#taskbar-date');
const taskbarApps = document.querySelectorAll('.left-side ul li button');
const windows = document.querySelectorAll('.aero-window');
const windowTriggers = document.querySelectorAll('[data-open-window]');

let highestWindowLayer = 5;
const maximizedWindowState = new WeakMap();

function bringToFront(appWindow) {
  highestWindowLayer += 1;
  appWindow.style.zIndex = String(highestWindowLayer);
}

function maximizeWindow(appWindow) {
  const footer = document.querySelector('footer');
  const taskbarHeight = footer ? footer.offsetHeight : 48;
  const currentBounds = appWindow.getBoundingClientRect();

  maximizedWindowState.set(appWindow, {
    left: appWindow.style.left || `${currentBounds.left}px`,
    top: appWindow.style.top || `${currentBounds.top}px`,
    width: appWindow.offsetWidth || currentBounds.width,
    height: appWindow.offsetHeight || currentBounds.height,
    position: appWindow.style.position || '',
    transform: appWindow.style.transform || '',
    borderRadius: appWindow.style.borderRadius || ''
  });

  appWindow.classList.add('is-maximized');
  appWindow.style.position = 'fixed';
  appWindow.style.left = '0px';
  appWindow.style.top = '0px';
  appWindow.style.width = `${window.innerWidth}px`;
  appWindow.style.height = `${Math.max(window.innerHeight - taskbarHeight, 0)}px`;
  appWindow.style.borderRadius = '0';
  appWindow.style.margin = '0';
  appWindow.style.transform = 'none';
  appWindow.style.boxShadow = 'none';
  appWindow.setAttribute('data-maximized', 'true');
}

function restoreWindow(appWindow) {
  const previousState = maximizedWindowState.get(appWindow);
  appWindow.classList.remove('is-maximized');

  if (!previousState) return;

  appWindow.style.left = previousState.left;
  appWindow.style.top = previousState.top;
  appWindow.style.width = `${previousState.width}px`;
  appWindow.style.height = `${previousState.height}px`;
  appWindow.style.position = previousState.position || 'fixed';
  appWindow.style.transform = previousState.transform || 'none';
  appWindow.style.borderRadius = previousState.borderRadius || '';
  appWindow.style.margin = '';
  appWindow.style.boxShadow = '';
  appWindow.setAttribute('data-maximized', 'false');
}

function toggleMaximize(appWindow) {
  if (appWindow.classList.contains('is-maximized')) {
    restoreWindow(appWindow);
    return;
  }

  maximizeWindow(appWindow);
}

function setTaskbarSelection(windowName, isOpen) {
  taskbarApps.forEach((button) => {
    if (button.dataset.openWindow !== windowName) return;
    button.classList.toggle('is-selected', isOpen);
    button.setAttribute('aria-pressed', String(isOpen));
  });
}

function showWindow(windowName) {
  const appWindow = document.querySelector(`#window-${windowName}`);
  if (!appWindow) return;
  appWindow.classList.remove('is-hidden');
  appWindow.classList.remove('is-closing', 'is-minimizing');
  appWindow.classList.add('is-opening');
  appWindow.setAttribute('aria-hidden', 'false');
  bringToFront(appWindow);
  setTaskbarSelection(windowName, true);
  appWindow.addEventListener('animationend', () => appWindow.classList.remove('is-opening'), { once: true });
}

function hideWindow(appWindow, animationClass) {
  appWindow.classList.remove('is-opening');
  appWindow.classList.add(animationClass);
  appWindow.addEventListener('animationend', (event) => {
    if (event.target !== appWindow) return;
    appWindow.classList.remove(animationClass);
    appWindow.classList.add('is-hidden');
    appWindow.setAttribute('aria-hidden', 'true');
    setTaskbarSelection(appWindow.dataset.window, false);
  }, { once: true });
}

windows.forEach((appWindow) => {
  const appTitlebar = appWindow.querySelector('.aero-titlebar');
  let pointerOffsetX = 0;
  let pointerOffsetY = 0;

  appWindow.addEventListener('pointerdown', () => bringToFront(appWindow));

  appTitlebar.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    if (appWindow.classList.contains('is-maximized')) return;

    const bounds = appWindow.getBoundingClientRect();
    pointerOffsetX = event.clientX - bounds.left;
    pointerOffsetY = event.clientY - bounds.top;
    appWindow.style.position = 'fixed';
    appWindow.style.transform = 'none';
    appWindow.style.left = `${bounds.left}px`;
    appWindow.style.top = `${bounds.top}px`;
    appWindow.classList.add('is-dragging');
    appTitlebar.setPointerCapture(event.pointerId);
  });

  appTitlebar.addEventListener('pointermove', (event) => {
    if (!appTitlebar.hasPointerCapture(event.pointerId)) return;
    if (appWindow.classList.contains('is-maximized')) return;

    const maxLeft = window.innerWidth - appWindow.offsetWidth;
    const maxTop = window.innerHeight - appWindow.offsetHeight;
    appWindow.style.left = `${Math.min(Math.max(0, event.clientX - pointerOffsetX), Math.max(0, maxLeft))}px`;
    appWindow.style.top = `${Math.min(Math.max(0, event.clientY - pointerOffsetY), Math.max(0, maxTop))}px`;
  });

  const stopDragging = (event) => {
    if (appTitlebar.hasPointerCapture(event.pointerId)) appTitlebar.releasePointerCapture(event.pointerId);
    appWindow.classList.remove('is-dragging');
  };
  appTitlebar.addEventListener('pointerup', stopDragging);
  appTitlebar.addEventListener('pointercancel', stopDragging);

  appWindow.querySelectorAll('.min, .aero-titlebar .close').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('max')) return;
      hideWindow(appWindow, button.classList.contains('min') ? 'is-minimizing' : 'is-closing');
    });
  });

  appWindow.querySelectorAll('.max').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleMaximize(appWindow);
    });
  });
});

windowTriggers.forEach((trigger) => trigger.addEventListener('click', () => showWindow(trigger.dataset.openWindow)));

function updateTaskbarClock() {
  const now = new Date();
  taskbarTime.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  taskbarDate.textContent = now.toLocaleDateString('pt-BR');
}

updateTaskbarClock();
setInterval(updateTaskbarClock, 1000);

if (taskbarApps.length) {
  taskbarApps[0].classList.add('is-selected');
  taskbarApps[0].setAttribute('aria-pressed', 'true');
}

// Preload wallpaper images and reveal them with a fade-in when ready
function preloadWallpapers() {
  const paths = ['assets/img/backgroundday.jpg', 'assets/img/backgroundnight.jpg'];
  const loads = paths.map((p) => new Promise((resolve) => {
    const img = new Image();
    img.src = p;
    img.onload = () => resolve();
    img.onerror = () => resolve();
  }));
  return Promise.all(loads);
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  preloadWallpapers().then(() => document.body.classList.add('bg-ready'));
} else {
  document.addEventListener('DOMContentLoaded', () => {
    preloadWallpapers().then(() => document.body.classList.add('bg-ready'));
  });
}

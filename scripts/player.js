// DEFINE YOUR SONGS HERE
const track_list = [
      {
          name:"One Shot One Kill",
          artist:"The Cat's Whiskers",
          path:"https://files.catbox.moe/fegzmf.mp3"
      },
      {
          name:"Shooting Arrows",
          artist:"The Cat's Whiskers",
          path:"https://files.catbox.moe/zj81lr.mp3"
      },
      {
          name:"4 REAL",
          artist:"The Cat's Whiskers",
          path:"https://files.catbox.moe/fxd8fo.mp3"
      },
      {
          name:"My Sweetest Love",
          artist:"The Cat's Whiskers ft. Kazuma Mitchell",
          path:"https://files.catbox.moe/qe4he5.mp3"
      },
      {
          name:"Mercy On Me",
          artist:"The Cat's Whiskers",
          path:"https://files.catbox.moe/w7nnf9.mp3"
      }
  ];
  
const playerWindow = document.querySelector('#window-player');
const playerContainer = document.querySelector('#webamp-container');
const playerStatus = document.querySelector('#webamp-status');
let webamp;
let initializing = false;

async function initializeWebamp() {
  if (webamp) {
    webamp.reopen();
    return;
  }
  if (initializing) return;
  initializing = true;
  playerWindow.classList.add('is-preloading');
  playerStatus.hidden = false;
  playerStatus.textContent = 'Loading Webamp…';
  let instance;
  try {
    const { default: Webamp } = await import('./webamp-2.3.1.mjs');
    if (!Webamp.browserIsSupported()) throw new Error('Unsupported browser');
    instance = new Webamp({
      initialSkin: {
        url: "assets/songs/FrutigerGlassv1.wsz"
      },
      initialTracks: track_list.map((track) => ({
        metaData: { artist: track.artist, title: track.name },
        url: track.path,
      })),
      windowLayout: {
        main: { position: { top: 0, left: 0 } },
        equalizer: { position: { top: 116, left: 0 } },
        playlist: { position: { top: 232, left: 0 } },
      },
    });
    await instance.renderInto(playerContainer);
    webamp = instance;
    playerStatus.hidden = true;
    fitPlayerToWebamp();
    webamp.onClose(() => hideWindow(playerWindow, 'is-closing'));
    webamp.onMinimize(() => hideWindow(playerWindow, 'is-minimizing'));
  } catch (error) {
    instance?.dispose();
    playerStatus.textContent = 'Could not load Webamp. Close and reopen Player to retry.';
    console.error('Webamp initialization failed:', error);
  } finally {
    initializing = false;
    playerWindow.classList.remove('is-preloading');
  }
}

function fitPlayerToWebamp() {
  const parts = ['main-window', 'equalizer-window', 'playlist-window']
    .map((id) => playerContainer.querySelector(`#${id}`))
    .filter(Boolean);
  const resizePlayer = () => {
    if (playerWindow.classList.contains('is-hidden') && !playerWindow.classList.contains('is-preloading')) return;
    const root = playerContainer.querySelector('#webamp');
    if (!root) return;
    root.style.left = '0px';
    root.style.top = '0px';
    const containerRect = playerContainer.getBoundingClientRect();
    const scale = containerRect.width / playerContainer.offsetWidth || 1;
    const bounds = parts
      .filter((part) => part.getClientRects().length)
      .map((part) => part.getBoundingClientRect());
    if (!bounds.length) return;
    const left = Math.min(...bounds.map((rect) => rect.left));
    const top = Math.min(...bounds.map((rect) => rect.top));
    const width = Math.round((Math.max(...bounds.map((rect) => rect.right)) - left) / scale);
    const height = Math.round((Math.max(...bounds.map((rect) => rect.bottom)) - top) / scale);
    root.style.left = `${-(left - containerRect.left) / scale}px`;
    root.style.top = `${-(top - containerRect.top) / scale}px`;
    playerWindow.style.setProperty('--webamp-width', `${width}px`);
    playerContainer.style.width = `${width}px`;
    playerContainer.style.height = `${height}px`;
  };
  const observer = new ResizeObserver(resizePlayer);
  parts.forEach((part) => observer.observe(part));
  resizePlayer();
}

new MutationObserver(() => {
  if (!playerWindow.matches('.is-hidden, .is-closing, .is-minimizing')) initializeWebamp();
}).observe(playerWindow, { attributes: true, attributeFilter: ['class'] });

playerWindow.querySelector('.aero-titlebar .close').addEventListener('click', () => {
  webamp?.stop();
});

initializeWebamp();

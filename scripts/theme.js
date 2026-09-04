const themeToggle = document.querySelector('#theme-toggle');
const modeStatus = document.querySelector('#mode-status');

function setTheme(isNight) {
    document.body.classList.toggle('night', isNight);
    modeStatus.textContent = `Mode: ${isNight ? 'Night' : 'Day'}`;
    themeToggle.setAttribute('aria-pressed', String(isNight));
  }
  
  function isNightByLocalTime() {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 5;
  }
  
  themeToggle.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('night'));
  });
  
  setTheme(isNightByLocalTime());
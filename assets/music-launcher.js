(() => {
  const playerName = 'courseLibraryMusicPlayer';
  const playerPath = new URL('music-player.html', document.baseURI);
  const stateKey = 'course-library-music-state';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'music-launcher';
  button.setAttribute('aria-label', '開啟課間電台');
  button.setAttribute('title', '開啟課間電台');
  button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18V5l11-2v13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="16" r="3" stroke="currentColor" stroke-width="1.8"/></svg><span class="music-launcher-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
  const status = document.createElement('span');
  status.className = 'music-launcher-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  document.body.append(button, status);

  function readState() {
    try { return JSON.parse(localStorage.getItem(stateKey) || '{}'); }
    catch { return {}; }
  }

  function updateState() {
    const playing = readState().playing === true;
    button.classList.toggle('is-playing', playing);
    button.setAttribute('aria-label', playing ? '音樂正在播放；按一下暫停' : '開啟課間電台');
    button.title = playing ? '音樂正在播放 · 按一下暫停' : '開啟課間電台';
  }

  button.addEventListener('click', () => {
    let player;
    try {
      player = window.open('', playerName, 'popup,width=390,height=860,resizable=yes');
    } catch {
      player = null;
    }

    if (!player) {
      status.textContent = '瀏覽器封鎖了播放器視窗。請允許此網站開啟彈出視窗後再試。';
      return;
    }

    try {
      const current = new URL(player.location.href);
      if (current.href === 'about:blank' || current.origin !== playerPath.origin || current.pathname !== playerPath.pathname) {
        player.location.replace(playerPath.href);
        status.textContent = '課間電台已開啟。';
      } else {
        const state = readState();
        if (state.ready !== true) {
          player.focus();
          status.textContent = '課間電台正在開啟，稍候即可從這裡操作。';
        } else if (state.playing === true) {
          player.postMessage({ type: 'course-library:pause' }, playerPath.origin);
          status.textContent = '已傳送暫停指令。';
        } else {
          player.postMessage({ type: 'course-library:toggle' }, playerPath.origin);
          player.focus();
          status.textContent = '已將播放指令送到課間電台。';
        }
      }
    } catch {
      // If the named window belongs to another origin, navigate it to this site’s player.
      player.location.replace(playerPath.href);
      status.textContent = '課間電台已開啟。';
    }
    player.focus();
  });

  window.addEventListener('storage', event => {
    if (event.key === stateKey) updateState();
  });
  window.addEventListener('focus', updateState);
  updateState();
})();

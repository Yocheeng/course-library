(() => {
  if (window.courseLibraryContentFrame) return;
  const stateKey = 'course-library-music-state';
  const playerPath = new URL('music-player.html?embed=1&v=4', document.baseURI);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'music-launcher';
  button.setAttribute('aria-label', '開啟課間電台');
  button.setAttribute('aria-controls', 'musicPlayerPanel');
  button.setAttribute('aria-expanded', 'false');
  button.title = '選歌並播放';
  button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18V5l11-2v13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="16" r="3" stroke="currentColor" stroke-width="1.8"/></svg><span class="music-launcher-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';

  const panel = document.createElement('aside');
  panel.className = 'music-player-panel';
  panel.id = 'musicPlayerPanel';
  panel.setAttribute('aria-label', '課間電台播放器');
  panel.hidden = true;
  panel.innerHTML = '<iframe class="music-player-frame" title="課間電台：選擇歌曲並控制播放" loading="lazy"></iframe>';
  const frame = panel.querySelector('iframe');

  const status = document.createElement('span');
  status.className = 'music-launcher-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  document.body.append(button, panel, status);

  function readState() {
    try { return JSON.parse(localStorage.getItem(stateKey) || '{}'); }
    catch { return {}; }
  }

  function updateState() {
    const playing = readState().playing === true;
    button.classList.toggle('is-playing', playing);
    button.setAttribute('aria-label', panel.hidden ? (playing ? '音樂正在播放；開啟選歌面板' : '開啟課間電台') : '收起課間電台');
    button.title = playing ? '音樂正在播放 · 展開或收起歌單' : panel.hidden ? '選歌並播放' : '收起播放器';
  }

  function setPanelOpen(open, restoreFocus = false) {
    panel.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    if (open && !frame.hasAttribute('src')) frame.src = playerPath.href;
    if (restoreFocus) button.focus();
    status.textContent = open ? '播放器已在目前題庫頁展開。' : '播放器已收起；若音樂正在播放，會繼續播放。';
    updateState();
  }

  button.addEventListener('click', () => setPanelOpen(panel.hidden));
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) setPanelOpen(false, true);
  });
  window.addEventListener('course-library:hide-music', () => {
    if (!panel.hidden) setPanelOpen(false, true);
  });
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
    if (event.data?.type === 'course-library:close') setPanelOpen(false, true);
  });
  window.addEventListener('storage', event => {
    if (event.key === stateKey) updateState();
  });
  updateState();
})();

/* Keep the radio assets available while its public feature is paused. */
(async () => {
  'use strict';
  const MUSIC_RADIO_ENABLED = false;
  if (!MUSIC_RADIO_ENABLED) return;

  const player = document.querySelector('.radio-shell');
  function loadStyles(path) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = path;
      link.onload = resolve;
      link.onerror = () => reject(new Error(`Unable to load ${path}`));
      document.head.append(link);
    });
  }
  function loadScript(path) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = path;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Unable to load ${path}`));
      document.body.append(script);
    });
  }

  try {
    if (player) {
      await loadStyles('assets/music-player.css?v=7');
      await loadScript('assets/music-playlist.js?v=2');
      await loadScript('assets/music-player.js?v=5');
      document.getElementById('radioUnavailable').hidden = true;
      player.hidden = false;
    } else {
      document.body.classList.add('has-music-radio');
      await loadStyles('assets/music-launcher.css?v=6');
      await loadScript('assets/course-navigation.js?v=1');
      await loadScript('assets/music-launcher.js?v=5');
    }
  } catch (error) {
    console.error(error);
  }
})();

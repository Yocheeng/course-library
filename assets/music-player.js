(() => {
  const tracks = (Array.isArray(window.COURSE_MUSIC_TRACKS) ? window.COURSE_MUSIC_TRACKS : [])
    .filter(track => track && typeof track.title === 'string' && typeof track.src === 'string' && track.title.trim() && track.src.trim())
    .slice(0, 10);
  const $ = id => document.getElementById(id);
  const audio = $('audio');
  const stateKey = 'course-library-music-state';
  let currentIndex = -1;
  let shuffleDeck = [];

  function setState(playing, ready = true) {
    const state = { playing, ready, title: currentIndex >= 0 ? tracks[currentIndex].title : '', updatedAt: Date.now() };
    try { localStorage.setItem(stateKey, JSON.stringify(state)); } catch { /* Storage is optional. */ }
    $('record').classList.toggle('is-playing', playing);
    $('playLabel').textContent = tracks.length ? (playing ? '暫停播放' : currentIndex >= 0 ? '繼續播放' : '隨機播放') : '等待歌曲';
    $('playPause').querySelector('span:first-child').textContent = playing ? 'Ⅱ' : '▶';
    $('playPause').setAttribute('aria-label', playing ? '暫停播放' : currentIndex >= 0 ? '繼續播放' : '隨機播放');
    renderList();
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${rest}`;
  }

  function shuffled(values) {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function refillDeck() {
    shuffleDeck = shuffled(tracks.map((_, index) => index));
    // The next selection is popped from the end; avoid repeating the last track at cycle boundaries.
    if (shuffleDeck.length > 1 && shuffleDeck[shuffleDeck.length - 1] === currentIndex) {
      [shuffleDeck[0], shuffleDeck[shuffleDeck.length - 1]] = [shuffleDeck[shuffleDeck.length - 1], shuffleDeck[0]];
    }
  }

  function pickRandomIndex() {
    if (!shuffleDeck.length) refillDeck();
    return shuffleDeck.pop();
  }

  function renderList() {
    const list = $('trackList');
    $('playlistCount').textContent = `${String(tracks.length).padStart(2, '0')} / 10`;
    $('trackPosition').textContent = currentIndex >= 0 ? `${String(currentIndex + 1).padStart(2, '0')} / ${String(tracks.length).padStart(2, '0')}` : tracks.length ? `${String(tracks.length).padStart(2, '0')} 首待播` : '待命';

    if (!tracks.length) {
      list.innerHTML = Array.from({ length: 10 }, (_, index) => `<li class="track-row"><span class="track-number">${String(index + 1).padStart(2, '0')}</span><span>等歌曲進站</span><span class="empty-tag">OPEN</span></li>`).join('');
      $('trackTitle').textContent = '歌單還沒收到歌曲';
      $('trackNote').textContent = '提供音檔後，這裡就會開始放歌。';
      $('playlistNote').textContent = '上限 10 首。歌曲會隨機輪播，完整播完一輪才重新抽歌。';
      $('playerStatus').textContent = '播放器已準備好，等待歌曲檔。';
      return;
    }

    list.innerHTML = tracks.map((track, index) => {
      const current = index === currentIndex;
      return `<li class="track-row track-row-ready${current ? ' is-current' : ''}"><button class="track-button" type="button" data-track="${index}" aria-label="播放 ${escapeText(track.title)}"><span class="track-number">${String(index + 1).padStart(2, '0')}</span><span class="track-note-short">${escapeText(track.title)}</span><span class="empty-tag">${current && !audio.paused ? 'ON AIR' : 'PLAY'}</span></button></li>`;
    }).join('');

    if (currentIndex < 0) {
      $('trackTitle').textContent = '點一首開始播放';
      $('trackNote').textContent = `${tracks.length} 首已加入歌單，點擊隨機播放開始。`;
      $('playerStatus').textContent = '歌單已就緒。';
    }

    $('playPause').disabled = false;
    $('nextTrack').disabled = tracks.length < 2;
    $('playlistNote').textContent = '播放順序會先跑完一輪才重抽；這一輪內不會重複。';
  }

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  async function playTrack(index) {
    if (!tracks.length || index < 0 || index >= tracks.length) return;
    currentIndex = index;
    shuffleDeck = shuffleDeck.filter(item => item !== index);
    const track = tracks[index];
    audio.src = new URL(track.src, document.baseURI).href;
    $('trackTitle').textContent = track.title;
    $('trackNote').textContent = track.artist || '課程學習站隨機歌單';
    $('elapsedTime').textContent = '0:00';
    $('durationTime').textContent = '0:00';
    $('seekBar').value = '0';
    $('seekBar').disabled = true;
    $('playerStatus').textContent = '正在連接歌曲…';
    renderList();
    try {
      await audio.play();
      $('playerStatus').textContent = '正在播放。';
    } catch {
      setState(false);
      $('playerStatus').textContent = '歌曲目前無法播放，請確認音檔已放進網站歌單。';
    }
  }

  function playRandom() {
    if (!tracks.length) return;
    playTrack(pickRandomIndex());
  }

  $('playPause').disabled = tracks.length === 0;
  $('nextTrack').disabled = tracks.length < 2;
  $('volumeBar').addEventListener('input', event => { audio.volume = Number(event.target.value); });
  audio.volume = Number($('volumeBar').value);
  $('playPause').addEventListener('click', () => {
    if (audio.paused) {
      if (currentIndex < 0) playRandom();
      else audio.play().catch(() => { $('playerStatus').textContent = '請再按一次播放，瀏覽器需要你的播放確認。'; });
    } else {
      audio.pause();
    }
  });
  $('nextTrack').addEventListener('click', playRandom);
  $('trackList').addEventListener('click', event => {
    const button = event.target.closest('[data-track]');
    if (button) playTrack(Number(button.dataset.track));
  });
  $('seekBar').addEventListener('input', event => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) audio.currentTime = (Number(event.target.value) / 100) * audio.duration;
  });
  audio.addEventListener('loadedmetadata', () => {
    $('durationTime').textContent = formatTime(audio.duration);
    $('seekBar').disabled = false;
  });
  audio.addEventListener('timeupdate', () => {
    $('elapsedTime').textContent = formatTime(audio.currentTime);
    $('seekBar').value = Number.isFinite(audio.duration) && audio.duration > 0 ? String((audio.currentTime / audio.duration) * 100) : '0';
  });
  audio.addEventListener('play', () => setState(true));
  audio.addEventListener('pause', () => {
    setState(false);
    if (currentIndex >= 0 && audio.currentTime > 0 && !audio.ended) $('playerStatus').textContent = '已暫停，可隨時繼續。';
  });
  audio.addEventListener('ended', playRandom);
  audio.addEventListener('error', () => {
    setState(false);
    $('playerStatus').textContent = '找不到這首歌的音檔；請確認清單路徑和上傳檔案相同。';
  });
  $('closePlayer').addEventListener('click', () => window.close());
  window.addEventListener('message', event => {
    if (event.origin !== location.origin) return;
    if (event.data?.type === 'course-library:pause') {
      audio.pause();
    } else if (event.data?.type === 'course-library:toggle') {
      if (audio.paused) {
        if (currentIndex < 0) playRandom();
        else audio.play().catch(() => { $('playerStatus').textContent = '請在播放器視窗中按播放，瀏覽器需要你的確認。'; });
      } else {
        audio.pause();
      }
    }
  });
  window.addEventListener('beforeunload', () => setState(false, false));

  if (!tracks.length) {
    $('playPause').disabled = true;
    $('nextTrack').disabled = true;
    renderList();
  } else {
    renderList();
  }
  setState(false);
})();

/* Local-only bookmarks and reading preferences. No network or account needed. */
(() => {
  'use strict';
  const config = window.courseLearning;
  const key = `course-library.learning.v1.${config.course}`;
  const read = () => { try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { return {}; } };
  const initial = read();
  const saved = new Set(Array.isArray(initial.bookmarks) ? initial.bookmarks.filter(x => typeof x === 'string' && config.validId(x)) : []);
  let reviewOnly = false;
  const tools = document.createElement('div');
  tools.className = 'learning-tools';
  tools.innerHTML = '<button type="button" class="review-filter" aria-pressed="false">待複習 <span>0</span></button><small title="紀錄僅保存在這台裝置的瀏覽器，不會跨裝置同步">僅這台裝置</small><p class="learning-status" role="status" hidden></p>';
  config.toolbar.after(tools);
  const filter = tools.querySelector('.review-filter');
  const status = tools.querySelector('.learning-status');
  const size = document.createElement('label');
  size.className = 'reading-size';
  size.innerHTML = '閱讀字級 <select aria-label="閱讀字級"><option value="standard">標準</option><option value="large">大字</option></select>';
  tools.insertBefore(size, tools.querySelector('small'));
  const sizeSelect = size.querySelector('select');
  sizeSelect.value = initial.size === 'large' ? 'large' : 'standard';
  document.body.classList.toggle('large-reading', sizeSelect.value === 'large');
  const message = text => { status.textContent = text; status.hidden = !text; };
  function write() {
    try { localStorage.setItem(key, JSON.stringify({ bookmarks:[...saved], size:sizeSelect.value })); }
    catch { tools.querySelector('small').textContent = '瀏覽器無法保存，紀錄僅保留本次開啟'; }
  }
  // Remove obsolete saved progress while preserving bookmarks and text size.
  if (Object.prototype.hasOwnProperty.call(initial, 'state')) write();
  function refresh() {
    config.list.querySelectorAll('article[data-id]').forEach(card => {
      let button = card.querySelector('.review-button');
      if (!button) {
        button = document.createElement('button');
        button.type = 'button'; button.className = 'review-button';
        button.dataset.reviewId = card.dataset.id;
        config.cardTop(card).append(button);
      }
      const marked = saved.has(card.dataset.id);
      button.setAttribute('aria-pressed', String(marked));
      button.textContent = marked ? '已標記待複習' : '標記待複習';
      button.setAttribute('aria-label', `${config.questionLabel(card.dataset.id)}，${button.textContent}`);
    });
    filter.querySelector('span').textContent = config.unitIds().filter(id => saved.has(id)).length;
    filter.setAttribute('aria-pressed', String(reviewOnly));
  }
  window.learningUI = { refresh, get reviewOnly() { return reviewOnly; }, get currentReviewCount() { return config.unitIds().filter(id => saved.has(id)).length; }, isSaved:id => saved.has(id), clearReview:()=>{reviewOnly=false;message('');} };
  config.list.addEventListener('click', event => {
    const button = event.target.closest('[data-review-id]');
    if (!button) return;
    const id = button.dataset.reviewId;
    const marked = !saved.has(id);
    if (marked) saved.add(id); else saved.delete(id);
    write();
    if (reviewOnly && !marked) config.render(); else window.learningUI.refresh();
    message(marked ? '已加入待複習。' : '已取消待複習標記。');
  });
  filter.addEventListener('click', () => {
    reviewOnly = !reviewOnly;
    config.resetPage(); config.render();
    message(reviewOnly ? '目前只顯示本單元符合篩選條件的待複習題目。' : '已顯示所有題目。');
  });
  sizeSelect.addEventListener('change', () => {
    document.body.classList.toggle('large-reading', sizeSelect.value === 'large'); write();
  });
  const compact = matchMedia(`(max-width:720px)`);
  const foldControls = () => document.querySelectorAll('.filter-details').forEach(details => { details.open = !compact.matches; });
  document.getElementById('conceptGuide').open = false;
  foldControls(); compact.addEventListener('change', foldControls);
  refresh();
})();

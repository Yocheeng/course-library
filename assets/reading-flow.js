/* One set of reading controls for both courses. */
(() => {
  'use strict';
  const config = window.courseLearning, ui = window.learningUI;
  const search = document.getElementById('search');
  const chapter = document.getElementById(config.course === 'os' ? 'chapter' : 'chapterSelect');
  const type = document.getElementById('typeSelect');
  const unit = document.getElementById(config.course === 'os' ? 'unitPicker' : 'lessonPicker');
  const tools = document.querySelector('.learning-tools');
  const settings = document.createElement('details');
  settings.className = 'reading-settings';
  settings.innerHTML = '<summary>閱讀設定</summary><div class="reading-settings-body"></div>';
  const settingsBody = settings.querySelector('div');
  settingsBody.append(tools.querySelector('.reading-size'), tools.querySelector('small'));
  settingsBody.querySelector('small').textContent = '紀錄只保存在這台裝置，清除網站資料會一併刪除；手機與電腦不會自動同步。';
  tools.insertBefore(settings, tools.querySelector('.learning-status'));
  tools.querySelector('.review-filter').firstChild.textContent = '本單元待複習 ';
  const scope = document.createElement('p');
  scope.className = 'search-scope';
  search.closest('.searchrow').before(scope);
  search.placeholder = config.course === 'os' ? '搜尋此單元的題目、答案或術語…' : '搜尋此單元的題目、答案或公式…';
  search.setAttribute('aria-describedby', 'searchScope'); scope.id = 'searchScope';
  const chips = document.createElement('div');
  chips.className = 'active-filters'; chips.setAttribute('aria-label', '目前套用的篩選');
  tools.after(chips);

  // Compact navigation remains available while reading on a phone.
  const navigation = document.createElement('details');
  navigation.className = 'mobile-navigation';
  navigation.innerHTML = '<summary>課程／單元</summary><div class="mobile-navigation-panel"></div>';
  const panel = navigation.querySelector('div');
  const courseLinks = config.sidebar.querySelector('.site-nav').cloneNode(true);
  courseLinks.setAttribute('aria-label', '手機科目與首頁'); panel.append(courseLinks);
  const unitLabel = document.createElement('label'); unitLabel.textContent = '切換課程單元';
  const unitSelect = document.createElement('select'); unitSelect.setAttribute('aria-label', '切換課程單元');
  unitLabel.append(unitSelect); panel.append(unitLabel);
  const searchJump = document.createElement('button'); searchJump.type = 'button';
  searchJump.className = 'plain'; searchJump.textContent = '搜尋題目'; panel.append(searchJump);
  document.querySelector('.topbar').append(navigation);
  unitSelect.addEventListener('change', () => {
    unit.value = unitSelect.value; unit.dispatchEvent(new Event('change', {bubbles:true}));
    navigation.open = false; document.querySelector('.heading').scrollIntoView({block:'start'});
  });
  searchJump.addEventListener('click', () => {
    navigation.open = false; config.toolbar.scrollIntoView({block:'start'}); search.focus({preventScroll:true});
  });
  document.addEventListener('click', event => {
    if (navigation.open && !navigation.contains(event.target)) navigation.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.open) { navigation.open = false; navigation.querySelector('summary').focus(); }
  });

  const quickPager = document.createElement('nav');
  quickPager.className = 'reading-pager'; quickPager.setAttribute('aria-label', '閱讀快速換頁');
  quickPager.innerHTML = '<button type="button" aria-label="快速上一頁">← 上一頁</button><span></span><button type="button" aria-label="快速下一頁">下一頁 →</button>';
  document.body.append(quickPager);
  const previous = quickPager.firstElementChild, next = quickPager.lastElementChild;
  for (const [button, label] of [[previous, '上一頁'], [next, '下一頁']]) {
    button.addEventListener('click', () => {
      document.getElementById('pager').querySelector(`[aria-label="${label}"]`)?.click();
      config.list.scrollIntoView({block:'start'});
    });
  }
  const empty = document.getElementById('empty');
  const switchUnit = document.createElement('button'); switchUnit.type = 'button';
  switchUnit.className = 'plain'; switchUnit.textContent = '切換單元'; empty.append(switchUnit);
  switchUnit.addEventListener('click', () => {
    if (matchMedia('(max-width:720px)').matches) { navigation.open = true; unitSelect.focus(); }
    else {
      const active = config.sidebar.querySelector('.course-nav.active');
      active?.scrollIntoView({block:'nearest'}); active?.focus();
    }
  });
  function chip(text, clear) {
    const button = document.createElement('button'); button.type = 'button';
    button.textContent = text + ' ×'; button.setAttribute('aria-label', '移除篩選：' + text);
    button.addEventListener('click', () => { clear(); search.focus({preventScroll:true}); });
    chips.append(button);
  }
  function clearSelect(select) { select.selectedIndex = 0; select.dispatchEvent(new Event('change', {bubbles:true})); }
  function refresh() {
    const label = unit.selectedOptions[0]?.textContent.split(' · ')[1] || '';
    scope.textContent = '搜尋範圍：目前單元 · ' + label;
    unitSelect.innerHTML = unit.innerHTML; unitSelect.value = unit.value;
    chips.replaceChildren();
    if (search.value.trim()) chip('搜尋：' + search.value.trim(), () => { search.value = ''; search.dispatchEvent(new Event('input', {bubbles:true})); });
    if (chapter.selectedIndex > 0) chip('章節：' + chapter.selectedOptions[0].textContent, () => clearSelect(chapter));
    if (type.selectedIndex > 0) chip('題型：' + type.value, () => clearSelect(type));
    if (ui.reviewOnly) chip('只看本單元待複習', () => tools.querySelector('.review-filter').click());
    chips.hidden = chips.childElementCount === 0;
    if (!empty.hidden) {
      const noBookmarks = ui.reviewOnly && ui.currentReviewCount === 0;
      empty.querySelector('h3').textContent = noBookmarks ? '本單元還沒有待複習題目' : '目前單元沒有符合的題目';
      empty.querySelector('p').textContent = noBookmarks
        ? '按「重設篩選」回到題目列表，再將想複習的題目標記起來。其他單元的標記請切換到該單元查看。'
        : '搜尋只涵蓋「' + label + '」。可移除上方篩選或重設；若要找其他內容，請切換單元。';
    }
    const pager = document.getElementById('pager');
    const prevButton = pager.querySelector('[aria-label="上一頁"]'), nextButton = pager.querySelector('[aria-label="下一頁"]');
    const pages = Math.max(1, ...Array.from(pager.querySelectorAll('[data-page]'), b => Number(b.dataset.page)).filter(Number.isFinite).slice(1, -1));
    previous.disabled = !prevButton || prevButton.disabled; next.disabled = !nextButton || nextButton.disabled;
    quickPager.querySelector('span').textContent = `第 ${config.currentPage()} / ${pages} 頁`;
    quickPager.hidden = empty.hidden === false || (!prevButton && !nextButton);
  }
  const originalRefresh = ui.refresh;
  ui.refresh = () => { originalRefresh(); refresh(); };
  // Mobile keyboard users need the full available viewport for their answer.
  const readingInput = element => element?.matches('textarea,input[type="search"]');
  document.addEventListener('focusin', event => document.body.classList.toggle('reading-input-focus', readingInput(event.target)));
  document.addEventListener('focusout', () => setTimeout(() => document.body.classList.toggle('reading-input-focus', readingInput(document.activeElement)), 0));
  refresh();
})();

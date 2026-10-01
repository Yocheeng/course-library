(() => {
  'use strict';
  const units = {
    os:['作業系統基礎','作業系統架構','程序與 IPC'],
    algorithms:{L2:'基礎與漸進分析',L3:'遞迴關係式',L4:'Heap 與 Heapsort'}
  };
  const section = document.createElement('section'); section.className = 'home-resume';
  section.setAttribute('aria-label', '接續學習');
  for (const course of ['os','algorithms']) {
    try {
      const state = JSON.parse(localStorage.getItem(`course-library.learning.v1.${course}`) || '{}').state;
      if (!state || !Number.isInteger(state.page) || state.page < 1) continue;
      if (course === 'os' && (!Number.isInteger(state.active) || state.active < 0 || state.active >= units.os.length)) continue;
      const label = course === 'os' ? units.os[state.active] : units.algorithms[state.lesson];
      if (!label) continue;
      const link = document.createElement('a');
      link.href = `${course}.html?resume=1&v=reading-flow1`;
      link.textContent = `繼續${course === 'os' ? '作業系統' : '演算法'}：${label} · 第 ${state.page} 頁 →`;
      section.append(link);
    } catch { /* The course entrances remain usable without browser storage. */ }
  }
  if (section.childElementCount) document.querySelector('.pixel-courses').before(section);
})();

/* Shared question status, filter options and correction links. */
(() => {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const missingSource = question => /追蹤/.test(question.type || '') || /樹中的「\?」|第6行與第10行|第 5 行/.test(question.q || '');

  function qualityReasons(question, course) {
    const reasons = [];
    const note = question.note || '';
    const needsCheck = course === 'algorithms' ? question.warn || note
      : /未提供|未附|並非原題|核對|批改|投影片|選項依|選項.*整理|原題.*順序|線上題庫.*答案|判分版本|標準術語|不同教材|判分答案|題庫用語如此|資料.*(?:缺|不完整)/.test(note);
    if (needsCheck) reasons.push('含核對提醒');
    if (course === 'algorithms' && missingSource(question)) reasons.push('缺少題圖或虛擬碼');
    if (/單選|多選|複選/.test(question.type || '') && !(question.options || question.opts || []).length) reasons.push('原資料未附選項');
    if (!String(question.answer ?? question.a ?? '').trim()) reasons.push('缺少原答案');
    if (!String(question.explanation ?? question.ex ?? '').trim() && !question.terms?.length) reasons.push('缺少解析');
    return reasons;
  }

  function qualityMarkup(question, course) {
    const reasons = qualityReasons(question, course);
    return reasons.length ? `<p class="quality-note">待確認原因：${escape(reasons.join('、'))}</p>` : '';
  }

  function populateSelect(select, values, allValue, allLabel) {
    const previous = select.value;
    const unique = [...new Set(values)];
    select.innerHTML = `<option value="${escape(allValue)}">${escape(allLabel)}</option>` + unique.map(value => `<option value="${escape(value)}">${escape(value)}</option>`).join('');
    select.value = unique.includes(previous) ? previous : allValue;
  }

  function reportURL(details) {
    const courseName = details.course === 'os' ? '作業系統' : '演算法';
    const page = details.course === 'os' ? 'os.html' : 'algorithms.html';
    const source = new URL(page, 'https://yocheng06.github.io/course-library/');
    source.searchParams.set('question', details.id);
    const report = new URL('https://github.com/yocheng06/course-library/issues/new');
    report.searchParams.set('title', `[題庫更正] ${courseName}｜${details.unit} 第 ${details.number} 題`);
    report.searchParams.set('body', [
      `科目：${courseName}`, `單元：${details.unit}`, `題號：${details.id}`, `題目連結：${source.href}`, '',
      '題目：', details.question, '', '目前答案：', details.answer, '',
      '需要更正的地方：', '（請說明問題）', '', '建議修正：', '', '參考來源：'
    ].join('\n'));
    return report.href;
  }

  function focusResults() {
    const summary = document.getElementById('searchResults');
    summary.scrollIntoView({block:'start'});
    summary.focus({preventScroll:true});
  }

  function focusLinkedQuestion(id) {
    requestAnimationFrame(() => {
      const card = document.querySelector(`article[data-id="${CSS.escape(id)}"]`);
      if (!card) return;
      card.scrollIntoView({block:'start'});
      card.querySelector('.question').focus({preventScroll:true});
    });
  }

  window.courseQuestionTools = { qualityReasons, qualityMarkup, missingSource, populateSelect, reportURL, focusResults, focusLinkedQuestion };
})();

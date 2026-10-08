/* Shared question status, filter options and correction links. */
(() => {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const missingSource = question => Boolean(question.missingContext) || /追蹤/.test(question.type || '') || /樹中的「\?」|第6行與第10行|第 5 行/.test(question.q || '');
  const references = {
    'algorithm-analysis': { title:'MIT：漸進分析與遞迴關係式', url:'https://ocw.mit.edu/courses/6-046j-introduction-to-algorithms-sma-5503-fall-2005/81d240e8db219502712349254cdd5272_whjt_N9uYFI.pdf' },
    heaps: { title:'MIT：Binary Heaps', url:'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-8-binary-heaps/' },
    'min-max-heaps': { title:'Atkinson 等：Min-max heaps and generalized priority queues', url:'https://dl.acm.org/doi/10.1145/6617.6621' },
    'os-introduction': { title:'UIC：作業系統概論', url:'https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/1_Introduction.html' },
    'os-structures': { title:'Operating System Concepts：系統結構', url:'https://www.cs.umd.edu/class/spring2020/cmsc412/Slides/Set3%20-Chapter%202.pdf' },
    'os-processes': { title:'UIC：Processes', url:'https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/3_Processes.html' },
    'os-pcb': { title:'Operating System Concepts：PCB 與程序管理', url:'https://os.ecci.ucr.ac.cr/slides/9th-Edition/2012-pdf/ch03.pdf' },
    'os-threads': { title:'UIC：Threads 與執行緒模型', url:'https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/4_Threads.html' },
    'linux-fork': { title:'Linux man-pages：fork()', url:'https://man7.org/linux/man-pages/man2/fork.2.html' },
    'linux-clone': { title:'Linux man-pages：clone()', url:'https://man7.org/linux/man-pages/man2/clone.2.html' },
    'linux-pipe': { title:'Linux man-pages：Pipes 與 FIFOs', url:'https://man7.org/linux/man-pages/man7/pipe.7.html' },
    'linux-signals': { title:'Linux man-pages：signal()', url:'https://man7.org/linux/man-pages/man7/signal.7.html' },
    'pthread-cancel': { title:'Linux man-pages：pthread_cancel()', url:'https://man7.org/linux/man-pages/man3/pthread_cancel.3.html' },
    'windows-pipes': { title:'Microsoft：Named Pipes', url:'https://learn.microsoft.com/en-us/windows/win32/ipc/named-pipes' },
    'android-platform': { title:'Android：平台架構與 ART', url:'https://developer.android.com/guide/platform' },
    'java-virtual-threads': { title:'OpenJDK JEP 444：Virtual Threads', url:'https://openjdk.org/jeps/444' },
    openmp: { title:'OpenMP：API 規格', url:'https://www.openmp.org/specifications/' },
    'apple-dispatch': { title:'Apple：Dispatch（GCD）', url:'https://developer.apple.com/documentation/dispatch' },
    'apple-multitasking': { title:'Apple：多工與多個前景場景', url:'https://developer.apple.com/documentation/uikit/multitasking-on-ipad-mac-and-apple-vision-pro' },
    'chromium-processes': { title:'Chromium：多程序架構', url:'https://www.chromium.org/developers/design-documents/multi-process-architecture/' }
  };

  function qualityReasons(question, course) {
    const reasons = [];
    const note = question.note || '';
    if (question.reviewIssue) reasons.push('答案或題意有疑點');
    if (question.missingContext) reasons.push('缺少解題所需資料');
    const needsCheck = course === 'algorithms' ? question.warn || /核對|未附|缺少|需確認|無法.*(?:判斷|核實)|條件.*(?:不明|未提供)/.test(note)
      : /未提供|未附|並非原題|核對|批改|投影片|選項依|選項.*整理|原題.*順序|線上題庫.*答案|判分版本|標準術語|不同教材|判分答案|題庫用語如此|資料.*(?:缺|不完整)/.test(note);
    if (needsCheck) reasons.push('含核對提醒');
    if (course === 'algorithms' && !question.missingContext && missingSource(question)) reasons.push('缺少題圖或虛擬碼');
    if (/單選|多選|複選/.test(question.type || '') && !(question.options || question.opts || []).length) reasons.push('原資料未附選項');
    if (!String(question.answer ?? question.a ?? '').trim()) reasons.push('缺少原答案');
    if (!String(question.explanation ?? question.ex ?? '').trim() && !question.terms?.length) reasons.push('缺少解析');
    return reasons;
  }

  function qualityMarkup(question, course) {
    const reasons = qualityReasons(question, course);
    if (!reasons.length) return '';
    const details = [question.reviewIssue, question.missingContext].filter(Boolean).join(' ');
    return `<p class="quality-note">待確認原因：${escape(reasons.join('、'))}${details?`<br>${escape(details)} 本題暫不自動判分。`:''}</p>`;
  }

  function answerLabel(question) {
    const label = question.originalAnswer ? '修正後答案' : '題庫答案';
    return question.reviewIssue || question.missingContext ? `${label}（待確認）` : label;
  }

  function reviewMarkup(question) {
    const previous = question.originalAnswer
      ? `<details class="answer-history"><summary>查看修正前的題庫答案</summary><p>${escape(question.originalAnswer)}</p></details>` : '';
    const sources = [...new Set(question.sources || [])].map(id => references[id]).filter(Boolean);
    const links = sources.length ? `<div class="explanation-sources"><strong>參考資料</strong><ul>${sources.map(source=>`<li><a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.title)}<span class="visually-hidden">（另開分頁）</span></a></li>`).join('')}</ul></div>` : '';
    return previous + links;
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

  window.courseQuestionTools = { qualityReasons, qualityMarkup, missingSource, answerLabel, reviewMarkup, populateSelect, reportURL, focusResults, focusLinkedQuestion };
})();

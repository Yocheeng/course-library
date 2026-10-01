/* The OS bank keeps its original question records and IDs. */
'use strict';
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = s => String(s ?? '').normalize('NFKC').toLowerCase();
const guides = {
  basics:'把作業系統想成電腦的管理員：協調 CPU、記憶體與裝置，讓應用程式使用資源。讀題時先分清楚硬體、作業系統與應用程式的角色。',
  architecture:'把 system call 想成向核心提出服務申請：應用程式透過 API 表達需求，再由作業系統執行。先分清楚使用者模式與核心模式，再比較不同系統架構。',
  process:'程式像食譜，程序像正在依食譜做菜的工作。先分清楚程序狀態、排程與 context switch，再比較 shared memory 和 message passing 如何交換資訊。'
};
let active = 0, page = 1, mode = 'study';
const pageSize = 20, drafts = new Map(), selections = new Map(), revealed = new Set();
const answerLetters = q => [...new Set(q.answer.match(/[A-D](?=[.、，,\s]|$)/g) || [])].sort();
const kind = q => !q.options?.length ? '填空／簡答' : answerLetters(q).length > 1 ? '多選題' : '單選題';
const unitNumber = i => String(i + 2).padStart(2, '0');
function highlighted(value) {
  const text = String(value ?? ''), terms = [...new Set($('search').value.trim().split(/\s+/).filter(Boolean))];
  if (!terms.length) return esc(text);
  const re = new RegExp(terms.sort((a,b) => b.length-a.length).map(t => t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gi');
  let out = '', last = 0;
  for (const m of text.matchAll(re)) { out += esc(text.slice(last,m.index))+'<mark>'+esc(m[0])+'</mark>'; last=m.index+m[0].length; }
  return out + esc(text.slice(last));
}
function matches() {
  const tokens = norm($('search').value).trim().split(/\s+/).filter(Boolean);
  return UNITS[active].questions.filter(q => (!window.learningUI?.reviewOnly || window.learningUI.isSaved(q.id)) &&
    ($('chapter').value === 'all' || q.category === $('chapter').value) &&
    ($('typeSelect').value === 'all' || kind(q) === $('typeSelect').value) &&
    tokens.every(t => norm([q.stem,q.answer,q.category,q.translation,q.explanation,q.note,...(q.options || []),...(q.terms || []).map(x => x.label+' '+x.text)].join(' ')).includes(t)));
}
function switchUnit(i) {
  active = i; page = 1; revealed.clear(); $('search').value = '';
  const u = UNITS[i];
  $('unitPicker').innerHTML = UNITS.map((v,j) => `<option value="${j}">UNIT ${unitNumber(j)} · ${esc(v.label)} · ${v.questions.length} 題</option>`).join('');
  $('unitPicker').value = i;
  $('title').textContent=u.label; $('unitEn').textContent=u.en; $('description').textContent=u.desc; $('unitCount').textContent=u.questions.length;
  $('guideText').textContent = guides[u.id] || '先理解本單元的概念，再用題目練習，對照原答案與解析。';
  $('units').innerHTML = UNITS.map((v,j) => `<button class="course-nav ${j===i?'active':''}" data-unit="${j}" aria-pressed="${j===i}"><span class="course-copy"><span class="unit-number">UNIT ${unitNumber(j)}</span><span class="unit-row"><strong>${esc(v.label)}</strong><span class="unit-count">${v.questions.length} 題</span></span><small class="unit-en">${esc(v.en)}</small></span></button>`).join('');
  $('chapter').innerHTML = '<option value="all">全部章節</option>'+[...new Set(u.questions.map(q=>q.category))].map(c=>`<option value="${esc(c)}">${esc(c)}（${u.questions.filter(q=>q.category===c).length}）</option>`).join('');
  $('typeSelect').innerHTML = '<option value="all">全部題型</option>'+[...new Set(u.questions.map(kind))].map(t=>`<option>${t}</option>`).join('');
  render();
}
function answerMarkup(q) {
  return `<div class="answer" id="answer-${q.id}"><div><strong>原題庫答案</strong><br><span class="answer-value">${highlighted(q.answer)}</span></div>${q.note?`<div class="warning"><strong>原題備註</strong><br>${highlighted(q.note)}</div>`:''}${q.explanation?`<div class="explain"><strong>原解析</strong><br>${highlighted(q.explanation)}</div>`:q.terms?.length?`<div class="explain"><strong>相關名詞與作用</strong>${q.terms.map(t=>`<div class="term"><b>${highlighted(t.label)}</b><br>${highlighted(t.text)}</div>`).join('')}</div>`:'<div class="explain">原始題庫尚未提供本題詳細解析。</div>'}</div>`;
}
function cardMarkup(q) {
  const practice = mode === 'practice', open = revealed.has(q.id) || (!practice && $('showAnswers').checked), chosen = selections.get(q.id) || [];
  const options = q.options?.length ? `<div class="options">${q.options.map((o,k)=>practice?`<label class="option ${chosen.includes(k)?'chosen':''}"><input type="${kind(q)==='多選題'?'checkbox':'radio'}" name="choice-${q.id}" data-choice="${q.id}" data-index="${k}" ${chosen.includes(k)?'checked':''}><span>${highlighted(o)}</span></label>`:`<div class="option">${highlighted(o)}</div>`).join('')}</div>` : '';
  return `<article class="card" data-id="${q.id}"><div class="cardtop"><div class="badges"><span class="badge">${highlighted(q.category)}</span><span class="badge neutral">${kind(q)}</span></div><span class="qid">#${String(UNITS[active].questions.indexOf(q)+1).padStart(3,'0')}</span></div><h3 class="question">${highlighted(q.stem)}</h3>${q.translation?`<p class="translation">${highlighted(q.translation)}</p>`:''}${options}${practice&&!q.options?.length?`<textarea class="entry" data-draft="${q.id}" aria-label="${q.id} 你的答案" placeholder="先寫下你的答案或解題想法…">${esc(drafts.get(q.id)||'')}</textarea>`:''}${practice||!$('showAnswers').checked?`<button class="reveal" data-reveal="${q.id}" aria-controls="answer-${q.id}" aria-expanded="${open}">${open?'收起答案':practice?'對照答案與解析':'查看答案與解析'}</button>`:''}<div data-answer="${q.id}" ${open?'':'hidden'}>${answerMarkup(q)}</div></article>`;
}
function render() {
  const filtered=matches(), pages=Math.max(1,Math.ceil(filtered.length/pageSize)), u=UNITS[active]; page=Math.min(page,pages);
  const start=(page-1)*pageSize;
  $('resultCount').innerHTML=`<strong>${$('chapter').value==='all'?'全部章節':esc($('chapter').value)}</strong> · ${filtered.length} / ${u.questions.length} 題`;
  $('pageRange').textContent=filtered.length?`${start+1}–${Math.min(start+pageSize,filtered.length)} · 第 ${page} / ${pages} 頁`:'0 題';
  $('cards').innerHTML=filtered.slice(start,start+pageSize).map(cardMarkup).join(''); $('empty').hidden=filtered.length!==0;
  $('pager').innerHTML=pages>1?`<button data-page="${page-1}" aria-label="上一頁" ${page===1?'disabled':''}>←</button>`+Array.from({length:pages},(_,i)=>`<button data-page="${i+1}" ${page===i+1?'class="active" aria-current="page"':''} aria-label="第 ${i+1} 頁">${i+1}</button>`).join('')+`<button data-page="${page+1}" aria-label="下一頁" ${page===pages?'disabled':''}>→</button>`:'';
  $('studyMode').classList.toggle('active',mode==='study'); $('practiceMode').classList.toggle('active',mode==='practice');
  $('studyMode').setAttribute('aria-pressed',mode==='study'); $('practiceMode').setAttribute('aria-pressed',mode==='practice');
  $('answerToggle').hidden=mode==='practice'; $('modeHint').hidden=mode!=='practice';
  $('footer').textContent=`共 ${UNITS.length} 個單元 · ${UNITS.reduce((n,u)=>n+u.questions.length,0)} 題`;
  window.learningUI?.refresh();
}
function resetFilters() { window.learningUI?.clearReview(); $('search').value=''; $('chapter').value='all'; $('typeSelect').value='all'; page=1; render(); }
function switchMode(next) { mode=next; revealed.clear(); render(); }
function toggleAnswer(id,button) {
  const panel=button.closest('.card').querySelector('[data-answer]'), open=panel.hidden; panel.hidden=!open;
  if(open) revealed.add(id); else revealed.delete(id);
  button.setAttribute('aria-expanded',String(open)); button.textContent=open?'收起答案':mode==='practice'?'對照答案與解析':'查看答案與解析';
}
document.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b)return;
  if(b.dataset.unit!==undefined)switchUnit(Number(b.dataset.unit));
  else if(b.dataset.page){page=Number(b.dataset.page);render();$('bankHeading').scrollIntoView({block:'start'});}
  else if(b.dataset.reveal)toggleAnswer(b.dataset.reveal,b);
});
$('search').addEventListener('input',()=>{page=1;render();});
for(const id of ['chapter','typeSelect']) $(id).addEventListener('change',()=>{page=1;render();});
$('showAnswers').addEventListener('change',()=>{revealed.clear();render();});
$('unitPicker').addEventListener('change',e=>switchUnit(Number(e.target.value)));
$('clear').onclick=resetFilters; $('emptyReset').onclick=resetFilters;
$('studyMode').onclick=()=>switchMode('study'); $('practiceMode').onclick=()=>switchMode('practice');
$('cards').addEventListener('input',e=>{if(e.target.dataset.draft)drafts.set(e.target.dataset.draft,e.target.value);});
$('cards').addEventListener('change',e=>{
  const input=e.target,id=input.dataset.choice;if(!id)return;
  const k=Number(input.dataset.index),chosen=selections.get(id)||[];
  selections.set(id,input.type==='radio'?[k]:input.checked?[...new Set([...chosen,k])]:chosen.filter(n=>n!==k));
  const card=input.closest('.card');card.querySelectorAll('.option').forEach(label=>label.classList.toggle('chosen',label.querySelector('input').checked));
  revealed.delete(id);card.querySelector('[data-answer]').hidden=true;
  const b=card.querySelector('[data-reveal]');b.textContent='對照答案與解析';b.setAttribute('aria-expanded','false');
});
switchUnit(0);
window.courseLearning={
  course:'os',toolbar:document.querySelector('.toolbar'),sidebar:document.querySelector('.sidebar'),list:$('cards'),
  unitIds:()=>UNITS[active].questions.map(q=>q.id),
  cardTop:card=>card.querySelector('.cardtop'),render,resetPage:()=>{page=1;},
  validId:id=>UNITS.some(u=>u.questions.some(q=>q.id===id)),
  questionLabel:id=>{const u=UNITS.find(u=>u.questions.some(q=>q.id===id));return `${u.label} 第 ${u.questions.findIndex(q=>q.id===id)+1} 題`;},
  currentPage:()=>page
};

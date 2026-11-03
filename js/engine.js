// session: intro→Q→advance→finish. 2-strike per Q. stars: 0錯=3 / ≤2錯=2 / else 1.
// 畫面文字一律書面語；speak / speakSequence 一律廣東話口語（唔郁）。
let SES = null;
function setBuddy(face, words) {
  const b = document.getElementById('buddy-bubble');
  if (b && words) b.textContent = (face ? face + ' ' : '') + words;
}
function setFeedback(cls, text, nextLabel) {
  const fb = document.getElementById('feedback');
  if (!fb) return;
  fb.className = 'feedback ' + (cls || '');
  fb.innerHTML = '';
  const s = document.createElement('span');
  s.textContent = text;
  fb.appendChild(s);
  if (nextLabel) {
    const n = document.createElement('button');
    n.type = 'button'; n.className = 'next-inline'; n.textContent = nextLabel + ' →';
    n.onclick = () => nextQ();
    fb.appendChild(n);
  }
}
function showHint(q) {
  const box = document.getElementById('hint-box'), t = document.getElementById('hint-text');
  if (box && t) { t.textContent = q.hint; box.hidden = false; }
  toast('💡 ' + q.hint, 2600);
  speak(q.hintSpeak || q.hint);
}
function typeText(el, text) {
  if (!el) return;
  el.textContent = ''; el.classList.add('type-caret');
  let i = 0;
  clearInterval(el._t);
  el._t = setInterval(() => { el.textContent = text.slice(0, ++i); if (i >= text.length) { clearInterval(el._t); el.classList.remove('type-caret'); } }, 60);
}
function startLevel(id) {
  const lv = AdventureWorld.flatMap(x => x.levels).find(l => l.id === id);
  SES = { id, name: lv.name, qs: lv.gen(), i: 0, mistakes: 0, strikes: 0 };
  document.getElementById('level-title').textContent = '🍮 ' + SES.name;
  show('screen-level');
  askQ();
}
function askQ() {
  const q = SES.qs[SES.i];
  SES.strikes = 0;
  document.getElementById('level-progress').textContent = `第 ${SES.i + 1} / ${SES.qs.length} 題`;
  const pf = document.getElementById('progress-fill');
  if (pf) pf.style.width = (SES.i / SES.qs.length * 100) + '%';
  setBuddy('🤴', '數清楚再按！');
  setFeedback('', '');
  const hb = document.getElementById('hint-box');
  if (hb) hb.hidden = true;
  const proxy = document.getElementById('speech-text-proxy');
  if (proxy) proxy.textContent = '王子：' + q.prompt;
  typeText(document.getElementById('speech-text'), '王子：' + q.prompt);
  speak(q.speak);
  render(document.getElementById('visual'), q.visual);
  const box = document.getElementById('options');
  box.innerHTML = '';
  q.options.forEach(op => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'opt'; b.textContent = op; b._val = op;
    b.onclick = () => answer(op, b);
    box.appendChild(b);
  });
}
function answer(op, btn) {
  const q = SES.qs[SES.i];
  if (!q || btn.disabled) return;
  if (op === q.answer) {
    btn.classList.add('correct');
    [...document.querySelectorAll('#options .opt')].forEach(o => { if (o !== btn) { o.classList.add('dimmed'); o.disabled = true; } });
    blip('good');
    setBuddy('😋', '太棒了！完全正確！');
    setFeedback('good', '答對了！ ✓', SES.i + 1 < SES.qs.length ? '下一題' : '查看成績');
    const pf = document.getElementById('progress-fill');
    if (pf) pf.style.width = ((SES.i + 1) / SES.qs.length * 100) + '%';
    setTimeout(nextQ, 1400);
  } else {
    SES.mistakes++; SES.strikes++;
    btn.classList.add('wrong'); btn.disabled = true;
    blip('bad');
    setBuddy('😿', '不要緊再想一想！');
    if (SES.strikes === 1) {
      showHint(q);
      setFeedback('soft', '差一點再數一次！');
    } else {
      setFeedback('show', `答案是 ${q.answer}${typeof q.answer === 'number' ? ' 個' : ''}，下一題加油！`, '下一題');
      speak(q.explanationSpeak || q.explanation);
      setTimeout(nextQ, 2600);
    }
  }
}
function nextQ() {
  if (!SES) return;
  SES.i++;
  if (SES.i >= SES.qs.length) return finishLevel();
  askQ();
}
function finishLevel() {
  const stars = SES.mistakes === 0 ? 3 : SES.mistakes <= 2 ? 2 : 1;
  awardStars(SES.id, stars);
  // 解鎖下一關（只限已開放 playable 的關）
  const all = AdventureWorld.flatMap(x => x.levels);
  const nx = all[all.findIndex(l => l.id === SES.id) + 1];
  if (nx && nx.playable) unlock(nx.id);
  refreshStars();
  const pf = document.getElementById('progress-fill');
  if (pf) pf.style.width = '100%';
  confettiBurst();
  speakSequence(['叻仔！', `你攞到 ${stars} 粒星！`]);
  setBuddy('🤩', `你獲得 ${stars} 顆星！`);
  const proxy = document.getElementById('speech-text-proxy');
  if (proxy) proxy.textContent = `王子：太棒了！你獲得 ${stars} 顆星！⭐`;
  typeText(document.getElementById('speech-text'), `王子：太棒了！你獲得 ${stars} 顆星！⭐`);
  setFeedback('good', `⭐ ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)} 太棒了！`);
  document.getElementById('options').innerHTML = `<button type="button" class="big-btn" onclick="renderMap()">返回地圖 🗺️</button>`;
}
function confettiBurst() {
  const c = document.getElementById('confetti'), x = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const ps = Array.from({ length: 160 }, () => ({ x: Math.random() * c.width, y: -20, v: 2 + Math.random() * 4, s: 5 + Math.random() * 6, col: ['#ffd93d', '#ff9f43', '#7bc96f', '#ff6b9d', '#fff6d8'][Math.floor(Math.random() * 5)], r: Math.random() * Math.PI }));
  let f = 0;
  (function tick() {
    x.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => { p.y += p.v; p.r += 0.05; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.col; x.fillRect(-p.s / 2, p.s / 2, p.s, p.s * 0.6); x.restore(); });
    if (++f < 160) requestAnimationFrame(tick); else x.clearRect(0, 0, c.width, c.height);
  })();
}
// keys: 1-4 answer, H hint, R repeat, Esc map
document.addEventListener('keydown', e => {
  if (!document.getElementById('screen-level').classList.contains('active') || !SES) return;
  const q = SES.qs[SES.i];
  if (!q) return;
  if (e.key >= '1' && e.key <= '4') {
    const btns = [...document.querySelectorAll('#options .opt')];
    const b = btns[+e.key - 1]; if (b && !b.disabled) answer(b._val, b);
  } else if (e.key === 'h' || e.key === 'H') showHint(q);
  else if (e.key === 'r' || e.key === 'R') speak(q.speak);
  else if (e.key === 'Escape') renderMap();
});

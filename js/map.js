const SCREEN_OF = { 'screen-home': 'home', 'screen-map': 'map', 'screen-level': 'level' };
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.body.dataset.screen = SCREEN_OF[id] || 'map';
  window.scrollTo(0, 0);
}
function toast(msg, ms = 1800) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.display = 'block';
  clearTimeout(t._h); t._h = setTimeout(() => t.style.display = 'none', ms);
}
function refreshStars() {
  document.getElementById('star-total').textContent = '⭐ ' + totalStars();
  const m = document.getElementById('map-star-total');
  if (m) m.textContent = totalStars();
}
const ISLAND_META = [
  { emoji: '🍮', kicker: 'ISLAND 1 · 數數', desc: '布甸沙漠：20 以內數數、比較多少，逐一數清楚。' },
  { emoji: '🍓', kicker: 'ISLAND 2 · 加減', desc: '草莓火山：18 以內加減，以圖像題為主，先口算後列橫式。' },
  { emoji: '🍜', kicker: 'ISLAND 3 · 圖形位置', desc: '拉麵海洋：透過觸摸、堆疊和滾動認識圖形，學習位置詞語。' },
  { emoji: '🌈', kicker: 'ISLAND 4 · 度量生活', desc: '彩虹糖雲城：量度長度、認識錢幣、報讀時間和日期。' },
];
function renderHome() { show('screen-home'); refreshStars(); }
function renderMap() {
  show('screen-map'); refreshStars();
  const box = document.getElementById('map-islands');
  box.innerHTML = '';
  AdventureWorld.forEach((isl, ii) => {
    const meta = ISLAND_META[ii] || ISLAND_META[0];
    const card = document.createElement('div');
    card.className = 'island-card island-' + (ii + 1);
    const lvDone = isl.levels.filter(l => (loadState().stars[l.id] || 0) > 0).length;
    const lvStars = isl.levels.reduce((a, l) => a + (loadState().stars[l.id] || 0), 0);
    card.innerHTML = `<div class="island-bg"></div><div class="island-shade"></div>
      <div class="island-header">
        <div class="island-title-wrap"><span class="island-emoji">${meta.emoji}</span>
          <div><div class="island-kicker">${meta.kicker}</div><h2>${isl.name}</h2><p>${meta.desc}</p></div>
        </div>
        <div class="island-progress-pill"><span class="island-stars">⭐ ${lvStars}</span><span class="island-done">${lvDone}/${isl.levels.length} 關已完成</span></div>
      </div>`;
    const row = document.createElement('div');
    row.className = 'level-grid';
    isl.levels.forEach((lv, li) => {
      const open = lv.playable && isUnlocked(lv.id);
      const st = loadState().stars[lv.id] || 0;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'level-card' + (open ? '' : ' locked') + (st === 3 ? ' perfect' : '');
      b.innerHTML = `<span class="level-number">L${ii + 1}-${li + 1}</span>
        <span class="level-emoji">${open ? meta.emoji : '🔒'}</span>
        <span class="level-title">${lv.name}</span>
        <span class="level-skill">${lv.playable ? '數數、序數、分合' : '即將開放'}</span>
        <span class="level-stars"><span class="${st >= 1 ? 'earned' : 'empty'}">★</span><span class="${st >= 2 ? 'earned' : 'empty'}">★</span><span class="${st >= 3 ? 'earned' : 'empty'}">★</span></span>`;
      b.onclick = () => {
        if (!open) {
          b.classList.remove('locked-shake'); void b.offsetWidth; b.classList.add('locked-shake');
          toast('🔒 尚未解鎖，請先完成沙丘點點數！'); blip('bad'); return;
        }
        startLevel(lv.id);
      };
      row.appendChild(b);
    });
    card.appendChild(row);
    box.appendChild(row);
  });
}

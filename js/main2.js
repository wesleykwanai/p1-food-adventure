window.addEventListener('DOMContentLoaded', () => {
  const tm = location.hash.match(/^#(a|b|c)$/);
  if (tm) document.body.dataset.tbar = tm[1];
  (function(){ // random meteors, zoned
    const view = document.querySelector('.home-view');
    if(!view) return;
    function spawnAt(min, max){
      const d = document.createElement('div');
      d.className = 'shoot';
      d.setAttribute('aria-hidden','true');
      d.style.left = (min + Math.random()*(max-min)) + '%';
      d.style.top = '-6%';
      d.style.transform = 'rotate(28deg)';
      const inner = document.createElement('i');
      inner.style.animation = 'none';
      d.appendChild(inner);
      view.appendChild(d);
      const dur = 3500 + Math.random()*1500;
      const a = inner.animate([
        { transform: 'translateY(-12vh)', opacity: 0 },
        { transform: 'translateY(4vh)', opacity: 1, offset: 0.12 },
        { transform: 'translateY(48vh)', opacity: 1, offset: 0.7 },
        { transform: 'translateY(72vh)', opacity: 0 }
      ], { duration: dur, easing: 'linear' });
      a.onfinish = () => d.remove();
    }
    function loop(min, max){
      spawnAt(min, max);
      setTimeout(() => loop(min, max), 800 + Math.random()*1400);
    }
    loop(2, 30);
    setTimeout(() => loop(35, 63), 500);
    setTimeout(() => loop(68, 97), 1000);
  })();
  document.getElementById('btn-start').onclick = () => { blip('click'); renderMap(); if (!musicOn) toggleMusic(document.getElementById('btn-music')); };
  document.getElementById('btn-home').onclick = () => renderHome();
  const ht = document.getElementById('btn-home-top');
  if (ht) ht.onclick = () => renderHome();
  document.getElementById('btn-back-map').onclick = () => renderMap();
  const how = document.getElementById('how-overlay');
  const hb = document.getElementById('btn-how');
  if (hb && how) hb.onclick = () => { blip('click'); how.hidden = false; };
  const hc = document.getElementById('btn-how-close');
  if (hc && how) hc.onclick = () => { how.hidden = true; };
  if (how) how.addEventListener('click', e => { if (e.target === how) how.hidden = true; });
  const hintFn = () => { if (SES?.qs[SES.i]) showHint(SES.qs[SES.i]); };
  document.getElementById('btn-hint').onclick = hintFn;
  const htop = document.getElementById('btn-hint-top');
  if (htop) htop.onclick = hintFn;
  const repFn = () => { if (SES?.qs[SES.i]) speak(SES.qs[SES.i].speak); };
  document.getElementById('btn-repeat').onclick = repFn;
  const rep2 = document.getElementById('btn-repeat-2');
  if (rep2) rep2.onclick = repFn;
  document.getElementById('btn-sound').onclick = e => {
    soundOn = !soundOn;
    e.currentTarget.textContent = soundOn ? '🔊' : '🔇';
    if (!soundOn) {
      if (window.speechSynthesis) speechSynthesis.cancel();
      if (musicOn) toggleMusic(null);
    } else if (!musicOn) toggleMusic(null);
  };
  renderHome();
  refreshStars();
  // BGM 預設播：load 即試播，瀏覽器擋自動播就等第一次撳/撳鍵先起
  const mb2 = null; // 音樂掣已拆，長開唔使 toggle
  const kick = (e) => {
    if (e && e.target && e.target.closest && e.target.closest('#btn-music')) return;
    if (typeof blip !== 'undefined' && blip.ctx && blip.ctx.state === 'suspended') blip.ctx.resume();
    if (!musicOn) toggleMusic(mb2);
  };
  document.addEventListener('pointerdown', kick);
  document.addEventListener('keydown', kick);
  try { if (!musicOn) toggleMusic(mb2); } catch (e) {}
});

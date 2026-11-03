// Cantonese TTS + tiny WebAudio SFX. Plain static, no build.
let soundOn = true, musicOn = false, musicTimer = null;
function pickVoice() {
  const vs = speechSynthesis ? speechSynthesis.getVoices() : [];
  return vs.find(v => /yue|hk|cantonese|廣東|粵/i.test(v.lang + v.name))
      || vs.find(v => /^zh[-_]HK/i.test(v.lang))
      || vs.find(v => /^zh/i.test(v.lang)) || null;
}
if (window.speechSynthesis) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }
function speak(text) {
  if (!soundOn || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-HK'; u.rate = 0.92;
  const v = pickVoice(); if (v) u.voice = v;
  speechSynthesis.speak(u);
}
function speakSequence(lines, gap = 600) {
  if (!soundOn) return;
  lines.forEach((t, i) => setTimeout(() => speak(t), i * (t.length * 180 + gap)));
}
function blip(kind) {
  if (!soundOn) return;
  try {
    const ctx = blip.ctx || (blip.ctx = new (window.AudioContext || window.webkitAudioContext)());
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = kind === 'good' ? 660 : kind === 'bad' ? 180 : 440;
    o.type = kind === 'bad' ? 'sawtooth' : 'sine';
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    o.start(); o.stop(ctx.currentTime + 0.18);
  } catch (e) {}
}
function toggleMusic(btn) {
  musicOn = !musicOn;
  if (btn) btn.textContent = musicOn ? '🎵播緊' : '🎵';
  if (musicOn) {
    // 原創歡樂 loop：C 大調跳躍旋律 + 簡單 bass，WebAudio 合成，零音檔
    const LEAD = [523,659,784,659,880,784,659,587,523,659,784,880,784,659,587,523];
    const BASS = [131,98,110,87];
    const ctx = blip.ctx || (blip.ctx = new (window.AudioContext || window.webkitAudioContext)());
    if (ctx.state === 'suspended') ctx.resume();
    let n = 0;
    musicTimer = setInterval(() => {
      try {
        if (ctx.state !== 'running') return;
        const t = ctx.currentTime;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'triangle'; o.frequency.value = LEAD[n % LEAD.length];
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.09, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
        o.start(t); o.stop(t + 0.35);
        if (n % 4 === 0) {
          const o2 = ctx.createOscillator(), g2 = ctx.createGain();
          o2.connect(g2); g2.connect(ctx.destination);
          o2.type = 'sine'; o2.frequency.value = BASS[(n / 4) % 4];
          g2.gain.setValueAtTime(0.07, t);
          g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
          o2.start(t); o2.stop(t + 0.55);
        }
        n++;
      } catch (e) {}
    }, 300);
  } else clearInterval(musicTimer);
}

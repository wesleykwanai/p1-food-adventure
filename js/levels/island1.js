// Island 1 布甸沙漠：1N1 完整（點數比較 / 順倒數 / 序數單雙 / 分合）。
// 畫面文字一律書面語；speak / hintSpeak / explanationSpeak 一律廣東話口語。
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pickOptions(ans, min, max) {
  const s = new Set([ans]);
  while (s.size < 4) s.add(min + Math.floor(Math.random() * (max - min + 1)));
  return shuffle([...s]);
}
// L1 沙丘點點數：5×點數(3–10) + 1×比多少(隨機左右大)。EDB 1N1 only.
function genL1() {
  const qs = [];
  const used = new Set();
  while (qs.length < 5) {
    const n = 3 + Math.floor(Math.random() * 8); // 3–10
    if (used.has(n)) continue;
    used.add(n);
    qs.push({
      prompt: `沙漠裏有多少個布甸？數一數共有多少個！`,
      speak: `數下有幾多個布甸？`,
      hint: '逐個指着數：1、2、3……',
      hintSpeak: '一個一個指住數：1、2、3……',
      explanation: `答案是 ${n} 個。逐個數就不會遺漏。`,
      explanationSpeak: `答案係 ${n} 個。一個一個數就唔會漏。`,
      answer: n, options: pickOptions(n, 1, 12),
      visual: { type: 'puddingCount', n }
    });
  }
  // 比多少：大碗隨機左右（已修偏左 bug）
  let a = 3 + Math.floor(Math.random() * 5), b = a;
  while (b === a) b = 3 + Math.floor(Math.random() * 5);
  const big = Math.max(a, b);
  const bigLeft = Math.random() < 0.5;
  const left = bigLeft ? big : Math.min(a, b), right = bigLeft ? Math.min(a, b) : big;
  qs.push({
    prompt: '哪一碗比較多？較多的那一碗有多少個？',
    speak: '邊碗多啲？多嗰碗有幾多個？',
    hint: '兩碗逐粒對照來數數完才回答較多的一碗是多少。',
    hintSpeak: '兩碗逐粒對住數數晒先答多嗰碗係幾多。',
    explanation: `王子這碗比好朋友那碗多，較多的那一碗有 ${big} 個。`,
    explanationSpeak: `王子呢碗比好朋友嗰碗多，多嗰碗有 ${big} 個。`,
    answer: big, options: pickOptions(big, 1, 12),
    visual: { type: 'bowls', bowls: [{ name: '王子這碗（左）', n: left }, { name: '好朋友那碗（右）', n: right }] }
  });
  return qs;
}
// L2 仙人掌順數路：4×順數 + 2×倒數（每 1 個一數）。EDB 1N1 順數倒數。
function genL1_2() {
  const qs = [];
  const usedUp = new Set();
  while (qs.filter(q => q.dir === 'up').length < 4) {
    const s = 1 + Math.floor(Math.random() * 14); // 1–14，答案 ≤17
    if (usedUp.has(s)) continue;
    usedUp.add(s);
    const nums = [s, s + 1, s + 2], ans = s + 3;
    const seq = nums.join('、');
    qs.push({
      dir: 'up',
      prompt: `${seq}，下一個是幾？`,
      speak: `${seq}，下一個係幾？`,
      hint: `每次加 1 數下去：${seq}、…`,
      hintSpeak: '每次加 1 數落去',
      explanation: `順數每次加 1：${seq}、${ans}。`,
      explanationSpeak: `順數每次加 1：${seq}、${ans}`,
      answer: ans, options: pickOptions(ans, 1, 20),
      visual: { type: 'sequence', nums: [...nums, null] }
    });
  }
  const usedDown = new Set();
  while (qs.filter(q => q.dir === 'down').length < 2) {
    const s = 9 + Math.floor(Math.random() * 10); // 9–18，答案 ≥6
    if (usedDown.has(s)) continue;
    usedDown.add(s);
    const nums = [s, s - 1, s - 2], ans = s - 3;
    const seq = nums.join('、');
    qs.push({
      dir: 'down',
      prompt: `${seq}，下一個是幾？`,
      speak: `${seq}，下一個係幾？`,
      hint: `每次減 1 數下去：${seq}、…`,
      hintSpeak: '每次減 1 數返轉頭',
      explanation: `倒數每次減 1：${seq}、${ans}。`,
      explanationSpeak: `倒數每次減 1：${seq}、${ans}`,
      answer: ans, options: pickOptions(ans, 1, 20),
      visual: { type: 'sequence', nums: [...nums, null] }
    });
  }
  return shuffle(qs);
}
// L3 駱駝排排企：3×序數 + 3×單雙數。EDB 1N1 序數基數、單雙數（叫單/雙）。
function genL1_3() {
  const qs = [];
  const usedP = new Set();
  while (qs.length < 3) {
    const n = 5 + Math.floor(Math.random() * 4); // 5–8 隻
    const p = 1 + Math.floor(Math.random() * n);
    if (usedP.has(n + '-' + p)) continue;
    usedP.add(n + '-' + p);
    qs.push({
      prompt: '由左開始數，戴帽子的駱駝排第幾？',
      speak: '由左開始數，戴帽嗰隻駱駝排第幾？',
      hint: '第一、第二、第三這樣數下去',
      hintSpeak: '第一、第二、第三咁數落去',
      explanation: `由左數起，第 ${p} 隻就是戴帽子的駱駝。`,
      explanationSpeak: `由左數起，第 ${p} 隻就係戴帽嗰隻駱駝`,
      answer: p, options: pickOptions(p, 1, 10),
      visual: { type: 'lineup', n, special: p }
    });
  }
  const usedN = new Set();
  while (qs.length < 6) {
    const n = 3 + Math.floor(Math.random() * 17); // 3–19
    if (usedN.has(n)) continue;
    usedN.add(n);
    const isOdd = n % 2 === 1;
    qs.push({
      prompt: `${n} 是單數還是雙數？`,
      speak: `${n} 係單數定雙數？`,
      hint: '兩個兩個一組，看有沒有落單',
      hintSpeak: '兩個兩個一組，睇下有冇落單',
      explanation: isOdd ? `${n} 兩個一組會多出一個，所以是單數。` : `${n} 剛好分完，所以是雙數。`,
      explanationSpeak: isOdd ? `${n} 兩個一組會剩返一個，所以係單數` : `${n} 啱啱好分晒，所以係雙數`,
      answer: isOdd ? '單數' : '雙數',
      options: shuffle(['單數', '雙數']),
      visual: { type: 'pairs', n }
    });
  }
  return shuffle(qs);
}
// L4 綠洲大數數：2×合成 + 2×分解 + 2×蓋住。EDB 1N1 分解合成（2–18，講「分為」）。
function genL1_4() {
  const qs = [];
  const usedS = new Set();
  while (qs.length < 2) {
    const a = 1 + Math.floor(Math.random() * 9);
    const b = 1 + Math.floor(Math.random() * 9);
    const sum = a + b;
    if (sum < 3 || sum > 18 || usedS.has(sum)) continue;
    usedS.add(sum);
    qs.push({
      prompt: `${a} 和 ${b} 合起來一共有多少個？`,
      speak: `${a} 同 ${b} 合埋一齊有幾多個？`,
      hint: `先數 ${a} 個，再數下去`,
      hintSpeak: `先數 ${a} 個，再數落去`,
      explanation: `${a} 和 ${b} 合起來是 ${sum} 個。`,
      explanationSpeak: `${a} 同 ${b} 合埋一齊係 ${sum} 個`,
      answer: sum, options: pickOptions(sum, 1, 18),
      visual: { type: 'split', a, b }
    });
  }
  const usedD = new Set();
  while (qs.length < 4) {
    const n = 5 + Math.floor(Math.random() * 14); // 5–18
    const a = 1 + Math.floor(Math.random() * 9);
    const b = n - a;
    if (b < 1 || b > 9 || usedD.has(n + '-' + a)) continue; // 兩份皆一位數
    usedD.add(n + '-' + a);
    qs.push({
      prompt: `${n} 分為 ${a} 和多少？`,
      speak: `${n} 分為 ${a} 同幾多？`,
      hint: `由 ${a} 開始繼續數到 ${n}`,
      hintSpeak: `由 ${a} 開始繼續數到 ${n}`,
      explanation: `${n} 分為 ${a} 和 ${b}。`,
      explanationSpeak: `${n} 分為 ${a} 同 ${b}`,
      answer: b, options: pickOptions(b, 1, 12),
      visual: { type: 'covered', n, hidden: b }
    });
  }
  while (qs.length < 6) {
    const n = 6 + Math.floor(Math.random() * 9); // 6–14
    const c = 2 + Math.floor(Math.random() * (n - 3));
    const v = n - c;
    const askHidden = Math.random() < 0.5;
    qs.push({
      prompt: askHidden ? `一共有 ${n} 個布甸，看到 ${v} 個，蓋住了多少個？` : `一共有 ${n} 個布甸，蓋住了 ${c} 個，還看到多少個？`,
      speak: askHidden ? `一共有 ${n} 個布甸，見到 ${v} 個，冚住咗幾多個？` : `一共有 ${n} 個布甸，冚住咗 ${c} 個，仲見到幾多個？`,
      hint: askHidden ? '數一數蓋住的盒子' : '由 1 開始數看到的布甸',
      hintSpeak: askHidden ? '數下有幾多個盒冚住咗' : '由 1 開始數見到嘅布甸',
      explanation: `蓋住了 ${c} 個，還看到 ${v} 個；${n} 分為 ${c} 和 ${v}。`,
      explanationSpeak: `冚住咗 ${c} 個，仲見到 ${v} 個；${n} 分為 ${c} 同 ${v}`,
      answer: askHidden ? c : v,
      options: pickOptions(askHidden ? c : v, 1, 14),
      visual: { type: 'covered', n, hidden: c }
    });
  }
  return shuffle(qs);
}

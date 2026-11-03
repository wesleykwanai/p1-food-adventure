// EDB 1N1: 數物件題一律唔印數字，數目由學生自己數。順數列（數字本身就係題目）除外。
// 畫面文字一律書面語。
function render(el, v) {
  el.innerHTML = '';
  if (v.type === 'puddingCount') {
    const d = document.createElement('div');
    d.className = 'float';
    d.textContent = '🍮'.repeat(v.n);
    const cap = document.createElement('div');
    cap.style.fontSize = '18px';
    cap.textContent = '數一數有幾個布甸？';
    el.append(d, cap);
  } else if (v.type === 'bowls') {
    // 只印名，唔印數（已修 bug）
    v.bowls.forEach(b => {
      const d = document.createElement('div');
      d.className = 'bowl';
      d.innerHTML = `<div>🍚 ${b.name}</div><div class="food">${'🍡'.repeat(b.n)}</div>`;
      el.appendChild(d);
    });
    const cap = document.createElement('div');
    cap.style.fontSize = '18px';
    cap.textContent = '兩碗丸子，哪一碗比較多？';
    el.appendChild(cap);
  } else if (v.type === 'sequence') {
    const d = document.createElement('div');
    d.style.cssText = 'display:flex;gap:10px;justify-content:center;flex-wrap:wrap';
    v.nums.forEach(x => {
      const c = document.createElement('div');
      c.style.cssText = 'min-width:56px;padding:10px 12px;border-radius:14px;font-size:30px;font-weight:900;background:' + (x === null ? '#ffd93d' : '#fff6d8') + ';color:#2b1408';
      c.textContent = x === null ? '？' : x;
      d.appendChild(c);
    });
    el.appendChild(d);
  } else if (v.type === 'lineup') {
    const d = document.createElement('div');
    d.style.cssText = 'display:flex;gap:6px;justify-content:center;flex-wrap:wrap';
    for (let i = 1; i <= v.n; i++) {
      const s = document.createElement('div');
      s.style.cssText = 'display:flex;flex-direction:column;align-items:center;font-size:40px';
      const hat = document.createElement('div');
      hat.style.cssText = 'font-size:26px;height:32px';
      hat.textContent = i === v.special ? '🎩' : '';
      const c = document.createElement('div');
      c.textContent = '🐪';
      s.append(hat, c);
      d.appendChild(s);
    }
    el.appendChild(d);
    const cap = document.createElement('div');
    cap.style.fontSize = '18px';
    cap.textContent = '由左開始數，找出戴帽子的駱駝';
    el.appendChild(cap);
  } else if (v.type === 'pairs') {
    const d = document.createElement('div');
    d.style.cssText = 'display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap;font-size:30px';
    for (let i = 0; i < Math.floor(v.n / 2); i++) {
      const s = document.createElement('span');
      s.textContent = '●●';
      d.appendChild(s);
    }
    if (v.n % 2 === 1) {
      const s = document.createElement('span');
      s.style.cssText = 'background:#ffd93d;border-radius:50%;padding:2px 8px';
      s.textContent = '●';
      d.appendChild(s);
    }
    el.appendChild(d);
    const cap = document.createElement('div');
    cap.style.fontSize = '18px';
    cap.textContent = '兩個兩個一組';
    el.appendChild(cap);
  } else if (v.type === 'covered') {
    const vis = v.n - v.hidden;
    const d = document.createElement('div');
    d.style.cssText = 'display:flex;gap:8px;justify-content:center;flex-wrap:wrap;font-size:34px';
    for (let i = 0; i < vis; i++) {
      const s = document.createElement('span');
      s.textContent = '🍮';
      d.appendChild(s);
    }
    for (let i = 0; i < v.hidden; i++) {
      const s = document.createElement('span');
      s.style.cssText = 'background:#8a5a2b;border-radius:12px;min-width:44px;text-align:center;color:#fff6d8';
      s.textContent = '？';
      d.appendChild(s);
    }
    el.appendChild(d);
    const cap = document.createElement('div');
    cap.style.fontSize = '18px';
    cap.textContent = '布甸被蓋住了一部分';
    el.appendChild(cap);
  } else if (v.type === 'split') {
    const d = document.createElement('div');
    d.style.cssText = 'display:flex;gap:14px;justify-content:center;align-items:center;flex-wrap:wrap;font-size:34px';
    const g1 = document.createElement('span');
    g1.textContent = '🍮'.repeat(v.a);
    const plus = document.createElement('span');
    plus.style.cssText = 'font-size:28px;font-weight:900';
    plus.textContent = '＋';
    const g2 = document.createElement('span');
    g2.textContent = '🍮'.repeat(v.b);
    d.append(g1, plus, g2);
    el.appendChild(d);
    const cap = document.createElement('div');
    cap.style.fontSize = '18px';
    cap.textContent = '兩堆布甸，合起來有多少個？';
    el.appendChild(cap);
  }
}

// localStorage: food-adventure-p1-v1 {stars:{levelId:n}, unlocked:['l1-1']}
const SKEY = 'food-adventure-p1-v1';
function loadState() {
  try { return JSON.parse(localStorage.getItem(SKEY)) || { stars: {}, unlocked: ['l1-1'] }; }
  catch (e) { return { stars: {}, unlocked: ['l1-1'] }; }
}
function saveState(s) { localStorage.setItem(SKEY, JSON.stringify(s)); }
function totalStars() {
  const s = loadState();
  return Object.values(s.stars).reduce((a, b) => a + b, 0);
}
function isUnlocked(id) { return loadState().unlocked.includes(id); }
function awardStars(id, n) {
  const s = loadState();
  s.stars[id] = Math.max(s.stars[id] || 0, n);
  saveState(s);
}
function unlock(id) {
  const s = loadState();
  if (!s.unlocked.includes(id)) { s.unlocked.push(id); saveState(s); }
}

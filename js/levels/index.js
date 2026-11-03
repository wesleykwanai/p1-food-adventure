// island1 四關全開 (1N1 完整)。其餘 island  locked，待起。
const AdventureWorld = [
  { id: 'island1', icon: '🍮', name: '布丁沙漠（數數 1N1）', levels: [
    { id: 'l1-1', name: '沙丘點點數', gen: () => genL1(), playable: true },
    { id: 'l1-2', name: '仙人掌順數路', gen: () => genL1_2(), playable: true },
    { id: 'l1-3', name: '駱駝排排企', gen: () => genL1_3(), playable: true },
    { id: 'l1-4', name: '綠洲大數數', gen: () => genL1_4(), playable: true },
  ]},
  { id: 'island2', icon: '🍓', name: '草莓火山（加減 1N2→1N4）', levels: [
    { id: 'l2-1', name: '火山口加加佢', playable: false },
  ]},
  { id: 'island3', icon: '🍜', name: '拉麵海洋（圖形位置 1S1–1S3）', levels: [
    { id: 'l3-1', name: '麵條圖形捉迷藏', playable: false },
  ]},
  { id: 'island4', icon: '🌈', name: '彩虹糖雲城（度量生活 1M1–1M4）', levels: [
    { id: 'l4-1', name: '雲上量一量', playable: false },
  ]},
];

// Premios de Hoshito. Este archivo lo usan el servidor (para decidir premios) y el juego (para mostrarlos).
// Para cambiar qué se gana, edita aquí: no hace falta tocar nada más.

export const RARITY = {
  comun: { label: 'Común', weight: 62, dupCoins: 60, color: '#9fb3ab' },
  rara: { label: 'Rara', weight: 30, dupCoins: 150, color: '#7cc8ff' },
  legendaria: { label: 'Legendaria', weight: 8, dupCoins: 400, color: '#ffd54a' },
};

// Ruleta Hoshi: un giro por cada sello confirmado en caja.
// type: coins (monedas), food (paquete a la nevera), item (ropa exclusiva) o theme (fondo exclusivo).
// Si sale un objeto que ya tiene, se cambia por monedas (dupCoins de su rareza).
export const RULETA = [
  { id: 'r-coins-60', rarity: 'comun', type: 'coins', amount: 60 },
  { id: 'r-coins-90', rarity: 'comun', type: 'coins', amount: 90 },
  { id: 'r-food-1', rarity: 'comun', type: 'food', food: { rollo: 2, nigiri: 2, edamame: 2 } },
  { id: 'lentes-corazon', rarity: 'comun', type: 'item' },
  { id: 'gorro-fiesta', rarity: 'comun', type: 'item' },
  { id: 'tiara', rarity: 'comun', type: 'item' },
  { id: 'cuernos', rarity: 'comun', type: 'item' },
  { id: 'antifaz', rarity: 'comun', type: 'item' },
  { id: 'r-coins-180', rarity: 'rara', type: 'coins', amount: 180 },
  { id: 'r-food-2', rarity: 'rara', type: 'food', food: { empanizado: 3, ramen: 2, mochi: 2 } },
  { id: 'diadema-panda', rarity: 'rara', type: 'item' },
  { id: 'corona-flores', rarity: 'rara', type: 'item' },
  { id: 'sombrero-mago', rarity: 'rara', type: 'item' },
  { id: 'monoculo', rarity: 'rara', type: 'item' },
  { id: 'collar-perlas', rarity: 'rara', type: 'item' },
  { id: 'recamara-sakura', rarity: 'rara', type: 'theme' },
  { id: 'bano-arrecife', rarity: 'rara', type: 'theme' },
  { id: 'r-coins-500', rarity: 'legendaria', type: 'coins', amount: 500 },
  { id: 'corona-sushi', rarity: 'legendaria', type: 'item' },
  { id: 'aura-estrellas', rarity: 'legendaria', type: 'item' },
  { id: 'lentes-pixel', rarity: 'legendaria', type: 'item' },
];

// Camino de visitas: premio garantizado al llegar a cada número de visitas confirmadas.
// Es lo más valioso del juego porque cada visita es una compra real en Hoshi.
export const CAMINO = [
  { visits: 1, type: 'coins', amount: 100 },
  { visits: 2, type: 'food', food: { rollo: 3, edamame: 3, matcha: 2 } },
  { visits: 3, type: 'item', id: 'bandana-hoshi' },
  { visits: 4, type: 'coins', amount: 200 },
  { visits: 5, type: 'item', id: 'chef-dorado' },
  { visits: 6, type: 'food', food: { empanizado: 3, ramen: 3, taco: 2 } },
  { visits: 7, type: 'coins', amount: 300 },
  { visits: 8, type: 'item', id: 'lentes-estrella' },
  { visits: 9, type: 'coins', amount: 350 },
  { visits: 10, type: 'theme', id: 'cocina-hoshi' },
  { visits: 12, type: 'coins', amount: 450 },
  { visits: 14, type: 'item', id: 'bufanda-dorada' },
  { visits: 16, type: 'food', food: { empanizado: 4, taco: 4, mochi: 4, ramen: 4 } },
  { visits: 18, type: 'coins', amount: 600 },
  { visits: 20, type: 'item', id: 'aura-dorada' },
];

// Premios por subir de nivel (los da el juego).
export const LEVEL_ITEMS = {
  5: { type: 'theme', id: 'juegos-neon' },
  8: { type: 'item', id: 'lentes-3d' },
  10: { type: 'item', id: 'halo' },
  12: { type: 'item', id: 'aura-burbujas' },
  15: { type: 'item', id: 'corona-hoshi' },
  20: { type: 'item', id: 'aura-corazones' },
};
export function levelReward(level) {
  const r = { coins: 30 + level * 10, food: null, unlock: LEVEL_ITEMS[level] || null };
  if (level % 3 === 0) r.food = { rollo: 2, mochi: 1, matcha: 1 };
  return r;
}

// Ranking semanal: premios del podio de la semana pasada, por cada minijuego.
export const RANK_GAMES = ['catch', 'fly', 'memo', 'chef', 'run', 'simon'];
export const RANK_LOWER = { memo: true };
export const RANK_MAX = { catch: 400, fly: 400, memo: 400, chef: 150, run: 6000, simon: 80 };
export const RANK_PRIZES = [150, 80, 40];

/** Elige un premio de la ruleta al azar según la rareza. rnd: función que da un número entre 0 y 1. */
export function pickRuleta(rnd) {
  const total = Object.values(RARITY).reduce((a, b) => a + b.weight, 0);
  let x = rnd() * total;
  let rarity = 'comun';
  for (const [k, v] of Object.entries(RARITY)) {
    if (x < v.weight) { rarity = k; break; }
    x -= v.weight;
  }
  const pool = RULETA.filter((p) => p.rarity === rarity);
  return pool[Math.floor(rnd() * pool.length)];
}

// Aniversario de Hoshi: la temporada dura 3 días antes y 3 después de la fecha.
// Cuando tengas la fecha, cámbiala, por ejemplo: { mes: 3, dia: 14 } para el 14 de marzo.
export const ANIVERSARIO = null;

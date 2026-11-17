// Juego de Hoshito para la comunidad Hoshi. Se monta dentro de /Hoshito/jugar.
// cfg: { name, visits, spins, state, owned, camino, api } (lo manda el servidor).
import { ANIVERSARIO, CAMINO, RARITY, levelReward } from '@/lib/hoshitoRewards';
import { MARKUP } from './markup';

export function start(root, cfg) {
  root.innerHTML = MARKUP;
  var FONT = (getComputedStyle(root).getPropertyValue('--hj-display') || '').trim() || 'sans-serif';
  var RING = '/hoshito/aro.svg';
  var cleanups = [];
  // ===================== DATOS =====================
  var COIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#ffd54a" stroke="#b8860b" stroke-width="2"/><path d="M12 7l1.5 3.3 3.5.4-2.6 2.4.7 3.5L12 14.8 8.9 16.6l.7-3.5L7 10.7l3.5-.4z" fill="#b8860b"/></svg>';
  var HEART_PATH = 'M12 21s-7.5-4.7-10-9.2C.3 8.6 1.9 4.5 5.8 4.5c2.2 0 3.8 1.2 4.7 2.6l1.5 2.2 1.5-2.2c.9-1.4 2.5-2.6 4.7-2.6 3.9 0 5.5 4.1 3.8 7.3C19.5 16.3 12 21 12 21z';

  var FOODS = [
    { id: 'rollo', name: 'Rollo', price: 8, hunger: 28, happy: 4, energy: 0, msg: '¡Ñam! Un rollo clásico.',
      svg: '<circle cx="20" cy="20" r="19" fill="#111114"/><circle cx="20" cy="20" r="14" fill="#fff"/><circle cx="16" cy="18" r="5" fill="#ff9f7a"/><circle cx="24" cy="23" r="4.5" fill="#c2e8aa"/>' },
    { id: 'empanizado', name: 'Empanizado', price: 14, hunger: 38, happy: 10, energy: 0, msg: '¡Su favorito! Crujiente por fuera.',
      svg: '<circle cx="20" cy="20" r="19" fill="#d99a3a"/><circle cx="20" cy="20" r="18" fill="none" stroke="#a8691c" stroke-width="2" stroke-dasharray="3 3"/><circle cx="20" cy="20" r="13" fill="#fff"/><circle cx="17" cy="18" r="5" fill="#ff9f7a"/><circle cx="24" cy="23" r="4" fill="#f6a65c"/>' },
    { id: 'nigiri', name: 'Nigiri', price: 6, hunger: 18, happy: 3, energy: 0, msg: 'Un nigiri de salmón, ligerito.',
      svg: '<rect x="5" y="20" width="30" height="14" rx="7" fill="#fff" stroke="#d8d3c8" stroke-width="1.5"/><path d="M4 21c4-9 28-11 32-2 0 3-3 4-6 4H9c-3 0-5-1-5-2z" fill="#ff8a5c"/><path d="M12 15l3 6M19 13l3 7M26 13l3 7" stroke="#ffd0b8" stroke-width="2" stroke-linecap="round"/>' },
    { id: 'ramen', name: 'Ramen', price: 12, hunger: 34, happy: 6, energy: 6, msg: 'Ramen calientito. ¡Sluuurp!',
      svg: '<path d="M27 3l-8 16M33 5l-11 15" stroke="#b07a52" stroke-width="2.2" stroke-linecap="round"/><path d="M4 19h32a16 15 0 01-32 0z" fill="#e2483d"/><path d="M4 19h32a16 15 0 01-1.2 5.5H5.2A16 15 0 014 19z" fill="#c23a30"/><ellipse cx="20" cy="19" rx="16" ry="3.5" fill="#f6c76a"/><path d="M9 19q3-3 6 0t6 0 6 0" stroke="#fff3c4" stroke-width="1.6" fill="none"/><circle cx="27" cy="18" r="3.4" fill="#fff"/><circle cx="27" cy="18" r="1.7" fill="#f6a623"/><path d="M8 32h24" stroke="#a52f27" stroke-width="2" stroke-linecap="round"/>' },
    { id: 'taco', name: 'Taco de camarón', price: 10, hunger: 30, happy: 8, energy: 0, msg: '¡Japo-Mex en su máxima expresión!',
      svg: '<path d="M4 30a16 16 0 0132 0z" fill="#f2c46b" stroke="#c99536" stroke-width="1.5"/><path d="M7 27c3-5 6-7 9-7M33 27c-3-5-6-7-9-7" stroke="#7cc35a" stroke-width="3" stroke-linecap="round"/><path d="M14 22a5 5 0 1110 0" fill="none" stroke="#ff8a6a" stroke-width="4" stroke-linecap="round"/><path d="M20 20a4 4 0 117 2" fill="none" stroke="#ffa98f" stroke-width="3.5" stroke-linecap="round"/><circle cx="12" cy="24" r="1.4" fill="#e2483d"/><circle cx="28" cy="25" r="1.4" fill="#e2483d"/>' },
    { id: 'gyoza', name: 'Gyoza', price: 7, hunger: 20, happy: 4, energy: 0, msg: 'Gyozas doraditas.',
      svg: '<path d="M4 27c0-10 7-17 16-17s16 7 16 17c0 3-2 4-5 4H9c-3 0-5-1-5-4z" fill="#f5e4c3" stroke="#d2b98a" stroke-width="1.5"/><path d="M5 28c4 3 26 3 30 0" stroke="#d99a3a" stroke-width="3.5" stroke-linecap="round"/><path d="M12 13l2 4M17 11l1 4M23 11l-1 4M28 13l-2 4" stroke="#d2b98a" stroke-width="1.6" stroke-linecap="round"/>' },
    { id: 'edamame', name: 'Edamames', price: 4, hunger: 10, happy: 2, energy: 2, msg: 'Edamames para botanear.',
      svg: '<path d="M6 26C6 14 22 6 34 10c2 1 1 4-1 5-9 3-14 9-19 15-3 3-8 2-8-4z" fill="#7cc35a" stroke="#4e8f34" stroke-width="1.5"/><circle cx="14" cy="23" r="3.6" fill="#a6e07e"/><circle cx="21" cy="17" r="3.6" fill="#a6e07e"/><circle cx="28" cy="13" r="3.2" fill="#a6e07e"/>' },
    { id: 'mochi', name: 'Mochi', price: 8, hunger: 10, happy: 16, energy: 0, msg: 'Mochi de postre. Qué dulce.',
      svg: '<ellipse cx="20" cy="24" rx="15" ry="12" fill="#ffc2d4" stroke="#e98fae" stroke-width="1.5"/><ellipse cx="15" cy="19" rx="4" ry="2.5" fill="#fff" opacity="0.8"/><circle cx="16" cy="25" r="1.5" fill="#111114"/><circle cx="24" cy="25" r="1.5" fill="#111114"/><path d="M18 28q2 2 4 0" stroke="#111114" stroke-width="1.3" fill="none" stroke-linecap="round"/>' },
    { id: 'matcha', name: 'Té matcha', price: 5, hunger: 6, happy: 4, energy: 18, msg: 'Té matcha: ¡recargado!',
      svg: '<path d="M8 14h24l-2 18a4 4 0 01-4 3H14a4 4 0 01-4-3z" fill="#f5f2ec" stroke="#cfc8b8" stroke-width="1.5"/><ellipse cx="20" cy="14" rx="12" ry="3.5" fill="#8cc63f"/><path d="M15 9c0-3 3-3 3-6M22 9c0-3 3-3 3-6" stroke="#c9d6d1" stroke-width="1.6" stroke-linecap="round" fill="none"/>' },
    { id: 'jamaica', name: 'Agua de jamaica', price: 4, hunger: 6, happy: 6, energy: 6, msg: 'Agüita de jamaica bien fría.',
      svg: '<path d="M25 2l-3 14" stroke="#7cc35a" stroke-width="2.4" stroke-linecap="round"/><path d="M9 10h22l-3 24a3 3 0 01-3 2.6H15a3 3 0 01-3-2.6z" fill="#e8f4f8" stroke="#b9d3dc" stroke-width="1.5"/><path d="M10.2 16h19.6l-2.3 18a3 3 0 01-3 2.4H15.5a3 3 0 01-3-2.4z" fill="#b5174d"/><rect x="14" y="18" width="5" height="5" rx="1" fill="#fff" opacity="0.6"/><rect x="20" y="22" width="5" height="5" rx="1" fill="#fff" opacity="0.5"/>' }
  ];

  // Accesorios. head: se dibuja sobre la cabeza (viewBox propio). face: dentro de la cara (coordenadas de la cara).
  var ITEMS = [
    { id: 'chef', slot: 'head', name: 'Gorro de chef', price: 60, level: 1, w: 56, b: 84, vb: '0 0 100 80',
      svg: '<rect x="18" y="56" width="64" height="22" rx="4" fill="#fff" stroke="#111114" stroke-width="3"/><path d="M22 58c-14-2-18-20-4-26 0-14 18-20 26-10 8-12 28-8 28 6 14 2 16 24 2 30" fill="#fff" stroke="#111114" stroke-width="3"/><path d="M38 60v-14M62 60v-14" stroke="#d9d2c5" stroke-width="2.5" stroke-linecap="round"/>' },
    { id: 'banda', slot: 'head', name: 'Banda ninja', price: 40, level: 1, w: 96, b: 66, vb: '0 0 120 60',
      svg: '<path d="M8 50C20 18 100 18 112 50" fill="none" stroke="#111114" stroke-width="17" stroke-linecap="round"/><path d="M8 50C20 18 100 18 112 50" fill="none" stroke="#e2483d" stroke-width="12" stroke-linecap="round"/><path d="M60 22l2.6 5.4 5.9.6-4.4 4 1.2 5.8L60 35l-5.3 2.8 1.2-5.8-4.4-4 5.9-.6z" fill="#fff"/><path d="M110 46c6 2 10 6 10 12M108 50c3 4 4 8 2 10" stroke="#e2483d" stroke-width="5" stroke-linecap="round" fill="none"/>' },
    { id: 'gorra', slot: 'head', name: 'Gorra', price: 45, level: 1, w: 70, b: 80, vb: '0 0 110 64',
      svg: '<path d="M14 50a38 34 0 0176 0z" fill="#7cc8a0" stroke="#111114" stroke-width="3.5"/><path d="M86 48c10 0 20 2 22 6 1 3-6 4-20 3" fill="#5fb08a" stroke="#111114" stroke-width="3.5" stroke-linejoin="round"/><rect x="12" y="46" width="78" height="9" rx="4" fill="#5fb08a" stroke="#111114" stroke-width="3.5"/><path d="M52 24l2.6 5.4 5.9.6-4.4 4 1.2 5.8L52 37l-5.3 2.8 1.2-5.8-4.4-4 5.9-.6z" fill="#ffe08a"/><circle cx="52" cy="16" r="3.5" fill="#5fb08a" stroke="#111114" stroke-width="2.5"/>' },
    { id: 'gato', slot: 'head', name: 'Orejitas de gato', price: 50, level: 2, w: 90, b: 86, vb: '0 0 120 50',
      svg: '<path d="M10 48L22 6l26 30z" fill="#111114" stroke="#f5f2ec" stroke-width="3" stroke-linejoin="round"/><path d="M110 48L98 6 72 36z" fill="#111114" stroke="#f5f2ec" stroke-width="3" stroke-linejoin="round"/><path d="M20 40l5-22 13 16z" fill="#ffb3c4"/><path d="M100 40l-5-22-13 16z" fill="#ffb3c4"/>' },
    { id: 'mono', slot: 'head', name: 'Moño', price: 35, level: 1, w: 40, b: 88, vb: '0 0 80 50',
      svg: '<path d="M40 25L8 6c-6 6-6 32 0 38z" fill="#ff8fa8" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M40 25L72 6c6 6 6 32 0 38z" fill="#ff8fa8" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><circle cx="40" cy="25" r="8" fill="#ff5f86" stroke="#111114" stroke-width="3"/><circle cx="18" cy="18" r="2.5" fill="#fff"/><circle cx="62" cy="18" r="2.5" fill="#fff"/>' },
    { id: 'charro', slot: 'head', name: 'Sombrero charro', price: 120, level: 3, w: 104, b: 80, vb: '0 0 140 74',
      svg: '<ellipse cx="70" cy="58" rx="68" ry="14" fill="#c8924f" stroke="#111114" stroke-width="3.5"/><path d="M40 56c0-30 12-50 30-50s30 20 30 50" fill="#d9a35e" stroke="#111114" stroke-width="3.5"/><path d="M41 46c18 5 40 5 58 0" stroke="#e2483d" stroke-width="7"/><path d="M41 46c18 5 40 5 58 0" stroke="#111114" stroke-width="1.5" stroke-dasharray="0" fill="none" opacity="0"/><circle cx="56" cy="48" r="2" fill="#ffe08a"/><circle cx="70" cy="50" r="2" fill="#ffe08a"/><circle cx="84" cy="48" r="2" fill="#ffe08a"/><path d="M8 58c20 10 104 10 124 0" stroke="#7a5426" stroke-width="2" fill="none" stroke-dasharray="4 4"/>' },
    { id: 'corona', slot: 'head', name: 'Corona', price: 150, level: 5, w: 50, b: 88, vb: '0 0 100 64',
      svg: '<path d="M10 58L6 12l24 20L50 4l20 28 24-20-4 46z" fill="#ffd54a" stroke="#111114" stroke-width="3.5" stroke-linejoin="round"/><rect x="10" y="48" width="80" height="12" rx="3" fill="#f2b630" stroke="#111114" stroke-width="3"/><circle cx="50" cy="54" r="4" fill="#e2483d"/><circle cx="30" cy="54" r="3" fill="#7cc8ff"/><circle cx="70" cy="54" r="3" fill="#7cc8ff"/><circle cx="6" cy="12" r="4" fill="#ffd54a" stroke="#111114" stroke-width="2.5"/><circle cx="50" cy="4" r="4" fill="#ffd54a" stroke="#111114" stroke-width="2.5"/><circle cx="94" cy="12" r="4" fill="#ffd54a" stroke="#111114" stroke-width="2.5"/>' },
    { id: 'redondos', slot: 'face', name: 'Lentes redondos', price: 35, level: 1, vb: '58 68 86 44',
      svg: '<circle cx="80" cy="90" r="19" fill="rgba(200,235,255,0.25)" stroke="#111114" stroke-width="4"/><circle cx="122" cy="90" r="19" fill="rgba(200,235,255,0.25)" stroke="#111114" stroke-width="4"/><path d="M99 88q2-4 4 0" stroke="#111114" stroke-width="4" fill="none"/><path d="M61 86l-6-3M141 86l6-3" stroke="#111114" stroke-width="4" stroke-linecap="round"/>' },
    { id: 'sol', slot: 'face', name: 'Lentes de sol', price: 50, level: 2, vb: '56 70 90 40',
      svg: '<path d="M58 80h42v6c0 12-8 20-20 20s-22-8-22-20z" fill="#1b1d22" stroke="#111114" stroke-width="3"/><path d="M102 80h42v6c0 12-10 20-22 20s-20-8-20-20z" fill="#1b1d22" stroke="#111114" stroke-width="3"/><path d="M98 82h6" stroke="#111114" stroke-width="5"/><path d="M66 86l10-4M110 86l10-4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>' },
    { id: 'bigote', slot: 'face', name: 'Bigote', price: 30, level: 1, vb: '70 98 62 22',
      svg: '<path d="M101 108c-6-6-14-6-20-1-4 3-8 4-11 1 2 7 9 10 16 8 6-2 11-5 15-8 4 3 9 6 15 8 7 2 14-1 16-8-3 3-7 2-11-1-6-5-14-5-20 1z" fill="#3a2a1f" stroke="#111114" stroke-width="1.5"/>' }
  ];

  // Escenarios (viewBox 400x420; el piso empieza en y=300)
  var SCENES = {
    cocina: '<defs><pattern id="sc-tile" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#f6e3c3"/><path d="M0 0H24V24" fill="none" stroke="#e3c99e" stroke-width="2"/></pattern><pattern id="sc-kf" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#d8b582"/><rect width="20" height="20" fill="#cda774"/><rect x="20" y="20" width="20" height="20" fill="#cda774"/></pattern></defs>'
      + '<rect width="400" height="300" fill="#efcf9f"/><rect y="140" width="400" height="80" fill="url(#sc-tile)"/>'
      + '<g><rect x="34" y="34" width="120" height="96" rx="6" fill="#fff"/><rect x="42" y="42" width="104" height="80" rx="3" fill="#a9dcf2"/><circle cx="120" cy="64" r="11" fill="#fff3b0"/><ellipse cx="72" cy="70" rx="18" ry="8" fill="#fff"/><ellipse cx="84" cy="66" rx="12" ry="7" fill="#fff"/><path d="M94 42v80M42 82h104" stroke="#fff" stroke-width="5"/><path d="M28 30h132" stroke="#a8691c" stroke-width="6" stroke-linecap="round"/><path d="M30 33c10 30 14 60 6 100h-10V33zM158 33c-10 30-14 60-6 100h10V33z" fill="#ff9f8a"/></g>'
      + '<g><path d="M200 0v38" stroke="#3a3a3a" stroke-width="3"/><path d="M174 62a26 24 0 0152 0z" fill="#2f5a4c"/><ellipse cx="200" cy="64" rx="10" ry="4" fill="#fff6c8"/></g>'
      + '<g><rect x="246" y="96" width="132" height="8" rx="3" fill="#a8691c"/><rect x="256" y="66" width="22" height="30" rx="5" fill="#e2483d"/><rect x="256" y="62" width="22" height="8" rx="3" fill="#b8352c"/><rect x="286" y="72" width="18" height="24" rx="4" fill="#fff" stroke="#d8c8a8" stroke-width="2"/><path d="M290 82h10" stroke="#7cc35a" stroke-width="3"/><circle cx="326" cy="84" r="12" fill="#2f5a4c"/><rect x="318" y="66" width="16" height="8" rx="2" fill="#2f5a4c"/><rect x="346" y="70" width="24" height="26" rx="4" fill="#f2c46b"/><rect x="346" y="66" width="24" height="7" rx="2" fill="#a8691c"/></g>'
      + '<rect y="212" width="400" height="14" fill="#9b6a43"/><rect y="224" width="400" height="76" fill="#5f8f6e"/><path d="M100 224v76M200 224v76M300 224v76" stroke="#4c7759" stroke-width="3"/><circle cx="88" cy="262" r="4" fill="#ffe08a"/><circle cx="112" cy="262" r="4" fill="#ffe08a"/><circle cx="288" cy="262" r="4" fill="#ffe08a"/><circle cx="312" cy="262" r="4" fill="#ffe08a"/>'
      + '<g><rect x="34" y="186" width="56" height="28" rx="12" fill="#f5f2ec" stroke="#cfc8b8" stroke-width="2"/><rect x="40" y="180" width="44" height="10" rx="5" fill="#e2483d"/><circle cx="62" cy="200" r="4" fill="#7cc35a"/></g>'
      + '<g><rect x="300" y="200" width="70" height="12" rx="4" fill="#e9c28a" stroke="#c99a5a" stroke-width="2"/><path d="M314 202c10-8 30-8 40 0-10 6-30 6-40 0z" fill="#ff8a5c"/><rect x="352" y="168" width="10" height="34" rx="3" fill="#3a2a1f"/><rect x="351" y="164" width="12" height="7" rx="2" fill="#e2483d"/></g>'
      + '<rect y="300" width="400" height="120" fill="url(#sc-kf)"/><rect y="298" width="400" height="6" fill="#b48a58"/>',
    juegos: '<defs><pattern id="sc-st" width="40" height="300" patternUnits="userSpaceOnUse"><rect width="40" height="300" fill="#a9d3e6"/><rect width="20" height="300" fill="#b7dcec"/></pattern><pattern id="sc-wood" width="400" height="30" patternUnits="userSpaceOnUse"><rect width="400" height="30" fill="#c98f5a"/><path d="M0 29H400M90 0v30M260 0v30" stroke="#b37a48" stroke-width="2"/></pattern></defs>'
      + '<rect width="400" height="300" fill="url(#sc-st)"/>'
      + '<g><rect x="262" y="44" width="112" height="104" rx="8" fill="#fff"/><rect x="270" y="52" width="96" height="88" rx="4" fill="#8fd0f0"/><circle cx="340" cy="78" r="14" fill="#ffe08a"/><ellipse cx="296" cy="104" rx="20" ry="9" fill="#fff"/><ellipse cx="310" cy="98" rx="13" ry="8" fill="#fff"/><path d="M318 52v88M270 96h96" stroke="#fff" stroke-width="5"/></g>'
      + '<g><rect x="40" y="56" width="84" height="104" rx="4" fill="#2f5a4c" stroke="#fff" stroke-width="5"/><path d="M82 78l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#ffe08a"/><rect x="54" y="132" width="56" height="8" rx="4" fill="#ffb4a3"/></g>'
      + '<g><rect x="14" y="160" width="74" height="150" rx="8" fill="#e2483d"/><rect x="14" y="160" width="74" height="16" rx="6" fill="#b8352c"/><rect x="24" y="182" width="54" height="44" rx="4" fill="#1b2a3a"/><path d="M40 196h4v4h-4zM58 196h4v4h-4zM44 200h14v4H44zM40 204h22v4H40zM46 208h10v4H46z" fill="#7cf0b0"/><rect x="20" y="234" width="62" height="18" rx="3" fill="#b8352c"/><circle cx="34" cy="243" r="5" fill="#ffe08a"/><circle cx="50" cy="243" r="5" fill="#7cc8ff"/><circle cx="66" cy="243" r="4" fill="#fff"/></g>'
      + '<g><rect x="300" y="232" width="84" height="70" rx="6" fill="#f2a65a"/><rect x="300" y="232" width="84" height="14" rx="5" fill="#d98a3a"/><path d="M300 270h84" stroke="#d98a3a" stroke-width="3"/><circle cx="330" cy="222" r="14" fill="#7cc8ff"/><path d="M316 222h28M330 208v28" stroke="#fff" stroke-width="3"/><path d="M356 232l8-22 8 22z" fill="#ff8fa8"/></g>'
      + '<rect y="300" width="400" height="120" fill="url(#sc-wood)"/><rect y="298" width="400" height="6" fill="#9a6a3c"/><ellipse cx="200" cy="372" rx="150" ry="34" fill="#f2a65a"/><ellipse cx="200" cy="372" rx="118" ry="24" fill="#ffd27a"/>',
    bano: '<defs><pattern id="sc-bt" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="#cfeeea"/><path d="M0 0H30V30" fill="none" stroke="#b2dcd6" stroke-width="2"/></pattern><pattern id="sc-bf" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#8cc6be"/><rect width="20" height="20" fill="#9ad0c9"/><rect x="20" y="20" width="20" height="20" fill="#9ad0c9"/></pattern></defs>'
      + '<rect width="400" height="300" fill="url(#sc-bt)"/>'
      + '<g><ellipse cx="88" cy="104" rx="42" ry="54" fill="#ffb3c4"/><ellipse cx="88" cy="104" rx="34" ry="46" fill="#dff4fb"/><path d="M70 80l18-18M74 98l26-26" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>'
      + '<g><rect x="56" y="186" width="64" height="16" rx="6" fill="#fff" stroke="#c8dfe0" stroke-width="2"/><path d="M72 202h32l-6 52H78z" fill="#fff" stroke="#c8dfe0" stroke-width="2"/><path d="M88 186v-12h10" stroke="#9aa9ad" stroke-width="4" stroke-linecap="round" fill="none"/></g>'
      + '<g><path d="M150 120h70" stroke="#9aa9ad" stroke-width="5" stroke-linecap="round"/><path d="M162 120h44v70l-8-6-6 6-8-6-6 6-8-6-8 6z" fill="#ff8fa8"/><path d="M162 168h44" stroke="#fff" stroke-width="4"/></g>'
      + '<g><path d="M350 0v52c0 8-6 12-14 12h-16" stroke="#9aa9ad" stroke-width="6" fill="none"/><path d="M300 56h40l-6 14h-28z" fill="#9aa9ad"/><path d="M308 74l-3 8M320 74v8M332 74l3 8" stroke="#7cc8ff" stroke-width="3" stroke-linecap="round"/></g>'
      + '<g><path d="M250 228h150v42c0 22-18 34-40 34h-70c-22 0-40-12-40-34z" fill="#fff" stroke="#c8dfe0" stroke-width="3"/><rect x="244" y="222" width="160" height="14" rx="7" fill="#f2fbfc" stroke="#c8dfe0" stroke-width="3"/><circle cx="276" cy="216" r="9" fill="#fff" stroke="#bfe3ff" stroke-width="2"/><circle cx="292" cy="212" r="6" fill="#fff" stroke="#bfe3ff" stroke-width="2"/><circle cx="306" cy="218" r="7" fill="#fff" stroke="#bfe3ff" stroke-width="2"/><path d="M268 304l-6 10M382 304l6 10" stroke="#9aa9ad" stroke-width="5" stroke-linecap="round"/></g>'
      + '<rect y="300" width="400" height="120" fill="url(#sc-bf)"/><rect y="298" width="400" height="6" fill="#7ab3ab"/>'
      + '<g><ellipse cx="338" cy="352" rx="18" ry="13" fill="#ffd54a"/><circle cx="350" cy="336" r="10" fill="#ffd54a"/><path d="M358 336l8 2-8 3z" fill="#f28c28"/><circle cx="352" cy="333" r="1.8" fill="#111114"/><path d="M324 350c4-6 12-6 16 0" stroke="#e6b830" stroke-width="2" fill="none"/></g>'
      + '<g><rect x="30" y="318" width="34" height="34" rx="5" fill="#ffb3c4"/><path d="M38 318v-8a9 9 0 0118 0v8" stroke="#ffb3c4" stroke-width="5" fill="none"/></g>',
    recamara: '<defs><pattern id="sc-ws" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="#7a6bb3"/><path d="M11 6l1.4 3.6L16 11l-3.6 1.4L11 16l-1.4-3.6L6 11l3.6-1.4zM33 28l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" fill="#9488c8"/></pattern></defs>'
      + '<rect width="400" height="300" fill="url(#sc-ws)"/>'
      + '<g><rect x="34" y="40" width="118" height="110" rx="8" fill="#fff"/><rect x="42" y="48" width="102" height="94" rx="4" fill="#26326b"/><circle cx="116" cy="74" r="14" fill="#fff3b0"/><circle cx="122" cy="70" r="12" fill="#26326b"/><circle cx="64" cy="66" r="1.8" fill="#fff"/><circle cx="84" cy="96" r="1.4" fill="#fff"/><circle cx="58" cy="120" r="1.6" fill="#fff"/><circle cx="100" cy="122" r="1.3" fill="#fff"/><circle cx="130" cy="112" r="1.8" fill="#fff"/><path d="M93 48v94M42 95h102" stroke="#fff" stroke-width="5"/><path d="M28 36h130" stroke="#4d3f86" stroke-width="6" stroke-linecap="round"/><path d="M30 39c8 26 10 58 4 100h-8V39zM156 39c-8 26-10 58-4 100h8V39z" fill="#ffb4a3"/></g>'
      + '<g><rect x="16" y="236" width="56" height="66" rx="5" fill="#c98f5a"/><rect x="22" y="252" width="44" height="18" rx="3" fill="#b37a48"/><circle cx="44" cy="261" r="3" fill="#ffe08a"/><path d="M36 236l4-30h8l4 30z" fill="#ffe08a" opacity="0.9"/><path d="M44 206v-6" stroke="#4d3f86" stroke-width="3"/><path d="M30 206h28l-6-20H36z" fill="#ffd27a" stroke="#d9a843" stroke-width="2"/></g>'
      + '<g><rect x="258" y="170" width="140" height="70" rx="12" fill="#e8a96b"/><circle cx="328" cy="196" r="12" fill="#f2c08a"/><rect x="250" y="236" width="150" height="56" rx="10" fill="#fff"/><path d="M262 238h138v54H272c-6 0-10-4-10-10z" fill="#ff9fb4"/><circle cx="288" cy="258" r="5" fill="#fff" opacity="0.7"/><circle cx="318" cy="274" r="5" fill="#fff" opacity="0.7"/><circle cx="350" cy="254" r="5" fill="#fff" opacity="0.7"/><circle cx="378" cy="276" r="5" fill="#fff" opacity="0.7"/><rect x="270" y="214" width="56" height="26" rx="12" fill="#fff" stroke="#e7dfee" stroke-width="2"/><rect x="250" y="290" width="12" height="16" fill="#b37a48"/></g>'
      + '<rect y="300" width="400" height="120" fill="#5c4f94"/><rect y="298" width="400" height="6" fill="#4a3f7e"/><ellipse cx="200" cy="372" rx="140" ry="30" fill="#ffb4a3" opacity="0.85"/><ellipse cx="200" cy="372" rx="110" ry="20" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 8" opacity="0.6"/>',
    closet: '<defs><pattern id="sc-cs" width="36" height="300" patternUnits="userSpaceOnUse"><rect width="36" height="300" fill="#f2c4c9"/><rect width="12" height="300" fill="#f6d3d7"/></pattern><pattern id="sc-cw" width="400" height="28" patternUnits="userSpaceOnUse"><rect width="400" height="28" fill="#c99a73"/><path d="M0 27H400M120 0v28M300 0v28" stroke="#b5845d" stroke-width="2"/></pattern></defs>'
      + '<rect width="400" height="300" fill="url(#sc-cs)"/>'
      + '<g><rect x="12" y="50" width="122" height="252" rx="6" fill="#b07a52"/><rect x="20" y="58" width="50" height="236" rx="3" fill="#c48d62"/><rect x="76" y="58" width="50" height="236" rx="3" fill="#c48d62"/><circle cx="64" cy="180" r="4" fill="#ffe08a"/><circle cx="82" cy="180" r="4" fill="#ffe08a"/><rect x="8" y="44" width="130" height="12" rx="4" fill="#8f5f3c"/></g>'
      + '<g><path d="M268 88h124" stroke="#8a8f99" stroke-width="5" stroke-linecap="round"/><path d="M276 88v-10M384 88v-10" stroke="#8a8f99" stroke-width="4"/>'
      + '<path d="M286 88l-12 14 4 6 4-3v54h28v-54l4 3 4-6-12-14q-10 8-20 0z" fill="#7cc8ff"/><path d="M286 88q10-8 20 0" stroke="#8a8f99" stroke-width="2" fill="none"/>'
      + '<path d="M326 88l-12 14 4 6 4-3v60h28v-60l4 3 4-6-12-14q-10 8-20 0z" fill="#ffe08a"/>'
      + '<path d="M364 88l-10 12 3 5 3-2v48h24v-48l3 2 3-5-10-12q-8 7-16 0z" fill="#7cc35a"/></g>'
      + '<g><path d="M180 70l20-24 20 24" stroke="#8f5f3c" stroke-width="3" fill="none"/><rect x="164" y="70" width="72" height="96" rx="36" fill="#f5f2ec" stroke="#8f5f3c" stroke-width="5"/><path d="M182 96l20-18M186 112l28-26" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>'
      + '<g><rect x="300" y="236" width="74" height="66" rx="6" fill="#ff8fa8"/><rect x="300" y="236" width="74" height="12" rx="5" fill="#e9708b"/><path d="M318 236c0-14 38-14 38 0" fill="#c8924f" stroke="#7a5426" stroke-width="2"/></g>'
      + '<rect y="300" width="400" height="120" fill="url(#sc-cw)"/><rect y="298" width="400" height="6" fill="#a87650"/><ellipse cx="200" cy="370" rx="140" ry="30" fill="#c8b6f2"/><ellipse cx="200" cy="370" rx="104" ry="20" fill="#d9cdf7"/>'
  };

  var INGREDIENTS = [
    { id: 'arroz', name: 'Arroz', svg: '<ellipse cx="20" cy="22" rx="15" ry="11" fill="#fff" stroke="#cfc8b8" stroke-width="1.5"/><ellipse cx="14" cy="20" rx="2" ry="1.2" fill="#e8e2d6"/><ellipse cx="22" cy="17" rx="2" ry="1.2" fill="#e8e2d6"/><ellipse cx="25" cy="25" rx="2" ry="1.2" fill="#e8e2d6"/>' },
    { id: 'alga', name: 'Alga', svg: '<rect x="6" y="8" width="28" height="26" rx="3" fill="#24352f"/><path d="M10 14h20M10 21h20M10 28h20" stroke="#3a5248" stroke-width="2"/>' },
    { id: 'salmon', name: 'Salmón', svg: '<path d="M5 26c3-12 27-14 30-4 0 4-3 7-8 7H11c-4 0-6-1-6-3z" fill="#ff8a5c"/><path d="M12 18l4 9M20 16l4 11M28 17l3 9" stroke="#ffd0b8" stroke-width="2" stroke-linecap="round"/>' },
    { id: 'aguacate', name: 'Aguacate', svg: '<path d="M20 4c8 0 14 12 14 20a14 12 0 01-28 0C6 16 12 4 20 4z" fill="#5d8f3a"/><path d="M20 8c6 0 10 10 10 16a10 9 0 01-20 0c0-6 4-16 10-16z" fill="#cfe89a"/><circle cx="20" cy="25" r="5" fill="#8a5a3b"/>' },
    { id: 'pepino', name: 'Pepino', svg: '<circle cx="20" cy="20" r="14" fill="#3f8a3a"/><circle cx="20" cy="20" r="11" fill="#c9eba0"/><circle cx="16" cy="18" r="1.5" fill="#f2fbe6"/><circle cx="24" cy="19" r="1.5" fill="#f2fbe6"/><circle cx="20" cy="25" r="1.5" fill="#f2fbe6"/>' },
    { id: 'queso', name: 'Queso crema', svg: '<path d="M6 28l14-18 14 18z" fill="#fff6dc" stroke="#e6d39b" stroke-width="2" stroke-linejoin="round"/><circle cx="17" cy="23" r="2" fill="#efe0b0"/><circle cx="24" cy="25" r="1.5" fill="#efe0b0"/>' },
    { id: 'camaron', name: 'Camarón', svg: '<path d="M10 26a10 10 0 1118-6" fill="none" stroke="#ff8a6a" stroke-width="7" stroke-linecap="round"/><path d="M28 20l6-4M28 20l6 2" stroke="#ff6a4a" stroke-width="2.5" stroke-linecap="round"/><path d="M14 18l3 3M19 14l2 4" stroke="#ffc2b0" stroke-width="1.6"/>' },
    { id: 'chile', name: 'Chile', svg: '<path d="M8 30c6 2 20-2 24-16 1-3-2-5-4-3-3 10-12 14-20 15-3 0-3 3 0 4z" fill="#e2483d"/><path d="M29 11c0-4 3-6 5-6" stroke="#4e8f34" stroke-width="3" stroke-linecap="round" fill="none"/>' }
  ];
  // ===================== DATOS v3 =====================
  ITEMS.push(
    { id: 'beanie', slot: 'head', name: 'Gorro de invierno', price: 45, level: 1, w: 66, b: 78, vb: '0 0 100 74',
      svg: '<path d="M14 58a36 40 0 0172 0z" fill="#e2483d" stroke="#111114" stroke-width="3.5"/><path d="M30 24c4 8 4 22 2 34M50 18v40M70 24c-4 8-4 22-2 34" stroke="#b8352c" stroke-width="3" fill="none"/><rect x="10" y="54" width="80" height="16" rx="6" fill="#f5f2ec" stroke="#111114" stroke-width="3.5"/><path d="M20 56v12M30 56v12M40 56v12M50 56v12M60 56v12M70 56v12M80 56v12" stroke="#d9d2c5" stroke-width="2"/><circle cx="50" cy="13" r="10" fill="#f5f2ec" stroke="#111114" stroke-width="3"/>' },
    { id: 'paja', slot: 'head', name: 'Sombrero de paja', price: 60, level: 2, w: 102, b: 80, vb: '0 0 140 62',
      svg: '<ellipse cx="70" cy="48" rx="66" ry="12" fill="#ecc96b" stroke="#111114" stroke-width="3.5"/><path d="M38 48c0-26 12-40 32-40s32 14 32 40" fill="#f2d47e" stroke="#111114" stroke-width="3.5"/><path d="M39 38c18 6 44 6 62 0" stroke="#e2483d" stroke-width="7"/><path d="M14 48c18 6 94 6 112 0M44 22c14 4 38 4 52 0" stroke="#c9a346" stroke-width="1.6" fill="none" stroke-dasharray="3 4"/>' },
    { id: 'audifonos', slot: 'head', name: 'Audífonos', price: 80, level: 3, w: 104, b: 40, vb: '0 0 120 92',
      svg: '<path d="M14 66C14 20 106 20 106 66" fill="none" stroke="#111114" stroke-width="11" stroke-linecap="round"/><path d="M14 66C14 20 106 20 106 66" fill="none" stroke="#7cc8a0" stroke-width="6" stroke-linecap="round"/><rect x="2" y="54" width="22" height="34" rx="9" fill="#7cc8a0" stroke="#111114" stroke-width="3.5"/><rect x="96" y="54" width="22" height="34" rx="9" fill="#7cc8a0" stroke="#111114" stroke-width="3.5"/><circle cx="13" cy="71" r="4" fill="#ffe08a"/><circle cx="107" cy="71" r="4" fill="#ffe08a"/>' },
    { id: 'flor', slot: 'head', name: 'Flor de hibisco', price: 30, level: 1, w: 30, b: 74, x: 76, vb: '0 0 60 60',
      svg: '<g stroke="#111114" stroke-width="2.5"><ellipse cx="30" cy="13" rx="11" ry="13" fill="#ff5f86"/><ellipse cx="47" cy="25" rx="11" ry="13" transform="rotate(72 47 25)" fill="#ff5f86"/><ellipse cx="40" cy="45" rx="11" ry="13" transform="rotate(144 40 45)" fill="#ff5f86"/><ellipse cx="20" cy="45" rx="11" ry="13" transform="rotate(216 20 45)" fill="#ff5f86"/><ellipse cx="13" cy="25" rx="11" ry="13" transform="rotate(288 13 25)" fill="#ff5f86"/></g><circle cx="30" cy="30" r="7" fill="#ffe08a" stroke="#111114" stroke-width="2.5"/>' },
    { id: 'parche', slot: 'face', name: 'Parche pirata', price: 40, level: 2, vb: '50 60 104 50',
      svg: '<path d="M54 70L146 100" stroke="#111114" stroke-width="4"/><path d="M62 86c0-10 8-16 18-16s18 6 18 16-8 18-18 18-18-8-18-18z" fill="#111114"/><path d="M80 80l1.6 3.4 3.7.4-2.8 2.5.8 3.7L80 88.2 76.7 90l.8-3.7-2.8-2.5 3.7-.4z" fill="#f5f2ec"/>' },
    { id: 'corbatin', slot: 'neck', name: 'Corbatín', price: 40, level: 1, w: 34, t: 82, vb: '0 0 80 44',
      svg: '<path d="M40 22L6 4c-5 6-5 30 0 36z" fill="#e2483d" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M40 22L74 4c5 6 5 30 0 36z" fill="#e2483d" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><rect x="32" y="13" width="16" height="18" rx="5" fill="#b8352c" stroke="#111114" stroke-width="3"/><circle cx="16" cy="16" r="2.5" fill="#fff"/><circle cx="18" cy="29" r="2.5" fill="#fff"/><circle cx="64" cy="16" r="2.5" fill="#fff"/><circle cx="62" cy="29" r="2.5" fill="#fff"/>' },
    { id: 'bufanda', slot: 'neck', name: 'Bufanda', price: 55, level: 2, w: 88, t: 70, vb: '0 0 140 76',
      svg: '<path d="M8 10c30 26 94 26 124 0" fill="none" stroke="#111114" stroke-width="22" stroke-linecap="round"/><path d="M8 10c30 26 94 26 124 0" fill="none" stroke="#7a6bb3" stroke-width="16" stroke-linecap="round"/><path d="M30 18l6 12M56 24l2 12M84 24l-2 12M110 18l-6 12" stroke="#9488c8" stroke-width="4" stroke-linecap="round"/><path d="M98 26l10 44h16l-6-46z" fill="#7a6bb3" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M110 70v6M116 70v6M122 70v6" stroke="#111114" stroke-width="2.5"/>' },
    { id: 'collar', slot: 'neck', name: 'Collar hawaiano', price: 70, level: 3, w: 86, t: 70, vb: '0 0 140 50',
      svg: (function () { var c = ['#ff5f86', '#ffe08a', '#7cc8ff', '#ff8a5c', '#c8a8ff'], h = '', i, t, x, y; for (i = 0; i <= 12; i++) { t = i / 12; x = 8 + t * 124; y = 8 + Math.sin(t * Math.PI) * 30; h += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9" fill="' + c[i % 5] + '" stroke="#111114" stroke-width="2.5"/><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2.6" fill="#fff"/>'; } return h; })() }
  );

  // Fondos: cada tema cambia colores del escenario de su cuarto
  var THEMES = {
    cocina: [
      { id: 'cocina-base', name: 'Clásica', price: 0, map: {}, sw: ['#efcf9f', '#5f8f6e', '#d8b582'] },
      { id: 'cocina-menta', name: 'Menta', price: 40, sw: ['#cfe8d6', '#e2836f', '#e8d9c0'], map: { '#efcf9f': '#cfe8d6', '#f6e3c3': '#eef7f0', '#e3c99e': '#cfe3d4', '#5f8f6e': '#e2836f', '#4c7759': '#c96b58', '#d8b582': '#e8d9c0', '#cda774': '#ddcbb0' } },
      { id: 'cocina-tokio', name: 'Noche en Tokio', price: 80, sw: ['#3b3f63', '#2f5a4c', '#2b2d45'], map: { '#efcf9f': '#3b3f63', '#f6e3c3': '#4a4f78', '#e3c99e': '#3b3f63', '#a9dcf2': '#26326b', '#fff3b0': '#fff3b0', '#5f8f6e': '#1f3d34', '#4c7759': '#16302a', '#d8b582': '#2b2d45', '#cda774': '#24263b', '#b48a58': '#1b1c2e' } }
    ],
    juegos: [
      { id: 'juegos-base', name: 'Cielo', price: 0, map: {}, sw: ['#a9d3e6', '#f2a65a', '#c98f5a'] },
      { id: 'juegos-atardecer', name: 'Atardecer', price: 50, sw: ['#f6b88f', '#7a6bb3', '#c98f5a'], map: { '#a9d3e6': '#f6b88f', '#b7dcec': '#f9c7a5', '#8fd0f0': '#ffb88a', '#f2a65a': '#7a6bb3', '#ffd27a': '#9488c8' } },
      { id: 'juegos-matcha', name: 'Matcha', price: 50, sw: ['#bfe8cc', '#ff8fa8', '#c98f5a'], map: { '#a9d3e6': '#bfe8cc', '#b7dcec': '#cdeed8', '#f2a65a': '#ff8fa8', '#ffd27a': '#ffb3c4' } }
    ],
    bano: [
      { id: 'bano-base', name: 'Aqua', price: 0, map: {}, sw: ['#cfeeea', '#ffb3c4', '#8cc6be'] },
      { id: 'bano-rosa', name: 'Rosa', price: 45, sw: ['#f6d3dc', '#7cc8ff', '#e8a1b4'], map: { '#cfeeea': '#f6d3dc', '#b2dcd6': '#ecbcc8', '#8cc6be': '#e8a1b4', '#9ad0c9': '#f0b3c3', '#7ab3ab': '#d68ba0', '#ffb3c4': '#7cc8ff', '#ff8fa8': '#7cc8ff' } },
      { id: 'bano-lavanda', name: 'Lavanda', price: 45, sw: ['#ddd5f3', '#ffe08a', '#a99bd9'], map: { '#cfeeea': '#ddd5f3', '#b2dcd6': '#c9bfe8', '#8cc6be': '#a99bd9', '#9ad0c9': '#b6a9e0', '#7ab3ab': '#9283c9' } }
    ],
    recamara: [
      { id: 'recamara-base', name: 'Estrellas', price: 0, map: {}, sw: ['#7a6bb3', '#ff9fb4', '#5c4f94'] },
      { id: 'recamara-oceano', name: 'Océano', price: 60, sw: ['#3f7fa6', '#ffe08a', '#2c5d7c'], map: { '#7a6bb3': '#3f7fa6', '#9488c8': '#5b97bb', '#5c4f94': '#2c5d7c', '#4a3f7e': '#244e69', '#ff9fb4': '#ffe08a', '#ffb4a3': '#7cc8ff' } },
      { id: 'recamara-fresa', name: 'Fresa', price: 60, sw: ['#e58fa3', '#7cc35a', '#a8566b'], map: { '#7a6bb3': '#e58fa3', '#9488c8': '#eea6b6', '#5c4f94': '#a8566b', '#4a3f7e': '#94485c', '#ff9fb4': '#7cc35a' } }
    ],
    closet: [
      { id: 'closet-base', name: 'Algodón', price: 0, map: {}, sw: ['#f2c4c9', '#b07a52', '#c8b6f2'] },
      { id: 'closet-menta', name: 'Menta', price: 40, sw: ['#c9ead8', '#b07a52', '#ffd27a'], map: { '#f2c4c9': '#c9ead8', '#f6d3d7': '#d8f0e3', '#c8b6f2': '#ffd27a', '#d9cdf7': '#ffe6a8' } },
      { id: 'closet-crema', name: 'Crema', price: 40, sw: ['#f3e6c8', '#6b8f71', '#ff8fa8'], map: { '#f2c4c9': '#f3e6c8', '#f6d3d7': '#f8eed8', '#b07a52': '#6b8f71', '#c48d62': '#7fa585', '#8f5f3c': '#557359', '#c8b6f2': '#ff8fa8', '#d9cdf7': '#ffb3c4' } }
    ]
  };
  var SIMON = [
    { name: 'Salmón', color: '#ff8a5c', lit: '#ffc2a8', f: 330 },
    { name: 'Aguacate', color: '#5d8f3a', lit: '#a6e07e', f: 392 },
    { name: 'Tamago', color: '#e6b830', lit: '#fff0a8', f: 494 },
    { name: 'Atún', color: '#c23a50', lit: '#ff8fa8', f: 587 }
  ];
  // ===================== EXCLUSIVOS (ruleta, visitas, nivel) =====================
  function arcFlowers(n, up) {
    var cols = ['#ff8fa8', '#fff6dc', '#ffe08a', '#ff8fa8', '#c8a8ff'], h = '', i, t, x, y;
    for (i = 0; i <= n; i++) {
      t = i / n; x = 10 + t * 120; y = up ? 42 - Math.sin(t * Math.PI) * 28 : 8 + Math.sin(t * Math.PI) * 30;
      if (i % 2) h += '<ellipse cx="' + x.toFixed(1) + '" cy="' + (y + 4).toFixed(1) + '" rx="7" ry="4" fill="#7cc35a" stroke="#111114" stroke-width="1.5" transform="rotate(' + (t * 120 - 60).toFixed(0) + ' ' + x.toFixed(1) + ' ' + (y + 4).toFixed(1) + ')"/>';
      h += '<g stroke="#111114" stroke-width="1.6">';
      for (var k = 0; k < 5; k++) { var a = k / 5 * Math.PI * 2; h += '<circle cx="' + (x + Math.cos(a) * 5).toFixed(1) + '" cy="' + (y + Math.sin(a) * 5).toFixed(1) + '" r="4.2" fill="' + cols[i % 5] + '"/>'; }
      h += '</g><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2.8" fill="#f2a623"/>';
    }
    return h;
  }
  var STAR_P = 'M12 1l3.1 6.9 7.5.8-5.6 5 1.6 7.4L12 17.3 5.4 21.1 7 13.7 1.4 8.7l7.5-.8z';
  ITEMS.push(
    { id: 'gorro-fiesta', slot: 'head', name: 'Gorrito de fiesta', excl: 'ruleta', rarity: 'comun', w: 36, b: 88, vb: '0 0 60 80',
      svg: '<path d="M30 6L52 72H8z" fill="#7cc8ff" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M24 26l12 4M18 46l24 7M12 64l14 4" stroke="#ff8fa8" stroke-width="5" stroke-linecap="round"/><circle cx="30" cy="7" r="6" fill="#ffe08a" stroke="#111114" stroke-width="2.5"/>' },
    { id: 'diadema-panda', slot: 'head', name: 'Diadema de panda', excl: 'ruleta', rarity: 'rara', w: 92, b: 84, vb: '0 0 120 50',
      svg: '<path d="M14 46C24 18 96 18 106 46" fill="none" stroke="#111114" stroke-width="7" stroke-linecap="round"/><circle cx="24" cy="18" r="15" fill="#111114" stroke="#f5f2ec" stroke-width="2.5"/><circle cx="96" cy="18" r="15" fill="#111114" stroke="#f5f2ec" stroke-width="2.5"/><circle cx="24" cy="18" r="6" fill="#4a4a52"/><circle cx="96" cy="18" r="6" fill="#4a4a52"/>' },
    { id: 'corona-flores', slot: 'head', name: 'Corona de flores', excl: 'ruleta', rarity: 'rara', w: 96, b: 74, vb: '0 0 140 54', svg: arcFlowers(10, true) },
    { id: 'corona-sushi', slot: 'head', name: 'Corona de sushi', excl: 'ruleta', rarity: 'legendaria', w: 64, b: 86, vb: '0 0 110 72',
      svg: '<rect x="8" y="48" width="94" height="18" rx="5" fill="#ffd54a" stroke="#111114" stroke-width="3"/><circle cx="30" cy="57" r="4" fill="#e2483d"/><circle cx="55" cy="57" r="4" fill="#7cc8ff"/><circle cx="80" cy="57" r="4" fill="#e2483d"/>'
        + '<g><circle cx="22" cy="36" r="12" fill="#111114" stroke="#f5f2ec" stroke-width="2"/><circle cx="22" cy="36" r="8" fill="#fff"/><circle cx="21" cy="35" r="3.5" fill="#ff9f7a"/><circle cx="88" cy="36" r="12" fill="#111114" stroke="#f5f2ec" stroke-width="2"/><circle cx="88" cy="36" r="8" fill="#fff"/><circle cx="87" cy="35" r="3.5" fill="#c2e8aa"/></g>'
        + '<rect x="36" y="26" width="38" height="18" rx="9" fill="#fff" stroke="#111114" stroke-width="2.5"/><path d="M34 28c6-14 36-16 42-2 0 3-3 4-6 4H40c-4 0-6-1-6-2z" fill="#ff8a5c" stroke="#111114" stroke-width="2.5"/><path d="M45 16l2 6M54 13l2 8M63 15l2 6" stroke="#ffd0b8" stroke-width="2.5" stroke-linecap="round"/>'
        + '<path d="M55 0l1.6 3.4 3.7.4-2.8 2.5.8 3.7L55 8.2 51.7 10l.8-3.7-2.8-2.5 3.7-.4z" fill="#ffe08a"/>' },
    { id: 'aura-estrellas', slot: 'aura', name: 'Aura de estrellas', excl: 'ruleta', rarity: 'legendaria', vb: '0 0 60 60',
      svg: '<circle cx="30" cy="30" r="16" fill="none" stroke="#ffe08a" stroke-width="2" stroke-dasharray="3 5"/><path transform="translate(2 2) scale(.8)" d="' + STAR_P + '" fill="#ffe08a"/><path transform="translate(38 6) scale(.7)" d="' + STAR_P + '" fill="#ffd54a"/><path transform="translate(34 38) scale(.9)" d="' + STAR_P + '" fill="#fff3b0"/><path transform="translate(4 38) scale(.55)" d="' + STAR_P + '" fill="#ffe08a"/>' },
    { id: 'lentes-corazon', slot: 'face', name: 'Lentes de corazón', excl: 'ruleta', rarity: 'comun', vb: '56 68 90 44',
      svg: '<path transform="translate(60 70) scale(1.7)" d="' + HEART_PATH + '" fill="#ff5f86" fill-opacity="0.85" stroke="#111114" stroke-width="2.2"/><path transform="translate(102 70) scale(1.7)" d="' + HEART_PATH + '" fill="#ff5f86" fill-opacity="0.85" stroke="#111114" stroke-width="2.2"/><path d="M96 84q5-4 10 0" stroke="#111114" stroke-width="3.5" fill="none"/><path d="M68 80l6-3M108 80l6-3" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>' },
    { id: 'chef-dorado', slot: 'head', name: 'Gorro de chef dorado', excl: 'visita', need: 5, w: 58, b: 84, vb: '0 0 100 80',
      svg: '<rect x="18" y="56" width="64" height="22" rx="4" fill="#ffd54a" stroke="#111114" stroke-width="3"/><path d="M22 58c-14-2-18-20-4-26 0-14 18-20 26-10 8-12 28-8 28 6 14 2 16 24 2 30" fill="#ffe9a0" stroke="#111114" stroke-width="3"/><path d="M38 60v-14M62 60v-14" stroke="#e6b830" stroke-width="2.5" stroke-linecap="round"/><path d="M50 60l2.6 5.4 5.9.6-4.4 4 1.2 5.8L50 73l-5.3 2.8 1.2-5.8-4.4-4 5.9-.6z" fill="#fff" stroke="#b8860b" stroke-width="1"/>' },
    { id: 'bandana-hoshi', slot: 'neck', name: 'Pañoleta Hoshi', excl: 'visita', need: 3, w: 70, t: 72, vb: '0 0 120 72',
      svg: '<path d="M6 8c20 12 88 12 108 0L60 68z" fill="#e2483d" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path transform="translate(50 26) scale(.85)" d="' + STAR_P + '" fill="#fff"/><path transform="translate(26 18) scale(.5)" d="' + STAR_P + '" fill="#fff"/><path transform="translate(82 18) scale(.5)" d="' + STAR_P + '" fill="#fff"/>' },
    { id: 'lentes-estrella', slot: 'face', name: 'Lentes de estrella', excl: 'visita', need: 8, vb: '54 66 94 48',
      svg: '<path transform="translate(59.6 69.3) scale(1.7)" d="' + STAR_P + '" fill="#ffd54a" fill-opacity="0.8" stroke="#111114" stroke-width="2"/><path transform="translate(101.6 69.3) scale(1.7)" d="' + STAR_P + '" fill="#ffd54a" fill-opacity="0.8" stroke="#111114" stroke-width="2"/><path d="M96 86q5-4 10 0" stroke="#111114" stroke-width="3.5" fill="none"/>' },
    { id: 'bufanda-dorada', slot: 'neck', name: 'Bufanda dorada', excl: 'visita', need: 14, w: 88, t: 70, vb: '0 0 140 76',
      svg: '<path d="M8 10c30 26 94 26 124 0" fill="none" stroke="#111114" stroke-width="22" stroke-linecap="round"/><path d="M8 10c30 26 94 26 124 0" fill="none" stroke="#ffd54a" stroke-width="16" stroke-linecap="round"/><path d="M30 18l6 12M56 24l2 12M84 24l-2 12M110 18l-6 12" stroke="#f2b630" stroke-width="4" stroke-linecap="round"/><path d="M98 26l10 44h16l-6-46z" fill="#ffd54a" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path transform="translate(104 38) scale(.5)" d="' + STAR_P + '" fill="#fff"/>' },
    { id: 'aura-dorada', slot: 'aura', name: 'Aura dorada', excl: 'visita', need: 20, vb: '0 0 60 60',
      svg: '<circle cx="30" cy="30" r="24" fill="#ffd54a" opacity="0.25"/><circle cx="30" cy="30" r="18" fill="none" stroke="#ffd54a" stroke-width="3"/><circle cx="30" cy="30" r="11" fill="#ffe9a0"/>' },
    { id: 'lentes-3d', slot: 'face', name: 'Lentes 3D', excl: 'nivel', need: 8, vb: '54 72 94 36',
      svg: '<rect x="58" y="76" width="40" height="28" rx="5" fill="#ff5a5a" fill-opacity="0.85" stroke="#f5f2ec" stroke-width="4"/><rect x="104" y="76" width="40" height="28" rx="5" fill="#4aa8ff" fill-opacity="0.85" stroke="#f5f2ec" stroke-width="4"/><path d="M98 88h6" stroke="#f5f2ec" stroke-width="4"/><rect x="58" y="76" width="86" height="28" rx="5" fill="none" stroke="#111114" stroke-width="1.5" opacity="0.4"/>' },
    { id: 'aura-burbujas', slot: 'aura', name: 'Aura de burbujas', excl: 'nivel', need: 12, vb: '0 0 60 60',
      svg: '<circle cx="18" cy="38" r="9" fill="rgba(190,232,255,.4)" stroke="#bfe8ff" stroke-width="2"/><circle cx="40" cy="22" r="12" fill="rgba(190,232,255,.4)" stroke="#bfe8ff" stroke-width="2"/><circle cx="42" cy="46" r="6" fill="rgba(190,232,255,.4)" stroke="#bfe8ff" stroke-width="2"/><circle cx="20" cy="14" r="5" fill="rgba(190,232,255,.4)" stroke="#bfe8ff" stroke-width="2"/>' },
    { id: 'corona-hoshi', slot: 'head', name: 'Corona Hoshi', excl: 'nivel', need: 15, w: 54, b: 88, vb: '0 0 100 76',
      svg: '<path d="M10 62L6 22l22 16L50 14l22 24 22-16-4 40z" fill="#ffd54a" stroke="#111114" stroke-width="3.5" stroke-linejoin="round"/><rect x="10" y="54" width="80" height="14" rx="4" fill="#f2b630" stroke="#111114" stroke-width="3"/><path transform="translate(35 -2) scale(1.25)" d="' + STAR_P + '" fill="#fff6c8" stroke="#111114" stroke-width="2"/><circle cx="30" cy="61" r="3.5" fill="#e2483d"/><circle cx="70" cy="61" r="3.5" fill="#e2483d"/><circle cx="50" cy="61" r="3.5" fill="#7cc8ff"/>' }
  );

  THEMES.recamara.push({ id: 'recamara-sakura', name: 'Sakura', excl: 'ruleta', rarity: 'rara', sw: ['#f5c6d6', '#ff8fa8', '#c97b9a'], map: { '#7a6bb3': '#f5c6d6', '#9488c8': '#fadbe6', '#5c4f94': '#c97b9a', '#4a3f7e': '#b86a89', '#ff9fb4': '#ffffff', '#ffb4a3': '#ff8fa8', '#26326b': '#8a5a9e' } });
  THEMES.cocina.push({ id: 'cocina-hoshi', name: 'Cocina Hoshi', excl: 'visita', need: 10, sw: ['#24352f', '#ffb4a3', '#111114'], map: { '#efcf9f': '#24352f', '#f6e3c3': '#2f4a40', '#e3c99e': '#24352f', '#5f8f6e': '#ffb4a3', '#4c7759': '#e89a88', '#d8b582': '#1d1d22', '#cda774': '#16161a', '#b48a58': '#0b0b0e', '#9b6a43': '#bfe8cc' } });
  THEMES.juegos.push({ id: 'juegos-neon', name: 'Neón', excl: 'nivel', need: 5, sw: ['#1b1640', '#ff3fa4', '#3ff0ff'], map: { '#a9d3e6': '#1b1640', '#b7dcec': '#231c52', '#8fd0f0': '#3b2a7a', '#f2a65a': '#ff3fa4', '#ffd27a': '#3ff0ff', '#c98f5a': '#2a2250', '#b37a48': '#3a2f6e', '#9a6a3c': '#120e2e' } });

  // Misiones diarias: se eligen 3 al día.
  var MISSIONS = [
    { id: 'feed2', text: 'Dale de comer 2 veces', ev: 'feed', goal: 2, coins: 25 },
    { id: 'feed4', text: 'Dale de comer 4 veces', ev: 'feed', goal: 4, coins: 40 },
    { id: 'play2', text: 'Juega 2 minijuegos', ev: 'play', goal: 2, coins: 30 },
    { id: 'play4', text: 'Juega 4 minijuegos', ev: 'play', goal: 4, coins: 50 },
    { id: 'bath', text: 'Báñalo hasta que quede rechinando', ev: 'bath', goal: 1, coins: 30 },
    { id: 'tap6', text: 'Hazle cariños 6 veces', ev: 'tap', goal: 6, coins: 20 },
    { id: 'gcoins60', text: 'Gana 60 monedas en minijuegos', ev: 'gcoins', goal: 60, coins: 40 },
    { id: 'catch15', text: 'Atrapa 15 rollos en una partida', ev: 'score:catch', goal: 15, coins: 40, max: true },
    { id: 'fly5', text: 'Pasa 5 palillos en Hoshito vuela', ev: 'score:fly', goal: 5, coins: 40, max: true },
    { id: 'chef4', text: 'Prepara 4 órdenes en Arma el rollo', ev: 'score:chef', goal: 4, coins: 40, max: true },
    { id: 'run40', text: 'Corre 40 metros en Hoshito corre', ev: 'score:run', goal: 40, coins: 35, max: true },
    { id: 'simon5', text: 'Llega a 5 rondas en Hoshi dice', ev: 'score:simon', goal: 5, coins: 40, max: true },
    { id: 'memo1', text: 'Termina un memorama', ev: 'play:memo', goal: 1, coins: 30 },
    { id: 'rest', text: 'Llévalo a dormir hasta que descanse', ev: 'rested', goal: 1, coins: 25 },
    { id: 'dress', text: 'Cámbiale la ropa', ev: 'wear', goal: 1, coins: 15 },
    { id: 'buy', text: 'Compra algo en la tienda', ev: 'buy', goal: 1, coins: 15 }
  ];
  // ===================== ECONOMÍA v4 =====================
  // Precios pensados para ~40 días de juego diario antes de tenerlo todo (ver HOSHITO.md).
  var PRICES = { chef: [180, 1], banda: [120, 1], gorra: [140, 1], gato: [220, 2], mono: [100, 1], charro: [600, 6], corona: [900, 10], redondos: [120, 1], sol: [200, 2], bigote: [90, 1], beanie: [150, 1], paja: [250, 3], audifonos: [450, 5], flor: [90, 1], parche: [160, 2], corbatin: [130, 1], bufanda: [220, 2], collar: [350, 4] };
  ITEMS.forEach(function (it) { var p = PRICES[it.id]; if (p) { it.price = p[0]; it.level = p[1]; } });
  var TPRICES = { 'cocina-menta': 200, 'cocina-tokio': 400, 'juegos-atardecer': 250, 'juegos-matcha': 250, 'bano-rosa': 220, 'bano-lavanda': 220, 'recamara-oceano': 300, 'recamara-fresa': 300, 'closet-menta': 200, 'closet-crema': 200 };
  Object.keys(THEMES).forEach(function (r) { THEMES[r].forEach(function (t) { if (TPRICES[t.id]) t.price = TPRICES[t.id]; }); });

  // Premios nuevos (ruleta, niveles, ranking y jardín)
  ITEMS.push(
    { id: 'tiara', slot: 'head', name: 'Tiara', excl: 'ruleta', rarity: 'comun', w: 52, b: 86, vb: '0 0 100 50',
      svg: '<path d="M8 46c10-10 74-10 84 0" fill="none" stroke="#d9a843" stroke-width="5" stroke-linecap="round"/><path d="M22 40l6-18 8 14 14-26 14 26 8-14 6 18" fill="#ffe08a" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><circle cx="50" cy="10" r="5" fill="#ff8fa8" stroke="#111114" stroke-width="2"/><circle cx="28" cy="22" r="3" fill="#7cc8ff"/><circle cx="72" cy="22" r="3" fill="#7cc8ff"/>' },
    { id: 'cuernos', slot: 'head', name: 'Cuernitos', excl: 'ruleta', rarity: 'comun', w: 80, b: 84, vb: '0 0 120 50',
      svg: '<path d="M18 48c-6-18 0-36 14-44 -2 14 4 26 14 34z" fill="#e2483d" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M102 48c6-18 0-36-14-44 2 14-4 26-14 34z" fill="#e2483d" stroke="#111114" stroke-width="3" stroke-linejoin="round"/>' },
    { id: 'antifaz', slot: 'face', name: 'Antifaz', excl: 'ruleta', rarity: 'comun', vb: '52 70 98 40',
      svg: '<path d="M56 82c10-12 34-10 45-2 11-8 35-10 45 2 0 14-12 22-24 22-10 0-16-6-21-10-5 4-11 10-21 10-12 0-24-8-24-22z" fill="#7a6bb3" stroke="#111114" stroke-width="3"/><ellipse cx="80" cy="90" rx="11" ry="8" fill="#fff" opacity="0.25"/><ellipse cx="122" cy="90" rx="11" ry="8" fill="#fff" opacity="0.25"/>' },
    { id: 'sombrero-mago', slot: 'head', name: 'Sombrero de mago', excl: 'ruleta', rarity: 'rara', w: 80, b: 84, vb: '0 0 110 96',
      svg: '<ellipse cx="55" cy="84" rx="52" ry="10" fill="#3b2a7a" stroke="#111114" stroke-width="3.5"/><path d="M28 84L58 6 84 84z" fill="#4d3a9e" stroke="#111114" stroke-width="3.5" stroke-linejoin="round"/><path d="M33 72c14 5 36 5 48 0" stroke="#ffd54a" stroke-width="5"/><path transform="translate(46 34) scale(.6)" d="' + STAR_P + '" fill="#ffe08a"/><circle cx="64" cy="58" r="2.5" fill="#fff"/><circle cx="50" cy="22" r="2" fill="#fff"/>' },
    { id: 'monoculo', slot: 'face', name: 'Monóculo', excl: 'ruleta', rarity: 'rara', vb: '96 66 52 70',
      svg: '<circle cx="122" cy="90" r="19" fill="rgba(200,235,255,0.25)" stroke="#d9a843" stroke-width="4.5"/><path d="M138 102c4 10 2 22-4 30" stroke="#d9a843" stroke-width="2" fill="none"/><path d="M110 82l8-4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>' },
    { id: 'collar-perlas', slot: 'neck', name: 'Collar de perlas', excl: 'ruleta', rarity: 'rara', w: 80, t: 72, vb: '0 0 140 50',
      svg: (function () { var h = '', i, t, x, y; for (i = 0; i <= 16; i++) { t = i / 16; x = 8 + t * 124; y = 8 + Math.sin(t * Math.PI) * 30; h += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5.5" fill="#fffaf0" stroke="#b9b2a2" stroke-width="1.5"/>'; } return h + '<circle cx="70" cy="44" r="7" fill="#ffb3c4" stroke="#b9b2a2" stroke-width="1.5"/>'; })() },
    { id: 'lentes-pixel', slot: 'face', name: 'Lentes pixel', excl: 'ruleta', rarity: 'legendaria', vb: '54 74 94 32',
      svg: '<path d="M58 78h86v6h-6v6h-6v6h-6v6h-12v-6h-6v-6h-6v-6h-4v6h-6v6h-6v6h-12v-6h-6v-6h-6v-6h-6z" fill="#111114"/><path d="M68 84h6v6h-6zM112 84h6v6h-6z" fill="#fff"/>' },
    { id: 'halo', slot: 'head', name: 'Halo', excl: 'nivel', need: 10, w: 64, b: 104, vb: '0 0 100 30',
      svg: '<ellipse cx="50" cy="15" rx="44" ry="11" fill="none" stroke="#111114" stroke-width="10"/><ellipse cx="50" cy="15" rx="44" ry="11" fill="none" stroke="#ffe08a" stroke-width="6"/>' },
    { id: 'aura-corazones', slot: 'aura', name: 'Aura de corazones', excl: 'nivel', need: 20, vb: '0 0 60 60',
      svg: '<path transform="translate(2 4) scale(1.1)" d="' + HEART_PATH + '" fill="#ff8fa8"/><path transform="translate(32 20) scale(.9)" d="' + HEART_PATH + '" fill="#ff5f86"/><path transform="translate(10 32) scale(.7)" d="' + HEART_PATH + '" fill="#ffb3c4"/>' },
    { id: 'medalla-oro', slot: 'neck', name: 'Medalla de campeón', excl: 'ranking', w: 40, t: 78, vb: '0 0 60 80',
      svg: '<path d="M14 2l10 30M46 2L36 32" stroke="#e2483d" stroke-width="9"/><circle cx="30" cy="52" r="22" fill="#ffd54a" stroke="#111114" stroke-width="3.5"/><circle cx="30" cy="52" r="15" fill="none" stroke="#e6b830" stroke-width="2"/><path transform="translate(19 41) scale(.92)" d="' + STAR_P + '" fill="#fff6c8" stroke="#b8860b" stroke-width="1.2"/>' },
    { id: 'flor-sakura', slot: 'head', name: 'Flor de sakura', excl: 'jardin', w: 32, b: 76, x: 26, vb: '0 0 60 60',
      svg: '<g stroke="#111114" stroke-width="2.2"><path d="M30 30C22 18 24 6 30 4c6 2 8 14 0 26z" fill="#ffc2d4"/><path d="M30 30C42 24 54 28 54 34c-2 6-14 8-24-4z" fill="#ffc2d4"/><path d="M30 30c8 10 6 22 0 24-6-2-8-14 0-24z" fill="#ffd8e4"/><path d="M30 30C18 36 6 32 6 26c2-6 14-8 24 4z" fill="#ffd8e4"/></g><circle cx="30" cy="30" r="5" fill="#ff8fa8" stroke="#111114" stroke-width="2"/>' }
  );
  THEMES.bano.push({ id: 'bano-arrecife', name: 'Arrecife', excl: 'ruleta', rarity: 'rara', sw: ['#6fc7d6', '#ff8a5c', '#3a8fa3'], map: { '#cfeeea': '#6fc7d6', '#b2dcd6': '#58b3c3', '#8cc6be': '#3a8fa3', '#9ad0c9': '#4aa1b5', '#7ab3ab': '#2f7a8c', '#ffb3c4': '#ff8a5c', '#ff8fa8': '#ffd54a' } });

  // Misiones nuevas (jardín y ranking)
  MISSIONS.push(
    { id: 'water', text: 'Riega una planta del jardín', ev: 'water', goal: 1, coins: 20 },
    { id: 'harvest', text: 'Cosecha algo del jardín', ev: 'harvest', goal: 1, coins: 30 },
    { id: 'plant2', text: 'Siembra 2 semillas', ev: 'plant', goal: 2, coins: 20 }
  );

  // ===================== JARDÍN =====================
  // grow: horas reales. A la mitad la planta tiene sed y se detiene hasta que la riegues.
  var SEEDS = [
    { id: 'edamame', name: 'Edamame', price: 15, hours: 1, level: 1, xp: 8, yield: { food: { edamame: 3 } }, color: '#7cc35a', fruit: '#a6e07e' },
    { id: 'te', name: 'Té verde', price: 25, hours: 3, level: 1, xp: 12, yield: { food: { matcha: 3 } }, color: '#4e8f34', fruit: '#8cc63f' },
    { id: 'arroz', name: 'Arroz', price: 40, hours: 6, level: 2, xp: 18, yield: { food: { rollo: 2, nigiri: 2 } }, color: '#b8c96a', fruit: '#f5f2ec' },
    { id: 'chile', name: 'Chile', price: 60, hours: 8, level: 3, xp: 20, yield: { coins: 150 }, color: '#4e8f34', fruit: '#e2483d' },
    { id: 'sakura', name: 'Sakura', price: 120, hours: 12, level: 6, xp: 30, yield: { coins: 300, item: 'flor-sakura' }, color: '#8a5a3b', fruit: '#ffc2d4' }
  ];
  var PLOT_LEVEL = [1, 1, 4, 8];
  THEMES.jardin = [{ id: 'jardin-base', name: 'Primavera', price: 0, map: {}, sw: ['#a9dcf2', '#7cc35a', '#c98f5a'] }];

  SCENES.jardin = '<rect width="400" height="300" fill="#a9dcf2"/><circle cx="330" cy="70" r="30" fill="#fff3b0"/><ellipse cx="90" cy="70" rx="40" ry="14" fill="#fff"/><ellipse cx="116" cy="62" rx="24" ry="13" fill="#fff"/><ellipse cx="250" cy="110" rx="30" ry="11" fill="#fff"/>'
    + '<path d="M0 230c60-40 120-40 200-10s140 20 200-20v100H0z" fill="#8ccf7a"/><path d="M0 250c80-30 140-20 210 0s130 10 190-20v70H0z" fill="#7cc35a"/>'
    + '<g fill="#f5f2ec" stroke="#c9b9a0" stroke-width="2"><rect x="0" y="232" width="400" height="8"/><rect x="0" y="260" width="400" height="8"/>'
    + '<path d="M10 290v-78l8-10 8 10v78zM50 290v-78l8-10 8 10v78zM90 290v-78l8-10 8 10v78zM294 290v-78l8-10 8 10v78zM334 290v-78l8-10 8 10v78zM374 290v-78l8-10 8 10v78z"/></g>'
    + '<rect y="300" width="400" height="120" fill="#c98f5a"/><rect y="298" width="400" height="6" fill="#a8723f"/><path d="M0 330h400M0 370h400" stroke="#b37a48" stroke-width="2"/>'
    + '<g id="beds"></g>';
  // Posición de las 4 macetas en el escenario
  var BEDS = [[6, 296], [6, 354], [314, 296], [314, 354]];
  // ===================== PALABRAS (Palabra del día) =====================
  // Respuestas: lista propia de palabras comunes. Palabras válidas: an-array-of-spanish-words (licencia MIT).
  var PAL_ANSWERS = 'grasa surco salto angel fuego viaje culpa plato lados gente texto joyas ganas hojas selva trono ficha falda buena ritmo calma astro magia mareo reloj otoño dolor prado venta tribu traje opera disco nariz ronda horno firma tacos basta lento bajar freno favor hijos danza visto musgo forma madre cazos turno cerro abril sitio trigo coche gotas apodo metal patas mirar sopas valle lider viudo tocar pollo huevo fondo nieve actor fruta naves sopes lapiz bueno tango color causa menos ramas labio tapas norte oeste cinco trato jabon malla local pagar ramen etapa hogar joven carne humor piano flaco pared medio burro feria globo santo farol cable baile banda suelo jugar rimas curso peine aguas bahia rampa cerca hacha gesto drama mundo leche ideal barro balon nunca moler coral tarro celos grito canal casas vidas torta altar bicho bebes amiga usted gallo pesca dulce arroz peras vapor elote chico autos lunes tibio señal capaz paseo arena unico marco pinos perro negro busca metro salon marzo silla leona ayuda sueño arete robot canto frase feliz perla cerdo pecho crema cabra salir miedo grano nadar tiras pasar manta atole sobre sushi botas cuero reina circo quien villa calle polvo trapo cielo mosca orden banco brazo carta poder lazos hielo pista camas comer enero pasto tarea lista chica bolsa panza gafas ocaso rollo risas tejer punto julio volar monte tamal jaula rodar flota motor amigo yogur colas yerba datos higos calor letra audio melon nopal nabos campo pieza rocas tarde resto rueda raton mente poeta pizza molde tunel hongo arbol igual nuevo junio poema tigre pausa vacas fiera lunar azote exito zurdo novia corte pozol album cajas zorro dejar mujer barco tinta licor fibra largo algas jarra sorbo guapo padre tacon museo manos besos temas plomo talla avena libre tazon bomba palma atras acero suave untar gorra rayos pulpo bruja mayor lejos soles radio lleno ancho dados fideo costa cocos gripe durar reyes pasta techo chile siglo vigor arpas mango antes trozo notas doble parte ruido lucha libro golpe tomar mochi pinta mucho verde tabla lindo ebano mapas sabor fuera grupo rumbo tenis clima brisa mamas salsa cesta obras ninja mitad velas avion rango cejas borde llama dueño picar patio error cacao cofre cargo trago noche llave gyoza trufa limon prisa diosa clave cosas mudar broma serie moral luces mejor pongo dedos abeja todos falta plaza juego pluma menta jugos pobre enano copas justo vinos sacar ojala panda vocal queso telar cobre ondas fresa poner gusto signo oliva hotel lugar salud cueva cruce'.split(' ');
  var PAL_VALID = null;
  var PAL_VALID_RAW = 'ababa abaca abaco abada abadi abaja abaje abajo abala abale abalo abana abane abano abasi abata abate abati abato abaña abañe abaño abece abeja abete abeto abiar abias abina abine abino abiso abita abite abito aboba abobe abobo aboca aboco abofa abofe abofo aboga abogo aboli abona abone abono aboya aboye aboyo abozo abran abras abren abres abria abrid abril abrio abrir abris absit abubo abuce abuje abura abure aburo abusa abuse abuso abuza abuzo acaba acabe acabo acama acame acamo acana acara acare acaro acaso acata acate acato acebo acece aceda acede acedo acema acepa acepe acepo acera acere acero aceta aceto aceza acezo aceña achin achis acial aciar acida acido acije acilo acimo acion acles aclla acmes acnes acoca acoco acoda acode acodo acoge acogi acoja acojo acola acole acolo acopa acope acopo acora acore acoro acosa acose acoso acota acote acoto acres acroe acroy actas actea actor actos actua actue actuo acuda acude acudi acudo acuea acueo acula acule aculo acuna acune acuno acure acusa acuse acuso acuta acuti acuto acuyo acuña acuñe acuño adala adama adame adamo adaza adema ademe ademo adiad adian adiar adias adien adies adios adiva adive adoba adobe adobo adora adore adoro adosa adose adoso adrad adral adran adrar adras adren adres aduar aduce aduci adufe aduja aduje adujo adula adule adulo aduna adune aduno adura adure aduri aduro adven aedas aedos aerea aereo aetas afaca aface afaga afago afama afame afamo afana afane afano afara afare afata afate afato afead afean afear afeas afeen afees afiar afice afija afijo afila afile afilo afina afine afino afizo aflui afoca afoco afofa afofe afofo afoga afogo afona afono afora afore aforo afosa afose afoso aftas afufa afufe afufo afuma afume afumo agace agami agana agane agano agape agata agave agios agita agite agito agnus agola agole agolo agora agore agoro agota agote agoto agras agraz agres agria agrie agrio agror agros aguad aguai aguan aguar aguas aguay aguce aguda agudo aguen agues aguin aguio aguja aguti aguza aguzo ahaja ahaje ahajo ahija ahije ahijo ahila ahile ahilo ahina ahita ahite ahito ahoga ahogo ahora ahoya ahoye ahoyo ahuma ahume ahumo ahusa ahuse ahuso aillo aillu ainas airad airan airar airas airea airee airen aireo aires airon aisas aisla aisle aislo aites ajaba ajada ajado ajais ajaja ajara ajare ajase ajead ajean ajear ajeas ajebe ajeen ajees ajeis ajena ajeno ajeos ajera ajero ajete ajice ajies ajipa ajiza ajizo ajobo ajora ajore ajoro ajota ajote ajoto ajuar ajuma ajume ajumo ajuna ajuno alaba alabe alabo alaco alada alado alafa alaga alago alaju alala alalo alama alamo alana alano alaui alazo albar albas albea albee albeo albin albor albos album albur alcas alcea alcen alces alcor aldea alead alean alear aleas alece aleda aleen alees alefs alega alego aleja aleje alejo alela alele aleli alelo alema alero aleta aleto aleve aleya alezo alfad alfan alfar alfas alfen alfes alfil alfiz alfoz algar algas algol algos algun alhoz aliad alian aliar alias alica alien alier alies alifa aliga aligo alija alije alijo alimo alims alioj alisa alise aliso aliña aliñe aliño aljez aljor allen almas almea almez almos almud alnas alnos aloba alobe alobo aloca aloco aloes aloja aloje alojo alola alole alolo aloma alome alomo alona alora alosa alota alote aloto aloya alpes altar altas altea altee alteo altor altos aluas aluce aluda alude aludi aludo alula aluna alune aluno aluza aluzo alveo alzad alzan alzar alzas alzos amaba amada amado amaga amago amais amala amale amalo amana amane amano amara amare amaro amasa amase amaso amata amate amato amaña amañe amaño ambar ambas ambla amble amblo ambon ambos ameba ameis amela amele amelo amena ameno ameos amera amere amero amias amiba amibo amida amiga amigo amina amine amino amiri amito amola amole amolo amomo amona amone amono amove amovi ampay ampla amplo ampon ampos ampra ampre ampro amuga amugo amula amule amulo amura amure amuro amuso anabi anaco anade anafe anamu anana anata ancas ancha anche ancho ancla ancle anclo ancon ancua andad andan andar andas andel anden andes andon anead anean anear aneas aneen anees anega anego aneja aneje anejo aneto anexa anexe anexo angel angla anglo angor angra angus anida anide anido anima anime animo anion anisa anise aniso anito aniña aniñe aniño anjeo anoas anodo anola anole anolo anona anota anote anoto ansar ansas ansia ansie ansio antas antes antia antis antro anual anuas anuda anude anudo anula anule anulo anuos anura anuro aocar aojad aojan aojar aojas aojen aojes aojos aonia aonio aorta aovad aovan aovar aovas aoven aoves apaga apago apale apara apare aparo apaña apañe apaño apead apean apear apeas apeen apees apega apego apela apele apelo apena apene apeno apeos apera apere apero apese apice apila apile apilo apios apipa apipe apipo apiri apita apite apito apiña apiñe apiño apnea apoca apoce apoco apoda apode apodo apola apole apolo apone aposa apose aposo apoya apoye apoyo apoza apozo apres aproa aproe aproo aptar aptas aptos apuna apune apuno apura apure apuro apuse apuso apuña apuñe apuño aquea aquel aqueo araba arabe arabi arabo arada arado arais arana arara arare arasa arase araza araña arañe araño arbol arbor arcad arcan arcar arcas arcea arcen arces archa archi arcon arcos ardan ardas ardea arded arden arder ardes ardia ardid ardil ardio ardor ardua arduo areas areca areis arela arele arelo arena arene areno arepa arete arfad arfan arfar arfas arfen arfes arfil argan argel argen argon argos argot argue argui arias arica arico arida arido aries arija arije arijo arilo arios arlad arlan arlar arlas arlen arles arlos armad arman armar armas armen armes armon armos arnas arnes aroca aroma arome aromo arpad arpan arpar arpas arpen arpeo arpes arpia arpon arque arras arraz arrea arree arreo arres arria arrie arrio arroz arrua arrue arrui arruo artal artas artes artos arula arupo aruña aruñe aruño arzon asaba asaca asaco asada asado asais asara asare asaro asase ascar ascas ascia ascio ascos ascua asead asean asear aseas aseda asede asedo aseen asees aseis asela asele aselo aseos asesa asese aseso asgan asgas asian asias asica asico asida asido asila asile asilo asina asira asire asmar asmas asnal asnas asnos asola asole asolo asoma asome asomo asona asone asono aspad aspan aspar aspas aspea aspee aspen aspeo aspes aspic aspid aspro astas aster astil astro astur asuma asume asumi asumo asura asure asuro asuso ataba atabe ataca ataco atada atado atais ataja ataje atajo atapa atape atapo atara atare atase ataud ataña atañe ataño atear ateas atece ateis ateje ateos ateri atesa atese ateso ateta atete ateto ateza atezo atiba atibe atibo atica atice atico atina atine atino atipa atipe atipo atiza atizo atlas atoad atoan atoar atoas atoba atobe atobo atoen atoes atoja atoje atojo atole atomo atona atono atora atore atoro atrae atras atril atrio atroz atufa atufe atufo atura ature aturo atusa atuse atuso atuve atuvo aucas audaz audio auges augur aulas aulla aulle aullo aunad aunan aunar aunas aunen aunes aupad aupan aupar aupas aupen aupes auras aurea aureo ausol autan autor autos avada avade avado avaha avahe avaho avala avale avalo avara avaro avati avece avena avene aveni aveno aveza avezo aviad avian aviar avias avica avida avido avien avies avine avino avion avios avisa avise aviso aviva avive avivo avoca avoco avugo axial axila ayaco ayate ayead ayean ayear ayeas ayeen ayees ayora ayote ayuas ayuda ayude ayudo ayuga ayuna ayune ayuno ayuso azada azaga azago azala azara azare azaro azcon azeri azimo azoad azoan azoar azoas azoca azoco azoen azoes azoga azogo azola azole azolo azora azore azoro azota azote azoto aztor azuas azuce azuda azula azule azulo azuts azuza azuzo añada añade añadi añado añeda añede añedi añedo añeja añeje añejo añera añero añida añide añidi añido añila añile añilo añina añino añoja añojo añora añore añoro añosa añoso añuda añude añudo babas babea babee babel babeo babis bable babor bacan bacas bache bacia bacin bacon badal badan badas badea baden badil bafle bagad bagan bagar bagas bagos bagre bague bahai bahia baida baifa baifo baila baile bailo bajad bajan bajar bajas bajea bajee bajel bajen bajeo bajes bajez bajia bajin bajio bajon bajos balad balaj balan balar balas balay balda balde baldo balea balee balen baleo bales balin balon balos balsa balso balta balto bamba bambu banal banas banca bance banco banda bando banir banjo bantu banyo banzo baque barba barbe barbo barca barco barda barde bardo bares baria baril bario baris barns baron baros barra barre barri barro barza basad basal basan basar basas basca basen bases basis basna basta baste basto batan batas batea batee batel baten bateo bates batey batia batid batin batio batir batis baton batos batua baula baure bausa bauza bayal bayas bayon bayos bayua bayus bazar bazas bazos bañad bañan bañar bañas bañen bañes bañil baños beata beato beban bebas bebed beben beber bebes bebia bebio becad becan becar becas bedel befad befan befar befas befen befes befos befre begum beige bejin belda belde beldo belen beles belez belfa belfo belga belio bella bello belua bemba bembe bembo bemol benes beoda beodo beori beque berbi berma beron berra berre berro berta berza besad besan besar besas besen beses besos betas betel betun beuda beudo beyes bezar bezon bezos biaza bibis bical bicha biche bicho bicis bicos bides bidon biela bifaz bifes bigas bijao bijas bijol bilao biles bilis billa bilma bilme bilmo bimba binad binan binar binas binea binee binen bineo bines bingo binza biota biras birla birle birli birlo biros bisad bisan bisar bisas bisel bisen bises bisos biste bitad bitan bitar bitas biten biter bites bitor bizas bizca bizco bizma bizme bizmo bizna blaos blava blavo bleda bledo bloca bloco blocs blues blusa boato bobas bobea bobee bobeo bobos bocal bocas bocea bocee bocel boceo bocha boche bocho bocin bocio bocon bocoy bodas bodes bodon bofan bofar bofas bofen bofes bofia bofos bogad bogan bogar bogas bogue bohio boina boira boite bojad bojan bojar bojas bojea bojee bojen bojeo bojes bojos bolar bolas boldo bolea bolee boleo boles bolin bolis bolla bolle bollo bolon bolos bolsa bolso bomba bombe bombo bonal bones bonga bongo bonos bonzo boque boqui borax borda borde bordo boreo boria borla borna borne borni boros borra borre borro borto bosar boson bosta botad botan botar botas botea botee boten boteo botes botin boton botor botos boxea boxee boxeo boxer boxes boyad boyal boyan boyar boyas boyen boyes bozal bozas bozon bozos braca braco braga brama brame bramo brasa brava bravo braza brazo braña bread brean brear breas breca brece breco breen brees brega brego brete breva breve breza brezo breña brial briba brice brida briol brios brisa brise briso briza brizo broas broca broce broma brome bromo brota brote broto broza brozo bruce brugo bruja bruje bruji brujo bruma brume brumo bruna bruno bruta bruto bruts bruza bruzo bruña bruñe bruñi bruño buaro bubas bubis bubon bucal bucea bucee bucen buceo buces buche bucio bucle bucos budas budin buega buena bueno buera bufad bufan bufar bufas bufen bufeo bufes bufet bufia bufon bufos bugle buhio buhos buida buido bujeo bujes bujia bujos bular bulas bulbo bulda bules bulin bulis bulla bulle bulli bullo bulon bulos bulto bunas bunio buque buras burda burdo burel bureo burga burgo buril burio buris burla burle burlo buros burra burro busca busco buses busto buten butia buyos buzad buzan buzar buzas buzon buzos cabal cabas cabed caben caber cabes cabia cabio cable cabos cabra cabre cabro cacan cacao cacas cacea cacee cacen caceo caces cacha cache cacho cachu cacle cacos cacto cacuy cadas cadis cados caeis caena caera caere cafes cafiz cafre cagad cagan cagar cagas cagon cague cahiz caian caias caico caida caido caies caiga caigo caima caire caite cajas cajel cajin cajis cajon cajos calad calan calao calar calas calca calce calco calda caldo caled calen caler cales calia calio calis caliz calla calle callo calma calme calmo calon calor calos calta calva calve calvo calza calzo camal camao camas camba cambe cambo camio camon campa campe campo canal canas canda cande candi cando canea canee caneo canes caney canez canga cango cania canil canje canoa canon canos cansa canse canso canta cante canto cantu caoba caobo capad capan capar capas capaz capea capee capel capen capeo capes capia capin capio capis capon capos cappa capta capte capto capuz caqui carao caras carau caray carba carca carda carde cardo carea caree carel careo cares carey carga cargo caria carie cario caris cariz carla carlo carme carne caron caros carpa carpe carpi carpo carra carro carta carvi casad casal casan casar casas casca casco casea casen caseo cases casia casis cason casos caspa casta casto catad catan catar catas catea catee caten cateo cates catey catin caton catos catre cauba cauca cauce cauda cauje caula cauno cauri cauro causa cause causo cauta cauto cauza cavad cavan cavar cavas cavea caven caves cavia cavio cavis cavon cavos cayan cayas cayos cazad cazan cazar cazas cazon cazos cazuz cañad cañal cañan cañar cañas cañea cañee cañen cañeo cañes cañis cañon caños ceaja ceajo cebad ceban cebar cebas ceben cebes cebil cebon cebos cebra cebro cebti cebus cecal cecas cecea cecee ceceo cedan cedas ceded ceden ceder cedes cedia cedio cedro cefea cefee cefeo cefos cegad cegar cegas cegua cegue ceiba ceibo cejad cejan cejar cejas cejen cejes cejos celad celan celar celas celda celen celes celfo celia cella cello celos celta cemas cembo cenad cenal cenan cenar cenas cenca cenco cenen cenes cenia cenis cenit censa cense censo cents cepas cepos cepti cequi ceras cerca cerco cerda cerdo cerea cereo cerio cerna cerne cerni cerno ceron ceros cerpa cerra cerre cerro cesad cesan cesar cesas cesen ceses cesio cesta cesto cetil cetis cetme cetra cetre cetro ceuti ceñad ceñan ceñar ceñas ceñen ceñes ceñia ceñid ceñir ceñis ceños chaca chace chaco chafa chafe chafo chais chaja chala chale chalo chama chame chamo chana chane chano chapa chape chapo chata chato chaul chauz chava chave chavo chaya chaye chayo chaza chazo checa checo chefs cheje chela chele cheli chelo chepa chepe chepo chera chero chesa cheso cheta cheto chiad chian chiar chias chica chico chics chida chido chien chies chifa chiis chile chima chime chimo chimu china chine chino chipa chipe chips chira chiri chisa chist chita chite chito chiva chive chivo chiza choba choca choco chofe chola cholo chona chono chopa chope chopo chora chore chori choro chota chote choto chova choya choye choyo choza chozo chuas chuca chuce chuco chufa chufe chufo chula chule chulo chuna chupa chupe chupo chura churo churu chuta chute chuto chuts chuva chuya chuyo chuza chuzo chuña chuño ciaba ciado ciais ciani ciara ciare ciase ciato cibal cibis cicas cicca cicla cicle ciclo cides cidra cidro cieca ciega ciego cieis cielo ciemo cieno cifra cifre cifro cigua cijas cilio cilla cimar cimas cimba cimia cimpa cinas cinca cinco cincs cines cinia cinta cinte cinto cipes cipos circa circe circo cirio cirro cisca cisco cisma cisme cismo cisne cista citad citan citar citas citen cites citra civil ciñan ciñas ciñen ciñes claco clacs clama clame clamo clapa clara claro clase clava clave clavo clema clero clica clics clima clips clisa clise cliso cloca cloco clona clone clono clora clore cloro clota clube clubs coana coati cobas cobea cobez cobil cobla cobos cobra cobre cobro cocad cocal cocan cocar cocas cocea coced cocee coceo cocer coces cocha coche cochi cocho cocia cocio cocol cocos cocui cocuy codal codas codea codee codeo codez codin codon codos coeva coevo cofan cofas cofia cofin cofre coged cogen coger coges cogia cogio cogon coima coime coine coipo coita coite coito cojal cojan cojas cojea cojee cojeo cojin cojon cojos colad colan colar colas colea colee colen coleo coles colga colgo colin colla colma colme colmo colon color colos colpa colpe colza comal coman comas comba combe combo comed comen comer comes comia comic comio comis comta comto comun conca conde conga congo conos conta conte conto coona copad copal copan copar copas copea copec copee copen copeo copes copey copia copie copin copio copla copon copos copra copta copto coque coqui corad coral coran corar coras corbe corca corco corda corea coree coren coreo cores corio coris corla corle corlo corma corno coros corpa corps corra corre corri corro corsa corse corso corta corte corto corua corva corve corvo corza corzo cosan cosas cosca cosco cosed cosen coser coses cosia cosio cosos cospe costa coste costo cotad cotan cotar cotas coten cotes cotin cotis coton cotos cotua covad covan covar covas coven coves coxal coxas coxis coyan coyas coyes coyol coñac coñas coñea coñee coñeo coñon coños cracs crasa craso craza cread crean crear creas crece creci credo creed creen creer crees creia crema creme cremo crepe creps cresa creso creta creyo criad crian criar crias criba cribe cribo crica crics crida crien cries crina crine crino crios croad croan croar croas croco croen croes croma crome cromo crono cross croto croza cruce cruda crudo cruel cruja cruje cruji crujo cruor crups cruza cruzo cuaba cuaco cuada cuado cuaja cuaje cuajo cuape cuasi cuata cuate cuati cubas cubil cubos cubra cubre cubri cubro cucad cucan cucar cucas cucha cuche cuchi cucho cucos cucus cucuy cueca cuece cueco cuela cuele cuelo cuera cuero cuete cueto cueva cueza cuezo cuica cuico cuida cuide cuido cuija cuilo cuina cuino cuita cujas cujes cujin cujis cujon cular culas culea culee culen culeo culia culio culis culle culon culos culpa culpe culpo culta culto cumas cumba cumbe cumbo cumel cumpa cunad cunan cunar cunas cunda cunde cundi cundo cunea cunee cunen cuneo cunes cuota cupes cuple cupon cupos cuque curad cural curan curar curas curca curco curda curdo curen cures curia curie curil curio curis curos curra curre curro curry cursa curse cursi curso curta curte curti curto curul curva curve curvo cusan cusas cusca cusco cuscu cusen cuses cusia cusid cusio cusir cusis cusma cuspa cusul cutas cuter cutes cutio cutir cutis cutos cutra cutre cuyas cuyeo cuyes cuyos cuzas cuzco cuzma cuzos cuzul cuñad cuñal cuñan cuñar cuñas cuñen cuñes cuños daban dabas dable dacha dacia dacio dadas dador dados dagas dahir daifa dajao dalas dalgo dalia dalla dalle dallo damas damil damos dance dandi dando danes dango danta dante danto danza danzo daqui daran daras dardo dares darga daria datad datan datar datas datea datee daten dateo dates datil datos dauco dauda dazas dañad dañan dañar dañas dañen dañes daños deban debas debda debdo debed deben deber debes debia debil debio debla debos debut decae decai decia decid decir decis decor dedal dedeo dedil dedos deesa dejad dejan dejar dejas dejen dejes dejos delco deles delga delia delio della dello delta demas demos dende densa denso denta dente dento depon deque derbi desca desda desde desdi desea desee deseo deses desga desoi desta deste desto desus detal deten deuda deudo deven deyes dezma dezme dezmo deñar diada diado diana diaño dicaz dicen dices dicha dicho dicta dicte dicto diego diera diere diese diesi dieta diete dieto digan digas digna digne digno dijes dilui diman dimas dimen dimes dimia dimid dimio dimir dimis dimos dinar dinas dines dinos diodo diosa dioso dique diran diras diria disca disco dison dista diste disto ditas diuca divan divas divos diñad diñan diñar diñas diñen diñes dobla doble doblo docas doces docil docta docto dodos dogal dogas dogma dogos dogre dolad dolar dolas doled doler doles dolia dolio dolor dolos domad doman domar domas dombo domen domes domos donad donan donar donas donde donen doneo dones dopad dopan dopar dopas dopen dopes dorad doral doran dorar doras doren dores doria dorio dormi dorna dorso dosel doses dosis dotad dotal dotan dotar dotas doten dotes dotor doñas doñea doñee doñeo draba draga drago drama dreas drena drene dreno drias drino driza droga drogo drope drupa drusa druso dseda dubas dubda dubio ducal ducas duces ducha duche ducho ducos ducto dudad dudan dudar dudas duden dudes duela duele duelo dueto dueña dueño dugos dujos dular dulas dulce dulia duman dumas dumen dumes dumia dumid dumio dumir dumis dunas dunda dundo dupla duplo duque durad duran durar duras duren dures duros ebano ebria ebrio echad echan echar echas echen eches ecuas ecuos edema edila edita edite edito edrad edran edrar edras edren edres educa educe educi educo eduje edujo efebo efeta efeto eflui eforo egena egeno egida eguar eiras ejido ejion ejote elami elata elato elche elega elegi elego elemi elepe eleta eleto eleva eleve elevo elfos elida elide elidi elido elige elija elije elijo elite ellas elles ellos elote eluda elude eludi eludo emana emane emano embai emita emite emiti emito empos empra empre empro emues emula emule emulo enana enano encia eneal eneas eneja eneje enejo enema eneos enero enoja enoje enojo enria enrie enrio ensay enteo entes entra entre entro enula enves envia envie envio enzas eolia eolio eones epale epata epate epato epica epico epoca epoda epodo epota epoto epoxi equis eraba erada erado erais eraje erala erara erare erase erbio ercer erebo ereis ergio ergui erial erias erice erige erigi erija erijo erina erios eriza erizo ermar eroga erogo errad erraj erran errar erras erren erres error erros eruta erute eruto escas escay escoa esmui esnob espay espia espie espin espio esqui estad estan estar estas estay esten ester estes estil estio estol estor estos estoy estro esula etano etapa etica etico etilo etimo etnea etneo etnia etola etolo etusa eubea eubeo euros evada evade evadi evado evita evite evito evoca evoco evohe exida exige exigi exija exijo exila exile exilo exima exime eximi eximo exito exodo exora exore exoro expia expie expio expon extra exuda exude exudo fabas fabla fabos fabro facas facer faces facha fache facho facil facon facto fadas fados faena faene faeno fagos fagot faina faino fajad fajan fajar fajas fajea fajee fajen fajeo fajes fajin fajol fajon fajos falaz falca falce falco falda falla falle fallo falos falsa false falso falta falte falto falua famas fanal fanes fango faqui farad faras farda farde fardo faria fario farol faron faros farpa farra farro farsa farte fases fasol fasos fasta fasto fatal fatas fator fatos fatua fatuo fauna fauno favor favos faxea faxee faxeo faxes fayas fañad fañan fañar fañas fañen fañes febea febeo feble fecal feces fecha feche fecho feeza fejes feliz felon felpa felpe felpo felus femad feman femar femas femen femes femur fenal fenda fendi fenix fenol feral feraz feria ferie ferio ferir fermi feroz ferra ferre ferro ferry festa fetal fetas feten fetor fetos fetua feuca feuco feuda feude feudo feura fiaba fiaca fiada fiado fiais fiana fiara fiare fiase fiats fibra ficar ficen fices ficha fiche ficho ficus fideo fieis fiemo fiera fiero fifad fifan fifar fifas fifen fifes fifis figle figon fijad fijan fijar fijas fijen fijes fijon fijos filad filan filar filas filen files filfa filia filie filin filio filis fillo filma filme filmo films filon filos fimos finad final finan finar finas finca finco finen fines finge fingi finia finid finio finir finis finja finjo finos finta finte finto fique firma firme firmo fisan fisco fisga fisgo fista fisto fizad fizan fizar fizas fizon fiñes flaca flaco flama flaon flash flato flava flavo fleco fleja fleje flejo flema fleme fleos fleta flete fleto flexo flipa flipe flipo floja flojo flora flore floro flota flote floto fluia fluid fluir fluis flujo fluor fluya fluye fluyo fobia focal focas focha focia focio focos fofas fofos fogon foisa foiso fojas folga folgo folia folie folio folla folle follo foluz fomes fonda fondo fones fonil fonio fonje fonos foque foral foras forca force forja forje forjo forma forme formo forno foros forra forre forro forte forum forza forzo fosad fosal fosan fosar fosas fosca fosco fosen foses fosil fosor fosos foton fotos fovea fracs frada frade frado fraga frase fraña frañe frañi fraño frece fredo frega frego freia freid freir freis frena frene freno freon freos fresa frese freso freta frete freto freza frezo frian frias frica frico frien fries frior frios frisa frise friso frita frite frito froga frogo frota frote froto fruia fruid fruir fruis fruta frute fruto fruya fruye fruyo fucar fuchi fucia fucos fudre fuego fuera fuere fuero fuesa fuese fuets fufad fufan fufar fufas fufen fufes fufos fufus fugan fugar fugas fugaz fugir fugue fuina fular fulas fulge fulgi fulja fuljo fulla fumad fuman fumar fumas fumen fumes fumon funca funco funda funde fundi fundo funge fungi funja funjo furas furia furor furos furto fusas fusca fusco fusil fusor fusos fusta fuste fusto futil futon futre fuñar gaban gabar gacel gacha gache gachi gacho gafad gafan gafar gafas gafea gafee gafen gafeo gafes gafos gagas gagos gaita gajes gajos galan galas galce galea galeo gales galga galgo galio galla galle gallo galon galop galos galua gamas gamba gamma gamon gamos ganad ganan ganar ganas ganen ganes ganga gansa ganso ganta gante garas garay garba garbe garbo garfa garia gario garla garle garlo garma garos garpa garpe garpo garra garre garri garro garua garue garuo garza garzo gasas gasea gasee gaseo gases gason gasta gaste gasto gatas gatea gatee gateo gatos gauss gavia gayad gayan gayar gayas gayen gayes gayos gazas gazna gazne gazno gañan gañas gañen gañes gañia gañid gañil gañin gañir gañis gañon gelan gelar gelas gelen geles gelfe gemas gemia gemid gemir gemis genes genio genol gente geoda gerbo gesta geste gesto getas gibad giban gibao gibar gibas giben gibes gibon gigas gilas giles gilis gilva gilvo giman gimas gimen gimes gimio ginea girad giran girar giras giren gires giros gises giste glase glayo gleba glera glial glias glide glifo globo glosa glose gloso gluma gneis gnomo goben gobio gocen goces gocha gocho godas godeo godos gofas gofio gofos gofra gofre gofro golas golea golee goleo goles golfa golfo golfs golpe gomar gomas gomel gomer gomia gonce gongo gorda gordo gorga gorja gorma gorme gormo gorra gorro gotas gotea gotee goteo goton goyas goyos gozad gozan gozar gozas gozne gozon gozos graba grabe grabo grada grade grado grafo grais graja grajo grama grame gramo grana grand grane grano grant graos grapa grape grapo grasa graso grata grate grato grava grave gravo greba greca greco greda green grelo greno greña grial grida grifa grife grifo grija grill grima gripa gripe gripo grisa grisu grita grite grito groad groan groar groas groen groes grogs grojo gromo grosa groso gruas gruia gruid gruir gruis gruja gruje gruji grujo grumo grupa grupi grupo gruta gruya gruye gruyo gruña gruñe gruñi gruño guaba guabo guaca guaco guado guais guaja guaje guala guama guame guamo guano guaos guapa guape guapo guara guare guari guaro guasa guaso guata guate guato guaya guaye guayo gubia guera guero gueto gueña guiad guian guiar guias guida guido guien guies guifa guija guijo guila guilo guina guino guion guipa guipe guipo guira guire guiri guiro guisa guise guiso guita guite guito guiye guiña guiñe guiño gujas gulag gular gulas gulay gules gumia gurda gurdo guris gurus gusta guste gusto guzga guzgo guzla gyoza habar habas haber habia habil habiz habla hable hablo habon habra habre habus hacan haced hacen hacer haces hacha hache hacho hacia hadar hadas hados hafiz hagan hagas haiga halad halan halar halas halda halen hales halla halle hallo halon halos hamez hampa hampo hanzo hapax haran haras harba harbe harbo harca harda harem haren haria harma haron harpa harre harta harte harto hasta hatea hatee hateo hatos haute havar havos hayal hayan hayas hayos hazas heben hebra heces hecha hecho heded heder hedes hedia hedio hedor helad helar helas helea helee heleo helio helor hemos henal henar hende hendi henil henos henry herba herbe herbo heria herid heril herir heris herma heroe herpe herra herre herro hertz herve hervi hespa hespe hespi hespo hetea heteo hevea heñia heñid heñir heñis hiato hicos hidra hieda hiede hiedo hiela hiele hielo hiena hiera hiere hiero higas higos higui hijas hijea hijee hijeo hijos hilad hilan hilar hilas hilen hiles hilio hilos himen himno himpa himpe himpo hinca hinco hindi hindu hipad hipan hipar hipas hipen hiper hipes hipos hippy hirco hirio hirma hirme hirmo hisca hispa hispe hispi hispo hitad hitan hitar hitas hiten hites hiton hitos hiñan hiñas hiñen hiñes hiñia hiñid hiñir hiñis hobby hobos hocen hoces hogar hogos hojas hojea hojee hojeo holan holco holea holee holeo holga holgo holla holle hollo homes honda hondo hongo honor honra honre honro hopan hopar hopas hopea hopee hopen hopeo hopes hopos hoque horas horca horco horda horma horna horne horno horra horre horro hosca hosco hospa hoste hotel hotos hoves hoyad hoyan hoyar hoyas hoyen hoyes hoyos hozad hozan hozar hozas huaca huaco huaje huaos hucha hucho hucia hueca hueco huego huela huele huelo huera huero huesa hueso hueva hueve huevo huian huias huich huida huido huifa huila huilo huira huire huiro hulad hulan hular hulas hulea hulee hulen huleo hules hulla hulte humad human humar humas humea humee humen humeo humes humil humor humos humus hunas hunda hunde hundi hundo hunos hupes huras hurga hurgo huris huron hurra hurta hurte hurto husar husma husme husmo husos hutas hutia huyan huyas huyen huyes ibais ibera ibero ibice icaco iceis ichal ichos ichus icono ictus idead ideal idean idear ideas ideay ideen idees ideos idolo iglus ignea igneo igual iguar ijada ijiyo ijuju ileon ileos ilesa ileso ilion ilota iluda ilude iludi iludo ilusa iluso imada imana imane imano imbui imela imita imite imito impar impia impio impla imple implo impon inane incas incoa incoe incoo indas index india indio indos infla infle inflo ingas ingle ingon ingre inope input inris insta inste insto inter intis intui invar iones iotas ipsis irada irado irani ireis irgan irgas irgue irian irias iride irisa irise iriso irrui irupe isbas islam islan islas isleo isoca istmo itala italo items itera itere itero itria itrio itzaj izaba izada izado izais izara izare izase izote jabas jabis jable jabon jabra jabre jabri jabro jacal jacas jacer jacha jacos jacta jacte jacto jadas jadea jadee jadeo jades jadia jadie jadio jaece jaeza jaezo jagua jaiba jaima jajay jalad jalan jalar jalas jalda jalde jaldo jalea jalee jalen jaleo jales jalma jalon jamad jaman jamar jamas jamba jambe jambo jamen james jamon janes japon jaque jaral jaras jarba jarbe jarbo jarca jarda jaros jarra jarre jarro jasad jasan jasar jasas jasen jases jaspe jatas jateo jates jatib jatos jauda jaudo jauja jaula jauta jauto javas javos jayan jañas jaños jebes jedad jedan jedar jedas jeden jedes jefas jefes jeito jejen jeliz jemal jemes jeque jeras jerbo jerez jerga jerpa jetad jetan jetar jetas jetea jetee jeten jeteo jetes jeton jetos jibes jibia jicos jifas jifia jigas jigue jijas jijea jijee jijeo jimad jiman jimar jimas jimen jimes jimia jimio jinda jines jiote jipas jipia jipie jipio jipis jiras jirel jiron jisca jitad jitan jitar jitas jiten jites jiñad jiñan jiñar jiñas jiñen jiñes jobar jobos jocha joche jocho jocon jocos jodan jodas joded joden joder jodes jodia jodio jodon jofor jolin jondo jonia jonio jopan jopar jopas jopea jopee jopen jopeo jopes jopos joras jorco jorfe jorga jorge jorro josas jotas jotes jotos joule joven joyas joyel joyon joyos juana jubas jubon jubos jucas jucos judas judia judio judos juega juego juera jueza jugad jugar jugas jugos jugue jujea jujee jujeo julia julio julos juman jumar jumas jumea jumee jumen jumeo jumes jumil jumos junce junci junco junio junta junte junto junza junzo jupas jupea jupee jupeo jupon jurad juran jurar juras jurco jurel juren jures juros jusis justa juste justo jutas jutia juvia juzga juzgo juñan juñas juñen juñes juñia juñid juñir juñis labeo labes labia labil labio labor labra labre labro lacad lacan lacar lacas lacea lacee lacen laceo laces lacha lacho lacia lacio lacon lacra lacre lacro lacta lacte lacto ladas ladea ladee ladeo ladon lados ladra ladre ladro lagar lagos lagua laica laico laida laido lajas laman lamas lamba lambe lambi lambo lamed lamen lamer lames lamia lamin lamio lampa lampe lampo lanar lanas lance landa lande lando langa lania lanio lanza lanzo lapas lapiz lapon lapos lapsa lapso laque larda larde lardo lares larga largo larra larva lasar lasas lasca lasco laser lasos lasta laste lasto lasun latan latas lataz latea latee laten lateo lates latex latia latid latin latio latir latis laton latos lauda laude laudo launa lauro lauta lauto lavad lavan lavar lavas laven laves laxad laxan laxar laxas laxen laxes laxos layad layan layar layas layen layes lazad lazan lazar lazas lazos lañad lañan lañar lañas lañen lañes leais lecha leche lecho lecos ledas ledon ledos leeis leera leere legad legal legan legar legas legon legos legra legre legro legua legue legui leian leias leida leido leila leima lejas lejia lejio lejos lelas lelos leman lemas lembo lempo lemur lenas lenca lenes lenon lenta lente lento leona lepra leras lerda lerdo lesas lesea lesee leseo lesna lesos leste letal letea leteo leton letra leuco leuda leude leudo levad levan levar levas leven leves leyes lezda lezna lezne leñad leñan leñar leñas leñen leñes leños liaba liada liado liais liana liara liare liase liaza libad liban libar libas liben liber libes libia libio libon libra libre libro liceo licia licio licor licua licue licuo lider lides lidia lidie lidio lidon liega liego lieis lieva lieve ligad ligan ligar ligas light ligio ligon ligue ligur lijad lijan lijar lijas lijen lijes lilac lilao lilas lilio lilos limad liman limar limas limbo limen limes limon limos linao linar lince linda linde lindo linea linee lineo linfa linio linon linos liosa lioso lipas lipes lipis lipon liras liria lirio liron lisas lises lisia lisie lisio lisis lisol lisos lista liste listo litad litan litar litas liten lites litio litis litre litro lituo liuda liude liudo livor lizas lizos liños llaca llaga llago llama llame llamo llana llano llapa llape llapo llave lleca lleco llega llego llena llene lleno llera lleva lleve llevo llora llore lloro llosa llove llovi loaba loada loado loais loara loare loase lobas lobby lobea lobee lobeo lobos local locas locea locee loceo locha loche locos locro lodon lodos lodra loeis logar logia logis logos logra logre logro loica loina loino lolas lolea lolee loleo lolio lolis lolos lomas lomba lombo lomea lomee lomeo lomos lonas lonco longa longo lonja loras lorea loree loreo lores loros lorza losad losan losar losas losen loses lotas lotea lotee loteo lotes lotin lotos lozas lucas lucen luces lucha luche lucho lucia lucid lucio lucir lucis lucra lucre lucro ludan ludas luden ludes ludia ludid ludie ludio ludir ludis ludos luego lueñe lugar lugre luian luias luida luido luira luire luisa lujad lujan lujar lujas lujen lujes lujos lulos lulus lumas lumbo lumen lumia lunar lunas lunch lunea lunee lunel luneo lunes lunfa lupas lupia lupus lurte lusas lusca lusco lusos lutea luteo lutos luvia luxad luxan luxar luxas luxen luxes luyan luyas luyen luyes luzca luzco lycra mabis mable macal macan macar macas macea macee macen maceo maces macha mache machi macho macia macio macis macla macon macro macua mador madre maesa maese maeso maeña maeño mafia magas magia magie magin magio magma magna magno magos magra magro mague mahon maido majad majal majan majar majas majea majee majen majeo majes majos malar malas malea malee maleo males malis malla malle mallo malon malos malta malva malve malvo mamad maman mamar mamas mambi mambo mamen mames mamey mamia mamon mamua mamut manad manal manan manar manas manca manco manda mande mandi mando manea manee manen maneo manes manga mango mania manid manio manir manis manos mansa manso manta manto manus maoma maori mapas mapea mapee mapeo mapos maque maqui maras marca marce marci marco marea maree mareo mares marga margo maria marlo maron maros marra marre marro marsa marso marta marte marza marzo masad masan masar masas masca masco masea masee masen maseo mases masia maslo mason maste masto matad matan matar matas matea matee maten mateo mates matiz maton matos matul maula maule maulo maura maure mauro mayad mayal mayan mayar mayas mayea mayee mayen mayeo mayes mayor mayos mazad mazan mazar mazas mazna mazne mazno mazos mañas mañea mañee mañeo mañio maños mbaya meaba meada meado meais meaja meano meara meare mease meato mecas meced mecen mecer meces mecha meche mecho mecia mecio mecos medas media medid medie medio medir medis medos medra medre medro meeis megas megos meiga meigo mejan mejas mejed mejen mejer mejes mejia mejio mejor melad melar melas melca melga melgo melis mella melle mello melon melsa melva memas memez memos menad menan menar menas menda menea menee menen meneo menes menge menor menos mensa menso mensu menta mente menti mento menus meona merad meran merar meras merca merco meren meres merey mergo merla merlo merma merme mermo merol meros mersa mesad mesan mesar mesas mesen meses mesma mesmo meson mesta mesto metad metal metan metas meted meten meter metes metia metio metra metro meyas meyor mezan mezas miaba miado miaga miago miais miaja miara miare miase miaus miaña miañe miaño micas micer mices micha miche micho micos micra micro midan midas miden mides midio miedo mieis miela miele mielo miera migad migan migar migas migra migre migro migue mijos milan miles milis milla millo milpa mimad miman mimar mimas mimen mimes mimos minad minal minan minar minas minaz minen mines minga mingo minia minie minio minue mioma miona miope mirad miran mirar miras miren mires mirla mirle mirlo miron mirra mirto mirza misad misal misan misar misas misen mises misia misil misio misma mismo mista miste misto mitad mitan mitas mitin miton mitos mitra mitre mitro miura mixta mixto mizas mizos miñon moais moare moble mocad mocan mocar mocas mocea mocee moceo mocha moche mochi mocho mocil mocos modal modas modem modio modos mofad mofan mofar mofas mofen mofes mogas mogol mogon mogos mohin mohos mohur mojad mojan mojar mojas mojel mojen mojes mojil mojis mojon mojos molad molan molar molas molda molde moldo moled molen moler moles molia molio molla molle molon molos molsa molso momea momee momeo momia momio momos monas monda monde mondo monea monee moneo monfi monga mongo monis monja monje monos monra monse monta monte monto mopan mopas moque morad moral moran morar moras morbo morca morco morde mordi morea moren moreo mores morfa morfe morfo morga moria morid morir moris morma morme mormo moron moros morra morro morsa morse mosca mosco mosen moste mosto motas motea motee motel moteo motes motil motin moton motor motos moved mover moves movia movil movio moxas moxte moyas moyos mozas mozos moñas moñon moños muare muble mucas mucha mucho mucos mudad mudan mudar mudas muden mudes mudez mudos mueca muela muele muelo muera muere muero mueso mueva mueve muevo mufas mufla mufti mugad mugan mugar mugas mugen muges mugia mugid mugil mugio mugir mugis mugle mugor mugre mugue muian muias muida muido muira muire mujan mujas mujer mujol mular mulas muleo mules mulla mulle mulli mullo mulos mulsa mulso multa multe multo munas mundo murad mural muran murar muras muren mures murga muria murio muros murta murto musan musar musas musca musco musen museo muses musga musgo musia musio musir musis muslo musos mutad mutan mutar mutas muten mutes mutis mutra mutro mutua mutuo muyan muyas muyen muyes muñan muñas muñen muñes muñia muñid muñir muñis muñon nabab nabal nabar nabas nabis nabla nabos nacar nacas naced nacen nacer naces nacha nacho nacia nacio nacos nacre nadad nadal nadan nadar nadas naden nades nadga nadie nadir nafra nafre nafro nafta nagua nahoa nahua naife naifs naipe naire najas nalca nalga nanas nanay nance nanea nanee naneo nansa nansu nanta nante nanto napas napea napeo naque narco nardo nares nariz narra narre narro nasal nasas nason nasos natal natas natia natio natos natri nauta naval navas naves navio nazca nazco nazis nebel nebis nebli nebro necea necee neceo necia necio negad negar negas negra negro negue negus nejas nejos neldo neles nemas nemea nemeo nemes nemon nenas nenes nenia nepes neron nesga nesgo netas netos neuma nevad nevar nevas nevos nevus nexos niara niazo niche nicho nicle nicol nidal nidia nidio nidos niega niego niela niele nielo nieta nieto nieva nieve nievo nigua nilad nilon nimba nimbe nimbo nimia nimio ninfa ninfo ninja ninot nioto nipas nipis nipon nipos niqui niste nitor nitos nitra nitre nitro nivea nivel niveo nixte niñas niñea niñee niñeo niñez niños nobel noble nocas noche nocir nocla nodal nodos noema nogal nolis nolit nomas nomon nomos nonas nones nonio nonos nopal noque noray noria norma norme normo norte notad notan notar notas noten notes notos notro novad noval novan novar novas novel noven noves novia novie novio noyos nubes nubia nubil nubio nubla nuble nublo nucas nuche nucir nucos nudas nudos nuera nuesa nueso nueva nueve nuevo nueza nulas nulos numen numos nunca nutra nutre nutri nutro nuños oasis obelo obesa obeso obice obito oblea oboes obolo obrad obran obrar obras obren obres obsta obste obsto obten obues obvia obvie obvio ocapi ocaso ocelo ocena ochos ociad ocian ociar ocias ocien ocies ocios ocles oclui ocote ocras ocres ocrey ocuje ocume ocumo ocupa ocupe ocupo odeon odiad odian odiar odias odien odies odios odres oeste ofita ogaño ogros ohmio oiais oible oidas oidio oidor oidos oigan oigas oimos oiran oiras oiria oislo oiste ojala ojale ojalo ojead ojean ojear ojeas ojeen ojees ojeos ojera ojete ojito ojiva ojosa ojoso ojota ojuda ojudo olais olaje olead olean olear oleas oleen olees oleis oleos olera olere olian olias olida olido olios oliva olive olivo ollao ollar ollas olmas olmos olote olura omani omaso ombus omega omero omeya omina omine omino omisa omiso omita omite omiti omito omoto oncea oncee onceo onces ondas ondea ondee ondeo ondra onece oneci onice onoto onzas opaca opaco opada opado opalo opera opere opero opila opile opilo opima opimo opina opine opino opios opone optad optan optar optas opten optes opuse opuso oraba orada orado orais oraje orale orara orare orase orate orbes orcas orcen orces orcos orden oread orean orear oreas oreen orees oreis oreja oreos orero orfos orfre orgia oribe ories orina orine orino oriol orive orlad orlan orlar orlas orlen orles orlos ornad ornan ornar ornas ornea ornee ornen orneo ornes oroya ortos oruga orujo orzad orzan orzar orzas osaba osada osado osais osara osare osase oscas oscos osead osean osear oseas oseen osees oseis oseos osera osero oseta osmio ososa ososo ostas ostia ostra ostro osuda osudo osuna osuno otate otead otean otear oteas oteen otees otero otila otile otilo otoba otoña otoñe otoño otras otres otris otros ovaba ovada ovado ovais ovala ovale ovalo ovara ovare ovase oveis oveja overa overo ovido ovina ovino ovnis ovolo ovosa ovoso ovula ovule ovulo oxead oxean oxear oxeas oxeen oxees oxida oxide oxido oyera oyere oyese ozena ozona ozono pacae pacas pacay paced pacen pacer paces pacha pacho pacia pacio pacon pacos pacta pacte pacto pacus padre pafia pafio pagad pagan pagar pagas pagel pagos pagro pagua pague pahua paico paila paina paira paire pairo pajar pajas pajea pajee pajel pajeo pajes pajil pajla pajon pajos pajuz palas palay palca palco palea palee paleo pales palia palie palio palis palla palle pallo palma palme palmo palon palor palos palpa palpe palpi palpo palta palto pamba pampa pamue panal panas panca panco panda pando panel panes panga panji panos pansa panty panul panza papad papal papan papar papas papaz papea papee papel papen papeo papes papin papon papos papua papus parad paral paran parao parar paras parca parce parco parda pardo parea pared paree parel paren pareo pares pargo paria parid pario parir paris parla parle parlo parne paros parpa parpe parpo parra parre parro parsi parta parte parti parto parva parvo pasad pasan pasar pasas pasco pasea pasee pasen paseo pases pasil pasma pasme pasmo pasos paspa paspe paspo pasta paste pasto patan patao patas patax patay patea patee pateo pater pates patin patio patis paton patos pauji paula paule paulo pausa pause pauso pauta paute pauto pavas paves pavia pavon pavor pavos paxte payad payan payar payas payen payes payos pazca pazco pazos pañal pañil pañol paños peais peaje peala peale pealo peana peaña pebre pecad pecan pecar pecas peces pecha peche pecho pecio pecta pecte pecto pedal pedia pedid pedio pedir pedis pedos pedro peeis peera peere pegad pegan pegar pegas pegon pegos pegue peian peias peido peina peine peino pejes pejin pelad pelan pelar pelas pelde pelea pelee pelen peleo peles pelis pella pello pelma pelon pelos pelta pelus pelvi pemon penad penal penan penar penas penca penco penda pende pendi pendo penen penes penis penol penos pensa pense penso peora pepas pepes pepla peplo pepon pepus peque peral peras perca perde perdi peris perla perle perlo perna perno perol peros perra perro persa perta perus pesad pesan pesar pesas pesca pesce pesco pesen peses pesga pesgo pesia pesol pesor pesos peste petad petan petar petas peten petes petos petra peuco peumo pezon peñas peñol peñon peños piaba piada piado piafa piafe piafo piais piala piale pialo piano piara piare piase pibas pibes pibil picad pical pican picar picas picea piceo picha piche pichi picho picon picor picos picuy pidan pidas piden pides pidio pidon pieis piejo pieza pifas pifia pifie pifio pigra pigre pigro pigua pihua pijas pijes pijin pijos pijul pijuy pilad pilan pilar pilas pilca pilen pileo piles pilla pille pillo pilme pilon pilos pinal pinar pinas pince pines pinga pingo pinna pinol pinos pinta pinte pinto pinza pinzo piojo piola piole piolo piona pipad pipan pipar pipas pipen pipes pipia pipie pipil pipio pipis pipon pipos pique pirad piral piran pirar piras pirca pirco piren pires pirla piron piros pirra pirre pirri pirro pirul pirus pisad pisan pisar pisas pisca pisco pisen pises pison pisos pispa pispe pispo pista piste pisto pitad pital pitan pitao pitar pitas pitea pitee piten piteo pites pitia pitio pitis piton pitos piula piule piulo piune piure pivot pixel pizca pizco pizza piñal piñas piñen piñon piños placa place placi placo plaga plago plana plano plata plato playa playe playo plaza plazo plaña plañe plañi plaño plebe pleca plega plego plena pleno pleon plepa plexo plica plisa plise pliso ploma plome plomo plugo pluma pobla poble poblo pobos pobra pobre pocas pocha pocho pocos podad podal podan podar podas poded poden poder podes podia podio podon podra podre poema poeta poino poisa poise polar polca polco polea polen poleo polex polin polio polir polis polla pollo polos polvo pomar pomas pomez pomos pompa pompo ponci poned ponen poner pones poney ponga pongo ponia ponis ponto popad popan popar popas popel popen popes popos popti porco porga porgo porno poros porra porro porta porte porto posad posan posar posas posca posea posee posei posen poseo poses posma posmo poson posos posta poste potad potan potar potas potea potee poten poteo potes potos potra potro poyad poyal poyan poyar poyas poyen poyes poyos pozal pozas pozol pozos prado praos prava pravo praza prear preas preda presa preso prest preve previ preña preñe preño prima prime primo prion prior prisa priva prive privo proal proas proba probe probo proco proel profa profe prois proiz prole prona prono prora prosa pruna pruno psies puaba puada puado puais puara puare puase puber pubes pubis pucha pucho pucia pudin pudio pudir pudor pudra pudre pudri pudro pudus pueda puede puedo pueis pufos pugas pugil pugna pugne pugno pujad pujan pujar pujas pujen pujes pujos pulan pulas pulen pules pulga pulia pulid pulio pulir pulis pulla pulle pullo pulpa pulpo pulsa pulse pulso pumas pumba punan punar punas punce punen punes punga punge pungi punia punid punio punir punis punja punjo punta punte punto punza punzo pupad pupan pupar pupas pupen pupes pupos pupus puras purea puree pureo pures purga purgo purin puros purra purre purri purro puses puspa puspo putal putas putea putee puteo puton putos puyad puyan puyar puyas puyen puyes puyon puyos puzle puzol puñal puñar puñir puños pymes queco queda quede quedo queja queje quejo quema queme quemi quemo quena quepa quepi quepo quera quere quero queso quias quien quier quifs quijo quila quilo quima quimo quina quino quios quipa quipu quisa quise quiso quita quite quito quitu quivi quiza quiña quiñe quiño rabal rabas rabea rabee rabel rabeo rabia rabie rabil rabio rabis rabon rabos racea racee racel raceo racha rache racho racor racos radal radar radas rades radia radie radio radon raeis raera raere rafal rafas rafea rafee rafeo rafes rafez rafia ragua ragus rahez raian raias raice raida raido raiga raigo raijo raiza raizo rajad rajan rajar rajas rajen rajes rajon ralas ralba ralbe ralbo ralea ralee raleo ralla ralle rallo rally ralos ralva ralve ralvo ramal ramas ramea ramee ramen rameo ramio ramon ramos rampa rampe rampo ranas randa rands rango ranos rapad rapan rapar rapas rapaz rapen rapes rapos rapta rapte rapto raque raras rarea raree rareo raros rasad rasan rasar rasas rasca rasco rasel rasen rases rasga rasgo rasis rasos raspa raspe raspo ratas ratea ratee rateo ratio raton ratos rauca rauco rauda raudo rauli rauta rayad rayan rayar rayas rayen rayes rayon rayos razar razas razia razon rañas raños reaje reala reama reame reamo reara reare rearo reata reate reato rebla reble reblo rebol rebus recae recai recel recen reces recia recio recle recre recta recte recto recua redad redan redar redas redel reden redes redil redol redor redro refez regad regar regas regia regid regio regir regis regla regle reglo regue rehaz rehen rehui rehus reian reias reida reido reila reile reilo reina reine reino reira reire rejal rejas rejin rejon rejos rejus relax relea relee relei relej releo reles reloj relsa relso relva relve relvo remad reman remar remas remen remes remos renal renca renco renda rende rendi rendo renes renga rengo renil renio renos renta rente rento reoca reojo repon repos repta repte repto resal reses resma resol respe resta reste resto retad retal retan retar retas retel reten retes retin retor retos retro reuma reuna reune reuni reuno revea reved reven reveo rever reves revio reyad reyan reyar reyas reyen reyes rezad rezan rezar rezas rezno rezon rezos reñia reñid reñir reñis riada riais riata ribas ricas ricen rices ricia ricio ricos riega riego riela riele rielo riera riere riese rifad rifan rifar rifas rifen rifes rifle rigen riges rigil rigio rigor rigua rigue rijan rijas rijos rilad rilan rilar rilas rilen riles rimad riman rimar rimas rimel rimen rimes rimus rinda rinde rindo ringa ringo rioja ripia ripie ripio risas risca risco risos rispa rispe rispo ritma ritme ritmo riton ritos rival rizad rizal rizan rizar rizas rizon rizos riñan riñas riñen riñes riñon roais roana roano robad roban robar robas robda roben robes robin robla roble roblo robos robot robra robre rocas rocea rocee rocen roceo roces rocha roche rocho rocia rocie rocin rocio rocos rodad rodal rodao rodar rodas rodea rodee rodeo rodia rodil rodio rodos roeis roela roera roere roete rogad rogar rogas rogos rogue roian roias roida roido roiga roigo rojal rojas rojea rojee rojeo rojez rojos rolad rolan rolar rolas rolda rolde roldo rolen roleo roles rolla rolle rollo rolos roman romas rombo romea romeo romin romis romos rompa rompe rompi rompo ronca ronce ronco ronda ronde rondo rones ronza ronzo ropas ropon roque rorad roran rorar roras roren rores rorro rosal rosan rosar rosas rosca rosco rosea rosee rosen roseo roses rosjo roson rosos rosta roste rosti rosto rotad rotal rotan rotar rotas roten rotes rotor rotos rouge royan royas royos rozad rozan rozar rozas rozna rozne rozno rozon rozos roñad roñal roñan roñar roñas roñen roñes roñia ruaba ruada ruado ruais ruana ruano ruara ruare ruase rubea rubeo rubia rubin rubio rubis rublo rubor rubra rubro rucad rucan rucar rucas rucha ruche rucho rucia rucio rucos rudas rudos rueca rueda ruede ruedo ruega ruego rueis ruejo rueño rufas rufon rufos rugad rugan rugar rugas rugby rugen ruges rugia rugid rugio rugir rugis rugue ruido ruina ruine ruino rujan rujas rujia rujie rujio rulad rulan rular rulas rulen rules rulos rumba rumbe rumbo rumia rumie rumio rumis rumor rumos runas runes runga rungo runos rupia ruque rural rurru rusas rusco rusel ruses rusia rusos rusta ruste rusti rusto rutad rutan rutar rutas rutel ruten rutes ruñad ruñan ruñar ruñas ruñen ruñes ruñia ruñid ruñir ruñis sabea sabed saben sabeo saber sabes sabia sabio sabir sable sabor sabra sabre sacad sacan sacar sacas saces sacha sache sacho sacia sacie sacio sacon sacos sacra sacre sacro saeta saete saeti saeto safir sagas sagaz sagus saina saine saino sajad sajan sajar sajas sajen sajes sajia sajon salad salan salar salas salaz salce salda salde saldo salea salee salen saleo salep sales salga salgo salia salid salin salio salir salis salla salle sallo salma salme salmo salol salon salpa salsa salso salta salte salto salud salva salve salvo saman samas samba sambo samia samio sampa sanad sanan sanar sanas sanco sanea sanee sanen saneo sanes sango sanie sanja sanje sanjo sanos sansa sanso santa santo sapas sapea sapee sapeo sapos saque saran sarao sarda sarde sardo sarga sargo saria saris sarna sarro sarta sarza sarzo sasal satan satas saten satin satis satos sauce sauco saudi sauna savia saxea saxeo saxos sayal sayas sayon sayos sazon sañas seais sebes sebos secad secan secar secas secon secos secta secua sedad sedal sedan sedar sedas sedea sedee seden sedeo sedes segad segar segas segri segue segui segun segur seibo seico seise sejes seles sella selle sello selva semas semen semis senas senda senes senil senos senta sente senti sento seora sepan sepas sepes sepia septo seque seran seras serba serbo seres seria serie serio serna seron serpa serra serre serro servi servo sesea sesee sesen seseo seses sesga sesgo sesil sesis sesma sesmo sesos setal setas setos sexad sexan sexar sexas sexen sexes sexma sexmo sexos sexta sexto señal señas señor short shuar sibil siclo sicus sidas sidra siega siego siena sieso siete sifon sifue sigan sigas sigla siglo sigma signa signe signo sigua sigue sijes sijus silba silbe silbo siles silex silfo silga silgo silla silos silva simas simia simil simio simon simpa simun singa singo sinos sioux sipes sique siras sirga sirgo siria sirin sirio sirle siros sirte sirva sirve sirvo sisad sisal sisan sisar sisas sisca sisea sisee sisen siseo sises sismo sison sitas sitia sitie sitio sitos situa situe situo soasa soase soaso sobad soban sobar sobas soben sobeo sobes sobon sobos sobra sobre sobro socas socaz soche socia socio socol sodas sodio soeza sofas sofis sogas sogun sojas solad solar solas solaz solda solde soldo solea solee solen soleo soler soles solfa solia solio solla sollo solos solta solte solto somas somos sonad sonar sonas sonda sonde sondo sones sonio sonsa sonso sonta sonto sopad sopan sopar sopas sopea sopee sopen sopeo sopes sopie sopla sople soplo sopon sopor sorba sorbe sorbi sorbo sorce sorda sordo sores sorgo sorna sorne sorno soror soros sorra sosal sosar sosas sosia sosos sotad sotan sotar sotas soten sotes sotil sotol sotos sovoz soyas soñad soñar soñas sport spray stand suaba suabo suata suato suave suazi suban subas suben subeo subes subia subid subio subir subis subte suche sucia sucio sucos sucre sucus sudad sudan sudar sudas suden sudes sudor sueca sueco suela suele suelo suena suene sueno suero sueva suevo sueña sueñe sueño sufis sufra sufre sufri sufro suido suita suite suiza suizo sulas sulco sulla sumad suman sumar sumas sumen sumes sumia sumid sumio sumir sumis sumos sumus sunca sunco super supla suple supli suplo supon supra sural suras surca surco surda surde surdi surdo sures surfs surge surgi suris surja surjo surta surte surti surto suses sushi susto sutas sutes sutil suyas suyos suzon tabal tabas tabea tabes tabis tabla table tablo tabon tabor tabos tabus tacar tacas tacen taces tacet tacha tache tacho tacon tacos tacto tafia tafon tafos tafur tagua tahas tahur taifa taiga taima taime taimo taina taino taipa taira taire taita tajad tajan tajar tajas tajea tajee tajen tajeo tajes tajin tajon tajos tajus talad talan talar talas talco talea taled talen tales talgo talin talio talla talle tallo talma talon talos talpa talud tamal tamba tambo tamil tamiz tamos tamul tanas tanca tanco tanda tanes tanga tange tangi tango tanja tanjo tanor tanos tanta tanto tanza tapad tapan tapar tapas tapea tapee tapen tapeo tapes tapia tapie tapin tapio tapir tapis tapiz tapon taque tarad taran tarar taras taray tarca tarco tarda tarde tardo tarea taren tares tarin tarja tarje tarjo tarma tarot tarra tarro tarso tarta tasad tasan tasar tasas tasca tasco tasen tases tasia tasio tasis tasto tatas tatay tatos tatua tatue tatuo tatus tauca tauco taula tauro taxis taxon tayos tayul tazad tazan tazar tazas tazon tañad tañan tañar tañas tañed tañen tañer tañes tañia taños teame tebea tebeo tecas teces techa teche techo tecla tecle teclo tecol tedas tedio tefes tegea tegeo tegua tegue tehul teina tejad tejan tejar tejas tejed tejen tejer tejes tejia tejio tejon tejos telar telas teles telex telon temad teman temar temas temed temen temer temes temia temio temor tempo temus tenas tenaz tenca tende tendi tened tener tenes tenga tengo tenia tenio tenis tenor tensa tense tenso tenta tente tento tenue teosa teoso tepes tepus tepuy teque terca terco terma termo terna terne terno teros tersa terse terso tesad tesan tesar tesas tesen teses tesis tesla teson tesos testa teste testo tetad tetan tetar tetas teten tetes teton tetra tetro texes texto teyas teyos teyus teñas teñia teñid teñir teñis tiaca tiara tibar tibes tibia tibie tibio tibor ticas ticos tiene tiesa tieso tifas tifon tifos tifus tigra tigre tigua tigue tijas tijos tijul tilas tilda tilde tildo tiles tilia tilin tilla tille tillo tilma tilos timad timan timar timas timba timbo timen times timol timon timos timpa tinas tinca tinco tinea tineo tinge tinos tinta tinte tinto tipas tipis tiple tipoi tipos tipoy tique tiqui tirad tiran tirar tiras tiren tires tiria tirio tiron tiros tirro tirso tirte tisis tiste tisus titad titan titar titas titea titee titen titeo tites titil titis titos tizas tizna tizne tizno tizon tizos tiñan tiñas tiñen tiñes tlaco toaba toada toado toais toara toare toase tobar tobas tocad tocan tocar tocas tocen toces tocha toche tocho tocia tocio tocon tocos tocte todas todia todos toeis toesa tofos togan togar togas togue tojal tojos tolas tolda tolde toldo toles tolla tollo tolmo tolon tolva tomad toman tomar tomas tomen tomes tomin tomon tomos tonad tonal tonan tonar tonas tonca tondo tonel tonen toner tones tonga tongo tonos tonta tonto topad topan topar topas topea topee topen topeo topes topia topil topon topos toque toqui toral toras torax torca torce torci torco torda tordo torea toree toreo tores torga torgo toril torio tormo torna torne torno toron toros torpe torra torre torro torso torta torva torvo tosan tosas tosca tosco tosed tosen toser toses tosia tosio tosta toste tosto total totem totes totis totol tovas tozad tozal tozan tozar tozas tozos toñas toñil traba trabe trabo traca trace traed traen traer traes trafa traga trago traia traje trajo trama trame tramo trapa trape trapo traro trata trate trato travo traza trazo trebo trece trefe treja trema treme tremi tremo trena treno treos trepa trepe trepo treta triad trial trian triar trias tribu trice trien tries triga trigo trile trina trine trino trios tripa tripe trisa trise triso triza trizo troca troce troco troja troje trola trole trona trone trono tropa tropo trota trote troto trova trove trovo troza trozo truca truco trues trufa trufe trufo truja trusa trust tuani tubas tubos tucan tucas tucia tucos tucun tudas tudel tueca tueco tuera tuero tufea tufee tufeo tufos tuina tular tules tulio tulla tulle tulli tullo tulpa tumba tumbe tumbo tumor tumos tunad tunal tunan tunar tunas tunca tunco tunda tunde tundi tundo tunea tunee tunel tunen tuneo tunes tunjo tunos tunta tupan tupas tupen tupes tupia tupid tupin tupio tupir tupis tupos turar turba turbe turbo turca turco turma turna turne turno turon turra turre turro tusad tusan tusar tusas tusca tusco tusen tuses tuson tusos tutas tutea tutee tuteo tutes tutia tutor tutos tutus tuyas tuyos tuzas ubica ubico ubies ubios ubres ucase uchus uebos ufana ufane ufano ugres ujier ujule ulaga ulala ulano ulema ulpos ultra uluas ulula ulule ululo umbra umbro umero unais uncen unces uncia uncid uncio uncir uncis ungen unges ungia ungid ungio ungir ungis unian unias unica unico unida unido union unira unire unjan unjas untad untan untar untas unten untes untos unzan unzas upaba upada upado upais upara upare upase upeis upupa uraos urape urato urbes urcas urces urdan urdas urden urdes urdia urdid urdio urdir urdis urdus ureas urgen urges urgia urgid urgio urgir urgis urica urico urjan urjas urnas urtas urubu urucu uruga usaba usada usado usais usaje usara usare usase useis usgos usias usier usina usted usual usura usure usuro utero uvada uvate uveas uvera uvero uviar uvula uñada uñado uñais uñate uñera uñere uñero uñese uñeta uñian uñias uñida uñido uñira uñire uñosa uñoso uñudo vacad vacan vacar vacas vacia vacie vacio vacos vacua vacuo vadea vadee vadeo vades vados vafea vafee vafeo vagad vagan vagar vagas vagon vagos vague vahad vahan vahar vahas vahea vahee vahen vaheo vahes vahos vaida vaina vajea vajee vajeo valar valed valen valer vales valet valga valgo valia valio valis valla valle vallo valon valor valsa valse valso valua value valuo valva vamos vanas vanea vanee vaneo vanos vapor vaque varad varal varan varar varas varea varee varen vareo vares varga varia varie vario varis variz varon vasar vasas vasca vasco vasos vasta vasto vater vates vatio vayan vayas veais vecen veces vedad vedan vedar vedas veden vedes vegas veian veias vejad vejan vejar vejas vejen vejes vejez velad velan velar velas velay velen veles velis veliz vello velon velos veloz vemos venal venas vence venci venda vende vendi vendo venga vengo venia venid venir venis venta vente vento venus venza venzo veran veras veraz verba verbo verde veres verga verge veria veril verja verme vermu veros versa verse verso verte verti veste vesti vetad vetan vetar vetas vetea vetee veten veteo vetes veton vetos vezad vezan vezar vezas viada viaja viaje viajo vibra vibre vibro vicha viche vicho vichy vicia vicie vicio vicos victo vidas video vides vidon vidro vieja viejo viene viera viere viesa viese vigas vigia vigie vigio vigor viles villa vilos vimos vinal vinar vinca vinco vinos vinta viola viole violo virad viral viran virar viras viren vireo vires virgo viril virio virol viron virus visad visan visar visas visco visea visee visen viseo vises visir vison visor visos vista viste visto vitad vital vitan vitar vitas viten vites vitor vitos vitre viuda viudo vivac vivad vivan vivar vivas vivaz viven vives vivez vivia vivid vivio vivir vivis vivon vivos viñas voace vocal vocea vocee voceo voces vodca vodus voila volad volar volas volca volco volea volee voleo volon volts volve volvi volvo vomer voraz vosea vosee voseo votad votan votar votas voten votes votos votri vozna vozne vozno vudus vuela vuele vuelo vuesa vueso vulgo vulto vulva vusco xecas xenon xinca xiote xolas xolos yabas yacal yacas yaced yacen yacer yaces yacia yacio yacon yagan yagas yagua yaiti yales yamao yambo yampa yanas yanta yante yanto yapad yapan yapar yapas yapen yapes yapus yaque yaqui yarda yares yarey yaros yatai yatay yates yayas yayos yazca yazco yazga yazgo yebos yecos yedgo yedra yegua yelgo yelmo yemas yendo yenes yente yeral yerba yerga yergo yerma yerme yermo yerna yerno yeros yerra yerre yerro yersi yerta yerto yervo yesal yesar yesca yeson yesos yetis yeyes yeyos yezgo yinas yines yiras yiros yodad yodan yodar yodas yoden yodes yodos yogar yogas yogos yogui yogur yolas yoqui yoris yoses yoyos yucal yucas yucpa yudos yugos yumba yumbo yunga yunta yunto yuras yures yutas yutes yuyal yuyos zabra zabro zacas zacea zacee zaceo zades zafad zafan zafar zafas zafen zafes zafia zafio zafir zafon zafos zafra zafre zagal zagas zagua zahen zahon zaida zaina zaino zajon zalas zalba zalbo zalea zalee zaleo zalla zalle zallo zamba zambo zampa zampe zampo zanas zanca zanco zanga zanja zanje zanjo zapad zapan zapar zapas zapea zapee zapen zapeo zapes zaque zarbo zarca zarco zares zarja zarpa zarpe zarpo zarza zarzo zatas zayas zazas zazos zebra zedas zegri zeina zejel zenda zendo zenes zenit zetas zincs zocad zocan zocar zocas zoclo zocos zofra zoilo zoizo zolle zomas zombi zomos zompa zompo zonal zonas zonda zonta zonto zonza zonzo zopas zopes zopos zoque zorra zorro zotal zotes zotol zuavo zubia zudas zueca zueco zuela zuiza zulla zulle zullo zulus zumas zumba zumbe zumbo zumos zunas zunza zupia zuras zurba zurce zurci zurda zurde zurdi zurdo zurea zuree zureo zuros zurra zurre zurri zurro zurza zurzo zuzar zuzon zuñan zuñas zuñen zuñes zuñia zuñid zuñir zuñis zuños ñajas ñajos ñames ñampi ñandu ñanga ñango ñapas ñaque ñatas ñatea ñatee ñateo ñatos ñañas ñaños ñecas ñecla ñecos ñenga ñengo ñeque ñinga ñipes ñique ñires ñisca ñizca ñocas ñocha ñoclo ñocos ñolas ñonga ñongo ñoqui ñoras ñorbo ñores ñoñas ñoñez ñoños ñublo ñucas ñucos ñudos ñurda ñurdo ñutas ñutos ñuzco';
  // ===================== TEMPORADAS =====================
  // Las 10 fechas más celebradas en México + el aniversario de Hoshi (fecha en lib/hoshitoRewards.js).
  // Cada temporada decora los cuartos y la app, regala una prenda y vende ropa y comida que solo salen esos días.
  function bunting(cols, y, kind) {
    var h = '<path d="M-10 ' + y + 'Q200 ' + (y + 16) + ' 410 ' + y + '" fill="none" stroke="#5a4a3a" stroke-width="2"/>', n = 13;
    for (var i = 0; i < n; i++) {
      var x = -6 + i * 32.5, t = (x + 10) / 420, yy = y + Math.sin(t * Math.PI) * 15, c = cols[i % cols.length];
      if (kind === 'picado') {
        h += '<g transform="translate(' + x.toFixed(1) + ' ' + yy.toFixed(1) + ')"><path d="M0 0h28v30l-3.5 4-3.5-4-3.5 4-3.5-4-3.5 4-3.5-4-3.5 4-3.5-4z" fill="' + c + '" opacity=".95"/>'
          + '<g fill="#fffdf7" opacity=".55"><circle cx="14" cy="11" r="4"/><path d="M5 20l3-3 3 3-3 3zM17 20l3-3 3 3-3 3z"/><circle cx="6" cy="7" r="1.6"/><circle cx="22" cy="7" r="1.6"/></g></g>';
      } else if (kind === 'luces') {
        h += '<g transform="translate(' + (x + 14).toFixed(1) + ' ' + (yy + 1).toFixed(1) + ')"><rect x="-2.5" y="0" width="5" height="5" fill="#3a4a40"/><ellipse cx="0" cy="11" rx="5" ry="7" fill="' + c + '"/><ellipse cx="-1.5" cy="8" rx="1.5" ry="2.5" fill="#fff" opacity=".6"/><circle cx="0" cy="11" r="12" fill="' + c + '" opacity=".18"/></g>';
      } else if (kind === 'corazones') {
        h += '<path transform="translate(' + (x + 3).toFixed(1) + ' ' + (yy - 2).toFixed(1) + ') scale(1.05)" d="' + HEART_PATH + '" fill="' + c + '" stroke="#111114" stroke-width="1"/>';
      } else if (kind === 'flores') {
        h += '<g transform="translate(' + (x + 14).toFixed(1) + ' ' + (yy + 6).toFixed(1) + ')"><g fill="' + c + '" stroke="#b5591b" stroke-width="1">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (k) { var a = k / 8 * Math.PI * 2; return '<circle cx="' + (Math.cos(a) * 6).toFixed(1) + '" cy="' + (Math.sin(a) * 6).toFixed(1) + '" r="4.5"/>'; }).join('') + '</g><circle r="4" fill="#ffd54a"/></g>';
      } else {
        h += '<path transform="translate(' + x.toFixed(1) + ' ' + yy.toFixed(1) + ')" d="M2 0h24L14 26z" fill="' + c + '" stroke="#111114" stroke-width="1"/>';
      }
    }
    return h;
  }
  function confetti(cols, n, seed) {
    var r = seeded('conf' + seed), h = '';
    for (var i = 0; i < n; i++) h += '<rect x="' + (r() * 400).toFixed(0) + '" y="' + (40 + r() * 240).toFixed(0) + '" width="5" height="9" rx="1" fill="' + cols[i % cols.length] + '" transform="rotate(' + (r() * 180).toFixed(0) + ')" transform-origin="center" opacity=".75"/>';
    return h;
  }
  function balloons(cols, x, y) {
    return cols.map(function (c, i) {
      var bx = x + i * 22 - 22, by = y - 70 - (i % 2) * 18;
      return '<path d="M' + bx + ' ' + (by + 22) + 'Q' + (bx + 6) + ' ' + (by + 50) + ' ' + x + ' ' + y + '" stroke="#5a4a3a" stroke-width="1.2" fill="none"/><ellipse cx="' + bx + '" cy="' + by + '" rx="15" ry="19" fill="' + c + '" stroke="#111114" stroke-width="1.6"/><path d="M' + (bx - 3) + ' ' + (by + 19) + 'l3 5 3-5z" fill="' + c + '" stroke="#111114" stroke-width="1"/><ellipse cx="' + (bx - 5) + '" cy="' + (by - 7) + '" rx="4" ry="6" fill="#fff" opacity=".45"/>';
    }).join('');
  }
  var STROKE = ' stroke="#111114" stroke-width="2"';
  // Lo que va en el piso se baja al nivel del suelo y se aleja del borde (en teléfonos angostos se recorta).
  function FLOOR(s) { return '<g transform="translate(-26 94)">' + s + '</g>'; }

  var EVENTS = [
    { id: 'anio', name: 'Año Nuevo', short: 'Año Nuevo', from: [12, 31], to: [1, 2], cols: ['#ffd54a', '#c8a8ff', '#7cc8ff'],
      hi: '¡Feliz año nuevo! ¿Ya pediste tus 12 deseos?',
      icon: '<path d="M6 21l3-12 8 4z" fill="#ffd54a" stroke="#111114" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 4l1 2 2 .3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L11 6.3l2-.3z" fill="#c8a8ff"/><path d="M18 8l3-2M19 12l3 1M6 6L4 3" stroke="#7cc8ff" stroke-width="1.6" stroke-linecap="round"/>',
      deco: function () { return bunting(['#ffd54a', '#c8a8ff', '#7cc8ff', '#ff8fa8'], 6, 'tri') + confetti(['#ffd54a', '#c8a8ff', '#7cc8ff', '#ff8fa8'], 26, 'anio') + FLOOR(balloons(['#ffd54a', '#c8a8ff', '#7cc8ff'], 368, 296)); } },
    { id: 'reyes', name: 'Día de Reyes', short: 'Reyes', from: [1, 3], to: [1, 6], cols: ['#ffd54a', '#7a6bb3', '#e2483d'],
      hi: '¿Partimos la rosca? Ojalá no me toque el muñequito…',
      icon: '<path d="M4 18l-1-10 5 4 4-7 4 7 5-4-1 10z" fill="#ffd54a" stroke="#111114" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="15" r="1.6" fill="#e2483d"/>',
      deco: function () {
        return bunting(['#ffd54a', '#7a6bb3', '#e2483d'], 6, 'tri')
          + [[40, 70], [360, 60], [300, 110], [90, 130]].map(function (p, i) { return '<path transform="translate(' + p[0] + ' ' + p[1] + ') scale(' + (i % 2 ? 0.9 : 1.2) + ')" d="' + STAR_P + '" fill="#ffe08a" opacity=".9"/>'; }).join('')
          + FLOOR('<g transform="translate(316 262)"><rect x="4" y="30" width="72" height="8" rx="2" fill="#c98f5a"' + STROKE + '/><ellipse cx="40" cy="24" rx="38" ry="14" fill="#e2a55c"' + STROKE + '/><ellipse cx="40" cy="20" rx="26" ry="6" fill="#f3d9a6"/><g' + STROKE + '><rect x="10" y="14" width="10" height="5" rx="2" fill="#e2483d"/><rect x="30" y="10" width="10" height="5" rx="2" fill="#7cc35a"/><rect x="52" y="13" width="10" height="5" rx="2" fill="#ffd54a"/></g></g>');
      } },
    { id: 'candelaria', name: 'Día de la Candelaria', short: 'Candelaria', from: [1, 30], to: [2, 2], cols: ['#7cc35a', '#f3d9a6', '#e2483d'],
      hi: '¿A ti quién te toca poner los tamales?',
      icon: '<path d="M5 6c4-3 10-3 14 0l-2 13c-3 2-7 2-10 0z" fill="#d9c27a" stroke="#111114" stroke-width="1.5"/><path d="M9 8l1 10M15 8l-1 10" stroke="#a88c3c" stroke-width="1.2"/>',
      deco: function () {
        return bunting(['#7cc35a', '#ffd54a', '#e2483d', '#ff8fa8'], 6, 'picado')
          + FLOOR('<g transform="translate(312 220)"><path d="M18 28c-4-10 6-14 2-24M38 26c-4-10 6-14 2-24M58 28c-4-10 6-14 2-24" stroke="#fff" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/><path d="M6 40h68l-6 40H12z" fill="#b8643a"' + STROKE + '/><rect x="2" y="34" width="76" height="10" rx="4" fill="#c97a4a"' + STROKE + '/><path d="M20 34c2-8 10-10 14-2M40 34c2-8 10-10 14-2" fill="#d9c27a"' + STROKE + '/><path d="M18 56q22 8 44 0" stroke="#fff3c4" stroke-width="2.5" fill="none"/></g>');
      } },
    { id: 'amor', name: 'Día del Amor y la Amistad', short: 'Amor y Amistad', from: [2, 10], to: [2, 14], cols: ['#ff5f86', '#ffb3c4', '#fff6dc'],
      hi: '¡Feliz día del amor y la amistad! Tú eres mi mejor amigo.',
      icon: '<path transform="translate(0 1)" d="' + HEART_PATH + '" fill="#ff5f86" stroke="#111114" stroke-width="1.4"/>',
      deco: function () {
        return bunting(['#ff5f86', '#ffb3c4', '#e2483d'], 8, 'corazones')
          + FLOOR('<g transform="translate(340 168)"><path d="M12 40Q8 80 30 128" stroke="#5a4a3a" stroke-width="1.4" fill="none"/><path transform="scale(1.6)" d="' + HEART_PATH + '" fill="#ff5f86" stroke="#111114" stroke-width="1.2"/><path d="M8 12q3-5 8-5" stroke="#fff" stroke-width="2.5" fill="none" opacity=".6" stroke-linecap="round"/></g>'
          + '<g transform="translate(300 222)"><path d="M10 16Q4 50 24 74" stroke="#5a4a3a" stroke-width="1.2" fill="none"/><path d="' + HEART_PATH + '" fill="#ffb3c4" stroke="#111114" stroke-width="1"/></g>');
      } },
    { id: 'nino', name: 'Día del Niño', short: 'Día del Niño', from: [4, 26], to: [4, 30], cols: ['#7cc8ff', '#ffd54a', '#ff8a5c'],
      hi: '¡Hoy toca jugar todo el día! ¿Rompemos la piñata?',
      icon: '<path d="M12 2l2.4 5.6 6 .6-4.5 4 1.3 6-5.2-3.1-5.2 3.1 1.3-6-4.5-4 6-.6z" fill="#ff8a5c" stroke="#111114" stroke-width="1.4" stroke-linejoin="round"/>',
      deco: function () {
        var pin = '<g transform="translate(252 64)"><path d="M30 -70v40" stroke="#5a4a3a" stroke-width="1.5"/><circle cx="30" cy="30" r="20" fill="#ffd54a"' + STROKE + '/>' + [0, 1, 2, 3, 4, 5, 6].map(function (k) { var a = k / 7 * Math.PI * 2 - Math.PI / 2, x = 30 + Math.cos(a) * 20, y = 30 + Math.sin(a) * 20, c = ['#ff8a5c', '#7cc8ff', '#ff8fa8', '#7cc35a'][k % 4]; return '<path d="M' + (x - Math.sin(a) * 6).toFixed(1) + ' ' + (y + Math.cos(a) * 6).toFixed(1) + 'L' + (30 + Math.cos(a) * 46).toFixed(1) + ' ' + (30 + Math.sin(a) * 46).toFixed(1) + 'L' + (x + Math.sin(a) * 6).toFixed(1) + ' ' + (y - Math.cos(a) * 6).toFixed(1) + 'z" fill="' + c + '"' + STROKE + '/><path d="M' + (30 + Math.cos(a) * 46).toFixed(1) + ' ' + (30 + Math.sin(a) * 46).toFixed(1) + 'l' + (Math.cos(a) * 6).toFixed(1) + ' ' + (Math.sin(a) * 10 + 6).toFixed(1) + '" stroke="' + c + '" stroke-width="3"/>'; }).join('') + '<circle cx="30" cy="30" r="20" fill="#ffd54a"' + STROKE + '/><circle cx="23" cy="27" r="2.5" fill="#111114"/><circle cx="37" cy="27" r="2.5" fill="#111114"/><path d="M24 35q6 5 12 0" stroke="#111114" stroke-width="2" fill="none" stroke-linecap="round"/></g>';
        return bunting(['#7cc8ff', '#ffd54a', '#ff8a5c', '#7cc35a', '#ff8fa8'], 6, 'tri') + pin + confetti(['#7cc8ff', '#ffd54a', '#ff8a5c', '#ff8fa8'], 16, 'nino');
      } },
    { id: 'madres', name: 'Día de las Madres', short: 'Día de las Madres', from: [5, 6], to: [5, 10], cols: ['#ff8fa8', '#e2483d', '#7cc35a'],
      hi: '¡Feliz día a todas las mamás! ¿Ya le diste su abrazo?',
      icon: '<g stroke="#111114" stroke-width="1.2"><circle cx="12" cy="8" r="4" fill="#e2483d"/><circle cx="8" cy="10" r="3.5" fill="#ff5f86"/><circle cx="16" cy="10" r="3.5" fill="#ff5f86"/></g><path d="M12 13v8M12 17l-3-2M12 18l3-2" stroke="#3f9a63" stroke-width="1.8" stroke-linecap="round"/>',
      deco: function () {
        var fl = function (x, y, c) { return '<g transform="translate(' + x + ' ' + y + ')"><path d="M0 0Q-4 30 2 60" stroke="#3f9a63" stroke-width="3" fill="none"/><g fill="' + c + '" stroke="#111114" stroke-width="1.4">' + [0, 1, 2, 3, 4, 5].map(function (k) { var a = k / 6 * Math.PI * 2; return '<circle cx="' + (Math.cos(a) * 7).toFixed(1) + '" cy="' + (Math.sin(a) * 7).toFixed(1) + '" r="6"/>'; }).join('') + '</g><circle r="4.5" fill="#ffd54a"/></g>'; };
        return bunting(['#ff8fa8', '#fff6dc', '#e2483d', '#ffb3c4'], 6, 'picado')
          + FLOOR('<g transform="translate(320 196)">' + fl(16, 20, '#e2483d') + fl(36, 6, '#ff8fa8') + fl(54, 24, '#fff6dc') + '<path d="M14 70h46l-6 36H20z" fill="#7cc8ff"' + STROKE + '/><rect x="10" y="64" width="54" height="10" rx="4" fill="#5aa8de"' + STROKE + '/><path d="M28 86q9 6 18 0" stroke="#fff" stroke-width="2.5" fill="none"/></g>');
      } },
    { id: 'padre', name: 'Día del Padre', short: 'Día del Padre', from: 'padre', cols: ['#3a6ea5', '#7cc8ff', '#ffd54a'],
      hi: '¡Feliz día a todos los papás! ¿Carnita asada?',
      icon: '<path d="M9 3h6l-1 4 3 12-5 3-5-3 3-12z" fill="#3a6ea5" stroke="#111114" stroke-width="1.4" stroke-linejoin="round"/><path d="M10 10l4 2M10 15l4 2" stroke="#7cc8ff" stroke-width="1.4"/>',
      deco: function () {
        return bunting(['#3a6ea5', '#7cc8ff', '#ffd54a', '#fffdf7'], 6, 'tri')
          + FLOOR('<g transform="translate(314 222)"><path d="M14 38c-2-10 6-12 2-22M34 36c-2-10 6-12 2-22M54 38c-2-10 6-12 2-22" stroke="#fff" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/><path d="M6 40h66a33 20 0 01-66 0z" fill="#2d3138"' + STROKE + '/><path d="M8 42h62" stroke="#9aa3ad" stroke-width="2"/><g' + STROKE + '><rect x="14" y="30" width="22" height="12" rx="4" fill="#9b4a2c"/><rect x="40" y="31" width="22" height="11" rx="4" fill="#a8562f"/></g><path d="M20 60l-8 18M58 60l8 18M39 60v18" stroke="#2d3138" stroke-width="4"/></g>');
      } },
    { id: 'patrias', name: 'Fiestas Patrias', short: 'Fiestas Patrias', from: [9, 10], to: [9, 16], cols: ['#1f8a4c', '#fffdf7', '#d6303a'],
      hi: '¡Viva México! ¿Pozole o chiles en nogada?',
      icon: '<rect x="3" y="6" width="6" height="12" fill="#1f8a4c" stroke="#111114" stroke-width="1.2"/><rect x="9" y="6" width="6" height="12" fill="#fffdf7" stroke="#111114" stroke-width="1.2"/><rect x="15" y="6" width="6" height="12" fill="#d6303a" stroke="#111114" stroke-width="1.2"/>',
      deco: function () {
        var flag = function (x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M0 0v70" stroke="#5a4a3a" stroke-width="3"/><path d="M2 2h14v24H2z" fill="#1f8a4c"/><path d="M16 2h14v24H16z" fill="#fffdf7"/><path d="M30 2h14v24H30z" fill="#d6303a"/><path d="M2 2h42v24H2z" fill="none" stroke="#111114" stroke-width="1.5"/></g>'; };
        return bunting(['#1f8a4c', '#fffdf7', '#d6303a'], 6, 'picado') + FLOOR(flag(326, 228, 1.1) + flag(352, 246, 0.85));
      } },
    { id: 'muertos', name: 'Día de Muertos', short: 'Día de Muertos', from: [10, 28], to: [11, 2], cols: ['#ff8a1f', '#c8a8ff', '#ff5f86'],
      hi: 'Ya pusimos la ofrenda. Huele a cempasúchil y pan de muerto.',
      icon: '<path d="M12 3c5 0 8 3 8 7 0 3-2 4-2 6v3h-3v-2h-2v2h-2v-2H9v2H6v-3c0-2-2-3-2-6 0-4 3-7 8-7z" fill="#fffdf7" stroke="#111114" stroke-width="1.4"/><circle cx="9" cy="10" r="2" fill="#ff8a1f"/><circle cx="15" cy="10" r="2" fill="#ff8a1f"/><path d="M12 12l-1 2h2z" fill="#111114"/>',
      deco: function () {
        var cand = function (x, h) { return '<g transform="translate(' + x + ' ' + (300 - h) + ')"><rect x="-5" y="0" width="10" height="' + h + '" rx="2" fill="#fff6dc"' + STROKE + '/><path d="M0 -14c-5 5-4 10 0 12 4-2 5-7 0-12z" fill="#ffb02e"/><circle cx="0" cy="-6" r="14" fill="#ffb02e" opacity=".22"/></g>'; };
        var flor = function (x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" stroke="#b5591b" stroke-width="1">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (k) { var a = k / 10 * Math.PI * 2; return '<circle cx="' + (Math.cos(a) * 7).toFixed(1) + '" cy="' + (Math.sin(a) * 7).toFixed(1) + '" r="5" fill="' + (k % 2 ? '#ff8a1f' : '#ffb02e') + '"/>'; }).join('') + '<circle r="5" fill="#ff8a1f"/></g>'; };
        return bunting(['#ff8a1f', '#c8a8ff', '#ff5f86', '#7cc35a', '#ffd54a'], 6, 'picado')
          + FLOOR('<g transform="translate(300 250)"><path d="M0 50h96v-12H0z" fill="#7a3b8f"' + STROKE + '/><path d="M8 38h80v-14H8z" fill="#9b5ab0"' + STROKE + '/><path d="M40 24c0-10 16-10 16 0" fill="#fffdf7" stroke="#111114" stroke-width="1.5"/><circle cx="45" cy="20" r="1.6" fill="#111114"/><circle cx="51" cy="20" r="1.6" fill="#111114"/><ellipse cx="24" cy="20" rx="10" ry="5" fill="#e2a55c" stroke="#111114" stroke-width="1.5"/><path d="M18 18q6-4 12 0" stroke="#b07a3a" stroke-width="1.5" fill="none"/></g>'
          + cand(310, 26) + cand(388, 34) + flor(326, 296, 1) + flor(372, 296, 0.9) + flor(350, 300, 0.8));
      } },
    { id: 'navidad', name: 'Posadas y Navidad', short: 'Navidad', from: [12, 12], to: [12, 30], cols: ['#d6303a', '#1f8a4c', '#ffd54a'],
      hi: '¡Ya llegaron las posadas! ¿Me das un buñuelo?',
      icon: '<path d="M12 2l7 11h-4l5 7H4l5-7H5z" fill="#1f8a4c" stroke="#111114" stroke-width="1.4" stroke-linejoin="round"/><rect x="10" y="20" width="4" height="3" fill="#8a5a3b"/><circle cx="10" cy="11" r="1.3" fill="#d6303a"/><circle cx="14" cy="16" r="1.3" fill="#ffd54a"/>',
      deco: function () {
        var tree = '<g transform="translate(316 170)"><path d="M40 0l26 42H54l24 36H62l22 32H-4l22-32H2l24-36H14z" fill="#1f8a4c"' + STROKE + ' stroke-linejoin="round"/><rect x="33" y="110" width="14" height="16" fill="#8a5a3b"' + STROKE + '/><path transform="translate(28 -14) scale(1)" d="' + STAR_P + '" fill="#ffd54a" stroke="#111114" stroke-width="1.2"/>'
          + [[30, 40, '#d6303a'], [52, 56, '#ffd54a'], [22, 78, '#7cc8ff'], [56, 90, '#d6303a'], [38, 100, '#ffd54a'], [14, 100, '#ff8fa8']].map(function (b) { return '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="4.5" fill="' + b[2] + '" stroke="#111114" stroke-width="1.2"/>'; }).join('')
          + '<g transform="translate(-30 100)"><rect x="0" y="6" width="26" height="22" fill="#d6303a"' + STROKE + '/><path d="M13 6v22M0 15h26" stroke="#ffd54a" stroke-width="4"/><path d="M13 6c-6-8-12-2-6 0M13 6c6-8 12-2 6 0" stroke="#ffd54a" stroke-width="2.5" fill="none"/></g></g>';
        return bunting(['#d6303a', '#ffd54a', '#1f8a4c', '#7cc8ff', '#ff8fa8'], 4, 'luces') + FLOOR(tree);
      } },
    { id: 'aniversario', name: 'Aniversario Hoshi', short: 'Aniversario', from: 'aniv', cols: ['#111114', '#bfe8cc', '#ffd54a'],
      hi: '¡Es el aniversario de Hoshi! Gracias por ser parte de la familia.',
      icon: '<circle cx="12" cy="13" r="8" fill="#111114"/><circle cx="12" cy="13" r="5" fill="#fffdf7"/><circle cx="10.5" cy="12" r="1.8" fill="#ff9f7a"/><circle cx="13.5" cy="14.5" r="1.5" fill="#c2e8aa"/><path d="M12 1l1.2 2.6 2.8.3-2.1 1.9.6 2.8L12 7.2 9.5 8.6l.6-2.8L8 3.9l2.8-.3z" fill="#ffd54a" stroke="#111114" stroke-width=".8"/>',
      deco: function () {
        return bunting(['#111114', '#bfe8cc', '#ffd54a', '#ff8a5c', '#fffdf7'], 6, 'tri') + confetti(['#bfe8cc', '#ffd54a', '#ff8a5c', '#fffdf7'], 22, 'aniv') + FLOOR(balloons(['#bfe8cc', '#111114', '#ffd54a'], 366, 296)
          + '<g transform="translate(296 254)"><rect x="0" y="22" width="44" height="24" rx="4" fill="#fff6dc"' + STROKE + '/><rect x="0" y="22" width="44" height="7" fill="#ff8fa8"/><rect x="8" y="4" width="28" height="18" rx="3" fill="#fff6dc"' + STROKE + '/><rect x="20" y="-8" width="4" height="12" fill="#bfe8cc" stroke="#111114" stroke-width="1"/><path d="M22 -16c-3 3-2 6 0 7 2-1 3-4 0-7z" fill="#ffb02e"/></g>');
      } }
  ];

  // Ropa de temporada: gift = regalo gratis de la temporada; con price = se compra solo en esos días.
  ITEMS.push(
    { id: 'gorro-anio', slot: 'head', name: 'Gorrito de Año Nuevo', excl: 'evento', ev: 'anio', gift: true, w: 40, b: 88, vb: '0 0 60 84',
      svg: '<path d="M30 6L6 76h48z" fill="#c8a8ff" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M14 52l30-10M10 66l38-12M20 34l20-8" stroke="#ffd54a" stroke-width="5"/><circle cx="30" cy="8" r="7" fill="#ffd54a" stroke="#111114" stroke-width="2.5"/><path d="M6 76h48" stroke="#111114" stroke-width="3"/>' },
    { id: 'corbatin-dorado', slot: 'neck', name: 'Corbatín dorado', excl: 'evento', ev: 'anio', price: 140, w: 34, t: 82, vb: '0 0 80 44',
      svg: '<path d="M40 22L6 4c-5 6-5 30 0 36z" fill="#ffd54a" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M40 22L74 4c5 6 5 30 0 36z" fill="#ffd54a" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><rect x="32" y="13" width="16" height="18" rx="5" fill="#f2b630" stroke="#111114" stroke-width="3"/><path d="M12 12l6 4M66 12l-6 4" stroke="#fff6c8" stroke-width="3" stroke-linecap="round"/>' },
    { id: 'corona-papel', slot: 'head', name: 'Corona de papel', excl: 'evento', ev: 'reyes', gift: true, w: 58, b: 86, vb: '0 0 100 60',
      svg: '<path d="M6 54V14l15 18 14-24 15 24 15-24 14 24 15-18v40z" fill="#ffd54a" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M6 46h88" stroke="#f2b630" stroke-width="5"/><circle cx="21" cy="40" r="3.5" fill="#e2483d"/><circle cx="50" cy="40" r="3.5" fill="#7cc35a"/><circle cx="79" cy="40" r="3.5" fill="#7a6bb3"/>' },
    { id: 'capa-real', slot: 'neck', name: 'Capa de rey mago', excl: 'evento', ev: 'reyes', price: 160, w: 96, t: 64, vb: '0 0 140 70',
      svg: '<path d="M10 8c30 30 90 30 120 0l6 50c-40 16-92 16-132 0z" fill="#7a6bb3" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M10 8c30 30 90 30 120 0" fill="none" stroke="#fffdf7" stroke-width="12" stroke-linecap="round"/><path d="M10 8c30 30 90 30 120 0" fill="none" stroke="#111114" stroke-width="1.5" stroke-dasharray="2 10"/><path transform="translate(60 30) scale(.8)" d="' + STAR_P + '" fill="#ffd54a"/>' },
    { id: 'sombrero-palma', slot: 'head', name: 'Sombrero de palma', excl: 'evento', ev: 'candelaria', gift: true, w: 108, b: 72, vb: '0 0 160 70',
      svg: '<ellipse cx="80" cy="54" rx="76" ry="13" fill="#e8c77a" stroke="#111114" stroke-width="3"/><path d="M42 54c0-30 14-46 38-46s38 16 38 46z" fill="#e8c77a" stroke="#111114" stroke-width="3"/><path d="M44 42h72" stroke="#c0392b" stroke-width="6"/><path d="M50 20l60 30M110 20L50 50M30 52l100 6" stroke="#c9a65a" stroke-width="2" opacity=".8"/>' },
    { id: 'rebozo', slot: 'neck', name: 'Rebozo', excl: 'evento', ev: 'candelaria', price: 140, w: 94, t: 68, vb: '0 0 140 76',
      svg: '<path d="M8 10c30 26 94 26 124 0" fill="none" stroke="#111114" stroke-width="22" stroke-linecap="round"/><path d="M8 10c30 26 94 26 124 0" fill="none" stroke="#c0396b" stroke-width="16" stroke-linecap="round"/><path d="M8 10c30 26 94 26 124 0" fill="none" stroke="#7a6bb3" stroke-width="4" stroke-dasharray="6 6"/><path d="M98 26l8 42h18l-6-44z" fill="#c0396b" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M106 68v7M112 68v7M118 68v7M124 68v7" stroke="#111114" stroke-width="2.5"/>' },
    { id: 'diadema-corazon', slot: 'head', name: 'Diadema de corazones', excl: 'evento', ev: 'amor', gift: true, w: 86, b: 76, vb: '0 0 120 76',
      svg: '<path d="M8 72c0-30 22-48 52-48s52 18 52 48" fill="none" stroke="#111114" stroke-width="9" stroke-linecap="round"/><path d="M8 72c0-30 22-48 52-48s52 18 52 48" fill="none" stroke="#ff5f86" stroke-width="5" stroke-linecap="round"/><path d="M38 28q-6-10 0-20M82 28q6-10 0-20" stroke="#111114" stroke-width="2.5" fill="none"/><path transform="translate(26 -6) scale(1)" d="' + HEART_PATH + '" fill="#ff5f86" stroke="#111114" stroke-width="1.2"/><path transform="translate(72 -6) scale(1)" d="' + HEART_PATH + '" fill="#ff5f86" stroke="#111114" stroke-width="1.2"/>' },
    { id: 'collar-corazon', slot: 'neck', name: 'Collar de corazón', excl: 'evento', ev: 'amor', price: 150, w: 54, t: 76, vb: '0 0 100 64',
      svg: '<path d="M6 6q44 38 88 0" fill="none" stroke="#ffd54a" stroke-width="4" stroke-dasharray="1 5" stroke-linecap="round"/><path d="M6 6q44 38 88 0" fill="none" stroke="#c9a03a" stroke-width="1.5"/><path transform="translate(36 26) scale(1.15)" d="' + HEART_PATH + '" fill="#e2483d" stroke="#111114" stroke-width="1.4"/><path d="M44 34q3-4 7-4" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>' },
    { id: 'gorra-helice', slot: 'head', name: 'Gorrito de hélice', excl: 'evento', ev: 'nino', gift: true, w: 66, b: 82, vb: '0 0 100 82',
      svg: '<path d="M8 76c0-28 18-44 42-44s42 16 42 44z" fill="#7cc8ff" stroke="#111114" stroke-width="3"/><path d="M50 32v44M22 46c8 10 8 22 6 30M78 46c-8 10-8 22-6 30" stroke="#111114" stroke-width="2"/><path d="M28 34c4 10 4 26 2 42" fill="#ffd54a" opacity=".0"/><path d="M50 32c-12 2-14 20-22 44h44c-8-24-10-42-22-44z" fill="#ffd54a" opacity=".55"/><path d="M50 30V16" stroke="#111114" stroke-width="3"/><path d="M50 14c-16-8-34-6-40 0 6 6 24 8 40 0zM50 14c16-8 34-6 40 0-6 6-24 8-40 0z" fill="#ff5f86" stroke="#111114" stroke-width="2.5"/><circle cx="50" cy="14" r="4" fill="#ffd54a" stroke="#111114" stroke-width="2"/>' },
    { id: 'lentes-juguete', slot: 'face', name: 'Lentes de juguete', excl: 'evento', ev: 'nino', price: 120, vb: '54 66 94 48',
      svg: '<rect x="60" y="74" width="38" height="32" rx="10" fill="rgba(255,255,255,.15)" stroke="#ff5f86" stroke-width="6"/><rect x="104" y="74" width="38" height="32" rx="10" fill="rgba(255,255,255,.15)" stroke="#7cc8ff" stroke-width="6"/><path d="M98 86h6" stroke="#ffd54a" stroke-width="6"/><circle cx="66" cy="80" r="3" fill="#ffd54a"/><circle cx="136" cy="80" r="3" fill="#ffd54a"/>' },
    { id: 'flor-clavel', slot: 'head', name: 'Flor de clavel', excl: 'evento', ev: 'madres', gift: true, w: 34, b: 74, x: 26, vb: '0 0 60 60',
      svg: '<path d="M30 40l-14 16M30 40l12 16" stroke="#3f9a63" stroke-width="5" stroke-linecap="round"/><ellipse cx="18" cy="50" rx="8" ry="4" fill="#7cc35a" stroke="#111114" stroke-width="1.5" transform="rotate(-30 18 50)"/><g stroke="#111114" stroke-width="1.8">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (k) { var a = k / 8 * Math.PI * 2; return '<circle cx="' + (30 + Math.cos(a) * 12).toFixed(1) + '" cy="' + (28 + Math.sin(a) * 12).toFixed(1) + '" r="9" fill="' + (k % 2 ? '#e2483d' : '#ff5f86') + '"/>'; }).join('') + '</g><circle cx="30" cy="28" r="9" fill="#c0392b" stroke="#111114" stroke-width="1.8"/>' },
    { id: 'mono-rosa', slot: 'neck', name: 'Moño rosa', excl: 'evento', ev: 'madres', price: 130, w: 36, t: 82, vb: '0 0 80 44',
      svg: '<path d="M40 22L6 4c-5 6-5 30 0 36z" fill="#ff8fa8" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M40 22L74 4c5 6 5 30 0 36z" fill="#ff8fa8" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><rect x="32" y="13" width="16" height="18" rx="5" fill="#ff5f86" stroke="#111114" stroke-width="3"/><g fill="#fff"><circle cx="16" cy="14" r="3"/><circle cx="14" cy="28" r="3"/><circle cx="24" cy="22" r="2.5"/><circle cx="64" cy="14" r="3"/><circle cx="66" cy="28" r="3"/><circle cx="56" cy="22" r="2.5"/></g>' },
    { id: 'corbata', slot: 'neck', name: 'Corbata de papá', excl: 'evento', ev: 'padre', gift: true, w: 22, t: 78, vb: '0 0 40 90',
      svg: '<path d="M12 4h16l-3 12h-10z" fill="#2c5585" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M15 16h10l8 54-13 16-13-16z" fill="#3a6ea5" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M12 34l18 10M10 52l20 10M14 70l10 6" stroke="#7cc8ff" stroke-width="3"/>' },
    { id: 'lentes-papa', slot: 'face', name: 'Lentes de papá', excl: 'evento', ev: 'padre', price: 120, vb: '54 70 94 40',
      svg: '<rect x="60" y="76" width="38" height="26" rx="5" fill="rgba(200,235,255,0.2)" stroke="#6b3e22" stroke-width="5"/><rect x="104" y="76" width="38" height="26" rx="5" fill="rgba(200,235,255,0.2)" stroke="#6b3e22" stroke-width="5"/><path d="M98 84h6" stroke="#6b3e22" stroke-width="5"/><path d="M60 80l-5-2M142 80l5-2" stroke="#6b3e22" stroke-width="5" stroke-linecap="round"/>' },
    { id: 'sombrero-patrio', slot: 'head', name: 'Sombrero patrio', excl: 'evento', ev: 'patrias', gift: true, w: 128, b: 62, vb: '0 0 200 90',
      svg: '<path d="M6 70c20-22 60-20 94-18s74-4 94 18c-30 18-158 18-188 0z" fill="#3b2a1e" stroke="#111114" stroke-width="3"/><path d="M14 70c26-12 146-12 172 0" stroke="#ffd54a" stroke-width="3" fill="none" stroke-dasharray="6 5"/><path d="M64 58c0-34 14-52 36-52s36 18 36 52z" fill="#3b2a1e" stroke="#111114" stroke-width="3"/><path d="M66 50h23" stroke="#1f8a4c" stroke-width="8"/><path d="M89 50h22" stroke="#fffdf7" stroke-width="8"/><path d="M111 50h23" stroke="#d6303a" stroke-width="8"/><path d="M80 30q20-10 40 0" stroke="#ffd54a" stroke-width="2.5" fill="none"/>' },
    { id: 'mono-tricolor', slot: 'neck', name: 'Moño tricolor', excl: 'evento', ev: 'patrias', price: 140, w: 38, t: 82, vb: '0 0 80 44',
      svg: '<path d="M40 22L6 4c-5 6-5 30 0 36z" fill="#1f8a4c" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M40 22L74 4c5 6 5 30 0 36z" fill="#d6303a" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><rect x="32" y="13" width="16" height="18" rx="5" fill="#fffdf7" stroke="#111114" stroke-width="3"/>' },
    { id: 'corona-cempasuchil', slot: 'head', name: 'Corona de cempasúchil', excl: 'evento', ev: 'muertos', gift: true, w: 96, b: 74, vb: '0 0 140 54',
      svg: (function () { var h = ''; for (var i = 0; i <= 9; i++) { var t = i / 9, x = 10 + t * 120, y = 42 - Math.sin(t * Math.PI) * 28; h += '<g stroke="#b5591b" stroke-width="1.2">'; for (var k = 0; k < 8; k++) { var a = k / 8 * Math.PI * 2; h += '<circle cx="' + (x + Math.cos(a) * 6).toFixed(1) + '" cy="' + (y + Math.sin(a) * 6).toFixed(1) + '" r="4.6" fill="' + (k % 2 ? '#ff8a1f' : '#ffb02e') + '"/>'; } h += '</g><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4" fill="#e06a10"/>'; } return h; })() },
    { id: 'catrina', slot: 'face', name: 'Maquillaje de catrina', excl: 'evento', ev: 'muertos', price: 160, vb: '50 60 102 84',
      svg: '<g fill="none" stroke-width="3"><circle cx="80" cy="90" r="20" stroke="#ff8a1f"/><circle cx="122" cy="90" r="20" stroke="#c8a8ff"/></g>' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (k) { var a = k / 8 * Math.PI * 2; return '<circle cx="' + (80 + Math.cos(a) * 24).toFixed(1) + '" cy="' + (90 + Math.sin(a) * 24).toFixed(1) + '" r="3" fill="#ff5f86"/><circle cx="' + (122 + Math.cos(a) * 24).toFixed(1) + '" cy="' + (90 + Math.sin(a) * 24).toFixed(1) + '" r="3" fill="#7cc8ff"/>'; }).join('') + '<path d="M96 104l5 8 5-8z" fill="#111114"/><path d="M84 132h34M88 127v10M95 127v10M102 127v10M109 127v10M116 127v10" stroke="#111114" stroke-width="2.4" stroke-linecap="round"/>' },
    { id: 'gorro-navidad', slot: 'head', name: 'Gorro navideño', excl: 'evento', ev: 'navidad', gift: true, w: 72, b: 80, vb: '0 0 110 90',
      svg: '<path d="M14 70C18 30 40 8 70 10c18 2 28 14 30 30l-14 6C82 30 74 26 66 28 50 34 46 54 46 70z" fill="#d6303a" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><circle cx="96" cy="48" r="10" fill="#fffdf7" stroke="#111114" stroke-width="3"/><rect x="6" y="64" width="72" height="20" rx="10" fill="#fffdf7" stroke="#111114" stroke-width="3"/>' },
    { id: 'bufanda-navidad', slot: 'neck', name: 'Bufanda navideña', excl: 'evento', ev: 'navidad', price: 140, w: 88, t: 70, vb: '0 0 140 76',
      svg: '<path d="M8 10c30 26 94 26 124 0" fill="none" stroke="#111114" stroke-width="22" stroke-linecap="round"/><path d="M8 10c30 26 94 26 124 0" fill="none" stroke="#1f8a4c" stroke-width="16" stroke-linecap="round"/><path d="M8 10c30 26 94 26 124 0" fill="none" stroke="#d6303a" stroke-width="16" stroke-dasharray="10 10"/><path d="M98 26l10 44h16l-6-46z" fill="#d6303a" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M101 40h18M104 54h18" stroke="#1f8a4c" stroke-width="6"/>' },
    { id: 'aura-nieve', slot: 'aura', name: 'Aura de nieve', excl: 'evento', ev: 'navidad', price: 180, vb: '0 0 60 60',
      svg: '<g stroke="#bfe8ff" stroke-width="2.4" stroke-linecap="round"><path d="M18 8v16M10 16h16M12 10l12 12M24 10L12 22"/><path d="M44 30v12M38 36h12M40 32l8 8M48 32l-8 8"/><path d="M16 42v10M11 47h10"/></g>' },
    { id: 'gorrito-hoshi', slot: 'head', name: 'Gorrito de aniversario', excl: 'evento', ev: 'aniversario', gift: true, w: 42, b: 88, vb: '0 0 60 88',
      svg: '<path d="M30 14L6 80h48z" fill="#111114" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M18 50l24-6M12 66l36-8" stroke="#bfe8cc" stroke-width="5"/><path d="M24 30l12-3" stroke="#bfe8cc" stroke-width="4"/><path transform="translate(18 -2) scale(1)" d="' + STAR_P + '" fill="#ffd54a" stroke="#111114" stroke-width="1.5"/>' },
    { id: 'aura-confeti', slot: 'aura', name: 'Aura de confeti', excl: 'evento', ev: 'aniversario', price: 200, vb: '0 0 60 60',
      svg: '<g><rect x="8" y="10" width="6" height="10" rx="1" fill="#bfe8cc" transform="rotate(20 11 15)"/><rect x="40" y="8" width="6" height="10" rx="1" fill="#ffd54a" transform="rotate(-30 43 13)"/><rect x="46" y="38" width="6" height="10" rx="1" fill="#ff8a5c" transform="rotate(40 49 43)"/><rect x="10" y="40" width="6" height="10" rx="1" fill="#ff8fa8" transform="rotate(-15 13 45)"/><circle cx="30" cy="6" r="3" fill="#7cc8ff"/><circle cx="28" cy="52" r="3" fill="#ffd54a"/></g>' }
  );

  // Comida de temporada (solo en la tienda durante esos días; la que ya compraste se queda en la nevera).
  FOODS.push(
    { id: 'uvas', name: '12 uvas', ev: 'anio', price: 10, hunger: 10, happy: 14, energy: 0, msg: '¡12 uvas, 12 deseos!',
      svg: '<path d="M20 4v6" stroke="#3f9a63" stroke-width="2.5"/><ellipse cx="25" cy="7" rx="5" ry="2.5" fill="#7cc35a"/><g fill="#8e5bb8" stroke="#111114" stroke-width="1.2"><circle cx="14" cy="14" r="5"/><circle cx="24" cy="14" r="5"/><circle cx="19" cy="21" r="5"/><circle cx="10" cy="22" r="4.5"/><circle cx="28" cy="22" r="4.5"/><circle cx="14" cy="29" r="4.5"/><circle cx="24" cy="29" r="4.5"/><circle cx="19" cy="35" r="4"/></g><circle cx="12" cy="12" r="1.4" fill="#fff" opacity=".6"/>' },
    { id: 'rosca', name: 'Rosca de reyes', ev: 'reyes', price: 18, hunger: 30, happy: 12, energy: 0, msg: '¡Me tocó el muñequito! Ahora pongo los tamales.',
      svg: '<ellipse cx="20" cy="22" rx="18" ry="13" fill="#e2a55c" stroke="#111114" stroke-width="1.6"/><ellipse cx="20" cy="22" rx="8" ry="5" fill="#3a2a20"/><path d="M6 18q14-10 28 0" stroke="#f3d9a6" stroke-width="4" fill="none"/><g stroke="#111114" stroke-width="1"><rect x="8" y="16" width="6" height="3" rx="1" fill="#e2483d"/><rect x="18" y="11" width="6" height="3" rx="1" fill="#7cc35a"/><rect x="27" y="16" width="6" height="3" rx="1" fill="#ffd54a"/></g>' },
    { id: 'tamal', name: 'Tamal', ev: 'candelaria', price: 12, hunger: 32, happy: 6, energy: 2, msg: '¡Tamalito calientito!',
      svg: '<path d="M6 30C4 18 12 6 20 4c8 2 16 14 14 26-6 6-22 6-28 0z" fill="#d9c27a" stroke="#111114" stroke-width="1.6"/><path d="M12 28c0-8 4-16 8-18 4 2 8 10 8 18" fill="#f3d9a6" stroke="#111114" stroke-width="1.2"/><path d="M16 22h8" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>' },
    { id: 'fresas-choco', name: 'Fresas con chocolate', ev: 'amor', price: 14, hunger: 14, happy: 16, energy: 0, msg: 'Mmm… sabe a amor.',
      svg: '<g stroke="#111114" stroke-width="1.4"><path d="M8 14c6-4 12 2 10 10-2 6-6 10-8 10-4-4-6-14-2-20z" fill="#e2483d"/><path d="M22 10c6-4 12 2 10 10-2 6-6 10-8 10-4-4-6-14-2-20z" fill="#e2483d"/></g><path d="M9 24c3 2 6 1 8-1l-1 6c-2 3-4 4-6 4-1-3-1-6-1-9zM23 20c3 2 6 1 8-1l-1 6c-2 3-4 4-6 4-1-3-1-6-1-9z" fill="#5a3320"/><path d="M10 13l3-4 3 4M24 9l3-4 3 4" stroke="#3f9a63" stroke-width="2.4" fill="none" stroke-linecap="round"/>' },
    { id: 'algodon', name: 'Algodón de azúcar', ev: 'nino', price: 10, hunger: 6, happy: 18, energy: 4, msg: '¡Es como comer una nube!',
      svg: '<path d="M20 22l2 16" stroke="#e6dfd2" stroke-width="3" stroke-linecap="round"/><g fill="#ffb3c4" stroke="#111114" stroke-width="1.3"><circle cx="13" cy="15" r="8"/><circle cx="26" cy="13" r="8"/><circle cx="20" cy="8" r="7"/><circle cx="20" cy="19" r="8"/></g><circle cx="16" cy="11" r="2" fill="#fff" opacity=".6"/>' },
    { id: 'pastel', name: 'Pastel', ev: 'madres', price: 20, hunger: 26, happy: 16, energy: 0, msg: '¡Un pastel para mamá… y una probadita para mí!',
      svg: '<rect x="6" y="18" width="28" height="16" rx="3" fill="#fff6dc" stroke="#111114" stroke-width="1.6"/><path d="M6 22c4 4 8 0 10 3s6 0 8 3 6-1 10 0v-6H6z" fill="#ff8fa8"/><rect x="10" y="8" width="20" height="11" rx="3" fill="#fff6dc" stroke="#111114" stroke-width="1.6"/><circle cx="20" cy="6" r="3.5" fill="#e2483d" stroke="#111114" stroke-width="1.2"/>' },
    { id: 'carne-asada', name: 'Carne asada', ev: 'padre', price: 22, hunger: 40, happy: 10, energy: 4, msg: '¡Ya está la carnita, papá!',
      svg: '<ellipse cx="20" cy="24" rx="17" ry="9" fill="#e6dfd2" stroke="#111114" stroke-width="1.4"/><path d="M8 20c4-6 18-8 24-2 2 4-2 8-10 9-8 1-16-2-14-7z" fill="#8b3d22" stroke="#111114" stroke-width="1.4"/><path d="M12 19l14-2M13 23l14-2" stroke="#4a1d0e" stroke-width="1.6"/><circle cx="31" cy="25" r="3" fill="#7cc35a" stroke="#111114" stroke-width="1"/>' },
    { id: 'pozole', name: 'Pozole', ev: 'patrias', price: 20, hunger: 38, happy: 10, energy: 4, msg: '¡Pozolito! ¡Viva México!',
      svg: '<path d="M4 18h32c0 10-7 17-16 17S4 28 4 18z" fill="#c97a4a" stroke="#111114" stroke-width="1.6"/><ellipse cx="20" cy="18" rx="16" ry="5" fill="#d6303a" stroke="#111114" stroke-width="1.4"/><g fill="#fffdf7"><circle cx="13" cy="17" r="2"/><circle cx="18" cy="19" r="2"/><circle cx="24" cy="17" r="2"/></g><path d="M26 15h6" stroke="#7cc35a" stroke-width="3" stroke-linecap="round"/><path d="M14 10c-2-3 2-4 0-7M22 10c-2-3 2-4 0-7" stroke="#fff" stroke-width="1.6" fill="none" opacity=".6"/>' },
    { id: 'pan-muerto', name: 'Pan de muerto', ev: 'muertos', price: 16, hunger: 28, happy: 10, energy: 2, msg: 'Pan de muerto con azúcar. ¡Delicioso!',
      svg: '<path d="M4 30c0-12 7-20 16-20s16 8 16 20z" fill="#e2a55c" stroke="#111114" stroke-width="1.6"/><path d="M8 26c4-6 8 4 12-2s8 4 12-2" stroke="#b07a3a" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="20" cy="12" r="4" fill="#d18e45" stroke="#111114" stroke-width="1.3"/><g fill="#fff" opacity=".8"><circle cx="12" cy="20" r="1"/><circle cx="26" cy="18" r="1"/><circle cx="18" cy="22" r="1"/><circle cx="30" cy="25" r="1"/></g>' },
    { id: 'bunuelo', name: 'Buñuelo', ev: 'navidad', price: 12, hunger: 18, happy: 10, energy: 2, msg: '¡Crujiente y con piloncillo!',
      svg: '<circle cx="20" cy="21" r="16" fill="#e8c77a" stroke="#111114" stroke-width="1.6"/><path d="M8 18q12 8 24 0M10 26q10 6 20 0" stroke="#c9a65a" stroke-width="2" fill="none"/><path d="M12 14c6-2 12-2 16 2" stroke="#7a4a1a" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/>' },
    { id: 'ponche', name: 'Ponche', ev: 'navidad', price: 10, hunger: 4, happy: 10, energy: 8, msg: 'Ponche calientito de frutas.',
      svg: '<path d="M8 12h22v16a6 6 0 01-6 6H14a6 6 0 01-6-6z" fill="#c9733a" stroke="#111114" stroke-width="1.6"/><path d="M30 16c5 0 5 9 0 9" stroke="#111114" stroke-width="2" fill="none"/><ellipse cx="19" cy="13" rx="10" ry="2.5" fill="#e6a35a"/><circle cx="15" cy="13" r="2" fill="#ffd54a"/><path d="M14 8c-2-3 2-4 0-6M22 8c-2-3 2-4 0-6" stroke="#fff" stroke-width="1.5" fill="none" opacity=".6"/>' },
    { id: 'rollo-aniv', name: 'Rollo de aniversario', ev: 'aniversario', price: 25, hunger: 35, happy: 20, energy: 4, msg: '¡El rollo especial de aniversario!',
      svg: '<circle cx="20" cy="20" r="18" fill="#ffd54a" stroke="#b8860b" stroke-width="2"/><circle cx="20" cy="20" r="13" fill="#fff"/><circle cx="16" cy="17" r="4.5" fill="#ff8a5c"/><circle cx="24" cy="23" r="4" fill="#8fd060"/><circle cx="23" cy="14" r="2.3" fill="#e2483d"/>' }
  );

  // --- Calendario ---
  function evDay(y, m, d) { return new Date(y, m - 1, d); }
  function evRange(e, y) {
    if (e.from === 'padre') { var j = evDay(y, 6, 1), first = (7 - j.getDay()) % 7 + 1, sun = evDay(y, 6, first + 14); return [new Date(y, 5, sun.getDate() - 4), sun]; }
    if (e.from === 'aniv') { if (!ANIVERSARIO || !ANIVERSARIO.mes) return null; var c = evDay(y, ANIVERSARIO.mes, ANIVERSARIO.dia); return [new Date(y, c.getMonth(), c.getDate() - 3), new Date(y, c.getMonth(), c.getDate() + 3)]; }
    var s = evDay(y, e.from[0], e.from[1]), t = evDay(e.to[0] < e.from[0] ? y + 1 : y, e.to[0], e.to[1]);
    return [s, t];
  }
  var EV_FORCE = cfg.forceEvent || null;
  function eventAt(date) {
    date = date || new Date();
    var d = new Date(date.getFullYear(), date.getMonth(), date.getDate()), best = null;
    if (EV_FORCE) { var f = EVENTS.filter(function (e) { return e.id === EV_FORCE; })[0]; if (f) { var r0 = evRange(f, d.getFullYear()) || [d, d]; return { e: f, start: r0[0], end: r0[1], key: f.id + '-' + r0[0].getFullYear() }; } }
    [d.getFullYear() - 1, d.getFullYear()].forEach(function (y) {
      EVENTS.forEach(function (e) {
        var r = evRange(e, y); if (!r || d < r[0] || d > r[1]) return;
        if (!best || e.id === 'aniversario') best = { e: e, start: r[0], end: r[1], key: e.id + '-' + r[0].getFullYear() };
      });
    });
    return best;
  }
  var MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fmtDay(d) { return d.getDate() + ' ' + MES[d.getMonth()]; }
  function evById(id) { for (var i = 0; i < EVENTS.length; i++) if (EVENTS[i].id === id) return EVENTS[i]; return null; }
  MISSIONS.push({ id: 'palabra', text: 'Juega la Palabra del día', ev: 'play:palabra', goal: 1, coins: 20 });
  // ===================== COLABORACIONES =====================
  // Colecciones "crossover" con marcas inventadas para Hoshito. Cada prenda se gana cumpliendo un reto.
  function px(rows, pal, s) {
    var h = '<g shape-rendering="crispEdges">';
    rows.forEach(function (r, y) { for (var x = 0; x < r.length; x++) { var c = pal[r[x]]; if (c) h += '<rect x="' + x * s + '" y="' + y * s + '" width="' + (s + 0.2) + '" height="' + (s + 0.2) + '" fill="' + c + '"/>'; } });
    return h + '</g>';
  }
  var COLABS = [
    { id: 'pixel', name: 'Pixelandia', tag: 'Colab Pixelandia', color: '#3fc1c9', text: 'Hoshito entra a un mundo de 8 bits.',
      logo: px(['..aaaa..', '.abbbba.', 'abcbbcba', 'abbbbbba', 'abbccbba', '.abbbba.', '..aaaa..'], { a: '#111114', b: '#3fc1c9', c: '#fffdf7' }, 3) },
    { id: 'heroes', name: 'Liga Wasabi', tag: 'Colab Liga Wasabi', color: '#e2483d', text: 'El escuadrón de héroes de la cocina.',
      logo: '<path d="M12 1l9 4v6c0 6-4 10-9 12-5-2-9-6-9-12V5z" fill="#e2483d" stroke="#111114" stroke-width="1.5"/><circle cx="12" cy="11" r="5" fill="#111114"/><circle cx="12" cy="11" r="3.2" fill="#fffdf7"/><circle cx="11" cy="10.5" r="1.3" fill="#8fd060"/>' },
    { id: 'neo', name: 'Neo Sakura', tag: 'Colab Neo Sakura', color: '#ff8fc8', text: 'Estilo anime directo desde Neo Sakura.',
      logo: '<g fill="#ff8fc8" stroke="#111114" stroke-width="1">' + [0, 1, 2, 3, 4].map(function (k) { var a = k / 5 * Math.PI * 2 - Math.PI / 2; return '<ellipse cx="' + (12 + Math.cos(a) * 5.5).toFixed(1) + '" cy="' + (12 + Math.sin(a) * 5.5).toFixed(1) + '" rx="3.6" ry="4.6" transform="rotate(' + (k * 72) + ' ' + (12 + Math.cos(a) * 5.5).toFixed(1) + ' ' + (12 + Math.sin(a) * 5.5).toFixed(1) + ')"/>'; }).join('') + '</g><circle cx="12" cy="12" r="2.4" fill="#ffd54a"/>' }
  ];
  function colabById(id) { for (var i = 0; i < COLABS.length; i++) if (COLABS[i].id === id) return COLABS[i]; return null; }
  // goal(): [valor actual, meta, texto]
  ITEMS.push(
    { id: 'gorro-8bits', slot: 'head', name: 'Gorro de 8 bits', excl: 'colab', colab: 'pixel', w: 64, b: 82, vb: '0 0 48 36',
      svg: px(['....aaaaaaaa....', '...abbbbbbbba...', '..abbccbbccbba..', '.abbbbbbbbbbbba.', '.abccbbccbbccba.', 'aaaaaaaaaaaaaaaa', 'adddddddddddddda', 'aaaaaaaaaaaaaaaa'], { a: '#111114', b: '#3fc1c9', c: '#a6f0f2', d: '#ff6fa8' }, 3)
        + '<g transform="translate(18 -6)">' + px(['.aa.', 'abba', '.aa.'], { a: '#111114', b: '#ffd54a' }, 3) + '</g>',
      goal: function () { return [S.best.run || 0, 300, 'Corre 300 m en Hoshito corre']; } },
    { id: 'corona-8bits', slot: 'head', name: 'Corona de 8 bits', excl: 'colab', colab: 'pixel', w: 54, b: 86, vb: '0 0 48 24',
      svg: px(['a......a......a.', 'ab....aba....ba.', 'abb..abbba..bba.', 'abbbabbcbbabbba.', 'abbbbbbbbbbbbba.', 'abcbbbbdbbbbcba.', 'abbbbbbbbbbbbba.', 'aaaaaaaaaaaaaaa.'], { a: '#111114', b: '#ffd54a', c: '#3fc1c9', d: '#ff6fa8' }, 3),
      goal: function () { return [S.best.fly || 0, 25, 'Pasa 25 palillos en Hoshito vuela']; } },
    { id: 'aura-pixeles', slot: 'aura', name: 'Aura de píxeles', excl: 'colab', colab: 'pixel', vb: '0 0 60 60',
      svg: '<g shape-rendering="crispEdges"><rect x="8" y="10" width="8" height="8" fill="#3fc1c9"/><rect x="42" y="6" width="6" height="6" fill="#ff6fa8"/><rect x="46" y="40" width="8" height="8" fill="#ffd54a"/><rect x="6" y="42" width="6" height="6" fill="#a6f0f2"/><rect x="26" y="50" width="5" height="5" fill="#ff6fa8"/></g>',
      goal: function () { return [S.plays || 0, 50, 'Juega 50 minijuegos']; } },
    { id: 'capa-heroe', slot: 'neck', name: 'Capa de héroe', excl: 'colab', colab: 'heroes', w: 100, t: 62, vb: '0 0 140 80',
      svg: '<path d="M14 6c26 24 86 24 112 0l10 64c-36 14-96 14-132 0z" fill="#e2483d" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M14 6c26 24 86 24 112 0" fill="none" stroke="#b8352c" stroke-width="8" stroke-linecap="round"/><path d="M70 26l14 6v8c0 8-6 13-14 16-8-3-14-8-14-16v-8z" fill="#ffd54a" stroke="#111114" stroke-width="2.5"/><circle cx="70" cy="40" r="6" fill="#111114"/><circle cx="70" cy="40" r="3.6" fill="#fffdf7"/><circle cx="69" cy="39.5" r="1.6" fill="#8fd060"/>',
      goal: function () { return [S.level, 8, 'Llega al nivel 8']; } },
    { id: 'casco-wasabi', slot: 'head', name: 'Casco del Capitán Wasabi', excl: 'colab', colab: 'heroes', w: 76, b: 74, vb: '0 0 110 80',
      svg: '<path d="M8 76c0-38 20-60 47-60s47 22 47 60H86c0-22-12-36-31-36S24 54 24 76z" fill="#6aa82c" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M55 16V2l10 10z" fill="#e2483d" stroke="#111114" stroke-width="2.5" stroke-linejoin="round"/><path d="M30 34q25-16 50 0" stroke="#c8ec6a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M44 30l11-4 11 4v6c0 6-5 9-11 11-6-2-11-5-11-11z" fill="#ffd54a" stroke="#111114" stroke-width="2"/><circle cx="55" cy="36" r="3" fill="#6aa82c"/>',
      goal: function () { return [S.best['catch'] || 0, 40, 'Atrapa 40 rollos en una partida']; } },
    { id: 'visor-heroe', slot: 'face', name: 'Visor de héroe', excl: 'colab', colab: 'heroes', vb: '50 70 102 38',
      svg: '<path d="M54 82c14-8 80-8 94 0l-4 16c-10 6-30 6-36-2-4-4-10-4-14 0-6 8-26 8-36 2z" fill="rgba(80,200,255,.55)" stroke="#111114" stroke-width="3.5" stroke-linejoin="round"/><path d="M64 84q14-4 26-2M112 82q14-2 26 2" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>',
      goal: function () { return [S.best.simon || 0, 10, 'Repite 10 rondas en Hoshi dice']; } },
    { id: 'chongos', slot: 'head', name: 'Chongos de Neo Sakura', excl: 'colab', colab: 'neo', w: 104, b: 70, vb: '0 0 150 64',
      svg: '<g stroke="#111114" stroke-width="3"><circle cx="24" cy="34" r="22" fill="#ff8fc8"/><circle cx="126" cy="34" r="22" fill="#ff8fc8"/></g><path d="M12 30q12-12 26-4M114 26q14-8 26 4" stroke="#ffc2e0" stroke-width="4" fill="none" stroke-linecap="round"/><path transform="translate(30 6) scale(.8)" d="' + STAR_P + '" fill="#ffd54a" stroke="#111114" stroke-width="1.6"/><path transform="translate(100 6) scale(.8)" d="' + STAR_P + '" fill="#ffd54a" stroke="#111114" stroke-width="1.6"/>',
      goal: function () { return [(S.palStats && S.palStats.won) || 0, 10, 'Adivina 10 Palabras del día']; } },
    { id: 'orejas-kitsune', slot: 'head', name: 'Orejas de kitsune', excl: 'colab', colab: 'neo', w: 90, b: 84, vb: '0 0 120 64',
      svg: '<path d="M8 62L14 4l34 40z" fill="#fffdf7" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M112 62L106 4 72 44z" fill="#fffdf7" stroke="#111114" stroke-width="3" stroke-linejoin="round"/><path d="M17 50l3-34 18 22z" fill="#ff8fc8"/><path d="M103 50l-3-34-18 22z" fill="#ff8fc8"/><path d="M14 4l6 14M106 4l-6 14" stroke="#e2483d" stroke-width="5" stroke-linecap="round"/>',
      goal: function () { return [S.best.chef || 0, 12, 'Prepara 12 órdenes en Arma el rollo']; } },
    { id: 'ojos-brillo', slot: 'face', name: 'Ojos brillosos', excl: 'colab', colab: 'neo', vb: '58 68 86 44',
      svg: '<g fill="none" stroke-width="3.5"><circle cx="80" cy="90" r="17" stroke="#ff8fc8"/><circle cx="122" cy="90" r="17" stroke="#ff8fc8"/></g><g fill="#fff" stroke="#ff8fc8" stroke-width="1.2"><path transform="translate(64 72) scale(.6)" d="' + STAR_P + '"/><path transform="translate(106 72) scale(.6)" d="' + STAR_P + '"/></g><g fill="#fff"><circle cx="88" cy="99" r="3.2"/><circle cx="130" cy="99" r="3.2"/></g>',
      goal: function () { var b = S.best.memo; return [b == null ? 0 : (b <= 12 ? 1 : 0), 1, 'Termina el Memorama en 12 movimientos o menos' + (b != null ? ' (tu récord: ' + b + ')' : '')]; } },
    { id: 'aura-energia', slot: 'aura', name: 'Aura de energía', excl: 'colab', colab: 'neo', vb: '0 0 60 60',
      svg: '<path d="M30 4c6 10 2 14 8 20s14 2 10 16c-3 10-10 16-18 16s-15-6-18-16C8 26 16 30 22 24s2-10 8-20z" fill="rgba(140,120,255,.35)" stroke="#8c78ff" stroke-width="2.5"/><path d="M30 18c3 6 1 9 5 13s7 2 5 10c-2 6-6 9-10 9s-8-3-10-9c-2-8 2-6 5-10s2-7 5-13z" fill="#7cf2ff" opacity=".6"/>',
      goal: function () { return [S.saludos || 0, 15, 'Saluda 15 veces a Hoshitos de amigos']; } }
  );
  // ===================== ESTADO =====================
  var KEY = 'hoshito-mascota-v1';
  var DUR = { hi: 2600, pet: 2600, feed: 2600, wink: 2600, jump: 1900, spin: 1900, sleep: 3900, surprise: 2300, dizzy: 3100,
    sad: 3100, angry: 2700, dance: 2700, sneeze: 2700, love: 2900, spicy: 3100, cold: 3000, party: 2800, think: 3100, star: 2900 };
  var TAP = ['hi', 'pet', 'wink', 'jump', 'spin', 'love', 'dance', 'surprise', 'star'];
  var ROOMS = { cocina: 'Cocina', juegos: 'Sala de juegos', jardin: 'Jardín', bano: 'Baño', recamara: 'Recámara', closet: 'Closet' };
  var IDLE = {
    cocina: ['¿Qué hay de comer hoy?', 'Huele a arroz recién hecho…', '¿Me das un empanizado? Porfa.', 'Hoy se me antoja un ramen.'],
    juegos: ['¿Jugamos algo?', 'Apuesto a que no me ganas en el memorama.', 'Hoy me siento con suerte.', '¿Viste mi récord volando?'],
    bano: ['¡No me gusta el agua fría!', 'Burbujas, burbujas…', '¿Me ayudas a bañarme?'],
    recamara: ['Qué sueñito…', 'La luna se ve bonita hoy.', '¿Me cuentas un cuento?'],
    jardin: ['Huele a pasto recién cortado.', '¿Sembramos algo?', 'Me gusta ver crecer las plantas.'],
    closet: ['¿Cómo me veo?', 'Ese sombrero se me vería genial.', '¡Hoy quiero estrenar algo!']
  };

  function today(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function fresh() {
    return { v: 2, hunger: 70, happy: 75, energy: 80, clean: 60, coins: 60, level: 1, xp: 0, sleeping: false, last: Date.now(), saved: 0,
      owned: [], wear: { head: null, face: null, neck: null, aura: null }, best: {}, daily: { last: '', streak: 0 }, muted: false, welcomed: false, plays: 0,
      fridge: { rollo: 2, edamame: 2, matcha: 1 }, themes: {}, ownedThemes: [], missions: null };
  }
  function migrate(s) {
    if (!s || typeof s !== 'object') return null;
    if (s.v === 2) {
      if (!s.fridge) s.fridge = { rollo: 2, edamame: 2, matcha: 1 };
      if (!s.themes) s.themes = {};
      if (!s.ownedThemes) s.ownedThemes = [];
      if (!s.wear) s.wear = {};
      if (s.wear.neck === undefined) s.wear.neck = null;
      if (s.wear.aura === undefined) s.wear.aura = null;
      return s;
    }
    if (s.v === 1) {
      var n = fresh();
      ['hunger', 'happy', 'energy', 'clean', 'coins', 'level', 'xp', 'sleeping', 'last', 'saved'].forEach(function (k) { if (s[k] !== undefined) n[k] = s[k]; });
      n.welcomed = true;
      return n;
    }
    return null;
  }
  // Datos que vienen del servidor (lo que no se puede falsear desde el teléfono)
  var X = { name: cfg.name || '', visits: cfg.visits || 0, spins: cfg.spins || 0, owned: (cfg.owned || []).slice(), camino: (cfg.camino || []).slice() };
  function load() { var s = migrate(cfg.state ? JSON.parse(JSON.stringify(cfg.state)) : null); return s || fresh(); }
  var S = load();
  var saveTimer = null, saving = false, saveAgain = false;
  function saveLocal() {}
  function save() { S.saved = Date.now(); clearTimeout(saveTimer); saveTimer = setTimeout(function () { push(false); }, 1200); }
  function push(keep) {
    if (saving && !keep) { saveAgain = true; return; }
    saving = true;
    fetch(cfg.api, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state: S }), keepalive: !!keep, credentials: 'same-origin' })
      .catch(function () {}).then(function () { saving = false; if (saveAgain) { saveAgain = false; push(false); } });
  }
  function refreshServer() {
    return fetch(cfg.api, { credentials: 'same-origin', cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!d || !d.ok) return;
      X.visits = d.visits; X.spins = d.spins; X.owned = d.owned; X.camino = d.camino; renderBadges();
    }).catch(function () {});
  }

  // ===================== SONIDO =====================
  var AC = null;
  function ac() {
    if (S.muted) return null;
    try {
      if (!AC) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); }
      if (AC.state === 'suspended') AC.resume();
      return AC;
    } catch (e) { return null; }
  }
  function tone(f, d, type, vol, when, slide) {
    var a = ac(); if (!a) return;
    try {
      var t = a.currentTime + (when || 0), o = a.createOscillator(), g = a.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d + 0.03);
    } catch (e) {}
  }
  var SFX = {
    tap: function () { tone(660, 0.08, 'triangle', 0.1); },
    coin: function () { tone(988, 0.07, 'square', 0.05); tone(1319, 0.14, 'square', 0.05, 0.07); },
    eat: function () { tone(240, 0.06, 'sawtooth', 0.06); tone(190, 0.06, 'sawtooth', 0.06, 0.1); tone(250, 0.06, 'sawtooth', 0.06, 0.2); },
    pop: function () { tone(500 + Math.random() * 400, 0.05, 'sine', 0.06, 0, 1000); },
    jump: function () { tone(300, 0.18, 'sine', 0.1, 0, 700); },
    fail: function () { tone(330, 0.14, 'triangle', 0.1, 0, 160); tone(220, 0.22, 'triangle', 0.1, 0.12, 100); },
    good: function () { tone(660, 0.08, 'triangle', 0.1); tone(990, 0.12, 'triangle', 0.1, 0.07); },
    level: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.16, 'triangle', 0.1, i * 0.1); }); },
    flap: function () { tone(420, 0.07, 'sine', 0.07, 0, 640); },
    water: function () { for (var i = 0; i < 6; i++) tone(700 + Math.random() * 700, 0.05, 'sine', 0.04, i * 0.09, 300); },
    snore: function () { tone(110, 0.5, 'sine', 0.05, 0, 90); }
  };

  // ===================== ELEMENTOS =====================
  var $ = function (id) { return document.getElementById(id); };
  var stage = $('stage'), room = $('room'), panel = $('panel'), sayEl = $('say'), pet = $('pet'), sceneEl = $('scene');
  var hoshiEl = stage.querySelector('.hoshi');
  hoshiEl.querySelector('img').setAttribute('draggable', 'false');
  var accHead = document.createElement('div'); accHead.className = 'acc-head'; hoshiEl.appendChild(accHead);
  var faceG = stage.querySelector('.hoshi-face > g');
  var accFace = document.createElementNS('http://www.w3.org/2000/svg', 'g'); faceG.appendChild(accFace);
  var accAura = document.createElement('div'); accAura.className = 'acc-aura'; accAura.setAttribute('aria-hidden', 'true');
  accAura.innerHTML = '<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>';
  pet.insertBefore(accAura, stage);
  var accNeck = document.createElement('div'); accNeck.className = 'acc-neck'; hoshiEl.appendChild(accNeck);
  (function () {
    var h = '';
    for (var i = 0; i < 22; i++) h += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;animation-delay:' + (Math.random() * 0.6).toFixed(2) + 's"></i>';
    $('drops').innerHTML = h;
  })();

  var reacting = null, reactTimer = null, queued = null, currentRoom = 'cocina', tickN = 0;
  var sayTimer = null, lastSay = 0, busyLayer = false, fullNotified = false;

  function clamp(v) { return Math.max(0, Math.min(100, v)); }
  function need() { return 40 + S.level * 20; }
  function hasItem(id) { return S.owned.indexOf(id) >= 0 || X.owned.indexOf(id) >= 0; }
  function hasTheme(t) { return (!t.excl && !t.price) || S.ownedThemes.indexOf(t.id) >= 0 || X.owned.indexOf(t.id) >= 0; }
  function whereFrom(o) { if (o.excl === 'colab') return 'Colab'; if (o.excl === 'evento') { var ee = evById(o.ev); return ee ? ee.short : 'Temporada'; } return o.excl === 'ruleta' ? 'Ruleta' : o.excl === 'visita' ? 'Visita ' + o.need : o.excl === 'nivel' ? 'Nivel ' + o.need : o.excl === 'jardin' ? 'Jardín' : o.excl === 'ranking' ? 'Ranking' : ''; }
  function exclMsg(o) { if (o.excl === 'colab') { var cb = colabById(o.colab), gl = o.goal(); return 'Es de la colab ' + (cb ? cb.name : '') + ': ' + gl[2].toLowerCase() + '. Míralo en Premios → Colabs.'; } if (o.excl === 'evento') { var ee = evById(o.ev), cur = eventAt(); if (o.gift && cur && cur.e.id === o.ev) return 'Es el regalo de ' + cur.e.short + ': búscalo en el botón de temporada.'; var rg = ee && evRange(ee, new Date().getFullYear()); return ee ? 'Ropa de temporada: sale en ' + ee.name + (rg ? ' (' + fmtDay(rg[0]) + ' al ' + fmtDay(rg[1]) + ')' : '') + '.' : 'Ropa de temporada.'; } return o.excl === 'ruleta' ? 'Solo sale en la ruleta de Hoshi.' : o.excl === 'visita' ? 'Se gana al llegar a ' + o.need + ' visitas a Hoshi.' : o.excl === 'nivel' ? 'Se gana al llegar al nivel ' + o.need + '.' : o.excl === 'jardin' ? 'Sale al cosechar sakura en el jardín.' : 'Es para quien gana el primer lugar del ranking semanal.'; }
  function itemById(id) { for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].id === id) return ITEMS[i]; return null; }

  // ===================== HABLA =====================
  function say(t, ms) {
    sayEl.textContent = t;
    sayEl.classList.remove('is-hidden');
    lastSay = Date.now();
    clearTimeout(sayTimer);
    sayTimer = setTimeout(function () { sayEl.classList.add('is-hidden'); }, ms || 3800);
  }
  function needLine() {
    if (S.sleeping) return S.energy >= 100 ? 'Ya descansó. Prende la luz para despertarlo.' : 'Zzz… (está dormido)';
    if (S.energy < 20) return 'Tengo muchísimo sueño…';
    if (S.hunger < 30) return 'Me ruge la panza… ¿me das de comer?';
    if (S.clean < 30) return 'Creo que necesito un baño.';
    if (S.happy < 30) return 'Estoy aburrido… ¿jugamos?';
    return null;
  }
  function idleChat() {
    if (busyLayer || reacting || Date.now() - lastSay < 12000) return;
    var l = needLine();
    if (!l) { var arr = IDLE[currentRoom]; l = arr[Math.floor(Math.random() * arr.length)]; }
    say(l);
  }

  // ===================== TIEMPO =====================
  function tick() {
    var now = Date.now(), dt = Math.max(0, (now - S.last) / 3600000);
    S.last = now;
    S.hunger = clamp(S.hunger - 9 * dt);
    S.happy = clamp(S.happy - 6 * dt - ((S.hunger < 20 || S.clean < 20) ? 6 * dt : 0));
    S.clean = clamp(S.clean - 5 * dt);
    if (S.sleeping) {
      S.energy = clamp(S.energy + 600 * dt);
      if (S.energy >= 100 && !fullNotified) { fullNotified = true; say('Ya descansó. Prende la luz para despertarlo.', 5000); }
    } else S.energy = clamp(S.energy - 6 * dt);
    growGarden(now);
    render();
    if (currentRoom === 'jardin' && (tickN++ % 20 === 0)) { renderBeds(); if (choosingPlot === null) renderPanel(); }
  }

  // ===================== RENDER =====================
  function setRing(k) {
    var v = Math.round(S[k]), el = $('r-' + k);
    el.querySelector('.fg').style.strokeDashoffset = (125.66 * (1 - v / 100)).toFixed(1);
    el.className = 'ring-stat' + (v < 25 ? ' low' : v < 50 ? ' mid' : '');
    el.setAttribute('aria-valuenow', v);
    el.title = el.getAttribute('aria-label') + ': ' + v + '%';
  }
  function baseClass() {
    if (S.sleeping) return 'base-sleeping';
    if (S.energy < 20) return 'base-tired';
    if (S.hunger < 30) return 'base-hungry';
    if (S.happy < 30) return 'base-sad';
    return '';
  }
  function applyBase() {
    if (reacting) return;
    var c = ('mascot-stage ' + baseClass()).trim();
    if (stage.className !== c) stage.className = c;
  }
  var lastCoins = null;
  function render() {
    ['hunger', 'happy', 'energy', 'clean'].forEach(setRing);
    $('coins').textContent = S.coins;
    if (lastCoins !== null && S.coins > lastCoins) { var cb = $('coin-badge'); cb.classList.remove('coins-pop'); void cb.offsetWidth; cb.classList.add('coins-pop'); }
    lastCoins = S.coins;
    $('lvl').textContent = S.level;
    $('xp').style.width = Math.round(S.xp / need() * 100) + '%';
    var dirt = 100 - S.clean;
    document.querySelectorAll('.dirt ellipse').forEach(function (e, i) { e.style.opacity = dirt > 25 + i * 14 ? 0.85 : 0; });
    room.classList.toggle('is-night', S.sleeping && currentRoom === 'recamara');
    var gc = gardenCounts();
    var alerts = { cocina: S.hunger < 30, juegos: S.happy < 30, bano: S.clean < 30, recamara: S.energy < 20 && !S.sleeping, jardin: gc.ready > 0 || gc.thirsty > 0 };
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('alert', !!alerts[t.dataset.room]); });
    applyBase();
    if (currentRoom === 'recamara') { var sb = $('sleep-btn'); if (sb && sb.dataset.s !== String(S.sleeping)) renderPanel(); }
  }
  function themeOf(r) { var id = S.themes[r], list = THEMES[r]; for (var i = 0; i < list.length; i++) if (list[i].id === id && hasTheme(list[i])) return list[i]; return list[0]; }
  function themed(r) {
    var m = themeOf(r).map;
    return SCENES[r].replace(/#[0-9a-fA-F]{6}/g, function (c) { return m[c.toLowerCase()] || c; });
  }
  function renderScene() { var EVN = typeof eventAt === 'function' ? eventAt() : null; sceneEl.innerHTML = themed(currentRoom) + (EVN ? '<g class="ev-deco">' + EVN.e.deco(currentRoom) + '</g>' : ''); room.dataset.room = currentRoom; if (currentRoom === 'jardin') renderBeds(); }
  function renderWear() {
    var h = itemById(S.wear.head), f = itemById(S.wear.face);
    if (h) { accHead.style.width = h.w + '%'; accHead.style.bottom = h.b + '%'; accHead.style.left = (h.x || 50) + '%'; accHead.innerHTML = '<svg viewBox="' + h.vb + '" aria-hidden="true">' + h.svg + '</svg>'; }
    else accHead.innerHTML = '';
    accFace.innerHTML = f ? f.svg : '';
    var a = itemById(S.wear.aura);
    accAura.className = 'acc-aura' + (a ? ' ' + a.id : '');
    var n = itemById(S.wear.neck);
    if (n) { accNeck.style.width = n.w + '%'; accNeck.style.top = n.t + '%'; accNeck.innerHTML = '<svg viewBox="' + n.vb + '" aria-hidden="true">' + n.svg + '</svg>'; }
    else accNeck.innerHTML = '';
  }
  function renderMute() {
    var b = $('mute');
    b.innerHTML = S.muted
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4zM22 9l-6 6M16 9l6 6"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4zM15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13"/></svg>';
    b.setAttribute('aria-pressed', String(S.muted));
    b.setAttribute('aria-label', S.muted ? 'Activar sonidos' : 'Silenciar sonidos');
  }

  // ===================== REACCIONES =====================
  function react(m, then) {
    if (reacting) { queued = [m, then]; return; }
    reacting = m;
    stage.className = 'mascot-stage';
    void stage.offsetWidth;
    stage.className = 'mascot-stage is-' + m;
    clearTimeout(reactTimer);
    reactTimer = setTimeout(function () {
      reacting = null; applyBase();
      if (then) then();
      if (queued) { var q = queued; queued = null; react(q[0], q[1]); }
    }, DUR[m] || 2600);
  }
  function floatText(t) {
    var e = document.createElement('span'); e.className = 'float-txt'; e.textContent = t;
    pet.appendChild(e); setTimeout(function () { e.remove(); }, 1150);
  }
  function addCoins(n) {
    if (!n) return;
    S.coins += n; SFX.coin(); floatText('+' + n); render();
  }
  var levelQueue = [];
  function gainXP(n) {
    S.xp += n;
    while (S.xp >= need()) {
      S.xp -= need(); S.level++;
      var rw = levelReward(S.level), lines = [];
      S.coins += rw.coins; lines.push(coinLine(rw.coins));
      if (rw.food) { addFood(rw.food); lines.push(foodLine(rw.food)); }
      if (rw.unlock) { grantLocal(rw.unlock); lines.push(unlockLine(rw.unlock)); }
      var shopNew = ITEMS.filter(function (it) { return !it.excl && it.level === S.level; });
      if (shopNew.length) lines.push('<span class="rw-line">Nuevo en la tienda: ' + shopNew.map(function (i) { return i.name; }).join(', ') + '</span>');
      levelQueue.push({ level: S.level, lines: lines });
    }
    save(); render();
    if (levelQueue.length) showLevelUps();
  }
  function showLevelUps() {
    if (busyLayer && !$('game').hidden) return; // se muestra al cerrar el juego
    if (!$('modal').hidden) { setTimeout(showLevelUps, 800); return; }
    var lv = levelQueue.shift(); if (!lv) return;
    SFX.level(); react('party');
    showModal('¡Nivel ' + lv.level + '!', '<p>Hoshito creció. Tu premio:</p><div class="rw-list">' + lv.lines.join('') + '</div>', '¡Genial!', function () { renderWear(); renderScene(); renderPanel(); if (levelQueue.length) setTimeout(showLevelUps, 300); });
  }
  function blockedBySleep() {
    if (!S.sleeping) return false;
    say('Shh… estoy dormido. Prende la luz en la recámara.');
    return true;
  }

  // ===================== ACCIONES =====================
  function feed(f) {
    if (blockedBySleep()) return;
    if (reacting === 'feed') return;
    if (S.hunger >= 95) { say('¡Ya no me cabe nada!'); react('dizzy'); return; }
    if (!(S.fridge[f.id] > 0)) { say('Ya no hay ' + f.name.toLowerCase() + ' en la nevera. Compra en la tienda.'); react('think'); return; }
    S.fridge[f.id]--;
    renderPanel();
    $('bite').innerHTML = f.svg;
    react('feed');
    setTimeout(SFX.eat, 650);
    setTimeout(function () {
      S.hunger = clamp(S.hunger + f.hunger); S.happy = clamp(S.happy + f.happy); S.energy = clamp(S.energy + f.energy);
      say(f.msg); gainXP(5); track('feed');
    }, 950);
    render();
  }
  function toggleSleep() {
    S.sleeping = !S.sleeping;
    fullNotified = false;
    if (S.sleeping) {
      if (reacting) { clearTimeout(reactTimer); reacting = null; queued = null; }
      say('Buenas noches…'); SFX.snore();
    } else {
      var rested = S.energy > 90;
      say(rested ? '¡Buenos días! Desperté con toda la energía.' : 'Mmm… todavía tengo sueño.');
      react(rested ? 'jump' : 'sneeze');
      if (rested) { gainXP(5); track('rested'); }
    }
    save(); renderPanel(); render();
  }
  stage.addEventListener('click', function () {
    if (currentRoom === 'bano') return;
    if (S.sleeping) { say('Zzz…'); return; }
    if (reacting) return;
    S.happy = clamp(S.happy + 2);
    SFX.tap(); track('tap');
    react(TAP[Math.floor(Math.random() * TAP.length)]);
    render();
  });

  // Baño: enjabonar frotando y enjuagar
  var rubbing = false, lastBub = 0, foamCount = 0, rubN = 0;
  stage.addEventListener('pointerdown', function (e) {
    if (currentRoom !== 'bano') return;
    if (blockedBySleep()) return;
    rubbing = true;
    try { stage.setPointerCapture(e.pointerId); } catch (x) {}
    e.preventDefault(); rub(e);
  });
  function onPointerUp() { if (rubbing) { rubbing = false; save(); } }
  window.addEventListener('pointerup', onPointerUp);
  stage.addEventListener('pointermove', function (e) { if (rubbing && currentRoom === 'bano') rub(e); });
  function rub(e) {
    var now = performance.now();
    if (now - lastBub < 45) return;
    lastBub = now; rubN++;
    var r = stage.getBoundingClientRect(), b = document.createElement('span'), s = 14 + Math.random() * 20;
    b.className = 'bub'; b.style.width = b.style.height = s + 'px';
    b.style.left = (e.clientX - r.left - s / 2) + 'px'; b.style.top = (e.clientY - r.top - s / 2) + 'px';
    stage.appendChild(b); setTimeout(function () { b.remove(); }, 950);
    if (rubN % 3 === 0) SFX.pop();
    var hr = hoshiEl.getBoundingClientRect();
    if (rubN % 3 === 0 && foamCount < 30) {
      var f = document.createElement('span'), fs = 16 + Math.random() * 22;
      f.className = 'foam'; f.style.width = f.style.height = fs + 'px';
      f.style.left = ((e.clientX - hr.left) / hr.width * 100 - fs / hr.width * 50).toFixed(1) + '%';
      f.style.top = ((e.clientY - hr.top) / hr.height * 100 - fs / hr.height * 50).toFixed(1) + '%';
      hoshiEl.appendChild(f); foamCount++;
    }
    if (S.clean < 85) S.clean = clamp(S.clean + 0.5);
    S.happy = clamp(S.happy + 0.05);
    if (!reacting && Math.random() < 0.015) react('sneeze');
    if (foamCount === 12) say('¡Ya estoy espumoso! Ahora enjuágame.');
    render();
  }
  function rinse() {
    if (blockedBySleep()) return;
    pet.classList.add('is-rinsing'); SFX.water();
    var foams = hoshiEl.querySelectorAll('.foam');
    setTimeout(function () { foams.forEach(function (f) { f.classList.add('gone'); }); }, 500);
    setTimeout(function () { foams.forEach(function (f) { f.remove(); }); pet.classList.remove('is-rinsing'); }, 1700);
    if (foamCount >= 8) {
      S.clean = 100; S.happy = clamp(S.happy + 8);
      setTimeout(function () { react('star'); say('¡Rechinando de limpio!'); }, 900);
      gainXP(10); track('bath');
    } else {
      S.clean = clamp(S.clean + 10);
      react('cold'); say(foamCount ? 'Le faltó jabón… frótame más.' : '¡Brrr! Primero enjabóname frotándome.');
      save();
    }
    foamCount = 0; render();
  }

  // Closet
  var CLOSET_SLOTS = ['skin', 'head', 'face', 'neck', 'aura'], SLOT_NAMES = { skin: 'Aro', head: 'Cabeza', face: 'Cara', neck: 'Cuello', aura: 'Aura' }, closetCat = null;
  function closetAction(it, fromShop) {
    if (!hasItem(it.id) && it.excl && !evBuyable(it)) { say(exclMsg(it)); SFX.fail(); return; }
    if (!hasItem(it.id)) {
      if (S.level < (it.level || 1)) { say('Eso se desbloquea en el nivel ' + it.level + '.'); SFX.fail(); return; }
      if (S.coins < it.price) { say('Me faltan ' + (it.price - S.coins) + ' monedas para eso.'); SFX.fail(); return; }
      S.coins -= it.price; S.owned.push(it.id); S.wear[it.slot] = it.id; track('buy');
      SFX.good(); react('star'); say('¡Me encanta! ' + it.name + ' nuevo.'); gainXP(6);
    } else if (S.wear[it.slot] === it.id) {
      S.wear[it.slot] = null; SFX.tap();
    } else {
      S.wear[it.slot] = it.id; SFX.tap(); if (!reacting) react('wink'); track('wear');
    }
    renderWear(); save(); renderPanel(); render(); if (fromShop) renderShop();
  }

  // ===================== PANELES =====================
  function head(title, hint) { return '<div class="panel-head"><h2 class="panel-title">' + title + '</h2><p class="hint">' + hint + '</p></div>'; }
  function renderPanel() {
    var h = '';
    if (currentRoom === 'jardin') {
      panel.innerHTML = gardenPanel();
      panel.querySelectorAll('[data-plot]').forEach(function (b) { b.addEventListener('click', function () { plotAction(+b.dataset.plot); }); });
      panel.querySelectorAll('[data-seed]').forEach(function (b) { b.addEventListener('click', function () { plantSeed(b.dataset.seed); }); });
      if ($('seed-back')) $('seed-back').addEventListener('click', function () { choosingPlot = null; SFX.tap(); renderPanel(); });
      return;
    }
    var shopCard = function (tab, label) { return '<button type="button" class="card shopcard" data-shop="' + tab + '"><svg class="pic" viewBox="0 0 24 24" aria-hidden="true">' + BAG + '</svg><span class="nm">' + label + '</span><span class="tag">Tienda</span></button>'; };
    if (currentRoom === 'cocina') {
      var inFridge = FOODS.filter(function (f) { return S.fridge[f.id] > 0; });
      h = head('Nevera', inFridge.length ? 'Toca una comida para dársela' : 'La nevera está vacía') + '<div class="scroller">' + shopCard('comida', 'Comprar comida') + inFridge.map(function (f) {
        return '<button type="button" class="card" data-food="' + FOODS.indexOf(f) + '"><span class="cnt">×' + S.fridge[f.id] + '</span><svg class="pic" viewBox="0 0 40 40" aria-hidden="true">' + f.svg + '</svg><span class="nm">' + f.name + '</span></button>';
      }).join('') + '</div>';
    } else if (currentRoom === 'juegos') {
      h = head('Minijuegos', 'Gana monedas jugando') + '<div class="games-grid">' + GAMES.map(function (g, i) {
        var b = S.best[g.id];
        return '<button type="button" class="gcard' + (g.daily ? ' daily' + (palState().done ? ' done' : '') : '') + '" data-game="' + i + '"><svg viewBox="0 0 40 40" aria-hidden="true">' + g.icon + '</svg><span><b>' + g.name + '</b><small>' + (g.daily ? palToday() : b != null ? 'Récord: ' + b + (g.unit || '') : g.short) + '</small></span></button>';
      }).join('') + '</div><button type="button" class="btn rank-btn" id="open-rank"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v4a5 5 0 01-10 0z" fill="#ffd54a" stroke="#111114" stroke-width="1.5"/><path d="M7 6H4a3 3 0 003 4M17 6h3a3 3 0 01-3 4" fill="none" stroke="#ffd54a" stroke-width="1.8"/><path d="M12 13v4M8 21h8l-1-4H9z" fill="#ffd54a" stroke="#111114" stroke-width="1.5"/></svg>Ranking de la semana</button>';
    } else if (currentRoom === 'bano') {
      h = head('Baño', 'Frótalo para enjabonarlo') + '<div class="row"><button type="button" class="btn primary" id="rinse">Enjuagar</button></div>';
    } else if (currentRoom === 'recamara') {
      h = head('Recámara', S.sleeping ? 'Recuperando energía…' : 'Si está cansado, a dormir') + '<div class="row"><button type="button" class="btn primary" id="sleep-btn" data-s="' + S.sleeping + '">' + (S.sleeping ? 'Prender la luz' : 'Apagar la luz') + '</button></div>';
    } else {
      var mine = ITEMS.filter(function (it) { return hasItem(it.id); });
      var cats = CLOSET_SLOTS.filter(function (sl) { return ITEMS.some(function (it) { return it.slot === sl; }); });
      if (cats.indexOf(closetCat) < 0) closetCat = cats.filter(function (sl) { return mine.some(function (it) { return it.slot === sl; }); })[0] || cats[0];
      var inCat = mine.filter(function (it) { return it.slot === closetCat; });
      h = '<div class="panel-head"><h2 class="panel-title">Closet</h2><div class="closet-links"><button type="button" class="mini-link" data-shop="ropa">+ Ropa</button><button type="button" class="mini-link" data-shop="fondos">Pintar</button></div></div>'
        + '<div class="cchips" role="tablist">' + cats.map(function (sl) {
          var n = mine.filter(function (it) { return it.slot === sl; }).length, worn = S.wear[sl] && hasItem(S.wear[sl]);
          return '<button type="button" role="tab" class="cchip' + (worn ? ' worn' : '') + '" data-cat="' + sl + '" aria-selected="' + (sl === closetCat) + '">' + SLOT_NAMES[sl] + ' <span>' + n + '</span></button>';
        }).join('') + '</div>'
        + '<div class="scroller">' + (inCat.length && closetCat !== 'skin' ? '<button type="button" class="card' + (S.wear[closetCat] ? '' : ' is-on') + '" data-unwear="' + closetCat + '"><svg class="pic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="#9fb3ab" stroke-width="2"/><path d="M6.5 17.5l11-11" stroke="#9fb3ab" stroke-width="2"/></svg><span class="nm">Nada</span><span class="tag' + (S.wear[closetCat] ? ' dim' : '') + '">' + (S.wear[closetCat] ? 'Quitar' : 'Así') + '</span></button>' : '')
        + inCat.map(function (it) {
          var on = S.wear[it.slot] === it.id;
          return '<button type="button" class="card' + (on ? ' is-on' : '') + '" data-item="' + ITEMS.indexOf(it) + '"><svg class="pic" viewBox="' + it.vb + '" aria-hidden="true">' + it.svg + '</svg><span class="nm">' + it.name + '</span><span class="tag">' + (on ? 'Puesto' : 'Usar') + '</span></button>';
        }).join('') + (inCat.length ? '' : '<p class="closet-empty">Aún no tienes nada de ' + SLOT_NAMES[closetCat].toLowerCase() + '.</p>') + shopCard('ropa', 'Comprar más') + '</div>';
    }
    panel.innerHTML = h;
    panel.querySelectorAll('[data-food]').forEach(function (b) { b.addEventListener('click', function () { feed(FOODS[+b.dataset.food]); }); });
    panel.querySelectorAll('[data-game]').forEach(function (b) { b.addEventListener('click', function () { openGame(GAMES[+b.dataset.game]); }); });
    panel.querySelectorAll('[data-item]').forEach(function (b) { b.addEventListener('click', function () { closetAction(ITEMS[+b.dataset.item]); }); });
    panel.querySelectorAll('[data-cat]').forEach(function (b) { b.addEventListener('click', function () { closetCat = b.dataset.cat; SFX.tap(); renderPanel(); }); });
    panel.querySelectorAll('[data-unwear]').forEach(function (b) { b.addEventListener('click', function () { if (S.wear[b.dataset.unwear]) { S.wear[b.dataset.unwear] = null; SFX.tap(); renderWear(); save(); render(); } renderPanel(); }); });
    panel.querySelectorAll('[data-shop]').forEach(function (b) { b.addEventListener('click', function () { openShop(b.dataset.shop); }); });
    if ($('rinse')) $('rinse').addEventListener('click', rinse);
    if ($('open-rank')) $('open-rank').addEventListener('click', openRanking);
    if ($('sleep-btn')) $('sleep-btn').addEventListener('click', toggleSleep);
  }
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      if (currentRoom === t.dataset.room) return;
      currentRoom = t.dataset.room; choosingPlot = null; SFX.tap();
      document.querySelectorAll('.tab').forEach(function (x) { x.classList.toggle('is-on', x === t); x.setAttribute('aria-current', x === t ? 'page' : 'false'); });
      renderScene(); renderPanel(); render();
      var l = needLine(); var arr = IDLE[currentRoom];
      say(l || arr[Math.floor(Math.random() * arr.length)]);
    });
  });
  $('mute').addEventListener('click', function () { S.muted = !S.muted; renderMute(); save(); SFX.tap(); });


  // ===================== TIENDA =====================
  var BAG = '<path d="M5 8h14l-1.2 12a2 2 0 01-2 1.8H8.2a2 2 0 01-2-1.8z" fill="#ffb4a3" stroke="#111114" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 10V7a3 3 0 016 0v3" fill="none" stroke="#111114" stroke-width="1.6" stroke-linecap="round"/>';
  var BRUSH = '<path d="M14 3l7 7-6 6-7-7z" fill="#bfe8cc" stroke="#111114" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 9l-4 4c-1 1-1 4 1 5l1 1c1 2 4 2 5 1l4-4" fill="#ff8fa8" stroke="#111114" stroke-width="1.6" stroke-linejoin="round"/>';
  var shopTab = 'comida';
  function openShop(tab) {
    shopTab = tab || shopTab; SFX.tap();
    busyLayer = true; $('shop').hidden = false; renderShop();
  }
  function closeShop() {
    $('shop').hidden = true; busyLayer = !$('game').hidden || !$('modal').hidden;
    renderScene(); renderPanel(); render(); SFX.tap();
  }
  function shopMsg(t) { var m = $('shop-msg'); m.textContent = t; clearTimeout(m._t); m._t = setTimeout(function () { m.textContent = ''; }, 2600); }
  function renderShop() {
    $('shop-coins').textContent = S.coins;
    document.querySelectorAll('.seg button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === shopTab)); });
    var h = '';
    if (shopTab === 'comida') {
      var evNow = eventAt();
      h = (evNow ? '<h3>Temporada · ' + evNow.e.short + '</h3>' : '') + FOODS.map(function (f, i) { if (f.ev && (!evNow || evNow.e.id !== f.ev)) return '';
        var fx = []; if (f.hunger) fx.push('+' + f.hunger + ' hambre'); if (f.happy >= 8) fx.push('+' + f.happy + ' felicidad'); if (f.energy >= 6) fx.push('+' + f.energy + ' energía');
        return '<button type="button" class="card" data-buy-food="' + i + '">' + (S.fridge[f.id] ? '<span class="cnt">×' + S.fridge[f.id] + '</span>' : '') + '<svg class="pic" viewBox="0 0 40 40" aria-hidden="true">' + f.svg + '</svg><span class="nm">' + f.name + '</span><span class="fx-txt">' + fx.join(' · ') + '</span><span class="pr">' + COIN + f.price + '</span></button>';
      }).join('');
    } else if (shopTab === 'ropa') {
      var slots = { head: 'Cabeza', face: 'Cara', neck: 'Cuello', aura: 'Aura' };
      var evR = eventAt(), card = null;
      var evList = evR ? ITEMS.filter(function (it) { return it.ev === evR.e.id; }) : [];
      var sections = (evList.length ? [['ev', 'Temporada · ' + evR.e.short]] : []).concat(['head', 'face', 'neck', 'aura'].map(function (k) { return [k, slots[k]]; }));
      sections.forEach(function (sec) {
        var sl = sec[0];
        h += '<h3>' + sec[1] + '</h3>' + ITEMS.filter(function (it) { return sl === 'ev' ? it.ev === evR.e.id : it.slot === sl && (!it.ev || hasItem(it.id) || (evR && it.ev === evR.e.id)); }).map(function (it) {
          var own = hasItem(it.id), on = S.wear[it.slot] === it.id, buy = evBuyable(it), locked = !own && ((it.excl && !buy) || S.level < (it.level || 1));
          var foot = on ? '<span class="tag">Puesto</span>' : own ? '<span class="tag">Usar</span>' : it.excl && !buy ? '<span class="tag excl">' + whereFrom(it) + '</span>' : locked ? '<span class="tag dim">Nivel ' + it.level + '</span>' : '<span class="pr">' + COIN + it.price + '</span>';
          return '<button type="button" class="card' + (on ? ' is-on' : '') + (locked ? ' locked' : '') + (it.excl ? ' excl r-' + (it.rarity || 'x') : '') + '" data-buy-item="' + ITEMS.indexOf(it) + '"><svg class="pic" viewBox="' + it.vb + '" aria-hidden="true">' + it.svg + '</svg><span class="nm">' + it.name + '</span>' + foot + '</button>';
        }).join('');
      });
    } else {
      Object.keys(THEMES).forEach(function (r) {
        h += '<h3>' + ROOMS[r] + '</h3>' + THEMES[r].map(function (t) {
          var own = hasTheme(t), on = themeOf(r).id === t.id;
          var foot = on ? '<span class="tag">Puesto</span>' : own ? '<span class="tag">Usar</span>' : t.excl ? '<span class="tag excl">' + whereFrom(t) + '</span>' : '<span class="pr">' + COIN + t.price + '</span>';
          return '<button type="button" class="card' + (on ? ' is-on' : '') + (t.excl ? ' excl r-' + (t.rarity || 'x') + (own ? '' : ' locked') : '') + '" data-theme="' + r + '|' + t.id + '"><span class="sw">' + t.sw.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span><span class="nm">' + t.name + '</span>' + foot + '</button>';
        }).join('');
      });
    }
    var list = $('shop-list'); list.innerHTML = h;
    list.querySelectorAll('[data-buy-food]').forEach(function (b) { b.addEventListener('click', function () {
      var f = FOODS[+b.dataset.buyFood];
      if (S.coins < f.price) { shopMsg('Te faltan ' + (f.price - S.coins) + ' monedas.'); SFX.fail(); return; }
      S.coins -= f.price; S.fridge[f.id] = (S.fridge[f.id] || 0) + 1; SFX.coin(); track('buy'); shopMsg(f.name + ' a la nevera.'); save(); renderShop(); render();
    }); });
    list.querySelectorAll('[data-buy-item]').forEach(function (b) { b.addEventListener('click', function () {
      var it = ITEMS[+b.dataset.buyItem];
      if (!hasItem(it.id)) {
        if (it.excl && !evBuyable(it)) { shopMsg(exclMsg(it)); SFX.fail(); return; }
        if (S.level < (it.level || 1)) { shopMsg('Se desbloquea en el nivel ' + it.level + '.'); SFX.fail(); return; }
        if (S.coins < it.price) { shopMsg('Te faltan ' + (it.price - S.coins) + ' monedas.'); SFX.fail(); return; }
      }
      closetAction(it, true);
    }); });
    list.querySelectorAll('[data-theme]').forEach(function (b) { b.addEventListener('click', function () {
      var p = b.dataset.theme.split('|'), r = p[0], t = THEMES[r].filter(function (x) { return x.id === p[1]; })[0];
      var own = hasTheme(t);
      if (!own && t.excl) { shopMsg(exclMsg(t)); SFX.fail(); return; }
      if (!own) {
        if (S.coins < t.price) { shopMsg('Te faltan ' + (t.price - S.coins) + ' monedas.'); SFX.fail(); return; }
        S.coins -= t.price; S.ownedThemes.push(t.id); SFX.good(); gainXP(5); track('buy');
      } else SFX.tap();
      S.themes[r] = t.id; shopMsg(ROOMS[r] + ': ' + t.name + '.'); save(); renderShop(); render();
      if (r === currentRoom) renderScene();
    }); });
  }
  document.querySelectorAll('.seg button').forEach(function (b) { b.addEventListener('click', function () { shopTab = b.dataset.tab; SFX.tap(); renderShop(); $('shop-list').scrollTop = 0; }); });
  $('shop-close').addEventListener('click', closeShop);
  $('shop-btn').addEventListener('click', function () { openShop(); });

  // ===================== AVISOS =====================
  var modalCb = null;
  function showModal(title, body, ok, cb) {
    $('modal-title').textContent = title; $('modal-body').innerHTML = body; $('modal-ok').textContent = ok || 'Ok';
    modalCb = cb || null; $('modal').hidden = false; busyLayer = true; $('modal-ok').focus();
  }
  $('modal-ok').addEventListener('click', function () {
    $('modal').hidden = true; busyLayer = !$('game').hidden;
    var c = modalCb; modalCb = null; SFX.tap(); if (c) c();
  });
  function dailyCheck() {
    var t = today();
    if (S.daily.last === t) return;
    var y = new Date(); y.setDate(y.getDate() - 1);
    var streak = S.daily.last === today(y) ? S.daily.streak + 1 : 1;
    var day = ((streak - 1) % 7) + 1, prize = 10 + day * 5;
    var dots = ''; for (var i = 1; i <= 7; i++) dots += '<span class="' + (i <= day ? 'on' : '') + '">' + i + '</span>';
    showModal('Premio diario', '<p>Día ' + day + ' de 7 de tu racha.</p><div class="streak" style="margin:12px 0">' + dots + '</div><div class="big">' + COIN + '+' + prize + '</div>', 'Recoger', function () {
      S.daily = { last: t, streak: streak }; addCoins(prize); gainXP(10); react('party');
    });
  }
  // ===================== PREMIOS: utilidades =====================
  var FOOD_BY_ID = {}; FOODS.forEach(function (f) { FOOD_BY_ID[f.id] = f; });
  function themeById(id) { for (var r in THEMES) for (var i = 0; i < THEMES[r].length; i++) if (THEMES[r][i].id === id) return { room: r, t: THEMES[r][i] }; return null; }
  function coinLine(n) { return '<span class="rw-line"><span class="rw-ic">' + COIN + '</span>' + n + ' monedas</span>'; }
  function foodLine(food) {
    return '<span class="rw-line rw-food">' + Object.keys(food).map(function (k) { var f = FOOD_BY_ID[k]; return f ? '<span class="rw-chip"><svg viewBox="0 0 40 40" aria-hidden="true">' + f.svg + '</svg>×' + food[k] + '</span>' : ''; }).join('') + '<span class="sr-only">Paquete de comida para la nevera</span></span>';
  }
  function unlockLine(u) {
    if (u.type === 'item') { var it = itemById(u.id); return it ? '<span class="rw-line"><svg class="rw-pic" viewBox="' + it.vb + '" aria-hidden="true">' + it.svg + '</svg>' + it.name + '</span>' : ''; }
    var th = themeById(u.id); return th ? '<span class="rw-line"><span class="sw sm">' + th.t.sw.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span>Fondo ' + th.t.name + ' (' + ROOMS[th.room] + ')</span>' : '';
  }
  function addFood(food) { Object.keys(food).forEach(function (k) { S.fridge[k] = (S.fridge[k] || 0) + food[k]; }); }
  // Objetos que da el propio juego (premios de nivel)
  function grantLocal(u) {
    if (u.type === 'item') { if (S.owned.indexOf(u.id) < 0) S.owned.push(u.id); var it = itemById(u.id); if (it) S.wear[it.slot] = it.id; }
    else { if (S.ownedThemes.indexOf(u.id) < 0) S.ownedThemes.push(u.id); var th = themeById(u.id); if (th) S.themes[th.room] = u.id; }
  }
  // Premio decidido por el servidor (ruleta o camino): el objeto ya quedó guardado allá.
  function applyServerPrize(p) {
    var lines = [];
    if (p.type === 'coins' || p.duplicate) { S.coins += p.amount; lines.push(coinLine(p.amount)); }
    if (p.type === 'food' && p.food) { addFood(p.food); lines.push(foodLine(p.food)); }
    if ((p.type === 'item' || p.type === 'theme') && !p.duplicate) {
      if (X.owned.indexOf(p.id) < 0) X.owned.push(p.id);
      if (p.type === 'item') { var it = itemById(p.id); if (it) S.wear[it.slot] = it.id; }
      else { var th = themeById(p.id); if (th) S.themes[th.room] = p.id; }
      lines.push(unlockLine({ type: p.type, id: p.id }));
    }
    save(); renderWear(); renderScene(); renderPanel(); render();
    return lines;
  }

  // ===================== MISIONES DIARIAS =====================
  function seeded(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; }; }
  function ensureMissions() {
    var t = today();
    if (S.missions && S.missions.date === t) return;
    var r = seeded(t + '|' + X.name), pool = MISSIONS.slice(), list = [], evs = {};
    while (list.length < 3 && pool.length) {
      var m = pool.splice(Math.floor(r() * pool.length), 1)[0], base = m.ev.split(':')[0];
      if (evs[base] && base !== 'score') continue;
      evs[base] = true; list.push({ id: m.id, prog: 0, claimed: false });
    }
    S.missions = { date: t, list: list, bonus: false };
  }
  function missionDef(id) { for (var i = 0; i < MISSIONS.length; i++) if (MISSIONS[i].id === id) return MISSIONS[i]; return null; }
  function track(ev, n, sub) {
    ensureMissions();
    var changed = false;
    S.missions.list.forEach(function (m) {
      var d = missionDef(m.id); if (!d || m.claimed || m.prog >= d.goal) return;
      var ok = d.ev === ev || (sub && d.ev === ev + ':' + sub);
      if (!ok) return;
      var before = m.prog;
      m.prog = d.max ? Math.max(m.prog, n || 0) : m.prog + (n || 1);
      m.prog = Math.min(m.prog, d.goal);
      if (m.prog !== before) changed = true;
      if (m.prog >= d.goal && before < d.goal) setTimeout(function () { if (!busyLayer) say('¡Misión cumplida! Cobra tu premio en Misiones.'); SFX.good(); }, 1200);
    });
    if (changed) { save(); renderBadges(); if (!$('missions').hidden) renderMissions(); }
  }
  function missionsReady() { ensureMissions(); return S.missions.list.filter(function (m) { var d = missionDef(m.id); return d && !m.claimed && m.prog >= d.goal; }).length + (allClaimed() && !S.missions.bonus ? 1 : 0); }
  function allClaimed() { return S.missions.list.length && S.missions.list.every(function (m) { return m.claimed; }); }
  function renderMissions() {
    ensureMissions();
    var now = new Date(), mid = new Date(now); mid.setHours(24, 0, 0, 0);
    var hrs = Math.floor((mid - now) / 3600000), mins = Math.floor((mid - now) / 60000) % 60;
    var h = '<p class="hint left">Se renuevan en ' + hrs + ' h ' + mins + ' min</p>';
    S.missions.list.forEach(function (m, i) {
      var d = missionDef(m.id); if (!d) return;
      var pct = Math.round(m.prog / d.goal * 100), ready = m.prog >= d.goal && !m.claimed;
      h += '<div class="mission' + (m.claimed ? ' done' : '') + '"><div class="m-top"><b>' + d.text + '</b><span class="pr">' + COIN + d.coins + '</span></div>'
        + '<div class="m-bar"><i style="width:' + pct + '%"></i></div><div class="m-bottom"><span>' + Math.min(m.prog, d.goal) + ' / ' + d.goal + '</span>'
        + (m.claimed ? '<span class="tag">Cobrada</span>' : '<button type="button" class="btn sm' + (ready ? ' primary' : '') + '" data-claim="' + i + '"' + (ready ? '' : ' disabled') + '>Cobrar</button>') + '</div></div>';
    });
    var all = allClaimed();
    h += '<div class="mission bonus' + (S.missions.bonus ? ' done' : '') + '"><div class="m-top"><b>Bono: completa las 3</b><span class="pr">' + COIN + '60 + comida</span></div>'
      + '<div class="m-bottom"><span>' + S.missions.list.filter(function (m) { return m.claimed; }).length + ' / 3</span>'
      + (S.missions.bonus ? '<span class="tag">Cobrado</span>' : '<button type="button" class="btn sm' + (all ? ' primary' : '') + '" id="m-bonus"' + (all ? '' : ' disabled') + '>Abrir cofre</button>') + '</div></div>';
    $('missions-list').innerHTML = h;
    $('missions-list').querySelectorAll('[data-claim]').forEach(function (b) { b.addEventListener('click', function () {
      var m = S.missions.list[+b.dataset.claim], d = missionDef(m.id);
      if (!d || m.claimed || m.prog < d.goal) return;
      m.claimed = true; addCoins(d.coins); gainXP(10); save(); renderMissions(); renderBadges();
    }); });
    if ($('m-bonus')) $('m-bonus').addEventListener('click', function () {
      if (!allClaimed() || S.missions.bonus) return;
      S.missions.bonus = true; var food = { empanizado: 1, mochi: 1, ramen: 1 }; addFood(food); addCoins(60); gainXP(20); save(); renderMissions(); renderBadges();
      showModal('¡Cofre del día!', '<div class="rw-list">' + coinLine(60) + foodLine(food) + '</div>', '¡Gracias!');
    });
  }
  function openMissions() { SFX.tap(); busyLayer = true; renderMissions(); $('missions').hidden = false; }
  function closeMissions() { $('missions').hidden = true; busyLayer = !$('game').hidden || !$('shop').hidden || !$('prizes').hidden || !$('modal').hidden; SFX.tap(); }

  // ===================== RULETA Y CAMINO =====================
  // Segmentos de la ruleta (el servidor decide el premio; la ruleta solo lo muestra)
  var SEGS = [
    { k: 'coins', label: 'Monedas', c: '#ffd54a' }, { k: 'comun', label: 'Común', c: '#cfe3da' }, { k: 'food', label: 'Comida', c: '#ffb48f' }, { k: 'rara', label: 'Rara', c: '#9fd6ff' },
    { k: 'coins', label: 'Monedas', c: '#ffe9a0' }, { k: 'comun', label: 'Común', c: '#e6f2ec' }, { k: 'legendaria', label: 'Legendaria', c: '#ffb000' }, { k: 'rara', label: 'Rara', c: '#bfe5ff' }
  ];
  var wheelRot = 0, spinning = false, prizeTab = 'ruleta';
  function wheelSVG() {
    var h = '', n = SEGS.length, R = 150;
    SEGS.forEach(function (sg, i) {
      var a0 = (i / n) * Math.PI * 2 - Math.PI / 2 - Math.PI / n, a1 = a0 + Math.PI * 2 / n;
      var x0 = 160 + R * Math.cos(a0), y0 = 160 + R * Math.sin(a0), x1 = 160 + R * Math.cos(a1), y1 = 160 + R * Math.sin(a1);
      h += '<path d="M160 160L' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'A' + R + ' ' + R + ' 0 0 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + 'z" fill="' + sg.c + '" stroke="#111114" stroke-width="3"/>';
      var am = (i / n) * 360;
      h += '<g transform="rotate(' + am + ' 160 160)"><text x="160" y="58" text-anchor="middle" class="seg-t">' + sg.label + '</text>';
      if (sg.k === 'coins') h += '<circle cx="160" cy="84" r="11" fill="#ffd54a" stroke="#b8860b" stroke-width="3"/>';
      else if (sg.k === 'food') h += '<g transform="translate(146 70) scale(.7)">' + FOODS[0].svg + '</g>';
      else h += '<path transform="translate(148 72)" d="' + STAR_P + '" fill="' + (sg.k === 'legendaria' ? '#fff3b0' : sg.k === 'rara' ? '#2f7fbf' : '#5f8f6e') + '" stroke="#111114" stroke-width="1.5"/>';
      h += '</g>';
    });
    return '<svg viewBox="0 0 320 320" aria-hidden="true"><circle cx="160" cy="160" r="156" fill="#111114"/><g class="wheel-g" id="wheel-g" style="transform:rotate(' + wheelRot + 'deg)">' + h + '</g><circle cx="160" cy="160" r="30" fill="#111114" stroke="#f5f2ec" stroke-width="4"/><circle cx="160" cy="160" r="18" fill="#fff"/><circle cx="157" cy="157" r="7" fill="#ff9f7a"/></svg>';
  }
  function segFor(p) {
    var opts = [];
    SEGS.forEach(function (sg, i) {
      if (p.rarity === 'legendaria' ? sg.k === 'legendaria' : p.rarity === 'rara' ? sg.k === 'rara' : p.type === 'coins' ? sg.k === 'coins' : p.type === 'food' ? sg.k === 'food' : sg.k === 'comun') opts.push(i);
    });
    return opts[Math.floor(Math.random() * opts.length)] || 0;
  }
  function claimableCamino() { return CAMINO.filter(function (c) { return X.visits >= c.visits && X.camino.indexOf(c.visits) < 0; }).length; }
  function renderBadges() {
    var p = X.spins + claimableCamino(), m = missionsReady();
    var bp = $('badge-prizes'), bm = $('badge-missions');
    bp.textContent = p; bp.hidden = !p; bm.textContent = m; bm.hidden = !m;
    $('btn-prizes').setAttribute('aria-label', 'Premios Hoshi' + (p ? ', ' + p + ' por cobrar' : ''));
    $('btn-missions').setAttribute('aria-label', 'Misiones' + (m ? ', ' + m + ' por cobrar' : ''));
  }
  function renderPrizes() {
    document.querySelectorAll('#prizes .seg button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.ptab === prizeTab)); });
    var box = $('prizes-body');
    if (prizeTab === 'ruleta') {
      box.innerHTML = '<div class="wheel-wrap"><div class="pointer" aria-hidden="true"></div>' + wheelSVG() + '</div>'
        + '<button type="button" class="btn primary big-btn" id="spin-btn"' + (X.spins ? '' : ' disabled') + '>' + (X.spins ? 'Girar (' + X.spins + (X.spins === 1 ? ' giro)' : ' giros)') : 'Sin giros por ahora') + '</button>'
        + '<p class="hint center">Cada visita a Hoshi confirmada en caja te da 1 giro. Hay premios comunes, raros y legendarios, y algunos objetos solo salen aquí.</p>';
      $('spin-btn').addEventListener('click', spin);
    } else {
      var h = '<p class="hint center">Llevas <b>' + X.visits + (X.visits === 1 ? ' visita' : ' visitas') + '</b> confirmadas en Hoshi. Cada meta tiene un premio seguro.</p><ol class="camino">';
      CAMINO.forEach(function (c) {
        var got = X.camino.indexOf(c.visits) >= 0, ready = !got && X.visits >= c.visits;
        var what = c.type === 'coins' ? coinLine(c.amount) : c.type === 'food' ? foodLine(c.food) : unlockLine({ type: c.type, id: c.id });
        h += '<li class="step' + (got ? ' got' : ready ? ' ready' : '') + '"><span class="step-n">' + c.visits + '</span><div class="step-body">' + what + '</div>'
          + (got ? '<span class="tag">Cobrado</span>' : ready ? '<button type="button" class="btn sm primary" data-v="' + c.visits + '">Cobrar</button>' : '<span class="tag dim">Faltan ' + (c.visits - X.visits) + '</span>') + '</li>';
      });
      box.innerHTML = h + '</ol><a class="card-link" href="/mi-tarjeta">Ver mi tarjeta de sellos</a>';
      box.querySelectorAll('[data-v]').forEach(function (b) { b.addEventListener('click', function () { claimCamino(+b.dataset.v, b); }); });
    }
  }
  function prizeModal(title, p, lines) {
    var rar = p.rarity ? RARITY[p.rarity] : null;
    showModal(title, (rar ? '<span class="rarity" style="background:' + rar.color + '">' + rar.label + '</span>' : '') + '<div class="rw-list big">' + lines.join('') + '</div>'
      + (p.duplicate ? '<p class="small">Ya lo tenías, así que se cambió por monedas.</p>' : '') + ((p.type === 'item' || p.type === 'theme') && !p.duplicate ? '<p class="small">' + (p.type === 'item' ? 'Ya se lo puso. Lo encuentras en el closet.' : 'Ya está puesto. Lo cambias en la tienda, en Fondos.') + '</p>' : ''), '¡Genial!', function () { renderPrizes(); });
  }
  function spin() {
    if (spinning || !X.spins) return;
    spinning = true; $('spin-btn').disabled = true; SFX.tap();
    fetch(cfg.api + '/ruleta', { method: 'POST', credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (p) {
      if (!p || !p.ok) { spinning = false; X.spins = 0; renderPrizes(); renderBadges(); return; }
      X.spins = p.left; renderBadges();
      var seg = segFor(p), target = 360 * 6 + (360 - seg * 45) + (Math.random() * 24 - 12);
      wheelRot = (wheelRot - (wheelRot % 360)) + target;
      var g = $('wheel-g');
      var ticks = setInterval(function () { tone(900 + Math.random() * 200, 0.03, 'square', 0.03); }, 120);
      g.style.transition = 'transform 4.2s cubic-bezier(0.15, 0.7, 0.15, 1)';
      requestAnimationFrame(function () { g.style.transform = 'rotate(' + wheelRot + 'deg)'; });
      setTimeout(function () {
        clearInterval(ticks); spinning = false;
        var lines = applyServerPrize(p);
        if (p.rarity === 'legendaria') { SFX.level(); react('star'); } else { SFX.good(); react('party'); }
        prizeModal(p.rarity === 'legendaria' ? '¡LEGENDARIO!' : p.rarity === 'rara' ? '¡Premio raro!' : '¡Premio!', p, lines);
      }, 4400);
    }).catch(function () { spinning = false; renderPrizes(); });
  }
  function claimCamino(v, btn) {
    btn.disabled = true; SFX.tap();
    fetch(cfg.api + '/camino', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visits: v }) })
      .then(function (r) { return r.json(); }).then(function (p) {
        if (!p || !p.ok) { refreshServer().then(renderPrizes); return; }
        X.camino.push(v); renderBadges();
        var lines = applyServerPrize(p); SFX.level(); react('party');
        prizeModal('Visita ' + v + ': ¡premio!', p, lines);
      }).catch(function () { btn.disabled = false; });
  }
  function openPrizes(tab) {
    if (tab) prizeTab = tab;
    SFX.tap(); busyLayer = true; $('prizes').hidden = false; renderPrizes();
    refreshServer().then(function () { if (!$('prizes').hidden && !spinning) renderPrizes(); });
  }
  function closePrizes() { if (spinning) return; $('prizes').hidden = true; busyLayer = !$('game').hidden || !$('shop').hidden || !$('missions').hidden || !$('modal').hidden; SFX.tap(); }
  document.querySelectorAll('#prizes .seg button').forEach(function (b) { b.addEventListener('click', function () { if (spinning) return; prizeTab = b.dataset.ptab; SFX.tap(); renderPrizes(); }); });
  $('prizes-close').addEventListener('click', closePrizes);
  $('missions-close').addEventListener('click', closeMissions);
  $('btn-prizes').addEventListener('click', function () { openPrizes(X.spins ? 'ruleta' : claimableCamino() ? 'camino' : null); });
  $('btn-missions').addEventListener('click', openMissions);
  // ===================== JARDÍN =====================
  var SEED_BY_ID = {}; SEEDS.forEach(function (s) { SEED_BY_ID[s.id] = s; });
  var choosingPlot = null;
  function plots() { if (!S.garden) S.garden = [null, null, null, null]; return S.garden; }
  // Avanza el crecimiento con el tiempo real. A la mitad, la planta tiene sed y se detiene.
  function growGarden(now) {
    plots().forEach(function (p) {
      if (!p) return;
      var sd = SEED_BY_ID[p.seed]; if (!sd) return;
      var total = sd.hours * 3600000, half = total / 2;
      if (!p.thirsty && p.grown < total) {
        p.grown += Math.max(0, now - p.ts);
        if (!p.watered && p.grown >= half) { p.grown = half; p.thirsty = true; }
        if (p.grown > total) p.grown = total;
      }
      p.ts = now;
    });
  }
  function plotState(p) {
    if (!p) return 'empty';
    var sd = SEED_BY_ID[p.seed], total = sd.hours * 3600000;
    if (p.grown >= total) return 'ready';
    if (p.thirsty) return 'thirsty';
    return p.grown < total * 0.25 ? 'sprout' : 'growing';
  }
  function timeLeft(p) {
    var sd = SEED_BY_ID[p.seed], ms = sd.hours * 3600000 - p.grown;
    if (!p.watered) ms -= sd.hours * 1800000;
    var m = Math.max(1, Math.ceil(ms / 60000));
    return m >= 60 ? Math.floor(m / 60) + ' h ' + (m % 60 ? (m % 60) + ' min' : '') : m + ' min';
  }
  function gardenCounts() {
    var r = { ready: 0, thirsty: 0, empty: 0 };
    plots().forEach(function (p, i) { if (S.level < PLOT_LEVEL[i]) return; var st = plotState(p); if (st === 'ready') r.ready++; else if (st === 'thirsty') r.thirsty++; else if (st === 'empty') r.empty++; });
    return r;
  }
  function plantSVG(p) {
    var st = plotState(p), sd = SEED_BY_ID[p.seed], h = '';
    var col = st === 'thirsty' ? '#b7a26a' : sd.color;
    if (st === 'sprout') h = '<path d="M40 40v-12" stroke="' + col + '" stroke-width="3"/><ellipse cx="34" cy="28" rx="6" ry="3.5" fill="' + col + '"/><ellipse cx="46" cy="28" rx="6" ry="3.5" fill="' + col + '"/>';
    else {
      var tall = st === 'growing' || st === 'thirsty' ? 26 : 40, droop = st === 'thirsty' ? 6 : 0;
      h = '<path d="M40 40V' + (40 - tall) + '" stroke="' + col + '" stroke-width="3.5"/>'
        + '<path d="M40 ' + (36 - tall / 2) + 'q-14 ' + (-6 + droop) + ' -18 ' + (4 + droop) + 'q10 2 18 -4z" fill="' + col + '"/><path d="M40 ' + (32 - tall / 3) + 'q14 ' + (-6 + droop) + ' 18 ' + (4 + droop) + 'q-10 2 -18 -4z" fill="' + col + '"/>';
      if (st === 'ready') {
        if (sd.id === 'sakura') h += '<circle cx="40" cy="' + (40 - tall) + '" r="16" fill="#ffc2d4" stroke="#111114" stroke-width="1.5"/><circle cx="32" cy="' + (36 - tall) + '" r="4" fill="#fff"/><circle cx="47" cy="' + (44 - tall) + '" r="4" fill="#fff"/>';
        else if (sd.id === 'chile') h += '<path d="M26 ' + (46 - tall) + 'q4 14 12 12q-6-4-8-14z" fill="#e2483d"/><path d="M52 ' + (44 - tall) + 'q-2 14-10 12q6-3 6-13z" fill="#e2483d"/>';
        else h += '<circle cx="30" cy="' + (44 - tall) + '" r="5" fill="' + sd.fruit + '" stroke="#111114" stroke-width="1.2"/><circle cx="50" cy="' + (40 - tall) + '" r="5" fill="' + sd.fruit + '" stroke="#111114" stroke-width="1.2"/><circle cx="40" cy="' + (34 - tall) + '" r="5" fill="' + sd.fruit + '" stroke="#111114" stroke-width="1.2"/>';
        h += '<path transform="translate(56 ' + (30 - tall) + ') scale(.55)" d="' + STAR_P + '" fill="#ffe08a" class="sparkle-plant"/>';
      }
      if (st === 'thirsty') h += '<path d="M62 ' + (28 - tall) + 'c-4 6-6 9-6 11a6 6 0 0012 0c0-2-2-5-6-11z" fill="#7cc8ff" stroke="#111114" stroke-width="1.5"/>';
    }
    return h;
  }
  function renderBeds() {
    var g = sceneEl.querySelector('#beds'); if (!g) return;
    var h = '';
    plots().forEach(function (p, i) {
      var b = BEDS[i], locked = S.level < PLOT_LEVEL[i];
      h += '<g transform="translate(' + b[0] + ' ' + (b[1] - 40) + ')">' + (p && !locked ? plantSVG(p) : '')
        + '<path d="M4 40h72l-6 24H10z" fill="' + (locked ? '#8a7a6a' : '#b06a3a') + '" stroke="#111114" stroke-width="2.5" stroke-linejoin="round"/><rect x="2" y="36" width="76" height="8" rx="3" fill="' + (locked ? '#9a8a7a' : '#c47b48') + '" stroke="#111114" stroke-width="2.5"/>'
        + (p && !locked ? '<ellipse cx="40" cy="40" rx="30" ry="3" fill="#5a3a22"/>' : '') + (locked ? '<text x="40" y="58" text-anchor="middle" class="bed-lock">Nv ' + PLOT_LEVEL[i] + '</text>' : '') + '</g>';
    });
    g.innerHTML = h;
  }
  function gardenPanel() {
    if (choosingPlot !== null) {
      return head('Elige semilla', '<button type="button" class="linkbtn" id="seed-back">Volver</button>') + '<div class="scroller">' + SEEDS.map(function (sd) {
        var locked = S.level < sd.level, y = sd.yield, what = y.coins ? y.coins + ' monedas' + (y.item ? ' + sorpresa' : '') : Object.keys(y.food).map(function (k) { return y.food[k] + ' ' + (FOOD_BY_ID[k] ? FOOD_BY_ID[k].name.toLowerCase() : k); }).join(', ');
        return '<button type="button" class="card seed' + (locked ? ' locked' : '') + '" data-seed="' + sd.id + '"><svg class="pic" viewBox="0 0 80 50" aria-hidden="true">' + plantSVG({ seed: sd.id, grown: sd.hours * 3600000, thirsty: false, watered: true }) + '</svg><span class="nm">' + sd.name + '</span><span class="fx-txt">' + sd.hours + ' h · ' + what + '</span>'
          + (locked ? '<span class="tag dim">Nivel ' + sd.level + '</span>' : '<span class="pr">' + COIN + sd.price + '</span>') + '</button>';
      }).join('') + '</div>';
    }
    return head('Jardín', 'Siembra, riega a la mitad y cosecha') + '<div class="scroller">' + plots().map(function (p, i) {
      var locked = S.level < PLOT_LEVEL[i], st = locked ? 'locked' : plotState(p), sd = p ? SEED_BY_ID[p.seed] : null;
      var pic = '<svg class="pic" viewBox="0 0 80 50" aria-hidden="true">' + (p && !locked ? plantSVG(p) : '<path d="M8 40h64l-5 10H13z" fill="#b06a3a"/>') + '</svg>';
      var txt = locked ? 'Maceta ' + (i + 1) : sd ? sd.name : 'Maceta vacía';
      var foot = locked ? '<span class="tag dim">Nivel ' + PLOT_LEVEL[i] + '</span>'
        : st === 'empty' ? '<span class="tag">Sembrar</span>'
        : st === 'ready' ? '<span class="tag gold">Cosechar</span>'
        : st === 'thirsty' ? '<span class="tag blue">Regar</span>'
        : '<span class="fx-txt">Faltan ' + timeLeft(p) + '</span>';
      return '<button type="button" class="card plot st-' + st + '" data-plot="' + i + '">' + pic + '<span class="nm">' + txt + '</span>' + foot + '</button>';
    }).join('') + '</div>';
  }
  function plotAction(i) {
    if (S.level < PLOT_LEVEL[i]) { say('Esa maceta se abre en el nivel ' + PLOT_LEVEL[i] + '.'); SFX.fail(); return; }
    var p = plots()[i], st = plotState(p);
    if (st === 'empty') { choosingPlot = i; SFX.tap(); renderPanel(); return; }
    if (st === 'thirsty') {
      p.thirsty = false; p.watered = true; p.ts = Date.now(); SFX.water(); say('¡Glu, glu! Ya no tiene sed.'); track('water'); gainXP(3); save(); renderBeds(); renderPanel(); return;
    }
    if (st === 'ready') {
      var sd = SEED_BY_ID[p.seed], y = sd.yield, lines = [];
      if (y.food) { addFood(y.food); lines.push(foodLine(y.food)); }
      if (y.coins) { S.coins += y.coins; lines.push(coinLine(y.coins)); }
      if (y.item && S.owned.indexOf(y.item) < 0) { S.owned.push(y.item); lines.push(unlockLine({ type: 'item', id: y.item })); }
      plots()[i] = null; SFX.good(); react('party'); track('harvest'); gainXP(sd.xp); save(); renderBeds(); renderPanel(); render();
      showModal('¡Cosecha de ' + sd.name.toLowerCase() + '!', '<div class="rw-list">' + lines.join('') + '</div>', '¡Rico!');
      return;
    }
    say('A ' + SEED_BY_ID[p.seed].name.toLowerCase() + ' le faltan ' + timeLeft(p) + '.');
  }
  function plantSeed(id) {
    var sd = SEED_BY_ID[id], i = choosingPlot;
    if (S.level < sd.level) { say('Esa semilla se desbloquea en el nivel ' + sd.level + '.'); SFX.fail(); return; }
    if (S.coins < sd.price) { say('Me faltan ' + (sd.price - S.coins) + ' monedas para esa semilla.'); SFX.fail(); return; }
    S.coins -= sd.price; plots()[i] = { seed: id, grown: 0, ts: Date.now(), thirsty: false, watered: false };
    choosingPlot = null; SFX.good(); react('jump'); say('¡Sembrado! Vuelve a regarla cuando tenga sed.'); track('plant');
    save(); renderBeds(); renderPanel(); render();
  }

  // ===================== RANKING =====================
  var RANK_NAMES = { catch: 'Atrapa rollos', fly: 'Hoshito vuela', memo: 'Memorama', chef: 'Arma el rollo', run: 'Hoshito corre', simon: 'Hoshi dice' };
  var rankData = null, rankGame = 'catch';
  function submitScore(game, score) {
    if (!(score > 0)) return;
    fetch(cfg.api + '/score', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ game: game, score: score }) }).catch(function () {});
  }
  function renderRanking() {
    var box = $('ranking-body');
    if (!rankData) { box.innerHTML = '<p class="hint center">Cargando…</p>'; return; }
    var h = '';
    if (rankData.pending && rankData.pending.length) {
      h += '<div class="mission bonus"><div class="m-top"><b>¡Quedaste en el podio la semana pasada!</b></div><p class="hint left">' + rankData.pending.map(function (t) { return t.place + '.º en ' + RANK_NAMES[t.game]; }).join(' · ') + '</p><button type="button" class="btn primary" id="rk-claim">Cobrar premios</button></div>';
    }
    h += '<div class="chips-row">' + Object.keys(RANK_NAMES).map(function (g) { return '<button type="button" class="chip-g' + (g === rankGame ? ' on' : '') + '" data-rg="' + g + '">' + RANK_NAMES[g] + '</button>'; }).join('') + '</div>';
    var d = rankData.games[rankGame], unit = rankGame === 'memo' ? ' movs' : rankGame === 'run' ? ' m' : '';
    h += '<ol class="rank">';
    if (!d.top.length) h += '<li class="empty">Nadie ha jugado esta semana. ¡Sé el primero!</li>';
    d.top.forEach(function (r) { h += '<li class="' + (r.me ? 'me' : '') + '"><span class="pos p' + r.place + '">' + r.place + '</span><span class="who">' + r.name + (r.me ? ' (tú)' : '') + '</span><b>' + r.score + unit + '</b></li>'; });
    h += '</ol><p class="hint center">' + (d.mine != null ? 'Tu mejor marca esta semana: <b>' + d.mine + unit + '</b>' + (d.place ? ' · lugar ' + d.place : '') : 'Aún no tienes marca esta semana en este juego.') + '</p>'
      + '<p class="hint center">Cada lunes se reinicia. Los 3 primeros de cada juego ganan ' + RANK_PRIZES_TXT + ', y el primer lugar se lleva la medalla de campeón.' + (rankGame === 'memo' ? ' En memorama gana quien usa menos movimientos.' : '') + '</p>';
    box.innerHTML = h;
    box.querySelectorAll('[data-rg]').forEach(function (b) { b.addEventListener('click', function () { rankGame = b.dataset.rg; SFX.tap(); renderRanking(); }); });
    if ($('rk-claim')) $('rk-claim').addEventListener('click', function () {
      this.disabled = true;
      fetch(cfg.api + '/ranking', { method: 'POST', credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (res) {
        if (!res || !res.ok) return loadRanking();
        S.coins += res.coins; var lines = [coinLine(res.coins)];
        if (res.medal) { if (X.owned.indexOf('medalla-oro') < 0) X.owned.push('medalla-oro'); S.wear.neck = 'medalla-oro'; lines.push(unlockLine({ type: 'item', id: 'medalla-oro' })); }
        save(); renderWear(); render(); SFX.level(); react('star');
        showModal('¡Premios del podio!', '<div class="rw-list">' + lines.join('') + '</div>', '¡A defender el título!', loadRanking);
      }).catch(loadRanking);
    });
  }
  var RANK_PRIZES_TXT = '150, 80 y 40 monedas';
  function loadRanking() {
    return fetch(cfg.api + '/ranking', { credentials: 'same-origin', cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) { if (d && d.ok) { rankData = d; renderRanking(); } }).catch(function () {});
  }
  function openRanking() { SFX.tap(); busyLayer = true; $('ranking').hidden = false; renderRanking(); loadRanking(); }
  $('ranking-close').addEventListener('click', function () { $('ranking').hidden = true; busyLayer = !$('game').hidden || !$('shop').hidden || !$('modal').hidden || !$('prizes').hidden || !$('missions').hidden; SFX.tap(); });

  // ===================== AL VOLVER =====================
  function welcomeBack(awayMs) {
    var g = gardenCounts(), parts = [];
    if (X.spins) parts.push(X.spins === 1 ? '1 giro de la ruleta' : X.spins + ' giros de la ruleta');
    if (g.ready) parts.push(g.ready === 1 ? '1 planta lista' : g.ready + ' plantas listas');
    if (g.thirsty) parts.push(g.thirsty === 1 ? '1 planta con sed' : g.thirsty + ' plantas con sed');
    if (missionsReady()) parts.push('misiones por cobrar');
    var l = awayMs > 3 * 3600000 ? '¡Te extrañé! ' : '';
    if (parts.length) say(l + 'Tienes ' + parts.join(', ') + '.', 6000);
    else if (l) say(l + (needLine() || '¿Qué hacemos hoy?'), 5000);
  }
  // ===================== MINIJUEGOS =====================
  var ringImg = new Image(); ringImg.src = RING;
  var hatCache = {};
  function hatImage() {
    var h = itemById(S.wear.head); if (!h) return null;
    if (!hatCache[h.id]) {
      var im = new Image();
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + h.vb + '">' + h.svg + '</svg>');
      var p = h.vb.split(' ').map(Number);
      hatCache[h.id] = { img: im, w: h.w, b: h.b, ar: p[3] / p[2] };
    }
    return hatCache[h.id];
  }
  // Dibuja a Hoshito en un canvas. mood: normal | happy | hurt
  function drawHoshito(ctx, x, y, r, mood, rot, ringRot) {
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot);
    if (ringImg.complete && ringImg.naturalWidth) { if (ringRot) { ctx.save(); ctx.rotate(ringRot); } ctx.drawImage(ringImg, -r, -r, r * 2, r * 2); if (ringRot) ctx.restore(); }
    else { ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fillStyle = '#111114'; ctx.fill(); }
    ctx.beginPath(); ctx.arc(0, 0, r * 0.59, 0, 7); ctx.fillStyle = mood === 'hurt' ? '#ffd8cf' : '#fff'; ctx.fill();
    ctx.lineWidth = r * 0.03; ctx.strokeStyle = '#111114'; ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0, 7); ctx.stroke();
    var k = r / 40;
    ctx.fillStyle = '#c2e8aa'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-12 * k, -17 * k, 13 * k, 12 * k, 4 * k) : ctx.rect(-12 * k, -17 * k, 13 * k, 12 * k); ctx.fill();
    ctx.fillStyle = '#f6a65c'; ctx.beginPath(); ctx.arc(9 * k, 4 * k, 6 * k, 0, 7); ctx.fill();
    ctx.fillStyle = '#ffb3c4'; ctx.beginPath(); ctx.ellipse(-15 * k, 6 * k, 4.5 * k, 3 * k, 0, 0, 7); ctx.ellipse(15 * k, 6 * k, 4.5 * k, 3 * k, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#111114'; ctx.strokeStyle = '#111114'; ctx.lineWidth = 2.6 * k; ctx.lineCap = 'round';
    if (mood === 'hurt') { ctx.beginPath(); ctx.moveTo(-11 * k, -7 * k); ctx.lineTo(-5 * k, -4 * k); ctx.lineTo(-11 * k, -1 * k); ctx.moveTo(11 * k, -7 * k); ctx.lineTo(5 * k, -4 * k); ctx.lineTo(11 * k, -1 * k); ctx.stroke(); }
    else if (mood === 'happy') { ctx.beginPath(); ctx.arc(-8 * k, -2 * k, 4 * k, Math.PI, 0); ctx.moveTo(4 * k, -2 * k); ctx.arc(8 * k, -2 * k, 4 * k, Math.PI, 0); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(-8 * k, -4 * k, 4.4 * k, 0, 7); ctx.arc(8 * k, -4 * k, 4.4 * k, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-9.5 * k, -5.5 * k, 1.5 * k, 0, 7); ctx.arc(6.5 * k, -5.5 * k, 1.5 * k, 0, 7); ctx.fill(); ctx.fillStyle = '#111114'; }
    if (mood === 'hurt') { ctx.beginPath(); ctx.ellipse(0, 7 * k, 3.5 * k, 4 * k, 0, 0, 7); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-6 * k, 5 * k); ctx.lineTo(6 * k, 5 * k); ctx.arc(0, 5 * k, 6 * k, 0, Math.PI); ctx.fill(); }
    var hat = hatImage();
    if (hat && hat.img.complete && hat.img.naturalWidth) {
      var hw = r * 2 * hat.w / 100, hh = hw * hat.ar, bottom = r - hat.b / 100 * 2 * r;
      ctx.drawImage(hat.img, -hw / 2, bottom - hh, hw, hh);
    }
    ctx.restore();
  }
  function makeCanvas(area) {
    var cv = document.createElement('canvas'), d = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = 360 * d; cv.height = 520 * d;
    var ctx = cv.getContext('2d'); ctx.setTransform(d, 0, 0, d, 0, 0);
    area.appendChild(cv);
    return { cv: cv, ctx: ctx, px: function (e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * 360, y: (e.clientY - r.top) / r.height * 520 }; } };
  }
  function livesHTML(n, max) {
    var h = '<span class="lives" aria-label="Vidas: ' + n + '">';
    for (var i = 0; i < max; i++) h += '<svg viewBox="0 0 24 24" class="' + (i < n ? '' : 'off') + '" aria-hidden="true"><path fill="currentColor" d="' + HEART_PATH + '"/></svg>';
    return h + '</span>';
  }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function rollDraw(ctx, x, y, gold) {
    ctx.beginPath(); ctx.arc(x, y, 15, 0, 7); ctx.fillStyle = gold ? '#ffd54a' : '#111114'; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = gold ? '#b8860b' : '#f5f2ec'; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath(); ctx.arc(x - 2, y - 1, 4, 0, 7); ctx.fillStyle = '#ff9f7a'; ctx.fill();
    ctx.beginPath(); ctx.arc(x + 3, y + 3, 3, 0, 7); ctx.fillStyle = '#c2e8aa'; ctx.fill();
  }

  var GAMES = [
    { id: 'catch', name: 'Atrapa rollos', short: 'Atrapa, esquiva el wasabi', help: 'Mueve a Hoshito con el dedo. Atrapa rollos y esquiva el wasabi.',
      icon: '<rect width="40" height="40" rx="10" fill="#2f5a4c"/><circle cx="14" cy="12" r="6" fill="#111114" stroke="#fff" stroke-width="1.2"/><circle cx="14" cy="12" r="3.6" fill="#fff"/><circle cx="27" cy="18" r="5" fill="#ffd54a" stroke="#b8860b" stroke-width="1.2"/><circle cx="20" cy="31" r="7" fill="#111114" stroke="#fff" stroke-width="1.5"/><circle cx="20" cy="31" r="4.2" fill="#fff"/>',
      start: function (area, api) {
        var C = makeCanvas(area), ctx = C.ctx, W = 360, H = 520, hy = H - 70, raf = 0, stopped = false;
        var G = { x: W / 2, tx: W / 2, items: [], score: 0, coins: 0, lives: 3, t: 0, spawn: 0.4, last: performance.now(), hurt: 0, happy: 0, pops: [] };
        api.extra(livesHTML(3, 3));
        function mv(e) { G.tx = C.px(e).x; }
        C.cv.addEventListener('pointerdown', mv); C.cv.addEventListener('pointermove', mv);
        function spawn() {
          var r = Math.random(), lvl = Math.min(G.t / 60, 1);
          var type = r < 0.05 ? 'gold' : r < 0.07 && G.lives < 3 ? 'heart' : r < 0.24 + lvl * 0.14 ? 'wasabi' : 'roll';
          G.items.push({ x: 24 + Math.random() * (W - 48), y: -20, vy: 120 + Math.random() * 60 + G.t * 3.2, type: type, rot: Math.random() * 6 });
        }
        function loop(now) {
          if (stopped) return;
          var dt = Math.min(0.05, (now - G.last) / 1000); G.last = now; G.t += dt; G.spawn -= dt;
          if (G.spawn <= 0) { spawn(); G.spawn = Math.max(0.36, 0.95 - G.t * 0.012); }
          G.x += (G.tx - G.x) * Math.min(1, dt * 14); G.x = Math.max(36, Math.min(W - 36, G.x));
          for (var i = G.items.length - 1; i >= 0; i--) {
            var it = G.items[i]; it.y += it.vy * dt; it.rot += dt * 2;
            var dx = it.x - G.x, dy = it.y - hy;
            if (dx * dx + dy * dy < 46 * 46) {
              G.items.splice(i, 1);
              if (it.type === 'wasabi') { G.lives--; G.hurt = 0.5; SFX.fail(); api.extra(livesHTML(G.lives, 3)); if (G.lives <= 0) { stopped = true; draw(); return api.end(G.score, G.coins); } }
              else if (it.type === 'heart') { G.lives = Math.min(3, G.lives + 1); SFX.good(); api.extra(livesHTML(G.lives, 3)); G.pops.push({ x: it.x, y: it.y, t: 0, txt: '+1 vida' }); }
              else { var c = it.type === 'gold' ? 3 : 1; G.score++; G.coins += c; G.happy = 0.35; SFX.pop(); api.score(G.score); G.pops.push({ x: it.x, y: it.y, t: 0, txt: '+' + c }); }
            } else if (it.y > H + 30) G.items.splice(i, 1);
          }
          G.hurt = Math.max(0, G.hurt - dt); G.happy = Math.max(0, G.happy - dt);
          G.pops.forEach(function (p) { p.t += dt; }); G.pops = G.pops.filter(function (p) { return p.t < 0.8; });
          draw(); raf = requestAnimationFrame(loop);
        }
        function draw() {
          ctx.fillStyle = '#efcf9f'; ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = '#f6e3c3'; for (var y = 300; y < H - 40; y += 24) for (var x = (y / 24 % 2) * 12; x < W; x += 24) ctx.fillRect(x, y, 20, 20);
          ctx.fillStyle = '#9b6a43'; ctx.fillRect(0, H - 44, W, 8); ctx.fillStyle = '#5f8f6e'; ctx.fillRect(0, H - 36, W, 36);
          G.items.forEach(function (it) {
            if (it.type === 'wasabi') {
              ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(Math.sin(it.rot) * 0.3);
              ctx.beginPath(); ctx.moveTo(0, -17); ctx.bezierCurveTo(12, -12, 17, 2, 13, 11); ctx.bezierCurveTo(8, 18, -8, 18, -13, 11); ctx.bezierCurveTo(-17, 2, -12, -12, 0, -17);
              ctx.fillStyle = '#8fc93a'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#4e7a1c'; ctx.stroke();
              ctx.fillStyle = '#1d2a10'; ctx.beginPath(); ctx.arc(-5, 2, 2.2, 0, 7); ctx.arc(5, 2, 2.2, 0, 7); ctx.fill();
              ctx.strokeStyle = '#1d2a10'; ctx.beginPath(); ctx.moveTo(-8, -4); ctx.lineTo(-2, -1); ctx.moveTo(8, -4); ctx.lineTo(2, -1); ctx.stroke(); ctx.restore();
            } else if (it.type === 'heart') {
              ctx.save(); ctx.translate(it.x - 14, it.y - 14); ctx.scale(1.2, 1.2); ctx.fillStyle = '#ff5f86'; ctx.fill(new Path2D(HEART_PATH)); ctx.restore();
            } else rollDraw(ctx, it.x, it.y, it.type === 'gold');
          });
          drawHoshito(ctx, G.x + (G.hurt > 0 ? Math.sin(G.hurt * 60) * 4 : 0), hy, 40, G.hurt > 0 ? 'hurt' : G.happy > 0 ? 'happy' : 'normal');
          ctx.font = '800 22px ' + FONT; ctx.textAlign = 'center';
          G.pops.forEach(function (p) { ctx.globalAlpha = 1 - p.t / 0.8; ctx.fillStyle = '#111114'; ctx.fillText(p.txt, p.x + 1, p.y - p.t * 50 + 1); ctx.fillStyle = '#ffd54a'; ctx.fillText(p.txt, p.x, p.y - p.t * 50); });
          ctx.globalAlpha = 1;
        }
        raf = requestAnimationFrame(loop);
        return function () { stopped = true; cancelAnimationFrame(raf); };
      } },

    { id: 'fly', name: 'Hoshito vuela', short: 'Vuela entre los palillos', help: 'Toca para que Hoshito aletee. No choques con los palillos.',
      icon: '<rect width="40" height="40" rx="10" fill="#8fd0f0"/><rect x="26" y="0" width="5" height="14" fill="#b07a52"/><rect x="32" y="0" width="5" height="14" fill="#c48d62"/><rect x="26" y="27" width="5" height="13" fill="#b07a52"/><rect x="32" y="27" width="5" height="13" fill="#c48d62"/><ellipse cx="8" cy="18" rx="5" ry="3" fill="#fff"/><circle cx="14" cy="21" r="8" fill="#111114" stroke="#fff" stroke-width="1.4"/><circle cx="14" cy="21" r="4.6" fill="#fff"/>',
      start: function (area, api) {
        var C = makeCanvas(area), ctx = C.ctx, W = 360, H = 520, GY = H - 56, raf = 0, stopped = false;
        var F = { y: H / 2 - 30, vy: 0, state: 'ready', t: 0, pipes: [], next: 0, score: 0, last: performance.now(), dead: 0, gx: 0, clouds: [[40, 80], [210, 130], [320, 60]] };
        var X = 110, R = 24;
        function flap() {
          if (F.state === 'dead') return;
          if (F.state === 'ready') { F.state = 'play'; F.next = 0.9; }
          F.vy = -430; SFX.flap();
        }
        C.cv.addEventListener('pointerdown', function (e) { e.preventDefault(); flap(); });
        function key(e) { if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); flap(); } }
        window.addEventListener('keydown', key);
        function loop(now) {
          if (stopped) return;
          var dt = Math.min(0.04, (now - F.last) / 1000); F.last = now; F.t += dt;
          var speed = Math.min(240, 150 + F.score * 3);
          if (F.state !== 'dead') { F.gx = (F.gx + speed * dt) % 24; F.clouds.forEach(function (c) { c[0] -= speed * 0.15 * dt; if (c[0] < -60) c[0] = W + 40; }); }
          if (F.state === 'ready') F.y = H / 2 - 30 + Math.sin(F.t * 4) * 8;
          else {
            F.vy += 1450 * dt; F.y += F.vy * dt;
            if (F.state === 'play') {
              F.next -= dt;
              if (F.next <= 0) { var gap = Math.max(128, 160 - F.score * 1.5), top = 70 + Math.random() * (GY - 140 - gap); F.pipes.push({ x: W + 30, top: top, gap: gap, passed: false }); F.next = Math.max(1.15, 1.6 - F.score * 0.02); }
              F.pipes.forEach(function (p) {
                p.x -= speed * dt;
                if (!p.passed && p.x + 17 < X) { p.passed = true; F.score++; api.score(F.score); SFX.pop(); }
                if (X + R - 6 > p.x - 17 && X - R + 6 < p.x + 17 && (F.y - R + 6 < p.top || F.y + R - 6 > p.top + p.gap)) die();
              });
              F.pipes = F.pipes.filter(function (p) { return p.x > -50; });
              if (F.y - R < 0) { F.y = R; F.vy = 0; }
            }
            if (F.y + R > GY) { F.y = GY - R; if (F.state === 'play') die(); }
            if (F.state === 'dead') { F.dead += dt; if (F.dead > 0.9) { stopped = true; draw(); return api.end(F.score, F.score); } }
          }
          draw(); raf = requestAnimationFrame(loop);
        }
        function die() { if (F.state === 'dead') return; F.state = 'dead'; F.vy = -200; SFX.fail(); }
        function stick(x, y0, y1, tipUp) {
          [[x - 13, '#b07a52'], [x + 1, '#c48d62']].forEach(function (s) {
            ctx.fillStyle = s[1]; ctx.fillRect(s[0], y0, 12, y1 - y0);
            ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(s[0] + 2, y0, 3, y1 - y0);
            ctx.fillStyle = '#e2483d'; ctx.fillRect(s[0], tipUp ? y1 - 26 : y0, 12, 26);
          });
        }
        function draw() {
          ctx.fillStyle = '#8fd0f0'; ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = '#ffe08a'; ctx.beginPath(); ctx.arc(300, 70, 26, 0, 7); ctx.fill();
          ctx.fillStyle = '#6aa8c9'; ctx.beginPath(); ctx.moveTo(30, GY); ctx.lineTo(170, GY - 170); ctx.lineTo(310, GY); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(140, GY - 140); ctx.lineTo(170, GY - 170); ctx.lineTo(200, GY - 140); ctx.lineTo(185, GY - 132); ctx.lineTo(170, GY - 142); ctx.lineTo(155, GY - 132); ctx.fill();
          ctx.fillStyle = '#fff'; F.clouds.forEach(function (c) { ctx.beginPath(); ctx.ellipse(c[0], c[1], 30, 12, 0, 0, 7); ctx.ellipse(c[0] + 18, c[1] - 6, 18, 11, 0, 0, 7); ctx.fill(); });
          F.pipes.forEach(function (p) { stick(p.x, 0, p.top, true); stick(p.x, p.top + p.gap, GY, false); });
          ctx.fillStyle = '#7cc35a'; ctx.fillRect(0, GY, W, 10); ctx.fillStyle = '#c98f5a'; ctx.fillRect(0, GY + 10, W, H - GY);
          ctx.fillStyle = '#b37a48'; for (var x = -F.gx; x < W; x += 24) ctx.fillRect(x, GY + 22, 12, 6);
          var wing = Math.sin(F.t * (F.state === 'dead' ? 0 : 22)) * 8;
          ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111114'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.ellipse(X - R - 4, F.y - 4 + wing * 0.5, 13, 7, -0.5 + wing * 0.04, 0, 7); ctx.fill(); ctx.stroke();
          drawHoshito(ctx, X, F.y, R, F.state === 'dead' ? 'hurt' : F.vy < -100 ? 'happy' : 'normal', Math.max(-0.4, Math.min(0.9, F.vy / 700)));
          if (F.state === 'ready') {
            ctx.fillStyle = 'rgba(11,18,16,0.6)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(70, 330, 220, 48, 24) : ctx.rect(70, 330, 220, 48); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = '800 22px ' + FONT; ctx.textAlign = 'center'; ctx.fillText('TOCA PARA VOLAR', 180, 362);
          }
          ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111114'; ctx.lineWidth = 5; ctx.font = '800 52px ' + FONT; ctx.textAlign = 'center';
          if (F.state !== 'ready') { ctx.strokeText(F.score, W / 2, 70); ctx.fillText(F.score, W / 2, 70); }
        }
        raf = requestAnimationFrame(loop);
        return function () { stopped = true; cancelAnimationFrame(raf); window.removeEventListener('keydown', key); };
      } },

    { id: 'memo', name: 'Memorama', short: 'Encuentra los pares', help: 'Voltea dos cartas a la vez y encuentra los 8 pares.', lower: true, unit: ' movs',
      icon: '<rect width="40" height="40" rx="10" fill="#7a6bb3"/><rect x="6" y="8" width="13" height="18" rx="3" fill="#2f5a4c" stroke="#fff" stroke-width="1.5"/><rect x="21" y="14" width="13" height="18" rx="3" fill="#f5f2ec" stroke="#fff" stroke-width="1.5"/><circle cx="27.5" cy="23" r="4.5" fill="#111114"/><circle cx="27.5" cy="23" r="2.6" fill="#fff"/>',
      start: function (area, api) {
        var picks = shuffle(FOODS.slice()).slice(0, 8), deck = shuffle(picks.concat(picks)), open = [], lock = false, moves = 0, found = 0, t0 = Date.now(), stopped = false;
        var back = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#bfe8cc" d="M12 1l3.1 6.9 7.5.8-5.6 5 1.6 7.4L12 17.3 5.4 21.1 7 13.7 1.4 8.7l7.5-.8z"/></svg>';
        var grid = document.createElement('div'); grid.className = 'memo';
        grid.innerHTML = deck.map(function (f, i) { return '<button type="button" class="mcard" data-i="' + i + '" aria-label="Carta ' + (i + 1) + '"><span class="in"><span class="bk">' + back + '</span><span class="fr"><svg viewBox="0 0 40 40" aria-hidden="true">' + f.svg + '</svg></span></span></button>'; }).join('');
        area.appendChild(grid);
        var timer = setInterval(function () { api.extra('<span class="badge">' + Math.floor((Date.now() - t0) / 1000) + ' s</span>'); }, 500);
        api.extra('<span class="badge">0 s</span>');
        grid.addEventListener('click', function (e) {
          var b = e.target.closest('.mcard'); if (!b || lock || stopped) return;
          if (b.classList.contains('up') || b.classList.contains('done')) return;
          b.classList.add('up'); b.setAttribute('aria-label', deck[+b.dataset.i].name); open.push(b); SFX.tap();
          if (open.length === 2) {
            moves++; api.score(moves); lock = true;
            var a = open[0], c = open[1];
            if (deck[+a.dataset.i].id === deck[+c.dataset.i].id) {
              setTimeout(function () {
                a.classList.add('done'); c.classList.add('done'); open = []; lock = false; found++; SFX.good();
                if (found === 8) { stopped = true; clearInterval(timer); setTimeout(function () { api.end(moves, Math.max(6, 30 - (moves - 8) * 2)); }, 600); }
              }, 300);
            } else {
              setTimeout(function () { a.classList.remove('up'); c.classList.remove('up'); a.setAttribute('aria-label', 'Carta'); c.setAttribute('aria-label', 'Carta'); open = []; lock = false; }, 800);
            }
          }
        });
        return function () { stopped = true; clearInterval(timer); };
      } },

    { id: 'chef', name: 'Arma el rollo', short: 'Prepara las órdenes', help: 'Toca los ingredientes en el orden del ticket antes de que se acabe el tiempo.',
      icon: '<rect width="40" height="40" rx="10" fill="#f2a65a"/><rect x="7" y="6" width="26" height="16" rx="3" fill="#fffdf7"/><circle cx="13" cy="14" r="3.5" fill="#fff" stroke="#cfc8b8"/><rect x="18" y="10.5" width="6" height="7" rx="1" fill="#24352f"/><path d="M26 16c1-4 6-4 6-1z" fill="#ff8a5c"/><circle cx="20" cy="30" r="7" fill="#111114" stroke="#fff" stroke-width="1.5"/><circle cx="20" cy="30" r="4.2" fill="#fff"/><circle cx="19" cy="29" r="1.8" fill="#ff9f7a"/>',
      start: function (area, api) {
        var T = 45, left = T, strikes = 0, orders = 0, coins = 0, order = [], pos = 0, stopped = false;
        var box = document.createElement('div'); box.className = 'chef';
        box.innerHTML = '<div class="timebar"><i id="ch-time" style="width:100%"></i></div><div class="ticket"><div class="th"><span id="ch-num">Orden 1</span><span>Hoshi Sushi Roll</span></div><div class="order" id="ch-order"></div></div><p class="chef-msg" id="ch-msg" aria-live="polite"></p><div class="ings" id="ch-ings">'
          + INGREDIENTS.map(function (g, i) { return '<button type="button" class="ingbtn" data-g="' + i + '"><svg viewBox="0 0 40 40" aria-hidden="true">' + g.svg + '</svg><span>' + g.name + '</span></button>'; }).join('') + '</div>';
        area.appendChild(box);
        var q = function (id) { return box.querySelector('#' + id); };
        api.extra(livesHTML(3, 3));
        function newOrder() {
          var n = Math.min(3 + Math.floor(orders / 2), 6);
          order = shuffle(INGREDIENTS.slice()).slice(0, n); pos = 0;
          q('ch-num').textContent = 'Orden ' + (orders + 1);
          drawOrder();
        }
        function drawOrder() {
          q('ch-order').innerHTML = order.map(function (g, i) { return '<span class="ing' + (i < pos ? ' ok' : i === pos ? ' next' : '') + '" title="' + g.name + '"><svg viewBox="0 0 40 40" aria-hidden="true">' + g.svg + '</svg></span>'; }).join('');
        }
        box.querySelector('#ch-ings').addEventListener('click', function (e) {
          var b = e.target.closest('.ingbtn'); if (!b || stopped) return;
          var g = INGREDIENTS[+b.dataset.g];
          if (g.id === order[pos].id) {
            pos++; SFX.tap(); drawOrder();
            if (pos === order.length) {
              orders++; coins += order.length; left = Math.min(T, left + 3); api.score(orders); SFX.good();
              q('ch-msg').textContent = '¡Orden lista! +' + order.length;
              setTimeout(function () { if (!stopped) { q('ch-msg').textContent = ''; newOrder(); } }, 450);
            }
          } else {
            strikes++; SFX.fail(); api.extra(livesHTML(3 - strikes, 3));
            b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
            q('ch-msg').textContent = 'Ese no va ahí…';
            if (strikes >= 3) finish();
          }
        });
        var iv = setInterval(function () {
          left -= 0.1; q('ch-time').style.width = Math.max(0, left / T * 100) + '%';
          if (left <= 0) finish();
        }, 100);
        function finish() { if (stopped) return; stopped = true; clearInterval(iv); api.end(orders, coins); }
        newOrder();
        return function () { stopped = true; clearInterval(iv); };
      } },
    { id: 'run', name: 'Hoshito corre', short: 'Rueda y salta obstáculos', help: 'Toca para saltar (doble toque: salto doble). Junta monedas y esquiva todo.',
      icon: '<rect width="40" height="40" rx="10" fill="#ffd9a8"/><rect x="0" y="30" width="40" height="10" fill="#3a3f4a"/><path d="M4 35h6M16 35h6M28 35h6" stroke="#ffe08a" stroke-width="2"/><circle cx="14" cy="22" r="8" fill="#111114" stroke="#fff" stroke-width="1.4"/><circle cx="14" cy="22" r="4.6" fill="#fff"/><path d="M27 30c0-5 3-8 6-8s4 3 4 8z" fill="#8fc93a" stroke="#4e7a1c"/><circle cx="26" cy="11" r="3.5" fill="#ffd54a" stroke="#b8860b"/>',
      start: function (area, api) {
        var C = makeCanvas(area), ctx = C.ctx, W = 360, H = 520, GY = H - 92, X = 92, R = 30, raf = 0, stopped = false;
        var G = { y: GY - R, vy: 0, jumps: 0, state: 'ready', t: 0, dist: 0, speed: 250, obs: [], coins: [], got: 0, next: 300, last: performance.now(), dead: 0, rot: 0, pops: [] };
        var far = [], near = [];
        for (var i = 0; i < 8; i++) { far.push({ x: i * 60, h: 60 + Math.random() * 70, w: 46 + Math.random() * 20 }); near.push({ x: i * 90, h: 90 + Math.random() * 80, w: 70 + Math.random() * 20 }); }
        function jump() {
          if (G.state === 'dead') return;
          if (G.state === 'ready') { G.state = 'play'; }
          if (G.jumps < 2) { G.vy = G.jumps === 0 ? -760 : -640; G.jumps++; SFX.jump(); }
        }
        C.cv.addEventListener('pointerdown', function (e) { e.preventDefault(); jump(); });
        function key(e) { if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); jump(); } }
        window.addEventListener('keydown', key);
        function spawn() {
          var k = Math.random(), o;
          if (k < 0.4) o = { type: 'wasabi', w: 36, h: 30 };
          else if (k < 0.72) o = { type: 'soya', w: 24, h: 52 };
          else o = { type: 'palillos', w: 30, h: 70 };
          o.x = W + 40; G.obs.push(o);
          if (Math.random() < 0.7) { var n = 3 + Math.floor(Math.random() * 3); for (var j = 0; j < n; j++) G.coins.push({ x: W + 40 - (n - 1) * 15 + j * 30, y: GY - o.h - 50 - Math.sin(j / (n - 1) * Math.PI) * 40 }); }
          else for (var q = 0; q < 4; q++) G.coins.push({ x: W + 160 + q * 30, y: GY - 26 });
          G.next = 230 + Math.random() * 230 + G.speed * 0.35;
        }
        function hit(o) {
          var cx = Math.max(o.x - o.w / 2, Math.min(X, o.x + o.w / 2)), cy = Math.max(GY - o.h, Math.min(G.y, GY));
          var dx = X - cx, dy = G.y - cy; return dx * dx + dy * dy < (R - 7) * (R - 7);
        }
        function loop(now) {
          if (stopped) return;
          var dt = Math.min(0.04, (now - G.last) / 1000); G.last = now; G.t += dt;
          if (G.state === 'play') {
            G.speed = Math.min(540, 250 + G.t * 7);
            var dx = G.speed * dt; G.dist += dx; G.rot += dx / R;
            G.next -= dx; if (G.next <= 0) spawn();
            G.obs.forEach(function (o) { o.x -= dx; if (hit(o)) die(); });
            G.obs = G.obs.filter(function (o) { return o.x > -60; });
            for (var i = G.coins.length - 1; i >= 0; i--) {
              var c = G.coins[i]; c.x -= dx;
              var ddx = c.x - X, ddy = c.y - G.y;
              if (ddx * ddx + ddy * ddy < (R + 10) * (R + 10)) { G.coins.splice(i, 1); G.got++; SFX.pop(); G.pops.push({ x: c.x, y: c.y, t: 0 }); }
              else if (c.x < -20) G.coins.splice(i, 1);
            }
            api.score(Math.floor(G.dist / 30));
            far.forEach(function (b) { b.x -= dx * 0.15; if (b.x < -80) b.x += 480; });
            near.forEach(function (b) { b.x -= dx * 0.4; if (b.x < -100) b.x += 720; });
          }
          if (G.state !== 'ready') {
            G.vy += 2300 * dt; G.y += G.vy * dt;
            if (G.y >= GY - R) { G.y = GY - R; G.vy = 0; G.jumps = 0; }
          } else G.y = GY - R - Math.abs(Math.sin(G.t * 5)) * 10;
          if (G.state === 'dead') { G.dead += dt; if (G.dead > 0.9) { stopped = true; draw(); var sc = Math.floor(G.dist / 30); return api.end(sc, Math.floor(G.got / 2) + Math.floor(sc / 50)); } }
          G.pops.forEach(function (p) { p.t += dt; }); G.pops = G.pops.filter(function (p) { return p.t < 0.6; });
          draw(); raf = requestAnimationFrame(loop);
        }
        function die() { if (G.state !== 'play') return; G.state = 'dead'; G.vy = -420; SFX.fail(); }
        function draw() {
          ctx.fillStyle = '#ffd9a8'; ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = '#ffe9a8'; ctx.beginPath(); ctx.arc(260, 120, 48, 0, 7); ctx.fill();
          ctx.fillStyle = '#e8a07a'; far.forEach(function (b) { ctx.fillRect(b.x, GY - 40 - b.h, b.w, b.h + 40); });
          near.forEach(function (b) {
            ctx.fillStyle = '#b8675a'; ctx.fillRect(b.x, GY - 20 - b.h, b.w, b.h + 20);
            ctx.fillStyle = '#ffe08a'; for (var wy = GY - b.h; wy < GY - 30; wy += 26) for (var wx = b.x + 10; wx < b.x + b.w - 14; wx += 20) ctx.fillRect(wx, wy, 9, 12);
            ctx.fillStyle = '#e2483d'; ctx.beginPath(); ctx.ellipse(b.x + b.w / 2, GY - 20 - b.h - 10, 8, 10, 0, 0, 7); ctx.fill();
          });
          ctx.fillStyle = '#9aa3ad'; ctx.fillRect(0, GY, W, 14);
          ctx.fillStyle = '#3a3f4a'; ctx.fillRect(0, GY + 14, W, H - GY - 14);
          ctx.fillStyle = '#ffe08a'; var off = G.dist % 60; for (var lx = -off; lx < W; lx += 60) ctx.fillRect(lx, GY + 46, 30, 5);
          G.coins.forEach(function (c) { ctx.beginPath(); ctx.arc(c.x, c.y, 10, 0, 7); ctx.fillStyle = '#ffd54a'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = '#b8860b'; ctx.stroke(); ctx.fillStyle = '#b8860b'; ctx.fillRect(c.x - 1.5, c.y - 5, 3, 10); });
          G.obs.forEach(function (o) {
            var bx = o.x - o.w / 2, by = GY - o.h;
            if (o.type === 'wasabi') {
              ctx.fillStyle = '#8fc93a'; ctx.strokeStyle = '#4e7a1c'; ctx.lineWidth = 2.5;
              ctx.beginPath(); ctx.moveTo(bx, GY); ctx.bezierCurveTo(bx, by - 4, bx + o.w, by - 4, bx + o.w, GY); ctx.closePath(); ctx.fill(); ctx.stroke();
              ctx.fillStyle = '#1d2a10'; ctx.beginPath(); ctx.arc(o.x - 6, GY - 14, 2.4, 0, 7); ctx.arc(o.x + 6, GY - 14, 2.4, 0, 7); ctx.fill();
            } else if (o.type === 'soya') {
              ctx.fillStyle = '#3a2a1f'; ctx.fillRect(bx, by + 14, o.w, o.h - 14);
              ctx.fillStyle = '#e2483d'; ctx.fillRect(bx + 5, by, o.w - 10, 16);
              ctx.fillStyle = '#f5f2ec'; ctx.fillRect(bx + 3, by + 28, o.w - 6, 12);
            } else {
              ctx.fillStyle = '#b07a52'; ctx.fillRect(bx + 2, by, 10, o.h); ctx.fillStyle = '#c48d62'; ctx.fillRect(bx + 17, by + 6, 10, o.h - 6);
              ctx.fillStyle = '#e2483d'; ctx.fillRect(bx + 2, by, 10, 18); ctx.fillRect(bx + 17, by + 6, 10, 18);
            }
          });
          ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(X, GY + 4, R * (1 - (GY - R - G.y) / 300), 5, 0, 0, 7); ctx.fill();
          drawHoshito(ctx, X, G.y, R, G.state === 'dead' ? 'hurt' : G.vy < 0 ? 'happy' : 'normal', 0, G.rot);
          ctx.font = '800 20px ' + FONT; ctx.textAlign = 'center';
          G.pops.forEach(function (p) { ctx.globalAlpha = 1 - p.t / 0.6; ctx.fillStyle = '#b8860b'; ctx.fillText('+1', p.x, p.y - 14 - p.t * 40); });
          ctx.globalAlpha = 1;
          ctx.fillStyle = 'rgba(11,18,16,0.55)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(W - 96, 12, 84, 34, 17) : ctx.rect(W - 96, 12, 84, 34); ctx.fill();
          ctx.beginPath(); ctx.arc(W - 74, 29, 9, 0, 7); ctx.fillStyle = '#ffd54a'; ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = '800 20px ' + FONT; ctx.textAlign = 'left'; ctx.fillText(G.got, W - 58, 36);
          if (G.state === 'ready') {
            ctx.fillStyle = 'rgba(11,18,16,0.6)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(60, 190, 240, 48, 24) : ctx.rect(60, 190, 240, 48); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = '800 22px ' + FONT; ctx.textAlign = 'center'; ctx.fillText('TOCA PARA CORRER', 180, 222);
          }
        }
        raf = requestAnimationFrame(loop);
        return function () { stopped = true; cancelAnimationFrame(raf); window.removeEventListener('keydown', key); };
      } },

    { id: 'simon', name: 'Hoshi dice', short: 'Repite la secuencia', help: 'Mira el orden en que se iluminan los rollos y repítelo.',
      icon: '<rect width="40" height="40" rx="10" fill="#24352f"/><circle cx="13" cy="13" r="7.5" fill="#111114"/><circle cx="13" cy="13" r="5" fill="#fff"/><circle cx="13" cy="13" r="2.6" fill="#ff8a5c"/><circle cx="27" cy="13" r="7.5" fill="#111114"/><circle cx="27" cy="13" r="5" fill="#fff"/><circle cx="27" cy="13" r="2.6" fill="#a6e07e"/><circle cx="13" cy="27" r="7.5" fill="#111114"/><circle cx="13" cy="27" r="5" fill="#fff"/><circle cx="13" cy="27" r="2.6" fill="#ffe08a"/><circle cx="27" cy="27" r="7.5" fill="#111114"/><circle cx="27" cy="27" r="5" fill="#fff"/><circle cx="27" cy="27" r="2.6" fill="#ff8fa8"/>',
      start: function (area, api) {
        var seq = [], pos = 0, lock = true, stopped = false, timers = [];
        var box = document.createElement('div'); box.className = 'simon-wrap';
        box.innerHTML = '<p class="chef-msg" id="sm-msg" aria-live="polite">Mira…</p><div class="simon">' + SIMON.map(function (b, i) {
          return '<button type="button" class="sbtn" data-s="' + i + '" aria-label="' + b.name + '" style="--c:' + b.color + ';--l:' + b.lit + '"></button>';
        }).join('') + '</div>';
        area.appendChild(box);
        var btns = box.querySelectorAll('.sbtn'), msg = box.querySelector('#sm-msg');
        function later(f, ms) { timers.push(setTimeout(function () { if (!stopped) f(); }, ms)); }
        function flash(i, ms) { var b = btns[i]; b.classList.add('lit'); tone(SIMON[i].f, ms / 1000, 'triangle', 0.12); later(function () { b.classList.remove('lit'); }, ms); }
        function play() {
          lock = true; pos = 0; msg.textContent = 'Mira…';
          var on = Math.max(260, 520 - seq.length * 22), gap = 160;
          seq.forEach(function (n, k) { later(function () { flash(n, on); }, 500 + k * (on + gap)); });
          later(function () { lock = false; msg.textContent = '¡Tu turno!'; }, 500 + seq.length * (on + gap));
        }
        function next() { seq.push(Math.floor(Math.random() * 4)); play(); }
        box.querySelector('.simon').addEventListener('click', function (e) {
          var b = e.target.closest('.sbtn'); if (!b || lock || stopped) return;
          var i = +b.dataset.s; flash(i, 220);
          if (i !== seq[pos]) {
            lock = true; SFX.fail(); msg.textContent = '¡Ups! Era otro.';
            stopped = true; timers.forEach(clearTimeout);
            setTimeout(function () { api.end(seq.length - 1, (seq.length - 1) * 2); }, 700);
            return;
          }
          pos++;
          if (pos === seq.length) { lock = true; api.score(seq.length); msg.textContent = '¡Bien!'; later(next, 650); }
        });
        later(next, 300);
        return function () { stopped = true; timers.forEach(clearTimeout); };
      } }
  ];

  // ===================== CONTROL DE JUEGOS =====================
  var current = null;
  var api = {
    score: function (n) { $('game-score').textContent = n; },
    extra: function (h) { $('game-extra').innerHTML = h; },
    end: function (score, coins) { finishGame(score, coins); }
  };
  function openGame(g) {
    if (blockedBySleep()) return;
    if (!g.daily && S.energy < 12) { say('Estoy muy cansado para jugar… ¿me llevas a dormir?'); SFX.fail(); return; }
    SFX.tap();
    busyLayer = true;
    $('game-title').textContent = g.name; $('game-help').textContent = g.help; $('game-score').textContent = '0'; $('game-extra').innerHTML = '';
    var area = $('game-area'); area.innerHTML = '';
    $('game').hidden = false;
    current = { g: g, done: false, stop: null };
    current.stop = g.start(area, api);
  }
  function finishGame(score, coins) {
    if (!current || current.done) return;
    current.done = true;
    var g = current.g, prev = g.daily ? null : S.best[g.id];
    var record = !g.daily && (prev == null || (g.lower ? score < prev : score > prev));
    if (record && (score > 0 || g.lower)) S.best[g.id] = score;
    S.happy = clamp(S.happy + 12); S.energy = clamp(S.energy - (g.daily ? 0 : 12)); S.plays = (S.plays || 0) + 1;
    track('play', 1, g.id); if (!g.lower && !g.daily) track('score', score, g.id); track('gcoins', coins);
    if (!g.daily) submitScore(g.id, score);
    var title = g.daily ? (score ? '¡Palabra adivinada!' : '¡Casi!') : record && prev != null ? '¡Nuevo récord!' : (coins >= 15 ? '¡Increíble!' : coins >= 6 ? '¡Bien hecho!' : '¡Casi!');
    var line = g.id === 'run' ? 'Corriste ' + score + ' metros.' : g.id === 'simon' ? 'Repetiste ' + score + ' rondas.' : g.id === 'memo' ? 'Terminaste en ' + score + ' movimientos.' : g.id === 'chef' ? 'Preparaste ' + score + ' órdenes.' : g.id === 'fly' ? 'Pasaste ' + score + ' palillos.' : 'Atrapaste ' + score + ' rollos.';
    if (record && (score > 0 || g.lower)) SFX.level(); else SFX.good();
    save();
    showModal(title, (g.line ? g.line(score, coins) : '<p>' + line + '</p>') + '<div class="big" style="margin-top:10px">' + COIN + '+' + coins + '</div>' + (prev != null ? '<p style="margin-top:8px;font-size:13px">Récord: ' + S.best[g.id] + (g.unit || '') + '</p>' : ''), 'Volver', function () {
      closeGame();
      addCoins(coins); gainXP(Math.min(30, 4 + Math.round(coins / 2)));
      react(coins >= 10 ? 'party' : 'hi');
      say(coins >= 10 ? '¡Qué divertido! ¿Otra?' : '¡Gracias por jugar conmigo!');
    });
    if (g.after) g.after();
  }
  function closeGame() {
    if (current && current.stop) current.stop();
    current = null; $('game').hidden = true; $('game-area').innerHTML = ''; busyLayer = !$('modal').hidden;
    renderPanel(); render();
    if (levelQueue.length) setTimeout(showLevelUps, 600);
  }
  $('game-close').addEventListener('click', function () { SFX.tap(); closeGame(); });

  // ===================== ARRANQUE =====================
  var awayMs = S.last ? Date.now() - S.last : 0;
  renderScene(); renderWear(); renderMute(); tick(); renderPanel(); ensureMissions(); renderBadges();
  var ivs = [setInterval(tick, 1000), setInterval(idleChat, 4000), setInterval(refreshServer, 60000), setInterval(renderBadges, 15000)];
  function onVis() { if (document.hidden) { S.saved = Date.now(); push(true); } else { tick(); refreshServer(); } }
  document.addEventListener('visibilitychange', onVis);
  cleanups.push(function () {
    ivs.forEach(clearInterval); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('pointerup', onPointerUp);
    if (current && current.stop) current.stop();
    clearTimeout(saveTimer); push(true);
  });
  function spinsHint() { if (!busyLayer) welcomeBack(awayMs); }
  setTimeout(function () {
    if (!S.welcomed) {
      showModal('¡Hola' + (X.name ? ', ' + X.name : '') + '! Soy Hoshito', '<p>Cuídame: dame de comer, báñame, llévame a dormir y juega conmigo para ganar monedas.</p><p style="margin-top:10px">Cada vez que vengas a Hoshi y caja confirme tu sello, ganas <b>un giro de la ruleta</b>, y con tus visitas desbloqueas premios del camino. Están en el regalo de la izquierda.</p>', '¡Vamos!', function () { S.welcomed = true; save(); react('hi'); setTimeout(function () { dailyCheck(); setTimeout(spinsHint, 900); }, 600); });
    } else { dailyCheck(); setTimeout(spinsHint, 1200); }
  }, 500);
  setTimeout(function () { if (!busyLayer) say(needLine() || '¡Hola' + (X.name ? ', ' + X.name : '') + '! ¿Qué hacemos hoy?'); }, 400);
  // ===================== MINIJUEGOS EN ALTA CALIDAD =====================
  // Lienzo a la resolución real de la pantalla y dibujos vectoriales (nítidos a cualquier tamaño).
  var SPR = {};
  function sprite(key, vb, w, h, body, extra) {
    if (!SPR[key]) {
      var im = new Image();
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" width="' + w + '" height="' + h + '"' + (extra || '') + '>' + body + '</svg>');
      SPR[key] = im;
    }
    return SPR[key];
  }
  function ready(im) { return im && im.complete && im.naturalWidth; }
  function hdCanvas(area) {
    var cv = document.createElement('canvas'), ctx = cv.getContext('2d'), W = 360, H = 520;
    cv.className = 'hd'; area.appendChild(cv);
    function fit() {
      var aw = area.clientWidth || 360, ah = area.clientHeight || 520, s = Math.min(aw / W, ah / H);
      var cw = Math.max(200, Math.floor(W * s)), ch = Math.floor(cw * H / W), d = Math.min(window.devicePixelRatio || 1, 3);
      cv.style.width = cw + 'px'; cv.style.height = ch + 'px';
      cv.width = Math.round(cw * d); cv.height = Math.round(ch * d);
      var k = cv.width / W; ctx.setTransform(k, 0, 0, k, 0, 0); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    }
    fit();
    var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null; if (ro) ro.observe(area);
    return { cv: cv, ctx: ctx, px: function (e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; }, done: function () { if (ro) ro.disconnect(); } };
  }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function outlinedText(ctx, t, x, y, size, fill) {
    ctx.font = '800 ' + size + 'px ' + FONT; ctx.textAlign = 'center'; ctx.lineJoin = 'round';
    ctx.lineWidth = size / 6; ctx.strokeStyle = '#111114'; ctx.strokeText(t, x, y); ctx.fillStyle = fill || '#fff'; ctx.fillText(t, x, y);
  }

  // --- Hoshito como sprite (aro + cara + ropa) ---
  var FACE_EYES = {
    normal: '<circle cx="80" cy="90" r="15" fill="#111114"/><circle cx="75" cy="85" r="5.5" fill="#fff"/><circle cx="85" cy="95" r="2.5" fill="#fff"/><circle cx="122" cy="90" r="15" fill="#111114"/><circle cx="117" cy="85" r="5.5" fill="#fff"/><circle cx="127" cy="95" r="2.5" fill="#fff"/>',
    happy: '<path d="M66 94 Q80 76 94 94" fill="none" stroke="#111114" stroke-width="6" stroke-linecap="round"/><path d="M108 94 Q122 76 136 94" fill="none" stroke="#111114" stroke-width="6" stroke-linecap="round"/>',
    hurt: '<path d="M68 80 L90 90 L68 100" fill="none" stroke="#111114" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M134 80 L112 90 L134 100" fill="none" stroke="#111114" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'
  };
  var FACE_MOUTH = {
    normal: '<path d="M81 116 H121 A20 23 0 0 1 81 116 Z" fill="#111114"/><ellipse cx="101" cy="134" rx="10" ry="6" fill="#ff9fb4"/>',
    hurt: '<ellipse cx="101" cy="124" rx="9" ry="11" fill="#111114"/><ellipse cx="101" cy="130" rx="5" ry="3.5" fill="#ff9fb4"/>'
  };
  FACE_MOUTH.happy = FACE_MOUTH.normal;
  function faceBody(mood, acc) {
    return '<circle cx="100" cy="100" r="100" fill="#fff"/><circle cx="100" cy="100" r="76" fill="#fff" stroke="#111114" stroke-width="3"/><g transform="translate(100 100) scale(1.22) translate(-100 -102)"><rect x="64" y="50" width="52" height="48" rx="15" fill="#c2e8aa"/><circle cx="128" cy="112" r="23" fill="#f6a65c"/><ellipse cx="56" cy="114" rx="13" ry="9" fill="#ffb3c4"/><ellipse cx="147" cy="118" rx="12" ry="8" fill="#ffb3c4"/>'
      + (FACE_EYES[mood] || FACE_EYES.normal) + (FACE_MOUTH[mood] || FACE_MOUTH.normal) + (acc || '') + '</g>';
  }
  function faceSprite(mood, wear) { var f = itemById((wear || S.wear).face); return sprite('face-' + mood + '-' + (f ? f.id : ''), '0 0 200 200', 400, 400, faceBody(mood, f ? f.svg : '')); }
  function accSprite(it) { var p = it.vb.split(' ').map(Number), ar = p[3] / p[2]; return { img: sprite('acc-' + it.id, it.vb, 320, Math.round(320 * ar), it.svg), ar: ar }; }
  var ringCv = null, ringKey = '';
  function ringBitmap() {
    if (!ready(ringImg)) return null;
    if (ringKey !== ringImg.src) { ringCv = document.createElement('canvas'); ringCv.width = ringCv.height = 512; ringCv.getContext('2d').drawImage(ringImg, 0, 0, 512, 512); ringKey = ringImg.src; }
    return ringCv;
  }
  var RINGS = {};
  function ringFor(wear) {
    if (!wear) return ringBitmap();
    var sk = itemById(wear.skin), src = (sk && sk.src) || RING;
    if (!RINGS[src]) { var im = new Image(); im.src = src; RINGS[src] = im; }
    return ready(RINGS[src]) ? RINGS[src] : null;
  }
  function drawHoshitoHD(ctx, x, y, r, mood, rot, ringRot, wear) {
    var W8 = wear || S.wear;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot);
    var rb = ringFor(wear);
    ctx.save(); if (ringRot) ctx.rotate(ringRot);
    if (rb) ctx.drawImage(rb, -r, -r, r * 2, r * 2); else { ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fillStyle = '#111114'; ctx.fill(); }
    ctx.restore();
    ctx.beginPath(); ctx.arc(0, 0, r + 1, 0, 7); ctx.lineWidth = Math.max(1.5, r * 0.06); ctx.strokeStyle = '#f5f2ec'; ctx.stroke();
    var fs = r * 2 * 0.59, fi = faceSprite(mood || 'normal', wear); if (ready(fi)) ctx.drawImage(fi, -fs / 2, -fs / 2, fs, fs);
    var n = itemById(W8.neck);
    if (n) { var a = accSprite(n); if (ready(a.img)) { var w = 2 * r * n.w / 100; ctx.drawImage(a.img, -w / 2, -r + n.t / 100 * 2 * r, w, w * a.ar); } }
    var hd = itemById(W8.head);
    if (hd) { var b = accSprite(hd); if (ready(b.img)) { var w2 = 2 * r * hd.w / 100, h2 = w2 * b.ar, bottom = r - hd.b / 100 * 2 * r, cx = ((hd.x || 50) - 50) / 100 * 2 * r; ctx.drawImage(b.img, cx - w2 / 2, bottom - h2, w2, h2); } }
    ctx.restore();
  }

  // --- Sprites de comida y obstáculos ---
  var SP = {
    roll: function () { return sprite('roll', '0 0 40 40', 96, 96, '<circle cx="20" cy="21" r="18" fill="#000" opacity=".25"/><circle cx="20" cy="20" r="18" fill="#1b2420" stroke="#111114" stroke-width="1.5"/><circle cx="20" cy="20" r="16.5" fill="none" stroke="#2f4038" stroke-width="1.2" stroke-dasharray="1.5 2.5"/><circle cx="20" cy="20" r="13.5" fill="#fffdf7"/><ellipse cx="13" cy="25" rx="1.4" ry=".8" fill="#e6dfd2"/><ellipse cx="27" cy="13" rx="1.4" ry=".8" fill="#e6dfd2"/><ellipse cx="25" cy="28" rx="1.4" ry=".8" fill="#e6dfd2"/><circle cx="16.5" cy="17.5" r="4.8" fill="#ff8a5c"/><path d="M13.5 15.5l3 4M16 14l3 5" stroke="#ffc2a8" stroke-width="1"/><circle cx="23.5" cy="22.5" r="3.9" fill="#8fd060"/><circle cx="21" cy="14" r="2.2" fill="#ffe08a"/><path d="M8 12a14 14 0 018-6" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".35" fill="none"/>'); },
    gold: function () { return sprite('gold', '0 0 40 40', 96, 96, '<circle cx="20" cy="20" r="18" fill="#ffd54a" stroke="#b8860b" stroke-width="2"/><circle cx="20" cy="20" r="15.5" fill="none" stroke="#fff3b0" stroke-width="1.2" stroke-dasharray="2 2"/><circle cx="20" cy="20" r="13" fill="#fffdf7"/><circle cx="16.5" cy="17.5" r="4.5" fill="#ff8a5c"/><circle cx="23.5" cy="22.5" r="3.8" fill="#8fd060"/><path d="M31 4l1.4 3.2 3.4.4-2.6 2.3.8 3.4L31 11.6l-3 1.7.8-3.4-2.6-2.3 3.4-.4z" fill="#fff6c8" stroke="#b8860b" stroke-width=".8"/><path d="M8 12a14 14 0 018-6" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".6" fill="none"/>'); },
    wasabi: function () { return sprite('wasabi', '0 0 40 40', 96, 96, '<defs><radialGradient id="g" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#c8ec6a"/><stop offset="1" stop-color="#6aa82c"/></radialGradient></defs><path d="M20 3c7 0 9 6 13 9 4 3 5 9 3 14-2 7-9 11-16 11S6 33 4 26C2 21 3 15 7 12c4-3 6-9 13-9z" fill="url(#g)" stroke="#3f6a17" stroke-width="2"/><path d="M11 17l6 3M29 17l-6 3" stroke="#1d2a10" stroke-width="2.4" stroke-linecap="round"/><circle cx="15" cy="22" r="2.4" fill="#1d2a10"/><circle cx="25" cy="22" r="2.4" fill="#1d2a10"/><path d="M15 29q5-3 10 0" stroke="#1d2a10" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="13" cy="10" rx="4" ry="2" fill="#fff" opacity=".45" transform="rotate(-25 13 10)"/>'); },
    heart: function () { return sprite('heart', '0 0 24 24', 72, 72, '<path d="' + HEART_PATH + '" fill="#ff5f86" stroke="#9c1e3d" stroke-width="1"/><ellipse cx="7.5" cy="8.5" rx="2.2" ry="1.3" fill="#fff" opacity=".7" transform="rotate(-30 7.5 8.5)"/>'); },
    coin: function () { return sprite('coin', '0 0 24 24', 72, 72, '<circle cx="12" cy="12" r="10.5" fill="#ffd54a" stroke="#b8860b" stroke-width="1.6"/><circle cx="12" cy="12" r="7.5" fill="none" stroke="#e6b830" stroke-width="1"/><path d="M12 6.5l1.5 3.3 3.5.4-2.6 2.4.7 3.5L12 14.4l-3.1 1.7.7-3.5L7 10.2l3.5-.4z" fill="#fff3b0" stroke="#b8860b" stroke-width=".6"/>'); },
    soy: function () { return sprite('soy', '0 0 30 64', 60, 128, '<path d="M9 16h12l3 8v34a4 4 0 01-4 4H10a4 4 0 01-4-4V24z" fill="#2a1d15" stroke="#111114" stroke-width="1.5"/><rect x="10" y="4" width="10" height="13" rx="2" fill="#e2483d" stroke="#111114" stroke-width="1.5"/><rect x="8" y="34" width="14" height="14" rx="2" fill="#f5f2ec"/><circle cx="15" cy="41" r="4" fill="#e2483d"/><path d="M9 26v26" stroke="#fff" stroke-width="2" opacity=".18"/>'); },
    sticks: function () { return sprite('sticks', '0 0 40 76', 80, 152, '<g stroke="#111114" stroke-width="1.5"><path d="M6 76L15 2l5 1-6 73z" fill="#c48d62"/><path d="M34 76L24 4l5-1 9 73z" fill="#b07a52"/><path d="M15 2l5 1-1 10-5-1z" fill="#e2483d"/><path d="M24 4l5-1 1.4 10-5 1z" fill="#e2483d"/></g>'); },
    cloud: function () { return sprite('cloud', '0 0 120 56', 240, 112, '<path d="M24 50c-12 0-20-7-18-16 2-8 11-11 18-9 2-11 12-18 24-17 10 1 17 7 19 14 6-6 18-6 24 1 9-2 19 4 19 13 0 8-6 14-16 14z" fill="#fff"/><path d="M20 50h80c6 0 11-3 13-7-4 3-9 4-13 4H24c-6 0-11-2-15-6 2 6 7 9 11 9z" fill="#dbeef7"/>'); }
  };
  function particles(list, x, y, color, n) { for (var i = 0; i < n; i++) { var a = Math.random() * Math.PI * 2, s = 60 + Math.random() * 120; list.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, t: 0, c: color, r: 2 + Math.random() * 3 }); } }
  function stepParticles(ctx, list, dt) {
    for (var i = list.length - 1; i >= 0; i--) {
      var p = list[i]; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 260 * dt;
      if (p.t > 0.7) { list.splice(i, 1); continue; }
      ctx.globalAlpha = 1 - p.t / 0.7; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // --- Atrapa rollos ---
  function startCatchHD(area, api) {
    var C = hdCanvas(area), ctx = C.ctx, W = 360, H = 520, hy = H - 78, raf = 0, stopped = false;
    var G = { x: W / 2, tx: W / 2, items: [], score: 0, coins: 0, lives: 3, t: 0, spawn: 0.4, last: performance.now(), hurt: 0, happy: 0, pops: [], parts: [], flash: 0, combo: 0 };
    var bg = sprite('bg-catch-' + themeOf('cocina').id, '0 0 400 420', 720, 1040, themed('cocina'), ' preserveAspectRatio="xMidYMax slice"');
    api.extra(livesHTML(3, 3));
    function mv(e) { G.tx = C.px(e).x; }
    C.cv.addEventListener('pointerdown', mv); C.cv.addEventListener('pointermove', mv);
    function spawn() {
      var r = Math.random(), lvl = Math.min(G.t / 60, 1);
      var type = r < 0.05 ? 'gold' : r < 0.07 && G.lives < 3 ? 'heart' : r < 0.24 + lvl * 0.14 ? 'wasabi' : 'roll';
      G.items.push({ x: 26 + Math.random() * (W - 52), y: -24, vy: 120 + Math.random() * 60 + G.t * 3.2, type: type, rot: Math.random() * 6, spin: (Math.random() - 0.5) * 4 });
    }
    function loop(now) {
      if (stopped) return;
      var dt = Math.min(0.05, (now - G.last) / 1000); G.last = now; G.t += dt; G.spawn -= dt;
      if (G.spawn <= 0) { spawn(); G.spawn = Math.max(0.36, 0.95 - G.t * 0.012); }
      G.x += (G.tx - G.x) * Math.min(1, dt * 14); G.x = Math.max(40, Math.min(W - 40, G.x));
      for (var i = G.items.length - 1; i >= 0; i--) {
        var it = G.items[i]; it.y += it.vy * dt; it.rot += it.spin * dt;
        var dx = it.x - G.x, dy = it.y - hy;
        if (dx * dx + dy * dy < 48 * 48) {
          G.items.splice(i, 1);
          if (it.type === 'wasabi') { G.lives--; G.hurt = 0.5; G.flash = 0.25; G.combo = 0; SFX.fail(); particles(G.parts, it.x, it.y, '#8fc93a', 10); api.extra(livesHTML(G.lives, 3)); if (G.lives <= 0) { stopped = true; draw(0); return api.end(G.score, G.coins); } }
          else if (it.type === 'heart') { G.lives = Math.min(3, G.lives + 1); SFX.good(); particles(G.parts, it.x, it.y, '#ff8fa8', 12); api.extra(livesHTML(G.lives, 3)); G.pops.push({ x: it.x, y: it.y, t: 0, txt: '+1 vida' }); }
          else { var c = it.type === 'gold' ? 3 : 1; G.score++; G.coins += c; G.combo++; G.happy = 0.35; SFX.pop(); particles(G.parts, it.x, it.y, it.type === 'gold' ? '#ffd54a' : '#fffdf7', 8); api.score(G.score); G.pops.push({ x: it.x, y: it.y, t: 0, txt: '+' + c }); }
        } else if (it.y > H + 30) G.items.splice(i, 1);
      }
      G.hurt = Math.max(0, G.hurt - dt); G.happy = Math.max(0, G.happy - dt); G.flash = Math.max(0, G.flash - dt);
      G.pops.forEach(function (p) { p.t += dt; }); G.pops = G.pops.filter(function (p) { return p.t < 0.8; });
      draw(dt); raf = requestAnimationFrame(loop);
    }
    function draw(dt) {
      if (ready(bg)) ctx.drawImage(bg, 0, 0, W, H); else { ctx.fillStyle = '#efcf9f'; ctx.fillRect(0, 0, W, H); }
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(0,0,0,0.18)'); g.addColorStop(0.35, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      G.items.forEach(function (it) {
        var im = it.type === 'wasabi' ? SP.wasabi() : it.type === 'heart' ? SP.heart() : it.type === 'gold' ? SP.gold() : SP.roll(), s = it.type === 'heart' ? 34 : 38;
        if (!ready(im)) return;
        ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.type === 'wasabi' ? Math.sin(it.rot) * 0.3 : it.rot); ctx.drawImage(im, -s / 2, -s / 2, s, s); ctx.restore();
      });
      ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(G.x, hy + 44, 36, 7, 0, 0, 7); ctx.fill();
      drawHoshitoHD(ctx, G.x + (G.hurt > 0 ? Math.sin(G.hurt * 60) * 4 : 0), hy, 42, G.hurt > 0 ? 'hurt' : G.happy > 0 ? 'happy' : 'normal');
      stepParticles(ctx, G.parts, dt);
      G.pops.forEach(function (p) { ctx.globalAlpha = 1 - p.t / 0.8; outlinedText(ctx, p.txt, p.x, p.y - p.t * 50, 22, '#ffe08a'); });
      ctx.globalAlpha = 1;
      if (G.combo >= 5) outlinedText(ctx, 'Combo ×' + G.combo, W / 2, 46, 24, '#bfe8cc');
      if (G.flash > 0) { ctx.fillStyle = 'rgba(226,72,61,' + (G.flash * 1.4).toFixed(2) + ')'; ctx.fillRect(0, 0, W, H); }
    }
    raf = requestAnimationFrame(loop);
    return function () { stopped = true; cancelAnimationFrame(raf); C.done(); };
  }

  // --- Hoshito vuela ---
  function startFlyHD(area, api) {
    var C = hdCanvas(area), ctx = C.ctx, W = 360, H = 520, GY = H - 62, raf = 0, stopped = false, X = 110, R = 25;
    var F = { y: H / 2 - 30, vy: 0, state: 'ready', t: 0, pipes: [], next: 0, score: 0, last: performance.now(), dead: 0, gx: 0, hx: 0, parts: [], clouds: [[30, 70, 1], [190, 120, 0.8], [300, 50, 1.1], [420, 160, 0.7]] };
    var mtn = sprite('fly-mtn', '0 0 360 200', 720, 400, '<path d="M0 200V120l40-20 50 30 40-26 60 34 40-22 60 30 70-30v104z" fill="#a8d4ea"/><path d="M70 200L180 40l110 160z" fill="#7fb6d4"/><path d="M150 84l30-44 30 44-12 6-10-8-8 8-10-8-10 8z" fill="#fff"/><path d="M180 40l30 44-12 6-10-8z" fill="#e6f4fb"/>');
    var hills = sprite('fly-hills', '0 0 720 140', 1440, 280, '<path d="M0 140V70c60-40 120-40 180 0s120 40 180 0 120-40 180 0 120 40 180 0v70z" fill="#8ccf7a"/><path d="M0 140V95c50-25 110-25 170 0s110 25 190 0 120-28 190 0 120 25 170 0v45z" fill="#6fbf62"/><g transform="translate(470 34)"><rect x="6" y="18" width="8" height="58" fill="#e2483d"/><rect x="56" y="18" width="8" height="58" fill="#e2483d"/><path d="M-6 8q40 -10 82 0v8h-82z" fill="#e2483d"/><rect x="0" y="22" width="70" height="7" fill="#c23a30"/><rect x="31" y="16" width="8" height="12" fill="#c23a30"/></g><circle cx="120" cy="70" r="18" fill="#5aa84f"/><rect x="117" y="84" width="6" height="16" fill="#8a5a3b"/><circle cx="640" cy="74" r="14" fill="#5aa84f"/><rect x="637" y="85" width="6" height="12" fill="#8a5a3b"/>');
    function flap() {
      if (F.state === 'dead') return;
      if (F.state === 'ready') { F.state = 'play'; F.next = 0.9; }
      F.vy = -430; SFX.flap(); particles(F.parts, X - 18, F.y + 8, 'rgba(255,255,255,0.9)', 4);
    }
    C.cv.addEventListener('pointerdown', function (e) { e.preventDefault(); flap(); });
    function key(e) { if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); flap(); } }
    window.addEventListener('keydown', key);
    function die() { if (F.state === 'dead') return; F.state = 'dead'; F.vy = -220; SFX.fail(); particles(F.parts, X, F.y, '#ffe08a', 14); }
    function loop(now) {
      if (stopped) return;
      var dt = Math.min(0.04, (now - F.last) / 1000); F.last = now; F.t += dt;
      var speed = Math.min(240, 150 + F.score * 3);
      if (F.state !== 'dead') { F.gx = (F.gx + speed * dt) % 32; F.hx = (F.hx + speed * 0.35 * dt) % 720; F.clouds.forEach(function (c) { c[0] -= speed * 0.12 * c[2] * dt; if (c[0] < -130) c[0] = W + 40; }); }
      if (F.state === 'ready') F.y = H / 2 - 30 + Math.sin(F.t * 4) * 8;
      else {
        F.vy += 1450 * dt; F.y += F.vy * dt;
        if (F.state === 'play') {
          F.next -= dt;
          if (F.next <= 0) { var gap = Math.max(128, 162 - F.score * 1.5), top = 70 + Math.random() * (GY - 140 - gap); F.pipes.push({ x: W + 30, top: top, gap: gap, passed: false }); F.next = Math.max(1.15, 1.6 - F.score * 0.02); }
          F.pipes.forEach(function (p) {
            p.x -= speed * dt;
            if (!p.passed && p.x + 18 < X) { p.passed = true; F.score++; api.score(F.score); SFX.pop(); }
            if (X + R - 7 > p.x - 18 && X - R + 7 < p.x + 18 && (F.y - R + 7 < p.top || F.y + R - 7 > p.top + p.gap)) die();
          });
          F.pipes = F.pipes.filter(function (p) { return p.x > -60; });
          if (F.y - R < 0) { F.y = R; F.vy = 0; }
        }
        if (F.y + R > GY) { F.y = GY - R; if (F.state === 'play') die(); }
        if (F.state === 'dead') { F.dead += dt; if (F.dead > 0.9) { stopped = true; draw(0); return api.end(F.score, F.score); } }
      }
      draw(dt); raf = requestAnimationFrame(loop);
    }
    function stick(x, y0, y1, tipAtEnd) {
      [[x - 16, 13], [x + 3, 13]].forEach(function (s, i) {
        var g = ctx.createLinearGradient(s[0], 0, s[0] + s[1], 0); g.addColorStop(0, i ? '#a8703f' : '#b87d4a'); g.addColorStop(0.45, i ? '#d6a070' : '#e2ad7c'); g.addColorStop(1, i ? '#8a5a30' : '#9b663a');
        ctx.fillStyle = g; ctx.strokeStyle = '#3a2414'; ctx.lineWidth = 1.5;
        rr(ctx, s[0], y0 - 6, s[1], y1 - y0 + 12, 5); ctx.fill(); ctx.stroke();
        var ty = tipAtEnd ? y1 - 30 : y0; ctx.fillStyle = '#e2483d'; rr(ctx, s[0], ty, s[1], 30, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(s[0] + 3, ty + 4, 2.5, 22);
      });
    }
    function draw(dt) {
      var sky = ctx.createLinearGradient(0, 0, 0, GY); sky.addColorStop(0, '#5fb8e6'); sky.addColorStop(1, '#d7f1fb'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      var sun = ctx.createRadialGradient(286, 84, 10, 286, 84, 80); sun.addColorStop(0, 'rgba(255,243,176,1)'); sun.addColorStop(0.35, 'rgba(255,243,176,0.9)'); sun.addColorStop(1, 'rgba(255,243,176,0)'); ctx.fillStyle = sun; ctx.fillRect(200, 0, 180, 180);
      if (ready(mtn)) ctx.drawImage(mtn, 0, GY - 200, 360, 200);
      F.clouds.forEach(function (c) { var cl = SP.cloud(); if (ready(cl)) ctx.drawImage(cl, c[0], c[1], 110 * c[2], 51 * c[2]); });
      if (ready(hills)) { ctx.drawImage(hills, -F.hx, GY - 100, 720, 140); ctx.drawImage(hills, 720 - F.hx, GY - 100, 720, 140); }
      F.pipes.forEach(function (p) { stick(p.x, -10, p.top, true); stick(p.x, p.top + p.gap, GY + 10, false); });
      ctx.fillStyle = '#7cc35a'; ctx.fillRect(0, GY, W, 12); ctx.fillStyle = '#5fa845'; ctx.fillRect(0, GY + 10, W, 4);
      ctx.fillStyle = '#c98f5a'; ctx.fillRect(0, GY + 14, W, H - GY - 14);
      ctx.fillStyle = '#b37a48'; for (var x = -F.gx; x < W; x += 32) { ctx.fillRect(x, GY + 26, 16, 6); ctx.fillRect(x + 16, GY + 44, 16, 6); }
      stepParticles(ctx, F.parts, dt);
      var tilt = Math.max(-0.4, Math.min(0.9, F.vy / 700)), wing = F.state === 'dead' ? 0 : Math.sin(F.t * 24);
      ctx.save(); ctx.translate(X, F.y); ctx.rotate(tilt);
      [[-1, -R * 0.2], [1, -R * 0.35]].forEach(function (wg) {
        ctx.save(); ctx.translate(-R * 0.7, wg[1]); ctx.rotate(-0.6 + wing * 0.6 * wg[0] * -1);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-10, -18, -34, -16, -34, -4); ctx.bezierCurveTo(-28, 0, -22, 2, -18, 4); ctx.bezierCurveTo(-14, 8, -6, 8, 0, 0);
        ctx.fillStyle = wg[0] < 0 ? '#e9f4fb' : '#fff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#111114'; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-12, -4); ctx.lineTo(-26, -8); ctx.moveTo(-10, 1); ctx.lineTo(-22, 0); ctx.lineWidth = 1.2; ctx.stroke();
        ctx.restore();
      });
      ctx.restore();
      drawHoshitoHD(ctx, X, F.y, R, F.state === 'dead' ? 'hurt' : F.vy < -100 ? 'happy' : 'normal', tilt);
      if (F.state === 'ready') { ctx.fillStyle = 'rgba(11,18,16,0.6)'; rr(ctx, 70, 330, 220, 50, 25); ctx.fill(); outlinedText(ctx, 'TOCA PARA VOLAR', 180, 363, 22, '#fff'); }
      else outlinedText(ctx, String(F.score), W / 2, 76, 56, '#fff');
    }
    raf = requestAnimationFrame(loop);
    return function () { stopped = true; cancelAnimationFrame(raf); window.removeEventListener('keydown', key); C.done(); };
  }

  // --- Hoshito corre ---
  function cityStrip(seed, h, colorA, colorB, detailed) {
    var r = seeded('city' + seed), x = 0, s = '';
    while (x < 720) {
      var w = 46 + r() * 50, bh = h * (0.45 + r() * 0.5), y = h - bh, c = r() < 0.5 ? colorA : colorB;
      s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + bh.toFixed(1) + '" fill="' + c + '"' + (detailed ? ' stroke="#1d1438" stroke-width="2"' : '') + '/>';
      if (detailed) {
        s += '<rect x="' + (x - 3).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" width="' + (w + 6).toFixed(1) + '" height="8" rx="2" fill="#2a2050" stroke="#1d1438" stroke-width="2"/>';
        for (var wy = y + 14; wy < h - 26; wy += 24) for (var wx = x + 9; wx < x + w - 14; wx += 18) s += '<rect x="' + wx.toFixed(1) + '" y="' + wy.toFixed(1) + '" width="9" height="12" rx="1.5" fill="' + (r() < 0.75 ? '#ffe08a' : '#3a2f6a') + '"/>';
        if (r() < 0.6) s += '<path d="M' + (x + 8).toFixed(1) + ' ' + (h - 20) + 'h' + (w - 16).toFixed(1) + 'l-4 -12h' + (-(w - 24)).toFixed(1) + 'z" fill="#e2483d" stroke="#1d1438" stroke-width="1.5"/>';
        if (r() < 0.5) s += '<ellipse cx="' + (x + w / 2).toFixed(1) + '" cy="' + (y + 22).toFixed(1) + '" rx="7" ry="9" fill="#ff6a4a" stroke="#1d1438" stroke-width="1.5"/>';
      } else for (var k = 0; k < 4; k++) s += '<rect x="' + (x + 6 + r() * (w - 12)).toFixed(1) + '" y="' + (y + 8 + r() * (bh - 20)).toFixed(1) + '" width="3" height="4" fill="#ffd27a" opacity=".7"/>';
      x += w + 2 + r() * 8;
    }
    return s;
  }
  function startRunHD(area, api) {
    var C = hdCanvas(area), ctx = C.ctx, W = 360, H = 520, GY = H - 96, X = 92, R = 30, raf = 0, stopped = false;
    var G = { y: GY - R, vy: 0, jumps: 0, state: 'ready', t: 0, dist: 0, speed: 250, obs: [], coins: [], got: 0, next: 300, last: performance.now(), dead: 0, rot: 0, pops: [], parts: [], wasAir: false };
    var far = sprite('run-far', '0 0 720 170', 1440, 340, cityStrip(1, 170, '#5a3f86', '#4d3678', false));
    var near = sprite('run-near', '0 0 720 250', 1440, 500, cityStrip(2, 250, '#b8675a', '#9e5a7a', true));
    var stars = []; for (var i = 0; i < 40; i++) stars.push([Math.random() * W, Math.random() * 200, Math.random() * 1.6 + 0.4]);
    function jump() {
      if (G.state === 'dead') return;
      if (G.state === 'ready') G.state = 'play';
      if (G.jumps < 2) { G.vy = G.jumps === 0 ? -760 : -640; G.jumps++; SFX.jump(); particles(G.parts, X, G.y + R, '#c9c2d8', 5); }
    }
    C.cv.addEventListener('pointerdown', function (e) { e.preventDefault(); jump(); });
    function key(e) { if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); jump(); } }
    window.addEventListener('keydown', key);
    function spawn() {
      var k = Math.random(), o;
      if (k < 0.4) o = { type: 'wasabi', w: 38, h: 34 };
      else if (k < 0.72) o = { type: 'soy', w: 26, h: 56 };
      else o = { type: 'sticks', w: 34, h: 66 };
      o.x = W + 40; G.obs.push(o);
      if (Math.random() < 0.7) { var n = 3 + Math.floor(Math.random() * 3); for (var j = 0; j < n; j++) G.coins.push({ x: W + 40 - (n - 1) * 15 + j * 30, y: GY - o.h - 50 - Math.sin(j / (n - 1) * Math.PI) * 40 }); }
      else for (var q = 0; q < 4; q++) G.coins.push({ x: W + 160 + q * 30, y: GY - 26 });
      G.next = 230 + Math.random() * 230 + G.speed * 0.35;
    }
    function hit(o) { var cx = Math.max(o.x - o.w / 2 + 4, Math.min(X, o.x + o.w / 2 - 4)), cy = Math.max(GY - o.h + 4, Math.min(G.y, GY)); var dx = X - cx, dy = G.y - cy; return dx * dx + dy * dy < (R - 7) * (R - 7); }
    function die() { if (G.state !== 'play') return; G.state = 'dead'; G.vy = -420; SFX.fail(); particles(G.parts, X, G.y, '#ff8a5c', 14); }
    function loop(now) {
      if (stopped) return;
      var dt = Math.min(0.04, (now - G.last) / 1000); G.last = now; G.t += dt;
      if (G.state === 'play') {
        G.speed = Math.min(540, 250 + G.t * 7);
        var dx = G.speed * dt; G.dist += dx; G.rot += dx / R;
        G.next -= dx; if (G.next <= 0) spawn();
        G.obs.forEach(function (o) { o.x -= dx; if (hit(o)) die(); });
        G.obs = G.obs.filter(function (o) { return o.x > -60; });
        for (var i = G.coins.length - 1; i >= 0; i--) {
          var c = G.coins[i]; c.x -= dx;
          var ddx = c.x - X, ddy = c.y - G.y;
          if (ddx * ddx + ddy * ddy < (R + 10) * (R + 10)) { G.coins.splice(i, 1); G.got++; SFX.pop(); particles(G.parts, c.x, c.y, '#ffd54a', 6); G.pops.push({ x: c.x, y: c.y, t: 0 }); }
          else if (c.x < -20) G.coins.splice(i, 1);
        }
        api.score(Math.floor(G.dist / 30));
      }
      if (G.state !== 'ready') {
        G.vy += 2300 * dt; G.y += G.vy * dt;
        if (G.y >= GY - R) { if (G.wasAir && G.state === 'play') particles(G.parts, X, GY, '#c9c2d8', 6); G.y = GY - R; G.vy = 0; G.jumps = 0; G.wasAir = false; } else G.wasAir = true;
      } else G.y = GY - R - Math.abs(Math.sin(G.t * 5)) * 10;
      if (G.state === 'dead') { G.dead += dt; if (G.dead > 0.9) { stopped = true; draw(0); var sc = Math.floor(G.dist / 30); return api.end(sc, Math.floor(G.got / 2) + Math.floor(sc / 50)); } }
      G.pops.forEach(function (p) { p.t += dt; }); G.pops = G.pops.filter(function (p) { return p.t < 0.6; });
      draw(dt); raf = requestAnimationFrame(loop);
    }
    function draw(dt) {
      var sky = ctx.createLinearGradient(0, 0, 0, GY); sky.addColorStop(0, '#2b2466'); sky.addColorStop(0.55, '#7a4f9e'); sky.addColorStop(1, '#ff9a7a'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fff'; stars.forEach(function (s) { ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(G.t * s[2] + s[0])); ctx.fillRect(s[0], s[1], s[2], s[2]); }); ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.arc(270, 90, 26, 0, 7); ctx.fill(); ctx.fillStyle = '#3a2f7a'; ctx.beginPath(); ctx.arc(281, 82, 22, 0, 7); ctx.fill();
      var fo = (G.dist * 0.15) % 720, no = (G.dist * 0.45) % 720;
      if (ready(far)) { ctx.drawImage(far, -fo, GY - 190, 720, 170); ctx.drawImage(far, 720 - fo, GY - 190, 720, 170); }
      if (ready(near)) { ctx.drawImage(near, -no, GY - 250, 720, 250); ctx.drawImage(near, 720 - no, GY - 250, 720, 250); }
      ctx.strokeStyle = '#1d1438'; ctx.lineWidth = 1.5; ctx.beginPath(); for (var lx = -(G.dist * 0.45) % 90; lx < W + 90; lx += 90) { ctx.moveTo(lx, GY - 150); ctx.quadraticCurveTo(lx + 45, GY - 130, lx + 90, GY - 150); } ctx.stroke();
      for (var lt = -(G.dist * 0.45) % 90; lt < W + 90; lt += 30) { ctx.fillStyle = (Math.floor((lt + G.dist * 0.45) / 30) % 2) ? '#ff6a4a' : '#ffd54a'; ctx.beginPath(); ctx.ellipse(lt + 15, GY - 141 + Math.sin((lt % 90) / 90 * Math.PI) * 9, 4.5, 5.5, 0, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#a9b0ba'; ctx.fillRect(0, GY, W, 14); ctx.fillStyle = '#8c939d'; for (var sx = -(G.dist % 40); sx < W; sx += 40) ctx.fillRect(sx, GY, 2, 14);
      ctx.fillStyle = '#6b7380'; ctx.fillRect(0, GY + 14, W, 5);
      ctx.fillStyle = '#34394a'; ctx.fillRect(0, GY + 19, W, H - GY - 19);
      ctx.fillStyle = '#ffe08a'; var off = G.dist % 60; for (var dx2 = -off; dx2 < W; dx2 += 60) rr(ctx, dx2, GY + 50, 30, 6, 3), ctx.fill();
      G.coins.forEach(function (c) { var im = SP.coin(); if (!ready(im)) return; var sxk = Math.abs(Math.cos(G.t * 5 + c.x * 0.05)) * 0.8 + 0.2; ctx.save(); ctx.translate(c.x, c.y); ctx.scale(sxk, 1); ctx.drawImage(im, -11, -11, 22, 22); ctx.restore(); });
      G.obs.forEach(function (o) { var im = SP[o.type](); if (ready(im)) ctx.drawImage(im, o.x - o.w / 2, GY - o.h + 2, o.w, o.h); });
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(X, GY + 4, R * Math.max(0.3, 1 - (GY - R - G.y) / 260), 5, 0, 0, 7); ctx.fill();
      drawHoshitoHD(ctx, X, G.y, R, G.state === 'dead' ? 'hurt' : G.vy < 0 ? 'happy' : 'normal', 0, G.rot);
      stepParticles(ctx, G.parts, dt);
      G.pops.forEach(function (p) { ctx.globalAlpha = 1 - p.t / 0.6; outlinedText(ctx, '+1', p.x, p.y - 14 - p.t * 40, 18, '#ffe08a'); }); ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(11,18,16,0.55)'; rr(ctx, W - 98, 12, 86, 36, 18); ctx.fill();
      var ci = SP.coin(); if (ready(ci)) ctx.drawImage(ci, W - 90, 18, 24, 24);
      ctx.font = '800 22px ' + FONT; ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.fillText(G.got, W - 60, 38);
      if (G.state === 'ready') { ctx.fillStyle = 'rgba(11,18,16,0.6)'; rr(ctx, 60, 200, 240, 50, 25); ctx.fill(); outlinedText(ctx, 'TOCA PARA CORRER', 180, 233, 22, '#fff'); }
    }
    raf = requestAnimationFrame(loop);
    return function () { stopped = true; cancelAnimationFrame(raf); window.removeEventListener('keydown', key); C.done(); };
  }
  var HD = { 'catch': startCatchHD, fly: startFlyHD, run: startRunHD };
  GAMES.forEach(function (g) { if (HD[g.id]) g.start = HD[g.id]; });
  // ===================== AMIGOS =====================
  // Lista de la comunidad Hoshito, agregar por teléfono, visitar, saludar y regalar comida.
  var friendsData = null, visiting = null, giftMode = false;
  var FRIEND_API = cfg.api + '/amigos';
  function api2(method, body, qs) {
    return fetch(FRIEND_API + (qs || ''), { method: method, credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json(); }).catch(function () { return { ok: false, reason: 'net' }; });
  }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function seenTxt(d) {
    if (!d) return '';
    var days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
    return days <= 0 ? 'Jugó hoy' : days === 1 ? 'Jugó ayer' : 'Hace ' + days + ' días';
  }
  var WAVE = '<path d="M8 13V6.5a1.5 1.5 0 013 0V12M11 11V5a1.5 1.5 0 013 0v6M14 11V6a1.5 1.5 0 013 0v7c0 4-2.5 7-6 7-2.5 0-4-1.2-5.5-3.5L3.8 13a1.5 1.5 0 012.5-1.6L8 13" fill="#ffe0b8" stroke="#111114" stroke-width="1.5" stroke-linejoin="round"/>';

  function openFriends() { SFX.tap(); busyLayer = true; $('friends').hidden = false; renderFriends(); loadFriends(); }
  function closeFriends() { $('friends').hidden = true; busyLayer = !$('game').hidden || !$('shop').hidden || !$('modal').hidden || !$('prizes').hidden || !$('missions').hidden || !$('ranking').hidden; SFX.tap(); }
  function loadFriends() { api2('GET').then(function (d) { friendsData = d && d.ok ? d : { ok: false }; renderFriends(); }); }
  function rowHTML(f) {
    return '<li class="fr-row"><button type="button" class="fr-main" data-visit="' + esc(f.id) + '"><span class="fr-av"><img src="' + RING + '" alt="" draggable="false"><b>' + f.level + '</b></span><span class="fr-who"><b>' + esc(f.name) + '</b><small>' + seenTxt(f.seen) + (f.saludado ? ' · ya lo saludaste' : '') + '</small></span></button>'
      + (f.friend ? '' : '<button type="button" class="fr-add" data-add="' + esc(f.id) + '" aria-label="Agregar a ' + esc(f.name) + ' a amigos">+</button>')
      + '<button type="button" class="btn sm" data-visit="' + esc(f.id) + '">Visitar</button></li>';
  }
  function renderFriends() {
    var box = $('friends-body'), d = friendsData;
    var h = '<form class="fr-phone" id="fr-phone"><label for="fr-tel">Agregar por número</label><div><input id="fr-tel" type="tel" inputmode="numeric" autocomplete="off" maxlength="16" placeholder="10 dígitos"><button type="submit" class="btn primary sm">Agregar</button></div><p class="hint left" id="fr-msg"></p></form>';
    if (!d) h += '<p class="hint center">Cargando…</p>';
    else if (!d.ok) h += '<p class="hint center">No se pudo cargar la lista. Revisa tu conexión.</p>';
    else {
      h += '<h3 class="fr-h">Tus amigos</h3>' + (d.friends.length ? '<ul class="fr-list">' + d.friends.map(rowHTML).join('') + '</ul>' : '<p class="hint left">Aún no agregas a nadie. Agrégalos con su número o desde la comunidad.</p>');
      h += '<h3 class="fr-h">Comunidad Hoshito</h3>' + (d.community.length ? '<ul class="fr-list">' + d.community.map(rowHTML).join('') + '</ul>' : '<p class="hint left">Todavía no hay más Hoshitos en la comunidad.</p>');
      h += '<p class="hint center">Saluda a cada Hoshito una vez al día (los primeros 3 saludos te dan monedas). Hoy puedes regalar ' + d.giftsLeft + (d.giftsLeft === 1 ? ' comida más.' : ' comidas más.') + '</p>';
    }
    box.innerHTML = h;
    $('fr-phone').addEventListener('submit', function (e) {
      e.preventDefault();
      var tel = $('fr-tel').value, msg = $('fr-msg'), btn = this.querySelector('button');
      if (tel.replace(/\D/g, '').length < 10) { msg.textContent = 'Escribe los 10 dígitos del número.'; return; }
      btn.disabled = true; msg.textContent = 'Buscando…';
      api2('POST', { action: 'phone', phone: tel }).then(function (r) {
        btn.disabled = false;
        if (r.ok) { SFX.good(); friendsData = null; loadFriends(); setTimeout(function () { var m = $('fr-msg'); if (m) m.textContent = '¡Listo! ' + r.name + ' ya está en tus amigos.'; }, 400); }
        else { SFX.fail(); msg.textContent = r.reason === 'self' ? 'Ese es tu propio número.' : r.reason === 'notfound' ? 'Ese número no tiene Hoshito todavía.' : 'No se pudo agregar. Intenta otra vez.'; }
      });
    });
    box.querySelectorAll('[data-visit]').forEach(function (b) { b.addEventListener('click', function () { openVisit(b.dataset.visit); }); });
    box.querySelectorAll('[data-add]').forEach(function (b) {
      b.addEventListener('click', function () { b.disabled = true; api2('POST', { action: 'add', id: b.dataset.add }).then(function (r) { if (r.ok) SFX.good(); loadFriends(); }); });
    });
  }

  // --- Visita ---
  function themedWith(r, id) {
    var list = THEMES[r], t = list[0];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) t = list[i];
    return SCENES[r].replace(/#[0-9a-fA-F]{6}/g, function (c) { return t.map[c.toLowerCase()] || c; });
  }
  var visitRaf = 0;
  function openVisit(id) {
    SFX.tap(); visiting = { id: id, loading: true }; giftMode = false;
    $('visit').hidden = false; busyLayer = true; renderVisit();
    api2('GET', null, '?id=' + encodeURIComponent(id)).then(function (r) {
      if (!visiting || visiting.id !== id) return;
      visiting = r && r.ok ? r : { id: id, error: true }; renderVisit();
    });
  }
  function closeVisit() { cancelAnimationFrame(visitRaf); $('visit').hidden = true; visiting = null; busyLayer = !$('friends').hidden || !$('game').hidden || !$('modal').hidden; SFX.tap(); }
  function visitLine(v) {
    var p = v.pet;
    if (p.sleeping) return 'Zzz… (está dormido)';
    var low = [p.hunger < 30 && 'tengo hambre', p.clean < 30 && 'necesito un baño', p.happy < 30 && 'estoy aburrido'].filter(Boolean);
    return low.length ? '¡Hola! Oye… ' + low[0] + '.' : ['¡Hola! Soy el Hoshito de ' + v.name + '.', '¡Qué gusto que vengas!', '¿Me trajiste algo rico?'][Math.floor(Math.random() * 3)];
  }
  function renderVisit() {
    cancelAnimationFrame(visitRaf);
    var v = visiting, box = $('visit-body');
    $('visit-title').textContent = v && v.name ? 'Hoshito de ' + v.name : 'De visita';
    if (!v || v.loading) { box.innerHTML = '<p class="hint center">Tocando la puerta…</p>'; return; }
    if (v.error) { box.innerHTML = '<p class="hint center">No se pudo abrir este Hoshito.</p>'; return; }
    var p = v.pet, room = p.sleeping ? 'recamara' : 'juegos';
    var rec = GAMES.filter(function (g) { return p.best[g.id] != null; }).map(function (g) { return '<li><span>' + g.name + '</span><b>' + p.best[g.id] + (g.unit || '') + '</b></li>'; }).join('');
    var h = '<div class="visit-room' + (p.sleeping ? ' asleep' : '') + '"><svg class="scene" viewBox="0 0 400 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + themedWith(room, p.themes[room]) + '</svg>'
      + '<p class="say visit-say">' + esc(visitLine(v)) + '</p><canvas class="visit-pet" width="10" height="10" aria-label="Hoshito de ' + esc(v.name) + '"></canvas><span class="visit-lvl">Nv ' + p.level + '</span></div>';
    if (giftMode) {
      var foods = FOODS.filter(function (f) { return S.fridge[f.id] > 0; });
      h += '<div class="visit-panel"><div class="panel-head"><h2 class="panel-title">Regalar comida</h2><button type="button" class="mini-link" id="gift-back">Volver</button></div>'
        + (foods.length ? '<div class="scroller">' + foods.map(function (f) { return '<button type="button" class="card" data-gift="' + f.id + '"><span class="cnt">×' + S.fridge[f.id] + '</span><svg class="pic" viewBox="0 0 40 40" aria-hidden="true">' + f.svg + '</svg><span class="nm">' + f.name + '</span></button>'; }).join('') + '</div>' : '<p class="hint left">Tu nevera está vacía. Compra comida en la tienda para poder regalar.</p>') + '</div>';
    } else {
      h += '<div class="visit-panel"><div class="row">'
        + '<button type="button" class="btn primary" id="v-hi"' + (v.saludado ? ' disabled' : '') + '><svg viewBox="0 0 24 24" aria-hidden="true">' + WAVE + '</svg>' + (v.saludado ? 'Saludado' : 'Saludar') + '</button>'
        + '<button type="button" class="btn" id="v-gift">Regalar comida</button></div>'
        + '<div class="row"><button type="button" class="btn sm" id="v-friend">' + (v.friend ? 'Quitar de amigos' : '+ Agregar a amigos') + '</button></div>'
        + (rec ? '<ul class="visit-rec">' + rec + '</ul>' : '') + '<p class="hint center">' + seenTxt(v.seen) + '</p></div>';
    }
    box.innerHTML = h;
    var cv = box.querySelector('.visit-pet'), mood = 'normal', bounce = 0;
    function fit() {
      var d = Math.min(window.devicePixelRatio || 1, 3), s = cv.clientWidth || 150;
      cv.width = Math.round(s * d); cv.height = Math.round(s * 1.2 * d);
    }
    fit();
    var t0 = performance.now();
    function frame(now) {
      if (!document.body.contains(cv)) return;
      if (!cv.clientWidth) { visitRaf = requestAnimationFrame(frame); return; }
      if (Math.abs(cv.width - cv.clientWidth * Math.min(window.devicePixelRatio || 1, 3)) > 2) fit();
      var ctx = cv.getContext('2d'), k = cv.width / 150, t = (now - t0) / 1000;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.setTransform(k, 0, 0, k, 0, 0);
      var by = p.sleeping ? 0 : -Math.abs(Math.sin(t * 2)) * 4 - bounce * 14; bounce = Math.max(0, bounce - 0.04);
      ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(75, 166, 46, 9, 0, 0, 7); ctx.fill();
      drawHoshitoHD(ctx, 75, 102 + by, 62, p.sleeping ? 'happy' : mood, p.sleeping ? 0 : Math.sin(t * 1.6) * 0.05, 0, p.wear);
      visitRaf = requestAnimationFrame(frame);
    }
    visitRaf = requestAnimationFrame(frame);
    cv.addEventListener('click', function () { if (p.sleeping) return; bounce = 1; mood = 'happy'; SFX.pop(); setTimeout(function () { mood = 'normal'; }, 900); });
    var sayV = function (t) { var s = box.querySelector('.visit-say'); if (s) s.textContent = t; };
    if ($('v-hi')) $('v-hi').addEventListener('click', function () {
      var b = this; b.disabled = true;
      api2('POST', { action: 'saludo', id: v.id }).then(function (r) {
        if (!r.ok) { b.disabled = false; if (r.reason === 'done') { v.saludado = true; renderVisit(); } else sayV('No se pudo mandar el saludo.'); return; }
        v.saludado = true; bounce = 1; mood = 'happy'; SFX.good();
        S.saludos = (S.saludos || 0) + 1;
        if (r.coins) S.coins += r.coins;
        save(); render();
        markSaludado(v.id); renderVisit();
        sayV('¡Hola, hola! Le diré a ' + v.name + ' que viniste.' + (r.coins ? ' (+' + r.coins + ' monedas)' : ''));
      });
    });
    if ($('v-gift')) $('v-gift').addEventListener('click', function () { giftMode = true; SFX.tap(); renderVisit(); });
    if ($('gift-back')) $('gift-back').addEventListener('click', function () { giftMode = false; SFX.tap(); renderVisit(); });
    box.querySelectorAll('[data-gift]').forEach(function (b) {
      b.addEventListener('click', function () {
        var fid = b.dataset.gift, f = FOOD_BY_ID[fid];
        if (!(S.fridge[fid] > 0)) return;
        box.querySelectorAll('[data-gift]').forEach(function (x) { x.disabled = true; });
        api2('POST', { action: 'regalo', id: v.id, food: fid }).then(function (r) {
          if (!r.ok) { SFX.fail(); giftMode = false; renderVisit(); sayV(r.reason === 'limit' ? 'Ya regalaste 5 comidas hoy. ¡Mañana más!' : 'No se pudo mandar el regalo.'); return; }
          S.fridge[fid]--; gainXP(4); save(); render(); SFX.good();
          if (friendsData && friendsData.ok) friendsData.giftsLeft = r.left;
          giftMode = false; renderVisit(); sayV('¡Mmm, ' + (f ? f.name.toLowerCase() : 'comida') + '! Gracias. Te quedan ' + r.left + ' regalos hoy.');
        });
      });
    });
    if ($('v-friend')) $('v-friend').addEventListener('click', function () {
      var on = !v.friend, b = this; b.disabled = true;
      api2('POST', { action: on ? 'add' : 'remove', id: v.id }).then(function (r) { if (r.ok) { v.friend = on; SFX.tap(); friendsData = null; if (!$('friends').hidden) loadFriends(); } renderVisit(); });
    });
  }
  function markSaludado(id) {
    if (!friendsData || !friendsData.ok) return;
    friendsData.friends.concat(friendsData.community).forEach(function (f) { if (f.id === id) f.saludado = true; });
    if (!$('friends').hidden) renderFriends();
  }
  $('btn-friends').addEventListener('click', openFriends);
  $('friends-close').addEventListener('click', closeFriends);
  $('visit-close').addEventListener('click', function () { closeVisit(); if (!$('friends').hidden) renderFriends(); });

  // --- Buzón: saludos y regalos que llegaron mientras no estabas ---
  function openInbox(tries) {
    if (busyLayer || !$('modal').hidden) { if ((tries || 0) < 20) setTimeout(function () { openInbox((tries || 0) + 1); }, 3000); return; }
    api2('POST', { action: 'buzon' }).then(function (r) {
      if (!r || !r.ok || !r.list || !r.list.length) return;
      var food = {}, hi = [];
      r.list.forEach(function (g) {
        if (g.kind === 'comida' && FOOD_BY_ID[g.food]) food[g.food] = (food[g.food] || 0) + 1;
        if (g.kind === 'saludo' && hi.indexOf(g.from) < 0) hi.push(g.from);
      });
      var givers = []; r.list.forEach(function (g) { if (g.kind === 'comida' && givers.indexOf(g.from) < 0) givers.push(g.from); });
      if (Object.keys(food).length) addFood(food);
      S.happy = Math.min(100, S.happy + Math.min(30, hi.length * 6)); save(); render();
      var body = '';
      if (hi.length) body += '<p>' + esc(hi.slice(0, 6).join(', ')) + (hi.length > 6 ? ' y ' + (hi.length - 6) + ' más' : '') + (hi.length === 1 ? ' vino' : ' vinieron') + ' a saludarte.</p>';
      if (givers.length) body += '<p style="margin-top:8px">' + esc(givers.slice(0, 6).join(', ')) + ' te ' + (givers.length === 1 ? 'dejó' : 'dejaron') + ' comida en la nevera:</p><div class="rw-list">' + foodLine(food) + '</div>';
      showModal(givers.length ? '¡Te llegaron regalos!' : '¡Te visitaron!', body, '¡Qué bonito!', function () { react('pet'); });
    });
  }
  setTimeout(openInbox, 4500);
  // ===================== TEMPORADA ACTIVA =====================
  function evBuyable(it) { var cur = eventAt(); return !!(it && it.excl === 'evento' && it.price && cur && cur.e.id === it.ev); }
  function evGiftItem(e) { return ITEMS.filter(function (it) { return it.ev === e.id && it.gift; })[0]; }
  function evSvgData(cols) {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="72" height="14" viewBox="0 0 72 14">' + cols.map(function (c, i) { return '<path d="M' + (i * 24) + ' 0h24l-12 14z" fill="' + c + '"/>'; }).join('') + '</svg>';
    return 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s) + '")';
  }
  var evBtn = null;
  function applyEvent() {
    var cur = eventAt(), app = $('app');
    if (!cur) { app.removeAttribute('data-ev'); if (evBtn) { evBtn.remove(); evBtn = null; } return; }
    app.setAttribute('data-ev', cur.e.id);
    app.style.setProperty('--ev-flags', evSvgData(cur.e.cols));
    app.style.setProperty('--ev1', cur.e.cols[0]); app.style.setProperty('--ev2', cur.e.cols[1]); app.style.setProperty('--ev3', cur.e.cols[2]);
    if (!evBtn) {
      var wrap = document.createElement('div'); wrap.className = 'room-btns right';
      wrap.innerHTML = '<button type="button" class="room-btn ev-btn" id="btn-event"><svg viewBox="0 0 24 24" aria-hidden="true"></svg><span class="rb-label"></span><span class="rb-badge" id="badge-event" hidden>1</span></button>';
      room.appendChild(wrap); evBtn = wrap;
      $('btn-event').addEventListener('click', function () { SFX.tap(); openEvent(); });
    }
    $('btn-event').querySelector('svg').innerHTML = cur.e.icon;
    $('btn-event').querySelector('.rb-label').textContent = cur.e.short.length > 10 ? 'Temporada' : cur.e.short;
    $('btn-event').setAttribute('aria-label', 'Temporada: ' + cur.e.name);
    var g = evGiftItem(cur.e); S.evGot = S.evGot || {};
    $('badge-event').hidden = !(g && !S.evGot[cur.key] && !hasItem(g.id));
  }
  function openEvent() {
    var cur = eventAt(); if (!cur) return;
    S.evGot = S.evGot || {};
    var g = evGiftItem(cur.e), canGift = g && !S.evGot[cur.key] && !hasItem(g.id);
    var shop = ITEMS.filter(function (it) { return it.ev === cur.e.id && !it.gift; }), foods = FOODS.filter(function (f) { return f.ev === cur.e.id; });
    var pic = function (vb, svg) { return '<svg viewBox="' + vb + '" aria-hidden="true">' + svg + '</svg>'; };
    var body = '<p>Del ' + fmtDay(cur.start) + ' al ' + fmtDay(cur.end) + ' todo se decora y hay cosas que solo salen estos días.</p>'
      + (g ? '<div class="ev-gift' + (canGift ? '' : ' got') + '">' + pic(g.vb, g.svg) + '<span><b>' + (canGift ? 'Regalo para ti' : 'Regalo recibido') + '</b>' + g.name + '</span></div>' : '')
      + '<div class="ev-shop">' + shop.map(function (it) { return '<span class="ev-chip">' + pic(it.vb, it.svg) + it.name + (hasItem(it.id) ? '' : ' · ' + it.price) + '</span>'; }).join('')
      + foods.map(function (f) { return '<span class="ev-chip">' + pic('0 0 40 40', f.svg) + f.name + ' · ' + f.price + '</span>'; }).join('') + '</div>'
      + '<p class="hint center" style="margin-top:6px">Lo que consigas se queda contigo para siempre.</p>';
    showModal(cur.e.name, body, canGift ? '¡Lo quiero!' : 'Ir a la tienda', function () {
      if (canGift) {
        S.evGot[cur.key] = true; S.owned.push(g.id); S.wear[g.slot] = g.id;
        renderWear(); save(); render(); applyEvent(); if (currentRoom === 'closet') renderPanel();
        SFX.level(); react('star'); say('¡' + g.name + '! ' + cur.e.hi, 6000);
      } else openShop('ropa');
    });
  }
  function eventIntro(tries) {
    var cur = eventAt(); if (!cur) return;
    S.evGot = S.evGot || {};
    var g = evGiftItem(cur.e);
    if (!g || S.evGot[cur.key] || hasItem(g.id)) { if (!busyLayer) say(cur.e.hi, 5000); return; }
    if (busyLayer || !$('modal').hidden) { if ((tries || 0) < 20) setTimeout(function () { eventIntro((tries || 0) + 1); }, 3000); return; }
    openEvent();
  }
  applyEvent(); renderScene();
  setTimeout(eventIntro, 2600);
  // Si el juego queda abierto al cambiar de día, revisa la temporada.
  var evLastDay = today();
  var evIv = setInterval(function () { if (today() !== evLastDay) { evLastDay = today(); applyEvent(); renderScene(); } }, 60000);
  cleanups.push(function () { clearInterval(evIv); });

  // ===================== PALABRA DEL DÍA =====================
  var PAL_EPOCH = new Date(2026, 0, 1);
  function palNumber(d) { d = d || new Date(); var a = new Date(d.getFullYear(), d.getMonth(), d.getDate()); return Math.round((a - PAL_EPOCH) / 86400000) + 1; }
  function palWord(n) { var i = (n - 1) % PAL_ANSWERS.length; return PAL_ANSWERS[(i + PAL_ANSWERS.length) % PAL_ANSWERS.length]; }
  function palValid(w) { if (!PAL_VALID) { PAL_VALID = {}; PAL_VALID_RAW.split(' ').forEach(function (x) { PAL_VALID[x] = 1; }); PAL_ANSWERS.forEach(function (x) { PAL_VALID[x] = 1; }); } return !!PAL_VALID[w]; }
  function palScore(guess, ans) {
    var res = [0, 0, 0, 0, 0], left = {}, i;
    for (i = 0; i < 5; i++) { if (guess[i] === ans[i]) res[i] = 2; else left[ans[i]] = (left[ans[i]] || 0) + 1; }
    for (i = 0; i < 5; i++) if (res[i] !== 2 && left[guess[i]]) { res[i] = 1; left[guess[i]]--; }
    return res;
  }
  var PAL_PRIZE = [60, 45, 35, 25, 18, 12];
  function palState() {
    var n = palNumber();
    if (!S.pal || S.pal.n !== n) S.pal = { n: n, guesses: [], done: false, won: false };
    S.palStats = S.palStats || { played: 0, won: 0, streak: 0, best: 0, lastWin: 0, dist: [0, 0, 0, 0, 0, 0] };
    return S.pal;
  }
  function palShare() {
    var p = palState(), ans = palWord(p.n);
    var lines = p.guesses.map(function (g) { return palScore(g, ans).map(function (v) { return v === 2 ? '🟩' : v === 1 ? '🟨' : '⬛'; }).join(''); });
    return 'Hoshito · Palabra #' + p.n + ' ' + (p.won ? p.guesses.length : 'X') + '/6\n' + lines.join('\n');
  }
  function palCopy(btn) {
    var t = palShare(), done = function () { btn.textContent = '¡Copiado!'; setTimeout(function () { btn.textContent = 'Compartir resultado'; }, 1600); };
    if (navigator.share) { navigator.share({ text: t }).catch(function () {}); return; }
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, function () {}); else done();
  }
  function untilMidnight() { var n = new Date(), m = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1), s = Math.max(0, Math.floor((m - n) / 1000)); return Math.floor(s / 3600) + ' h ' + Math.floor(s % 3600 / 60) + ' min'; }
  var PAL_ROWS = ['qwertyuiop', 'asdfghjklñ', 'zxcvbnm'];
  var PAL_GAME = { id: 'palabra', daily: true, name: 'Palabra del día', short: 'Adivina la palabra de hoy', help: 'Adivina la palabra de 5 letras en 6 intentos. Verde: letra en su lugar. Amarillo: está, pero en otro lugar.',
    icon: '<rect width="40" height="40" rx="10" fill="#3f9a63"/><rect x="5" y="13" width="9" height="13" rx="2" fill="#bfe8cc"/><rect x="15.5" y="13" width="9" height="13" rx="2" fill="#ffd54a"/><rect x="26" y="13" width="9" height="13" rx="2" fill="#24352f"/>',
    line: function (score, coins) {
      var p = palState(), ans = palWord(p.n).toUpperCase(), st = S.palStats;
      return '<p>' + (p.won ? 'Lo adivinaste en ' + p.guesses.length + (p.guesses.length === 1 ? ' intento.' : ' intentos.') : 'La palabra era <b>' + ans + '</b>.') + '</p><p style="margin-top:6px;font-size:13px">Racha: <b>' + st.streak + '</b> · Mejor racha: ' + st.best + '</p><button type="button" class="btn sm" id="pal-share" style="margin-top:10px;width:100%">Compartir resultado</button>';
    },
    after: function () { var b = $('pal-share'); if (b) b.addEventListener('click', function () { palCopy(b); }); },
    start: function (area, api) {
      var p = palState(), ans = palWord(p.n), cur = '', busy = false, stopped = false;
      var box = document.createElement('div'); box.className = 'pal';
      box.innerHTML = '<p class="pal-num">Palabra #' + p.n + '</p><div class="pal-grid" id="pal-grid"></div><p class="chef-msg" id="pal-msg" aria-live="polite"></p><div class="pal-kb" id="pal-kb"></div>';
      area.appendChild(box);
      var grid = box.querySelector('#pal-grid'), kb = box.querySelector('#pal-kb'), msg = box.querySelector('#pal-msg');
      function keyState() { var k = {}; p.guesses.forEach(function (g) { palScore(g, ans).forEach(function (v, i) { k[g[i]] = Math.max(k[g[i]] == null ? -1 : k[g[i]], v); }); }); return k; }
      function draw(reveal) {
        var h = '';
        for (var r = 0; r < 6; r++) {
          var g = p.guesses[r], sc = g ? palScore(g, ans) : null, w = g || (r === p.guesses.length && !p.done ? cur : '');
          h += '<div class="pal-row' + (r === p.guesses.length && !p.done ? ' now' : '') + '">';
          for (var i = 0; i < 5; i++) {
            var ch = w[i] || '', cls = sc ? (sc[i] === 2 ? ' ok' : sc[i] === 1 ? ' near' : ' no') : ch ? ' typed' : '';
            h += '<span class="pal-tile' + cls + (reveal === r ? ' flip' : '') + '" style="' + (reveal === r ? 'animation-delay:' + (i * 0.12) + 's' : '') + '">' + ch.toUpperCase() + '</span>';
          }
          h += '</div>';
        }
        grid.innerHTML = h;
        var ks = keyState();
        kb.innerHTML = PAL_ROWS.map(function (row, ri) {
          return '<div class="kb-row">' + (ri === 2 ? '<button type="button" class="kb wide" data-k="enter">Enviar</button>' : '') + row.split('').map(function (c) { var v = ks[c]; return '<button type="button" class="kb' + (v === 2 ? ' ok' : v === 1 ? ' near' : v === 0 ? ' no' : '') + '" data-k="' + c + '">' + c.toUpperCase() + '</button>'; }).join('') + (ri === 2 ? '<button type="button" class="kb wide" data-k="back" aria-label="Borrar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5h11v14H9l-6-7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 9l5 6M17 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' : '') + '</div>';
        }).join('');
        api.score(p.guesses.length + '/6');
      }
      function shake() { var row = grid.querySelector('.pal-row.now'); if (row) { row.classList.remove('shake'); void row.offsetWidth; row.classList.add('shake'); } }
      function finish() {
        var st = S.palStats; st.played++;
        if (p.won) { st.won++; st.dist[p.guesses.length - 1]++; st.streak = st.lastWin === p.n - 1 ? st.streak + 1 : 1; st.lastWin = p.n; st.best = Math.max(st.best, st.streak); }
        else st.streak = 0;
        save();
        var coins = p.won ? PAL_PRIZE[p.guesses.length - 1] + Math.min(20, (st.streak - 1) * 5) : 5;
        setTimeout(function () { if (!stopped) api.end(p.won ? p.guesses.length : 0, coins); }, 1500);
      }
      function press(k) {
        if (busy || p.done || stopped) return;
        if (k === 'back') { cur = cur.slice(0, -1); draw(); return; }
        if (k === 'enter') {
          if (cur.length < 5) { msg.textContent = 'Faltan letras.'; SFX.fail(); shake(); return; }
          if (!palValid(cur)) { msg.textContent = 'Esa palabra no está en la lista.'; SFX.fail(); shake(); return; }
          p.guesses.push(cur); var won = cur === ans; cur = ''; msg.textContent = '';
          if (won || p.guesses.length >= 6) { p.done = true; p.won = won; }
          busy = true; draw(p.guesses.length - 1); SFX.tap(); save();
          setTimeout(function () {
            busy = false;
            if (p.won) { msg.textContent = ['¡Genio!', '¡Increíble!', '¡Muy bien!', '¡Bien!', '¡Uf, por poco!', '¡Al último!'][p.guesses.length - 1]; SFX.level(); finish(); }
            else if (p.done) { msg.textContent = 'Era: ' + ans.toUpperCase(); SFX.fail(); finish(); }
          }, 800);
          return;
        }
        if (cur.length < 5 && /^[a-zñ]$/.test(k)) { cur += k; draw(); }
      }
      kb.addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (b) { press(b.dataset.k); } });
      function onKey(e) {
        if ($('game').hidden) return;
        var k = e.key; if (k === 'Enter') { e.preventDefault(); press('enter'); } else if (k === 'Backspace') { e.preventDefault(); press('back'); }
        else if (k && k.length === 1) { var c = k.toLowerCase().normalize('NFD').replace(/[̀-́̈]/g, '').normalize('NFC'); if (/^[a-zñ]$/.test(c)) press(c); }
      }
      window.addEventListener('keydown', onKey);
      draw();
      if (p.done) {
        msg.innerHTML = (p.won ? '¡Ya la adivinaste hoy!' : 'Hoy era: <b>' + ans.toUpperCase() + '</b>') + ' Nueva palabra en ' + untilMidnight() + '.';
        var sh = document.createElement('button'); sh.type = 'button'; sh.className = 'btn sm pal-share'; sh.textContent = 'Compartir resultado';
        sh.addEventListener('click', function () { palCopy(sh); }); box.insertBefore(sh, kb); kb.hidden = true;
      }
      return function () { stopped = true; window.removeEventListener('keydown', onKey); };
    } };
  GAMES.unshift(PAL_GAME);
  function palToday() { var p = palState(); return p.done ? (p.won ? 'Hoy: ' + p.guesses.length + '/6 · racha ' + S.palStats.streak : 'Hoy: X/6 · mañana otra') : p.guesses.length ? 'Vas en ' + p.guesses.length + '/6' : '¡Nueva palabra!'; }
  // ===================== COLABORACIONES (pestaña en Premios) =====================
  function colabReady(it) { if (hasItem(it.id)) return false; var g = it.goal(); return g[0] >= g[1]; }
  function colabClaimable() { return ITEMS.filter(function (it) { return it.excl === 'colab' && colabReady(it); }).length; }
  var renderBadgesBase = renderBadges;
  renderBadges = function () {
    renderBadgesBase();
    var c = colabClaimable(); if (!c) return;
    var bp = $('badge-prizes'), n = (+bp.textContent || 0) * (bp.hidden ? 0 : 1) + c;
    bp.textContent = n; bp.hidden = false;
  };
  var renderPrizesBase = renderPrizes;
  renderPrizes = function () {
    if (prizeTab !== 'colabs') return renderPrizesBase();
    document.querySelectorAll('#prizes .seg button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.ptab === prizeTab)); });
    var box = $('prizes-body'), h = '<p class="hint center">Colecciones especiales. Cumple el reto de cada prenda para ganarla.</p>';
    COLABS.forEach(function (c) {
      var list = ITEMS.filter(function (it) { return it.colab === c.id; }), got = list.filter(function (it) { return hasItem(it.id); }).length;
      h += '<section class="colab" style="--cc:' + c.color + '"><div class="colab-head"><svg viewBox="0 0 24 24" aria-hidden="true">' + c.logo + '</svg><div><b>' + c.name + '</b><small>' + c.text + '</small></div><span class="colab-n">' + got + '/' + list.length + '</span></div>';
      list.forEach(function (it) {
        var own = hasItem(it.id), g = it.goal(), ready = !own && g[0] >= g[1], pct = Math.min(100, Math.round(g[0] / g[1] * 100));
        h += '<div class="colab-item' + (own ? ' got' : ready ? ' ready' : '') + '"><svg class="pic" viewBox="' + it.vb + '" aria-hidden="true">' + it.svg + '</svg><div class="ci-body"><b>' + it.name + '</b><small>' + g[2] + '</small>'
          + (own ? '' : '<span class="bar"><i style="width:' + pct + '%"></i></span><small class="ci-n">' + (g[1] === 1 ? (ready ? 'Listo' : 'Pendiente') : Math.min(g[0], g[1]) + ' / ' + g[1]) + '</small>') + '</div>'
          + (own ? '<span class="tag">Tuyo</span>' : ready ? '<button type="button" class="btn sm primary" data-colab="' + it.id + '">Cobrar</button>' : '') + '</div>';
      });
      h += '</section>';
    });
    box.innerHTML = h;
    box.querySelectorAll('[data-colab]').forEach(function (b) {
      b.addEventListener('click', function () {
        var it = itemById(b.dataset.colab); if (!it || !colabReady(it)) return;
        S.owned.push(it.id); S.wear[it.slot] = it.id; renderWear(); save(); render(); renderBadges(); renderPrizes();
        SFX.level(); react('star');
        var c = colabById(it.colab);
        showModal('¡Colab ' + c.name + '!', '<div class="rw-list big"><span class="rw-line"><svg class="rw-pic" viewBox="' + it.vb + '" aria-hidden="true">' + it.svg + '</svg>' + it.name + '</span></div><p class="small">Ya se lo puso. Lo encuentras en el closet.</p>', '¡Me queda!');
      });
    });
  };
  renderBadges();

  return function stop() {
    cleanups.forEach(function (f) { try { f(); } catch (e) { /* nada */ } });
    root.innerHTML = '';
  };
}

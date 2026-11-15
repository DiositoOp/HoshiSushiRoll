'use client';

import { useEffect, useRef, useState } from 'react';

const MESSAGES = {
  idle: 'Cuida cada rollo que sale de la cocina. Hazlo reaccionar.',
  hi: '¡Hola! Qué gusto verte por aquí.',
  pet: 'Así se pone cuando lo consienten.',
  feed: '¡Ñam! Nada lo emociona más que un rollo recién hecho.',
  wink: 'Te guarda un lugar en la terraza.',
  jump: '¡Boing! Salta de gusto cuando sale tu pedido.',
  spin: 'Una vuelta completa, como rollo en la esterilla.',
  sleep: 'Shh… está soñando con arroz recién hecho.',
  surprise: '¡¿Ya llegó tu orden?! No se lo esperaba.',
  dizzy: 'Demasiadas vueltas en la esterilla de bambú.',
  sad: 'Se acabó el último rollo… pero mañana hay más.',
  angry: '¡Nadie le quita su rollo a Hoshito!',
  dance: 'Cuando suena su canción, no hay quien lo pare.',
  sneeze: 'Se le metió un poquito de ajonjolí.',
  love: 'Así mira a un rollo empanizado.',
  spicy: 'Se pasó con el wasabi… ¡y con el chipotle!',
  cold: 'Brrr… alguien dejó abierta la nevera del pescado.',
  party: '¡A celebrar! Hoshito está de fiesta.',
  think: 'Pensando qué rollo pedir hoy…',
  star: '"Hoshi" significa estrella. Y hoy Hoshito brilla.',
};

// Botón, reacción y cuánto dura (ms) antes de volver al reposo
const REACTIONS = [
  ['hi', 'Saludar', 2600], ['pet', 'Consentir', 2600], ['feed', 'Darle un rollo', 2600], ['wink', 'Guiñar', 2600],
  ['jump', 'Saltar', 1900], ['spin', 'Girar', 1900], ['sleep', 'Dormir', 3900], ['surprise', 'Sorpresa', 2300],
  ['dizzy', 'Marearse', 3100], ['sad', 'Llorar', 3100], ['angry', 'Enojarse', 2700], ['dance', 'Bailar', 2700],
  ['sneeze', 'Estornudar', 2700], ['love', 'Enamorarse', 2900], ['spicy', 'Wasabi', 3100], ['cold', 'Tener frío', 3000],
  ['party', 'Fiesta', 2800], ['think', 'Pensar', 3100], ['star', 'Ojos de estrella', 2900],
];

/**
 * Hoshito con cara animada y 19 reacciones. El aro con el nombre es el logo en vectorial
 * (public/hoshito/aro.svg); la cara está dibujada por partes encima para poder animarla.
 * Estilos: hoshito.css (todo dentro de .hoshito-page).
 */
export default function HoshitoMascot() {
  const [mood, setMood] = useState('idle');
  const [run, setRun] = useState(0); // cambia en cada toque para reiniciar la animación
  const timer = useRef(null);

  function react(next, ms) {
    clearTimeout(timer.current);
    setMood(next);
    setRun((n) => n + 1);
    timer.current = setTimeout(() => setMood('idle'), ms);
  }
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="mascot">
      <div className={`mascot-stage is-${mood}`} key={run}>
                <span className="fx shadow" aria-hidden="true"></span>
        <div className="hoshi" role="img" aria-label="Hoshito, la mascota de Hoshi Sushi Roll">
        <img src="/hoshito/aro.svg" alt="" width="256" height="256" />
        <svg className="hoshi-face" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="100" fill="#fff" />
        <circle cx="100" cy="100" r="76" fill="#fff" stroke="#111114" strokeWidth="3" />
        {/* Tintes de color (enojo, wasabi, frío) */}
        <circle className="tint tint-red" cx="100" cy="100" r="74.5" fill="#ff6b5a" />
        <circle className="tint tint-blue" cx="100" cy="100" r="74.5" fill="#8fd3ff" />
        <g transform="translate(100 100) scale(1.22) translate(-100 -102)">
        <rect x="64" y="50" width="52" height="48" rx="15" fill="#c2e8aa" />
        <circle cx="128" cy="112" r="23" fill="#f6a65c" />
        <ellipse className="blush" cx="56" cy="114" rx="13" ry="9" fill="#ffb3c4" />
        <ellipse className="blush" cx="147" cy="118" rx="12" ry="8" fill="#ffb3c4" />

        <g className="eye eye-left">
        <circle cx="80" cy="90" r="15" fill="#111114" />
        <circle cx="75" cy="85" r="5.5" fill="#fff" />
        <circle cx="85" cy="95" r="2.5" fill="#fff" />
        </g>
        <g className="eye eye-right">
        <circle cx="122" cy="90" r="15" fill="#111114" />
        <circle cx="117" cy="85" r="5.5" fill="#fff" />
        <circle cx="127" cy="95" r="2.5" fill="#fff" />
        </g>
        <path className="smile smile-left" d="M66 94 Q80 76 94 94" fill="none" stroke="#111114" strokeWidth="6" strokeLinecap="round" />
        <path className="smile smile-right" d="M108 94 Q122 76 136 94" fill="none" stroke="#111114" strokeWidth="6" strokeLinecap="round" />

        <g className="mouth">
        <path d="M81 116 H121 A20 23 0 0 1 81 116 Z" fill="#111114" />
        <ellipse cx="101" cy="134" rx="10" ry="6" fill="#ff9fb4" />
        </g>

        {/* Partes extra para las animaciones nuevas */}
        <g className="alt brows" fill="none" stroke="#111114" strokeWidth="7" strokeLinecap="round">
        <path d="M62 66 L94 78" /><path d="M140 66 L108 78" />
        </g>
        <g className="alt closed" fill="none" stroke="#111114" strokeWidth="6" strokeLinecap="round">
        <path d="M66 90 Q80 102 94 90" /><path d="M108 90 Q122 102 136 90" />
        </g>
        <g className="alt squint" fill="none" stroke="#111114" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M68 80 L90 90 L68 100" /><path d="M134 80 L112 90 L134 100" />
        </g>
        <path className="alt spiral" d="M80 90 a2 2 0 0 1 4 0 a4 4 0 0 1 -8 0 a6 6 0 0 1 12 0 a8 8 0 0 1 -16 0 a10 10 0 0 1 20 0 a12 12 0 0 1 -24 0" fill="none" stroke="#111114" strokeWidth="2.6" strokeLinecap="round" />
        <path className="alt spiral" d="M122 90 a2 2 0 0 1 4 0 a4 4 0 0 1 -8 0 a6 6 0 0 1 12 0 a8 8 0 0 1 -16 0 a10 10 0 0 1 20 0 a12 12 0 0 1 -24 0" fill="none" stroke="#111114" strokeWidth="2.6" strokeLinecap="round" />
        <g className="alt heart-eyes" fill="#ff4d6d" stroke="#111114" strokeWidth="1.6">
        <g className="he"><path transform="translate(65.6 74.7) scale(1.2)" d="M12 21s-7.5-4.7-10-9.2C.3 8.6 1.9 4.5 5.8 4.5c2.2 0 3.8 1.2 4.7 2.6l1.5 2.2 1.5-2.2c.9-1.4 2.5-2.6 4.7-2.6 3.9 0 5.5 4.1 3.8 7.3C19.5 16.3 12 21 12 21z" /></g>
        <g className="he"><path transform="translate(107.6 74.7) scale(1.2)" d="M12 21s-7.5-4.7-10-9.2C.3 8.6 1.9 4.5 5.8 4.5c2.2 0 3.8 1.2 4.7 2.6l1.5 2.2 1.5-2.2c.9-1.4 2.5-2.6 4.7-2.6 3.9 0 5.5 4.1 3.8 7.3C19.5 16.3 12 21 12 21z" /></g>
        </g>
        <g className="alt star-eyes" fill="#ffd54a" stroke="#111114" strokeWidth="1.4" strokeLinejoin="round">
        <g className="se"><path transform="translate(64.4 75) scale(1.3)" d="M12 1l3.1 6.9 7.5.8-5.6 5 1.6 7.4L12 17.3 5.4 21.1 7 13.7 1.4 8.7l7.5-.8z" /></g>
        <g className="se"><path transform="translate(106.4 75) scale(1.3)" d="M12 1l3.1 6.9 7.5.8-5.6 5 1.6 7.4L12 17.3 5.4 21.1 7 13.7 1.4 8.7l7.5-.8z" /></g>
        </g>
        <g className="alt tears" fill="#7cc8ff" stroke="#111114" strokeWidth="1.2">
        <path className="tear tear-l" d="M70 104 C67 110 65 113 65 116 A5 5 0 0 0 75 116 C75 113 73 110 70 104 Z" />
        <path className="tear tear-r" d="M132 104 C129 110 127 113 127 116 A5 5 0 0 0 137 116 C137 113 135 110 132 104 Z" />
        </g>
        <g className="alt mouth-o">
        <ellipse cx="101" cy="124" rx="10" ry="12" fill="#111114" />
        <ellipse cx="101" cy="130" rx="6" ry="4" fill="#ff9fb4" />
        </g>
        <path className="alt mouth-sad" d="M87 130 Q101 116 115 130" fill="none" stroke="#111114" strokeWidth="6" strokeLinecap="round" />
        <path className="alt mouth-wavy" d="M83 124 q4.5 -6 9 0 t9 0 t9 0 t9 0" fill="none" stroke="#111114" strokeWidth="5" strokeLinecap="round" />
        <path className="alt mouth-chatter" d="M83 121 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6" fill="none" stroke="#111114" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path className="alt mouth-flat" d="M91 124 Q102 120 113 126" fill="none" stroke="#111114" strokeWidth="5" strokeLinecap="round" />
        <ellipse className="alt mouth-tiny" cx="101" cy="123" rx="5" ry="4.5" fill="#111114" />
        </g>
        </svg>
        </div>

        {/* Efectos originales */}
        <span className="fx bubble b-hi" aria-hidden="true">¡Hola!</span>
        <span className="fx heart h1" aria-hidden="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.5-4.7-10-9.2C.3 8.6 1.9 4.5 5.8 4.5c2.2 0 3.8 1.2 4.7 2.6l1.5 2.2 1.5-2.2c.9-1.4 2.5-2.6 4.7-2.6 3.9 0 5.5 4.1 3.8 7.3C19.5 16.3 12 21 12 21z" /></svg></span>
        <span className="fx heart h2" aria-hidden="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.5-4.7-10-9.2C.3 8.6 1.9 4.5 5.8 4.5c2.2 0 3.8 1.2 4.7 2.6l1.5 2.2 1.5-2.2c.9-1.4 2.5-2.6 4.7-2.6 3.9 0 5.5 4.1 3.8 7.3C19.5 16.3 12 21 12 21z" /></svg></span>
        <span className="fx heart h3" aria-hidden="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.5-4.7-10-9.2C.3 8.6 1.9 4.5 5.8 4.5c2.2 0 3.8 1.2 4.7 2.6l1.5 2.2 1.5-2.2c.9-1.4 2.5-2.6 4.7-2.6 3.9 0 5.5 4.1 3.8 7.3C19.5 16.3 12 21 12 21z" /></svg></span>
        <svg className="fx bite" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="19" fill="#111114" />
        <circle cx="20" cy="20" r="14" fill="#fff" />
        <circle cx="16" cy="18" r="5" fill="#ff9f7a" />
        <circle cx="24" cy="23" r="4.5" fill="#c2e8aa" />
        </svg>
        <svg className="fx sparkle s1" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>

        {/* Efectos nuevos */}
        <svg className="fx sparkle s2" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
        <svg className="fx sparkle s3" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
        <span className="fx bubble b-achoo" aria-hidden="true">¡Achú!</span>
        <span className="fx bubble b-pica" aria-hidden="true">¡Pica!</span>
        <span className="fx bubble b-party" aria-hidden="true">¡Yupi!</span>
        <span className="fx zz z1" aria-hidden="true">Z</span>
        <span className="fx zz z2" aria-hidden="true">Z</span>
        <span className="fx zz z3" aria-hidden="true">Z</span>
        <span className="fx exclaim" aria-hidden="true">!</span>
        <span className="fx note n1" aria-hidden="true">♪</span>
        <span className="fx note n2" aria-hidden="true">♫</span>
        <span className="fx note n3" aria-hidden="true">♪</span>
        <span className="fx puff p1" aria-hidden="true"></span>
        <span className="fx puff p2" aria-hidden="true"></span>
        <svg className="fx flake f1" viewBox="0 0 24 24" aria-hidden="true"><g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17l17.4-10M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5" fill="none" /></g></svg>
        <svg className="fx flake f2" viewBox="0 0 24 24" aria-hidden="true"><g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17l17.4-10M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5" fill="none" /></g></svg>
        <svg className="fx flake f3" viewBox="0 0 24 24" aria-hidden="true"><g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17l17.4-10M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5" fill="none" /></g></svg>
        <span className="fx tdot d1" aria-hidden="true"></span>
        <span className="fx tdot d2" aria-hidden="true"></span>
        <span className="fx think" aria-hidden="true">?</span>
        <div className="fx orbit" aria-hidden="true">
        <div className="orbit-in">
        <svg className="ostar o1" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1l3.1 6.9 7.5.8-5.6 5 1.6 7.4L12 17.3 5.4 21.1 7 13.7 1.4 8.7l7.5-.8z" /></svg>
        <svg className="ostar o2" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1l3.1 6.9 7.5.8-5.6 5 1.6 7.4L12 17.3 5.4 21.1 7 13.7 1.4 8.7l7.5-.8z" /></svg>
        <svg className="ostar o3" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1l3.1 6.9 7.5.8-5.6 5 1.6 7.4L12 17.3 5.4 21.1 7 13.7 1.4 8.7l7.5-.8z" /></svg>
        </div>
        </div>
        <div className="confetti" aria-hidden="true">
        <i style={{'--x': '-110px', '--y': '-90px', '--r': '200deg', '--c': '#ff8fa8'}}></i>
        <i style={{'--x': '-70px', '--y': '-130px', '--r': '-160deg', '--c': '#ffe08a'}}></i>
        <i style={{'--x': '-20px', '--y': '-150px', '--r': '240deg', '--c': '#bfe8cc'}}></i>
        <i style={{'--x': '30px', '--y': '-145px', '--r': '-220deg', '--c': '#ffb4a3'}}></i>
        <i style={{'--x': '80px', '--y': '-120px', '--r': '180deg', '--c': '#8fd3ff'}}></i>
        <i style={{'--x': '120px', '--y': '-80px', '--r': '-200deg', '--c': '#ffe08a'}}></i>
        <i style={{'--x': '135px', '--y': '-20px', '--r': '260deg', '--c': '#ff8fa8'}}></i>
        <i style={{'--x': '-135px', '--y': '-25px', '--r': '-240deg', '--c': '#bfe8cc'}}></i>
        <i style={{'--x': '-95px', '--y': '-55px', '--r': '140deg', '--c': '#8fd3ff'}}></i>
        <i style={{'--x': '95px', '--y': '-50px', '--r': '-150deg', '--c': '#bfe8cc'}}></i>
        <i style={{'--x': '-45px', '--y': '-100px', '--r': '300deg', '--c': '#ffb4a3'}}></i>
        <i style={{'--x': '50px', '--y': '-95px', '--r': '-280deg', '--c': '#ff8fa8'}}></i>
        </div>
      </div>

      <div className="mascot-copy">
        <p className="mascot-message" aria-live="polite">{MESSAGES[mood]}</p>
        <div className="chips">
          {REACTIONS.map(([id, label, ms]) => (
            <button key={id} type="button" className={`chip${mood === id ? ' is-on' : ''}`} onClick={() => react(id, ms)}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

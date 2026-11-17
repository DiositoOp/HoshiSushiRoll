# Hoshito: la mascota de la comunidad Hoshi

`/Hoshito/jugar` es un juego tipo Pou solo para la comunidad cercana: clientes muy frecuentes, el equipo y amigos. No se anuncia ni se abre al público.

## Cómo entra alguien

1. La persona necesita una tarjeta de sellos en su teléfono, como cualquier cliente (se registra en `/r/<punto>`).
2. En el panel, entra a **Clientes**, abre su ficha y toca **Dar acceso a Hoshito**. Se le regala un giro de bienvenida.
3. En **Mi tarjeta** le aparece "Hoshito te espera", que lo lleva al juego.

Quitar el acceso no borra su progreso: si se lo vuelves a dar, sigue donde se quedó. Su Hoshito está ligado a su tarjeta, así que si cambia de teléfono y caja le vincula la tarjeta, lo recupera.

## Premios por visitas (no se pueden falsear)

- **Ruleta Hoshi:** cada sello que confirma caja (o que se da a mano en caja) le da un giro. Los premios son comunes, raros o legendarios, y algunos objetos solo salen ahí. Si ya tiene el objeto, se le cambia por monedas. Las correcciones de sellos del dueño no dan giros.
- **Camino de visitas:** premios seguros en las visitas 1 a 10, 12, 14, 16, 18 y 20 (cuenta las visitas confirmadas totales).

Los giros, el camino y los objetos exclusivos los decide y guarda el servidor. Las monedas, el nivel y los cuidados viven en el juego.

## Para que lo abran cada día (unos 5 minutos)

- **Jardín:** 4 macetas (la 3 y la 4 se abren en los niveles 4 y 8). Siembras con monedas, a la mitad la planta tiene sed y se detiene hasta que la riegues, y luego cosechas comida, monedas o, con la sakura, un exclusivo. Las plantas tardan de 1 a 12 horas reales, así que invitan a volver.
- **Ranking semanal de la comunidad:** cada minijuego tiene su tabla de la semana, que se reinicia el lunes en el horario del restaurante. Los 3 primeros de la semana pasada cobran 150, 80 y 40 monedas por juego, y el primer lugar gana la Medalla de campeón.
- **3 misiones diarias** distintas para cada persona, más un cofre si completa las tres.
- **Premio diario** con racha de 7 días.
- **Al volver**, Hoshito avisa qué hay pendiente: giros, plantas listas o con sed, y misiones por cobrar.
- Sus necesidades bajan con el tiempo real.

## Economía

El objetivo es que alguien que juega 5 a 10 minutos al día gane unas **250 monedas diarias** y gaste unas 70 en comida, así que ahorra unas **180 al día**. La tienda (ropa y fondos, unas 7,000 monedas) dura alrededor de **40 días**. Lo exclusivo no se compra: sale de visitas, ruleta, niveles, jardín y ranking.

| De dónde salen las monedas | Cuánto |
|---|---|
| Premio diario | 15 a 45 |
| Misiones (3 + cofre) | unas 150 |
| Minijuegos | 10 a 30 por partida; cada partida gasta 12 de energía, que se recupera durmiendo (unos 10 minutos) |
| Subir de nivel | 30 + 10 por nivel; comida cada 3 niveles; exclusivos en los niveles 5, 8, 10, 12, 15 y 20 |
| Jardín | comida, o 150 a 300 monedas con chile y sakura |
| Ruleta (una por visita) | 60 a 500, o un exclusivo |
| Camino de visitas | 100 a 600, comida y exclusivos: es lo más generoso, porque cada visita es una compra real |
| Podio semanal | 150, 80 y 40 por juego |

| En qué se gastan | Precio |
|---|---|
| Comida | 4 a 14 (unas 70 al día) |
| Ropa | 90 a 900 según el nivel |
| Fondos | 200 a 400 |
| Semillas | 15 a 120 |

Todos los premios de visitas, ruleta y ranking están en `lib/hoshitoRewards.js`. Los precios de la tienda están al inicio de la sección "ECONOMÍA v4" en `app/Hoshito/jugar/engine.js`.

## Amigos

- En el juego, el botón **Amigos** muestra la comunidad (todas las personas con acceso que ya abrieron su Hoshito) y sus amigos arriba.
- Se agrega a alguien con su número de teléfono (los 10 dígitos) o con el **+** de la lista. Nunca se muestra el teléfono de nadie: solo el nombre corto (por ejemplo "Ana P.").
- Al visitar se ve el Hoshito de la otra persona con su ropa, su fondo y sus récords. Se puede:
  - **Saludar**: una vez al día por persona. Los primeros 3 saludos del día dan 5 monedas a quien saluda.
  - **Regalar comida** de la propia nevera: hasta 5 regalos al día.
- Los saludos y regalos llegan a un buzón y se entregan la próxima vez que la otra persona abre el juego.
- Tablas: `hoshito_friends` y `hoshito_gifts`. API: `/api/hoshito/amigos`.

## Temporadas

Durante estas fechas se decoran los cuartos y la app, Hoshito regala una prenda gratis, y en la tienda salen ropa y comida que solo se venden esos días. Lo que alguien consigue se queda para siempre.

| Temporada | Fechas | Regalo | En la tienda |
|---|---|---|---|
| Año Nuevo | 31 dic – 2 ene | Gorrito de Año Nuevo | Corbatín dorado, 12 uvas |
| Día de Reyes | 3 – 6 ene | Corona de papel | Capa de rey mago, rosca |
| Candelaria | 30 ene – 2 feb | Sombrero de palma | Rebozo, tamal |
| Amor y Amistad | 10 – 14 feb | Diadema de corazones | Collar de corazón, fresas con chocolate |
| Día del Niño | 26 – 30 abr | Gorrito de hélice | Lentes de juguete, algodón de azúcar |
| Día de las Madres | 6 – 10 may | Flor de clavel | Moño rosa, pastel |
| Día del Padre | 4 días antes del 3.er domingo de junio, hasta ese domingo | Corbata de papá | Lentes de papá, carne asada |
| Fiestas Patrias | 10 – 16 sep | Sombrero patrio | Moño tricolor, pozole |
| Día de Muertos | 28 oct – 2 nov | Corona de cempasúchil | Maquillaje de catrina, pan de muerto |
| Posadas y Navidad | 12 – 30 dic | Gorro navideño | Bufanda navideña, aura de nieve, buñuelo, ponche |
| Aniversario Hoshi | 3 días antes y 3 después de la fecha | Gorrito de aniversario | Aura de confeti, rollo de aniversario |

**Fecha del aniversario:** en `lib/hoshitoRewards.js` cambia `ANIVERSARIO = null` por la fecha, por ejemplo `{ mes: 3, dia: 14 }`, y vuelve a publicar. Mientras sea `null`, esa temporada no aparece.

Las fechas y los dibujos están en `app/Hoshito/jugar/engine.js` (busca "TEMPORADAS").

## Palabra del día

En Juegos, arriba, está la Palabra del día: una palabra de 5 letras, la misma para todos, con 6 intentos. Acepta la Ñ y no distingue acentos.

- Monedas: 60, 45, 35, 25, 18 o 12 según los intentos. Si no la adivina, 5.
- Si adivina días seguidos, suma una racha que da hasta 20 monedas extra.
- No gasta energía y se puede compartir el resultado con cuadritos.
- Hay 420 palabras posibles (más de un año sin repetir). Las palabras válidas para intentar vienen de la lista libre an-array-of-spanish-words (licencia MIT).

## Colabs

En Premios hay una pestaña **Colabs** con colecciones "crossover" de marcas inventadas para Hoshito. Cada prenda se gana cumpliendo un reto:

| Colab | Prenda | Reto |
|---|---|---|
| Pixelandia | Gorro de 8 bits | 300 m en Hoshito corre |
| Pixelandia | Corona de 8 bits | 25 palillos en Hoshito vuela |
| Pixelandia | Aura de píxeles | Jugar 50 minijuegos |
| Liga Wasabi | Capa de héroe | Llegar al nivel 8 |
| Liga Wasabi | Casco del Capitán Wasabi | 40 rollos en Atrapa rollos |
| Liga Wasabi | Visor de héroe | 10 rondas en Hoshi dice |
| Neo Sakura | Chongos de Neo Sakura | Adivinar 10 Palabras del día |
| Neo Sakura | Orejas de kitsune | 12 órdenes en Arma el rollo |
| Neo Sakura | Ojos brillosos | Memorama en 12 movimientos o menos |
| Neo Sakura | Aura de energía | Saludar 15 veces a amigos |

## Cambiar los premios

Todo está en **`lib/hoshitoRewards.js`**: los premios de la ruleta y su probabilidad por rareza, el camino de visitas y los premios por nivel. Edítalo y vuelve a publicar.

## Archivos

| Archivo | Qué es |
|---|---|
| `lib/schema.js` | Tablas nuevas `hoshito_*` (mascota, giros, desbloqueos, marcas, trofeos, amigos y regalos) y la columna `customers.hoshito_access` (se crean solas al arrancar) |
| `lib/rules.js` | Al confirmar un sello, suma un giro si el cliente tiene acceso |
| `lib/hoshito.js` | Lógica del servidor: acceso, guardado, ruleta, camino, ranking y amigos |
| `lib/hoshitoRewards.js` | Premios (editable) |
| `app/api/hoshito/…` | API del juego: estado, ruleta, camino, marcas, ranking y amigos |
| `app/Hoshito/jugar/` | Página del juego. `engine.js` es el juego, `markup.js` su estructura y `jugar.css` sus estilos (todos dentro de `.hj`) |
| `app/(lealtad)/admin/clientes/[id]/` | Interruptor de acceso en la ficha del cliente |
| `app/(lealtad)/mi-tarjeta/page.js` | Aviso de Hoshito con los giros pendientes |

La página `/Hoshito` ahora usa fuentes guardadas en el proyecto (`app/Hoshito/jugar/fonts/`) en lugar de descargarlas de Google al compilar.

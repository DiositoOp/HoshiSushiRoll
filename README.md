# Hoshi Sushi Roll

Un solo sitio para todo Hoshi: la web informativa y el sistema de sellos, en el mismo dominio.

| Dirección | Qué es |
|---|---|
| `/` | Inicio de la web |
| `/menu` | Menú con precios |
| `/r/<punto>` | Destino de las etiquetas NFC y los QR (`/r/caja`, `/r/mesa-1`…) |
| `/mi-tarjeta` | Tarjeta de sellos del cliente |
| `/vincular` | Usar la tarjeta en un teléfono nuevo |
| `/privacidad` | Aviso de privacidad |
| `/staff/login` | Acceso del personal |
| `/caja` | Pantalla del cajero |
| `/admin` | Panel del dueño (Resumen, Clientes, Promoción) |
| `/dev` | Consola del desarrollador |
| `/Hoshito` | Página pública de la mascota |
| `/Hoshito/jugar` | Juego de Hoshito, solo para la comunidad con acceso (ver `HOSHITO.md`) |

Google solo indexa la web (`/` y `/menu`); las pantallas de la tarjeta y del personal quedan fuera de los buscadores.

## Cómo está organizado

La web y la tarjeta tienen diseños distintos (oscuro y claro), así que viven en dos grupos separados para que sus estilos no se mezclen:

```
app/(sitio)/      Web: inicio y menú, estilos en sitio.css
app/(lealtad)/    Tarjeta, caja, panel y consola, estilos en lealtad.css
app/global-not-found.js   Página de "no encontrado" para todo el dominio
data/site.js      Datos del negocio (dirección, horario, teléfono, aviso)
data/menu.js      Menú y precios
lib/              Base de datos, reglas de sellos y sesiones del personal
components/       Piezas de las dos partes
```

## Qué editar

- **Menú y precios:** `data/menu.js`
- **Horario, días, teléfono, aviso de promoción:** `data/site.js`. Pendiente: `openDays` asume que abren todos los días; corrígelo para que el aviso de "Abierto ahora" sea exacto.
- **Promoción de sellos (visitas y premio):** desde el panel, en `/admin/promocion`.
- **Aviso de privacidad:** `app/(lealtad)/privacidad/page.js` (tiene datos entre corchetes).

## Probarlo en tu computadora

Necesitas Node.js 20 o más reciente.

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Sin configurar nada usa una base local en la carpeta `.data/`. Usuario inicial: `dev` / `cambia-esta-clave`.

## Publicarlo

Este proyecto **reemplaza al del sistema de sellos**, para conservar su base de datos y que las etiquetas ya grabadas sigan funcionando.

1. Sube estos archivos al repositorio del sistema de sellos (`HoshiLoyal`), reemplazando lo que tiene.
2. Vercel lo publica solo. Las variables que ya tiene (`DATABASE_URL`, `SESSION_SECRET`, `BOOTSTRAP_USER`, `BOOTSTRAP_PASSWORD`) se quedan igual.
3. Agrega una variable nueva: `NEXT_PUBLIC_SITE_URL` = `https://hoshisushiroll.com`, y vuelve a publicar.
4. En ese mismo proyecto, en **Settings → Domains**, agrega `hoshisushiroll.com`.
5. En el proyecto viejo de la web (`Hoshiweb`), quita la dirección de Google Maps e Instagram si ya la habías puesto y bórralo cuando el dominio nuevo funcione.
6. Pon `https://hoshisushiroll.com` en tu ficha de Google Maps y en la bio de Instagram.

Las etiquetas NFC grabadas con la dirección vieja de Vercel siguen funcionando. Las nuevas, y los QR que imprimas, conviene sacarlos desde `/dev` cuando ya estés entrando por `hoshisushiroll.com`, para que lleven el dominio nuevo.

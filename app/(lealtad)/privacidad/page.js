export const metadata = { title: 'Aviso de privacidad · Hoshito' };

// TEXTO DE EJEMPLO: revísalo con un abogado y completa los datos entre corchetes antes de publicar.
export default function Privacidad() {
  return (
    <main className="screen white">
      <h1 className="display h1">Aviso de privacidad</h1>
      <p>
        [NOMBRE O RAZÓN SOCIAL DEL RESPONSABLE], con domicilio en [DOMICILIO], es responsable del uso y protección de tus datos personales.
      </p>
      <h2 className="display h2">Qué datos pedimos</h2>
      <p>Nombre y número de celular. De forma opcional, día y mes de nacimiento y dirección.</p>
      <h2 className="display h2">Para qué los usamos</h2>
      <p>
        Para llevar tu tarjeta de sellos, entregarte tus premios y, si nos diste tu fecha de nacimiento, felicitarte en tu cumpleaños.
        No vendemos ni compartimos tus datos con terceros.
      </p>
      <h2 className="display h2">Tus derechos</h2>
      <p>
        Puedes pedir que corrijamos o borremos tus datos en cualquier momento en el restaurante o escribiendo a [CORREO O TELÉFONO DE CONTACTO].
      </p>
      <p className="small muted">Última actualización: [FECHA].</p>
    </main>
  );
}

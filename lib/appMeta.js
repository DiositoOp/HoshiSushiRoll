// Datos para "Agregar a pantalla de inicio". Según desde dónde se guarde:
// la web abre el inicio, la tarjeta abre "Mi tarjeta" y el personal abre su pantalla según su rol.
export const SITE_APP = {
  manifest: '/sitio.webmanifest',
  appleWebApp: { capable: true, title: 'Hoshi', statusBarStyle: 'black-translucent' },
};

export const CUSTOMER_APP = {
  manifest: '/cliente.webmanifest',
  appleWebApp: { capable: true, title: 'Hoshito', statusBarStyle: 'default' },
};

export const STAFF_APP = {
  manifest: '/personal.webmanifest',
  appleWebApp: { capable: true, title: 'Hoshito Caja', statusBarStyle: 'default' },
};

import React from 'react';
import { App, View } from 'framework7-react';

import rutas from '../js/routes.js';
import store from '../js/store.js';

const parametrosFramework7 = {
  name: 'Vivero de Tortugas',
  theme: 'auto', 
  colors: {
    primary: '#0f766e', 
  },
  store: store,
  routes: rutas,
  serviceWorker:
    process.env.NODE_ENV === 'production' ? { path: '/service-worker.js' } : {},
};

const AplicacionVivero = () => (
  <App {...parametrosFramework7}>
    {/* Vista principal: el router carga aquí cada pantalla */}
    <View main className="safe-areas" url="/" />
  </App>
);

export default AplicacionVivero;
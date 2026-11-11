
import PaginaLogin from '../pages/login.jsx';
import PaginaInicio from '../pages/inicio.jsx';
import PaginaVoluntarios from '../pages/voluntarios.jsx';
import PaginaNuevoVoluntario from '../pages/nuevo-voluntario.jsx';
import PaginaDetalleVoluntario from '../pages/detalle-voluntario.jsx';
import PaginaNoEncontrada from '../pages/404.jsx';
import store from './store.js';

function requiereSesion({ resolve, reject, router }) {
  if (store.state.token) {
    resolve();
    return;
  }
  reject();
  router.navigate('/login/', { clearPreviousHistory: true });
}

const rutas = [
  {
    path: '/',
    redirect: ({ resolve }) => {
      resolve(store.state.token ? '/inicio/' : '/login/');
    },
  },
  {
    path: '/login/',
    component: PaginaLogin,
  },
  {
    path: '/inicio/',
    component: PaginaInicio,
    beforeEnter: requiereSesion,
  },
  {
    path: '/voluntarios/',
    component: PaginaVoluntarios,
    beforeEnter: requiereSesion,
  },
  {
    path: '/voluntarios/nuevo/',
    component: PaginaNuevoVoluntario,
    beforeEnter: requiereSesion,
  },
  {
    path: '/voluntarios/:id/',
    component: PaginaDetalleVoluntario,
    beforeEnter: requiereSesion,
  },
  {
    path: '(.*)',
    component: PaginaNoEncontrada,
  },
];

export default rutas;
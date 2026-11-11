import { createStore } from 'framework7/lite';
import * as api from './api.js';

const CLAVE_SESION_GUARDADA = 'vivero-tortugas-sesion';

function leerSesionGuardada() {
  try {
    const sesionEnTexto = localStorage.getItem(CLAVE_SESION_GUARDADA);
    return sesionEnTexto ? JSON.parse(sesionEnTexto) : null;
  } catch (errorDeLectura) {
    return null;
  }
}

const sesionGuardada = leerSesionGuardada();

const store = createStore({
  state: {
    token: sesionGuardada ? sesionGuardada.token : null,
    usuario: sesionGuardada ? sesionGuardada.usuario : '',
    roles: sesionGuardada ? sesionGuardada.roles : [],
  },

  getters: {
    token({ state }) {
      return state.token;
    },
    usuario({ state }) {
      return state.usuario;
    },
    roles({ state }) {
      return state.roles;
    },
    haySesion({ state }) {
      return Boolean(state.token);
    },
    esCoordinador({ state }) {
      return state.roles.includes(api.ROL_COORDINADOR);
    },
  },

  actions: {
    async iniciarSesion({ state }, { nombreUsuario, contrasena }) {
      const respuestaLogin = await api.iniciarSesion(nombreUsuario, contrasena);
      state.token = respuestaLogin.token;
      state.usuario = respuestaLogin.usuario;
      state.roles = respuestaLogin.roles;
      localStorage.setItem(CLAVE_SESION_GUARDADA, JSON.stringify(respuestaLogin));
      return respuestaLogin;
    },

    cerrarSesion({ state }) {
      state.token = null;
      state.usuario = '';
      state.roles = [];
      localStorage.removeItem(CLAVE_SESION_GUARDADA);
    },
  },
});

export default store;
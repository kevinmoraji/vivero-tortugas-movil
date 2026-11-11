// Conexión con la API Django del vivero.
//
// Todas las pantallas usan SOLO estas cuatro funciones:
//   iniciarSesion(nombreUsuario, contrasena)   -> { token, usuario, roles }
//   listarVoluntarios(token)                   -> [ voluntario, ... ]
//   obtenerVoluntario(token, idVoluntario)     -> voluntario
//   crearVoluntario(token, datosVoluntario)    -> voluntario creado
//
// Si algo falla, lanzan un ErrorDeApi con el código HTTP en "estado".
//
// USAR_DATOS_DE_PRUEBA = true  -> responde con datos locales (sin Django)
// USAR_DATOS_DE_PRUEBA = false -> usa fetch contra la API Django real

import { usuariosDePrueba, voluntariosDePrueba } from './datos-prueba.js';

export const URL_BASE_API = 'http://192.168.1.50:8000/api'; // IP de la computadora con Django
export const USAR_DATOS_DE_PRUEBA = true;

export const ROL_COORDINADOR = 'Coordinador';
export const ROL_CONSULTA = 'Consulta';

export class ErrorDeApi extends Error {
  constructor(mensaje, estado, erroresPorCampo = {}) {
    super(mensaje);
    this.name = 'ErrorDeApi';
    this.estado = estado; // código HTTP: 400, 401, 403, 404... o 0 si no hubo respuesta
    this.erroresPorCampo = erroresPorCampo; // { cedula: ['...'], email: ['...'] }
  }
}


const MENSAJES_POR_ESTADO = {
  400: 'Revise los datos del formulario.',
  401: 'Sesión vencida. Inicie sesión de nuevo.',
  403: 'Su rol no tiene permiso para esta acción.',
  404: 'No se encontró lo que buscaba.',
  500: 'Error en el servidor. Intente más tarde.',
};

async function solicitarALaApi(ruta, { metodo = 'GET', token = null, cuerpo = null } = {}) {
  const encabezados = { 'Content-Type': 'application/json' };
  if (token) {
    encabezados.Authorization = `Token ${token}`; // autenticación por token de DRF
  }

  let respuesta;
  try {
    respuesta = await fetch(`${URL_BASE_API}${ruta}`, {
      method: metodo,
      headers: encabezados,
      body: cuerpo ? JSON.stringify(cuerpo) : null,
    });
  } catch (errorDeRed) {
    throw new ErrorDeApi('No se pudo conectar con el servidor.', 0);
  }

  const textoDeRespuesta = await respuesta.text();
  let datosDeRespuesta = null;
  try {
    datosDeRespuesta = textoDeRespuesta ? JSON.parse(textoDeRespuesta) : null;
  } catch (errorDeFormato) {
    datosDeRespuesta = null;
  }

  if (!respuesta.ok) {
    const mensajeDeDjango = datosDeRespuesta && datosDeRespuesta.detail;
    const mensajeDeError =
      mensajeDeDjango || MENSAJES_POR_ESTADO[respuesta.status] || `Error ${respuesta.status}`;
    const erroresPorCampo = respuesta.status === 400 && datosDeRespuesta ? datosDeRespuesta : {};
    throw new ErrorDeApi(mensajeDeError, respuesta.status, erroresPorCampo);
  }

  return datosDeRespuesta;
}

export async function iniciarSesion(nombreUsuario, contrasena) {
  if (USAR_DATOS_DE_PRUEBA) return simularInicioDeSesion(nombreUsuario, contrasena);
  return solicitarALaApi('/auth/login/', {
    metodo: 'POST',
    cuerpo: { username: nombreUsuario, password: contrasena },
  });
}

export async function listarVoluntarios(token) {
  if (USAR_DATOS_DE_PRUEBA) return simularListaDeVoluntarios(token);
  const datosDeRespuesta = await solicitarALaApi('/voluntarios/', { token });
  // Con paginación DRF responde { count, next, previous, results }; sin paginación, un arreglo
  return Array.isArray(datosDeRespuesta) ? datosDeRespuesta : datosDeRespuesta.results;
}

export async function obtenerVoluntario(token, idVoluntario) {
  if (USAR_DATOS_DE_PRUEBA) return simularDetalleDeVoluntario(token, idVoluntario);
  return solicitarALaApi(`/voluntarios/${idVoluntario}/`, { token });
}

export async function crearVoluntario(token, datosVoluntario) {
  if (USAR_DATOS_DE_PRUEBA) return simularCreacionDeVoluntario(token, datosVoluntario);
  return solicitarALaApi('/voluntarios/', { metodo: 'POST', token, cuerpo: datosVoluntario });
}

function esperar(milisegundos) {
  return new Promise((resolver) => setTimeout(resolver, milisegundos));
}

function buscarUsuarioPorToken(token) {
  const usuarioEncontrado = usuariosDePrueba.find((usuarioDePrueba) => usuarioDePrueba.token === token);
  if (!usuarioEncontrado) {
    throw new ErrorDeApi(MENSAJES_POR_ESTADO[401], 401);
  }
  return usuarioEncontrado;
}

async function simularInicioDeSesion(nombreUsuario, contrasena) {
  await esperar(400);
  const usuarioEncontrado = usuariosDePrueba.find(
    (usuarioDePrueba) =>
      usuarioDePrueba.nombreUsuario === nombreUsuario && usuarioDePrueba.contrasena === contrasena,
  );
  if (!usuarioEncontrado) {
    throw new ErrorDeApi('Usuario o contraseña incorrectos.', 400);
  }
  return {
    token: usuarioEncontrado.token,
    usuario: usuarioEncontrado.nombreCompleto,
    roles: usuarioEncontrado.roles,
  };
}

async function simularListaDeVoluntarios(token) {
  await esperar(400);
  buscarUsuarioPorToken(token);
  return [...voluntariosDePrueba];
}

async function simularDetalleDeVoluntario(token, idVoluntario) {
  await esperar(300);
  buscarUsuarioPorToken(token);
  const voluntarioEncontrado = voluntariosDePrueba.find(
    (voluntario) => String(voluntario.id) === String(idVoluntario),
  );
  if (!voluntarioEncontrado) {
    throw new ErrorDeApi('No se encontró el voluntario.', 404);
  }
  return { ...voluntarioEncontrado };
}

async function simularCreacionDeVoluntario(token, datosVoluntario) {
  await esperar(400);
  const usuarioActual = buscarUsuarioPorToken(token);
  if (!usuarioActual.roles.includes(ROL_COORDINADOR)) {
    throw new ErrorDeApi('Su rol no tiene permiso para crear voluntarios.', 403);
  }
  const cedulaRepetida = voluntariosDePrueba.some(
    (voluntario) => voluntario.cedula === datosVoluntario.cedula,
  );
  if (cedulaRepetida) {
    throw new ErrorDeApi(MENSAJES_POR_ESTADO[400], 400, {
      cedula: ['Ya existe un voluntario con esta cédula.'],
    });
  }
  const voluntarioNuevo = {
    id: Math.max(0, ...voluntariosDePrueba.map((voluntario) => voluntario.id)) + 1,
    ...datosVoluntario,
  };
  voluntariosDePrueba.push(voluntarioNuevo);
  return { ...voluntarioNuevo };
}
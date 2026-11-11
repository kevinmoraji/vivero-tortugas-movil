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

// Simula la demora de la red para que se vea el indicador de carga
function esperar(milisegundos) {
  return new Promise((resolver) => setTimeout(resolver, milisegundos));
}

function buscarUsuarioPorToken(token) {
  const usuarioEncontrado = usuariosDePrueba.find((usuarioDePrueba) => usuarioDePrueba.token === token);
  if (!usuarioEncontrado) {
    throw new ErrorDeApi('Sesión vencida. Inicie sesión de nuevo.', 401);
  }
  return usuarioEncontrado;
}

export async function iniciarSesion(nombreUsuario, contrasena) {
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

export async function listarVoluntarios(token) {
  await esperar(400);
  buscarUsuarioPorToken(token);
  return [...voluntariosDePrueba];
}

export async function obtenerVoluntario(token, idVoluntario) {
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

export async function crearVoluntario(token, datosVoluntario) {
  await esperar(400);
  const usuarioActual = buscarUsuarioPorToken(token);
  if (!usuarioActual.roles.includes(ROL_COORDINADOR)) {
    throw new ErrorDeApi('Su rol no tiene permiso para crear voluntarios.', 403);
  }
  const cedulaRepetida = voluntariosDePrueba.some(
    (voluntario) => voluntario.cedula === datosVoluntario.cedula,
  );
  if (cedulaRepetida) {
    throw new ErrorDeApi('Revise los datos del formulario.', 400, {
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
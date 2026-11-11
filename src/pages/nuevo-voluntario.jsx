import React, { useState, useEffect } from 'react';
import {
  f7,
  Page,
  Navbar,
  BlockTitle,
  List,
  ListInput,
  Block,
  Button,
  useStore,
} from 'framework7-react';

import store from '../js/store.js';
import { crearVoluntario } from '../js/api.js';

function obtenerFechaDeHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

const FORMULARIO_VACIO = {
  cedula: '',
  nombre: '',
  apellidos: '',
  email: '',
  fecha_ingreso: obtenerFechaDeHoy(),
};

const PaginaNuevoVoluntario = ({ f7router }) => {
  const token = useStore('token');

  const [datosDelFormulario, setDatosDelFormulario] = useState(FORMULARIO_VACIO);
  const [erroresDelServidor, setErroresDelServidor] = useState({});
  const [estaGuardando, setEstaGuardando] = useState(false);

  const errorDelServidorEn = (nombreDelCampo) =>
    erroresDelServidor[nombreDelCampo] ? erroresDelServidor[nombreDelCampo][0] : '';

  useEffect(() => {
    Object.keys(erroresDelServidor).forEach((nombreDelCampo) => {
      const campoDelFormulario = document.querySelector(
        `#formulario-voluntario [name="${nombreDelCampo}"]`,
      );
      if (!campoDelFormulario) return;
      const mensajeDelServidor = errorDelServidorEn(nombreDelCampo);
      campoDelFormulario.setCustomValidity(mensajeDelServidor);
      if (mensajeDelServidor) f7.input.validate(campoDelFormulario);
    });
  }, [erroresDelServidor]);

  const cambiarCampo = (nombreDelCampo) => (evento) => {
    evento.target.setCustomValidity('');
    setDatosDelFormulario({ ...datosDelFormulario, [nombreDelCampo]: evento.target.value });
    if (erroresDelServidor[nombreDelCampo]) {
      setErroresDelServidor({ ...erroresDelServidor, [nombreDelCampo]: undefined });
    }
  };

  const manejarGuardado = async (evento) => {
    evento.preventDefault();

    const formularioEsValido = f7.input.validateInputs('#formulario-voluntario');
    if (!formularioEsValido) {
      f7.toast.show({ text: 'Revise los campos marcados en rojo', closeTimeout: 2000 });
      return;
    }

    setEstaGuardando(true);
    try {
      const datosLimpios = {
        ...datosDelFormulario,
        nombre: datosDelFormulario.nombre.trim(),
        apellidos: datosDelFormulario.apellidos.trim(),
        email: datosDelFormulario.email.trim(),
      };
      await crearVoluntario(token, datosLimpios);
      f7.toast.show({ text: 'Voluntario guardado', closeTimeout: 2000, position: 'center' });
      setDatosDelFormulario(FORMULARIO_VACIO);
      f7router.back(); // vuelve a la lista, que se recarga sola
    } catch (errorDeGuardado) {
      if (errorDeGuardado.estado === 400) {
        // Errores de validación de Django: se muestran debajo de cada campo
        setErroresDelServidor(errorDeGuardado.erroresPorCampo);
        // Errores que no son de un campo del formulario (por ejemplo non_field_errors)
        const camposDelFormulario = Object.keys(FORMULARIO_VACIO);
        const otrosErrores = Object.entries(errorDeGuardado.erroresPorCampo)
          .filter(([nombreDelCampo]) => !camposDelFormulario.includes(nombreDelCampo))
          .map(([, mensajes]) => [].concat(mensajes).join(' '));
        if (otrosErrores.length > 0) {
          f7.dialog.alert(otrosErrores.join('<br>'), 'No se pudo guardar');
        }
      } else if (errorDeGuardado.estado === 401) {
        store.dispatch('cerrarSesion');
        f7.dialog.alert(errorDeGuardado.message, 'Sesión vencida', () => {
          f7router.navigate('/login/', { clearPreviousHistory: true });
        });
      } else if (errorDeGuardado.estado === 403) {
        f7.dialog.alert(errorDeGuardado.message, 'Sin permiso');
      } else {
        f7.dialog.alert(errorDeGuardado.message, 'No se pudo guardar');
      }
    } finally {
      setEstaGuardando(false);
    }
  };

  return (
    <Page name="nuevo-voluntario">
      <Navbar title="Nuevo voluntario" backLink="Atrás" />

      <BlockTitle>Datos del voluntario</BlockTitle>
      <List form id="formulario-voluntario" strong inset dividers onSubmit={manejarGuardado}>
        <ListInput
          label="Cédula"
          type="text"
          inputmode="numeric"
          placeholder="9 dígitos, sin guiones"
          required
          validate
          validateOnBlur
          pattern="[0-9]{9}"
          errorMessage={errorDelServidorEn('cedula') || 'La cédula debe tener 9 dígitos'}
          value={datosDelFormulario.cedula}
          name="cedula"
          onInput={cambiarCampo('cedula')}
          clearButton
        />
        <ListInput
          label="Nombre"
          type="text"
          placeholder="Nombre"
          required
          validate
          validateOnBlur
          errorMessage={errorDelServidorEn('nombre') || 'Escriba el nombre'}
          value={datosDelFormulario.nombre}
          name="nombre"
          onInput={cambiarCampo('nombre')}
          clearButton
        />
        <ListInput
          label="Apellidos"
          type="text"
          placeholder="Apellidos"
          required
          validate
          validateOnBlur
          errorMessage={errorDelServidorEn('apellidos') || 'Escriba los apellidos'}
          value={datosDelFormulario.apellidos}
          name="apellidos"
          onInput={cambiarCampo('apellidos')}
          clearButton
        />
        <ListInput
          label="Correo electrónico"
          type="email"
          placeholder="correo@ejemplo.com"
          required
          validate
          validateOnBlur
          errorMessage={errorDelServidorEn('email') || 'Escriba un correo válido'}
          value={datosDelFormulario.email}
          name="email"
          onInput={cambiarCampo('email')}
          clearButton
        />
        <ListInput
          label="Fecha de ingreso"
          type="date"
          required
          validate
          errorMessage={errorDelServidorEn('fecha_ingreso') || 'Elija la fecha de ingreso'}
          value={datosDelFormulario.fecha_ingreso}
          name="fecha_ingreso"
          onInput={cambiarCampo('fecha_ingreso')}
        />
      </List>

      <Block>
        <Button fill large round preloader loading={estaGuardando} onClick={manejarGuardado}>
          Guardar
        </Button>
      </Block>
    </Page>
  );
};

export default PaginaNuevoVoluntario;
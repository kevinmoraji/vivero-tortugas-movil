import React, { useState } from 'react';
import {
  f7,
  Page,
  LoginScreenTitle,
  List,
  ListInput,
  Block,
  Button,
  BlockFooter,
} from 'framework7-react';

import store from '../js/store.js';
import { USAR_DATOS_DE_PRUEBA } from '../js/api.js';

const PaginaLogin = ({ f7router }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [estaCargando, setEstaCargando] = useState(false);

  const manejarIngreso = async (evento) => {
    evento.preventDefault();

    if (!nombreUsuario.trim() || !contrasena) {
      f7.dialog.alert('Escriba su usuario y su contraseña.', 'Faltan datos');
      return;
    }

    setEstaCargando(true);
    try {
      await store.dispatch('iniciarSesion', {
        nombreUsuario: nombreUsuario.trim(),
        contrasena: contrasena,
      });
      f7router.navigate('/inicio/', { clearPreviousHistory: true });
    } catch (errorDeLogin) {
      const mensajeDeError =
        errorDeLogin.estado === 0
          ? 'No se pudo conectar con el servidor. Revise que Django esté encendido.'
          : errorDeLogin.message;
      f7.dialog.alert(mensajeDeError, 'No se pudo iniciar sesión');
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <Page loginScreen noNavbar>
      <LoginScreenTitle>Vivero de Tortugas</LoginScreenTitle>
      <Block className="text-align-center texto-secundario">
        Ingrese con su usuario del sistema del vivero
      </Block>

      <List form strong inset dividers onSubmit={manejarIngreso}>
        <ListInput
          label="Usuario"
          type="text"
          name="usuario"
          placeholder="Su usuario"
          autocomplete="username"
          value={nombreUsuario}
          onInput={(evento) => setNombreUsuario(evento.target.value)}
        />
        <ListInput
          label="Contraseña"
          type="password"
          name="contrasena"
          placeholder="Su contraseña"
          autocomplete="current-password"
          value={contrasena}
          onInput={(evento) => setContrasena(evento.target.value)}
        />
      </List>

      <Block>
        <Button fill large round preloader loading={estaCargando} onClick={manejarIngreso}>
          Iniciar sesión
        </Button>
      </Block>

      {USAR_DATOS_DE_PRUEBA && (
        <BlockFooter>
          Modo de prueba: use <b>coordinador</b> o <b>consulta</b> con la contraseña <b>vivero123</b>.
        </BlockFooter>
      )}
    </Page>
  );
};

export default PaginaLogin;
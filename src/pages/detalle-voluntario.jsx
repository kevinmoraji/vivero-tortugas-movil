import React, { useState } from 'react';
import {
  f7,
  Page,
  Navbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  Preloader,
  Button,
  useStore,
} from 'framework7-react';

import store from '../js/store.js';
import { obtenerVoluntario } from '../js/api.js';

function formatearFecha(fechaEnTexto) {
  if (!fechaEnTexto) return 'Sin fecha';
  const fechaSinZonaHoraria = new Date(`${fechaEnTexto}T00:00:00Z`);
  return new Intl.DateTimeFormat('es-CR', { dateStyle: 'long', timeZone: 'UTC' }).format(
    fechaSinZonaHoraria,
  );
}

const PaginaDetalleVoluntario = ({ f7route, f7router }) => {
  const token = useStore('token');
  const idVoluntario = f7route.params.id;

  const [voluntario, setVoluntario] = useState(null);
  const [estaCargando, setEstaCargando] = useState(true);
  const [mensajeDeError, setMensajeDeError] = useState('');

  const cargarVoluntario = async () => {
    setEstaCargando(true);
    setMensajeDeError('');
    try {
      const voluntarioEncontrado = await obtenerVoluntario(token, idVoluntario);
      setVoluntario(voluntarioEncontrado);
    } catch (errorDeCarga) {
      if (errorDeCarga.estado === 401) {
        store.dispatch('cerrarSesion');
        f7.dialog.alert(errorDeCarga.message, 'Sesión vencida', () => {
          f7router.navigate('/login/', { clearPreviousHistory: true });
        });
        return;
      }
      setMensajeDeError(errorDeCarga.message);
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <Page name="detalle-voluntario" onPageInit={cargarVoluntario}>
      <Navbar title="Detalle del voluntario" backLink="Atrás" />

      {estaCargando && (
        <Block className="text-align-center">
          <Preloader />
        </Block>
      )}

      {!estaCargando && mensajeDeError && (
        <Block strong inset>
          <p>{mensajeDeError}</p>
          <Button fill round onClick={cargarVoluntario}>
            Reintentar
          </Button>
        </Block>
      )}

      {!estaCargando && voluntario && (
        <>
          <Block strong inset>
            <h2 className="nombre-voluntario">
              {voluntario.nombre} {voluntario.apellidos}
            </h2>
            <p className="texto-secundario">Voluntario n.º {voluntario.id}</p>
          </Block>

          <BlockTitle>Datos</BlockTitle>
          <List strong inset dividers>
            <ListItem title="Cédula" after={voluntario.cedula} />
            <ListItem title="Fecha de ingreso" after={formatearFecha(voluntario.fecha_ingreso)} />
            <ListItem
              title="Correo"
              after={voluntario.email}
              link={`mailto:${voluntario.email}`}
              external
            />
          </List>
        </>
      )}
    </Page>
  );
};

export default PaginaDetalleVoluntario;
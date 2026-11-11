import React, { useState } from 'react';
import {
  f7,
  Page,
  Navbar,
  NavRight,
  Link,
  Subnavbar,
  Searchbar,
  Block,
  List,
  ListItem,
  Preloader,
  Button,
  useStore,
} from 'framework7-react';

import store from '../js/store.js';
import { listarVoluntarios } from '../js/api.js';

function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const PaginaVoluntarios = ({ f7router }) => {
  const token = useStore('token');

  const [voluntarios, setVoluntarios] = useState([]);
  const [textoDeBusqueda, setTextoDeBusqueda] = useState('');
  const [estaCargando, setEstaCargando] = useState(true);
  const [mensajeDeError, setMensajeDeError] = useState('');

  const cargarVoluntarios = async () => {
    setMensajeDeError('');
    try {
      const listaDeVoluntarios = await listarVoluntarios(token);
      setVoluntarios(listaDeVoluntarios);
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

  const recargarAlDeslizar = async (terminarRecarga) => {
    await cargarVoluntarios();
    terminarRecarga();
  };

  const voluntariosFiltrados = voluntarios.filter((voluntario) => {
    const textoDelVoluntario = normalizarTexto(
      `${voluntario.nombre} ${voluntario.apellidos} ${voluntario.cedula}`,
    );
    return textoDelVoluntario.includes(normalizarTexto(textoDeBusqueda.trim()));
  });

  return (
    <Page name="voluntarios" ptr onPtrRefresh={recargarAlDeslizar} onPageBeforeIn={cargarVoluntarios}>
      <Navbar title="Voluntarios" backLink="Atrás">
        <NavRight>
          <Link href="/voluntarios/nuevo/" iconIos="f7:plus" iconMd="material:add" />
        </NavRight>
        <Subnavbar inner={false}>
          <Searchbar
            customSearch
            placeholder="Buscar por nombre, apellido o cédula"
            disableButtonText="Cancelar"
            onSearchbarSearch={(barraDeBusqueda, consulta) => setTextoDeBusqueda(consulta)}
            onSearchbarClear={() => setTextoDeBusqueda('')}
          />
        </Subnavbar>
      </Navbar>

      {estaCargando && (
        <Block className="text-align-center">
          <Preloader />
        </Block>
      )}

      {!estaCargando && mensajeDeError && (
        <Block strong inset>
          <p>{mensajeDeError}</p>
          <Button fill round onClick={cargarVoluntarios}>
            Reintentar
          </Button>
        </Block>
      )}

      {!estaCargando && !mensajeDeError && voluntariosFiltrados.length === 0 && (
        <Block strong inset className="text-align-center texto-secundario">
          No hay voluntarios que coincidan con la búsqueda.
        </Block>
      )}

      {!estaCargando && !mensajeDeError && voluntariosFiltrados.length > 0 && (
        <List strong inset dividers mediaList>
          {voluntariosFiltrados.map((voluntario) => (
            <ListItem
              key={voluntario.id}
              link={`/voluntarios/${voluntario.id}/`}
              title={`${voluntario.nombre} ${voluntario.apellidos}`}
              subtitle={`Cédula ${voluntario.cedula}`}
            />
          ))}
        </List>
      )}
    </Page>
  );
};

export default PaginaVoluntarios;
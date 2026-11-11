import React from 'react';
import {
  f7,
  Page,
  Navbar,
  BlockTitle,
  Block,
  List,
  ListItem,
  Button,
  Icon,
  useStore,
} from 'framework7-react';

import store from '../js/store.js';

const PaginaInicio = ({ f7router }) => {
  const usuario = useStore('usuario');
  const roles = useStore('roles');
  const esCoordinador = useStore('esCoordinador');

  const manejarCierreDeSesion = () => {
    f7.dialog.confirm('¿Desea cerrar la sesión?', 'Cerrar sesión', () => {
      store.dispatch('cerrarSesion');
      f7router.navigate('/login/', { clearPreviousHistory: true });
    });
  };

  return (
    <Page name="inicio">
      <Navbar title="Vivero de Tortugas" large />

      <Block strong inset>
        <p>
          Hola, <b>{usuario}</b>
        </p>
        <p className="texto-secundario">Rol: {roles.join(', ')}</p>
      </Block>

      <BlockTitle>Voluntarios</BlockTitle>
      <List strong inset dividers>
        <ListItem link="/voluntarios/" title="Ver voluntarios" footer="Lista con búsqueda">
          <Icon slot="media" ios="f7:person_3_fill" md="material:groups" />
        </ListItem>
        {/* Se muestra a todos a propósito: si entra el rol Consulta,
            la API responde 403 y eso se enseña en la demo */}
        <ListItem
          link="/voluntarios/nuevo/"
          title="Registrar voluntario"
          footer={esCoordinador ? 'Agregar un voluntario nuevo' : 'Su rol solo permite consultar'}
        >
          <Icon slot="media" ios="f7:person_badge_plus_fill" md="material:person_add" />
        </ListItem>
      </List>

      <Block>
        <Button outline round color="red" onClick={manejarCierreDeSesion}>
          Cerrar sesión
        </Button>
      </Block>
    </Page>
  );
};

export default PaginaInicio;
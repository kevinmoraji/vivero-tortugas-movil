import React from 'react';
import { Page, Navbar, Block } from 'framework7-react';

const PaginaDetalleVoluntario = ({ f7route }) => (
  <Page name="detalle-voluntario">
    <Navbar title="Detalle del voluntario" backLink="Atrás" />
    <Block strong inset>
      <p>Voluntario con id {f7route.params.id}.</p>
      <p className="texto-secundario"></p>
    </Block>
  </Page>
);

export default PaginaDetalleVoluntario;
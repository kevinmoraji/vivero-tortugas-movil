import React from 'react';
import { Page, Navbar, Block } from 'framework7-react';

const PaginaVoluntarios = () => (
  <Page name="voluntarios">
    <Navbar title="Voluntarios" backLink="Atrás" />
    <Block strong inset>
      <p></p>
      <p className="texto-secundario"></p>
    </Block>
  </Page>
);

export default PaginaVoluntarios;
import React from 'react';
import { Page, Navbar, Block } from 'framework7-react';


const PaginaNuevoVoluntario = () => (
  <Page name="nuevo-voluntario">
    <Navbar title="Nuevo voluntario" backLink="Atrás" />
    <Block strong inset>
      <p></p>
      <p className="texto-secundario"></p>
    </Block>
  </Page>
);

export default PaginaNuevoVoluntario;
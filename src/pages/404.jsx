import React from 'react';
import { Page, Navbar, Block, Button } from 'framework7-react';

const PaginaNoEncontrada = () => (
  <Page name="no-encontrada">
    <Navbar title="Página no encontrada" backLink="Atrás" />
    <Block strong inset>
      <p>La pantalla que busca no existe.</p>
    </Block>
    <Block>
      <Button fill round href="/inicio/">
        Ir al inicio
      </Button>
    </Block>
  </Page>
);

export default PaginaNoEncontrada;
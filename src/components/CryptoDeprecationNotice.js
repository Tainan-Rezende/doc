import React from 'react';
import Admonition from '@theme/Admonition';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';

export default function CryptoDeprecationNotice() {
  return (
    <Admonition
      type="danger"
      title={
        <Translate id="cryptoDeprecation.title">
          Descontinuado em 29/10/2026
        </Translate>
      }
    >
      <p>
        <Translate id="cryptoDeprecation.body">
          Este fluxo de cripto deixa de existir no corte de 29/10/2026 (30/10 às 03:00 UTC). A partir dessa data, a XGate não guarda mais cripto de empresas e as rotas deste fluxo passam a responder 410 FEATURE_DISCONTINUED.
        </Translate>
      </p>
      <p>
        <Translate id="cryptoDeprecation.replacement">
          Para obter USDT ou USDC, use a nova API de
        </Translate>{' '}
        <Link to="/docs/buy-sell/overview">
          <Translate id="cryptoDeprecation.link">Compra e Venda de Cripto</Translate>
        </Link>
        .
      </p>
    </Admonition>
  );
}

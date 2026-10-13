---
sidebar_label: 'Visión General'
sidebar_position: 1
description: 'Compre USDT y USDC con el saldo en reales de su empresa en XGate y reciba la cripto en la billetera que usted indique.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Compra y Venta de Cripto

La empresa tiene saldo en reales (BRL) en XGate. Con la API, **compra** USDT o USDC usando ese saldo, y XGate envía la cripto a la billetera que la empresa indique (declarada como propia).

Para **vender**, la empresa envía USDT/USDC a una dirección fija que XGate le proporciona (una por red); cada envío confirmado se convierte en una venta y el valor en reales se acredita en el saldo o se envía por Pix a un beneficiario aprobado, según la configuración de la empresa en el panel.

:::info[Sin custodia de cripto]
No existe saldo cripto en XGate: lo que la empresa compra va directamente a su billetera. El cliente (customer) de la empresa no aparece en ningún extremo de la compra ni de la venta.
:::

:::note[Venta próximamente]
La venta de cripto por la API estará disponible en noviembre de 2026. Hasta entonces, esta sección documenta la compra.
:::

---

## Activos y redes

| Activo | Redes                                         |
| :----- | :-------------------------------------------- |
| `USDT` | `POLYGON`, `ETHEREUM`, `TRON`, `SOLANA`       |
| `USDC` | `POLYGON`, `ETHEREUM`, `SOLANA`               |

No existe USDC en `TRON`, y la red BSC no es compatible. Los pares habilitados para su empresa se obtienen en <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a>.

---

## Habilitación

XGate habilita el producto por empresa, en el backoffice. La compra y la venta se habilitan por separado. Si alguna etapa no está activada, la API responde:

| Habilitación               | Error cuando está desactivada |
| :------------------------- | :---------------------------- |
| Cripto activada            | `403 CRYPTO_DISABLED`         |
| Cripto por la API activada | `403 CRYPTO_API_DISABLED`     |
| Compra activada            | `403 BUY_DISABLED`            |

Además, la empresa debe tener la lista de **IPs permitidas** registrada en el panel. Consulte las <a href={useBaseUrl('/docs/buy-sell/conventions')}>Convenciones</a>.

---

## Flujo de compra

1. **Consulte las opciones:** <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a> muestra activos, redes, tarifas, límites y direcciones guardadas.
2. **Cotice (opcional):** <a href={useBaseUrl('/docs/buy-sell/quotes')}>POST /crypto/quotes</a> garantiza el precio durante 30 segundos. Para mostrar solo un valor aproximado, use `POST /crypto/quotes/estimate`.
3. **Compre:** <a href={useBaseUrl('/docs/buy-sell/purchases/create')}>POST /crypto/purchases</a> con la cotización o a precio de mercado. El BRL se debita del saldo.
4. **Haga seguimiento:** <a href={useBaseUrl('/docs/buy-sell/purchases/list')}>GET /crypto/purchases/&#123;id&#125;</a> o los <a href={useBaseUrl('/docs/buy-sell/webhooks')}>webhooks de compra</a>, hasta `DELIVERED` (cripto confirmada en la red) o `REJECTED` (BRL devuelto al saldo).
5. **Comprobante:** <a href={useBaseUrl('/docs/buy-sell/purchases/receipt')}>GET /crypto/purchases/&#123;id&#125;/receipt</a>.

---

## Sustitución de los flujos heredados

Los flujos antiguos de cripto (billetera del cliente, depósito con conversión, retiro cripto y retiro con conversión) se **descontinúan el 29/10/2026**. La siguiente tabla muestra qué usar en su lugar:

| Antes                                                | Ahora                                                                         |
| :--------------------------------------------------- | :---------------------------------------------------------------------------- |
| Depósito Pix con `cryptocurrency` (conversión)       | Depósito Pix en BRL + `POST /crypto/purchases` con el saldo                   |
| Retiro cripto a billetera externa                    | `POST /crypto/purchases`: la cripto va a una billetera **de la empresa**      |
| Retiro USDT/USDC → Pix                               | Sin sustituto: la empresa ya no tiene saldo cripto en XGate                   |
| Billetera de custodia del cliente                    | Sin sustituto: XGate no guarda cripto                                         |

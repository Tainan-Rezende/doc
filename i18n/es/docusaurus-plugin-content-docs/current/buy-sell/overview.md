---
sidebar_label: 'Descripción general'
sidebar_position: 1
description: 'Compre USDT y USDC con el saldo en BRL de su empresa en XGate y reciba las criptomonedas en la billetera que indique.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Compra y venta de cripto

La compra y la venta de cripto están activas y disponibles. La empresa tiene un saldo en BRL en XGate y puede **comprar** USDT o USDC con ese saldo. XGate envía las criptomonedas compradas directamente a una billetera indicada por la empresa y declarada como propia.

Para **vender**, la empresa envía USDT/USDC a una dirección fija proporcionada por XGate (una por red). Cada transferencia confirmada en la red se convierte en una venta, y el importe en BRL se acredita en el saldo BRL o se envía mediante Pix a un beneficiario aprobado, según la configuración de la empresa en el Dashboard.

:::info[Sin custodia de cripto]
XGate no custodia criptomonedas para las empresas: las criptomonedas compradas se envían directamente a la billetera de la empresa y las ventas se liquidan en el saldo BRL o mediante Pix. Los clientes de la empresa no intervienen en ninguna de las dos operaciones.
:::

---

## Activos y redes

| Activo | Redes |
| :----- | :-------------------------------------------- |
| `USDT` | `POLYGON`, `ETHEREUM`, `TRON`, `SOLANA`       |
| `USDC` | `POLYGON`, `ETHEREUM`, `SOLANA`               |

---

## Flujo de compra

1. **Consulte las opciones:** <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a> muestra los activos, las redes, las tarifas, los límites y las direcciones guardadas.
2. **Solicite una cotización (opcional):** <a href={useBaseUrl('/docs/buy-sell/quotes')}>POST /crypto/quotes</a> garantiza el precio durante 30 segundos. Para mostrar solo un valor estimado, utilice `POST /crypto/quotes/estimate`.
3. **Realice la compra:** llame a <a href={useBaseUrl('/docs/buy-sell/purchases/create')}>POST /crypto/purchases</a> con una cotización o a precio de mercado. El importe en BRL se debita del saldo.
4. **Haga el seguimiento:** utilice <a href={useBaseUrl('/docs/webhooks/purchase/status')}>Consultar compra</a> o los <a href={useBaseUrl('/docs/webhooks/purchase/receive')}>webhooks de compra</a> (pestaña Webhooks › Webhook de compra de cripto) hasta que el estado sea `DELIVERED` (cripto confirmada en la red) o `REJECTED` (BRL devuelto al saldo).

---

## Flujo de venta

1. **Obtenga las direcciones:** el objeto `sale` de <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a> contiene la dirección fija de la empresa para cada activo y red.
2. **Envíe las criptomonedas:** cada transferencia a esa dirección que se confirma en la red se convierte en una venta. Consulte <a href={useBaseUrl('/docs/buy-sell/sales/sell')}>Vender cripto</a>.
3. **Haga el seguimiento:** utilice <a href={useBaseUrl('/docs/webhooks/sale/status')}>Consultar venta</a> o los <a href={useBaseUrl('/docs/webhooks/sale/receive')}>webhooks de venta</a> (pestaña Webhooks › Webhook de venta de cripto) hasta que el estado sea `SETTLED` o `SETTLED_TO_BALANCE`.

---

## Rutas antiguas de cripto

Las rutas antiguas de cripto (billetera del cliente, depósitos con conversión, retiros de cripto y retiros con conversión) responden `410 FEATURE_DISCONTINUED` a partir del 29/10/2026. La siguiente tabla muestra las alternativas disponibles:

| Anterior | Alternativa actual |
| :--------------------------------------------------- | :----------------------------------------------------------------------- |
| Depósito Pix con `cryptocurrency` (conversión) | Depósito Pix en BRL + `POST /crypto/purchases` con el saldo |
| Retiro de cripto a una billetera externa | `POST /crypto/purchases`: las criptomonedas se envían a una billetera **de la empresa** |
| Retiro de USDT/USDC → Pix | No hay alternativa: XGate no mantiene saldos de cripto de las empresas |
| Billetera de custodia del cliente | No hay alternativa: XGate no custodia criptomonedas |

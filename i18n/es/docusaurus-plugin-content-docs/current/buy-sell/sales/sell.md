---
draft: true
sidebar_label: 'Vender cripto'
sidebar_position: 1
description: 'Envíe USDT o USDC a la dirección fija de la empresa en XGate y reciba el monto en BRL en el saldo o por Pix.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Vender cripto

Para vender, la empresa envía USDT o USDC a una **dirección fija** que XGate le asigna. Cada envío confirmado en la red se convierte en una venta, y el monto en reales se acredita en el saldo BRL o se envía por Pix a un beneficiario aprobado, según la configuración de la empresa.

---

## Direcciones de venta

XGate asigna a la empresa **una dirección fija por activo × red**, listada en <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a>, en el bloque `sale`:

```json
{
  "sale": {
    "enabled": true,
    "status": "READY",
    "minAmount": { "USDT": "10.000000", "USDC": "10.000000" },
    "depositAddresses": [
      { "asset": "USDT", "network": "TRON", "address": "TXg8u3…" },
      { "asset": "USDC", "network": "SOLANA", "address": "7mQe1…" }
    ]
  }
}
```

| Campo                | Descripción                                                                                                                  |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| `enabled`            | Venta habilitada para la empresa.                                                                                            |
| `status`             | `DISABLED`, `PROVISIONING` o `READY`. Las direcciones se crean en la primera consulta de una empresa con venta habilitada: el estado pasa por `PROVISIONING` hasta `READY`. |
| `minAmount`          | Venta mínima por activo.                                                                                                     |
| `depositAddresses[]` | Dirección fija de cada par `asset` × `network`.                                                                              |

---

## Cómo funciona

- **No existe orden de venta ni `POST /crypto/sales`.** Todo envío confirmado en la red a una dirección fija se convierte en una venta a mercado, sin precio mínimo y sin devolución on-chain. Diez envíos son diez ventas.
- El precio se congela en la liquidación. La tarifa (XGate + referido) se cobra en cripto sobre la cantidad recibida, y el BRL acreditado es `netCryptoAmount × rate`.
- Concilie por el `txHash` de su envío. El `sourceAddress` ayuda cuando la red lo informa.

:::danger[Atención al enviar]
Envíe solo el activo y la red de la dirección. **Enviar otro token o usar otra red resulta en pérdida.** Los envíos por debajo de `sale.minAmount` quedan en análisis.
:::

---

## Forma de recepción

La forma de recibir el BRL de la venta (**saldo BRL** o **Pix a un beneficiario aprobado**) se configura **únicamente en el panel de XGate**, una vez por empresa, con el autenticador. La API no modifica esta elección: muestra el resultado en el campo `settlement` de cada venta.

El Pix como forma de recepción depende de que XGate habilite el recurso para su empresa. Sin ello, toda venta se acredita en el saldo (`settlement.type = BALANCE`). Si el beneficiario deja de estar aprobado o el Pix falla, la venta se acredita en el saldo BRL: nunca queda bloqueada.

---

## Estado de la venta

```text
RECEIVED ──► SETTLING ──► SETTLED
                     └──► SETTLED_TO_BALANCE
```

| Estado               | Significado                                                                                                   |
| :------------------- | :------------------------------------------------------------------------------------------------------------ |
| `RECEIVED`           | Cripto recibida y confirmada, a la espera de precio. Incluye la venta suspendida en análisis (con `review.reason`). |
| `SETTLING`           | En liquidación.                                                                                               |
| `SETTLED`            | Liquidada por la forma configurada.                                                                           |
| `SETTLED_TO_BALANCE` | La forma era Pix, pero el monto se acreditó en el saldo. `settlement.fallbackReason` explica el motivo.       |

---

## Objeto de la venta {#sale-object}

El mismo objeto se devuelve en la consulta y se envía en el campo `data` de los webhooks `sale.*`.

| Campo                     | Tipo               | Descripción                                                                                                     |
| :------------------------ | :----------------- | :-------------------------------------------------------------------------------------------------------------- |
| `id`                      | `string`           | ID de la venta.                                                                                                 |
| `status`                  | `string`           | `RECEIVED` · `SETTLING` · `SETTLED` · `SETTLED_TO_BALANCE`.                                                     |
| `asset`, `network`        | `string`           | Activo y red.                                                                                                   |
| `depositAddress`          | `string`           | Dirección fija de la empresa que recibió.                                                                       |
| `sourceAddress`           | `string` \| `null` | Desde dónde salió la cripto (cuando la red lo informa).                                                         |
| `txHash`                  | `string` \| `null` | Hash on-chain. Clave de conciliación.                                                                           |
| `cryptoAmount`            | `string`           | Cantidad recibida (6 decimales).                                                                                |
| `rate`                    | `string` \| `null` | Precio en BRL congelado en la liquidación (8 decimales).                                                        |
| `feeAmount`, `feeAsset`   | `string` \| `null` | Tarifa en cripto sobre `cryptoAmount`.                                                                          |
| `netCryptoAmount`         | `string` \| `null` | `cryptoAmount − feeAmount`.                                                                                     |
| `grossAmount`, `netAmount`| `string` \| `null` | Monto en BRL acreditado (`netCryptoAmount × rate`, redondeado hacia abajo).                                     |
| `settlement`              | `object`           | `type` (`BALANCE` \| `PIX_KEY`), `beneficiaryId`, `withdrawId` (retiro Pix creado), `fallbackReason` (`PIX_SETTLEMENT_UNAVAILABLE` · `BENEFICIARY_NOT_ELIGIBLE` · `PAYOUT_REJECTED` · `PAYOUT_FAILED` · `PAYOUT_UNAVAILABLE` · `null`). |
| `review`                  | `object` \| `null` | `reason`: `BELOW_MINIMUM` · `COMPANY_UNAVAILABLE` · `COMPANY_BLOCKED` · `SELL_POLICY_MISSING` · `NET_NOT_POSITIVE` · `CONFIRMATIONS_TIMEOUT` · `CREDIT_REVIEW`. |
| `receivedAt`, `settledAt`, `createdAt`, `updatedAt` | `string` | Fechas ISO 8601. `updatedAt` + `status` ordenan los webhooks recibidos fuera de orden. |

---

## Webhooks de venta

Seleccione en el panel el tipo **Ventas de Cripto** (`CRYPTO_SALE`). El sobre es el mismo de los <a href={useBaseUrl('/docs/buy-sell/webhooks')}>webhooks de compra</a> (`id`, `type`, `createdAt`, `data`), con `data` = objeto de la venta.

| Evento (`type`)  | Estado en el panel                  | Cuándo                                                                                     |
| :--------------- | :---------------------------------- | :----------------------------------------------------------------------------------------- |
| `sale.received`  | `RECEIVED`                          | Cripto recibida y confirmada en la dirección fija.                                         |
| `sale.settled`   | `SETTLED` o `SETTLED_TO_BALANCE`    | BRL acreditado. `data.status` indica cuál de los dos y `data.settlement` muestra cómo.     |

---

## Lo que no existe en la API

| Intento                                             | Respuesta                  |
| :-------------------------------------------------- | :------------------------- |
| `POST /crypto/sales`                                | `404 ROUTE_NOT_FOUND`      |
| Modificar la forma de recepción con token de API    | `403 DASHBOARD_ONLY`       |
| Registrar un beneficiario con token de API          | `403 PERMISSION_DENIED`    |

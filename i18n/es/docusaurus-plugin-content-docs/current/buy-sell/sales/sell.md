---
sidebar_label: 'Vender cripto'
sidebar_position: 6
description: 'Envía USDT o USDC a la dirección fija de la empresa en XGate y recibe el importe en BRL en el saldo o mediante Pix.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Vender cripto

La compra y la venta de cripto están activas y disponibles. Para vender, la empresa envía USDT o USDC a una **dirección fija** proporcionada por XGate. Cada transferencia confirmada en la red se convierte en una venta, y el importe en BRL se acredita en el saldo BRL o se envía mediante Pix a un beneficiario aprobado, según la configuración de la empresa en el Dashboard. XGate no mantiene cripto en custodia para la empresa; las ventas se liquidan en el saldo BRL o mediante Pix.

Las rutas antiguas de cripto responden `410 FEATURE_DISCONTINUED` a partir del 29/10/2026.

---

## Cómo funciona

- **No existe una orden de venta ni una solicitud `POST`.** XGate proporciona a la empresa **una dirección fija por activo y red**. La empresa envía USDT o USDC desde cualquier billetera a esa dirección y **cada transferencia confirmada en la red se convierte en una venta**, a precio de mercado, sin precio mínimo ni reembolso on-chain. Diez transferencias son diez ventas.
- El precio se fija en la liquidación. La tarifa (XGate + comisión por referido) se cobra en cripto sobre la cantidad recibida, y el BRL acreditado se calcula como `netCryptoAmount × rate`.
- Concilie la operación mediante el `txHash` de su transferencia. `sourceAddress` puede ser útil cuando la red lo proporciona.

:::danger[Importante al enviar]
Envíe únicamente el activo a través de la red indicada para la dirección. **Enviar otro token o el token correcto a través de una red equivocada ocasionará una pérdida sin reembolso.** USDC no está disponible en `TRON`.
:::

---

## Direcciones de venta

Las direcciones se devuelven en el objeto `sale` de <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a>:

```json
{
  "sale": {
    "enabled": true,
    "status": "READY",
    "minAmount": { "USDT": "10.000000", "USDC": "10.000000" },
    "depositAddresses": [
      { "asset": "USDT", "network": "TRON", "address": "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf" },
      { "asset": "USDC", "network": "SOLANA", "address": "7mQe1…" }
    ]
  }
}
```

| Campo | Tipo | Descripción |
| :------------------- | :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled` | `boolean` | Indica si las ventas están habilitadas para la empresa. |
| `status` | `string` | `DISABLED` · `PROVISIONING` · `READY`. La primera consulta de una empresa con las ventas habilitadas inicia la creación de las direcciones: el estado permanece en `PROVISIONING` durante unos minutos y luego pasa a `READY`. |
| `minAmount` | `object` | Importe mínimo de venta por activo (`USDT`, `USDC`). Las transferencias inferiores al mínimo quedan pendientes de revisión (`review.reason = BELOW_MINIMUM`). |
| `depositAddresses[]` | `array` | Dirección fija de cada par: `asset`, `network`, `address`. |

---

## Destino del BRL

El método para recibir el importe de la venta en BRL se configura **una sola vez en el Dashboard de XGate** (Compra/Venta › Configuración):

- **Saldo en BRL** de la empresa; o
- **Pix a un beneficiario aprobado**.

La API no modifica esta selección: muestra el resultado en el campo `settlement` de cada venta. Si no es posible realizar el pago por Pix (el beneficiario no está aprobado o el retiro se rechaza o falla), el importe se acredita en el saldo BRL y la venta finaliza como `SETTLED_TO_BALANCE`; el motivo se indica en `settlement.fallbackReason`. La venta nunca queda pendiente.

---

## Estado de la venta

```text
RECEIVED ──► SETTLING ──► SETTLED
                     └──► SETTLED_TO_BALANCE
```

| Estado               | Significado                                                                                                  |
| :------------------- | :----------------------------------------------------------------------------------------------------------- |
| `RECEIVED`           | Cripto recibida y confirmada, a la espera del precio. Las ventas retenidas para revisión de XGate aparecen aquí, con `review.reason`. |
| `SETTLING`           | Precio fijado; crédito en curso.                                                                       |
| `SETTLED`            | Liquidada mediante el método configurado. **Final.**                                                                 |
| `SETTLED_TO_BALANCE` | El método configurado era Pix, pero el importe se acreditó en el saldo. `settlement.fallbackReason` explica el motivo. **Final.**         |

---

## Seguimiento

Haga el seguimiento de cada venta mediante <a href={useBaseUrl('/docs/webhooks/sale/status')}>Consultar venta</a> o los <a href={useBaseUrl('/docs/webhooks/sale/receive')}>webhooks de venta</a> (`sale.*`), en la pestaña Webhooks › Webhook de venta de cripto. Las descripciones de los campos están disponibles en <a href={useBaseUrl('/docs/webhooks/sale/status#sale-object')}>Objeto de venta</a>.

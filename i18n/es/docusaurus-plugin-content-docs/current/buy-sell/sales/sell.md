---
sidebar_label: 'Vender Cripto'
sidebar_position: 6
description: 'Envíe USDT o USDC a la dirección fija de la empresa en XGate y reciba el monto en BRL en el saldo o por Pix.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Vender Cripto

Para vender, la empresa envía USDT o USDC a una **dirección fija** que XGate le asigna. Cada envío confirmado en la red se convierte en una venta, y el monto en reales se acredita en el saldo BRL o se envía por Pix a un beneficiario aprobado, según la configuración de la empresa en el panel.

:::note[Disponible en noviembre de 2026]
La venta de cripto por la API estará disponible en noviembre de 2026. Hasta entonces, `sale.enabled` llega como `false` y `sale.depositAddresses` llega vacío en `GET /crypto/options`.
:::

---

## Cómo funciona

- **No existe orden de venta ni `POST`.** XGate asigna a la empresa **una dirección fija por activo y red**. La empresa envía USDT o USDC desde cualquier billetera a esa dirección, y **cada envío confirmado en la red se convierte en una venta**, a mercado, sin precio mínimo y sin devolución on-chain. Diez envíos son diez ventas.
- El precio se fija en la liquidación. La tarifa (XGate + referido) se cobra en cripto sobre la cantidad recibida, y el BRL acreditado es `netCryptoAmount × rate`.
- Concilie por el `txHash` de su envío. El `sourceAddress` ayuda cuando la red lo informa.

:::danger[Atención al enviar]
Envíe solo el activo y la red de la dirección. **Enviar otro token, o el token correcto por la red equivocada, resulta en pérdida, sin devolución.** No existe USDC en `TRON`.
:::

---

## Direcciones de venta

Las direcciones vienen en <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a>, en el bloque `sale`:

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

| Campo                | Tipo      | Descripción                                                                                                                                                 |
| :------------------- | :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`            | `boolean` | Venta habilitada para la empresa.                                                                                                                           |
| `status`             | `string`  | `DISABLED` · `PROVISIONING` · `READY`. La primera consulta de una empresa con venta habilitada dispara la creación de las direcciones: el estado queda en `PROVISIONING` durante algunos minutos y pasa a `READY`. |
| `minAmount`          | `object`  | Venta mínima por activo (`USDT`, `USDC`). Los envíos por debajo del mínimo quedan en análisis (`review.reason = BELOW_MINIMUM`).                             |
| `depositAddresses[]` | `array`   | Dirección fija de cada par: `asset`, `network`, `address`.                                                                                                  |

---

## Adónde va el BRL

La forma de recibir el BRL de la venta se configura **una vez, en el panel de XGate** (Compra/Venta › Configuración):

- **Saldo en BRL** de la empresa; o
- **Pix a un beneficiario aprobado**.

La API no modifica esta elección: muestra el resultado en el campo `settlement` de cada venta. Si el Pix no puede realizarse (beneficiario no aprobado, retiro rechazado o fallido), el monto se acredita en el saldo BRL y la venta termina en `SETTLED_TO_BALANCE`, con el motivo en `settlement.fallbackReason`. La venta nunca queda bloqueada.

---

## Estado de la venta

```text
RECEIVED ──► SETTLING ──► SETTLED
                     └──► SETTLED_TO_BALANCE
```

| Estado               | Significado                                                                                                  |
| :------------------- | :----------------------------------------------------------------------------------------------------------- |
| `RECEIVED`           | Cripto recibida y confirmada, a la espera de precio. Una venta suspendida en análisis de XGate aparece aquí, con `review.reason`. |
| `SETTLING`           | Precio congelado, acreditación en curso.                                                                     |
| `SETTLED`            | Liquidada por la forma configurada. **Final.**                                                               |
| `SETTLED_TO_BALANCE` | La forma era Pix, pero el monto se acreditó en el saldo. `settlement.fallbackReason` explica el motivo. **Final.** |

---

## Seguimiento

Haga el seguimiento de cada venta mediante <a href={useBaseUrl('/docs/webhooks/sale/status')}>Consultar Venta</a> o mediante los <a href={useBaseUrl('/docs/webhooks/sale/receive')}>webhooks de venta</a> (`sale.*`), en la pestaña Webhooks › Ventas. La descripción de cada campo está en <a href={useBaseUrl('/docs/webhooks/sale/status#sale-object')}>Objeto de la venta</a>.

---
sidebar_label: 'Webhooks de Compra'
sidebar_position: 6
description: 'Eventos enviados por XGate en cada cambio de estado de una compra de cripto (tipo CRYPTO_PURCHASE).'
sidebar_class_name: 'sidebar-method-post'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Webhooks de Compra

XGate envía un evento a su URL en cada cambio de estado de una compra de cripto.

---

## Configuración

La configuración es igual a la de los demás webhooks (consulte <a href={useBaseUrl('/docs/webhooks/receive')}>Recibir Webhooks</a>): en el panel de XGate, menú **Webhooks**, seleccione el tipo de evento **Compras de Cripto** (`CRYPTO_PURCHASE`) y los estados que desea recibir.

El tipo `CRYPTO_PURCHASE` solo aparece para empresas con cripto habilitada.

---

## Formato del evento

:::warning[Envoltorio diferente del heredado]
Los eventos de cripto **no** usan el formato plano de los webhooks de depósito y retiro (`id`, `status`, `amount`, `operation`...). Llegan en un envoltorio con `id`, `type`, `createdAt` y `data`.
:::

- **Método:** <span className="badge badge--info">POST</span>

```json
{
  "id": "evt_6710c5a2f0e1d2c3b4a59687",
  "type": "purchase.delivered",
  "createdAt": "2026-10-13T14:11:40.031Z",
  "data": {
    "id": "6710c2f4a1b2c3d4e5f60718",
    "externalId": "pedido-7781",
    "status": "DELIVERED",
    "channel": "API",
    "asset": "USDT",
    "network": "TRON",
    "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
    "amount": "1500.00",
    "rate": "5.45400000",
    "cryptoAmount": "275.027502",
    "feeAmount": "4.125414",
    "feeAsset": "USDT",
    "networkFee": "0.012000",
    "deliveredAmount": "270.890088",
    "quoteId": "l3m8Qm1n0pV2cXk5dY9sTg4hWz7aB6eR1uJ0oK2qF3i",
    "depositId": null,
    "approval": { "required": true, "decision": "APPROVED", "decidedAt": "2026-10-13T14:08:02.000Z" },
    "delivery": { "status": "CONFIRMED", "txHash": "9f2c1e7b0a…", "confirmedAt": "2026-10-13T14:11:39.000Z" },
    "rejection": null,
    "executedAt": "2026-10-13T14:03:40.512Z",
    "createdAt": "2026-10-13T14:03:40.204Z",
    "updatedAt": "2026-10-13T14:11:40.031Z"
  }
}
```

| Campo       | Tipo     | Descripción                                                                                                                    |
| :---------- | :------- | :----------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string` | ID único del evento. Úselo para descartar entregas repetidas.                                                                  |
| `type`      | `string` | Tipo del evento (tabla a continuación).                                                                                        |
| `createdAt` | `string` | Fecha de creación del evento (ISO 8601, UTC).                                                                                  |
| `data`      | `object` | Objeto de la compra, igual al de <a href={useBaseUrl('/docs/buy-sell/purchases/list')}>GET /crypto/purchases/&#123;id&#125;</a>. |

---

## Eventos

| Evento (`type`)            | Estado en el panel | Cuándo                                                                                          |
| :------------------------- | :----------------- | :---------------------------------------------------------------------------------------------- |
| `purchase.executing`       | `EXECUTING`        | BRL debitado del saldo (por lo general antes de la respuesta `201` del `POST`).                 |
| `purchase.pending_approval`| `PENDING_APPROVAL` | La compra entró en la cola de aprobación de XGate.                                              |
| `purchase.delivered`       | `DELIVERED`        | Cripto confirmada en la red; `data.delivery.txHash` completado. **Final.**                      |
| `purchase.rejected`        | `REJECTED`         | Compra no entregada; `data.rejection` trae `reason`, `message` y `refunded`. **Final.**         |

---

## Reglas para el integrador

- **Un evento por cambio de estado**, enviado una vez. Los cambios internos dentro de `EXECUTING` no generan evento.
- **Entrega al menos una vez:** el mismo evento puede llegar más de una vez. Gestione la idempotencia por el `id` del evento.
- **Orden:** los eventos pueden llegar fuera de orden. Ordénelos por `data.updatedAt` y `data.status`.
- **Responda `200` rápidamente**, como en los demás webhooks.
- Una compra rechazada antes del débito (error `422` en el `POST`) genera solo el evento `purchase.rejected`.

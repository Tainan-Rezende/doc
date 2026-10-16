---
sidebar_label: 'Recibir webhooks de venta'
sidebar_position: 2
description: 'Eventos enviados por XGate en cada cambio de estado de una venta de cripto (tipo CRYPTO_SALE).'
sidebar_class_name: 'sidebar-method-post'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Recibir Webhooks de Venta

XGate envía un evento a su URL en cada cambio de estado de una venta de cripto.

:::note[Disponible en noviembre de 2026]
La venta de cripto por la API estará disponible en noviembre de 2026. El tipo `CRYPTO_SALE` solo aparece para empresas con venta habilitada.
:::

---

## Configuración

La configuración es igual a la de los demás webhooks (consulte <a href={useBaseUrl('/docs/webhooks/receive')}>Recibir Webhooks</a>): en el panel de XGate, menú **Webhooks**, seleccione el tipo de evento **Ventas de Cripto** (`CRYPTO_SALE`) y los estados que desea recibir.

---

## Formato del evento

:::warning[Envoltorio diferente del heredado]
Los eventos de cripto **no** usan el formato plano de los webhooks de depósito y retiro (`id`, `status`, `amount`, `operation`...). Llegan en un envoltorio con `id`, `type`, `createdAt` y `data`, el mismo de los <a href={useBaseUrl('/docs/webhooks/purchase/receive')}>webhooks de compra</a>.
:::

- **Método:** <span className="badge badge--info">POST</span>

```json
{
  "id": "evt_6711c0e8b2c3d4e5f6071829",
  "type": "sale.settled",
  "createdAt": "2026-11-13T14:03:24.902Z",
  "data": {
    "id": "6711c0e5a1b2c3d4e5f60718",
    "status": "SETTLED",
    "asset": "USDT",
    "network": "TRON",
    "depositAddress": "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
    "sourceAddress": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
    "txHash": "9f2c1e0b7a6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b3a2918070f6e5d4c",
    "cryptoAmount": "1000.000000",
    "rate": "5.41000000",
    "netCryptoAmount": "990.000000",
    "grossAmount": "5355.90",
    "feeAmount": "10.000000",
    "feeAsset": "USDT",
    "netAmount": "5355.90",
    "settlement": { "type": "BALANCE", "beneficiaryId": null, "withdrawId": null, "fallbackReason": null },
    "review": null,
    "receivedAt": "2026-11-13T14:03:22.114Z",
    "settledAt": "2026-11-13T14:03:24.870Z",
    "createdAt": "2026-11-13T14:03:22.114Z",
    "updatedAt": "2026-11-13T14:03:24.870Z"
  }
}
```

| Campo       | Tipo     | Descripción                                                                                                          |
| :---------- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string` | ID único del evento. Úselo para descartar entregas repetidas.                                                        |
| `type`      | `string` | Tipo del evento (tabla a continuación).                                                                              |
| `createdAt` | `string` | Fecha de creación del evento (ISO 8601, UTC).                                                                        |
| `data`      | `object` | Objeto de la venta, igual al de <a href={useBaseUrl('/docs/webhooks/sale/status#sale-object')}>Consultar Venta</a>.  |

---

## Eventos

| Evento (`type`) | Estado en el panel               | Cuándo                                                                                        |
| :-------------- | :------------------------------- | :-------------------------------------------------------------------------------------------- |
| `sale.received` | `RECEIVED`                       | Cripto recibida y confirmada en la dirección fija.                                            |
| `sale.settled`  | `SETTLED` o `SETTLED_TO_BALANCE` | BRL acreditado. `data.status` indica cuál de los dos y `data.settlement` muestra cómo. **Final.** |

---

## Reglas para el integrador

- **Un evento por cambio de estado**, enviado una vez.
- **Entrega al menos una vez:** el mismo evento puede llegar más de una vez. Gestione la idempotencia por el `id` del evento.
- **Orden:** los eventos pueden llegar fuera de orden. Ordénelos por `data.updatedAt` y `data.status`.
- **Responda `200` rápidamente**, como en los demás webhooks.
- Concilie cada venta por el `data.txHash` de su envío.

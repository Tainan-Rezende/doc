---
sidebar_label: 'Receive sale webhooks'
sidebar_position: 2
description: 'Events sent by XGate on every status change of a crypto sale (CRYPTO_SALE type).'
sidebar_class_name: 'sidebar-method-post'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Receive Sale Webhooks

XGate sends an event to your URL on every status change of a crypto sale.

:::note[Available in November 2026]
Selling crypto through the API will be released in November 2026. The `CRYPTO_SALE` type only appears for companies with sales enabled.
:::

---

## Setup

The setup is the same as for the other webhooks (see <a href={useBaseUrl('/docs/webhooks/receive')}>Receiving Webhooks</a>): in the XGate dashboard, **Webhooks** menu, select the event type **Crypto Sales** (`CRYPTO_SALE`) and the statuses you want to receive.

---

## Event format

:::warning[Envelope differs from the legacy one]
Crypto events do **not** use the flat format of the deposit and withdrawal webhooks (`id`, `status`, `amount`, `operation`...). They come in an envelope with `id`, `type`, `createdAt` and `data`, the same as the <a href={useBaseUrl('/docs/webhooks/purchase/receive')}>purchase webhooks</a>.
:::

- **Method:** <span className="badge badge--info">POST</span>

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

| Field       | Type     | Description                                                                                                        |
| :---------- | :------- | :----------------------------------------------------------------------------------------------------------------- |
| `id`        | `string` | Unique event ID. Use it to discard repeated deliveries.                                                            |
| `type`      | `string` | Event type (table below).                                                                                          |
| `createdAt` | `string` | Event creation date (ISO 8601, UTC).                                                                               |
| `data`      | `object` | Sale object, same as in <a href={useBaseUrl('/docs/webhooks/sale/status#sale-object')}>Get Sale</a>.               |

---

## Events

| Event (`type`)  | Dashboard status                  | When                                                                                 |
| :-------------- | :-------------------------------- | :----------------------------------------------------------------------------------- |
| `sale.received` | `RECEIVED`                        | Crypto received and confirmed at the fixed address.                                  |
| `sale.settled`  | `SETTLED` or `SETTLED_TO_BALANCE` | BRL credited. `data.status` tells which of the two and `data.settlement` shows how. **Final.** |

---

## Rules for the integrator

- **One event per status change**, sent once.
- **At-least-once delivery:** the same event may arrive more than once. Handle idempotency using the event `id`.
- **Order:** events may arrive out of order. Sort by `data.updatedAt` and `data.status`.
- **Respond `200` quickly**, as with the other webhooks.
- Reconcile each sale using the `data.txHash` of your transfer.

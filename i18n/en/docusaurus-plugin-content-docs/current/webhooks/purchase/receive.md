---
sidebar_label: 'Receive purchase webhooks'
sidebar_position: 2
description: 'Events sent by XGate on every status change of a crypto purchase (CRYPTO_PURCHASE type).'
sidebar_class_name: 'sidebar-method-post'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Receive Purchase Webhooks

XGate sends an event to your URL on every status change of a crypto purchase.

---

## Setup

The setup is the same as for the other webhooks (see <a href={useBaseUrl('/docs/webhooks/receive')}>Receiving Webhooks</a>): in the XGate dashboard, **Webhooks** menu, select the event type **Crypto Purchases** (`CRYPTO_PURCHASE`) and the statuses you want to receive.

The `CRYPTO_PURCHASE` type only appears for companies with crypto enabled.

---

## Event format

:::warning[Envelope differs from the legacy one]
Crypto events do **not** use the flat format of the deposit and withdrawal webhooks (`id`, `status`, `amount`, `operation`...). They come in an envelope with `id`, `type`, `createdAt` and `data`.
:::

- **Method:** <span className="badge badge--info">POST</span>

```json
{
  "id": "evt_6710c5a2f0e1d2c3b4a59687",
  "type": "purchase.delivered",
  "createdAt": "2026-10-13T14:11:40.031Z",
  "data": {
    "id": "6710c2f4a1b2c3d4e5f60718",
    "externalId": "order-7781",
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

| Field       | Type     | Description                                                                                                                   |
| :---------- | :------- | :---------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string` | Unique event ID. Use it to discard repeated deliveries.                                                                       |
| `type`      | `string` | Event type (table below).                                                                                                     |
| `createdAt` | `string` | Event creation date (ISO 8601, UTC).                                                                                          |
| `data`      | `object` | Purchase object, same as in <a href={useBaseUrl('/docs/webhooks/purchase/status')}>Get Purchase</a>.                      |

---

## Events

| Event (`type`)             | Dashboard status   | When                                                                                       |
| :------------------------- | :----------------- | :----------------------------------------------------------------------------------------- |
| `purchase.pending_payment` | `PENDING_PAYMENT`  | Only for purchases opened from a deposit: waiting for the Pix payment.                     |
| `purchase.executing`       | `EXECUTING`        | BRL debited from the balance (usually before the `201` response of the `POST`).            |
| `purchase.pending_approval`| `PENDING_APPROVAL` | The purchase entered XGate's approval queue.                                               |
| `purchase.delivered`       | `DELIVERED`        | Crypto confirmed on the network; `data.delivery.txHash` filled in. **Final.**              |
| `purchase.rejected`        | `REJECTED`         | Purchase not delivered; `data.rejection` contains `reason`, `message` and `refunded`. **Final.** |
| `purchase.expired`         | `EXPIRED`          | The source deposit was not paid in time. **Final.**                                        |

---

## Rules for the integrator

- **One event per status change**, sent once. Internal changes within `EXECUTING` do not generate an event.
- **At-least-once delivery:** the same event may arrive more than once. Handle idempotency using the event `id`.
- **Order:** events may arrive out of order. Sort by `data.updatedAt` and `data.status`.
- **Respond `200` quickly**, as with the other webhooks.
- A purchase refused before the debit (`422` error on the `POST`) generates only the `purchase.rejected` event.

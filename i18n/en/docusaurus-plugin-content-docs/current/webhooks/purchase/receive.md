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

:::warning[Envelope differs from deposit and withdrawal webhooks]
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
    "asset": "USDT",
    "network": "TRON",
    "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
    "amount": "1500.00",
    "deliveredAmount": "270.890088",
    "txHash": "9f2c1e7b0a…",
    "rejection": null,
    "updatedAt": "2026-10-13T14:11:40.031Z"
  }
}
```
### Event envelope

| Field       | Type     | Description                                                                                                                                   |
| :---------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string` | Unique event ID. Use to discard duplicate deliveries.                                                                                         |
| `type`      | `string` | Event type (table below).                                                                                                                     |
| `createdAt` | `string` | Event creation date (ISO 8601, UTC).                                                                                                          |
| `data`      | `object` | Purchase summary (table below). The full object is in <a href={useBaseUrl('/docs/webhooks/purchase/status')}>Get Purchase</a>.               |

### Fields in `data` (purchase summary)

<div className="tabela-nowrap">
| Field             | Type                | Description                                                                                   |
| :---------------- | :------------------ | :-------------------------------------------------------------------------------------------- |
| `id`              | `string`            | Purchase ID at XGate. Use in `GET /crypto/purchases/{id}`.                                     |
| `externalId`      | `string`            | Order ID in the integrator's system.                                                          |
| `status`          | `string`            | `PENDING_PAYMENT` · `EXECUTING` · `PENDING_APPROVAL` · `DELIVERED` · `REJECTED` · `EXPIRED`.  |
| `asset`           | `string`            | Purchased asset.                                                                              |
| `network`         | `string`            | Delivery network.                                                                             |
| `address`         | `string`            | Destination wallet.                                                                           |
| `amount`          | `string`            | Debited BRL amount.                                                                           |
| `deliveredAmount` | `string` \| `null`  | Quantity delivered (or to be delivered) to the wallet. `null` before execution.               |
| `txHash`          | `string` \| `null`  | On-chain hash in `DELIVERED`. `null` before delivery.                                          |
| `rejection`       | `object` \| `null`  | Only in `REJECTED`: `{ reason, refunded }`. `null` in other statuses.                         |
| `updatedAt`       | `string` (ISO)      | Last update; use with `status` to sort out-of-order events.                                    |
</div>

---

## Events

| Event (`type`)              | Dashboard status    | When                                                                                            |
| :-------------------------- | :------------------ | :---------------------------------------------------------------------------------------------- |
| `purchase.pending_payment`  | `PENDING_PAYMENT`   | Only in purchases opened from a deposit: awaiting Pix payment.                                  |
| `purchase.executing`        | `EXECUTING`         | BRL debited from balance (usually before the `201` response of `POST`).                         |
| `purchase.pending_approval` | `PENDING_APPROVAL`  | Purchase entered XGate's approval queue.                                                        |
| `purchase.delivered`        | `DELIVERED`         | Crypto confirmed on the network; `data.txHash` populated. **Final.**                            |
| `purchase.rejected`         | `REJECTED`          | Purchase not delivered; `data.rejection` provides `reason` and `refunded`. **Final.**           |
| `purchase.expired`          | `EXPIRED`           | Source deposit was not paid in time. **Final.**                                                 |

---

## Rules for the integrator

- **One event per status change**, sent once. Internal transitions within `EXECUTING` do not trigger events.
- **At-least-once delivery:** the same event may arrive more than once. Handle idempotency using the event `id`.
- **Order:** events may arrive out of order. Sort by `data.updatedAt` and `data.status`.
- **Respond `200` quickly**, as with the other webhooks.
- A purchase rejected before debit (`422` error on `POST`) generates only the `purchase.rejected` event.
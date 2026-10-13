---
draft: true
sidebar_label: 'Get Sales'
sidebar_position: 2
description: "Lists the company's crypto sales, retrieves a sale by ID and generates the receipt."
sidebar_class_name: 'sidebar-method-get'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Get Sales

- **Permission:** `CRYPTO.VIEW`

---

## Endpoints
- **Method:** <span className="badge badge--success">GET</span>

| Route                                 | Description                                   |
| :------------------------------------ | :-------------------------------------------- |
| `GET /crypto/sales`                   | Lists sales, from the most recent to the oldest. |
| `GET /crypto/sales/{id}`              | Retrieves a sale.                             |
| `GET /crypto/sales/{id}/receipt`      | HTML receipt.                                 |

```bash title="Endpoint URL"
https://api.xgateglobal.com/crypto/sales
```

---

## List sales

#### Query

| Parameter    | Type      | Description                                        |
| :----------- | :-------- | :------------------------------------------------- |
| `status`     | `string`  | `RECEIVED`, `SETTLING`, `SETTLED`, `SETTLED_TO_BALANCE`. |
| `asset`      | `string`  | `USDT` or `USDC`.                                  |
| `network`    | `string`  | Network.                                           |
| `txHash`     | `string`  | Exact match on the on-chain hash.                  |
| `from`, `to` | `string`  | Inclusive range on `createdAt` (ISO 8601).         |
| `cursor`     | `string`  | `nextCursor` from the previous page.               |
| `limit`      | `integer` | 1 to 100. Default: 20.                             |

#### Response (200 OK)

```json
{
  "items": [
    {
      "id": "6720a1b2c3d4e5f607182930",
      "status": "SETTLED",
      "asset": "USDT",
      "network": "TRON",
      "depositAddress": "TXg8u3…",
      "sourceAddress": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
      "txHash": "4b7e0c2d9a…",
      "cryptoAmount": "500.000000",
      "rate": "5.39800000",
      "feeAmount": "7.500000",
      "feeAsset": "USDT",
      "netCryptoAmount": "492.500000",
      "grossAmount": "2658.51",
      "netAmount": "2658.51",
      "settlement": { "type": "BALANCE", "beneficiaryId": null, "withdrawId": null, "fallbackReason": null },
      "review": null,
      "receivedAt": "2026-11-10T13:00:12.000Z",
      "settledAt": "2026-11-10T13:00:45.000Z",
      "createdAt": "2026-11-10T13:00:12.000Z",
      "updatedAt": "2026-11-10T13:00:45.000Z"
    }
  ],
  "nextCursor": null
}
```

The description of each field is in <a href={useBaseUrl('/docs/buy-sell/sales/sell#sale-object')}>Sale object</a>.

---

## Get a sale

`GET /crypto/sales/{id}` returns the sale object. Nonexistent ID or ID from another company → `404 SALE_NOT_FOUND`.

---

## Receipt

`GET /crypto/sales/{id}/receipt` returns `{ "htmlTemplate": "<html>…" }`, only for `SETTLED` or `SETTLED_TO_BALANCE` sales; before that, `409 RECEIPT_NOT_AVAILABLE`. For a sale settled via Pix, the receipt includes the beneficiary, the masked key, the withdrawal ID and the E2E. Language via `Accept-Language` (`pt-BR` default, `en`).

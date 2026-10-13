---
sidebar_label: 'Conventions'
sidebar_position: 2
description: 'Rules that apply to all /crypto routes: authentication, allowed IPs, permissions, value format, errors, pagination and limits.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Crypto API Conventions

The rules below apply to **all** `/crypto/*` routes.

---

## Authentication

Base URL and authentication are the same as the rest of the API:

```bash title="Base URL"
https://api.xgateglobal.com
```

| Header            | Value                 | Description                                                                                  |
| :---------------- | :-------------------- | :------------------------------------------------------------------------------------------- |
| `Authorization`   | `Bearer <your_token>` | Token obtained at <a href={useBaseUrl('/docs/authentication/login')}>login</a>.              |
| `Accept-Language` | `pt-BR` or `en`       | *(Optional)* Language of error messages and of the receipt. Default: `pt-BR`.                |

The company is always the one from the token: there is no company parameter in the routes.

---

## Allowed IPs

The company must have its list of allowed IPs registered in the XGate dashboard. The same list used for withdrawals applies to the entire crypto API.

| Situation                              | Response                      |
| :------------------------------------- | :---------------------------- |
| Company without an IP list             | `403 ALLOWED_IPS_REQUIRED`    |
| Request from an IP outside the list    | `403 CLIENT_IP_NOT_ALLOWED`   |

---

## Permissions

The API user's group needs the following permissions:

| Permission       | Grants                                                                 |
| :--------------- | :--------------------------------------------------------------------- |
| `CRYPTO.VIEW`    | Query options, estimates, purchases and receipts.                      |
| `CRYPTO.EXECUTE` | Quote (`POST /crypto/quotes`) and buy (`POST /crypto/purchases`).      |

Without the required permission: `403 PERMISSION_DENIED`.

---

## Monetary values

:::warning[Money is always a decimal string]
Every monetary value travels as a **decimal string**, never as a number: `"amount": "1500.00"`. Sending a number results in `400 AMOUNT_MUST_BE_STRING`.
:::

| Quantity         | Decimal places | Rounding              |
| :--------------- | :------------: | :-------------------- |
| BRL              | 2              | Up                    |
| USDT / USDC      | 6              | Down (delivery)       |
| `rate` (quote)   | 8              | —                     |

Dates follow ISO 8601 in UTC (ex: `2026-10-13T14:03:52.114Z`).

---

## Error format {#error-format}

Every error comes in the same envelope:

```json
{
  "reason": "INSUFFICIENT_BALANCE",
  "message": "Insufficient balance for the purchase.",
  "traceId": "1-6710b8e4-3c1f2a9b7d5e4f6a8b9c0d1e"
}
```

| Field     | Description                                                                               |
| :-------- | :---------------------------------------------------------------------------------------- |
| `reason`  | Stable error code. **Use this field in your logic.**                                      |
| `message` | Human-readable text, in pt-BR by default or in English with `Accept-Language: en`. May change. |
| `traceId` | Protocol to provide to XGate support.                                                     |

The full list is in <a href={useBaseUrl('/docs/buy-sell/errors')}>Error Codes</a>.

---

## Pagination

Lists are paginated by cursor:

| Parameter | Description                                                       |
| :-------- | :---------------------------------------------------------------- |
| `limit`   | Items per page, from 1 to 100. Default: 20.                       |
| `cursor`  | The `nextCursor` from the previous page. Omit on the first page.  |

The response contains `{ "items": [...], "nextCursor": "..." }`. `nextCursor: null` indicates the last page.

---

## Idempotency

Purchases are idempotent through the `externalId` field (there is no `Idempotency-Key` header). See <a href={useBaseUrl('/docs/buy-sell/purchases/create')}>Buy Crypto</a>.

---

## Limits

| Situation                                                        | Response                                       |
| :--------------------------------------------------------------- | :--------------------------------------------- |
| Too many calls per minute on quote, estimate and purchase        | `429 RATE_LIMITED` with `Retry-After` header   |
| Request body larger than 256 KiB                                 | `413 PAYLOAD_TOO_LARGE`                        |
| Service overloaded                                               | `503 SERVICE_OVERLOADED` with `Retry-After`    |

Respect the `Retry-After` (in seconds) before trying again.

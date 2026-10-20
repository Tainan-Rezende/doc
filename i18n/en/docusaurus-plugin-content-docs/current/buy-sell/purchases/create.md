---
sidebar_label: 'Buy Crypto'
sidebar_position: 1
description: 'Buy USDT or USDC using the company’s BRL balance and send the crypto to the company’s destination wallet.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Buy Crypto

Buy USDT or USDC using the company’s BRL balance. XGate sends the crypto to the specified destination wallet, which must **belong to the company**.

---

## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/crypto/purchases
```

---

## Request

#### Required Headers

| Header          | Value                | Description                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained during login. |

#### Purchase methods

There are two methods. **Do not mix fields** from one method with those of the other.

<Tabs>
  <TabItem value="quote" label="With a quote" default>
  Uses the guaranteed price from a valid <a href={useBaseUrl('/docs/buy-sell/quotes')}>quote</a> (`quoteId`). The asset, network, and amount are taken from the quote.

```json
{
  "externalId": "pedido-7781",
  "quoteId": "l3m8Qm1n0pV2cXk5dY9sTg4hWz7aB6eR1uJ0oK2qF3i",
  "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
}
```
  </TabItem>
  <TabItem value="market" label="At market">
  Purchases at the price available at execution time. `asset`, `network`, and `amount` are required.

```json
{
  "externalId": "pedido-7782",
  "asset": "USDT",
  "network": "TRON",
  "amount": "1500.00",
  "addressId": "66f1a2b3c4d5e6f708192a3b"
}
```
  </TabItem>
</Tabs>

#### Request Body

| Field                        | Type     | Required | Description                                                                                                                                                                       |
| :--------------------------- | :------- | :---------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `externalId`                 | `string` |   **Yes**   | Purchase identifier in your system. 1 to 128 printable ASCII characters, cannot contain `/` or start with `$`. Must be unique per company.                                                  |
| `address`                    | `string` |  **One of the two**  | The company’s declared destination wallet, valid on the network and without a memo/tag.                                                                                                   |
| `addressId`                  | `string` |  **One of the two**  | Saved address (`buy.addresses[].addressId` from <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a>).                                                   |
| `quoteId`                    | `string` |   Quote-based method   | A valid quote. Cannot be sent together with `asset`, `network`, or `amount` (`400 CONFLICTING_FIELDS`).                                                                        |
| `asset`, `network`, `amount` | `string` |   Market method     | Asset, network, and total in BRL (a string with 2 decimal places). All three are required when `quoteId` is not provided.                                                                      |

:::tip[Idempotency with externalId]
- Same `externalId` + same body → **200 OK** with the purchase that was already created (no new purchase).
- Same `externalId` + different body → `409 EXTERNAL_ID_CONFLICT`.
- A rejected purchase remains registered with its `externalId`. To try again, **use a different `externalId`**.
:::

---

## Responses

### Success (201 Created)

The response is returned after the price and BRL debit have been locked (status `EXECUTING`).

```json
{
  "id": "6710c2f4a1b2c3d4e5f60718",
  "externalId": "pedido-7781",
  "status": "EXECUTING",
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
  "approval": { "required": true, "decision": null, "decidedAt": null },
  "delivery": { "status": "WAITING_APPROVAL", "txHash": null, "confirmedAt": null },
  "rejection": null,
  "executedAt": "2026-10-13T14:03:40.512Z",
  "createdAt": "2026-10-13T14:03:40.204Z",
  "updatedAt": "2026-10-13T14:03:40.512Z"
}
```

### Lifecycle

```text
EXECUTING ──► PENDING_APPROVAL ──► DELIVERED
    │                │
    └────────────────┴──────────► REJECTED
```

- **Without automatic approval** (`buy.autoApproval = false`): the purchase enters XGate’s approval queue (`PENDING_APPROVAL`). The price is already locked and will not change.
- **With automatic approval:** the purchase proceeds directly to `DELIVERED`.
- In `DELIVERED`, `delivery.txHash` contains the transaction hash on the network.
- In `REJECTED`, `rejection.refunded = true` indicates that the full BRL amount, including fees, was returned to the balance.

Track the purchase using <a href={useBaseUrl('/docs/webhooks/purchase/status')}>Get Purchase</a> or the <a href={useBaseUrl('/docs/webhooks/purchase/receive')}>purchase webhooks</a> (Webhooks tab › Crypto Purchase Webhook).

:::info[API security]
The API does not use an authenticator code (TOTP). Protection is provided by the token, the allowed IP list, and XGate’s approval queue.
:::

### Purchase object {#purchase-object}

The same object is returned by Get Purchase; the webhook contains only a summary.

| Field                    | Type               | Description                                                                                                                                       |
| :----------------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                     | `string`           | Purchase ID in XGate.                                                                                                                          |
| `externalId`             | `string`           | Purchase ID in your system.                                                                                                                    |
| `status`                 | `string`           | `PENDING_PAYMENT` · `EXECUTING` · `PENDING_APPROVAL` · `DELIVERED` · `REJECTED` · `EXPIRED`.                                                    |
| `channel`                | `string`           | Purchase source: `API`, `DASHBOARD`, or `DEPOSIT`.                                                                                              |
| `asset`, `network`, `address` | `string`      | Crypto destination.                                                                                                                              |
| `amount`                 | `string` \| `null` | Total BRL amount debited from the balance.                                                                                                                 |
| `rate`                   | `string` \| `null` | Price per unit in BRL (8 decimal places), locked at `executedAt`.                                                                                    |
| `cryptoAmount`           | `string` \| `null` | `amount ÷ rate` (6 decimal places).                                                                                                                      |
| `feeAmount`, `feeAsset`  | `string` \| `null` | XGate + referral fee, charged in crypto (`feeAsset` = the asset).                                                                               |
| `networkFee`             | `string` \| `null` | Network gas deducted from the delivery amount.                                                                                                                      |
| `deliveredAmount`        | `string` \| `null` | Amount delivered to the wallet.                                                                                                               |
| `quoteId`                | `string` \| `null` | Quote used. `null` for a market purchase.                                                                                                      |
| `depositId`              | `string` \| `null` | Source deposit, when `channel = DEPOSIT`.                                                                                                 |
| `approval`               | `object`           | `required` (`boolean`), `decision` (`APPROVED` \| `REJECTED` \| `AUTO` \| `null`), `decidedAt`.                                                 |
| `delivery`               | `object`           | `status` (`WAITING_APPROVAL` · `QUEUED` · `SUBMITTED` · `CONFIRMING` · `CONFIRMED` · `UNDER_REVIEW` · `null`), `txHash`, `confirmedAt`.         |
| `rejection`              | `object` \| `null` | In `REJECTED`: `reason` (see <a href={useBaseUrl('/docs/buy-sell/errors#rejection-reasons')}>rejection reasons</a>), `message` (in the language specified by `Accept-Language`), `refunded`. |
| `executedAt`, `createdAt`, `updatedAt` | `string` | ISO 8601 dates (UTC).                                                                                                                  |

### Common Errors

| Status  | Reason                                                                                                                                                                                                                                                                       |
| :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`, `AMOUNT_MUST_BE_STRING`, `CONFLICTING_FIELDS`                                                                                                                                                                                                           |
| **401** | `UNAUTHORIZED`                                                                                                                                                                                                                                                               |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`, `BUY_DISABLED`                                                                                                        |
| **404** | `SAVED_ADDRESS_NOT_FOUND`, `QUOTE_NOT_FOUND`                                                                                                                                                                                                                                 |
| **409** | `EXTERNAL_ID_CONFLICT`, `QUOTE_EXPIRED`, `QUOTE_ALREADY_USED`                                                                                                                                                                                                                |
| **422** | `ASSET_NOT_SUPPORTED`, `NETWORK_NOT_SUPPORTED`, `PAIR_MARGIN_NOT_CONFIGURED`, `AMOUNT_BELOW_MIN`, `AMOUNT_ABOVE_MAX`, `ADDRESS_INVALID_FOR_NETWORK`, `ADDRESS_NOT_SAVED`, `ADDRESS_ON_HOLD`, `SAVED_ADDRESS_NETWORK_MISMATCH`, `AMOUNT_TOO_LOW_FOR_NETWORK_FEE`, `INSUFFICIENT_BALANCE`, `PRICE_UNSTABLE` |
| **429** | `RATE_LIMITED`, `DAILY_CAP_EXCEEDED`, `OUTFLOW_HOURLY_CAP_EXCEEDED`                                                                                                                                                                                                          |
| **503** | `PRICE_STALE`, `NETWORK_FEE_UNAVAILABLE`, `CRYPTO_TEMPORARILY_UNAVAILABLE`, `CONFIGURATION_UNAVAILABLE`, `SERVICE_OVERLOADED`                                                                                                                                                |

:::warning[Execution rejection]
If a purchase is rejected during execution (insufficient balance, limits, price, or expired quote), the API returns an error **and** the purchase is recorded as `REJECTED` with the `externalId` that was used. The `purchase.rejected` webhook is sent in this case.
:::

See the meaning of each code in <a href={useBaseUrl('/docs/buy-sell/errors')}>Error Codes</a>.

---

## Integration

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    **JavaScript example (quote + purchase):**
    ```js
    const axios = require("axios");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const headers = { "Authorization": `Bearer ${login.data.token}` };

        // 1. Get a quote (price guaranteed for 30 seconds)
        const quote = await axios.post(`${url_api}/crypto/quotes`, {
            asset: "USDT",
            network: "TRON",
            amount: "1500.00" // always a string
        }, { headers });

        // 2. Purchase using the quote
        const { data } = await axios.post(`${url_api}/crypto/purchases`, {
            externalId: "pedido-7781",
            quoteId: quote.data.quoteId,
            address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
        }, { headers });

        console.log(data.id, data.status); // EXECUTING
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>
---
sidebar_label: 'Quote and Estimate'
sidebar_position: 4
description: 'Generates a quote with a guaranteed price for the purchase, or an estimate without price reservation.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Quote and Estimate

Two routes with the same body:

| Route                           | Permission       | Usage                                                                                                                                |
| :------------------------------ | :--------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| `POST /crypto/quotes`           | `CRYPTO.EXECUTE` | Generates a quote with a `quoteId` and a price **guaranteed** for `quoteTtlSeconds` (30 s), to be used in the purchase. Requesting it and not using it costs nothing. |
| `POST /crypto/quotes/estimate`  | `CRYPTO.VIEW`    | Just an estimate: no `quoteId` is generated and nothing is reserved. Useful to display the approximate amount ("≈") before buying.     |

---

## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Quote"
https://api.xgateglobal.com/crypto/quotes
```

```bash title="Estimate"
https://api.xgateglobal.com/crypto/quotes/estimate
```

---

## Request

#### Required Headers

| Header          | Value                 | Description                      |
| :-------------- | :-------------------- | :------------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained at login. |

#### Body (Request Body)

| Field     | Type     | Required | Description                                                                                 |
| :-------- | :------- | :------: | :------------------------------------------------------------------------------------------ |
| `asset`   | `string` | **Yes**  | `USDT` or `USDC`.                                                                           |
| `network` | `string` | **Yes**  | `POLYGON`, `ETHEREUM`, `TRON` or `SOLANA` (depending on the asset).                         |
| `amount`  | `string` | **Yes**  | Total in BRL to be debited from the balance, string with 2 decimals (ex: `"1500.00"`).      |

```json
{
  "asset": "USDT",
  "network": "TRON",
  "amount": "1500.00"
}
```

:::info[The fee is charged in crypto]
The `amount` is the total BRL debited, with no embedded fee. The fee is **never charged in BRL**: it is deducted from the crypto amount delivered.
:::

---

## Responses

### Success

`POST /crypto/quotes` responds **201 Created**:

```json
{
  "quoteId": "l3m8Qm1n0pV2cXk5dY9sTg4hWz7aB6eR1uJ0oK2qF3i",
  "expiresAt": "2026-10-13T14:03:52.114Z",
  "asset": "USDT",
  "network": "TRON",
  "amount": "1500.00",
  "rate": "5.45400000",
  "cryptoAmount": "275.027502",
  "feeAmount": "4.125414",
  "feeAsset": "USDT",
  "networkFee": "0.012000",
  "deliveredAmount": "270.890088"
}
```

`POST /crypto/quotes/estimate` responds **200 OK** with the same fields, **without** `quoteId` and `expiresAt`, and with `estimatedAt` (date of the estimate).

#### Field Description

| Field             | Type     | Description                                                                  |
| :---------------- | :------- | :--------------------------------------------------------------------------- |
| `quoteId`         | `string` | *(Quote only)* Identifier to use in `POST /crypto/purchases`.                |
| `expiresAt`       | `string` | *(Quote only)* Until when the price is guaranteed.                           |
| `estimatedAt`     | `string` | *(Estimate only)* Time of the estimate.                                      |
| `asset`, `network`| `string` | Quoted asset and network.                                                    |
| `amount`          | `string` | Total in BRL to be debited.                                                  |
| `rate`            | `string` | Price of 1 unit of the asset in BRL (8 decimals).                            |
| `cryptoAmount`    | `string` | Gross amount purchased (6 decimals).                                         |
| `feeAmount`       | `string` | Fee (XGate + referral), in the asset itself.                                 |
| `feeAsset`        | `string` | Asset in which the fee is charged.                                           |
| `networkFee`      | `string` | Network gas, deducted from the delivery.                                     |
| `deliveredAmount` | `string` | Amount that arrives in the wallet.                                           |

#### How the amount is calculated

```text
cryptoAmount    = amount ÷ rate                        (rounded down, 6 decimals)
feeAmount       = fee on cryptoAmount                  (rounded up, in the asset itself)
deliveredAmount = cryptoAmount − feeAmount − networkFee
```

### Common Errors

| Status  | Reason                                                                                                                                                                  |
| :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`, `AMOUNT_MUST_BE_STRING`                                                                                                                            |
| **401** | `UNAUTHORIZED`                                                                                                                                                          |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`, `BUY_DISABLED`   |
| **422** | `ASSET_NOT_SUPPORTED`, `NETWORK_NOT_SUPPORTED`, `AMOUNT_BELOW_MIN`, `AMOUNT_ABOVE_MAX`, `AMOUNT_TOO_LOW_FOR_NETWORK_FEE`, `PAIR_MARGIN_NOT_CONFIGURED`, `PRICE_UNSTABLE` |
| **429** | `RATE_LIMITED`                                                                                                                                                          |
| **503** | `PRICE_STALE`, `NETWORK_FEE_UNAVAILABLE`, `CONFIGURATION_UNAVAILABLE`, `SERVICE_OVERLOADED`                                                                             |

See the meaning of each code in <a href={useBaseUrl('/docs/buy-sell/errors')}>Error Codes</a>.

---

## Integration

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    **JavaScript Example:**
    ```js
    const axios = require("axios");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const headers = { "Authorization": `Bearer ${login.data.token}` };
        const body = { asset: "USDT", network: "TRON", amount: "1500.00" }; // amount always as a string

        // Estimate (nothing is reserved)
        const estimate = await axios.post(`${url_api}/crypto/quotes/estimate`, body, { headers });
        console.log("≈", estimate.data.deliveredAmount, estimate.data.asset);

        // Quote with a price guaranteed for 30 seconds
        const quote = await axios.post(`${url_api}/crypto/quotes`, body, { headers });
        console.log(quote.data.quoteId, quote.data.expiresAt);
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

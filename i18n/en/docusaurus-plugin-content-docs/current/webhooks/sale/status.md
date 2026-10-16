---
sidebar_label: 'Get Sale'
sidebar_position: 1
description: 'Retrieves a crypto sale by ID.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Get Sale

Retrieves a crypto sale by ID. Each confirmed transfer to the company's fixed address becomes a sale (see <a href={useBaseUrl('/docs/buy-sell/sales/sell')}>Sell Crypto</a>); the `id` arrives in the <a href={useBaseUrl('/docs/webhooks/sale/receive')}>sale webhook</a>.

:::note[Available in November 2026]
Selling crypto through the API will be released in November 2026.
:::

---

## Endpoint
- **Method:** <span className="badge badge--success">GET</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/crypto/sales/{id}
```

---

## Request

#### Required Headers

| Header          | Value                 | Description                      |
| :-------------- | :-------------------- | :------------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained at login. |

#### Path

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `id`      | `string` | Sale ID.     |

---

## Responses

### Success (200 OK)

```json
{
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
```

### Sale object {#sale-object}

The same object is sent in the `data` field of the <a href={useBaseUrl('/docs/webhooks/sale/receive')}>sale webhooks</a>.

| Field                      | Type               | Description                                                                                                                                                                     |
| :------------------------- | :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                       | `string`           | Sale ID.                                                                                                                                                                        |
| `status`                   | `string`           | `RECEIVED` (received and confirmed, waiting for the price) · `SETTLING` (price frozen, credit in progress) · `SETTLED` (settled using the configured method; final) · `SETTLED_TO_BALANCE` (was Pix, credited to the balance; final). |
| `asset`, `network`         | `string`           | Asset and network.                                                                                                                                                              |
| `depositAddress`           | `string`           | Company's fixed address that received the funds.                                                                                                                                |
| `sourceAddress`            | `string` \| `null` | Where the crypto came from, when the network provides it.                                                                                                                       |
| `txHash`                   | `string` \| `null` | On-chain hash of the transfer. Use it to reconcile.                                                                                                                             |
| `cryptoAmount`             | `string`           | Amount received (6 decimals).                                                                                                                                                   |
| `rate`                     | `string` \| `null` | BRL price per unit (8 decimals), frozen at settlement.                                                                                                                          |
| `feeAmount`, `feeAsset`    | `string` \| `null` | Fee in crypto on `cryptoAmount`.                                                                                                                                                |
| `netCryptoAmount`          | `string` \| `null` | `cryptoAmount − feeAmount`.                                                                                                                                                     |
| `grossAmount`, `netAmount` | `string` \| `null` | Amount credited in BRL (`netCryptoAmount × rate`, rounded down). Currently they are equal.                                                                                      |
| `settlement`               | `object`           | `type` (`BALANCE` \| `PIX_KEY`), `beneficiaryId`, `withdrawId` (Pix withdrawal created), `fallbackReason` (`PIX_SETTLEMENT_UNAVAILABLE` · `BENEFICIARY_NOT_ELIGIBLE` · `PAYOUT_REJECTED` · `PAYOUT_FAILED` · `PAYOUT_UNAVAILABLE` · `null`). |
| `review`                   | `object` \| `null` | Sale under XGate review. `reason`: `BELOW_MINIMUM` · `COMPANY_UNAVAILABLE` · `COMPANY_BLOCKED` · `SELL_POLICY_MISSING` · `NET_NOT_POSITIVE` · `CONFIRMATIONS_TIMEOUT` · `CREDIT_REVIEW`. |
| `receivedAt`, `settledAt`, `createdAt`, `updatedAt` | `string` | ISO 8601 dates (UTC). `updatedAt` and `status` sort webhooks that arrive out of order.                                                                 |

### Common Errors

| Status  | Reason                                                                         |
| :------ | :----------------------------------------------------------------------------- |
| **401** | `UNAUTHORIZED`                                                                 |
| **403** | `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`             |
| **404** | `SALE_NOT_FOUND`: nonexistent ID, malformed ID or ID from another company.     |

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
    const saleId = "6711c0e5a1b2c3d4e5f60718";

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/crypto/sales/${saleId}`, {
            headers: { "Authorization": `Bearer ${login.data.token}` }
        });
        console.log(data.status, data.txHash, data.netAmount, data.settlement.type); // Response
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

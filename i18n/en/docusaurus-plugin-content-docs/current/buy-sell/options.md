---
sidebar_label: 'Options'
sidebar_position: 3
description: 'Returns what the company can do right now: assets, networks, fees, purchase limits, saved addresses and sale addresses.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Get Options

Returns what your company can do right now: enabled assets and networks, fees, purchase limits, saved addresses and quote validity. Use this route before quoting or buying.

---

## Endpoint
- **Method:** <span className="badge badge--success">GET</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/crypto/options
```

---

## Request

#### Required Headers

| Header          | Value                 | Description                      |
| :-------------- | :-------------------- | :------------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained at login. |

This route takes no parameters.

---

## Responses

### Success (200 OK)

```json
{
  "assets": [
    {
      "asset": "USDT",
      "feeRate": "0.01500000",
      "spreadRate": "0.00800000",
      "networks": [
        { "network": "TRON", "networkFee": "0.012000", "networkFeeAsset": "USDT" },
        { "network": "POLYGON", "networkFee": "0.003000", "networkFeeAsset": "USDT" }
      ]
    },
    {
      "asset": "USDC",
      "feeRate": "0.01500000",
      "spreadRate": "0.00800000",
      "networks": [
        { "network": "SOLANA", "networkFee": "0.002000", "networkFeeAsset": "USDC" }
      ]
    }
  ],
  "buy": {
    "enabled": true,
    "minAmount": "50.00",
    "maxAmountPerTx": "100000.00",
    "dailyCap": "500000.00",
    "dailyRemaining": "498500.00",
    "totpThreshold": null,
    "autoApproval": false,
    "addresses": [
      {
        "addressId": "66f1a2b3c4d5e6f708192a3b",
        "alias": "Treasury wallet",
        "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
        "network": "TRON",
        "source": "MANUAL",
        "addedAt": "2026-10-01T12:00:00.000Z",
        "activeAt": "2026-10-01T12:00:00.000Z"
      }
    ]
  },
  "savedAddressesOnly": {
    "enabled": false,
    "newAddressHoldHours": 24
  },
  "quoteTtlSeconds": 30,
  "sale": {
    "enabled": false,
    "status": "DISABLED",
    "minAmount": { "USDT": null, "USDC": null },
    "depositAddresses": []
  }
}
```

#### Field Description

| Field                                 | Type                       | Description                                                                                                                                             |
| :------------------------------------ | :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `assets[].asset`                      | `USDT` \| `USDC`           | Asset.                                                                                                                                                  |
| `assets[].feeRate`                    | `string` \| `null`         | Purchase fee (XGate + referral) on the crypto amount. It is the basis for `feeAmount`.                                                                  |
| `assets[].spreadRate`                 | `string` \| `null`         | Pair margin embedded in the `rate` (`rate = ask × (1 + spreadRate)`).                                                                                   |
| `assets[].networks[].network`         | `string`                   | Network available for the asset (`POLYGON`, `ETHEREUM`, `TRON`, `SOLANA`).                                                                              |
| `assets[].networks[].networkFee`      | `string` \| `null`         | Estimated network gas, in the asset itself (6 decimals), deducted from the delivery. `null` when unavailable or when the company's rule is percentage-based. |
| `assets[].networks[].networkFeeAsset` | `USDT` \| `USDC`           | Asset in which the gas is charged.                                                                                                                      |
| `buy.enabled`                         | `boolean`                  | Purchase enabled for the company.                                                                                                                       |
| `buy.minAmount`                       | `string`                   | Minimum purchase, in BRL.                                                                                                                               |
| `buy.maxAmountPerTx`                  | `string` \| `null`         | Maximum per purchase, in BRL.                                                                                                                           |
| `buy.dailyCap`                        | `string` \| `null`         | Daily purchase cap, in BRL.                                                                                                                             |
| `buy.dailyRemaining`                  | `string` \| `null`         | Amount remaining of the daily cap, in BRL.                                                                                                              |
| `buy.totpThreshold`                   | `string` \| `null`         | Used only in the dashboard. Does not apply to the API.                                                                                                  |
| `buy.autoApproval`                    | `boolean`                  | `true` = the purchase does not go through XGate's approval queue.                                                                                       |
| `buy.addresses[]`                     | `array`                    | Company's saved addresses: `addressId`, `alias`, `address`, `network`, `source` (`MANUAL` \| `CARD`), `addedAt`, `activeAt`. The `addressId` can be used as the destination of a purchase. |
| `savedAddressesOnly.enabled`          | `boolean`                  | "Saved addresses only" lock, enabled by the company in the dashboard.                                                                                   |
| `savedAddressesOnly.newAddressHoldHours` | `integer`               | Hold period, in hours, for a new address when the lock is enabled (24).                                                                                 |
| `quoteTtlSeconds`                     | `integer`                  | Quote validity, in seconds (30).                                                                                                                        |
| `sale.enabled`                        | `boolean`                  | Sale enabled for the company. Stays `false` until sales via API are released (November 2026).                                                         |
| `sale.status`                         | `string`                   | `DISABLED` · `PROVISIONING` · `READY`. The first query by a company with sales enabled creates the addresses: it stays `PROVISIONING` for a few minutes and then becomes `READY`. |
| `sale.minAmount`                      | `object`                   | Minimum sale per asset (`USDT`, `USDC`), in the asset amount.                                                                                           |
| `sale.depositAddresses[]`             | `array`                    | Company's fixed address for each `asset` × `network` pair (`asset`, `network`, `address`). Empty while sales are not enabled. See <a href={useBaseUrl('/docs/buy-sell/sales/sell')}>Sell Crypto</a>. |

:::tip[Saved addresses lock]
With `savedAddressesOnly.enabled = true`, purchases only accept addresses from `buy.addresses[]`, and a newly registered address can only be used after `activeAt` (hold period of `newAddressHoldHours`).
:::

### Common Errors

| Status  | Reason                                                                                                                                  |
| :------ | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`                                                                                                                     |
| **401** | `UNAUTHORIZED`                                                                                                                          |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED` |
| **503** | `CONFIGURATION_UNAVAILABLE`, `SERVICE_OVERLOADED`                                                                                       |

See the meaning of each code in <a href={useBaseUrl('/docs/buy-sell/errors')}>Error Codes</a>.

---

## Integration

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    The integration example uses the <code>Axios</code> library in Node.js.

    **Installing `Axios`:**
    ```bash
    npm install axios
    ```

    **JavaScript Example:**
    ```js
    const axios = require("axios");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/crypto/options`, {
            headers: { "Authorization": `Bearer ${login.data.token}` }
        });
        console.log(data.assets, data.buy); // Response
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

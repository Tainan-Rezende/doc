---
sidebar_label: 'Options'
sidebar_position: 3
description: 'Returns what the company can do now: assets, networks, fees, purchase limits, saved addresses, and sale addresses.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Get Options

Returns what your company can do now: enabled assets and networks, fees, purchase limits, saved addresses, and quote validity. Use this endpoint before requesting a quote or making a purchase.

---

## Endpoint
- **Method:** <span className="badge badge--success">GET</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/crypto/options
```

---

## Request

#### Required Headers

| Header          | Value                | Description                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained during login. |

This endpoint does not accept parameters.

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
        "alias": "Carteira tesouraria",
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

#### Field Descriptions

<div className="tabela-nowrap">
| Field                                    | Type               | Description                                                                                                                                                                                                        |
| :--------------------------------------- | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets[].asset`                         | `USDT` \| `USDC`   | Asset.                                                                                                                                                                                                           |
| `assets[].feeRate`                       | `string` \| `null` | Purchase fee (XGate + referral) charged on the crypto amount. This is the basis for `feeAmount`.                                                                                                                           |
| `assets[].spreadRate`                    | `string` \| `null` | Pair margin included in `rate` (`rate = ask × (1 + spreadRate)`).                                                                                                                                              |
| `assets[].networks[].network`            | `string`           | Network available for the asset (`POLYGON`, `ETHEREUM`, `TRON`, `SOLANA`).                                                                                                                                          |
| `assets[].networks[].networkFee`         | `string` \| `null` | Estimated network gas in the asset itself (6 decimal places), deducted from the delivery amount. `null` when unavailable or when the company’s fee rule is percentage-based.                                                                   |
| `assets[].networks[].networkFeeAsset`    | `USDT` \| `USDC`   | Asset in which the gas fee is charged.                                                                                                                                                                                    |
| `buy.enabled`                            | `boolean`          | Whether purchases are enabled for the company.                                                                                                                                                                                  |
| `buy.minAmount`                          | `string`           | Minimum purchase amount in BRL.                                                                                                                                                                                           |
| `buy.maxAmountPerTx`                     | `string` \| `null` | Maximum amount per purchase in BRL.                                                                                                                                                                                       |
| `buy.dailyCap`                           | `string` \| `null` | Daily purchase cap in BRL.                                                                                                                                                                                   |
| `buy.dailyRemaining`                     | `string` \| `null` | Remaining amount under the daily cap, in BRL.                                                                                                                                                                       |
| `buy.totpThreshold`                      | `string` \| `null` | Used only in the Dashboard. Not applicable to the API.                                                                                                                                                                         |
| `buy.autoApproval`                       | `boolean`          | `true` = the purchase does not go through XGate’s approval queue.                                                                                                                                                     |
| `buy.addresses[]`                        | `array`            | The company’s saved addresses: `addressId`, `alias`, `address`, `network`, `source` (`MANUAL` \| `CARD`), `addedAt`, `activeAt`. `addressId` can be used as the destination for a purchase.                              |
| `savedAddressesOnly.enabled`             | `boolean`          | “Saved addresses only” restriction, enabled by the company in the Dashboard.                                                                                                                                                      |
| `savedAddressesOnly.newAddressHoldHours` | `integer`          | Hold period, in hours, for a new address when the restriction is enabled (24).                                                                                                                                         |
| `quoteTtlSeconds`                        | `integer`          | Quote validity period, in seconds (30).                                                                                                                                                                           |
| `sale.enabled`                           | `boolean`          | Whether XGate has enabled selling for the company.                                                                                                                                                                        |
| `sale.status`                            | `string`           | `DISABLED` · `PROVISIONING` · `READY`. The first request for a company with selling enabled creates the addresses: the status remains `PROVISIONING` for a few minutes, then changes to `READY`.                                        |
| `sale.minAmount`                         | `object`           | Minimum sale amount per asset (`USDT`, `USDC`), expressed in the asset.                                                                                                                                                 |
| `sale.depositAddresses[]`                | `array`            | The company’s fixed address for each `asset` × `network` pair (`asset`, `network`, `address`). Empty while `sale.enabled` is `false`. See <a href={useBaseUrl('/docs/buy-sell/sales/sell')}>Sell Crypto</a>. |
</div>

:::tip[Saved address restriction]
When `savedAddressesOnly.enabled = true`, purchases accept only addresses in `buy.addresses[]`, and a newly added address can be used only after `activeAt` (the `newAddressHoldHours` hold period).
:::

### Common Errors

| Status  | Reason                                                                                                                                                |
| :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`                                                                                                                                   |
| **401** | `UNAUTHORIZED`                                                                                                                                        |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED` |
| **503** | `CONFIGURATION_UNAVAILABLE`, `SERVICE_OVERLOADED`                                                                                                     |

See the meaning of each code in <a href={useBaseUrl('/docs/buy-sell/errors')}>Error Codes</a>.

---

## Integration

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    This integration example uses the <code>Axios</code> library in Node.js.

    **Installing `Axios`:**
    ```bash
    npm install axios
    ```

    **JavaScript example:**
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
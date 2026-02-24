---
sidebar_label: 'Get Crypto Wallet'
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetCryptoWalletTester from '@site/src/components/GetCryptoWalletTester';

# Get Crypto Wallet

This endpoint returns the cryptocurrency wallets associated with a specific customer.

Use this route to obtain the **deposit address** and verify the **network** (e.g., ERC-20, BEP-20).

---
## Endpoint
- **Method:** <span className="badge badge--success">GET</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/crypto/customer/CLIENT_ID/wallet
```

:::warning[Important]
The `CLIENT_ID` field refers to the customer ID. If you haven't created it yet, you can create it from the <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>create customers</a> page.
:::

---

## Test Integration

Use the form below to list a customer's wallets.

<GetCryptoWalletTester />

---

## Request

You must send the **authentication Header** and pass the **Customer ID** in the URL.

#### Required Headers

| Header          | Value                | Description                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained from login. |

#### URL Parameters

| Parameter   | Type     | Required | Description                                     |
| :---------- | :------- | :---------: | :-------------------------------------------- |
| `CLIENT_ID` | `string` |   **Yes**   | The `_id` of the customer you want to consult. |

---

## Responses

### Success (200 OK)

Returns an array with the generated wallet and the network that must be used to receive deposits via cryptocurrencies.

```json
[
  {
    "blockchainNetworks": [
      "Ethereum",
      "ERC-20",
      "BEP-20",
      "Polygon"
    ],
    "publicKey": "0xf898b006511848B7************************"
  }
]
```

:::warning[Important]
Crypto origin deposits do not appear in the Dashboard deposits tab until they are completed (Paid).
:::

:::danger[Risk of Fund Loss and Fraud]
1.  **USDT Only:** XGate processes exclusively **Tether (USDT)** deposits. Sending other cryptocurrencies (such as Bitcoin, native Ethereum, TRX, etc.) will result in **irreversible loss** of the value.
2.  **Correct Network:** The deposit must be made exclusively through one of the networks listed in our API (e.g., `ERC-20`, `BEP-20`, or `Polygon`).
3.  **Fraud Alert ("Flash USDT"):** Beware of scammers who send fake tokens imitating the original USDT. These counterfeit coins appear in the wallet but have no real value and cannot be withdrawn. Always validate that the deposited token is the official Tether token before releasing the balance to your end customer.
:::

### Common Errors

| Status  | Message                | Likely Reason                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing Header.<br /> • IP not allowed. |
| **404** | `Not Found`             | Customer not found.                                                                           |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                          |

---

## How to Use

The information delivered by this route is the **Address (publicKey)** and the **Networks (blockchainNetworks)**. These will be used whenever you or your end customer wishes to make a deposit in **USDT**.

The flow for the end user should be:
1.  The system displays the address (`publicKey`).
2.  The system informs which networks are accepted (`blockchainNetworks`).
3.  The user goes to their exchange or wallet and sends **USDT** using one of the listed networks to the provided address.

### ⚠️ Critical Deposit Rules

To ensure fund security, the developer must display clear warnings on the front-end for the end user:

:::danger[Risk of Fund Loss and Fraud]
1.  **USDT Only:** XGate processes exclusively **Tether (USDT)** deposits. Sending other cryptocurrencies (such as Bitcoin, native Ethereum, TRX, etc.) will result in **irreversible loss** of the value.
2.  **Correct Network:** The deposit must be made exclusively through one of the networks listed in our API (e.g., `ERC-20`, `BEP-20`, or `Polygon`).
3.  **Fraud Alert ("Flash USDT"):** Beware of scammers who send fake tokens imitating the original USDT. These counterfeit coins appear in the wallet but have no real value and cannot be withdrawn. Always validate that the deposited token is the official Tether token before releasing the balance to your end customer.
:::

### Application Example (UX)

When integrating this route, we recommend that your interface displays the information in the following manner:

> **Deposit USDT only**
>
> **Accepted Networks:** Ethereum (ERC-20), Binance Smart Chain (BEP-20), Polygon.
>
> **Deposit Address:**
> `0xf898b006511848B7************************` (Copy Button)

## Integration

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
     This integration example uses the <code>Axios</code> library in Node.js.

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
    const customerId = "************"

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/crypto/customer/${customerId}/wallet`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        console.log(data); // Response
    } catch (error) {
        console.log(error.response.data.message) // Error
    }
})()
    ```
  </TabItem>
</Tabs>
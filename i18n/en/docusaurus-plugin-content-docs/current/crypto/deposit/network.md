---
sidebar_label: 'List Networks'
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ListBlockchainNetworksTester from '@site/src/components/ListBlockchainNetworksTester';

# List Blockchain Networks

This endpoint returns all blockchain networks supported by the platform (e.g., Ethereum, BSC, Polygon).

This listing is **fundamental for cryptocurrency withdrawals** to external wallets. Since USDT exists in several different blockchains, you need to specify which network the transfer should occur on so that the deposit arrives correctly.

---
## Endpoint
- **Method:** <span className="badge badge--success">GET</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/deposit/company/blockchain-networks
```

---

## Test Integration

Use the form below to view the available networks.

<ListBlockchainNetworksTester />

---

## Request

The request does not require a body, only the **authentication Headers**.

#### Required Headers

| Header          | Value                | Description                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained from login. |

---

## Responses

### Success (200 OK)

Returns the list of networks. You will need the **complete object** of the chosen network.

```json
[
  {
    "_id": "672c15919c9877bbeebb2fb7",
    "name": "ERC-20",
    "chainId": "1",
    "cryptocurrencies": [...],
    "chain": "Ethereum",
    "__v": 0
  },
  {
    "_id": "672c18725a3690d041ea4c8c",
    "name": "BEP-20",
    "chainId": "56",
    "cryptocurrencies": [...],
    "chain": "BSC",
    "__v": 0
  }
]
```

### Common Errors

| Status  | Message                | Likely Reason                                                                                  |
| :------ | :---------------------- | :----------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing Header.<br />• IP not allowed. |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                         |

---

## How to Use

To perform a **Crypto Withdrawal** (send USDT from XGate to an external wallet), it is not enough to inform the currency and amount. It is mandatory to inform the **Network (Blockchain Network)**.

### What are these Networks?
Imagine that **USDT** is the cargo (the money) and the **Blockchain Network** is the highway by which that cargo will pass. We work mainly with:

* **Ethereum / ERC-20:** The main Ethereum network. Generally has higher gas fees.
* **BEP-20 (BSC):** The Binance Smart Chain network. Known for lower fees and high speed.
* **Polygon:** A second-layer network (Layer 2) focused on scalability and low cost.

If your customer provides a wallet address on the **Polygon** network, you **must** select the `Polygon` network from this listing. Sending through the wrong network (e.g., sending to a Polygon address using the Ethereum network) can result in transaction failure or unnecessary high costs.

### The Integration Flow

1.  **Check the Networks:** Call this endpoint to get the available options and their IDs.
2.  **Select the Network:** Let your user choose (e.g., "Select the destination network: ERC-20, BEP-20 or Polygon") or select via system based on the wallet address.
3.  **Build the Payload:** Take the **complete object** of the chosen network and insert it into the `blockchainNetwork` field of the withdrawal payload.

### Practical Example

**1. Network object that you received from this listing (e.g., BEP-20):**
```json
{
    "_id": "6733a3a200**************",
    "name": "BEP-20",
    "chainId": "56",
    "cryptocurrencies": [],
    "updatedDate": "202******************",
    "createdDate": "202******************",
    "__v": 0,
    "chain": "BSC",
    "symbol": "BNB"
},
```

**2. How to send it in the Crypto Withdrawal (POST /withdraw):**

Notice how the above object is injected into the `blockchainNetwork` field:

```json {9-19}
{
    "amount": 2,
    "customerId": "6759a16f20***************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT"
    },
    "blockchainNetwork": {
        "_id": "6dd37763a2***************",
        "name": "BEP-20",
        "chainId": "56",
        "cryptocurrencies": [],
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0,
        "chain": "BSC",
        "symbol": "BNB"
    },
    "wallet": "0x7A00e4a***************",
    "externalId": "6dd37763a2***************"
}
```

---

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

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/withdraw/company/blockchain-networks`, {
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
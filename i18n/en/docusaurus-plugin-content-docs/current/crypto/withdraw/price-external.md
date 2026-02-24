---
sidebar_label: 'Quote for External Wallet'
sidebar_position: 6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetTetherToExternalTester from '@site/src/components/GetTetherToExternalTester';

# Quote for External Wallet

This endpoint allows you to calculate in advance how much the client will receive in **USDT** (Tether) when creating a withdrawal request to an external wallet, already deducting the blockchain network gas fees.

---
## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/withdraw/transaction/crypto/amount
```

---

## Test Integration

Use the form below to simulate a withdrawal to an external wallet. The system will automatically fetch the necessary data and calculate how much you would receive in USDT.

<GetTetherToExternalTester />

---

## Request

You need to send the authentication **Header** and the JSON body with the value and currency object.

#### Required Headers

| Header          | Value                | Description                   |
| :-------------- | :------------------- | :---------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained at login. |

#### Body (Request Body)

| Field               | Type     | Required | Description                                                                         |
| :------------------ | :------- | :------: | :---------------------------------------------------------------------------------- |
| `amount`            | `number` | **Yes**  | Amount in USDT (Tether) for which you want to calculate the withdrawal.            |
| `cryptocurrency`    | `object` | **Yes**  | The cryptocurrency object, obtained from the cryptocurrencies listing route.       |
| `blockchainNetwork` | `object` | **Yes**  | The blockchain network object, obtained from the blockchain networks listing.      |

---

## Responses

### Success (200 OK)

Returns the value that approximately will be received at the external wallet. 

```json
{
    "amount": 9.369984879637112
}
```

### Common Errors

| Status  | Message                 | Likely Reason                                                                                     |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing header.<br />• IP not allowed.         |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                                         |

---

## How to Use

This route **does not generate** a payment order, it is only for **consultation**.

### The Recommended Flow (UX)

1.  **Input:** The user types "10" (USDT) in your app/site.
2.  **Consultation:** Your system calls `POST /withdraw/transaction/crypto/amount` sending the value 10, the network object, and the cryptocurrency object.
3.  **Display:** The API returns that this equals `9.369984879637112 USDT`. You display: *"You will receive approximately 9.369984879637112 USDT"*.
4.  **Action:** If the user agrees, you call the **Create Withdrawal Request to External Wallet** route (`POST /withdraw`).

### Practical Example

Follow the steps below to perform a quote for external wallet.

**Step 1:** Enter the USDT amount for the quote:
```json {2}
{
    "amount": 10,
    "blockchainNetwork": {
        "_id": "6733a3a20076c0dd9822b87a",
        "name": "BEP-20",
        "chainId": "56",
        "chain": "BSC",
        "symbol": "BNB"
    },
    "cryptocurrency": {
        "_id": "6733a2a90076c0dd9822b86a",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether"
    }
}
```

**Step 2:** You must fetch and inject the blockchain network object inside `blockchainNetwork`:

```json {3-9}
{
    "amount": 10,
    "blockchainNetwork": {
        "_id": "6733a3a20076c0dd9822b87a",
        "name": "BEP-20",
        "chainId": "56",
        "chain": "BSC",
        "symbol": "BNB"
    },
    "cryptocurrency": {
        "_id": "6733a2a90076c0dd9822b86a",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether"
    }
}
```
You can get the list of blockchain networks <a href={useBaseUrl('/docs/crypto/withdraw/network')} target="_blank">by clicking here</a>.

**Step 3:** You must fetch and inject the cryptocurrency object inside `cryptocurrency`:

```json {10-15}
{
    "amount": 10,
    "blockchainNetwork": {
        "_id": "6733a3a20076c0dd9822b87a",
        "name": "BEP-20",
        "chainId": "56",
        "chain": "BSC",
        "symbol": "BNB"
    },
    "cryptocurrency": {
        "_id": "6733a2a90076c0dd9822b86a",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether"
    }
}
```
You can get the list of cryptocurrencies <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">by clicking here</a>.

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
  const email = "email@domain.com";
  const password = "••••••";
  const amount = 10;

  try {
    const url_api = "https://api.xgateglobal.com"
            
    // 1. Login
    const login = await axios.post(`${url_api}/auth/token`, { email, password });
    const config = {
      headers: { "Authorization": `Bearer ${login.data.token}` }
    };

    // 2. Fetch Networks and Cryptocurrencies
    const blockchains = await axios.get(`${url_api}/withdraw/company/blockchain-networks`, config);
            
    // Selects the first available network (Ex: BEP-20)
    const selectedNetwork = blockchains.data[0];

    // Searches specifically for the USDT object within the network's crypto list
    const usdtObject = selectedNetwork.cryptocurrencies.find(
      item => item.cryptocurrency.symbol === 'USDT'
    );

    if (!usdtObject) {
      throw new Error(`USDT not found in ${selectedNetwork.name} network`);
    }

    // 3. Calculate Quote
    const { data } = await axios.post(`${url_api}/withdraw/transaction/crypto/amount`, {
      amount,
      cryptocurrency: usdtObject.cryptocurrency,
      blockchainNetwork: selectedNetwork
    }, config);

    console.log("Quote Received:", data); 
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
  }
})()
```
  </TabItem>
</Tabs>
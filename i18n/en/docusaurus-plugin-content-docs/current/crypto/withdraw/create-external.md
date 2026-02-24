---
sidebar_label: 'Create External Withdrawal'
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import WithdrawCryptoToWalletTester from '@site/src/components/WithdrawCryptoToWalletTester';

# Create External Withdrawal Request

This endpoint allows the customer to withdraw cryptocurrencies to an external wallet.

---
## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/withdraw
```

---

## Test Integration

Use the form below to simulate the creation of a crypto withdrawal request to an external wallet.

<WithdrawCryptoToWalletTester />

---

## Request

You must send the **authentication Header** and the **Body** with the order data.

#### Required Headers

| Header          | Value                | Description                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained from login. |

#### Body (Request Body)

| Field               | Type     | Required | Description                                       |
| :------------------ | :------- | :---------: | :---------------------------------------------- |
| `amount`            | `number` |   **Yes**   | The withdrawal amount in USDT (e.g., `0.1` min).       |
| `customerId`        | `string` |   **Yes**   | The unique ID (`_id`) of the customer making the withdrawal. |
| `cryptocurrency`    | `object` |   **Yes**   | The cryptocurrency of the transaction (e.g., `USDT`).        |
| `blockchainNetwork` | `object` |   **Yes**   | Information about the blockchain network.            |
| `wallet`            | `string` |   **Yes**   | The wallet to which the values will be sent. |
| `externalId`        | `string` |   **No**   | Idempotency.                                   |

---

## Responses

### Success (201 Created)

Returns the created order object, containing information about the `status` and the `_id` of the transaction.

```json
{
  "message": "Solicitação de Saque realizada com sucesso",
  "status": "PENDING",
  "_id": "69849e8c50****************"
}
```

### Common Errors

| Status  | Message                | Likely Reason                                                                                  |
| :------ | :---------------------- | :----------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing Header.<br />• IP not allowed. |
| **404** | `Not Found`             | Customer informed in the `customerId` field does not exist.                                              |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                         |

---

## How to Use

The purpose of this endpoint is to initiate the money outflow flow with Crypto to BRL conversion (**Cash-out**).

### The Integration Flow

1.  **Identify the Customer:** Make sure the user exists in XGate (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>) and have their `_id`.
2.  **Cryptocurrency Data:** You will need to fetch cryptocurrency data to add to the request. You can obtain it from <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">Cryptocurrencies</a>.
3.  **Network Data:** You will need to fetch the network data, you can obtain it from <a href={useBaseUrl('/docs/crypto/withdraw/network')} target="_blank">Blockchain Networks</a>.
4.  **Destination:** Add the public key of the wallet that will receive the withdrawal to the external wallet.
5.  **Send the request:** Send the request to XGate. The approval time may vary depending on the network.

### Practical Example

To create withdrawal requests to external wallets, you must follow these 4 steps:

:::tip[Recommendation]
It is necessary to create a customer before proceeding with the withdrawal creation.

You can be **<a href={useBaseUrl('/docs/customer/create')} target="_blank">clicking here</a>** to go to the customer creation documentation page.
:::
>
**Step 1:** Enter the amount in USDT in `amount` and the customer's `_id` as `customerId`, just like in the highlighted fields:
```json {2-3}
{
    "amount": 2,
    "customerId": "672f40**************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0
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

**Step 2:** You must obtain the cryptocurrency with the data for the withdrawal.

You can obtain the list of them <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">by clicking here</a>.

```json {4-12}
{
    "amount": 2,
    "customerId": "672f40**************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0
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

:::tip[Cryptocurrency]
The `cryptocurrency` data can also be retrieved from the response coming from the blockchain network listing. The integration example in **Node.Js** shows how it works.
:::

#### Object Details

See the details of each information in the `cryptocurrency` object to build your request.

| Field         | Type     | Required | Description                                                  |
| :------------ | :------- | :---------: | :--------------------------------------------------------- |
| `_id`         | `string` |   **Yes**   | Unique identifier of the cryptocurrency.                        |
| `name`        | `string` |   **Yes**   | Name of the cryptocurrency.                                       |
| `symbol`      | `string` |   **Yes**   | Symbol of the cryptocurrency.                                    |
| `coinGecko`   | `string` |   **No**   | Cryptocurrency identifier on CoinGecko.                 |
| `updatedDate` | `string` |   **No**   | Date of last update of cryptocurrency information. |
| `createdDate` | `string` |   **No**   | Date when the cryptocurrency was created in the system.           |
| `__v`         | `number` |   **No**   | Version of the cryptocurrency record in the database.       |

**Step 3:** You must obtain the blockchain network data.

You can obtain the list of them <a href={useBaseUrl('/docs/crypto/withdraw/network')} target="_blank">by clicking here</a>.

```json {13-23}
{
    "amount": 2,
    "customerId": "672f40**************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0
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

:::warning[Recommendation]
If your integration uses a fixed network for all withdrawal operations, we recommend sending the required values via **hard-code**. This optimizes your application's performance, avoiding repetitive calls to the network listing endpoint, which has a high data volume.
:::

#### Object Details

See the details of each information in the `blockchainNetwork` object to build your request.

| Field              | Type     | Required | Description                                               |
| :----------------- | :------- | :---------: | :------------------------------------------------------ |
| `_id`              | `string` |   **Yes**   | Unique identifier of the blockchain network in the system.      |
| `name`             | `string` |   **Yes**   | Technical name of the network standard (e.g., BEP-20, ERC-20).    |
| `chainId`          | `string` |   **Yes**   | Numeric ID of the network (e.g., 56 for BSC, 1 for Ethereum). |
| `cryptocurrencies` | `array`  |   **No**   | List of IDs of cryptocurrencies supported on this network.    |
| `updatedDate`      | `string` |   **No**   | Date of last update of network parameters.      |
| `createdDate`      | `string` |   **No**   | Date of creation of the network record in the system.         |
| `__v`              | `number` |   **No**   | Internal version of the record in the database.           |
| `chain`            | `string` |   **Yes**   | Simplified name of the blockchain (e.g., BSC, ETH).         |
| `symbol`           | `string` |   **Yes**   | Symbol of the native currency of the network (e.g., BNB, ETH).         |

**Step 4:** You must obtain the public key of the wallet where the withdrawal values will be sent.

```json {24}
{
    "amount": 2,
    "customerId": "672f40**************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0
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

**Step 5 (Optional):** Add the `externalId` at the end of the code. It will prevent the client from sending the withdrawal request more than once, **avoiding duplication**.
```json {27}
{
    "amount": 2,
    "customerId": "672f40**************",
    "currency": {
        "_id": "6722ba**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "202*********************",
        "updatedDate": "202*********************",
        "__v": 0,
        "symbol": "R$"
    },
    "cryptocurrency": {
        "_id": "67ce09d**************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "usdt",
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0
    },
    "pixKey": {
        "key": "123**************",
        "type": "CPF",
        "_id": "152535**************"
    },
    "externalId": "67ce09d**************"
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
    const amount = 10.90;
    const wallet = "0x*****************";
    const customerId = "**************";

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const blockchains = await axios.get(`${url_api}//withdraw/company/blockchain-networks`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/withdraw`, {
            amount,
            wallet,
            customerId,
            cryptocurrency: blockchains.data[0].cryptocurrencies[1].cryptocurrency, // USDT
            blockchainNetwork: blockchains.data[0], // BEP-20
        }, {
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
---
sidebar_label: 'Create Withdrawal for FIAT'
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import WithdrawFiatToCryptoTester from '@site/src/components/CreateWithdrawConversion';

# Create Withdrawal Order (Crypto → FIAT)

This endpoint allows the client to redeem their digital assets with **automatic conversion to fiat currency**. In practice, the system processes the sale of cryptocurrency (e.g., USDT) and makes the equivalent payment in BRL directly via **Pix** to the registered key.

---
## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/withdraw
```

---

## Test Integration

Use the form below to simulate the creation of a Crypto to FIAT conversion order.

<WithdrawFiatToCryptoTester />

---

## Request

You need to send the authentication **Header** and the **Body** with the order data.

#### Required Headers

| Header          | Value                | Description                   |
| :-------------- | :------------------- | :---------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained at login. |

#### Body (Request Body)

| Field            | Type     | Required | Description                                            |
| :--------------- | :------- | :------: | :------------------------------------------------------ |
| `amount`         | `number` | **Yes**  | The withdrawal amount in USDT (e.g., `0.1` min).       |
| `customerId`     | `string` | **Yes**  | The unique ID (`_id`) of the client making withdrawal. |
| `currency`       | `object` | **Yes**  | The transaction currency (e.g., `BRL`).                |
| `cryptocurrency` | `object` | **Yes**  | The transaction cryptocurrency (e.g., `USDT`).         |
| `pixKey`         | `object` | **Yes**  | The client's Pix key for withdrawal.                    |
| `externalId`     | `string` | **No**   | Idempotency.                                           |

---

## Responses

### Success (201 Created)

Returns the created order object, containing `status` information and the transaction `_id`.

```json
{
  "message": "Solicitação de Saque realizada com sucesso",
  "status": "PENDING",
  "_id": "69849e8c50****************"
}
```

### Common Errors

| Status  | Message                 | Likely Reason                                                                                    |
| :------ | :---------------------- | :----------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing header.<br />• IP not allowed.            |
| **404** | `Not Found`             | The client informed in the `customerId` field does not exist.                                   |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                                        |

---

## How to Use

The purpose of this endpoint is to initiate the cash-out flow with Crypto to BRL conversion (**Cash-out**).

### The Integration Flow

1.  **Identify the Customer:** Make sure the user exists in XGate (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>) and have their `_id`.
2.  **Register a Pix Key:** After creating the customer, you need to register a Pix key for them at <a href={useBaseUrl('/docs/fiat/pix/add')} target="_blank">Add Pix Key</a>.
3.  **Currency Data:** You'll need to fetch the currency and cryptocurrency data to add to the request. You can get them at <a href={useBaseUrl('/docs/fiat/withdraw/currency')} target="_blank">FIAT Currencies</a> and <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">Cryptocurrencies</a>.
4.  **Create the Order:** Call this endpoint sending the amount, customerId, currency, cryptocurrency, and pixKey data.
5.  **Wait for Payment:** The initial status will be `PENDING`.

### Practical Example

To create withdrawal orders converting Crypto to BRL, you should follow these 5 steps:

:::tip[Recommendation]
You need to create a customer before proceeding to create a withdrawal.

You can **<a href={useBaseUrl('/docs/customer/create')} target="_blank">click here</a>** to go to the customer creation documentation page.
:::
>
**Step 1:** Pass the value in USDT in the `amount` field and the customer's `_id` as `customerId`, as highlighted in the fields:
```json {2-3}
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

**Step 2:** You must obtain the fiat currency with the withdrawal data. 

You can get the list <a href={useBaseUrl('/docs/fiat/withdraw/currency')} target="_blank">by clicking here</a>.

```json {4-12}
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

#### Object Details

See the details of each information in the `currency` object to build your request.

| Field         | Type     | Required | Description                                              |
| :------------ | :------- | :------: | :------------------------------------------------------- |
| `_id`         | `string` | **Yes**  | Unique identifier of the currency.                       |
| `name`        | `string` | **Yes**  | Name of the currency.                                    |
| `type`        | `string` | **Yes**  | Type of payment method or transaction associated with the currency. |
| `createdDate` | `string` | **No**   | Date the currency was created in the system.             |
| `updatedDate` | `string` | **No**   | Date of last update of currency information.             |
| `__v`         | `number` | **No**   | Version of the currency record in the database.           |
| `symbol`      | `string` | **Yes**  | Symbol of the currency.                                  |

**Step 3:** You must obtain the cryptocurrency to perform the withdrawal conversion. 

You can get the list <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">by clicking here</a>.

```json {13-21}
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

#### Object Details

See the details of each information in the `cryptocurrency` object to build your request.

| Field         | Type     | Required | Description                                           |
| :------------ | :------- | :------: | :----------------------------------------------------- |
| `_id`         | `string` | **Yes**  | Unique identifier of the cryptocurrency.              |
| `name`        | `string` | **Yes**  | Name of the cryptocurrency.                           |
| `symbol`      | `string` | **Yes**  | Symbol of the cryptocurrency.                         |
| `coinGecko`   | `string` | **No**   | Cryptocurrency identifier on CoinGecko.               |
| `updatedDate` | `string` | **No**   | Date of last update of cryptocurrency information.    |
| `createdDate` | `string` | **No**   | Date the cryptocurrency was created in the system.    |
| `__v`         | `number` | **No**   | Version of the cryptocurrency record in the database. |

**Step 4:** You must get the Pix key data and inform it in the payload for the withdrawal to be processed. 

You can get the list of registered Pix keys <a href={useBaseUrl('/docs/fiat/pix/keys')} target="_blank">by clicking here</a> or <a href={useBaseUrl('/docs/fiat/pix/add')} target="_blank">add a new Pix key</a>.

```json {22-26}
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

**Step 5 (Optional):** Add the `externalId` at the end of the code. It will prevent the customer from submitting the withdrawal request more than once, **avoiding duplicates**.
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
    const customerId = "************";
    const amount = 10.90;

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const cryptocurrencies = await axios.get(`${url_api}/withdraw/company/cryptocurrencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const currencies = await axios.get(`${url_api}/withdraw/company/currencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const pixKey = await axios.get(`${url_api}/pix/customer/${customerId}/key`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/withdraw/conversion/brl/pix`, {
            amount,
            customerId,
            currency: currencies.data[0],
            cryptocurrency: cryptocurrencies.data[0],
            pixKey: pixKey.data[0]
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
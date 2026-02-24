---
sidebar_label: 'Cryptocurrencies'
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ListCryptoCurrenciesTester from '@site/src/components/ListCryptoCurrenciesTester';

# List Cryptocurrencies

This endpoint returns all available cryptocurrencies for your account. Use this route to query the necessary data to create withdrawal order requests.

---
## Endpoint
- **Method:** <span className="badge badge--success">GET</span>
```bash title="Endpoint URL"
https://api.xgateglobal.com/withdraw/company/cryptocurrencies
```

---

## Test Integration

Use the form below to simulate listing cryptocurrencies.

<ListCryptoCurrenciesTester />

---

## Request

The request does not require a body, only authentication **Headers**.

#### Required Headers

| Header          | Value                | Description                   |
| :-------------- | :------------------- | :---------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained at login. |

---

## Responses

### Success (200 OK)

Returns a list (array) of objects, where each object is a cryptocurrency.

```json
[
  {
    "_id": "6733a2a90******************",
    "name": "USDT",
    "symbol": "USDT",
    "coinGecko": "tether",
    "updatedDate": "202******************",
    "createdDate": "202******************",
    "__v": 0
  }
]
```

### Common Errors

| Status  | Message                 | Likely Reason                                                                                      |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing header.<br /> • IP not allowed.           |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                                          |

---

## How to Use

The main purpose of listing cryptocurrencies is to allow selection of the correct cryptocurrency to create a withdrawal order (**Withdraw Order**).

The response from this endpoint provides the **Complete Object** of the cryptocurrency, enabling the construction of the order creation payload.

### The Integration Flow

1.  **List cryptocurrencies:** Call this endpoint (`GET /withdraw/company/cryptocurrencies`).
2.  **Selection:** Identify the desired cryptocurrency in the list (usually by filtering by `name` or `symbol`, e.g., "USDT").
3.  **Sending:** You must pass the **object** within the `cryptocurrency` property in the order creation payload. In the documentation for <a href={useBaseUrl('/docs/crypto/withdraw/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>creating crypto withdrawal</a> the **required** values are shown.

### Practical Example

**1. What you receive when listing cryptocurrencies:**
```json
[
  {
    "_id": "67339b18ca5******************",
    "name": "USDT",
    "symbol": "USDT",
    "coinGecko": "tether",
    "updatedDate": "2024-1****************",
    "createdDate": "2024-1*****************",
    "__v": 0
  }
]
```

**2. How you should send in the withdrawal (POST /withdraw):**

You will take the object above and inject it into `cryptocurrency`:
```json {13-21}
{
    "amount": 2,
    "customerId": "123456**************",
    "currency": {
        "_id": "10203040**************",
        "name": "BRL",
        "type": "PIX",
        "symbol": "R$",
        "createdDate": "202*********************",
        "updatedDate": "202*********************",
        "__v": 0
    },
    "cryptocurrency": {
        "_id": "100200300**************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0
    },
    "pixKey": {
        "key": "123**************",
        "type": "CPF",
        "_id": "152535**************"
    },
    "externalId": "123**************"
}
```
Each piece of information in this JSON will be explained at the <a href={useBaseUrl('/docs/crypto/withdraw/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>page for creating crypto withdrawal to FIAT</a>.

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
---
sidebar_label: 'Cryptocurrencies'
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ListCryptoCurrenciesTester from '@site/src/components/ListCryptoCurrenciesTester';

# List Cryptocurrencies

This endpoint returns all cryptocurrencies available for your account. Use this route to consult the necessary data to create deposit order requests.

---
## Endpoint
- **Method:** <span className="badge badge--success">GET</span>
```bash title="Endpoint URL"
https://api.xgateglobal.com/deposit/company/cryptocurrencies
```

---

## Test Integration

Use the form below to simulate the list of cryptocurrencies.

<ListCryptoCurrenciesTester />

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

Returns a list (array) of objects, where each object is a cryptocurrency.

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

### Common Errors

| Status  | Message                | Likely Reason                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing Header.<br /> • IP not allowed. |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                          |

---

## How to Use

The main purpose of listing cryptocurrencies is to allow the selection of the correct cryptocurrency to create a deposit order (**Deposit Order**).

The response from this endpoint provides the **Complete Object** of the cryptocurrency, allowing the construction of the order creation payload.

### The Integration Flow

1.  **List the currencies:** Call this endpoint (`GET /deposit/company/cryptocurrencies`).
2.  **Selection:** Identify the desired cryptocurrency in the list (usually by filtering by `name` or `symbol`, e.g., "USDT").
3.  **Submission:** You must pass the **object** within the `cryptocurrency` property in the deposit order creation payload. In the <a href={useBaseUrl('/docs/crypto/deposit/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>cryptocurrency deposit creation</a> documentation, the **required** values are shown.

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

**2. How you should send it in the deposit (POST /deposit):**

You will take the above object and inject it within `cryptocurrency`:
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
  "externalId": "67ce09d**************"
}
```
Each piece of this JSON will be explained on the <a href={useBaseUrl('/docs/crypto/deposit/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>cryptocurrency deposit order creation</a> page.

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
        const { data } = await axios.get(`${url_api}/deposit/company/cryptocurrencies`, {
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
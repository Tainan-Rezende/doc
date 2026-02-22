---
sidebar_label: 'Fiat Currencies'
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ListWithdrawCurrenciesTester from '@site/src/components/ListWithdrawCurrenciesTester';

# List Fiat Currencies

This endpoint returns all fiat currencies available for your account. Use this route to query currencies and build the withdraw order request.

---
## Endpoint
 - **Method:** <span className="badge badge--success">GET</span>
```bash title="Endpoint URL"
https://api.xgateglobal.com/withdraw/company/currencies
```

---

## Test Integration

Use the form below to simulate listing fiat currencies.

<ListWithdrawCurrenciesTester />

---

## Request

The request does not require a body (`body`); only authentication **Headers**.

#### Required Headers

| Header          | Value                | Description                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained at login. |

---

## Responses

### Success (200 OK)

Returns a list (array) of objects, where each object is a currency.

```json
[
  {
    "key": "+5512************",
    "type": "PHONE",
    "_id": "68fa5d54004*************"
  }
]
```

### Common Errors

| Status  | Message                | Likely Cause                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing header.<br /> • IP not allowed. |
| **404** | `Not Found`             | Customer not found.                                                                           |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                          |

---

## How to use

The main purpose of listing fiat currencies is to allow selection of the correct currency when creating a withdraw order (**Withdraw Order**).

The response from this endpoint provides the **Full Object** of the currency, which is required when building the create order payload.

### Integration Flow

1.  **List the currencies:** Call this endpoint (`GET /withdraw/company/currencies`).
2.  **Select:** Identify the desired currency in the list (typically by `name` or `symbol`, e.g., "BRL").
3.  **Submit:** Pass the **object** within the `currency` property in the create order payload — required fields are shown in the <a href={useBaseUrl('/docs/fiat/withdraw/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>create withdraw</a> documentation.

### Practical Example

**1. What you receive when listing fiat currencies:**
```json
[
  {
    "_id": "6728f0a2cba**************",
    "name": "BRL",
    "type": "PIX",
    "createdDate": "2024-1**************Z",
    "updatedDate": "2024-1**************",
    "__v": 0,
    "symbol": "R$"
  }
]
```

**2. How you should send it in the withdraw (POST /withdraw):**

You will take the object above and inject it inside `currency`:
```json {4-12}
{
    "amount": 0.2,
    "customerId": "68e7b8****************",
    "currency": {
        "_id": "6728f0a2cba**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-1**************Z",
        "updatedDate": "2024-1**************",
        "__v": 0,
        "symbol": "R$"
    },
    "pixKey": {
        "key": "+5512************",
        "type": "PHONE",
        "_id": "68fa5d54004*************"
    }
}
```
Each field in this JSON is explained on the <a href={useBaseUrl('/docs/fiat/withdraw/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>create withdraw order</a> page.

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
    const url_api = "https://api.xgateglobal.com"
    const login = await axios.post(`${url_api}/auth/token`, { email, password });
    const { data } = await axios.get(`${url_api}/withdraw/company/currencies`, {
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
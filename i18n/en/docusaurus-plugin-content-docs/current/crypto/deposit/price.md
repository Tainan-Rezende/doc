---
sidebar_label: 'Fiat to USDT Quote'
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetTetherConversionTester from '@site/src/components/GetTetherConversionTester';

# Fiat to USDT Quote

This endpoint allows you to calculate in advance how much the customer will receive in **USDT** (Tether) when depositing a specific amount in fiat currency (BRL).

Use this route to display a "preview" or real-time quote on your user's screen before they confirm the generation of the deposit order.

---
## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/deposit/conversion/tether
```

---

## Test Integration

Use the form below to simulate a conversion. The system will automatically fetch BRL currency data and calculate how much it would yield in USDT.

<GetTetherConversionTester />

---

## Request

You must send the **authentication Header** and the JSON body with the amount and currency object.

#### Required Headers

| Header          | Value                | Description                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained from login. |

#### Body (Request Body)

| Field      | Type     | Required | Description |
| :--------- | :------- | :---------: | :-------- |
| `amount`   | `number` | **Yes** | Amount in Reais (BRL) that you want to convert. |
| `currency` | `object` | **Yes** | The Fiat currency object (BRL), obtained from the currency listing route. |

---

## Responses

### Success (200 OK)

Returns the converted value, the crypto acronym, and the exchange rate used at that moment.

```json
{
  "amount": 0.186433,
  "crypto": "USDT",
  "fiatToCryptoExchangeRate": "R$ 5.364"
}
```

### Common Errors

| Status  | Message                | Likely Reason                                                                                  |
| :------ | :---------------------- | :----------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing Header.<br />• IP not allowed. |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                         |

---

## How to Use

This route **does not generate** a payment order, it serves only for **consultation**.

### The Recommended Flow (UX)

1.  **Input:** The user types "R$ 100.00" in your app/site.
2.  **Query:** Your system calls `POST /deposit/conversion/tether` sending the amount 100 and the BRL currency object.
3.  **Display:** The API returns that this equals `18.64 USDT`. You display: *"You will receive approximately 18.64 USDT"*.
4.  **Action:** If the user agrees, then you call the **Create Deposit Order** route (`POST /deposit`).

### Practical Example

Follow the steps below to perform the quote

**Step 1:** Insert the BRL amount for the quote:
```json {2}
{
  "amount": 100,
  "currency": {
    "_id": "6728cba3******************",
    "name": "BRL",
    "type": "PIX",
    "createdDate": "2024-11-04T16:04:50.019Z",
    "updatedDate": "2024-11-07T02:23:38.606Z",
    "__v": 0,
    "symbol": "R$"
  }
}
```

**Step 2:** You must fetch and inject the currency object within `currency`:

```json {3-11}
{
  "amount": 100,
  "currency": {
    "_id": "6728cba3******************",
    "name": "BRL",
    "type": "PIX",
    "createdDate": "2024-11-04T16:04:50.019Z",
    "updatedDate": "2024-11-07T02:23:38.606Z",
    "__v": 0,
    "symbol": "R$"
  }
}
```
You can obtain the list of currencies <a href={useBaseUrl('/docs/fiat/deposit/currency')} target="_blank">by clicking here</a>.

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

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const currencies = await axios.get(`${url_api}/deposit/company/currencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/deposit/conversion/tether`, {
            amount,
            currency: currencies.data[0]
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
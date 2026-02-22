---
sidebar_label: 'Create Withdrawal'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CreatePixWithdrawTester from '@site/src/components/CreatePixWithdrawTester';

# Create Withdrawal Order

This endpoint creates a withdrawal order for a specific customer. When an order is created, the system processes the transfer of funds to the provided destination Pix key.

Every order must be associated with a user. This ensures the amount is debited from the correct balance on your platform, while providing **transaction security** and maintaining an **organized history** of all cash-outs.

---
## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/withdraw
```

---

## Test Integration

Use the form below to simulate creating a withdrawal order.

<CreatePixWithdrawTester />

---

## Request

You must send the authentication **Header** and the request **Body** with the order data.

#### Required Headers

| Header          | Value                 | Description                      |
| :-------------- | :-------------------- | :------------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained at login. |

#### Body (Request Body)

| Field        | Type     | Required | Description                                               |
| :----------- | :------- | :------: | :-------------------------------------------------------- |
| `amount`     | `number` | **Yes**  | The withdrawal amount (e.g., `100.50`).                   |
| `customerId` | `string` |  **No**  | The unique customer ID (`_id`) associated with the order. |
| `currency`   | `string` | **Yes**  | The transaction currency (e.g., `BRL`).                   |
| `externalId` | `string` |  **No**  | Idempotency key                                           |

:::warning[Important]
We recommend including the `externalId` in the request as it prevents duplicate submissions of the same order, which can occur accidentally.
:::

---

## Responses

### Success (201 Created)

Returns the created order object, containing the transaction `_id` and the order `status`.

```json
{
    "message": "Solicitação de Saque realizada com sucesso",
    "status": "PENDING",
    "_id": "696ee03f66d708604799f67f"
}
```

### Common Errors

| Status  | Message                 | Likely Reason                                                                                         |
| :------ | :---------------------- | :---------------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Missing or malformed Authorization header.<br />• IP not allowed. |
| **404** | `Not Found`             | The `customerId` provided does not exist.                                                             |
| **500** | `Internal Server Error` | Server internal error. Contact support.                                                               |

---

## Usage

This endpoint is intended for cash-outs (withdrawals), transferring funds from your account to the customer's destination Pix key.

Unlike deposits, this action is passive for the user: they only wait to receive the funds in their bank account.

### Integration Flow

1. **Prepare the Data:** Before calling this endpoint, you should have already retrieved the full Pix Key object for the customer and the Currency object (as explained in previous steps).
2. **Request the Withdrawal:** Call this endpoint with the amount, the customer ID, and the currency and pixKey objects.
3. **Confirmation:** The API will return the transaction status (e.g., `PENDING` or `PAID`).
4. **Finalization:** The system processes the bank transfer. Update the customer's balance on your platform once the status confirms success.

:::info[Balance Validation]
Ensure your XGate account has sufficient available balance to cover the withdrawal amount; otherwise the request may return an insufficient funds error.
:::

### Practical Example

To create Pix withdrawal orders, you need three pieces of data:

**1. Data:** You must have the **customer ID**, which is returned when creating a customer (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>).

```json {3}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-1**************",
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

**2. Data:** Obtain the fiat currency for the withdrawal.

You can get the list of currencies <a href={useBaseUrl('/docs/fiat/withdraw/currency')} target="_blank">here</a>.

```json {4-12}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-1**************",
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

#### Object Details

See the details of each property in the `currency` object to build your request.

| Field         | Type     | Required | Description                                                         |
| :------------ | :------- | :------: | :------------------------------------------------------------------ |
| `_id`         | `string` | **Yes**  | Unique identifier of the currency.                                  |
| `name`        | `string` | **Yes**  | Currency name.                                                      |
| `type`        | `string` | **Yes**  | Type of payment method or transaction associated with the currency. |
| `createdDate` | `string` |  **No**  | Date when the currency was added to the system.                     |
| `updatedDate` | `string` |  **No**  | Date of the last update to the currency information.                |
| `__v`         | `number` |  **No**  | Version of the currency record in the database.                     |
| `symbol`      | `number` | **Yes**  | Currency symbol.                                                    |

**3. Data:** Obtain the customer's Pix keys list and select one to include in the request.

You can get the list of keys <a href={useBaseUrl('/docs/pix/keys')} target="_blank">here</a>.

```json {13-17}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-1**************",
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
    const customerId = "*************";
    const amount = 10.90;
    const key = "***********";
    const type = "CPF"

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const currencies = await axios.get(`${url_api}/withdraw/company/currencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const pixKeys = await axios.get(`${url_api}/pix/customer/${customerId}/key`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/withdraw`, {
            amount,
            customerId,
            currency: currencies.data[0],
            pixKey: pixKeys.data[0]
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
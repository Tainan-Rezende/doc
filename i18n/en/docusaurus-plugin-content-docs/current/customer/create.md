---
sidebar_label: 'Create Customer'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CreateCustomerTester from '@site/src/components/CreateCustomerTester';

# Create Customer

This endpoint creates a new customer record in the XGate database.

Creating a customer is the first step in the integration, as it returns the **Customer ID** (`_id`), which is required for:
1.  Registering Pix keys.
2.  Generating collection QR Codes.
3.  Performing Withdrawals.

---

## Endpoint
- **Method:** <span className="badge badge--info">POST</span>
```bash title="Endpoint URL"
https://api.xgateglobal.com/customer
```

---


## Integration Test


Simulate creating a customer now. The result will show the generated `_id`.

<CreateCustomerTester />

---

## Request

### Required Headers

| Header          | Value                | Description                |
| :-------------- | :------------------- | :------------------------- |
| `Authorization` | `Bearer <your_token>` | JWT authentication token. |

### Request Body

| Field      | Type     | Required | Description                            |
| :--------- | :------- | :------- | :------------------------------------- |
| `name`     | `string` | Yes      | Customer full name.                    |
| `document` | `string` | Yes      | CPF or CNPJ (numbers only).            |
| `email`    | `string` | No       | Customer email for notifications.      |
| `phone`    | `string` | No       | Customer phone number.                 |

---

## Responses

### Success (201 Created)

The customer was created successfully and is available for use.

```json
{
  "message": "Novo cliente criado com sucesso",
  "customer": {
    "_id": "696d1f3331117************",
    "name": "Name Client",
    "email": "email@domail",
    "document": "123***********"
  }
}
```

### Customer Already Registered (200 OK)

A customer with the same name and/or document already exists. When the server returns this response, it includes the existing customer's `_id`.

```json
{
    "message": "Cliente já está cadastrado na base de dados",
    "customer": {
        "_id": "68e7b8f0dbed************"
    }
}
```

### Common Errors

| Status  | Message                | Likely Reason                                                                                                                                            |
| :------ | :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `Bad Request`          | Customer name and/or document is required.                                                                                                               |
| **401** | `Unauthorized`         | • Invalid or expired token.<br /> • Missing or invalid header.<br /> • IP not allowed.<br />• You are not authorized to perform this action. |
| **409** | `Conflict`             | • The provided name is already registered.<br />• The provided document is already registered.                                                          |
| **500** | `Internal Server Error`| Internal server error. Contact support.                                                                                                                   |

---

## How to use

The **Customer ID** (`_id`) is the unique identifier that links the user to all financial and management operations within the platform.

You will need this ID for:
1. **Transactions:** Identify source/destination in Deposits and Withdrawals.
2. **Pix Keys:** Create, list, or remove keys linked to the customer.
3. **Management:** Update the customer's registration data.

### Integration Flow

1. **Generate token:** Obtain a token at the <a href={useBaseUrl('/docs/authentication/login')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>authentication route</a> (POST /auth/token) to be authorized to create customers.
2. **Create the customer:** Send the request payload to the route (POST /customer) providing the `name` and `document` fields.

### Practical Example

To credit funds (Deposit), include the customer ID in the `customerId` field of the payload.

**1. What you receive when creating the customer:**
```json {4}
{
  "message": "Novo cliente criado com sucesso",
  "customer": {
    "_id": "696d1f3331117************",
    "name": "Name Client",
    "email": "email@domail",
    "document": "123***********"
  }
}
```
**2. How to use the Deposit route (POST /deposit):**
```json {3}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-11-04T16:04:50.019Z",
        "updatedDate": "2024-11-07T02:23:38.606Z",
        "__v": 0,
        "symbol": "R$"
    }
}
```
The customer ID is passed as `customerId` to create a deposit request.

:::warning[Integration Tip]
Always store the customer's `_id` immediately after creation. You will use it in **100%** of future calls related to this user.
:::

---

## Integration

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
  The integration example uses the <code>Axios</code> library in Node.js.

  **Installing `Axios`:**
  ```bash
  npm install axios
  ```

  **JavaScript example:**
  ```js
const axios = require("axios");

(async () => {
  const email = "your_email@domain.com";
  const password = "**********";
  const customer = {
    name: "Name client",
    phone: "119*******",
    email: "your_email@domain.com",
    document: "000000*******"
  }

  try {
    const url_api = "https://api.xgateglobal.com"
    const login = await axios.post(`${url_api}/auth/token`, { email, password });
    const { data } = await axios.post(`${url_api}/customer`, customer, {
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
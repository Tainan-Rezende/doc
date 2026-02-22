---
sidebar_label: 'Update'
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CreateCustomerTester from '@site/src/components/CreateCustomerTester';

# Update Customer

This endpoint allows updating the customer record in the XGate database.

---

## Endpoint
- **Method:** <span className="badge badge--info">PUT</span>
```bash title="Endpoint URL"
https://api.xgateglobal.com/customer/CUSTOMER_ID
```

:::warning[Important]
The **CUSTOMER_ID** value refers to the `_id` returned when creating a customer.
:::

---

## Integration Test

Simulate updating a customer now.

<CreateCustomerTester />

---

## Request

### Required Headers

| Header          | Value                 | Description               |
| :-------------- | :-------------------- | :------------------------ |
| `Authorization` | `Bearer <your_token>` | JWT authentication token. |

### Request Body

| Field      | Type     | Required | Description                       |
| :--------- | :------- | :------- | :-------------------------------- |
| `name`     | `string` | Yes      | Customer full name.               |
| `document` | `string` | Yes      | CPF or CNPJ (numbers only).       |
| `email`    | `string` | No       | Customer email for notifications. |
| `phone`    | `string` | No       | Customer phone number.            |

---

## Responses

### Success (200 OK)

Customer data was updated successfully.

```json
{
    "message":"Cliente alterado com sucesso"
}
```

### Common Errors

| Status  | Message                 | Likely Reason                                                                                                                                |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `Bad Request`           | Customer name and/or document is required.                                                                                                   |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Missing or invalid header.<br /> • IP not allowed.<br />• You are not authorized to perform this action. |
| **409** | `Conflict`              | • The provided name is already registered.<br />• The provided document is already registered.                                               |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                                                                                      |

---

## How to use

The customer update route is a data-modification endpoint. It allows changing the registration information of a user that already exists in your XGate database.

### Common Use Cases

Use this endpoint primarily for user account maintenance scenarios:

1. **Data Correction:** Fix typos in `name` or correct the `document` (CPF/CNPJ) if the user provided it incorrectly during registration.
2. **Contact Update:** Modify the customer's `email` or `phone` strictly for notification and communication purposes, keeping administrative contact data up to date.
3. **Profile Synchronization:** Ensure that whenever the customer updates profile data in your app or site, the change is reflected automatically in the XGate ecosystem.

### Practical Example

The primary purpose of this route is to apply changes and confirm the success of the operation without returning large volumes of data. By requesting the update with the customer's `_id` in the URL and sending the new information in the body, the API will process the change and return a simple confirmation.

**1. What you receive when updating the customer successfully:**
```json
{
    "message":"Cliente alterado com sucesso"
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

    **JavaScript example:**
```js
const axios = require("axios");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";
    const customerId = "***********";
    const customer = {
        name: "Name client",
        phone: "119*******",
        email: "your_email@domain.com",
        document: "000000*******"
    }

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.put(`${url_api}/customer/${customerId}`, customer, {
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
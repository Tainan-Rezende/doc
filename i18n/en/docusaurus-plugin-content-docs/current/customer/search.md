---
sidebar_label: 'Customer Lookup'
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CreateCustomerTester from '@site/src/components/CreateCustomerTester';

# Customer Lookup

This endpoint queries the customer record in the XGate database.

---

## Endpoint
- **Method:** <span className="badge badge--success">GET</span>
```bash title="Endpoint URL"
https://api.xgateglobal.com/customer/CUSTOMER_ID
```

:::warning[Important]
The **CUSTOMER_ID** value refers to the `_id` returned when creating a customer.
:::

:::tip[Integration Tip: Retrieving an ID]
The XGate API uses the `name` field as a validation key for customers. If you lost a user's `_id`, submit a **Create Customer** request using the same name. The server will detect the existing name and return a friendly error containing the existing record's `_id`, allowing you to update your internal database.
:::

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


---

## Responses

### Success (200 OK)

Customer data was found.

```json
{
  "_id": "697e15******************",
  "name": "Client Name",
  "email": "email@domain.com",
  "document": "123********",
  "version": 1,
  "createdDate": "202****************",
  "updatedDate": "202****************"
}
```

### Common Errors

| Status  | Message                 | Likely Reason                                                                                                                                            |
| :------ | :---------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Missing or invalid header.<br /> • IP not allowed.<br />• You are not authorized to perform this action. |
| **404** | `Not Found`             | • Provided ID is not valid.<br />The customer does not exist.                                                                                              |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                                                                                                   |

---

## How to use

The customer query route is a read-only endpoint. Use it to retrieve and verify the current data of a user already registered in your XGate database.

### Common Use Cases

Unlike payment routes, there is no complex flow here. Use this endpoint mainly for:

1. **Audit and Verification:** Confirm that the `document` (CPF/CNPJ) or `email` linked to the customer are correct.
2. **Pre-Update Validation:** Fetch the user's current registration data to pre-fill an "Edit Profile" screen in your front-end.
3. **Database Synchronization:** Ensure your internal database remains up-to-date and in sync with XGate.

### Practical Example
The primary purpose is quick, secure data viewing. By requesting the customer using its _id, you will receive the complete customer object.

**1. What you receive when querying the customer:**

Note in the example below how the route returns the vital information, allowing you to verify the `document` (highlighted line):
```json {5}
{
  "_id": "697e15******************",
  "name": "Client Name",
  "email": "email@domain.com",
  "document": "123********",
  "version": 1,
  "createdDate": "202****************",
  "updatedDate": "202****************"
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

  try {
    const url_api = "https://api.xgateglobal.com"
    const login = await axios.post(`${url_api}/auth/token`, { email, password });
    const { data } = await axios.get(`${url_api}/customer/${customerId}`, {
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
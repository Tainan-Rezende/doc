---
sidebar_label: 'Resend Webhook'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Resend Webhook

This endpoint allows you to force the resending of a webhook notification for a specific deposit transaction.

---

## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/deposit/TRANSACTION_ID/resend/webhook
```

:::warning[Important]
The **TRANSACTION_ID** value in the URL refers to the deposit's `_id`. This request **does not require a body**, only the parameterized URL and the authentication Header.
:::

---

## Request

### Required Headers

| Header          | Value                 | Description                                 |
| :-------------- | :-------------------- | :------------------------------------------ |
| `Authorization` | `Bearer <your_token>` | JWT authentication token obtained at login. |

---

## Responses

### Success (200 OK)

The command was received and XGate resent the webhook payload to the URL registered in your dashboard.

```json
{
    "message": "Webhook de depósito reenviado com sucesso"
}
```

### Common Errors

| Status  | Message                 | Probable Cause                                                                                                                                    |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Header invalid or not provided.<br /> • IP not allowed.<br />• You are not authorized to perform this action. |
| **404** | `Not Found`             | • Provided ID is invalid.<br />• The transaction does not exist.                                                                                  |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                                                                                           |

---

## How to Use

This is a contingency and maintenance route. Unlike query routes, it performs an active action in XGate, causing our server to trigger the HTTP notification to your system again.

### Common Use Cases

You will primarily use this endpoint for:

1. **Failure Recovery:** If your server experienced instability, crashed, or the firewall blocked the original XGate request, you can use this endpoint to "pull" the notification again and update the status in your database.
2. **Integration Tests:** During the development phase, you can trigger the webhook of an old transaction multiple times to test if your receiving code's logic is working correctly.

### Practical Example

Simply make a POST to the URL providing the transaction ID. You will receive a success message confirming that the trigger was activated.

```json
{
    "message": "Webhook de depósito reenviado com sucesso"
}
```

---

## Integration

Below is a simple example of how to implement this call using Node.js. Since it is a `POST` without a body, we simply send an empty object `{}` followed by the headers.

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    The integration example uses the `Axios` library to perform the HTTP request.

    **Installing `Axios`:**
    ```bash
    npm install axios
    ```

    **Javascript Example:**
    ```javascript
    const axios = require("axios");

    (async () => {
        const email = "email@domain.com";
        const password = "••••••";
        const transactionId = "6997146*******************";

        try {
            const url_api = "https://api.xgateglobal.com";
            
            // 1. Get authentication token
            const login = await axios.post(`${url_api}/auth/token`, { email, password });
            
            // 2. Trigger Webhook resend (POST without body)
            const { data } = await axios.post(`${url_api}/deposit/${transactionId}/resend/webhook`, {}, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`
                }
            });
            
            console.log("Response:", data); 
            // Expected: { message: 'Webhook de depósito reenviado com sucesso' }

        } catch (error) {
            console.error("Resend error:", error.response ? error.response.data : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
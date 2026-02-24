---
sidebar_label: 'Subaccount Webhook'
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Create Subaccount Webhook

This endpoint allows you to automatically register the **first Webhook URL** for a newly created subaccount.

:::warning[Single Use Rule]
This route was designed exclusively for the initial setup of the subaccount. **It only allows saving the first webhook**. If the subaccount already has a webhook configured, the API will return an error.
:::

---

## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/webhook/subaccount
```

---

## Request

### Required Headers

| Header          | Value                 | Description                                     |
| :-------------- | :-------------------- | :---------------------------------------------- |
| `Authorization` | `Bearer <your_token>` | JWT authentication token of the **Subaccount**. |

### Request Body

| Parameter            | Type     | Validation | Description                                                                        |
| :------------------- | :------- | :--------- | :--------------------------------------------------------------------------------- |
| `name`               | `string` | Required   | An internal identification name for the webhook (e.g., "First Webhook").           |
| `externalWebhookUrl` | `string` | Required   | The complete URL of your server that will receive the data sent by XGate via POST. |

#### Payload Example

```json
{
    "externalWebhookUrl": "https://your-company.com/api/webhooks/subaccount/xgate",
    "name": "First Webhook"
}
```

---

## Responses

### Success (200 OK)

The notification URL has been registered and is already active for the subaccount.

```json
{
    "message": "Primeiro Webhook cadastrado com sucesso"
}
```

### Common Errors

| Status  | Message                 | Probable Cause                                                                                                                                                                                                                                                                                                               |
| :------ | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `Bad Request`           | • **This feature is not available for your Account**: The account making the request is not a valid subaccount for this flow.<br /><br />• **This feature allows saving only the first webhook of your account**: The subaccount **already has** a webhook registered. This route only works when the webhook list is empty. |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Header invalid or not provided.<br /> • IP not allowed.                                                                                                                                                                                                                                  |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                                                                                                                                                                                                                                                                      |

---

## How to Use

### Common Use Cases

1. **Setup Automation (Onboarding):** When your Main Account (Master) creates a subaccount for a new corporate client, you can program your system to immediately log into the newly created subaccount and trigger this endpoint. This ensures that the subaccount is born ready to notify your internal gateway about payments, without the need for manual operation in the dashboard.

---

## Integration

Below is a simple example of how to implement this call using Node.js. Remember to use the subaccount credentials to obtain the authorization token.

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
        // ATTENTION: Use the SUBACCOUNT email and password to generate the token for this action
        const emailSubconta = "admin@subconta.com";
        const passwordSubconta = "••••••";

        try {
            const url_api = "https://api.xgateglobal.com";
            
            // 1. Get Subaccount authentication token
            const login = await axios.post(`${url_api}/auth/token`, { 
                email: emailSubconta, 
                password: passwordSubconta 
            });
            
            // 2. Configure the first webhook
            const webhookData = {
                externalWebhookUrl: "https://api.your-company.com/webhooks/xgate/subaccount-1",
                name: "Main Webhook - Subaccount 1"
            };

            const { data } = await axios.post(`${url_api}/webhook/subaccount`, webhookData, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`,
                    "Content-Type": "application/json"
                }
            });
            
            console.log("Response:", data); 
            // Expected: { message: 'Primeiro Webhook cadastrado com sucesso' }

        } catch (error) {
            console.error("Error registering webhook:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
---
sidebar_label: 'Allow IP (Withdraw)'
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Allow Withdrawal IP on Subaccount

This endpoint allows you to automatically register the **first authorized IP** to make withdrawal requests in a newly created subaccount.

:::warning[Single Use Rule]
This route was designed exclusively for the initial setup of the subaccount. **It only allows saving the first IP**. If the subaccount already has a withdrawal IP configured, the API will return an error and new IPs must be added via the Dashboard.
:::

:::info[Attention: Withdraw vs Balance]
The IP allowed by this endpoint has **exclusive permission for creating withdrawals**. It **does not** grant access to the Balance Query routes. Allowing IPs for balance queries has a separate configuration.
:::

---

## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/withdraw/allowed-ip/subaccount
```

---

## Request

### Required Headers

| Header          | Value                 | Description                                     |
| :-------------- | :-------------------- | :---------------------------------------------- |
| `Authorization` | `Bearer <your_token>` | JWT authentication token of the **Subaccount**. |

### Request Body

| Parameter | Type     | Validation | Description                                                                                                  |
| :-------- | :------- | :--------- | :----------------------------------------------------------------------------------------------------------- |
| `ip`      | `string` | Required   | The IP address (IPv4 or IPv6) of your server that will be allowed to trigger withdrawals in this subaccount. |

#### Payload Example

```json
{
    "ip": "8.8.8.8"
}
```

---

## Responses

### Success (200 OK)

The IP address has been registered in the allowlist and can now request withdrawals.

```json
{
    "message": "Primeiro IP liberado para solicitação de saque cadastrado com sucesso"
}
```

### Common Errors

Since this is a single-use route, business rule validations usually return a `400` status.

| Status  | Message                 | Probable Cause                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **400** | `Bad Request`           | • **This feature is not available for your Account**: This route is only available for registering the first IP of a subaccount. The account making the request is not a valid subaccount for this flow.<br /><br />• **This feature allows allowing only the first withdrawal IP of your account**: When a first IP has already been registered. The subaccount **already has** a registered IP and the route only works when the list is empty. |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Header invalid or not provided.<br /> • Request IP not allowed.                                                                                                                                                                                                                                                                                                                                               |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                                                                                                                                                                                                                                                                                                                                                                                           |

---

## How to Use

### Common Use Cases

1. **Setup Automation (Onboarding):** Just like the Webhook, right after creating the subaccount via API for a new client, your system can log into this new subaccount and register the static IP of your financial server. This ensures that the subaccount is born ready and secure to process withdrawals automatically, without needing manual intervention from your support team.

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
            
            // 2. Configure the first allowed IP for withdrawal
            const ipData = {
                ip: "8.8.8.8"
            };

            const { data } = await axios.post(`${url_api}/withdraw/allowed-ip/subaccount`, ipData, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`,
                    "Content-Type": "application/json"
                }
            });
            
            console.log("Response:", data); 
            // Expected: { message: 'Primeiro IP liberado para solicitação de saque cadastrado com sucesso' }

        } catch (error) {
            console.error("Error registering IP:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
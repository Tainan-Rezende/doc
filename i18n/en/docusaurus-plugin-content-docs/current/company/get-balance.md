---
sidebar_label: 'Consult Balance'
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Consult Company Balance

This endpoint allows you to query the available balances in your XGate account. You can fetch the total balance (all currencies) or filter by a specific Fiat currency or Cryptocurrency.

:::warning[Security Warning - IP Whitelist]
For security reasons, this route requires origin validation. The IP of the server making the request **must mandatorily** be registered in your dashboard. 

Access the menu **Settings > Allowed IPs for API balance query** and add your IP. Otherwise, the API will return an authorization error.
:::

---

## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/balance/company
```

---

## Request

### Required Headers

| Header          | Value                 | Description                                 |
| :-------------- | :-------------------- | :------------------------------------------ |
| `Authorization` | `Bearer <your_token>` | JWT authentication token obtained at login. |

### Request Body

You have 3 payload options to send, depending on what you want to query:

**Option 1: Query Total Balance (Fiat and Crypto)**
Send an empty object.
```json
{}
```

**Option 2: Query only Fiat Currency**
Send the detailed `currency` object.
```json
{
    "currency": {
        "_id": "6728f0a2cba3****************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-11-04T16:04:50.019Z",
        "updatedDate": "2024-11-07T02:23:38.606Z",
        "__v": 0,
        "symbol": "R$"
    }
}
```

**Option 3: Query only Cryptocurrency**
Send the detailed `cryptocurrency` object.
```json
{
    "cryptocurrency": {
        "_id": "67339b18ca59****************",
        "__v": 0,
        "coinGecko": "tether",
        "createdDate": "2024-11-12T18:14:48.380Z",
        "name": "USDT",
        "symbol": "USDT",
        "updatedDate": "2024-11-15T05:53:32.979Z"
    }
}
```

---

## Responses

The API will always return an *Array* containing the found balances.

### Success (200 OK)

**Response for Option 1 (Total Balance):**
```json
[
    {
        "currency": {
            "type": "PIX",
            "name": "BRL"
        },
        "totalAmount": 1.94,
        "totalHeld": 0
    },
    {
        "cryptocurrency": {
            "name": "USDT",
            "symbol": "USDT"
        },
        "totalAmount": 0.866938
    }
]
```

**Response for Option 2 (Fiat Only):**
```json
[
    {
        "currency": {
            "type": "PIX",
            "name": "BRL"
        },
        "totalAmount": 1.94,
        "totalHeld": 0
    }
]
```

**Response for Option 3 (Crypto Only):**
```json
[
    {
        "cryptocurrency": {
            "name": "USDT",
            "symbol": "USDT"
        },
        "totalAmount": 0.866938
    }
]
```

### Common Errors

| Status  | Message                 | Probable Cause                                                                                                              |
| :------ | :---------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Header invalid or not provided.<br /> • IP not registered in the Dashboard's whitelist. |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                                                                     |

---

## How to Use

### Common Use Cases

1. **Display on Custom Dashboard:** Synchronize and display the updated company balance directly in your internal administrative system, without needing to log into the XGate dashboard.
2. **Pre-Withdrawal Validation:** Before approving and triggering a massive withdrawal request, your system can query the available balance (`totalAmount`) to ensure there are sufficient funds, avoiding processing errors.
3. **Financial Monitoring:** Create automated routines that alert your financial team when the balance (Fiat or Crypto) falls below a minimum operational threshold.

---

## Integration

Below is an example of how to implement the **Total Balance** query using Node.js. 

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

        try {
            const url_api = "https://api.xgateglobal.com";
            
            // 1. Get authentication token
            const login = await axios.post(`${url_api}/auth/token`, { email, password });
            
            // 2. Query total balance (Empty body)
            // Note: To filter, simply add the currency or cryptocurrency object to the body ({})
            const { data } = await axios.post(`${url_api}/balance/company`, {}, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`
                }
            });
            
            console.log("Company Balance:", JSON.stringify(data, null, 2));

            // Example of reading BRL balance:
            const saldoFiat = data.find(item => item.currency && item.currency.name === "BRL");
            if (saldoFiat) {
                console.log(`Available balance in Reais: R$ ${saldoFiat.totalAmount}`);
            }

        } catch (error) {
            console.error("Error fetching balance:", error.response ? error.response.data : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
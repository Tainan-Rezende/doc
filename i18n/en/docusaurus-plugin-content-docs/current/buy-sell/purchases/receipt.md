---
sidebar_label: 'Receipt'
sidebar_position: 3
description: 'Generates the HTML receipt of a delivered crypto purchase.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Purchase Receipt

Generates, on demand, the HTML receipt of a purchase. Available only for purchases with status `DELIVERED`.

- **Permission:** `CRYPTO.VIEW`

---

## Endpoint
- **Method:** <span className="badge badge--success">GET</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/crypto/purchases/{id}/receipt
```

---

## Request

#### Headers

| Header            | Value                 | Required | Description                                         |
| :---------------- | :-------------------- | :------: | :-------------------------------------------------- |
| `Authorization`   | `Bearer <your_token>` | **Yes**  | The JWT token obtained at login.                    |
| `Accept-Language` | `pt-BR` or `en`       |  **No**  | Receipt language. Default: `pt-BR`.                 |

#### Path

| Parameter | Type     | Description     |
| :-------- | :------- | :-------------- |
| `id`      | `string` | Purchase ID.    |

---

## Responses

### Success (200 OK)

```json
{
  "htmlTemplate": "<html>…</html>"
}
```

The content of `htmlTemplate` can be displayed in the browser or converted to PDF by your system.

### Common Errors

| Status  | Reason                                                                         |
| :------ | :----------------------------------------------------------------------------- |
| **401** | `UNAUTHORIZED`                                                                 |
| **403** | `PERMISSION_DENIED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED` |
| **404** | `PURCHASE_NOT_FOUND`                                                           |
| **409** | `RECEIPT_NOT_AVAILABLE`: the purchase is not `DELIVERED` yet.                  |

---

## Integration

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    **JavaScript Example:**
    ```js
    const axios = require("axios");
    const fs = require("fs");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";
    const purchaseId = "6710c2f4a1b2c3d4e5f60718";

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/crypto/purchases/${purchaseId}/receipt`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`,
                "Accept-Language": "en"
            }
        });
        fs.writeFileSync("receipt.html", data.htmlTemplate);
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

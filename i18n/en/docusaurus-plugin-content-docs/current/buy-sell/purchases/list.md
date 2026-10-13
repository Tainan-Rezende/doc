---
sidebar_label: 'Get Purchases'
sidebar_position: 2
description: "Lists the company's crypto purchases or retrieves a purchase by ID."
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Get Purchases

Lists the company's crypto purchases or retrieves a specific purchase.

- **Permission:** `CRYPTO.VIEW`

---

## Endpoint
- **Method:** <span className="badge badge--success">GET</span>

```bash title="List purchases"
https://api.xgateglobal.com/crypto/purchases
```

```bash title="Get a purchase"
https://api.xgateglobal.com/crypto/purchases/{id}
```

---

## Request

#### Required Headers

| Header          | Value                 | Description                      |
| :-------------- | :-------------------- | :------------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained at login. |

#### Query (listing)

| Parameter    | Type      | Required | Description                                                                  |
| :----------- | :-------- | :------: | :--------------------------------------------------------------------------- |
| `status`     | `string`  |  **No**  | Filters by status (`EXECUTING`, `PENDING_APPROVAL`, `DELIVERED`, ...).       |
| `externalId` | `string`  |  **No**  | Exact match on `externalId`.                                                 |
| `from`, `to` | `string`  |  **No**  | Inclusive range on `createdAt` (ISO 8601).                                   |
| `cursor`     | `string`  |  **No**  | `nextCursor` from the previous page.                                         |
| `limit`      | `integer` |  **No**  | Items per page, from 1 to 100. Default: 20.                                  |

#### Path (query by ID)

| Parameter | Type     | Description                                    |
| :-------- | :------- | :--------------------------------------------- |
| `id`      | `string` | Purchase ID returned at creation.              |

---

## Responses

### Success (200 OK)

**Listing:** from the most recent purchase to the oldest.

```json
{
  "items": [
    {
      "id": "6710c2f4a1b2c3d4e5f60718",
      "externalId": "order-7781",
      "status": "DELIVERED",
      "channel": "API",
      "asset": "USDT",
      "network": "TRON",
      "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
      "amount": "1500.00",
      "rate": "5.45400000",
      "cryptoAmount": "275.027502",
      "feeAmount": "4.125414",
      "feeAsset": "USDT",
      "networkFee": "0.012000",
      "deliveredAmount": "270.890088",
      "quoteId": "l3m8Qm1n0pV2cXk5dY9sTg4hWz7aB6eR1uJ0oK2qF3i",
      "depositId": null,
      "approval": { "required": true, "decision": "APPROVED", "decidedAt": "2026-10-13T14:08:02.000Z" },
      "delivery": { "status": "CONFIRMED", "txHash": "9f2c1e7b0a…", "confirmedAt": "2026-10-13T14:11:39.000Z" },
      "rejection": null,
      "executedAt": "2026-10-13T14:03:40.512Z",
      "createdAt": "2026-10-13T14:03:40.204Z",
      "updatedAt": "2026-10-13T14:11:40.031Z"
    }
  ],
  "nextCursor": null
}
```

**By ID:** returns the purchase object directly (without `items`).

The description of each field is in <a href={useBaseUrl('/docs/buy-sell/purchases/create#purchase-object')}>Purchase object</a>.

### Common Errors

| Status  | Reason                                                                                                                                  |
| :------ | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`                                                                                                                     |
| **401** | `UNAUTHORIZED`                                                                                                                          |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED` |
| **404** | `PURCHASE_NOT_FOUND`: nonexistent ID, malformed ID or ID from another company.                                                          |

---

## Integration

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    **JavaScript Example (iterating through all pages):**
    ```js
    const axios = require("axios");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const headers = { "Authorization": `Bearer ${login.data.token}` };

        let cursor;
        do {
            const { data } = await axios.get(`${url_api}/crypto/purchases`, {
                headers,
                params: { status: "DELIVERED", limit: 100, cursor }
            });
            data.items.forEach(p => console.log(p.externalId, p.deliveredAmount, p.delivery.txHash));
            cursor = data.nextCursor;
        } while (cursor);
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

---
sidebar_label: 'Consultar Compra'
sidebar_position: 1
description: 'Consulta una compra de cripto por el ID.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Consultar Compra

Consulta una compra de cripto por el ID devuelto en la creación (<a href={useBaseUrl('/docs/buy-sell/purchases/create')}>POST /crypto/purchases</a>). Útil para verificar el estado cuando un webhook no llegó o para conciliar la entrega.

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL del Endpoint"
https://api.xgateglobal.com/crypto/purchases/{id}
```

---

## Solicitud

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Path

| Parámetro | Tipo     | Descripción                                |
| :-------- | :------- | :----------------------------------------- |
| `id`      | `string` | ID de la compra devuelto en la creación.   |

---

## Respuestas

### Éxito (200 OK)

Devuelve el objeto de la compra, el mismo que se envía en el campo `data` de los <a href={useBaseUrl('/docs/webhooks/purchase/receive')}>webhooks de compra</a>.

```json
{
  "id": "6710c2f4a1b2c3d4e5f60718",
  "externalId": "pedido-7781",
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
```

La descripción de cada campo está en <a href={useBaseUrl('/docs/buy-sell/purchases/create#purchase-object')}>Objeto de la compra</a>.

### Errores Comunes

| Status  | Reason                                                                                                            |
| :------ | :---------------------------------------------------------------------------------------------------------------- |
| **401** | `UNAUTHORIZED`                                                                                                    |
| **403** | `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`      |
| **404** | `PURCHASE_NOT_FOUND`: ID inexistente, con formato inválido o de otra empresa.                                     |

Vea el significado de cada código en <a href={useBaseUrl('/docs/buy-sell/errors')}>Códigos de Error</a>.

---

## Integración

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    **Ejemplo en JavaScript:**
    ```js
    const axios = require("axios");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";
    const purchaseId = "6710c2f4a1b2c3d4e5f60718";

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/crypto/purchases/${purchaseId}`, {
            headers: { "Authorization": `Bearer ${login.data.token}` }
        });
        console.log(data.status, data.deliveredAmount, data.delivery.txHash); // Response
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

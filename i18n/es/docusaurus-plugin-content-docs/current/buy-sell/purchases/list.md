---
sidebar_label: 'Consultar Compras'
sidebar_position: 2
description: 'Lista las compras de cripto de la empresa o consulta una compra por su ID.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Consultar Compras

Lista las compras de cripto de la empresa o consulta una compra específica.

- **Permiso:** `CRYPTO.VIEW`

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="Listar compras"
https://api.xgateglobal.com/crypto/purchases
```

```bash title="Consultar una compra"
https://api.xgateglobal.com/crypto/purchases/{id}
```

---

## Solicitud

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Query (listado)

| Parámetro    | Tipo      | Obligatorio | Descripción                                                                  |
| :----------- | :-------- | :---------: | :--------------------------------------------------------------------------- |
| `status`     | `string`  |   **No**    | Filtra por status (`EXECUTING`, `PENDING_APPROVAL`, `DELIVERED`, ...).       |
| `externalId` | `string`  |   **No**    | Búsqueda exacta por el `externalId`.                                         |
| `from`, `to` | `string`  |   **No**    | Intervalo inclusivo en `createdAt` (ISO 8601).                               |
| `cursor`     | `string`  |   **No**    | `nextCursor` de la página anterior.                                          |
| `limit`      | `integer` |   **No**    | Elementos por página, de 1 a 100. Predeterminado: 20.                        |

#### Path (consulta por ID)

| Parámetro | Tipo     | Descripción                                    |
| :-------- | :------- | :--------------------------------------------- |
| `id`      | `string` | ID de la compra devuelto en la creación.       |

---

## Respuestas

### Éxito (200 OK)

**Listado:** de la compra más reciente a la más antigua.

```json
{
  "items": [
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
  ],
  "nextCursor": null
}
```

**Por ID:** devuelve directamente el objeto de la compra (sin `items`).

La descripción de cada campo está en <a href={useBaseUrl('/docs/buy-sell/purchases/create#purchase-object')}>Objeto de la compra</a>.

### Errores comunes

| Status  | Reason                                                                                                                                  |
| :------ | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`                                                                                                                     |
| **401** | `UNAUTHORIZED`                                                                                                                          |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED` |
| **404** | `PURCHASE_NOT_FOUND`: ID inexistente, con formato inválido o de otra empresa.                                                           |

---

## Integración

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    **Ejemplo en JavaScript (recorriendo todas las páginas):**
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

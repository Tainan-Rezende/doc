---
sidebar_label: 'Comprobante'
sidebar_position: 3
description: 'Genera el comprobante en HTML de una compra de cripto entregada.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Comprobante de la Compra

Genera, al instante, el comprobante en HTML de una compra. Disponible solo para compras con status `DELIVERED`.

- **Permiso:** `CRYPTO.VIEW`

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL del Endpoint"
https://api.xgateglobal.com/crypto/purchases/{id}/receipt
```

---

## Solicitud

#### Encabezados

| Encabezado        | Valor               | Obligatorio | Descripción                                         |
| :---------------- | :------------------ | :---------: | :-------------------------------------------------- |
| `Authorization`   | `Bearer <tu_token>` |   **Sí**    | El token JWT obtenido al iniciar sesión.            |
| `Accept-Language` | `pt-BR` o `en`      |   **No**    | Idioma del comprobante. Predeterminado: `pt-BR`.    |

#### Path

| Parámetro | Tipo     | Descripción         |
| :-------- | :------- | :------------------ |
| `id`      | `string` | ID de la compra.    |

---

## Respuestas

### Éxito (200 OK)

```json
{
  "htmlTemplate": "<html>…</html>"
}
```

El contenido de `htmlTemplate` puede mostrarse en el navegador o convertirse en PDF desde su sistema.

### Errores comunes

| Status  | Reason                                                                         |
| :------ | :----------------------------------------------------------------------------- |
| **401** | `UNAUTHORIZED`                                                                 |
| **403** | `PERMISSION_DENIED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED` |
| **404** | `PURCHASE_NOT_FOUND`                                                           |
| **409** | `RECEIPT_NOT_AVAILABLE`: la compra aún no está `DELIVERED`.                    |

---

## Integración

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    **Ejemplo en JavaScript:**
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
                "Accept-Language": "pt-BR"
            }
        });
        fs.writeFileSync("comprobante.html", data.htmlTemplate);
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

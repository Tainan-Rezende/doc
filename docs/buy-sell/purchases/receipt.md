---
sidebar_label: 'Comprovante'
sidebar_position: 3
description: 'Gera o comprovante em HTML de uma compra de cripto entregue.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Comprovante da Compra

Gera, na hora, o comprovante em HTML de uma compra. Disponível apenas para compras com status `DELIVERED`.

- **Permissão:** `CRYPTO.VIEW`

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/crypto/purchases/{id}/receipt
```

---

## Requisição

#### Headers

| Header            | Valor                | Obrigatório | Descrição                                           |
| :---------------- | :------------------- | :---------: | :-------------------------------------------------- |
| `Authorization`   | `Bearer <seu_token>` |   **Sim**   | O token JWT obtido no login.                        |
| `Accept-Language` | `pt-BR` ou `en`      |   **Não**   | Idioma do comprovante. Padrão: `pt-BR`.             |

#### Path

| Parâmetro | Tipo     | Descrição       |
| :-------- | :------- | :-------------- |
| `id`      | `string` | ID da compra.   |

---

## Respostas (Responses)

### Sucesso (200 OK)

```json
{
  "htmlTemplate": "<html>…</html>"
}
```

O conteúdo de `htmlTemplate` pode ser exibido no navegador ou convertido em PDF pelo seu sistema.

### Erros Comuns

| Status  | Reason                                                                         |
| :------ | :----------------------------------------------------------------------------- |
| **401** | `UNAUTHORIZED`                                                                 |
| **403** | `PERMISSION_DENIED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED` |
| **404** | `PURCHASE_NOT_FOUND`                                                           |
| **409** | `RECEIPT_NOT_AVAILABLE`: a compra ainda não está `DELIVERED`.                  |

---

## Integração

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    **Exemplo Javascript:**
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
        fs.writeFileSync("comprovante.html", data.htmlTemplate);
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

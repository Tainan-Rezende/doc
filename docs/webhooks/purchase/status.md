---
sidebar_label: 'Consultar Compra'
sidebar_position: 1
description: 'Consulta uma compra de cripto pelo ID.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Consultar Compra

Consulta uma compra de cripto pelo ID retornado na criação (<a href={useBaseUrl('/docs/buy-sell/purchases/create')}>POST /crypto/purchases</a>). Útil para conferir o status quando um webhook não chegou ou para conciliar a entrega.

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/crypto/purchases/{id}
```

---

## Requisição

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

#### Path

| Parâmetro | Tipo     | Descrição                          |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | ID da compra retornado na criação. |

---

## Respostas (Responses)

### Sucesso (200 OK)

Retorna o objeto completo da compra. O webhook de compra traz só um resumo dele.

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

A descrição de cada campo está em <a href={useBaseUrl('/docs/buy-sell/purchases/create#purchase-object')}>Objeto da compra</a>.

### Erros Comuns

| Status  | Reason                                                                                                            |
| :------ | :---------------------------------------------------------------------------------------------------------------- |
| **401** | `UNAUTHORIZED`                                                                                                    |
| **403** | `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`      |
| **404** | `PURCHASE_NOT_FOUND`: ID inexistente, fora do formato ou de outra empresa.                                        |

Veja o significado de cada código em <a href={useBaseUrl('/docs/buy-sell/errors')}>Códigos de Erro</a>.

---

## Integração

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    **Exemplo Javascript:**
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
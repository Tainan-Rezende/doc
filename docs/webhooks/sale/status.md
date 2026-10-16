---
sidebar_label: 'Consultar Venda'
sidebar_position: 1
description: 'Consulta uma venda de cripto pelo ID.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Consultar Venda

Consulta uma venda de cripto pelo ID. Cada envio confirmado para o endereço fixo da empresa vira uma venda (veja <a href={useBaseUrl('/docs/buy-sell/sales/sell')}>Vender Cripto</a>); o `id` chega no <a href={useBaseUrl('/docs/webhooks/sale/receive')}>webhook de venda</a>.

:::note[Disponível em novembro de 2026]
A venda de cripto pela API será liberada em novembro de 2026.
:::

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/crypto/sales/{id}
```

---

## Requisição

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

#### Path

| Parâmetro | Tipo     | Descrição     |
| :-------- | :------- | :------------ |
| `id`      | `string` | ID da venda.  |

---

## Respostas (Responses)

### Sucesso (200 OK)

```json
{
  "id": "6711c0e5a1b2c3d4e5f60718",
  "status": "SETTLED",
  "asset": "USDT",
  "network": "TRON",
  "depositAddress": "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
  "sourceAddress": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
  "txHash": "9f2c1e0b7a6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b3a2918070f6e5d4c",
  "cryptoAmount": "1000.000000",
  "rate": "5.41000000",
  "netCryptoAmount": "990.000000",
  "grossAmount": "5355.90",
  "feeAmount": "10.000000",
  "feeAsset": "USDT",
  "netAmount": "5355.90",
  "settlement": { "type": "BALANCE", "beneficiaryId": null, "withdrawId": null, "fallbackReason": null },
  "review": null,
  "receivedAt": "2026-11-13T14:03:22.114Z",
  "settledAt": "2026-11-13T14:03:24.870Z",
  "createdAt": "2026-11-13T14:03:22.114Z",
  "updatedAt": "2026-11-13T14:03:24.870Z"
}
```

### Objeto da venda {#sale-object}

O mesmo objeto é enviado no campo `data` dos <a href={useBaseUrl('/docs/webhooks/sale/receive')}>webhooks de venda</a>.

| Campo                      | Tipo               | Descrição                                                                                                                                                                       |
| :------------------------- | :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                       | `string`           | ID da venda.                                                                                                                                                                    |
| `status`                   | `string`           | `RECEIVED` (recebida e confirmada, aguardando preço) · `SETTLING` (preço congelado, crédito em andamento) · `SETTLED` (liquidada pela forma configurada; final) · `SETTLED_TO_BALANCE` (era Pix, caiu no saldo; final). |
| `asset`, `network`         | `string`           | Ativo e rede.                                                                                                                                                                   |
| `depositAddress`           | `string`           | Endereço fixo da empresa que recebeu.                                                                                                                                           |
| `sourceAddress`            | `string` \| `null` | De onde a cripto saiu, quando a rede informa.                                                                                                                                   |
| `txHash`                   | `string` \| `null` | Hash on-chain do envio. Use para conciliar.                                                                                                                                     |
| `cryptoAmount`             | `string`           | Quantidade recebida (6 casas).                                                                                                                                                  |
| `rate`                     | `string` \| `null` | Preço BRL por unidade (8 casas), congelado na liquidação.                                                                                                                       |
| `feeAmount`, `feeAsset`    | `string` \| `null` | Taxa em cripto sobre `cryptoAmount`.                                                                                                                                            |
| `netCryptoAmount`          | `string` \| `null` | `cryptoAmount − feeAmount`.                                                                                                                                                     |
| `grossAmount`, `netAmount` | `string` \| `null` | Valor creditado em BRL (`netCryptoAmount × rate`, para baixo). Hoje são iguais.                                                                                                 |
| `settlement`               | `object`           | `type` (`BALANCE` \| `PIX_KEY`), `beneficiaryId`, `withdrawId` (saque Pix criado), `fallbackReason` (`PIX_SETTLEMENT_UNAVAILABLE` · `BENEFICIARY_NOT_ELIGIBLE` · `PAYOUT_REJECTED` · `PAYOUT_FAILED` · `PAYOUT_UNAVAILABLE` · `null`). |
| `review`                   | `object` \| `null` | Venda em análise da XGate. `reason`: `BELOW_MINIMUM` · `COMPANY_UNAVAILABLE` · `COMPANY_BLOCKED` · `SELL_POLICY_MISSING` · `NET_NOT_POSITIVE` · `CONFIRMATIONS_TIMEOUT` · `CREDIT_REVIEW`. |
| `receivedAt`, `settledAt`, `createdAt`, `updatedAt` | `string` | Datas ISO 8601 (UTC). `updatedAt` e `status` ordenam webhooks que chegam fora de ordem.                                                                |

### Erros Comuns

| Status  | Reason                                                                     |
| :------ | :------------------------------------------------------------------------- |
| **401** | `UNAUTHORIZED`                                                             |
| **403** | `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`         |
| **404** | `SALE_NOT_FOUND`: ID inexistente, fora do formato ou de outra empresa.     |

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
    const saleId = "6711c0e5a1b2c3d4e5f60718";

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/crypto/sales/${saleId}`, {
            headers: { "Authorization": `Bearer ${login.data.token}` }
        });
        console.log(data.status, data.txHash, data.netAmount, data.settlement.type); // Response
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

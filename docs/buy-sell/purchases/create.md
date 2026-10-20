---
sidebar_label: 'Comprar Cripto'
sidebar_position: 1
description: 'Compra USDT ou USDC com o saldo em BRL da empresa e envia a cripto para a carteira de destino da empresa.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Comprar Cripto

Compra USDT ou USDC usando o saldo em BRL da empresa. A XGate envia a cripto para a carteira de destino informada, que deve ser **da própria empresa**.

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/crypto/purchases
```

---

## Requisição

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

#### Formas de compra

Existem duas formas. **Não misture os campos** de uma com os da outra.

<Tabs>
  <TabItem value="quote" label="Com cotação" default>
  Usa o preço garantido de uma <a href={useBaseUrl('/docs/buy-sell/quotes')}>cotação</a> (`quoteId`) ainda válida. Ativo, rede e valor vêm da cotação.

```json
{
  "externalId": "pedido-7781",
  "quoteId": "l3m8Qm1n0pV2cXk5dY9sTg4hWz7aB6eR1uJ0oK2qF3i",
  "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
}
```
  </TabItem>
  <TabItem value="market" label="A mercado">
  Compra pelo preço do instante da execução. `asset`, `network` e `amount` são obrigatórios.

```json
{
  "externalId": "pedido-7782",
  "asset": "USDT",
  "network": "TRON",
  "amount": "1500.00",
  "addressId": "66f1a2b3c4d5e6f708192a3b"
}
```
  </TabItem>
</Tabs>

#### Body (Corpo da Requisição)

| Campo                        | Tipo     | Obrigatório | Descrição                                                                                                                                                                       |
| :--------------------------- | :------- | :---------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `externalId`                 | `string` |   **Sim**   | Identificador da compra no seu sistema. 1 a 128 caracteres ASCII imprimíveis, sem `/` e sem começar com `$`. Único por empresa.                                                  |
| `address`                    | `string` |  **Um dos dois**  | Carteira de destino declarada da empresa, válida na rede, sem memo/tag.                                                                                                   |
| `addressId`                  | `string` |  **Um dos dois**  | Endereço salvo (`buy.addresses[].addressId` de <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a>).                                                   |
| `quoteId`                    | `string` |   Forma com cotação   | Cotação válida. Não pode vir junto de `asset`, `network` ou `amount` (`400 CONFLICTING_FIELDS`).                                                                        |
| `asset`, `network`, `amount` | `string` |   Forma a mercado     | Ativo, rede e total em BRL (string com 2 casas). Os três são obrigatórios quando não há `quoteId`.                                                                      |

:::tip[Idempotência pelo externalId]
- Mesmo `externalId` + mesmo corpo → **200 OK** com a compra já criada (nenhuma compra nova).
- Mesmo `externalId` + corpo diferente → `409 EXTERNAL_ID_CONFLICT`.
- Uma compra recusada fica registrada com o `externalId`. Para tentar de novo, **use outro `externalId`**.
:::

---

## Respostas (Responses)

### Sucesso (201 Created)

A resposta chega depois que o preço e o débito do BRL foram fixados (status `EXECUTING`).

```json
{
  "id": "6710c2f4a1b2c3d4e5f60718",
  "externalId": "pedido-7781",
  "status": "EXECUTING",
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
  "approval": { "required": true, "decision": null, "decidedAt": null },
  "delivery": { "status": "WAITING_APPROVAL", "txHash": null, "confirmedAt": null },
  "rejection": null,
  "executedAt": "2026-10-13T14:03:40.512Z",
  "createdAt": "2026-10-13T14:03:40.204Z",
  "updatedAt": "2026-10-13T14:03:40.512Z"
}
```

### Ciclo de vida

```text
EXECUTING ──► PENDING_APPROVAL ──► DELIVERED
    │                │
    └────────────────┴──────────► REJECTED
```

- **Sem aprovação automática** (`buy.autoApproval = false`): a compra entra na fila de aprovação da XGate (`PENDING_APPROVAL`). O preço já está fixado e não muda.
- **Com aprovação automática:** a compra segue direto até `DELIVERED`.
- Em `DELIVERED`, `delivery.txHash` traz o hash da transação na rede.
- Em `REJECTED`, `rejection.refunded = true` indica que o BRL voltou integralmente ao saldo, taxa incluída.

Acompanhe por <a href={useBaseUrl('/docs/webhooks/purchase/status')}>Consultar Compra</a> ou pelos <a href={useBaseUrl('/docs/webhooks/purchase/receive')}>webhooks de compra</a> (aba Webhooks › Compras Cripto Webhook).

:::info[Segurança na API]
Pela API não há código do autenticador (TOTP). A proteção é o token, a lista de IPs permitidos e a fila de aprovação da XGate.
:::

### Objeto da compra {#purchase-object}

O mesmo objeto é retornado em Consultar Compra; o webhook traz só um resumo.

| Campo                    | Tipo               | Descrição                                                                                                                                       |
| :----------------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                     | `string`           | ID da compra na XGate.                                                                                                                          |
| `externalId`             | `string`           | ID da compra no seu sistema.                                                                                                                    |
| `status`                 | `string`           | `PENDING_PAYMENT` · `EXECUTING` · `PENDING_APPROVAL` · `DELIVERED` · `REJECTED` · `EXPIRED`.                                                    |
| `channel`                | `string`           | Origem da compra: `API`, `DASHBOARD` ou `DEPOSIT`.                                                                                              |
| `asset`, `network`, `address` | `string`      | Destino da cripto.                                                                                                                              |
| `amount`                 | `string` \| `null` | Total em BRL debitado do saldo.                                                                                                                 |
| `rate`                   | `string` \| `null` | Preço de 1 unidade em BRL (8 casas), fixado em `executedAt`.                                                                                    |
| `cryptoAmount`           | `string` \| `null` | `amount ÷ rate` (6 casas).                                                                                                                      |
| `feeAmount`, `feeAsset`  | `string` \| `null` | Taxa XGate + indicação, cobrada em cripto (`feeAsset` = o ativo).                                                                               |
| `networkFee`             | `string` \| `null` | Gás descontado da entrega.                                                                                                                      |
| `deliveredAmount`        | `string` \| `null` | Quantidade que chega na carteira.                                                                                                               |
| `quoteId`                | `string` \| `null` | Cotação usada. `null` na compra a mercado.                                                                                                      |
| `depositId`              | `string` \| `null` | Depósito de origem, quando `channel = DEPOSIT`.                                                                                                 |
| `approval`               | `object`           | `required` (`boolean`), `decision` (`APPROVED` \| `REJECTED` \| `AUTO` \| `null`), `decidedAt`.                                                 |
| `delivery`               | `object`           | `status` (`WAITING_APPROVAL` · `QUEUED` · `SUBMITTED` · `CONFIRMING` · `CONFIRMED` · `UNDER_REVIEW` · `null`), `txHash`, `confirmedAt`.         |
| `rejection`              | `object` \| `null` | Em `REJECTED`: `reason` (veja <a href={useBaseUrl('/docs/buy-sell/errors#rejection-reasons')}>motivos de recusa</a>), `message` (no idioma do `Accept-Language`), `refunded`. |
| `executedAt`, `createdAt`, `updatedAt` | `string` | Datas ISO 8601 (UTC).                                                                                                                  |

### Erros Comuns

| Status  | Reason                                                                                                                                                                                                                                                                       |
| :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`, `AMOUNT_MUST_BE_STRING`, `CONFLICTING_FIELDS`                                                                                                                                                                                                           |
| **401** | `UNAUTHORIZED`                                                                                                                                                                                                                                                               |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`, `BUY_DISABLED`                                                                                                        |
| **404** | `SAVED_ADDRESS_NOT_FOUND`, `QUOTE_NOT_FOUND`                                                                                                                                                                                                                                 |
| **409** | `EXTERNAL_ID_CONFLICT`, `QUOTE_EXPIRED`, `QUOTE_ALREADY_USED`                                                                                                                                                                                                                |
| **422** | `ASSET_NOT_SUPPORTED`, `NETWORK_NOT_SUPPORTED`, `PAIR_MARGIN_NOT_CONFIGURED`, `AMOUNT_BELOW_MIN`, `AMOUNT_ABOVE_MAX`, `ADDRESS_INVALID_FOR_NETWORK`, `ADDRESS_NOT_SAVED`, `ADDRESS_ON_HOLD`, `SAVED_ADDRESS_NETWORK_MISMATCH`, `AMOUNT_TOO_LOW_FOR_NETWORK_FEE`, `INSUFFICIENT_BALANCE`, `PRICE_UNSTABLE` |
| **429** | `RATE_LIMITED`, `DAILY_CAP_EXCEEDED`, `OUTFLOW_HOURLY_CAP_EXCEEDED`                                                                                                                                                                                                          |
| **503** | `PRICE_STALE`, `NETWORK_FEE_UNAVAILABLE`, `CRYPTO_TEMPORARILY_UNAVAILABLE`, `CONFIGURATION_UNAVAILABLE`, `SERVICE_OVERLOADED`                                                                                                                                                |

:::warning[Recusa na execução]
Quando a compra é recusada na execução (saldo insuficiente, limites, preço, cotação vencida), a API responde o erro **e** a compra fica registrada como `REJECTED`, com o `externalId` usado. Nesse caso é enviado o webhook `purchase.rejected`.
:::

Veja o significado de cada código em <a href={useBaseUrl('/docs/buy-sell/errors')}>Códigos de Erro</a>.

---

## Integração

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    **Exemplo Javascript (cotação + compra):**
    ```js
    const axios = require("axios");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const headers = { "Authorization": `Bearer ${login.data.token}` };

        // 1. Cotar (preço garantido por 30 segundos)
        const quote = await axios.post(`${url_api}/crypto/quotes`, {
            asset: "USDT",
            network: "TRON",
            amount: "1500.00" // sempre string
        }, { headers });

        // 2. Comprar com a cotação
        const { data } = await axios.post(`${url_api}/crypto/purchases`, {
            externalId: "pedido-7781",
            quoteId: quote.data.quoteId,
            address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
        }, { headers });

        console.log(data.id, data.status); // EXECUTING
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>
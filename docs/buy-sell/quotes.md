---
sidebar_label: 'Cotação e Estimativa'
sidebar_position: 4
description: 'Gera uma cotação com preço garantido para a compra ou uma estimativa sem reserva de preço.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Cotação e Estimativa

Duas rotas com o mesmo corpo:

| Rota                            | Uso                                                                                                                                  |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /crypto/quotes`           | Gera uma cotação com `quoteId` e preço **garantido** por `quoteTtlSeconds` (30 s), para usar na compra. Pedir e não usar não custa nada. |
| `POST /crypto/quotes/estimate`  | Só uma estimativa: não gera `quoteId` e nada é reservado. Serve para mostrar o valor aproximado ("≈") antes de comprar.               |

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="Cotação"
https://api.xgateglobal.com/crypto/quotes
```

```bash title="Estimativa"
https://api.xgateglobal.com/crypto/quotes/estimate
```

---

## Requisição

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

#### Body (Corpo da Requisição)

| Campo     | Tipo     | Obrigatório | Descrição                                                                                   |
| :-------- | :------- | :---------: | :------------------------------------------------------------------------------------------ |
| `asset`   | `string` |   **Sim**   | `USDT` ou `USDC`.                                                                           |
| `network` | `string` |   **Sim**   | `POLYGON`, `ETHEREUM`, `TRON` ou `SOLANA` (conforme o ativo).                               |
| `amount`  | `string` |   **Sim**   | Total em BRL que será debitado do saldo, string com 2 casas (ex: `"1500.00"`).              |

```json
{
  "asset": "USDT",
  "network": "TRON",
  "amount": "1500.00"
}
```

:::info[A taxa é cobrada na cripto]
O `amount` é o total em BRL debitado, sem taxa embutida. A taxa **nunca é cobrada em BRL**: ela é descontada da quantidade cripto entregue.
:::

---

## Respostas (Responses)

### Sucesso

`POST /crypto/quotes` responde **201 Created**:

```json
{
  "quoteId": "l3m8Qm1n0pV2cXk5dY9sTg4hWz7aB6eR1uJ0oK2qF3i",
  "expiresAt": "2026-10-13T14:03:52.114Z",
  "asset": "USDT",
  "network": "TRON",
  "amount": "1500.00",
  "rate": "5.45400000",
  "cryptoAmount": "275.027502",
  "feeAmount": "4.125414",
  "feeAsset": "USDT",
  "networkFee": "0.012000",
  "deliveredAmount": "270.890088"
}
```

`POST /crypto/quotes/estimate` responde **200 OK** com os mesmos campos, **sem** `quoteId` e `expiresAt`, e com `estimatedAt` (data da estimativa).

#### Descrição dos Campos

| Campo             | Tipo     | Descrição                                                                    |
| :---------------- | :------- | :--------------------------------------------------------------------------- |
| `quoteId`         | `string` | *(Só cotação)* Identificador para usar em `POST /crypto/purchases`.          |
| `expiresAt`       | `string` | *(Só cotação)* Até quando o preço está garantido.                            |
| `estimatedAt`     | `string` | *(Só estimativa)* Momento da estimativa.                                     |
| `asset`, `network`| `string` | Ativo e rede cotados.                                                        |
| `amount`          | `string` | Total em BRL a debitar.                                                      |
| `rate`            | `string` | Preço de 1 unidade do ativo em BRL (8 casas).                                |
| `cryptoAmount`    | `string` | Quantidade bruta comprada (6 casas).                                         |
| `feeAmount`       | `string` | Taxa (XGate + indicação), no próprio ativo.                                  |
| `feeAsset`        | `string` | Ativo em que a taxa é cobrada.                                               |
| `networkFee`      | `string` | Gás da rede, descontado da entrega.                                          |
| `deliveredAmount` | `string` | Quantidade que chega na carteira.                                            |

#### Como o valor é calculado

```text
cryptoAmount    = amount ÷ rate                        (para baixo, 6 casas)
feeAmount       = taxa sobre cryptoAmount              (para cima, no próprio ativo)
deliveredAmount = cryptoAmount − feeAmount − networkFee
```

### Erros Comuns

| Status  | Reason                                                                                                                                                                  |
| :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`, `AMOUNT_MUST_BE_STRING`                                                                                                                            |
| **401** | `UNAUTHORIZED`                                                                                                                                                          |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`, `BUY_DISABLED`   |
| **422** | `ASSET_NOT_SUPPORTED`, `NETWORK_NOT_SUPPORTED`, `AMOUNT_BELOW_MIN`, `AMOUNT_ABOVE_MAX`, `AMOUNT_TOO_LOW_FOR_NETWORK_FEE`, `PAIR_MARGIN_NOT_CONFIGURED`, `PRICE_UNSTABLE` |
| **429** | `RATE_LIMITED`                                                                                                                                                          |
| **503** | `PRICE_STALE`, `NETWORK_FEE_UNAVAILABLE`, `CONFIGURATION_UNAVAILABLE`, `SERVICE_OVERLOADED`                                                                             |

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

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const headers = { "Authorization": `Bearer ${login.data.token}` };
        const body = { asset: "USDT", network: "TRON", amount: "1500.00" }; // amount sempre como string

        // Estimativa (nada é reservado)
        const estimate = await axios.post(`${url_api}/crypto/quotes/estimate`, body, { headers });
        console.log("≈", estimate.data.deliveredAmount, estimate.data.asset);

        // Cotação com preço garantido por 30 segundos
        const quote = await axios.post(`${url_api}/crypto/quotes`, body, { headers });
        console.log(quote.data.quoteId, quote.data.expiresAt);
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

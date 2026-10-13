---
sidebar_label: 'Listar Redes'
sidebar_position: 3
description: 'Este endpoint retorna todas as redes blockchain suportadas.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ListDepositBlockchainNetworksTester from '@site/src/components/ListDepositBlockchainNetworksTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Listar Redes Blockchain

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Listar Redes Blockchain
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /deposit/company/blockchain-networks:
    get:
      summary: Listar Redes Blockchain
      description: Retorna uma lista de todas as redes blockchain suportadas pela plataforma (ex ERC-20, Solana, TRC-20, Polygon). O objeto retornado é obrigatório para montar payloads de saque (cash-out) em criptomoedas.
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Sucesso. Lista de redes recuperada corretamente.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    _id:
                      type: string
                      description: ID único da rede.
                    name:
                      type: string
                      description: Nome da rede de transferência (ex ERC-20).
                    chainId:
                      type: string
                      description: Identificador da rede na blockchain (ex 56, 1).
                    chain:
                      type: string
                      description: Nome da blockchain principal (ex Ethereum).
                    symbol:
                      type: string
                      description: Símbolo do token nativo da rede (ex ETH).
                    cryptocurrencies:
                      type: array
                      items:
                        type: string
                    createdDate:
                      type: string
                      format: date-time
                    updatedDate:
                      type: string
                      format: date-time
                    __v:
                      type: integer
        '401':
          description: Unauthorized. Token inválido, expirado ou ausente.
        '500':
          description: Internal Server Error.
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT`}
    />
</div>

Este endpoint retorna todas as redes blockchain suportadas pela plataforma (ex: Ethereum, BSC, Polygon). 

Esta listagem é **fundamental para realizar saques de criptomoedas** para carteiras externas. Como o USDT existe em várias blockchains diferentes, você precisa especificar em qual rede a transferência deve ocorrer para que o depósito chegue corretamente.

---
## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/deposit/company/blockchain-networks
```

---

## Testar Integração

Utilize o formulário abaixo para visualizar as redes disponíveis.

<ListDepositBlockchainNetworksTester />

---

## Requisição

A requisição não requer corpo (`body`), apenas os **Headers** de autenticação.

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

---

## Respostas (Responses)

### Sucesso (200 OK)

Retorna a lista de redes.

```json
[
  {
    "_id": "672c15919**************",
    "name": "ERC-20",
    "chainId": "1",
    "cryptocurrencies": [...],
    "updatedDate": "2024-1**************",
    "createdDate": "2024-1**************",
    "__v": 0,
    "chain": "Ethereum",
    "uid": "01KH7NPXAX**************"
  },
  {
    "_id": "672c19adc**************",
    "name": "Polygon",
    "chainId": "137",
    "cryptocurrencies": [...],
    "updatedDate": "2024-1**************",
    "createdDate": "2024-1**************",
    "__v": 0,
    "chain": "Polygon",
    "symbol": "MATIC",
    "uid": "01KH7N1B2D**************"
  },
  {
    "_id": "69ea823198**************",
    "__v": 0,
    "chain": "Tron",
    "chainId": "728126428",
    "createdDate": "2026-0**************",
    "cryptocurrencies": [...],
    "name": "TRC-20",
    "symbol": "TRX",
    "uid": "01KHM0PNDZBSGFDE7DP6AQA72N",
    "updatedDate": "2026-0**************"
  },
  {
    "_id": "69ea849098**************",
    "__v": 0,
    "chain": "Solana",
    "createdDate": "2026-0**************",
    "cryptocurrencies": [...],
    "name": "Solana",
    "symbol": "SOL",
    "uid": "01KKZWMEH6**************",
    "updatedDate": "2026-0**************"
  }
]
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                  |
| :------ | :---------------------- | :----------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br />• IP não permitido. |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                         |

---

## Como usar

Para realizar um **Depósito Crypto** (enviar USDT ou USDC da XGate para uma carteira externa), não basta informar a moeda e o valor. É obrigatório informar a **Rede (Blockchain Network)**.

### O que são essas Redes?
Imagine que o **USDT** ou **USDC** é a carga (o dinheiro) e a **Rede Blockchain** é a rodovia por onde essa carga vai passar. Nós trabalhamos com as seguintes redes:

* **Ethereum / ERC-20:** A rede principal do Ethereum. Geralmente possui taxas de gás mais elevadas.
* **Polygon:** Uma rede criada para resolver o problema de escala do Ethereum, oferecendo transações rápidas e com baixo custo.
* **Tron (TRC-20):** Extremamente popular para transações de stablecoins (**utilizada apenas para transações USDT na XGate**), conhecida por sua alta velocidade e taxas muito reduzidas.
* **Solana:** Uma das redes mais rápidas e eficientes do mercado atual, destacando-se por custos de transação quase nulos.

:::danger[Importante]
Se o seu cliente fornecer um endereço de carteira da rede **Solana**, você deve selecionar a rede `Solana` nesta listagem. Enviar pela rede errada (ex: enviar para um endereço Tron usando a rede Ethereum) resultará em **falha na transação** e na **possível perda permanente dos fundos**.
:::
### O Fluxo de Integração

1.  **Consulte as Redes:** Chame este endpoint para obter as opções disponíveis e seus IDs.
2.  **Selecione a Rede:** Deixe seu usuário escolher (ex: "Selecione a rede de destino: ERC-20, TRC-20, Solana ou Polygon") ou selecione via sistema com base no endereço da carteira.
3.  **Monte o Payload:** Pegue o **objeto** da rede escolhida e insira no campo `blockchainNetwork` do payload de saque.

### Exemplo Prático

**1. Objeto de Rede que você recebeu nesta listagem (ex: SOLANA):**
```json
{
  "_id": "69ea849098**************",
  "__v": 0,
  "chain": "Solana",
  "createdDate": "2026-0**************",
  "cryptocurrencies": [...],
  "name": "Solana",
  "symbol": "SOL",
  "uid": "01KKZWMEH6**************",
  "updatedDate": "2026-0**************"
},
```

**2. Como enviar no Saque Crypto (POST /withdraw):**

Observe como o objeto acima é injetado no campo `blockchainNetwork`:

```json {9-15}
{
    "amount": 2,
    "customerId": "6759a16f20***************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT"
    },
    "blockchainNetwork": {
      "_id": "69ea849098**************",
      "chain": "Solana",
      "name": "Solana",
      "symbol": "SOL",
      "uid": "01KKZWMEH6**************"
    },
    "wallet": "0x7A00e4a***************",
    "externalId": "6dd37763a2***************"
}
```

---

## Integração

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
  O exemplo de integração utiliza a biblioteca <code>Axios</code> em Node.js.

    **Instalando `Axios`:**
    ```bash
    npm install axios
    ```

    **Exemplo Javascript:**
```js
const axios = require("axios");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/withdraw/company/blockchain-networks`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        console.log(data); // Response
    } catch (error) {
        console.log(error.response.data.message) // Error
    }
})()
```
  </TabItem>
</Tabs>
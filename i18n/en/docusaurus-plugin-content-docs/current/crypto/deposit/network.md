---
sidebar_label: 'List Networks'
sidebar_position: 3
description: 'This endpoint returns all blockchain networks supported by the platform.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ListDepositBlockchainNetworksTester from '@site/src/components/ListDepositBlockchainNetworksTester';
import AICopyButton from '@site/src/components/AICopyButton';
import CryptoDeprecationNotice from '@site/src/components/CryptoDeprecationNotice';

# List Blockchain Networks

<CryptoDeprecationNotice />

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
      description: Retorna uma lista de todas as redes blockchain suportadas pela plataforma (ex ERC-20, TRC-20, Solana Polygon). O objeto retornado é obrigatório para montar payloads de saque (cash-out) em criptomoedas.
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
                      description: Nome da rede de transferência (ex TRC-20, ERC-20).
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

This endpoint returns all blockchain networks supported by the platform (e.g., Ethereum, BSC, Polygon).

This listing is **fundamental for cryptocurrency withdrawals** to external wallets. Since USDT exists in several different blockchains, you need to specify which network the transfer should occur on so that the deposit arrives correctly.

---
## Endpoint
- **Method:** <span className="badge badge--success">GET</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/deposit/company/blockchain-networks
```

---

## Test Integration

Use the form below to view the available networks.

<ListDepositBlockchainNetworksTester />

---

## Request

The request does not require a body, only the **authentication Headers**.

#### Required Headers

| Header          | Value                | Description                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained from login. |

---

## Responses

### Success (200 OK)

Returns the list of networks.

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

### Common Errors

| Status  | Message                | Likely Reason                                                                                  |
| :------ | :---------------------- | :----------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing Header.<br />• IP not allowed. |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                         |

---

## How to use

To perform a **Crypto Deposit** (sending USDT or USDC from XGate to an external wallet), providing just the currency and the amount isn't enough. It is mandatory to specify the **Blockchain Network**.

### What are these Networks?
Imagine that **USDT** or **USDC** is the cargo (the money) and the **Blockchain Network** is the highway the cargo will travel on. We work with the following networks:

* **Ethereum / ERC-20:** The main Ethereum network. It generally has higher gas fees.
* **Polygon:** A network created to solve Ethereum's scaling issues, offering fast and low-cost transactions.
* **Tron (TRC-20):** Extremely popular for stablecoin transactions (**used only for USDT transactions on XGate**), known for its high speed and very low fees.
* **Solana:** One of the fastest and most efficient networks on the market today, standing out for near-zero transaction costs.

:::danger[Important]
If your client provides a **Solana** network wallet address, you must select the `Solana` network from this list. Sending via the wrong network (e.g., sending to a Tron address using the Ethereum network) will result in **transaction failure** and the **possible permanent loss of funds**.
:::

### The Integration Flow

1.  **Consult the Networks:** Call this endpoint to retrieve the available options and their IDs.
2.  **Select the Network:** Let your user choose (e.g., "Select the destination network: ERC-20, TRC-20, Solana, or Polygon") or systematically select it based on the wallet address.
3.  **Build the Payload:** Take the chosen network's **object** and insert it into the `blockchainNetwork` field of the withdrawal payload.

### Practical Example

**1. Network object that you received from this listing (e.g., SOLANA):**
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
}
```

**2. How to send it in the Crypto Withdrawal (POST /withdraw):**

Notice how the above object is injected into the `blockchainNetwork` field:

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

## Integration

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
  This integration example uses the <code>Axios</code> library in Node.js.

    **Installing `Axios`:**
    ```bash
    npm install axios
    ```

    **JavaScript Example:**
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
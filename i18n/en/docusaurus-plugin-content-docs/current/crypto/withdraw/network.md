---
sidebar_label: 'Listar Redes'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ListBlockchainNetworksTester from '@site/src/components/ListBlockchainNetworksTester';

# Listar Redes Blockchain

Este endpoint retorna todas as redes blockchain suportadas pela plataforma (ex: Ethereum, BSC, Polygon). 

Esta listagem é **fundamental para realizar saques de criptomoedas** para carteiras externas. Como o USDT existe em várias blockchains diferentes, você precisa especificar em qual rede a transferência deve ocorrer para montar o payload de saque corretamente.

---
## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/withdraw/company/blockchain-networks
```

---

## Testar Integração

Utilize o formulário abaixo para visualizar as redes disponíveis.

<ListBlockchainNetworksTester />

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

Retorna a lista de redes. Você precisará do **objeto completo** da rede escolhida.

```json
[
  {
    "_id": "672c15919c9877bbeebb2fb7",
    "name": "ERC-20",
    "chainId": "1",
    "cryptocurrencies": [...],
    "chain": "Ethereum",
    "__v": 0
  },
  {
    "_id": "672c18725a3690d041ea4c8c",
    "name": "BEP-20",
    "chainId": "56",
    "cryptocurrencies": [...],
    "chain": "BSC",
    "__v": 0
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

Para realizar um **Saque Crypto** (enviar USDT da XGate para uma carteira externa), não basta informar a moeda e o valor. É obrigatório informar a **Rede (Blockchain Network)**.

### O que são essas Redes?
Imagine que o **USDT** é a carga (o dinheiro) e a **Rede Blockchain** é a rodovia por onde essa carga vai passar. Nós trabalhamos principalmente com:

* **Ethereum / ERC-20:** A rede principal do Ethereum. Geralmente possui taxas de gás mais elevadas.
* **BEP-20 (BSC):** A rede da Binance Smart Chain. Conhecida por taxas mais baixas e alta velocidade.
* **Polygon:** Uma rede de segunda camada (Layer 2) focada em escalabilidade e baixo custo.

Se o seu cliente fornecer um endereço de carteira da rede **Polygon**, você **deve** selecionar a rede `Polygon` nesta listagem. Enviar pela rede errada (ex: enviar para um endereço Polygon usando a rede Ethereum) pode resultar em falha na transação ou custos elevados desnecessários.

### O Fluxo de Integração

1.  **Consulte as Redes:** Chame este endpoint para obter as opções disponíveis e seus IDs.
2.  **Selecione a Rede:** Deixe seu usuário escolher (ex: "Selecione a rede de destino: ERC-20, BEP-20 ou Polygon") ou selecione via sistema com base no endereço da carteira.
3.  **Monte o Payload:** Pegue o **objeto completo** da rede escolhida e insira no campo `blockchainNetwork` do payload de saque.

### Exemplo Prático

**1. Objeto de Rede que você recebeu nesta listagem (ex: BEP-20):**
```json
{
    "_id": "6733a3a200**************",
    "name": "BEP-20",
    "chainId": "56",
    "cryptocurrencies": [],
    "updatedDate": "202******************",
    "createdDate": "202******************",
    "__v": 0,
    "chain": "BSC",
    "symbol": "BNB"
},
```

**2. Como enviar no Saque Crypto (POST /withdraw):**

Observe como o objeto acima é injetado no campo `blockchainNetwork`:

```json {9-19}
{
    "amount": 2,
    "customerId": "6759a16f20***************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT"
    },
    "blockchainNetwork": {
        "_id": "6dd37763a2***************",
        "name": "BEP-20",
        "chainId": "56",
        "cryptocurrencies": [],
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0,
        "chain": "BSC",
        "symbol": "BNB"
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
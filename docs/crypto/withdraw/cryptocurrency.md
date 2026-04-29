---
sidebar_label: 'Criptomoedas'
sidebar_position: 1
description: 'Este endpoint retorna todas as criptomoedas disponíveis para saque na conta.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ListCryptoCurrenciesTester from '@site/src/components/ListCryptoCurrenciesTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Listar Criptomoedas

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Listar Criptomoedas para Saque
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /withdraw/company/cryptocurrencies:
    get:
      summary: Listar Criptomoedas para Saque
      description: Retorna uma lista de todas as criptomoedas (ex USDT) disponíveis para a conta da empresa para operações de cash-out. O objeto retornado é necessário para compor o payload de saques com ou sem conversão.
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Sucesso. Lista de criptomoedas recuperada corretamente.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    _id:
                      type: string
                      description: ID único da criptomoeda.
                    name:
                      type: string
                      description: Nome da criptomoeda (ex USDT).
                    symbol:
                      type: string
                      description: Símbolo representativo da moeda (ex USDT).
                    coinGecko:
                      type: string
                      description: Identificador da moeda na API do CoinGecko.
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

Este endpoint retorna todas as criptomoedas disponíveis para a sua conta. Use esta rota para consultar os dados necessários para criar requisições de pedido de saque.

---
## Endpoint
- **Método:** <span className="badge badge--success">GET</span>
```bash title="URL do Endpoint"
https://api.xgateglobal.com/withdraw/company/cryptocurrencies
```

---

## Testar Integração

Utilize o formulário abaixo para simular a listagem de criptomoedas.

<ListCryptoCurrenciesTester />

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

Retorna uma lista (array) de objetos, onde cada objeto é uma criptomoeda.

```json
[
  {
    "_id": "6733a2a90******************",
    "name": "USDT",
    "symbol": "USDT",
    "coinGecko": "tether",
    "updatedDate": "202******************",
    "createdDate": "202******************",
    "__v": 0
  }
]
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido. |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                          |

---

## Como usar

A principal finalidade de listar as criptomoedas é permitir a seleção da criptomoeda correta para criar um pedido de saque (**Withdraw Order**).

A resposta deste endpoint fornece o **Objeto Completo** da criptomoeda, permitindo a construção do payload de criação do pedido.

### O Fluxo de Integração

1.  **Liste as moedas:** Chame este endpoint (`GET /deposit/company/cryptocurrencies`).
2.  **Seleção:** Identifique a criptomoeda desejada na lista (geralmente filtrando pelo `name` ou `symbol`, ex: "USDT").
3.  **Envio:** Você deve passar o **objeto** dentro da propriedade `cryptocurrency` no payload de criação do pedido. Na documentação de <a href={useBaseUrl('/docs/crypto/deposit/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>criação de depósito crypto</a> são mostrados os valores **obrigatórios**.

### Exemplo Prático

**1. O que você recebe ao listar as moedas fiduciárias:**
```json
[
  {
    "_id": "67339b18ca5******************",
    "name": "USDT",
    "symbol": "USDT",
    "coinGecko": "tether",
    "updatedDate": "2024-1****************",
    "createdDate": "2024-1*****************",
    "__v": 0
  }
]
```

**2. Como você deve enviar no depósito (POST /withdraw):**

Você vai pegar o objeto acima e injetá-lo dentro de `cryptocurrency`:
```json {13-21}
{
    "amount": 2,
    "customerId": "123456**************",
    "currency": {
        "_id": "10203040**************",
        "name": "BRL",
        "type": "PIX",
        "symbol": "R$",
        "createdDate": "202*********************",
        "updatedDate": "202*********************",
        "__v": 0
    },
    "cryptocurrency": {
        "_id": "100200300**************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0
    },
    "pixKey": {
        "key": "123**************",
        "type": "CPF",
        "_id": "152535**************"
    },
    "externalId": "123**************"
}
```
Cada informação desse JSON será explicado na <a href={useBaseUrl('/docs/crypto/withdraw/create-fiat')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>página de criar pedido de saque crypto para FIAT</a>.

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
    const customerId = "************";
    const amount = 10.90;

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const cryptocurrencies = await axios.get(`${url_api}/withdraw/company/cryptocurrencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const currencies = await axios.get(`${url_api}/withdraw/company/currencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const pixKey = await axios.get(`${url_api}/pix/customer/${customerId}/key`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/withdraw/conversion/brl/pix`, {
            amount,
            customerId,
            currency: currencies.data[0],
            cryptocurrency: cryptocurrencies.data[0],
            pixKey: pixKey.data[0]
        }, {
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
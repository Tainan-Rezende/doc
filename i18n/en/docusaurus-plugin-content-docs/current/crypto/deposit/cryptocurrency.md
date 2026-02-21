---
sidebar_label: 'Criptomoedas'
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ListCryptoCurrenciesTester from '@site/src/components/ListCryptoCurrenciesTester';

# Listar Criptomoedas

Este endpoint retorna todas as criptomoedas disponíveis para a sua conta. Use esta rota para consultar os dados necessários para criar requisições de pedido de depósito.

---
## Endpoint
- **Método:** <span className="badge badge--success">GET</span>
```bash title="URL do Endpoint"
https://api.xgateglobal.com/deposit/company/cryptocurrencies
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

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido. |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                          |

---

## Como usar

A principal finalidade de listar as criptomoedas é permitir a seleção da criptomoeda correta para criar um pedido de depósito (**Deposit Order**).

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

**2. Como você deve enviar no depósito (POST /deposit):**

Você vai pegar o objeto acima e injetá-lo dentro de `cryptocurrency`:
```json {13-21}
{
  "amount": 2,
  "customerId": "672f40**************",
  "currency": {
    "_id": "6722ba**************",
    "name": "BRL",
    "type": "PIX",
    "createdDate": "202*********************",
    "updatedDate": "202*********************",
    "__v": 0,
    "symbol": "R$"
  },
  "cryptocurrency": {
    "_id": "67ce09d**************",
    "name": "USDT",
    "symbol": "USDT",
    "coinGecko": "usdt",
    "updatedDate": "202*********************",
    "createdDate": "202*********************",
    "__v": 0
  },
  "externalId": "67ce09d**************"
}
```
Cada informação desse JSON será explicado na <a href={useBaseUrl('/docs/crypto/deposit/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>página de criar pedido de depósito crypto</a>.

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
        const { data } = await axios.get(`${url_api}/deposit/company/cryptocurrencies`, {
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
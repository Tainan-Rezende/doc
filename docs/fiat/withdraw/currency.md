---
sidebar_label: 'Moedas FIAT'
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ListWithdrawCurrenciesTester from '@site/src/components/ListWithdrawCurrenciesTester';

# Listar Moedas

Este endpoint retorna todas as moédas fiduciárias disponíveis para a sua conta. Use esta rota para consultar e criar a requisição para pedido de saque.

---
## Endpoint
- **Método:** <span className="badge badge--success">GET</span>
```bash title="URL do Endpoint"
https://api.xgateglobal.com/withdraw/company/currencies
```

---

## Testar Integração

Utilize o formulário abaixo para simular a listagem de moedas fiduciárias.

<ListWithdrawCurrenciesTester />

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

Retorna uma lista (array) de objetos, onde cada objeto é uma chave cadastrada.

```json
[
  {
    "key": "+5512************",
    "type": "PHONE",
    "_id": "68fa5d54004*************"
  }
]
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido. |
| **404** | `Not Found`             | Cliente não encontrado.                                                                           |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                          |

---

## Como usar

A principal finalidade de listar as moedas fiduciárias é permitir a seleção da moeda correta para criar um pedido de saque (**Withdraw Order**).

A resposta deste endpoint fornece o **Objeto Completo** da moeda, que é obrigatório na construção do payload de criação do pedido.

### O Fluxo de Integração

1.  **Liste as moedas:** Chame este endpoint (`GET /withdraw/company/currencies`).
2.  **Seleção:** Identifique a moeda desejada na lista (geralmente filtrando pelo `name` ou `symbol`, ex: "BRL").
3.  **Envio:** Você deve passar o **objeto** dentro da propriedade `currency` no payload de criação do pedido, na documentação de <a href={useBaseUrl('/docs/fiat/withdraw/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>criação de saque</a> é mostrado os valores **obrigatórios**.

### Exemplo Prático

**1. O que você recebe ao listar as moedas fiduciárias:**
```json
[
  {
    "_id": "6728f0a2cba**************",
    "name": "BRL",
    "type": "PIX",
    "createdDate": "2024-1**************Z",
    "updatedDate": "2024-1**************",
    "__v": 0,
    "symbol": "R$"
  }
]
```

**2. Como você deve enviar no saque (POST /withdraw):**

Você vai pegar o objeto acima e injetá-lo dentro de `currency`:
```json {4-12}
{
    "amount": 0.2,
    "customerId": "68e7b8****************",
    "currency": {
        "_id": "6728f0a2cba**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-1**************Z",
        "updatedDate": "2024-1**************",
        "__v": 0,
        "symbol": "R$"
    },
    "pixKey": {
        "key": "+5512************",
        "type": "PHONE",
        "_id": "68fa5d54004*************"
    }
}
```
Cada informação desse JSON será explicado na <a href={useBaseUrl('/docs/fiat/withdraw/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>página de criar pedido de saque</a>.

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
        const { data } = await axios.get(`${url_api}/withdraw/company/currencies`, {
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
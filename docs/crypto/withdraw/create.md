---
sidebar_label: 'Criar Saque para FIAT'
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import WithdrawFiatToCryptoTester from '@site/src/components/CreateWithdrawConversion';

# Criar Pedido de Saque (Crypto → FIAT)

Este endpoint permite que o cliente realize o resgate de seus ativos digitais com **conversão automática para moeda fiduciária**. Na prática, o sistema processa a venda da criptomoeda (ex: USDT) e realiza o pagamento equivalente em BRL diretamente via **Pix** para a chave cadastrada.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/withdraw
```

---

## Testar Integração

Utilize o formulário abaixo para simular a criação de um pedido de conversão Crypto para FIAT.

<WithdrawFiatToCryptoTester />

---

## Requisição

É necessário enviar o **Header** de autenticação e o **Body** com os dados do pedido.

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

#### Body (Corpo da Requisição)

| Campo            | Tipo     | Obrigatório | Descrição                                       |
| :--------------- | :------- | :---------: | :---------------------------------------------- |
| `amount`         | `number` |   **Sim**   | O valor do saque em USDT (ex: `0.1` min).       |
| `customerId`     | `string` |   **Sim**   | O ID único (`_id`) do cliente que fará o saque. |
| `currency`       | `object` |   **Sim**   | A moeda da transação (ex: `BRL`).               |
| `cryptocurrency` | `object` |   **Sim**   | A criptomoeda da transação (ex: `USDT`).        |
| `pixKey`         | `object` |   **Sim**   | A chave pix do cliente para realizar o saque.   |
| `externalId`     | `string` |   **Não**   | Idempotência.                                   |

---

## Respostas (Responses)

### Sucesso (201 Created)

Retorna o objeto do pedido criado, contendo informações do `status` e o `_id` da transação.

```json
{
  "message": "Solicitação de Saque realizada com sucesso",
  "status": "PENDING",
  "_id": "69849e8c50****************"
}
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                  |
| :------ | :---------------------- | :----------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br />• IP não permitido. |
| **404** | `Not Found`             | Cliente informado no campo `customerId` não existe.                                              |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                         |

---

## Como usar

A finalidade deste endpoint é iniciar o fluxo de saída de dinheiro com conversão Crypto para BRL (**Cash-out**).

### O Fluxo de Integração

1.  **Identifique o Cliente:** Certifique-se de que o usuário existe na XGate (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>) e tenha o `_id` dele.
2.  **Cadastre uma Chave Pix:** Após criar o cliente, é necessário estar cadastrando uma chave pix para o mesmo em <a href={useBaseUrl('/docs/fiat/pix/add')} target="_blank">Adicionar Chave Pix</a>.
3.  **Dados de moeda:** Será necessário buscar os dados da moeda e criptomoeda para adicionar na requisição, você pode obter em <a href={useBaseUrl('/docs/fiat/withdraw/currency')} target="_blank">Moedas FIAT</a> e <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">Criptomoedas</a>.
4.  **Crie o Pedido:** Chame este endpoint enviando os dados de amount, customerId, currency, cryptocurrency e pixKey.
5.  **Aguarde o Pagamento:** O status inicial será `PENDING`.

### Exemplo Prático

Para criar pedidos de saque convertendo Crypto para BRL, você deve seguir esses 4 passos:

:::tip[Recomendação]
É necessário criar um cliente antes de processeguir para criação de saque.

Você pode estar **<a href={useBaseUrl('/docs/customer/create')} target="_blank">clicando aqui</a>** para ir para a página de documentação de criação de cliente.
:::
>
**1. Passe o `_id` do cliente como `customerId`, igual no campo destacado:**
```json {3}
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
    "pixKey": {
        "key": "123**************",
        "type": "CPF",
        "_id": "152535**************"
    },
    "externalId": "67ce09d**************"
}
```

**2. Passo:** Você deve obter a moeda fiduciária com os dados para saque. 

Você pode obter a lista delas <a href={useBaseUrl('/docs/fiat/withdraw/currency')} target="_blank">clicando aqui</a>.

```json {4-12}
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
    "pixKey": {
        "key": "123**************",
        "type": "CPF",
        "_id": "152535**************"
    },
    "externalId": "67ce09d**************"
}
```

**3. Passo:** Você deve obter a criptomoeda para realizar a conversão de saque. 

Você pode obter a lista delas <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">clicando aqui</a>.

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
    "pixKey": {
        "key": "123**************",
        "type": "CPF",
        "_id": "152535**************"
    },
    "externalId": "67ce09d**************"
}
```

**3. Passo:** Você deve obter os dados da chave pix e informar no payload para o saque ser realizado. 

Você pode obter a lista das chaves pix cadastradas <a href={useBaseUrl('/docs/fiat/pix/keys')} target="_blank">clicando aqui</a> ou então  <a href={useBaseUrl('/docs/fiat/pix/add')} target="_blank">adicionar uma nova chave pix</a>.

```json {22-26}
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
    "pixKey": {
        "key": "123**************",
        "type": "CPF",
        "_id": "152535**************"
    },
    "externalId": "67ce09d**************"
}
```

**5. Passo (Opcional):** Adicione o `externalId` ao final do código, ele irá evitar que o cliente envie mais de 1 (uma) vez a solicitação de saque, **evitando duplicidade**.
```json {27}
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
    "pixKey": {
        "key": "123**************",
        "type": "CPF",
        "_id": "152535**************"
    },
    "externalId": "67ce09d**************"
}
```

#### Detalhes do Objeto

Veja os detalhes de cada informação no objeto `currency` para montar sua requisição.

| Campo         | Tipo     | Obrigatório | Descrição                                                   |
| :------------ | :------- | :---------: | :---------------------------------------------------------- |
| `_id`         | `string` |   **Sim**   | Identificador único da moeda.                               |
| `name`        | `string` |   **Sim**   | Nome da moeda.                                              |
| `type`        | `string` |   **Sim**   | Tipo do método de pagamento ou transação associado à moeda. |
| `createdDate` | `string` |   **Não**   | Data em que a moeda foi criada no sistema.                  |
| `updatedDate` | `string` |   **Não**   | Data da última atualização das informações da moeda.        |
| `__v`         | `number` |   **Não**   | Versão do registro da moeda no banco de dados.              |
| `symbol`      | `string` |   **Sim**   | Símbolo da moeda.                                           |


Veja os detalhes de cada informação no objeto `cryptocurrency` para montar sua requisição.

| Campo         | Tipo     | Obrigatório | Descrição                                                  |
| :------------ | :------- | :---------: | :--------------------------------------------------------- |
| `_id`         | `string` |   **Sim**   | Identificador único da criptomoeda.                        |
| `name`        | `string` |   **Sim**   | Nome da criptomoeda.                                       |
| `symbol`      | `string` |   **Sim**   | Símbolo da criptomoeda.                                    |
| `coinGecko`   | `string` |   **Não**   | Identificador da criptomoeda no CoinGecko.                 |
| `updatedDate` | `string` |   **Não**   | Data da última atualização das informações da criptomoeda. |
| `createdDate` | `string` |   **Não**   | Data em que a criptomoeda foi criada no sistema.           |
| `__v`         | `number` |   **Não**   | Versão do registro da criptomoeda no banco de dados.       |

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
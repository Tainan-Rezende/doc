---
sidebar_label: 'Criar Depósito'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CreatePixDepositTester from '@site/src/components/CreatePixDepositTester';

# Criar Pedido de Depósito

Este endpoint permite gerar uma ordem de depósito (intenção de pagamento) para um cliente específico. Ao criar a ordem, o sistema retorna os dados necessários para que o usuário final realize o pagamento via Pix.

Todo pedido é obrigatoriamente associado a um usuário. Isso garante que o valor seja creditado para o cliente correto em sua plataforma, além de **facilitar a conciliação automática** e manter um **histórico organizado** de todas as transações.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/deposit
```

---

## Testar Integração

Utilize o formulário abaixo para simular a criação de um pedido e gerar o QR Code.

<CreatePixDepositTester />

---

## Requisição

É necessário enviar o **Header** de autenticação e o **Body** com os dados do pedido.

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

#### Body (Corpo da Requisição)

| Campo        | Tipo     | Obrigatório | Descrição                                                               |
| :----------- | :------- | :---------: | :---------------------------------------------------------------------- |
| `amount`     | `number` |   **Sim**   | O valor do depósito (ex: `100.50`).                                     |
| `customerId` | `string` |   **Não**   | O ID único (`_id`) do cliente que fará o depósito.                      |
| `customer`   | `object` |   **Não**   | Dados para a criação do cliente junto da criação do pedido de depósito. |
| `currency`   | `string` |   **Sim**   | A moeda da transação (ex: `BRL`).                                       |
| `externalId` | `string` |   **Não**   | Idempotência                                                            |


:::warning[Importante]
Apesar dos dados da string `customerId` e do objeto `customer` não serem obrigatórios, é **OBRIGATÓRIO** utilizar um deles. 

**Não se deve utilizar `customerId` e `customer` na mesma requisição**
:::

:::warning[Importante]
Recomendamos a inclusão dado de `externalId` na requisição pois a mesmo evita o envio do pedido mais de uma vez, que pode acontecer acidentalmente.
:::

---

## Respostas (Responses)

### Sucesso (201 Created)

Retorna o objeto do pedido criado, contendo o `code` (Pix Copia e Cola) para o usuário pagar.

```json
{
  "message": "Pix Gerado com Sucesso",
  "data": {
    "status": "WAITING_PAYMENT",
    "code": "00020126850014br.gov.bcb.pix2563pi************************************************************************************",
    "id": "696e28a43e09**************",
    "customerId": "68e7b8f0db**************"
  }
}
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                  |
| :------ | :---------------------- | :----------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br />• IP não permitido. |
| **404** | `Not Found`             | Cliente informado no campo `customerId` não existe.                                                |
| **409** | `Conflict`              | • Nome do cliente informado já está cadastrado.<br />• Documento informado já está cadastrado.   |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                         |

---

## Como usar

A finalidade deste endpoint é iniciar o fluxo de entrada de dinheiro (**Cash-in**).

O retorno mais importante aqui é o campo `code`. Ele contém a string do "Pix Copia e Cola". Você deve exibir esse código para o seu usuário final ou gerar um QR Code visual a partir dele.

### O Fluxo de Integração

1.  **Crie/Identifique o Cliente:** Certifique-se de que o usuário existe na XGate (<a href={useBaseUrl('/docs/customer/create')} target="_blank"><a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a></a>) e tenha o `_id` dele.
2.  **Crie o Pedido:** Chame este endpoint passando o valor e o ID do cliente.
3.  **Exiba o Pix:** Pegue o `code` da resposta e mostre ao usuário.
4.  **Aguarde o Pagamento:** O status inicial será `PENDING`. Assim que o usuário pagar, o status mudará (via Webhook ou consulta).  

### Exemplo Prático

Para criar pedidos de depósito Pix, você deve ter 2 dados:


**1. Passo:** Aqui você tem as opções de criar o pedido de depósito sem um cliente ainda criado pela rota (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>) ou com um já criado.

:::tip[Recomendação]
A equipe XGate recomenda que o cliente seja criado pela rota de criação de clientes (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>).

Você pode estar **<a href={useBaseUrl('/docs/customer/create')} target="_blank">clicando aqui</a>** para ir para a página de documentação de criação de cliente.
:::
<Tabs>
    <TabItem value="with-client" label="Com Cliente">
**1. Passe o `_id` do cliente como `customerId`, igual no campo destacado:**
```json {3}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-11-04T16:04:50.019Z",
        "updatedDate": "2024-11-07T02:23:38.606Z",
        "__v": 0,
        "symbol": "R$"
    }
}
```
    </TabItem>
    <TabItem value="no-client" label="Sem Cliente">
    **1. Você deve passar o objeto `customer` que irá criar o cliente ao mesmo tempo em que cria o pedido de depósito:**
    ```json {3-8}
    {
    "amount": 0.2,
    "customer": {
        "name": "Client Name",
        "document": "12345678900",
        "phone": "+55123456789",
        "email": "client@domain.com"
    },
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-11-04T16:04:50.019Z",
        "updatedDate": "2024-11-07T02:23:38.606Z",
        "__v": 0,
        "symbol": "R$"
    }
}
    ```
    :::warning[Importante]
    Os dados `name` e `document` são **obrigatórios**.  
    :::
    </TabItem>
</Tabs>

**2. Passo:** Você deve obter a moeda fiduciária para qual está realizando o depósito. 

Você pode obter a lista delas <a href={useBaseUrl('/docs/fiat/deposit/currency')} target="_blank">clicando aqui</a>.

```json {4-12}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-11-04T16:04:50.019Z",
        "updatedDate": "2024-11-07T02:23:38.606Z",
        "__v": 0,
        "symbol": "R$"
    }
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
| `symbol`      | `number` |   **Sim**   | Símbolo da moeda.                                           |

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
    const customerId = "*************";
    const amount = 10.90;

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const currencies = await axios.get(`${url_api}/deposit/company/currencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/deposit`, {
            amount,
            customerId,
            currency: currencies.data[0]
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
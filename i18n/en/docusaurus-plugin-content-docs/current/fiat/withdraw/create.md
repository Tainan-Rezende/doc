---
sidebar_label: 'Criar Saque'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CreatePixWithdrawTester from '@site/src/components/CreatePixWithdrawTester';

# Criar Pedido de Saque

Este endpoint permite gerar uma ordem de saque (retirada de fundos) para um cliente específico. Ao criar a ordem, o sistema processa o envio do valor para a chave Pix de destino informada.

Todo pedido é obrigatoriamente associado a um usuário. Isso garante que o valor seja debitado do saldo correto em sua plataforma, além de oferecer **segurança na transação** e manter um **histórico organizado** de todas as saídas.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/withdraw
```

---

## Testar Integração

Utilize o formulário abaixo para simular a criação de um pedido de saque.

<CreatePixWithdrawTester />

---

## Requisição

É necessário enviar o **Header** de autenticação e o **Body** com os dados do pedido.

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

#### Body (Corpo da Requisição)

| Campo        | Tipo     | Obrigatório | Descrição                                          |
| :----------- | :------- | :---------: | :------------------------------------------------- |
| `amount`     | `number` |   **Sim**   | O valor do depósito (ex: `100.50`).                |
| `customerId` | `string` |   **Não**   | O ID único (`_id`) do cliente que fará o depósito. |
| `currency`   | `string` |   **Sim**   | A moeda da transação (ex: `BRL`).                  |
| `externalId` | `string` |   **Não**   | Idempotência                                       |

:::warning[Importante]
Recomendamos a inclusão dado de `externalId` na requisição pois o mesmo evita o envio do pedido mais de uma vez, que pode acontecer acidentalmente.
:::

---

## Respostas (Responses)

### Sucesso (201 Created)

Retorna o objeto do pedido criado, contendo o `_id` da transação e o `status` do pedido.

```json
{
    "message": "Solicitação de Saque realizada com sucesso",
    "status": "PENDING",
    "_id": "696ee03f66d708604799f67f"
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

A finalidade deste endpoint é realizar a saída de valores (**Cash-out**), transferindo fundos da sua conta para a chave Pix de destino do cliente.

Ao contrário do depósito, aqui a ação é passiva para o usuário: ele apenas aguarda o recebimento do valor em sua conta bancária.

### O Fluxo de Integração

1.  **Prepare os Dados:** Antes de chamar este endpoint, você já deve ter recuperado o **Objeto Completo** da Chave Pix do cliente e o **Objeto** da Moeda (conforme explicado nos passos anteriores).
2.  **Solicite o Saque:** Chame este endpoint passando o valor, o ID do cliente e os objetos de chave e moeda.
3.  **Confirmação:** A API retornará o status da transação (ex: `PENDING` ou `PAID`).
4.  **Finalização:** O sistema processa a transferência bancária. O saldo do cliente deve ser atualizado na sua plataforma assim que o status confirmar o sucesso.

:::info[Validação de Saldo]
Certifique-se de que sua conta na XGate possui saldo disponível suficiente para cobrir o valor do saque, caso contrário a requisição poderá retornar erro de saldo insuficiente.
:::

### Exemplo Prático

Para criar pedidos de saque pix, você deve ter 3 dados:

**1. Dado:** Você deve ter o **ID do cliente**, que é informado na resposta ao criar (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>).

```json {3}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-1**************",
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

**2. Dado:** Você deve obter a moeda fiduciária para qual está realizando o saque. 

Você pode obter a lista delas <a href={useBaseUrl('/docs/fiat/withdraw/currency')} target="_blank">clicando aqui</a>.

```json {4-12}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-1**************",
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

**3. Dado:** Você deve obter a lista de chave pix do cliente e selecionar uma para colocar na requisição.

Você pode obter a lista delas <a href={useBaseUrl('/docs/pix/keys')} target="_blank">clicando aqui</a>.

```json {13-17}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-1**************",
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
    const key = "***********";
    const type = "CPF"

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const currencies = await axios.get(`${url_api}/withdraw/company/currencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const pixKeys = await axios.get(`${url_api}/pix/customer/${customerId}/key`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/withdraw`, {
            amount,
            customerId,
            currency: currencies.data[0],
            pixKey: pixKeys.data[0]
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
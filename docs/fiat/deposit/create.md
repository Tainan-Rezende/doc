---
sidebar_label: 'Criar Depósito'
sidebar_position: 2
description: 'Este endpoint permite gerar uma ordem de depósito (intenção de pagamento) para um cliente específico. Ao criar a ordem, o sistema retorna os dados necessários para que o usuário final realize o pagamento via Pix.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CreatePixDepositTester from '@site/src/components/CreatePixDepositTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Criar Pedido de Depósito

<div className="ai-btn-wrapper">
<AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Criar Pedido de Depósito
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /deposit:
    post:
      summary: Criar Pedido de Depósito (Pix)
      description: Inicia um fluxo de cash-in criando um pedido de depósito. Retorna o código Pix (Copia e Cola) necessário para o pagamento do usuário final.
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - amount
                - currency
              properties:
                amount:
                  type: number
                  description: O valor do depósito (ex 100.50).
                customerId:
                  type: string
                  description: ID único do cliente. Não envie este campo se for utilizar o objeto 'customer'.
                customer:
                  type: object
                  description: Dados para criar o cliente junto com a ordem. Não envie este campo se utilizar o 'customerId'.
                  required:
                    - name
                    - document
                  properties:
                    name:
                      type: string
                    document:
                      type: string
                    phone:
                      type: string
                    email:
                      type: string
                      format: email
                currency:
                  type: object
                  description: Objeto com a moeda fiduciária para o depósito (obtido na rota de moedas de depósito).
                  required:
                    - _id
                    - name
                    - type
                    - symbol
                  properties:
                    _id:
                      type: string
                    name:
                      type: string
                    type:
                      type: string
                    symbol:
                      type: string
                externalId:
                  type: string
                  description: Identificador de idempotência para controle interno do integrador.
                identifiedDocumentPix:
                  type: boolean
                  description: Quando definido como true, força a validação da titularidade/documento no Pix, independentemente da configuração padrão da conta.
      responses:
        '201':
          description: Sucesso. Retorna a ordem gerada, incluindo o código Pix Copia e Cola no campo data.code.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Pix Gerado com Sucesso
                  data:
                    type: object
                    properties:
                      status:
                        type: string
                        example: WAITING_PAYMENT
                      code:
                        type: string
                        description: Linha digitável (Pix Copia e Cola)
                      id:
                        type: string
                      customerId:
                        type: string
                      externalId:
                        type: string
                        description: Retornado quando enviado na requisição.
                  warnings:
                    type: array
                    description: Avisos não bloqueantes. Ex. CRYPTOCURRENCY_FIELD_IGNORED quando o campo cryptocurrency é enviado (ignorado a partir de 29/10/2026).
                    items:
                      type: object
                      properties:
                        code:
                          type: string
                        message:
                          type: string
        '401':
          description: Unauthorized. Token inválido, ausente ou IP bloqueado.
        '404':
          description: Not Found. O customerId fornecido não existe na base.
        '422':
          description: Política de pagador da empresa violada. Corpo { reason, message } com reason PAYER_TYPE_NOT_ALLOWED, DEPOSIT_TITULARITY_CUSTOMER_DOCUMENT_REQUIRED, PAYER_DOCUMENT_MISSING, PIX_POLICY_REQUIRES_PIX_V2 ou PIX_POLICY_PROVIDER_WITHOUT_PAYER.
        '503':
          description: PIX_POLICY_NOT_CONFIGURED. A política de Pix da empresa não está configurada.
        '409':
          description: Conflict. Conflito nos dados do customer (nome ou documento já cadastrado).
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

| Campo                   | Tipo      | Obrigatório | Descrição                                                               |
| :---------------------- | :-------- | :---------: | :---------------------------------------------------------------------- |
| `amount`                | `number`  |   **Sim**   | O valor do depósito (ex: `100.50`).                                     |
| `customerId`            | `string`  |   **Não**   | O ID único (`_id`) do cliente que fará o depósito.                      |
| `customer`              | `object`  |   **Não**   | Dados para a criação do cliente junto da criação do pedido de depósito. |
| `currency`              | `string`  |   **Sim**   | A moeda da transação (ex: `BRL`).                                       |
| `externalId`            | `string`  |   **Não**   | Idempotência                                                            |
| `identifiedDocumentPix` | `boolean` |   **Não**   | Quando `true`, força a verificação de titularidade do documento no Pix. |

:::warning[Campo `cryptocurrency` ignorado a partir de 29/10/2026]
O depósito com conversão para cripto é descontinuado em 29/10/2026. A partir dessa data, envie apenas `currency`: se o campo `cryptocurrency` for enviado, ele é **ignorado**, o depósito é criado em BRL e a resposta traz o aviso `CRYPTOCURRENCY_FIELD_IGNORED` em `warnings`. Para obter cripto, use a <a href={useBaseUrl('/docs/buy-sell/overview')}>Compra de Cripto</a> com o saldo em BRL.
:::

:::info[Sobre a validação de titularidade]
O envio do parâmetro `identifiedDocumentPix` com o valor `false` (ou a ausência dele) **não desativa** a checagem de titularidade caso ela esteja configurada como **obrigatória** no painel administrativo da XGate para a sua conta. 

Este parâmetro serve estritamente para **forçar** a validação (enviando `true`) em contas onde a regra padrão do painel está desativada. Para desativar a verificação de titularidade de forma definitiva, é necessário alinhar comercialmente via contrato.
:::

:::warning[Importante: Identificação do Cliente]
Para criar um depósito, é **obrigatório** identificar o utilizador. Você deve enviar o `customerId` (caso o cliente já exista) **OU** o objeto `customer` (para criar um novo cliente no momento do pedido). 

Nunca envie ambos os campos na mesma requisição, pois isso resultará em falha na transação.
:::

:::tip[Boas Práticas: Prevenção de Duplicidade]
Recomendamos fortemente o envio do campo `externalId`. Ele atua como uma chave de idempotência, garantindo que o mesmo pedido de depósito não seja criado em duplicidade em caso de falha de rede, cliques duplos ou retentativas acidentais pelo seu sistema.
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
    "customerId": "68e7b8f0db**************",
    "externalId": "pedido-7781"
  }
}
```

O campo `externalId` é retornado quando foi enviado na requisição.

#### Avisos (`warnings`)

A resposta pode trazer avisos que **não impedem** a criação do depósito. Exemplo, quando o campo `cryptocurrency` é enviado a partir de 29/10/2026:

```json
{
  "message": "Pix Gerado com Sucesso",
  "data": {
    "status": "WAITING_PAYMENT",
    "code": "00020126850014br.gov.bcb.pix2563pi************",
    "id": "696e28a43e09**************",
    "customerId": "68e7b8f0db**************",
    "externalId": "pedido-7781"
  },
  "warnings": [
    {
      "code": "CRYPTOCURRENCY_FIELD_IGNORED",
      "message": "O campo cryptocurrency não é mais suportado; o depósito foi criado em BRL. Use purchase{} para comprar cripto."
    }
  ]
}
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                  |
| :------ | :---------------------- | :----------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br />• IP não permitido. |
| **404** | `Not Found`             | Cliente informado no campo `customerId` não existe.                                              |
| **409** | `Conflict`              | • Nome do cliente informado já está cadastrado.<br />• Documento informado já está cadastrado.   |
| **422** | `{ reason, message }`   | Violação da política de pagador da empresa. Veja a tabela abaixo.                                |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                         |
| **503** | `PIX_POLICY_NOT_CONFIGURED` | A política de Pix da empresa não está configurada. Entrar em contato com suporte.            |

#### Política de pagador

Cada empresa pode ter regras para depósitos pela API: tipo de pagador (PF/PJ), titularidade (documento do customer ou CNPJ da empresa) e limites. Quando a regra é violada na criação do depósito, a API responde `422` com o corpo `{ "reason", "message" }`:

| Reason                                          | Motivo                                                                                   |
| :---------------------------------------------- | :--------------------------------------------------------------------------------------- |
| `PAYER_TYPE_NOT_ALLOWED`                        | O tipo de pagador (PF/PJ) não é permitido pela política da empresa.                      |
| `DEPOSIT_TITULARITY_CUSTOMER_DOCUMENT_REQUIRED` | A política exige titularidade e o customer não tem documento.                            |
| `PAYER_DOCUMENT_MISSING`                        | O documento do pagador é necessário e não foi informado.                                 |
| `PIX_POLICY_REQUIRES_PIX_V2`                    | A política configurada exige o Pix v2, não disponível para esta conta.                   |
| `PIX_POLICY_PROVIDER_WITHOUT_PAYER`             | O provedor do Pix não informa o pagador, o que é exigido pela política.                  |

#### Status `PAYER_REJECTED`

Quando um Pix pago viola uma regra de pagador que não pôde ser barrada na criação da cobrança (ex: tipo PF/PJ sem documento do pagador), o depósito fica com status `PAYER_REJECTED` e **o valor é devolvido ao pagador**. A consulta do depósito traz o objeto `payerRuleViolation`:

```json
{
  "status": "PAYER_REJECTED",
  "payerRuleViolation": {
    "reason": "PAYER_TYPE_NOT_ALLOWED",
    "at": "2026-10-13T14:00:00.000Z",
    "refundedAt": "2026-10-13T14:00:05.000Z",
    "payer": { "name": "Fulano de Tal", "document": "***.456.789-**", "bank": "Banco Exemplo" }
  }
}
```

---

## Como usar

A finalidade deste endpoint é iniciar o fluxo de entrada de dinheiro (**Cash-in**).

O retorno mais importante aqui é o campo `code`. Ele contém a string do "Pix Copia e Cola". Você deve exibir esse código para o seu usuário final ou gerar um QR Code visual a partir dele.

### O Fluxo de Integração

1.  **Crie/Identifique o Cliente:** Certifique-se de que o usuário existe na XGate (<a href={useBaseUrl('/docs/customer/create')} target="_blank"><a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a></a>) e tenha o `_id` dele.
2.  **Crie o Pedido:** Chame este endpoint passando o valor e o ID do cliente.
3.  **Exiba o Pix:** Pegue o `code` da resposta e mostre ao usuário.
4.  **Aguarde o Pagamento:** O status inicial será `WAITING_PAYMENT`. Assim que o usuário pagar, o status mudará (via Webhook ou consulta).  

### Exemplo Prático

Para criar pedidos de depósito Pix, você deve seguir esses 2 passos:


**1. Passo:** Aqui você tem as opções de criar o pedido de depósito sem um cliente ainda criado pela rota (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>) ou com um já criado.

:::tip[Recomendação]
A equipe XGate recomenda que o cliente seja criado pela rota de criação de clientes (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>).

Você pode estar **<a href={useBaseUrl('/docs/customer/create')} target="_blank">clicando aqui</a>** para ir para a página de documentação de criação de cliente.
:::
<Tabs>
    <TabItem value="with-client" label="Com Cliente">
**1.1. Passe o `_id` do cliente como `customerId`, igual no campo destacado:**
```json {3}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6722ba**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "202*********************",
        "updatedDate": "202*********************",
        "__v": 0,
        "symbol": "R$"
    },
    "identifiedDocumentPix": true
}
```
    </TabItem>
    <TabItem value="no-client" label="Sem Cliente">
    **1.1. Você deve passar o objeto `customer` que irá criar o cliente ao mesmo tempo em que cria o pedido de depósito:**
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
        "_id": "6722ba**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "202*********************",
        "updatedDate": "202*********************",
        "__v": 0,
        "symbol": "R$"
    },
    "identifiedDocumentPix": true
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
      "_id": "6722ba**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "202*********************",
        "updatedDate": "202*********************",
        "__v": 0,
        "symbol": "R$"
    },
    "identifiedDocumentPix": true
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
            currency: currencies.data[0],
            identifiedDocumentPix: true
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
---
sidebar_label: 'Create Deposit'
sidebar_position: 2
description: 'This endpoint generates a deposit order with automatic conversion.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CreatePixDepositTester from '@site/src/components/CreatePixDepositTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Create Deposit Order (Fiat → Crypto)

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Criar Pedido de Depósito (Fiat → Crypto)
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /deposit:
    post:
      summary: Criar Pedido de Depósito com Conversão
      description: Inicia um fluxo de cash-in onde o cliente paga em Fiat (Pix) e recebe o saldo convertido em Crypto (USDT). Retorna o código Pix (Copia e Cola).
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
                - cryptocurrency
              properties:
                amount:
                  type: number
                  description: O valor do depósito em moeda fiduciária (ex 100.50).
                customerId:
                  type: string
                  description: ID único do cliente. Não envie este campo se for utilizar o objeto 'customer'.
                customer:
                  type: object
                  description: Dados para criar o cliente junto com a ordem.
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
                  description: Moeda fiduciária de origem (ex BRL).
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
                cryptocurrency:
                  type: object
                  description: Criptomoeda de destino para a conversão (ex USDT).
                  required:
                    - _id
                    - name
                    - symbol
                  properties:
                    _id:
                      type: string
                    name:
                      type: string
                    symbol:
                      type: string
                    coinGecko:
                      type: string
                externalId:
                  type: string
                  description: Identificador de idempotência para controle interno.
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
        '401':
          description: Unauthorized. Token inválido, ausente ou IP bloqueado.
        '404':
          description: Not Found. O customerId fornecido não existe.
        '409':
          description: Conflict. Conflito nos dados do customer.
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

This endpoint generates a deposit order with **automatic conversion**. The customer makes the payment in fiat currency (Pix/BRL) and the amount is credited in cryptocurrency (e.g., USDT) in their wallet.

Every order is necessarily associated with a user. This ensures that the converted balance is delivered correctly, in addition to **facilitating reconciliation** and maintaining an **organized history** of all exchange operations.

---
## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/deposit
```

---

## Test Integration

Use the form below to simulate the creation of an order and generate the QR Code.

<CreatePixDepositTester />

---

## Request

You must send the **authentication Header** and the **Body** with the order data.

#### Required Headers

| Header          | Value                | Description                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained from login. |

#### Body (Request Body)

| Field        | Type     | Required | Description                                                               |
| :----------- | :------- | :---------: | :---------------------------------------------------------------------- |
| `amount`     | `number` |   **Yes**   | The deposit amount (e.g., `100.50`).                                     |
| `customerId` | `string` |   **No**   | The unique ID (`_id`) of the customer who will make the deposit.                      |
| `customer`   | `object` |   **No**   | Data for customer creation along with the deposit order creation. |
| `currency`   | `object` |   **Yes**   | The currency of the transaction (e.g., `BRL`).                                       |
| `externalId` | `string` |   **No**   | Idempotency                                                            |


:::warning[Important]
Although the `customerId` string data and the `customer` object are not required, it is **MANDATORY** to use one of them.

**Do not use `customerId` and `customer` in the same request**
:::

:::warning[Important]
We recommend including `externalId` data in the request as it prevents the order from being sent more than once, which can happen accidentally.
:::

---

## Responses

### Success (201 Created)

Returns the created order object, containing the `code` (Pix Copy and Paste) for the user to pay.

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

### Common Errors

| Status  | Message                | Likely Reason                                                                                  |
| :------ | :---------------------- | :----------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing Header.<br />• IP not allowed. |
| **404** | `Not Found`             | Customer informed in the `customerId` field does not exist.                                              |
| **409** | `Conflict`              | • Customer name provided is already registered.<br />• Document provided is already registered.   |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                         |

---

## How to Use

The purpose of this endpoint is to initiate the money inflow flow (**Cash-in**).

The most important return here is the `code` field. It contains the "Pix Copy and Paste" string. You should display this code to your end user or generate a visual QR Code from it.

### The Integration Flow

1.  **Create/Identify the Customer:** Make sure the user exists in XGate (<a href={useBaseUrl('/docs/customer/create')} target="_blank"><a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a></a>) and have their `_id`.
2.  **Create the Order:** Call this endpoint passing the amount and customer ID.
3.  **Display the Pix:** Take the `code` from the response and show it to the user.
4.  **Wait for Payment:** The initial status will be `PENDING`. As soon as the user pays, the status will change (via Webhook or query).  

### Practical Example

To create Pix deposit orders, you must follow these 3 steps:


**Step 1:** Here you have the options to create the deposit order without a customer already created by the route (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>) or with one already created.

:::tip[Recommendation]
The XGate team recommends that the customer be created by the customer creation route (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>).

You can be **<a href={useBaseUrl('/docs/customer/create')} target="_blank">clicking here</a>** to go to the customer creation documentation page.
:::
<Tabs>
    <TabItem value="with-client" label="With Customer">
**1. Pass the customer's `_id` as `customerId`, just like in the highlighted field:**
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
    "externalId": "67ce09d**************"
}
```
    </TabItem>
    <TabItem value="no-client" label="Without Customer">
    **1. You must pass the `customer` object which will create the customer at the same time that you create the deposit order:**
```json {3-8}
{
    "amount": 2,
    "customer": {
        "name": "Name",
        "phone": "92*********",
        "email": "email@example.com",
        "document": "123*********"
    }, 
    "currency": {
        "_id": "6722c8f***************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "202*********************",
        "updatedDate": "202*********************",
        "__v": 0,
        "symbol": "R$"
    },
    "cryptocurrency": {
        "_id": "67ca33*********************",
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
    :::warning[Important]
    The `name` and `document` data are **required**.  
    :::
    </TabItem>
</Tabs>

**Step 2:** You must obtain the fiat currency for which you are making the deposit.

You can obtain the list of them <a href={useBaseUrl('/docs/fiat/deposit/currency')} target="_blank">by clicking here</a>.

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
    "externalId": "67ce09d**************"
}
```

**Step 3:** You must obtain the cryptocurrency to perform the conversion.

You can obtain the list of them <a href={useBaseUrl('/docs/crypto/deposit/cryptocurrency')} target="_blank">by clicking here</a>.

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

#### Object Details

See the details of each information in the `currency` object to build your request.

| Field         | Type     | Required | Description                                                   |
| :------------ | :------- | :---------: | :---------------------------------------------------------- |
| `_id`         | `string` |   **Yes**   | Unique identifier of the currency.                               |
| `name`        | `string` |   **Yes**   | Name of the currency.                                              |
| `type`        | `string` |   **Yes**   | Type of payment method or transaction associated with the currency. |
| `createdDate` | `string` |   **No**   | Date when the currency was created in the system.                  |
| `updatedDate` | `string` |   **No**   | Date of last update of the currency information.        |
| `__v`         | `number` |   **No**   | Version of the currency record in the database.              |
| `symbol`      | `string` |   **Yes**   | Currency symbol.                                           |


See the details of each information in the `cryptocurrency` object to build your request.

| Field         | Type     | Required | Description                                                  |
| :------------ | :------- | :---------: | :--------------------------------------------------------- |
| `_id`         | `string` |   **Yes**   | Unique identifier of the cryptocurrency.                        |
| `name`        | `string` |   **Yes**   | Name of the cryptocurrency.                                       |
| `symbol`      | `string` |   **Yes**   | Symbol of the cryptocurrency.                                    |
| `coinGecko`   | `string` |   **No**   | Cryptocurrency identifier on CoinGecko.                 |
| `updatedDate` | `string` |   **No**   | Date of last update of cryptocurrency information. |
| `createdDate` | `string` |   **No**   | Date when the cryptocurrency was created in the system.           |
| `__v`         | `number` |   **No**   | Version of the cryptocurrency record in the database.       |

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
        const cryptocurrencies = await axios.get(`${url_api}/deposit/company/cryptocurrencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/deposit`, {
            amount,
            customerId,
            currency: currencies.data[0],
            cryptocurrency: cryptocurrencies.data[0]
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
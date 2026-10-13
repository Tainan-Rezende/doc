---
sidebar_label: 'Create Deposit'
sidebar_position: 2
description: 'This endpoint creates a deposit order (payment intent) for a specific customer.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CreatePixDepositTester from '@site/src/components/CreatePixDepositTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Create Deposit Order

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
                        description: Returned when sent in the request.
                  warnings:
                    type: array
                    description: Non-blocking warnings. E.g. CRYPTOCURRENCY_FIELD_IGNORED when the cryptocurrency field is sent (ignored as of 10/29/2026).
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
          description: Company payer policy violated. Body { reason, message } with reason PAYER_TYPE_NOT_ALLOWED, DEPOSIT_TITULARITY_CUSTOMER_DOCUMENT_REQUIRED, PAYER_DOCUMENT_MISSING, PIX_POLICY_REQUIRES_PIX_V2 or PIX_POLICY_PROVIDER_WITHOUT_PAYER.
        '503':
          description: PIX_POLICY_NOT_CONFIGURED. The company's Pix policy is not configured.
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

This endpoint creates a deposit order (payment intent) for a specific customer. When the order is created, the system returns the data required for the end user to complete the payment via Pix.

Every order must be associated with a customer. This ensures the funds are credited to the correct customer on your platform, **enables automatic reconciliation**, and keeps a **clean history** of all transactions.

---
## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/deposit
```

---

## Test Integration

Use the form below to simulate creating an order and generate the QR Code.

<CreatePixDepositTester />

---

## Request

You must provide the authentication **Header** and the request **Body** with the order data.

#### Required Headers

| Header          | Value                 | Description                      |
| :-------------- | :-------------------- | :------------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained at login. |

#### Body (Request Body)

| Field                   | Type      | Required | Description                                                           |
| :---------------------- | :-------- | :------: | :-------------------------------------------------------------------- |
| `amount`                | `number`  | **Yes**  | The deposit amount (ex: `100.50`).                                    |
| `customerId`            | `string`  |  **No**  | The customer's unique `_id` who will make the deposit.                |
| `customer`              | `object`  |  **No**  | Customer data to create the customer together with the deposit order. |
| `currency`              | `string`  | **Yes**  | The transaction currency (ex: `BRL`).                                 |
| `externalId`            | `string`  |  **No**  | Idempotency identifier.                                               |
| `identifiedDocumentPix` | `boolean` |  **No**  | When `true`, forces Pix document ownership verification.              |

:::warning[`cryptocurrency` field ignored as of October 29, 2026]
Deposits with conversion to crypto are discontinued on October 29, 2026. From that date on, send only `currency`: if the `cryptocurrency` field is sent, it is **ignored**, the deposit is created in BRL and the response includes the `CRYPTOCURRENCY_FIELD_IGNORED` warning in `warnings`. To obtain crypto, use <a href={useBaseUrl('/docs/buy-sell/overview')}>Crypto Purchase</a> with your BRL balance.
:::

:::info[About ownership validation]
Sending the `identifiedDocumentPix` parameter with the value `false` (or omitting it) **does not disable** the ownership check if it is configured as **mandatory** in the XGate administrative panel for your account. 

This parameter strictly serves to **force** the validation (by sending `true`) on accounts where the panel's default rule is disabled. To permanently disable document ownership verification, a commercial alignment via contract is required.
:::

:::warning[Important: Customer Identification]
To create a deposit, it is **mandatory** to identify the user. You must send the `customerId` (if the client already exists) **OR** the `customer` object (to create a new client at the time of the request). 

Never send both fields in the same request, as this will result in a transaction failure.
:::

:::tip[Best Practices: Duplication Prevention]
We strongly recommend sending the `externalId` field. It acts as an idempotency key, ensuring that the same deposit request is not created in duplicate in case of network failure, double clicks, or accidental retries by your system.
:::

---

## Responses

### Success (201 Created)

Returns the created order object, including the `code` (Pix Copia e Cola) for the user to pay.

```json
{
  "message": "Pix Gerado com Sucesso",
  "data": {
    "status": "WAITING_PAYMENT",
    "code": "00020126850014br.gov.bcb.pix2563pi************************************************************************************",
    "id": "696e28a43e09**************",
    "customerId": "68e7b8f0db**************",
    "externalId": "order-7781"
  }
}
```

The `externalId` field is returned when it was sent in the request.

#### Warnings (`warnings`)

The response may include warnings that **do not prevent** the deposit from being created. Example, when the `cryptocurrency` field is sent as of October 29, 2026:

```json
{
  "message": "Pix Gerado com Sucesso",
  "data": {
    "status": "WAITING_PAYMENT",
    "code": "00020126850014br.gov.bcb.pix2563pi************",
    "id": "696e28a43e09**************",
    "customerId": "68e7b8f0db**************",
    "externalId": "order-7781"
  },
  "warnings": [
    {
      "code": "CRYPTOCURRENCY_FIELD_IGNORED",
      "message": "The cryptocurrency field is no longer supported; the deposit was created in BRL. Use purchase{} to buy crypto."
    }
  ]
}
```

### Common Errors

| Status  | Message                 | Likely Cause                                                                                            |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing header.<br />• IP not allowed.                   |
| **404** | `Not Found`             | The `customerId` provided does not exist.                                                               |
| **409** | `Conflict`              | • The provided customer name is already registered.<br />• The provided document is already registered. |
| **422** | `{ reason, message }`   | Violation of the company's payer policy. See the table below.                                           |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                                                 |
| **503** | `PIX_POLICY_NOT_CONFIGURED` | The company's Pix policy is not configured. Contact support.                                        |

#### Payer policy

Each company may have rules for deposits made through the API: payer type (individual/PF or legal entity/PJ), ownership (customer document or company CNPJ) and limits. When a rule is violated when creating the deposit, the API responds `422` with the body `{ "reason", "message" }`:

| Reason                                          | Cause                                                                                    |
| :---------------------------------------------- | :--------------------------------------------------------------------------------------- |
| `PAYER_TYPE_NOT_ALLOWED`                        | The payer type (PF/PJ) is not allowed by the company's policy.                           |
| `DEPOSIT_TITULARITY_CUSTOMER_DOCUMENT_REQUIRED` | The policy requires ownership and the customer has no document.                          |
| `PAYER_DOCUMENT_MISSING`                        | The payer's document is required and was not provided.                                   |
| `PIX_POLICY_REQUIRES_PIX_V2`                    | The configured policy requires Pix v2, which is not available for this account.          |
| `PIX_POLICY_PROVIDER_WITHOUT_PAYER`             | The Pix provider does not report the payer, which is required by the policy.             |

#### `PAYER_REJECTED` status

When a paid Pix violates a payer rule that could not be blocked when the charge was created (e.g. PF/PJ type without the payer's document), the deposit gets the `PAYER_REJECTED` status and **the amount is refunded to the payer**. Querying the deposit returns the `payerRuleViolation` object:

```json
{
  "status": "PAYER_REJECTED",
  "payerRuleViolation": {
    "reason": "PAYER_TYPE_NOT_ALLOWED",
    "at": "2026-10-13T14:00:00.000Z",
    "refundedAt": "2026-10-13T14:00:05.000Z",
    "payer": { "name": "John Doe", "document": "***.456.789-**", "bank": "Example Bank" }
  }
}
```

---

## How to use

This endpoint starts the cash-in flow.

The most important return value is the `code` field. It contains the "Pix Copia e Cola" string. Display this code to your end user or generate a visual QR Code from it.

### Integration Flow

1.  **Create/Identify the Customer:** Ensure the user exists in XGate (POST /customer) and obtain their `_id`.
2.  **Create the Order:** Call this endpoint with the amount and the customer ID (or customer object).
3.  **Show the Pix:** Take the `code` from the response and present it to the user.
4.  **Wait for Payment:** The initial status will be `WAITING_PAYMENT`. Once the user pays, the status will update (via Webhook or polling).  

### Practical Example

To create Pix deposit orders follow these two steps:


**Step 1:** You can create the deposit order with an existing customer (POST /customer) or create the customer at the same time.

:::tip[Recomendação]
The XGate team recommends creating the customer using the customers creation endpoint (POST /customer).

You can **<a href={useBaseUrl('/docs/customer/create')} target="_blank">click here</a>** to open the customer creation documentation.
:::
<Tabs>
    <TabItem value="with-client" label="With Customer">
**1.1. Pass the customer's `_id` as `customerId`, as shown in the highlighted field:**
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
    <TabItem value="no-client" label="Without Customer">
    **1.1. You must pass the `customer` object to create the customer together with the deposit order:**
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
    The `name` and `document` fields are **required**.  
    :::
    </TabItem>
</Tabs>

**Step 2:** Obtain the fiat currency for the deposit.

You can get the list by <a href={useBaseUrl('/docs/fiat/deposit/currency')} target="_blank">clicking here</a>.

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

#### Object Details

See details for each field in the `currency` object to build your request.

| Field         | Type     | Required | Description                                                      |
| :------------ | :------- | :------: | :--------------------------------------------------------------- |
| `_id`         | `string` | **Yes**  | Unique identifier of the currency.                               |
| `name`        | `string` | **Yes**  | Currency name.                                                   |
| `type`        | `string` | **Yes**  | Payment method or transaction type associated with the currency. |
| `createdDate` | `string` |  **No**  | Date when the currency was created in the system.                |
| `updatedDate` | `string` |  **No**  | Date of the last update to the currency information.             |
| `__v`         | `number` |  **No**  | Database record version for the currency.                        |
| `symbol`      | `string` | **Yes**  | Currency symbol.                                                 |

---

## Integration

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    The integration example uses the <code>Axios</code> library in Node.js.

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
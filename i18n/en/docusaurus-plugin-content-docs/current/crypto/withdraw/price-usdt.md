---
sidebar_label: 'Quote Crypto to FIAT'
sidebar_position: 5
description: 'This endpoint allows you to calculate in advance how much the client will receive in fiat currency when cashing out a specific amount in crypto.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetTetherConversionToFiatTester from '@site/src/components/GetTetherConversionToFiatTester';
import AICopyButton from '@site/src/components/AICopyButton';

# USDT to FIAT Quote

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Cotação Crypto para FIAT
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /withdraw/conversion/brl/pix:
    post:
      summary: Cotação Crypto para FIAT (Pix)
      description: Calcula antecipadamente o valor em moeda fiduciária (BRL) que o cliente receberá ao sacar um valor específico em criptomoeda. Rota apenas de consulta (não gera pedido de saque).
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
                - cryptocurrency
              properties:
                amount:
                  type: number
                  description: Valor em Crypto que se deseja converter e cotar (ex 1.00).
                cryptocurrency:
                  type: object
                  description: Objeto completo com os dados da criptomoeda de origem (ex USDT, USDC).
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
      responses:
        '200':
          description: Sucesso. Retorna o valor convertido para BRL e a taxa de câmbio aplicada.
          content:
            application/json:
              schema:
                type: object
                properties:
                  amount:
                    type: number
                    description: Valor convertido na moeda fiduciária de destino.
                  currency:
                    type: string
                    description: Símbolo da moeda fiat (ex R$).
                  cryptoToFiatExchangeRate:
                    type: string
                    description: Taxa de câmbio utilizada no momento da cotação.
        '401':
          description: Unauthorized. Token JWT inválido, expirado ou ausente.
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

This endpoint allows you to calculate in advance how much the client will receive in FIAT when cashing out a specific amount in Crypto.

---
## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/withdraw/conversion/brl/pix
```

---

## Test Integration

Use the form below to simulate the quote. The system will automatically fetch the cryptocurrency data and calculate how much it would yield in BRL.

<GetTetherConversionToFiatTester />

---

## Request

You need to send the authentication **Header** and the JSON body with the value and currency object.

#### Required Headers

| Header          | Value                | Description                   |
| :-------------- | :------------------- | :---------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained at login. |

#### Body (Request Body)

| Field            | Type     | Required | Description                                                                         |
| :--------------- | :------- | :------: | :---------------------------------------------------------------------------------- |
| `amount`         | `number` | **Yes**  | Amount in Crypto for which you want to calculate the quote.                 |
| `cryptocurrency` | `object` | **Yes**  | The cryptocurrency object, obtained from the cryptocurrencies listing route.       |

---

## Responses

### Success (200 OK)

Returns the converted value, the currency, and the exchange rate used at that moment.

```json
{
  "amount": 5.17,
  "currency": "R$",
  "cryptoToFiatExchangeRate": "R$ 5.170"
}
```

### Common Errors

| Status  | Message                 | Likely Reason                                                                                     |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing header.<br />• IP not allowed.         |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                                         |

---

## How to Use

This route **does not generate** a payment order, it is only for **consultation**.

### The Recommended Flow (UX)

1.  **Input:** The user types "1" (amount in Crypto) in your app/site.
2.  **Consultation:** Your system calls `POST /withdraw/conversion/brl/pix` sending the value 1 Crypto and the cryptocurrency object.
3.  **Display:** The API returns that this equals `5.17`. You display: *"You will receive approximately R$ 5.17"*.
4.  **Action:** If the user agrees, you call the **Create Withdrawal Order for Crypto to FIAT Conversion** route (`POST /withdraw`).

### Practical Example

Follow the steps below to perform the Crypto to FIAT quote.

**Step 1:** Enter the Crypto amount for the quote:
```json {2}
{
    "amount": 1,
    "cryptocurrency": {
        "_id": "6733a2a9******************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "updatedDate": "202******************",
        "createdDate": "202******************",
        "__v": 0
    }
}
```

**Step 2:** You must fetch and inject the cryptocurrency object inside `cryptocurrency`:

```json {3-11}
{
    "amount": 1,
    "cryptocurrency": {
        "_id": "6733a2a9******************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "updatedDate": "202******************",
        "createdDate": "202******************",
        "__v": 0
    }
}
```
You can get the list of cryptocurrencies <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">by clicking here</a>.

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
    const amount = 10.90;

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const cryptocurrencies = await axios.get(`${url_api}/withdraw/company/cryptocurrencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/withdraw/conversion/brl/pix`, {
            amount,
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
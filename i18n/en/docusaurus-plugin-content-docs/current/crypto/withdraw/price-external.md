---
sidebar_label: 'Quote for Wallet'
sidebar_position: 6
description: 'This endpoint allows you to calculate in advance how much the client will receive in crypto when creating a withdrawal request to an external wallet, already deducting the blockchain network gas fees.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetTetherToExternalTester from '@site/src/components/GetTetherToExternalTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Quote for External Wallet

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Cotação para Carteira Externa
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /withdraw/transaction/crypto/amount:
    post:
      summary: Cotação para Saque em Carteira Externa
      description: Calcula o valor líquido que o cliente receberá em sua carteira externa, descontando antecipadamente as taxas de gás (network fees) da rede blockchain selecionada. Rota apenas de consulta (não gera pedido de saque).
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
                - blockchainNetwork
              properties:
                amount:
                  type: number
                  description: Valor bruto do saque em criptomoeda (ex 10).
                cryptocurrency:
                  type: object
                  description: Objeto completo com os dados da criptomoeda de origem (ex USDT).
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
                blockchainNetwork:
                  type: object
                  description: Objeto completo com os dados da rede blockchain pela qual a transferência ocorrerá.
                  required:
                    - _id
                    - name
                    - chainId
                    - chain
                    - symbol
                  properties:
                    _id:
                      type: string
                    name:
                      type: string
                    chainId:
                      type: string
                    chain:
                      type: string
                    symbol:
                      type: string
      responses:
        '200':
          description: Sucesso. Retorna o valor líquido aproximado a ser recebido na carteira externa.
          content:
            application/json:
              schema:
                type: object
                properties:
                  amount:
                    type: number
                    description: Valor líquido calculado na mesma criptomoeda.
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

This endpoint allows you to calculate in advance how much the client will receive in Crypto when creating a withdrawal request to an external wallet, already deducting the blockchain network gas fees.

---
## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/withdraw/transaction/crypto/amount
```

---

## Test Integration

Use the form below to simulate a withdrawal to an external wallet. The system will automatically fetch the necessary data and calculate how much you would receive in Crypto.

<GetTetherToExternalTester />

---

## Request

You need to send the authentication **Header** and the JSON body with the value and currency object.

#### Required Headers

| Header          | Value                 | Description                      |
| :-------------- | :-------------------- | :------------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained at login. |

#### Body (Request Body)

| Field               | Type     | Required | Description                                                                   |
| :------------------ | :------- | :------: | :---------------------------------------------------------------------------- |
| `amount`            | `number` | **Yes**  | Amount in Crypto for which you want to calculate the withdrawal.              |
| `cryptocurrency`    | `object` | **Yes**  | The cryptocurrency object, obtained from the cryptocurrencies listing route.  |
| `blockchainNetwork` | `object` | **Yes**  | The blockchain network object, obtained from the blockchain networks listing. |

---

## Responses

### Success (200 OK)

Returns the value that approximately will be received at the external wallet. 

```json
{
  "amount": 99.521405,
  "cryptocurrency": "USDT"
}
```

### Common Errors

| Status  | Message                 | Likely Reason                                                                         |
| :------ | :---------------------- | :------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing header.<br />• IP not allowed. |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                               |

---

## How to use

:::info[Consultation Only]
This endpoint **does not** create a withdrawal request or move any funds. It is **strictly for consultation** to quote rates and estimate network fees.
:::

### Recommended Flow (UX)

To provide the best experience for your clients, we recommend the following integration flow:

1. **User Input:** The client enters the desired withdrawal amount (e.g., `10`) in your application or website.
2. **Quote Consultation:** In the background, your system calls the `POST /withdraw/transaction/crypto/amount` endpoint, sending the value `10` along with the selected **network** and **cryptocurrency** objects.
3. **Display Net Amount:** The API calculates the blockchain costs and returns the exact amount that will arrive in the destination wallet (e.g., `9.369984879637112 USDT`). You display on the screen something like: *"You will receive approximately 9.36 USDT"*.
4. **Action / Confirmation:** If the user agrees with the fees and the net amount, your system then calls the definitive **Create Withdrawal Request** route (`POST /withdraw`) to execute the transaction.

### Practical Example

Follow the steps below to perform a quote for external wallet.

**Step 1:** Enter the crypto amount for the quote:
```json {2}
{
    "amount": 100,
    "blockchainNetwork": {
        "_id": "69ea849098**************",
        "chain": "Solana",
        "name": "Solana",
    },
    "cryptocurrency": {
        "_id": "6733a2a9007**************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether"
    }
}
```

**Step 2:** You must fetch and inject the blockchain network object inside `blockchainNetwork`:

```json {3-7}
{
    "amount": 100,
    "blockchainNetwork": {
        "_id": "69ea849098**************",
        "chain": "Solana",
        "name": "Solana",
    },
    "cryptocurrency": {
        "_id": "6733a2a9007**************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether"
    }
}
```
You can get the list of blockchain networks <a href={useBaseUrl('/docs/crypto/withdraw/network')} target="_blank">by clicking here</a>.

**Step 3:** You must fetch and inject the cryptocurrency object inside `cryptocurrency`:

```json {8-13}
{
    "amount": 100,
    "blockchainNetwork": {
        "_id": "69ea849098**************",
        "chain": "Solana",
        "name": "Solana",
    },
    "cryptocurrency": {
        "_id": "6733a2a9007**************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether"
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
  const email = "email@domain.com";
  const password = "••••••";
  const amount = 10;

  try {
    const url_api = "https://api.xgateglobal.com"
            
    // 1. Login
    const login = await axios.post(`${url_api}/auth/token`, { email, password });
    const config = {
      headers: { "Authorization": `Bearer ${login.data.token}` }
    };

    // 2. Fetch Networks and Cryptocurrencies
    const blockchains = await axios.get(`${url_api}/withdraw/company/blockchain-networks`, config);
            
    // Selects the first available network
    const selectedNetwork = blockchains.data[0];

    // Searches specifically for the USDT object within the network's crypto list
    const usdtObject = selectedNetwork.cryptocurrencies.find(
      item => item.cryptocurrency.symbol === 'USDT'
    );

    if (!usdtObject) {
      throw new Error(`USDT not found in ${selectedNetwork.name} network`);
    }

    // 3. Calculate Quote
    const { data } = await axios.post(`${url_api}/withdraw/transaction/crypto/amount`, {
      amount,
      cryptocurrency: usdtObject.cryptocurrency,
      blockchainNetwork: selectedNetwork
    }, config);

    console.log("Quote Received:", data); 
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
  }
})()
```
  </TabItem>
</Tabs>
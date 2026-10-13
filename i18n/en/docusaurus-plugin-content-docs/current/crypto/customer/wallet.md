---
sidebar_label: 'Get Crypto Wallet'
sidebar_position: 1
description: 'This endpoint returns the cryptocurrency wallets associated with a specific customer.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetCryptoWalletTester from '@site/src/components/GetCryptoWalletTester';
import AICopyButton from '@site/src/components/AICopyButton';
import CryptoDeprecationNotice from '@site/src/components/CryptoDeprecationNotice';

# Get Crypto Wallet

<CryptoDeprecationNotice />

<div className="ai-btn-wrapper">
  <AICopyButton 
    promptText={`openapi: 3.0.3
  info:
    title: API XGate - Buscar Carteiras Crypto
    version: 1.0.0
  servers:
    - url: https://api.xgateglobal.com
      description: Servidor de Produção XGate
  paths:
    /crypto/customer/{clientId}/wallet:
      get:
        summary: Buscar Carteiras Crypto do Cliente
        description: >
          Retorna as carteiras de criptomoedas associadas a um cliente específico.
          
          ⚠️ ATENÇÃO (COMPORTAMENTO ASSÍNCRONO): Este endpoint inicia a geração de carteiras na blockchain em segundo plano na primeira chamada.
          Se a blockchain ainda estiver gerando os endereços, a API responderá com um objeto contendo uma mensagem de provisionamento.
          Você (LLM/Gerador de Código) DEVE obrigatoriamente implementar uma lógica de retry (polling) com async/await: se o JSON de retorno contiver a propriedade 'message' indicando que está provisionando, aguarde de 1 a 2 segundos e realize uma nova tentativa (limite de 3 a 5 tentativas).
        security:
          - bearerAuth: []
        parameters:
          - in: path
            name: clientId
            required: true
            schema:
              type: string
            description: O ID único (_id) do cliente.
        responses:
          '200':
            description: Sucesso. Retorna as carteiras criadas ou uma mensagem de provisionamento em andamento.
            content:
              application/json:
                schema:
                  oneOf:
                    - type: array
                      description: Array com os dados das carteiras geradas com sucesso.
                      items:
                        type: object
                        properties:
                          publicKey:
                            type: string
                            description: Endereço público da carteira gerada para o cliente.
                          blockchainNetworks:
                            type: array
                            items:
                              type: string
                            description: Lista de redes blockchain aceitas nesse endereço (ex Ethereum, Solana, Polygon).
                          assets:
                            type: array
                            items:
                              type: string
                            description: Lista de ativos aceitos nesse endereço (ex USDT, USDC).
                    - type: object
                      description: Retorno temporário enquanto a blockchain realiza o provisionamento dos endereços.
                      properties:
                        message:
                          type: string
                          example: "Wait a few seconds, we are provisioning your wallet addresses"
          '401':
            description: Unauthorized. Token JWT inválido, expirado ou não informado.
          '404':
            description: Not Found. Cliente não encontrado.
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

This endpoint returns the cryptocurrency wallets associated with a specific customer.

Use this route to obtain the deposit public keys (publicKey) and verify which networks (blockchainNetworks) (e.g., Polygon, Solana) and assets (assets) (e.g., USDT, USDC) are available for each address.

---
## Endpoint
- **Method:** <span className="badge badge--success">GET</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/crypto/customer/CLIENT_ID/wallet
```

:::warning[Important]
The `CLIENT_ID` field refers to the customer ID. If you haven't created it yet, you can create it from the <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>create customers</a> page.
:::

---

:::info[Asynchronous Behavior (Retry Recommendation)]
When requesting a client's wallets for the first time, the blockchain will initiate address generation in the background. 

During these seconds of creation, the API will respond with the message: 
`"Wait a few seconds, we are provisioning your wallet addresses"`.

**Technical Recommendation:** Make sure your application uses an **async/await with retry (polling)** logic. Configure your code to repeat the request 3 to 5 times, with an interval of 1 to 5 seconds between attempts, until the array with the definitive `publicKey` is returned. *You can find a practical example of this implementation at the bottom of this page.*
:::

---

## Test Integration

Use the form below to list a customer's wallets.

<GetCryptoWalletTester />

---

## Request

You must send the **authentication Header** and pass the **Customer ID** in the URL.

#### Required Headers

| Header          | Value                 | Description                        |
| :-------------- | :-------------------- | :--------------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained from login. |

#### URL Parameters

| Parameter   | Type     | Required | Description                                    |
| :---------- | :------- | :------: | :--------------------------------------------- |
| `CLIENT_ID` | `string` | **Yes**  | The `_id` of the customer you want to consult. |

---

## Responses

### Success (200 OK)

Returns an array with the generated wallets, the accepted cryptocurrencies, and the network that must be used to receive deposits.

```json
[
  {
    "publicKey": "0xda4e37a068a2fed2c******************",
    "blockchainNetworks": [
      "Polygon",
      "Ethereum"
    ],
    "assets": [
      "USDC",
      "USDT"
    ]
  },
  {
    "publicKey": "EGJCs2ZDNFksfZH******************",
    "blockchainNetworks": [
      "Solana"
    ],
    "assets": [
      "USDT",
      "USDC"
    ]
  },
  {
    "publicKey": "TNWraJD8jp3TK******************",
    "blockchainNetworks": [
      "Tron"
    ],
    "assets": [
      "USDT"
    ]
  }
]
```

:::warning[Important]
Crypto origin deposits do not appear in the Dashboard deposits tab until they are completed (Paid).
:::

:::danger[Risk of Fund Loss and Fraud]
1. **USDT or USDC:** XGate exclusively processes **Tether (USDT)** and **USD Coin (USDC)** deposits. Sending any other cryptocurrencies (such as Bitcoin, native Ethereum, TRX, etc.) will result in the **irreversible loss** of the funds.
2. **Correct Network:** The deposit must be made strictly through one of the networks listed in our API (e.g., `ERC-20`, `Solana`, or `Polygon`). Sending funds through unsupported networks will cause total fund loss.
3. **Fraud Alert ("Flash Tokens"):** Beware of scammers who send fake tokens imitating the original ones (known as "Flash USDT" or "Flash USDC"). These counterfeit coins appear in the wallet but have no real value and cannot be transacted. Always validate via the smart contract that the deposited token is the official Tether or Circle token before releasing the balance to your end customer.
:::

### Common Errors

| Status  | Message                 | Likely Reason                                                                          |
| :------ | :---------------------- | :------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing Header.<br /> • IP not allowed. |
| **404** | `Not Found`             | Customer not found.                                                                    |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                                |

---

## How to Use

The information delivered by this route includes the **Address (publicKey)**, the **Supported Networks (blockchainNetworks)**, and the **Accepted Assets (assets)**. These will be used whenever you or your end customer wish to make a cryptocurrency deposit.

Each object in the array represents a specific address format that can support one or more networks and one or more assets simultaneously:

| Address (`publicKey`) | Networks (`blockchainNetworks`) | Available Assets (`assets`) |
| :-------------------- | :------------------------------ | :-------------------------- |
| EVM Format (`0x...`)  | `Polygon`, `Ethereum`           | `USDT`, `USDC`              |
| Solana Format         | `Solana`                        | `USDT`, `USDC`              |
| Tron Format (`T...`)  | `Tron`                          | `USDT`                      |

The end-user flow should be structured as follows:
1. **Asset Selection:** The user chooses whether they want to deposit **USDT** or **USDC**.
2. **Network Selection:** The system displays the accepted networks (`blockchainNetworks`) based on the chosen asset.
3. **Address Display:** The system displays the public key (`publicKey`) corresponding to the selected combination.
4. **Funds Transfer:** The user goes to their exchange or external wallet and sends the chosen asset, strictly using one of the listed networks, to the provided address.

### ⚠️ Critical Deposit Rules

To ensure fund security, the developer must display clear warnings on the front-end for the end user:

:::danger[Risk of Fund Loss and Fraud]
1. **USDT or USDC:** XGate exclusively processes **Tether (USDT)** and **USD Coin (USDC)** deposits. Sending any other cryptocurrencies (such as Bitcoin, native Ethereum, TRX, etc.) will result in the **irreversible loss** of the funds.
2. **Correct Network:** The deposit must be made strictly through one of the networks listed in our API (e.g., `ERC-20`, `Solana`, or `Polygon`). Sending funds through unsupported networks will cause total fund loss.
3. **Fraud Alert ("Flash Tokens"):** Beware of scammers who send fake tokens imitating the original ones (known as "Flash USDT" or "Flash USDC"). These counterfeit coins appear in the wallet but have no real value and cannot be transacted. Always validate via the smart contract that the deposited token is the official Tether or Circle token before releasing the balance to your end customer.
:::

### Application Example (UX)

When integrating this route, we recommend that your interface displays the information clearly and linked to the specific generated address. For example:

> 💰 **Accepted Assets:** USDT or USDC
>
> 🌐 **Supported Networks (for this address):** Ethereum (ERC-20), Polygon
>
> 📍 **Deposit Address:**
> `0xda4e37a068a2fed2c******************` 📋 (Copy Button)
>
> ⚠️ *Warning: Send only the listed assets using the indicated networks. Sending other coins or using incorrect networks will result in the irreversible loss of funds.*

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

    // Helper function to wait (in milliseconds)
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    (async () => {
      const email = "your_email@domain.com";
      const password = "**********";
      const customerId = "************";
      const url_api = "https://api.xgateglobal.com";

      try {
        // 1. Authenticate with the API
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const token = login.data.token;

        // 2. Recursive function with retry to fetch or generate the wallet
        async function getWalletWithRetry(count = 0) {
          const { data } = await axios.get(`${url_api}/crypto/customer/${customerId}/wallet`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          // If the API returns the provisioning message, wait 2 seconds and try again (maximum 3 attempts)
          if (
            data?.message === "Wait a few seconds, we are provisioning your wallet addresses" &&
            count < 3
          ) {
            console.log(`Wallet being created. Attempt ${count + 1} of 3... Waiting 2 seconds.`);
            await sleep(2000);
            return getWalletWithRetry(count + 1);
          }

          return data;
        }

        console.log("Starting wallet retrieval...");
        const wallet = await getWalletWithRetry();
        console.log("Final wallet result:", wallet);

      } catch (error) {
        console.log("Execution error:", error.response?.data?.message || error.message);
      }
    })();
    ```
  </TabItem>
</Tabs>
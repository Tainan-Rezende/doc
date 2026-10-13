---
sidebar_label: 'Cotação (Gas Fee)'
sidebar_position: 6
description: 'Este endpoint permite calcular antecipadamente quanto o cliente receberá da criptomoeda de origem ao criar uma solitação de saque para uma carteira externa, já descontando as taxas de gás da rede blockchain vigente.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetTetherToExternalTester from '@site/src/components/GetTetherToExternalTester';
import AICopyButton from '@site/src/components/AICopyButton';
import CryptoDeprecationNotice from '@site/src/components/CryptoDeprecationNotice';

# Cotação para Carteira Externa

<CryptoDeprecationNotice />

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

Este endpoint permite calcular antecipadamente quanto o cliente receberá em Crypto ao criar uma solitação de saque para uma carteira externa, já descontando as taxas de gás da rede blockchain vigente.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/withdraw/transaction/crypto/amount
```

---

## Testar Integração

Utilize o formulário abaixo para simular um saque para carteira externa. O sistema irá buscar automaticamente os dados necessários e calcular quanto receberia em Crypto.

<GetTetherToExternalTester />

---

## Requisição

É necessário enviar o **Header** de autenticação e o corpo JSON com o valor e o objeto da moeda.

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

#### Body (Corpo da Requisição)

| Campo               | Tipo     | Obrigatório | Descrição                                                                        |
| :------------------ | :------- | :---------: | :------------------------------------------------------------------------------- |
| `amount`            | `number` |   **Sim**   | Valor em Crypto que se deseja calcular o saque.                                  |
| `cryptocurrency`    | `object` |   **Sim**   | O objeto da criptomoeda, obtido na rota de listagem de criptomoedas para saques. |
| `blockchainNetwork` | `object` |   **Sim**   | O objeto da rede blockchain, obtido na listagem de redes blockchain.             |

---

## Respostas (Responses)

### Sucesso (200 OK)

Retorna o valor que aproximadamente será recebido na carteira externa. 

```json
{
  "amount": 99.521567,
  "cryptocurrency": "USDC"
}
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                  |
| :------ | :---------------------- | :----------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br />• IP não permitido. |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                         |

---

## Como usar

:::info[Apenas Consulta]
Esta rota **não gera** um pedido de saque ou movimenta fundos. Ela serve **estritamente para consulta** de cotação e previsão de taxas da rede.
:::

### O Fluxo Recomendado (UX)

Para oferecer a melhor experiência aos seus clientes, recomendamos o seguinte fluxo de integração:

1. **Input do Usuário:** O cliente digita o valor que deseja sacar (ex: `10`) em seu aplicativo ou site.
2. **Consulta de Cotação:** Em background, seu sistema chama o endpoint `POST /withdraw/transaction/crypto/amount` enviando o valor de `10`, junto com os objetos da **rede** e da **criptomoeda** selecionadas.
3. **Exibição do Valor Líquido:** A API calcula os custos da blockchain e retorna o valor exato que chegará na carteira de destino (ex: `9.369984879637112 USDT`). Você exibe na tela algo como: *"Você receberá aproximadamente 9.36 USDT"*.
4. **Ação / Confirmação:** Se o usuário concordar com as taxas e o valor líquido, seu sistema então chama a rota definitiva de **Criar Pedido de Saque** (`POST /withdraw`) para efetivar a transação.

### Exemplo Prático

Siga os passos abaixo para realizar a cotação para carteira externa.

**1. Passo:** Insira o valor em Crypto para a cotação:
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

**2. Passo:** Você deve buscar e injetar o objeto da rede blockchain dentro de `blockchainNetwork`:

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
Você pode obter a lista de redes blockchain <a href={useBaseUrl('/docs/crypto/withdraw/network')} target="_blank">clicando aqui</a>.

**3. Passo:** Você deve buscar e injetar o objeto da criptomoeda dentro de `cryptocurrency`:

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
Você pode obter a lista de criptomoedas <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">clicando aqui</a>.

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

    // 2. Buscar Redes e Criptomoedas
    const blockchains = await axios.get(`${url_api}/withdraw/company/blockchain-networks`, config);
            
    // Seleciona a primeira rede disponível
    const selectedNetwork = blockchains.data[0];

    // Busca especificamente pelo objeto do USDT dentro da lista de criptos da rede
    const usdtObject = selectedNetwork.cryptocurrencies.find(
      item => item.cryptocurrency.symbol === 'USDT'
    );

    if (!usdtObject) {
      throw new Error(`USDT não encontrado na rede ${selectedNetwork.name}`);
    }

    // 3. Calcular Cotação
    const { data } = await axios.post(`${url_api}/withdraw/transaction/crypto/amount`, {
      amount,
      cryptocurrency: usdtObject.cryptocurrency,
      blockchainNetwork: selectedNetwork
    }, config);

    console.log("Cotação Recebida:", data); 
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
  }
})()
```
  </TabItem>
</Tabs>
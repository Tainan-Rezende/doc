---
sidebar_label: 'Criar Saque Externo'
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import WithdrawCryptoToWalletTester from '@site/src/components/WithdrawCryptoToWalletTester';

# Criar Pedido de Saque para Carteira Externa

Este endpoint permite que o cliente realize um saque das criptomoedas para uma carteira externa.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/withdraw
```

---

## Testar Integração

Utilize o formulário abaixo para simular a criação de um pedido de saque crypto para carteira externa.

<WithdrawCryptoToWalletTester />

---

## Requisição

É necessário enviar o **Header** de autenticação e o **Body** com os dados do pedido.

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

#### Body (Corpo da Requisição)

| Campo               | Tipo     | Obrigatório | Descrição                                       |
| :------------------ | :------- | :---------: | :---------------------------------------------- |
| `amount`            | `number` |   **Sim**   | O valor do saque em USDT (ex: `0.1` min).       |
| `customerId`        | `string` |   **Sim**   | O ID único (`_id`) do cliente que fará o saque. |
| `cryptocurrency`    | `object` |   **Sim**   | A criptomoeda da transação (ex: `USDT`).        |
| `blockchainNetwork` | `object` |   **Sim**   | Informações sobre a rede blockchain.            |
| `wallet`            | `string` |   **Sim**   | A carteira para onde os valores serão enviados. |
| `externalId`        | `string` |   **Não**   | Idempotência.                                   |

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
2.  **Dados da Criptomoeda:** Será necessário buscar os dados da criptomoeda para adicionar na requisição, você pode obter em <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">Criptomoedas</a>.
3.  **Dados da rede:** Será necessário buscar os dados da rede (network), você pode obter em <a href={useBaseUrl('/docs/crypto/withdraw/network')} target="_blank">Redes Blockchain</a>.
4.  **Destino:** Adicione a chave pública da carteira de quem receberá o saque na carteira externa.
5.  **Envie o pedido:** Envie a solicitação para a XGate, o tempo de aprovação pode variar dependendo da rede.

### Exemplo Prático

Para criar pedidos de saque para carteira externa, você deve seguir esses 4 passos:

:::tip[Recomendação]
É necessário criar um cliente antes de processeguir para criação de saque.

Você pode estar **<a href={useBaseUrl('/docs/customer/create')} target="_blank">clicando aqui</a>** para ir para a página de documentação de criação de cliente.
:::
>
**1. Passo:** Informe o valor em USDT em `amount` e o `_id` do cliente como `customerId`, igual nos campos destacados:
```json {2-3}
{
    "amount": 2,
    "customerId": "672f40**************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0
    },
    "blockchainNetwork": {
        "_id": "6dd37763a2***************",
        "name": "BEP-20",
        "chainId": "56",
        "cryptocurrencies": [],
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0,
        "chain": "BSC",
        "symbol": "BNB"
    },
    "wallet": "0x7A00e4a***************",
    "externalId": "6dd37763a2***************"
}
```

**2. Passo:** Você deve obter a criptomoeda com os dados para saque. 

Você pode obter a lista delas <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">clicando aqui</a>.

```json {4-12}
{
    "amount": 2,
    "customerId": "672f40**************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0
    },
    "blockchainNetwork": {
        "_id": "6dd37763a2***************",
        "name": "BEP-20",
        "chainId": "56",
        "cryptocurrencies": [],
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0,
        "chain": "BSC",
        "symbol": "BNB"
    },
    "wallet": "0x7A00e4a***************",
    "externalId": "6dd37763a2***************"
}
```

:::tip[Criptomoeda]
Os dados de `cryptocurrency` também podem ser retirados da resposta vinda da listagem de redes blockchain, o exemplo de integração em **Node.Js** mostra como funciona.
:::

#### Detalhes do Objeto

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

**3. Passo:** Você deve obter os dados da rede blockchain. 

Você pode obter a lista delas <a href={useBaseUrl('/docs/crypto/withdraw/network')} target="_blank">clicando aqui</a>.

```json {13-23}
{
    "amount": 2,
    "customerId": "672f40**************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0
    },
    "blockchainNetwork": {
        "_id": "6dd37763a2***************",
        "name": "BEP-20",
        "chainId": "56",
        "cryptocurrencies": [],
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0,
        "chain": "BSC",
        "symbol": "BNB"
    },
    "wallet": "0x7A00e4a***************",
    "externalId": "6dd37763a2***************"
}
```

:::warning[Recomendação]
Caso sua integração utilize uma rede fixa para todas as operações de saque, recomendamos enviar os valores obrigatórios via **hard-code**. Isso otimiza a performance da sua aplicação, evitando chamadas repetitivas ao endpoint de listagem de redes, que possui um volume de dados elevado.
:::

#### Detalhes do Objeto

Veja os detalhes de cada informação no objeto `blockchainNetwork` para montar sua requisição.

| Campo              | Tipo     | Obrigatório | Descrição                                               |
| :----------------- | :------- | :---------: | :------------------------------------------------------ |
| `_id`              | `string` |   **Sim**   | Identificador único da rede blockchain no sistema.      |
| `name`             | `string` |   **Sim**   | Nome técnico do padrão da rede (ex: BEP-20, ERC-20).    |
| `chainId`          | `string` |   **Sim**   | ID numérico da rede (ex: 56 para BSC, 1 para Ethereum). |
| `cryptocurrencies` | `array`  |   **Não**   | Lista de IDs das criptomoedas suportadas nesta rede.    |
| `updatedDate`      | `string` |   **Não**   | Data da última atualização dos parâmetros da rede.      |
| `createdDate`      | `string` |   **Não**   | Data de criação do registro da rede no sistema.         |
| `__v`              | `number` |   **Não**   | Versão interna do registro no banco de dados.           |
| `chain`            | `string` |   **Sim**   | Nome simplificado da blockchain (ex: BSC, ETH).         |
| `symbol`           | `string` |   **Sim**   | Símbolo da moeda nativa da rede (ex: BNB, ETH).         |

**3. Passo:** Você deve obter a chave publica da carteira para onde será enviado os valores do saque.

```json {24}
{
    "amount": 2,
    "customerId": "672f40**************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0
    },
    "blockchainNetwork": {
        "_id": "6dd37763a2***************",
        "name": "BEP-20",
        "chainId": "56",
        "cryptocurrencies": [],
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0,
        "chain": "BSC",
        "symbol": "BNB"
    },
    "wallet": "0x7A00e4a***************",
    "externalId": "6dd37763a2***************"
}
```

**4. Passo (Opcional):** Adicione o `externalId` ao final do código, ele irá evitar que o cliente envie mais de 1 (uma) vez a solicitação de saque, **evitando duplicidade**.
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
    const amount = 10.90;
    const wallet = "0x*****************";
    const customerId = "**************";

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const blockchains = await axios.get(`${url_api}//withdraw/company/blockchain-networks`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/withdraw`, {
            amount,
            wallet,
            customerId,
            cryptocurrency: blockchains.data[0].cryptocurrencies[1].cryptocurrency, // USDT
            blockchainNetwork: blockchains.data[0], // BEP-20
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
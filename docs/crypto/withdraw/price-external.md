---
sidebar_label: 'Cotação para Carteira Externa'
sidebar_position: 6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetTetherToExternalTester from '@site/src/components/GetTetherToExternalTester';

# Cotação para Carteira Externa

Este endpoint permite calcular antecipadamente quanto o cliente receberá em **USDT** (Tether) ao criar uma solitação de saque para uma carteira externa, já descontando as taxas de gás da rede blockchain vigente.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/withdraw/transaction/crypto/amount
```

---

## Testar Integração

Utilize o formulário abaixo para simular um saque para carteira externa. O sistema irá buscar automaticamente os dados necessários e calcular quanto receberia em USDT.

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
| `amount`            | `number` |   **Sim**   | Valor em USDT (Tether) que se deseja calcular o saque.                           |
| `cryptocurrency`    | `object` |   **Sim**   | O objeto da criptomoeda, obtido na rota de listagem de criptomoedas para saques. |
| `blockchainNetwork` | `object` |   **Sim**   | O objeto da rede blockchain, obtido na listagem de redes blockchain.             |

---

## Respostas (Responses)

### Sucesso (200 OK)

Retorna o valor que aproximadamente será recebido na carteira externa. 

```json
{
    "amount": 9.369984879637112
}
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                  |
| :------ | :---------------------- | :----------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br />• IP não permitido. |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                         |

---

## Como usar

Esta rota **não gera** um pedido de pagamento, ela serve apenas para **consulta**.

### O Fluxo Recomendado (UX)

1.  **Input:** O usuário digita "10" (USDT) no seu app/site.
2.  **Consulta:** Seu sistema chama `POST /withdraw/transaction/crypto/amount` enviando o valor 10, o objeto da rede e o objeto da criptomoeda.
3.  **Exibição:** A API retorna que isso equivale a `9.369984879637112 USDT`. Você exibe: *"Você receberá aproximadamente 9.369984879637112 USDT"*.
4.  **Ação:** Se o usuário concordar, você chama a rota de **Criar Pedido de Saque para Carteira Externa** (`POST /withdraw`).

### Exemplo Prático

Siga os passos abaixo para realizar a cotação para carteira externa.

**1. Passo:** Insira o valor em USDT para a cotação:
```json {2}
{
    "amount": 10,
    "blockchainNetwork": {
        "_id": "6733a3a20076c0dd9822b87a",
        "name": "BEP-20",
        "chainId": "56",
        "chain": "BSC",
        "symbol": "BNB"
    },
    "cryptocurrency": {
        "_id": "6733a2a90076c0dd9822b86a",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether"
    }
}
```

**2. Passo:** Você deve buscar e injetar o objeto da rede blockchain dentro de `blockchainNetwork`:

```json {3-9}
{
    "amount": 10,
    "blockchainNetwork": {
        "_id": "6733a3a20076c0dd9822b87a",
        "name": "BEP-20",
        "chainId": "56",
        "chain": "BSC",
        "symbol": "BNB"
    },
    "cryptocurrency": {
        "_id": "6733a2a90076c0dd9822b86a",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether"
    }
}
```
Você pode obter a lista de redes blockchain <a href={useBaseUrl('/docs/crypto/withdraw/network')} target="_blank">clicando aqui</a>.

**3. Passo:** Você deve buscar e injetar o objeto da criptomoeda dentro de `cryptocurrency`:

```json {10-15}
{
    "amount": 10,
    "blockchainNetwork": {
        "_id": "6733a3a20076c0dd9822b87a",
        "name": "BEP-20",
        "chainId": "56",
        "chain": "BSC",
        "symbol": "BNB"
    },
    "cryptocurrency": {
        "_id": "6733a2a90076c0dd9822b86a",
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
            
    // Seleciona a primeira rede disponível (Ex: BEP-20)
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
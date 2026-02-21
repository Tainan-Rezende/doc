---
sidebar_label: 'Buscar Carteira'
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetCryptoWalletTester from '@site/src/components/GetCryptoWalletTester';

# Buscar Carteira Crypto

Este endpoint retorna as carteiras de criptomoedas associadas a um cliente específico. 

Utilize esta rota para obter o **endereço (address)** de depósito e verificar a **rede (network)** (ex: ERC-20, BEP-20).

---
## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/crypto/customer/CLIENT_ID/wallet
```

:::warning[Importante]
O campo `CLIENT_ID` se refere ao ID do cliente, se ainda não criou, você pode cria-lo a partir da página de <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>criar clientes</a>.
:::

---

## Testar Integração

Utilize o formulário abaixo para listar as carteiras de um cliente.

<GetCryptoWalletTester />

---

## Requisição

É necessário enviar o **Header** de autenticação e passar o **ID do Cliente** na URL.

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

#### Parâmetros de URL

| Parâmetro   | Tipo     | Obrigatório | Descrição                                     |
| :---------- | :------- | :---------: | :-------------------------------------------- |
| `CLIENT_ID` | `string` |   **Sim**   | O `_id` do cliente que você deseja consultar. |

---

## Respostas (Responses)

### Sucesso (200 OK)

Retorna um array com a carteira gerada e a rede que deve ser utilizada para receber depósitos via criptomoedas.

```json
[
  {
    "blockchainNetworks": [
      "Ethereum",
      "ERC-20",
      "BEP-20"
    ],
    "publicKey": "0xf898b006511848B7************************"
  }
]
```

:::warning[Importante]
Depósitos de origem crypto não aparecem na aba depósitos da Dashboard até que sejam concluídas (Pagas).
:::

:::danger[Risco de Perda de Fundos]
1.  **Apenas USDT:** A XGate processa exclusivamente depósitos em **Tether (USDT)**. O envio de outras criptomoedas (como Bitcoin, Ethereum nativo, TRX, etc.) para este endereço resultará na **perda irreversível** do valor.
2.  **Rede Correta:** O depósito deve ser feito obrigatoriamente através de uma das redes listadas no retorno da API (ex: `ERC-20`, `BEP-20` ou `Polygon`). O uso de redes não suportadas impedirá o recebimento do valor.
:::

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido. |
| **404** | `Not Found`             | Cliente não encontrado.                                                                           |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                          |

---

## Como usar

As informações entregues nesta rota são o **Endereço (publicKey)** e as **Redes (blockchainNetworks)**. Elas serão utilizadas sempre que você ou seu cliente final desejar realizar um depósito em **USDT**.

O fluxo para o usuário final deve ser:
1.  O sistema exibe o endereço (`publicKey`).
2.  O sistema informa quais redes são aceitas (`blockchainNetworks`).
3.  O usuário vai até a corretora ou carteira dele e envia **USDT** usando uma das redes listadas para o endereço informado.

### ⚠️ Regras Críticas de Depósito

Para garantir a segurança dos fundos, o desenvolvedor deve exibir avisos claros no front-end para o usuário final:

:::danger[Risco de Perda de Fundos]
1.  **Apenas USDT:** A XGate processa exclusivamente depósitos em **Tether (USDT)**. O envio de outras criptomoedas (como Bitcoin, Ethereum nativo, TRX, etc.) para este endereço resultará na **perda irreversível** do valor.
2.  **Rede Correta:** O depósito deve ser feito obrigatoriamente através de uma das redes listadas no retorno da API (ex: `ERC-20`, `BEP-20` ou `Polygon`). O uso de redes não suportadas impedirá o recebimento do valor.
:::

### Exemplo de Aplicação (UX)

Ao integrar essa rota, recomendamos que sua interface mostre as informações da seguinte maneira:

> **Deposite apenas USDT**
>
> **Redes Aceitas:** Ethereum (ERC-20), Binance Smart Chain (BEP-20), Polygon.
>
> **Endereço de Depósito:**
> `0xf898b006511848B7************************` (Botão Copiar)

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
    const customerId = "************"

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/crypto/customer/${customerId}/wallet`, {
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
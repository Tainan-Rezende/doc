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

:::danger[Importante]
Atualmente, a XGate trabalha apenas com **USDT, todo depósito de origem crypto devem ser dessa criptomoeda**.
:::

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido. |
| **404** | `Not Found`             | Cliente não encontrado.                                                                           |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                          |

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
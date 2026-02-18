---
sidebar_label: 'Cotação USDT para FIAT'
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetTetherConversionToFiatTester from '@site/src/components/GetTetherConversionToFiatTester';

# Cotação USDT para FIAT

Este endpoint permite calcular antecipadamente quanto o cliente receberá em **BRL** ao sacar um valor específico em USDT.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/withdraw/conversion/brl/pix
```

---

## Testar Integração

Utilize o formulário abaixo para simular a cotação. O sistema irá buscar automaticamente os dados da criptomoeda e calcular quanto renderia em BRL.

<GetTetherConversionToFiatTester />

---

## Requisição

É necessário enviar o **Header** de autenticação e o corpo JSON com o valor e o objeto da moeda.

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

#### Body (Corpo da Requisição)

| Campo            | Tipo     | Obrigatório | Descrição                                                                        |
| :--------------- | :------- | :---------: | :------------------------------------------------------------------------------- |
| `amount`         | `number` |   **Sim**   | Valor em USDT (Tether) que se deseja calcular a cotação.                         |
| `cryptocurrency` | `object` |   **Sim**   | O objeto da criptomoeda, obtido na rota de listagem de criptomoedas para saques. |

---

## Respostas (Responses)

### Sucesso (200 OK)

Retorna o valor convertido, a moeda e a taxa de câmbio utilizada no momento.

```json
{
  "amount": 5.17,
  "currency": "R$",
  "cryptoToFiatExchangeRate": "R$ 5.170"
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

1.  **Input:** O usuário digita "1" (valor em USDT) no seu app/site.
2.  **Consulta:** Seu sistema chama `POST /withdraw/conversion/brl/pix` enviando o valor 1 USDT e o objeto da criptomoeda.
3.  **Exibição:** A API retorna que isso equivale a `5.17`. Você exibe: *"Você receberá aproximadamente R$ 5,17"*.
4.  **Ação:** Se o usuário concordar, você chama a rota de **Criar Pedido de Saque Conversão Cripto para FIAT** (`POST /withdraw`).

### Exemplo Prático

Siga os passos abaixo para realizar a cotação USDT para FIAT.

**1. Passo:** Insira o valor em USDT para a cotação:
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

**2. Passo:** Você deve buscar e injetar o objeto da criptomoeda dentro de `cryptocurrency`:

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
Você pode obter a lista de criptomoedas <a href={useBaseUrl('/docs/fiat/withdraw/cryptocurrency')} target="_blank">clicando aqui</a>.

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
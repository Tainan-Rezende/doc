---
sidebar_label: 'Cotação FIAT para USDT'
sidebar_position: 4
description: 'Este endpoint permite calcular antecipadamente quanto o cliente receberá na criptomoeda de destino ao depositar um valor específico em moeda fiduciária.'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetTetherConversionTester from '@site/src/components/GetTetherConversionTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Cotação FIAT para USDT

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Cotação FIAT para USDT
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /deposit/conversion/tether:
    post:
      summary: Cotação FIAT para USDT
      description: Calcula antecipadamente a conversão de um valor em moeda fiduciária (ex BRL) para USDT com base na taxa de câmbio atual. É uma rota de consulta e não gera um pedido de depósito.
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
                  description: Valor em moeda fiduciária a ser convertido (ex 100.00).
                currency:
                  type: object
                  description: Objeto da moeda fiat de origem (obtido via GET /deposit/company/currencies).
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
      responses:
        '200':
          description: Sucesso. Retorna o valor convertido e a taxa de câmbio aplicada.
          content:
            application/json:
              schema:
                type: object
                properties:
                  amount:
                    type: number
                    description: Valor convertido na criptomoeda de destino.
                  crypto:
                    type: string
                    description: Sigla da criptomoeda (ex USDT).
                  fiatToCryptoExchangeRate:
                    type: string
                    description: Taxa de câmbio utilizada no momento da cotação.
        '401':
          description: Unauthorized. Token JWT inválido, expirado ou não informado.
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

Este endpoint permite calcular antecipadamente quanto o cliente receberá em **USDT** (Tether) ao depositar um valor específico em moeda fiduciária (BRL).

Utilize esta rota para exibir uma "prévia" ou cotação em tempo real na tela do seu usuário antes que ele confirme a geração do pedido de depósito.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/deposit/conversion/tether
```

---

## Testar Integração

Utilize o formulário abaixo para simular uma conversão. O sistema irá buscar automaticamente os dados da moeda BRL e calcular quanto renderia em USDT.

<GetTetherConversionTester />

---

## Requisição

É necessário enviar o **Header** de autenticação e o corpo JSON com o valor e o objeto da moeda.

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

#### Body (Corpo da Requisição)

| Campo      | Tipo     | Obrigatório | Descrição |
| :--------- | :------- | :---------: | :-------- |
| `amount`   | `number` | **Sim** | Valor em Reais (BRL) que se deseja converter. |
| `currency` | `object` | **Sim** | O objeto da moeda Fiat (BRL), obtido na rota de listagem de moedas. |

---

## Respostas (Responses)

### Sucesso (200 OK)

Retorna o valor convertido, a sigla da cripto e a taxa de câmbio utilizada no momento.

```json
{
  "amount": 0.186433,
  "crypto": "USDT",
  "fiatToCryptoExchangeRate": "R$ 5.364"
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

1.  **Input:** O usuário digita "R$ 100,00" no seu app/site.
2.  **Consulta:** Seu sistema chama `POST /deposit/conversion/tether` enviando o valor 100 e o objeto da moeda BRL.
3.  **Exibição:** A API retorna que isso equivale a `18.64 USDT`. Você exibe: *"Você receberá aproximadamente 18.64 USDT"*.
4.  **Ação:** Se o usuário concordar, aí sim você chama a rota de **Criar Pedido de Depósito** (`POST /deposit`).

### Exemplo Prático

Siga os passos abaixo para realizar a cotação

**1. Passo:** Insira o valor em BRL para a cotação:
```json {2}
{
  "amount": 100,
  "currency": {
    "_id": "6728cba3******************",
    "name": "BRL",
    "type": "PIX",
    "createdDate": "2024-11-04T16:04:50.019Z",
    "updatedDate": "2024-11-07T02:23:38.606Z",
    "__v": 0,
    "symbol": "R$"
  }
}
```

**2. Passo:** Você deve buscar e injetar o objeto da moeda dentro de `currency`:

```json {3-11}
{
  "amount": 100,
  "currency": {
    "_id": "6728cba3******************",
    "name": "BRL",
    "type": "PIX",
    "createdDate": "2024-11-04T16:04:50.019Z",
    "updatedDate": "2024-11-07T02:23:38.606Z",
    "__v": 0,
    "symbol": "R$"
  }
}
```
Você pode obter a lista de moedas <a href={useBaseUrl('/docs/fiat/deposit/currency')} target="_blank">clicando aqui</a>.

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
        const currencies = await axios.get(`${url_api}/deposit/company/currencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/deposit/conversion/tether`, {
            amount,
            currency: currencies.data[0]
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
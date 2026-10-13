---
sidebar_label: 'Criptomonedas'
sidebar_position: 1
description: 'Este endpoint devuelve todas las criptomonedas disponibles para su cuenta.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ListWithdrawCryptoCurrenciesTester from '@site/src/components/ListWithdrawCryptoCurrenciesTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Listar Criptomonedas

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Listar Criptomoedas para Saque
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /withdraw/company/cryptocurrencies:
    get:
      summary: Listar Criptomoedas para Saque
      description: Retorna uma lista de todas as criptomoedas (ex USDT) disponíveis para a conta da empresa para operações de cash-out. O objeto retornado é necessário para compor o payload de saques com ou sem conversão.
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Sucesso. Lista de criptomoedas recuperada corretamente.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    _id:
                      type: string
                      description: ID único da criptomoeda.
                    name:
                      type: string
                      description: Nome da criptomoeda (ex USDT).
                    symbol:
                      type: string
                      description: Símbolo representativo da moeda (ex USDT).
                    coinGecko:
                      type: string
                      description: Identificador da moeda na API do CoinGecko.
                    createdDate:
                      type: string
                      format: date-time
                    updatedDate:
                      type: string
                      format: date-time
                    __v:
                      type: integer
        '401':
          description: Unauthorized. Token inválido, expirado ou ausente.
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

Este endpoint devuelve todas las criptomonedas disponibles para su cuenta. Utilice esta ruta para consultar los datos necesarios para crear solicitudes de órdenes de retiro.

---
## Endpoint
- **Método:** <span className="badge badge--success">GET</span>
```bash title="Endpoint URL"
https://api.xgateglobal.com/withdraw/company/cryptocurrencies
```

---

## Probar Integración

Utilice el formulario a continuación para simular la lista de criptomonedas.

<ListWithdrawCryptoCurrenciesTester />

---
## Solicitud

La solicitud no requiere un cuerpo (body), solo **Headers** de autenticación.

#### Headers Requeridos

| Header          | Valor               | Descripción                                   |
| :-------------- | :------------------ | :-------------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido en el inicio de sesión. |

---

## Respuestas

### Éxito (200 OK)

Devuelve una lista (array) de objetos, donde cada objeto es una criptomoneda.

```json
[
  {
    "_id": "6733a2a900**************",
    "name": "USDT",
    "symbol": "USDT",
    "coinGecko": "tether",
    "updatedDate": "2024-1**************",
    "createdDate": "2024-1**************",
    "__v": 0,
    "uid": "01KH7K88HZ**************"
  },
  {
    "_id": "6733a2a000**************",
    "name": "USDC",
    "symbol": "USDC",
    "coinGecko": "usdc",
    "updatedDate": "2024-1**************",
    "createdDate": "2024-1**************",
    "__v": 0,
    "uid": "01KH7K4C0BZ**************"
  }
]
```

### Errores Comunes

| Status  | Mensaje                 | Razón Probable                                                                           |
| :------ | :---------------------- | :--------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido o expirado.<br /> • Header inválido o ausente.<br /> • IP no permitida. |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte a soporte.                                          |

---

## Cómo usar

El propósito principal de listar las criptomonedas es permitir la selección de la criptomoneda correcta para crear una orden de retiro (**Withdraw Order**).

La respuesta de este endpoint proporciona el **Objeto Completo** de la criptomoneda, permitiendo la construcción del payload de creación de la orden.

### El Flujo de Integración

1.  **Listar criptomonedas:** Llame a este endpoint (`GET /withdraw/company/cryptocurrencies`).
2.  **Selección:** Identifique la criptomoneda deseada en la lista (usualmente filtrando por `name` o `symbol`, ej., "USDT").
3.  **Envío:** Debe pasar el **objeto** dentro de la propiedad `cryptocurrency` en el payload de creación de la orden. En la documentación para <a href={useBaseUrl('/docs/crypto/withdraw/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>crear retiro crypto</a> se muestran los valores **requeridos**.

### Ejemplo Práctico

**1. Qué recibe al listar las criptomonedas:**
```json
[
  {
    "_id": "6733a2a900**************",
    "name": "USDT",
    "symbol": "USDT",
    "coinGecko": "tether",
    "updatedDate": "2024-1**************",
    "createdDate": "2024-1**************",
    "__v": 0,
    "uid": "01KH7K88HZ**************"
  },
  {
    "_id": "6733a2a000**************",
    "name": "USDC",
    "symbol": "USDC",
    "coinGecko": "usdc",
    "updatedDate": "2024-1**************",
    "createdDate": "2024-1**************",
    "__v": 0,
    "uid": "01KH7K4C0BZ**************"
  }
]
```

**2. Cómo debe enviarlo en el retiro (POST /withdraw):**

Tomará el objeto anterior y lo inyectará en `cryptocurrency`:
```json {4-8}
{
    "amount": 2,
    "customerId": "6759a16f20***************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT"
    },
    "blockchainNetwork": {
        "_id": "69ea849098**************",
        "chain": "Solana",
        "name": "Solana",
        "symbol": "SOL"
    },
    "wallet": "0x7A00e4a***************",
    "externalId": "6dd37763a2***************"
}
```
Cada información en este JSON será explicada en la <a href={useBaseUrl('/docs/crypto/withdraw/create-external/')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>página para crear retiros crypto a FIAT</a>.

---

## Integración

<Tabs groupId="sdk-examples">
  <TabItem label="Node.js" value="js">
    El ejemplo de integración utiliza la biblioteca <code>Axios</code> en Node.js.

    **Instalando `Axios`:**
    ```bash
    npm install axios
    ```

    **Ejemplo en JavaScript:**
```js   
const axios = require("axios");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";
    const customerId = "************";
    const amount = 10.90;

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const cryptocurrencies = await axios.get(`${url_api}/withdraw/company/cryptocurrencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const currencies = await axios.get(`${url_api}/withdraw/company/currencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const pixKey = await axios.get(`${url_api}/pix/customer/${customerId}/key`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/withdraw/conversion/brl/pix`, {
            amount,
            customerId,
            currency: currencies.data[0],
            cryptocurrency: cryptocurrencies.data[0],
            pixKey: pixKey.data[0]
        }, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        console.log(data); // Respuesta
    } catch (error) {
        console.log(error.response.data.message) // Error
    }
})()
```
  </TabItem>
</Tabs>
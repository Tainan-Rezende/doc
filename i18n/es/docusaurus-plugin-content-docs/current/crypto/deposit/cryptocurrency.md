---
sidebar_label: 'Criptomonedas'
sidebar_position: 1
description: 'Este endpoint devuelve todas las criptomonedas disponibles para su cuenta.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ListDepositCryptoCurrenciesTester from '@site/src/components/ListDepositCryptoCurrenciesTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Listar criptomonedas

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Listar Criptomoedas
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /deposit/company/cryptocurrencies:
    get:
      summary: Listar Criptomoedas para Depósito
      description: Retorna uma lista de todas as criptomoedas disponíveis (ex USDT) para a conta da empresa. O objeto retornado é necessário para compor o payload de criação de pedidos de depósito com conversão.
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

Este endpoint devuelve todas las criptomonedas disponibles para su cuenta. Utilice esta ruta para consultar los datos necesarios para crear solicitudes de orden de depósito.

---
## Endpoint
- **Método:** <span className="badge badge--success">GET</span>
```bash title="URL del endpoint"
https://api.xgateglobal.com/deposit/company/cryptocurrencies
```

---

## Prueba de integración

Utilice el formulario a continuación para simular la lista de criptomonedas.

<ListDepositCryptoCurrenciesTester />

---

## Solicitud

La solicitud no requiere cuerpo, solo los **encabezados de autenticación**.

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

---

## Respuestas

### Éxito (200 OK)

Devuelve una lista (array) de objetos, donde cada objeto es una criptomoneda.

```json
[
  {
    "_id": "67339b18ca5**************",
    "name": "USDT",
    "symbol": "USDT",
    "coinGecko": "tether",
    "updatedDate": "2024-1**************",
    "createdDate": "2024-1**************",
    "__v": 0,
    "uid": "01KH7K88H**************"
  },
  {
    "_id": "67339b2bca5**************",
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

### Errores comunes

| Estado  | Mensaje                 | Posible causa                                                                                |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado inválido o faltante.<br /> • IP no permitida. |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                            |

---

## Cómo usar

El propósito principal de listar criptomonedas es permitir seleccionar la criptomoneda correcta para crear una orden de depósito (**Deposit Order**).

La respuesta de este endpoint proporciona el **objeto completo** de la criptomoneda, lo que permite construir el payload de creación de la orden.

### Flujo de integración

1.  **Listar las monedas:** Llame a este endpoint (`GET /deposit/company/cryptocurrencies`).
2.  **Selección:** Identifique la criptomoneda deseada en la lista (normalmente filtrando por `name` o `symbol`, por ejemplo, "USDT").
3.  **Envío:** Debe pasar el **objeto** dentro de la propiedad `cryptocurrency` en el payload de creación de la orden de depósito. En la documentación de <a href={useBaseUrl('/docs/crypto/deposit/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>creación de depósito en criptomonedas</a>, se muestran los valores **obligatorios**.

### Ejemplo práctico

**1. Lo que recibe al listar las criptomonedas:**
```json
[
  {
    "_id": "67339b18ca5**************",
    "name": "USDT",
    "symbol": "USDT",
    "coinGecko": "tether",
    "updatedDate": "2024-1**************",
    "createdDate": "2024-1**************",
    "__v": 0,
    "uid": "01KH7K88H**************"
  },
  {
    "_id": "67339b2bca5**************",
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

**2. Cómo debe enviarlo en el depósito (POST /deposit):**

Tomará el objeto anterior y lo insertará dentro de `cryptocurrency`:
```json {13-22}
{
  "amount": 2,
  "customerId": "672f40**************",
  "currency": {
    "_id": "6728f0a2cb************",
    "name": "BRL",
    "type": "PIX",
    "createdDate": "2024-1************",
    "updatedDate": "2026-0************",
    "__v": 0,
    "symbol": "R$"
  },
  "cryptocurrency": {
    "_id": "67339b2bca5**************",
    "name": "USDC",
    "symbol": "USDC",
    "coinGecko": "usdc",
    "updatedDate": "2024-1**************",
    "createdDate": "2024-1**************",
    "__v": 0,
    "uid": "01KH7K4C0BZ**************"
  },
  "externalId": "67ce09d**************"
}
```
Cada parte de este JSON se explicará en la <a href={useBaseUrl('/docs/crypto/deposit/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>página de creación de orden de depósito en criptomonedas</a>.

---

## Integración

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    Este ejemplo de integración utiliza la librería <code>Axios</code> en Node.js.

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

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/deposit/company/cryptocurrencies`, {
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
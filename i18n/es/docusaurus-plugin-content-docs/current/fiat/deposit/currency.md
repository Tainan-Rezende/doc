---
sidebar_label: 'Monedas FIAT'
sidebar_position: 1
description: 'Este endpoint devuelve todas las monedas fiduciarias disponibles para su cuenta.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ListDepositCurrenciesTester from '@site/src/components/ListDepositCurrenciesTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Listar monedas FIAT

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Listar Moedas FIAT
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /deposit/company/currencies:
    get:
      summary: Listar Moedas para Depósito
      description: Retorna uma lista de todas as moedas fiduciárias disponíveis para a conta da empresa. O objeto retornado é obrigatório na construção do payload de criação de pedidos de depósito.
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Sucesso. Lista de moedas recuperada corretamente.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    _id:
                      type: string
                      description: ID único da moeda.
                    name:
                      type: string
                      description: Nome/código da moeda (ex BRL).
                    type:
                      type: string
                      description: Tipo de transação ou método (ex PIX).
                    symbol:
                      type: string
                      description: Símbolo representativo da moeda (ex R$).
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

Este endpoint devuelve todas las monedas fiduciarias disponibles para su cuenta. Utilice esta ruta para consultar las monedas y construir la solicitud de creación de orden de depósito.

---
## Endpoint
 - **Método:** <span className="badge badge--success">GET</span>
```bash title="URL del endpoint"
https://api.xgateglobal.com/deposit/company/currencies
```

---

## Prueba de integración

Utilice el formulario a continuación para simular el listado de monedas FIAT.

<ListDepositCurrenciesTester />

---

## Solicitud

La solicitud no requiere cuerpo (`body`); solo encabezados de autenticación **Headers**.

#### Encabezados obligatorios

| Encabezado      | Valor                 | Descripción                      |
| :-------------- | :-------------------- | :------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

---

## Respuestas

### Éxito (200 OK)

Devuelve una lista (array) de objetos, donde cada objeto es una moneda.

```json
[
  {
    "_id": "6728f0a2cb************",
    "name": "BRL",
    "type": "PIX",
    "createdDate": "2024-1************",
    "updatedDate": "2026-0************",
    "__v": 0,
    "symbol": "R$",
    "supplierFeeByActivity": {
      "xgatetreeal": {
        "type": "FIXED",
        "value": 0.0
      },
      "xgatetreealliquidity": {
        "type": "PERCENTAGE",
        "value": 0.00
      }
    }
  }
]
```

### Errores comunes

| Estado  | Mensaje                 | Posible causa                                                                          |
| :------ | :---------------------- | :------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado inválido o faltante.<br /> • IP no permitida. |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                     |

---

## Cómo usar

El propósito principal de listar las monedas FIAT es permitir seleccionar la moneda correcta al crear una orden de depósito (**Deposit Order**).

La respuesta de este endpoint proporciona el **objeto completo** de la moneda, que es necesario para construir el payload de creación de la orden.

### Flujo de integración

1.  **Listar las monedas:** Llame a este endpoint (`GET /deposit/company/currencies`).
2.  **Seleccionar:** Identifique la moneda deseada en la lista (normalmente por `name` o `symbol`, por ejemplo, "BRL").
3.  **Enviar:** Pase el **objeto** dentro de la propiedad `currency` en el payload de creación de la orden; los campos obligatorios se muestran en la documentación de <a href={useBaseUrl('/docs/fiat/deposit/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>crear depósito</a>.

### Ejemplo práctico

**1. Lo que recibe al listar las monedas FIAT:**
```json
[
  {
    "_id": "6728f0a2cb************",
    "name": "BRL",
    "type": "PIX",
    "createdDate": "2024-1************",
    "updatedDate": "2026-0************",
    "__v": 0,
    "symbol": "R$",
    "supplierFeeByActivity": {
      "xgatetreeal": {
        "type": "FIXED",
        "value": 0.0
      },
      "xgatetreealliquidity": {
        "type": "PERCENTAGE",
        "value": 0.00
      }
    }
  }
]
```

**2. Cómo debe enviarlo en el depósito (POST /deposit):**

Tomará el objeto anterior e lo insertará dentro de `currency`:
```json {4-22}
{
    "amount": 0.2,
    "customerId": "68e7b8****************",
    "currency": {
      "_id": "6728f0a2cb************",
      "name": "BRL",
      "type": "PIX",
      "createdDate": "2024-1************",
      "updatedDate": "2026-0************",
      "__v": 0,
      "symbol": "R$",
      "supplierFeeByActivity": {
        "xgatetreeal": {
          "type": "FIXED",
          "value": 0.0
        },
        "xgatetreealliquidity": {
          "type": "PERCENTAGE",
          "value": 0.00
        }
      }
    }
}
```
Cada campo de este JSON se explica en la <a href={useBaseUrl('/docs/fiat/deposit/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>página de creación de orden de depósito</a>.

---

## Integración

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    El ejemplo de integración utiliza la librería <code>Axios</code> en Node.js.

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
        const { data } = await axios.get(`${url_api}/deposit/company/currencies`, {
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
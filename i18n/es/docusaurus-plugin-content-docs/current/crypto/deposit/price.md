---
sidebar_label: 'Cotización'
sidebar_position: 4
description: 'Este endpoint le permite calcular con anticipación cuánto recibirá el cliente en criptomonedas al depositar un monto específico en moneda fiduciaria.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetTetherConversionTester from '@site/src/components/GetTetherConversionTester';
import AICopyButton from '@site/src/components/AICopyButton';
import CryptoDeprecationNotice from '@site/src/components/CryptoDeprecationNotice';

# Cotización de fiat a criptomonedas

<CryptoDeprecationNotice />

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Cotação FIAT para Crypto
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /deposit/conversion/tether:
    post:
      summary: Cotação FIAT para Crypto
      description: Calcula antecipadamente a conversão de um valor em moeda fiduciária (ex BRL) para Crypto com base na taxa de câmbio atual. É uma rota de consulta e não gera um pedido de depósito.
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
                    description: Sigla da criptomoeda.
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

Este endpoint le permite calcular con anticipación cuánto recibirá el cliente en criptomonedas al depositar un monto específico en moneda fiduciaria.

Utilice esta ruta para mostrar una "vista previa" o cotización en tiempo real en la pantalla de su usuario antes de que confirme la generación de la orden de depósito.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/deposit/conversion/tether
```

---

## Prueba de integración

Utilice el formulario a continuación para simular una conversión. El sistema obtendrá automáticamente los datos de la moneda BRL y calculará cuánto produciría en criptomonedas.

<GetTetherConversionTester />

---

## Solicitud

Debe enviar el **encabezado de autenticación** y el cuerpo JSON con el monto y el objeto de moneda.

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Cuerpo (Request Body)

| Campo      | Tipo     | Requerido | Descripción                                                                      |
| :--------- | :------- | :-------: | :------------------------------------------------------------------------------- |
| `amount`   | `number` |  **Sí**   | Monto en moneda fiduciaria que desea convertir.                                  |
| `currency` | `object` |  **Sí**   | El objeto de la moneda fiduciaria, obtenido desde la ruta de listado de monedas. |

---

## Respuestas

### Éxito (200 OK)

Devuelve el valor convertido, el acrónimo de la criptomoneda y la tasa de cambio utilizada en ese momento.

```json
{
  "amount": 0.186433,
  "crypto": "USDT",
  "fiatToCryptoExchangeRate": "R$ 5.364"
}
```

### Errores comunes

| Estado  | Mensaje                 | Posible causa                                                                               |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado inválido o faltante.<br />• IP no permitida. |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                           |

---

## Cómo usar

Esta ruta **no genera** una orden de pago; solo sirve para **consulta**.

### Flujo recomendado (UX)

1.  **Entrada:** El usuario escribe "R$ 100.00" en su aplicación o sitio.
2.  **Consulta:** Su sistema llama a `POST /deposit/conversion/tether` enviando el monto 100 y el objeto de moneda BRL.
3.  **Visualización:** La API devuelve que esto equivale a `18.64 USDT`. Usted muestra: *"Recibirá aproximadamente 18.64 USDT"*.
4.  **Acción:** Si el usuario está de acuerdo, entonces llama a la ruta **Crear orden de depósito** (`POST /deposit`).

### Ejemplo práctico

Siga los pasos a continuación para realizar la cotización.

**Paso 1:** Ingrese el monto en BRL para la cotización:
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

**Paso 2:** Debe obtener e inyectar el objeto de moneda dentro de `currency`:

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
Puede obtener la lista de monedas <a href={useBaseUrl('/docs/fiat/deposit/currency')} target="_blank">haciendo clic aquí</a>.

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
        console.log(data); // Respuesta
    } catch (error) {
        console.log(error.response.data.message) // Error
    }
})()
```
  </TabItem>
</Tabs>
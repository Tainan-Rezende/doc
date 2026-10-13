---
sidebar_label: 'Retiro crypto a FIAT'
sidebar_position: 3
description: 'Este endpoint permite al cliente canjear sus activos digitales con conversión automática a moneda fiduciaria.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import WithdrawFiatToCryptoTester from '@site/src/components/CreateWithdrawConversion';
import AICopyButton from '@site/src/components/AICopyButton';

# Retiro de criptomonedas con conversión a FIAT

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Criar Saque para FIAT (Crypto → FIAT)
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /withdraw:
    post:
      summary: Solicitar Saque com Conversão (Crypto → FIAT)
      description: Cria uma ordem de saque onde os ativos digitais (ex USDT) são convertidos e pagos em moeda fiduciária via Pix para o cliente.
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
                - customerId
                - currency
                - cryptocurrency
                - pixKey
              properties:
                amount:
                  type: number
                  description: O valor do saque na criptomoeda de origem (ex 0.1).
                customerId:
                  type: string
                  description: O ID único (_id) do cliente que fará o saque.
                currency:
                  type: object
                  description: A moeda fiduciária de destino (ex BRL).
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
                cryptocurrency:
                  type: object
                  description: A criptomoeda de origem (ex USDT).
                  required:
                    - _id
                    - name
                    - symbol
                  properties:
                    _id:
                      type: string
                    name:
                      type: string
                    symbol:
                      type: string
                    coinGecko:
                      type: string
                pixKey:
                  type: object
                  description: A chave Pix cadastrada do cliente para recebimento do valor convertido.
                  required:
                    - key
                    - type
                    - _id
                  properties:
                    key:
                      type: string
                    type:
                      type: string
                    _id:
                      type: string
                externalId:
                  type: string
                  description: Identificador de idempotência para evitar duplicidade na solicitação de saque.
                identifiedDocumentPix:
                  type: boolean
                  description: Quando definido como true, força a validação da titularidade/documento no Pix, independentemente da configuração padrão da conta.
      responses:
        '201':
          description: Sucesso. Retorna o status PENDING e o ID da transação.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Solicitação de Saque realizada com sucesso
                  status:
                    type: string
                    example: PENDING
                  _id:
                    type: string
        '401':
          description: Unauthorized. Token inválido, expirado ou ausente.
        '404':
          description: Not Found. O customerId fornecido não existe.
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

Este endpoint permite al cliente canjear sus activos digitales con **conversión automática a moneda fiduciaria**. En la práctica, el sistema procesa la venta de criptomonedas (por ejemplo, USDT) y realiza el pago equivalente en BRL directamente a través de **Pix** en la clave registrada.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/withdraw
```

---

## Prueba de integración

Utilice el formulario a continuación para simular la creación de una orden de conversión de criptomonedas a FIAT.

<WithdrawFiatToCryptoTester />

---

## Solicitud

Debe enviar el **encabezado de autenticación** y el **cuerpo** con los datos de la orden.

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Cuerpo (Request Body)

| Campo                   | Tipo      | Requerido | Descripción                                                                   |
| :---------------------- | :-------- | :-------: | :---------------------------------------------------------------------------- |
| `amount`                | `number`  |  **Sí**   | El monto del retiro en USDT (por ejemplo, `0.1` mínimo).                      |
| `customerId`            | `string`  |  **Sí**   | El ID único (`_id`) del cliente que realiza el retiro.                        |
| `currency`              | `object`  |  **Sí**   | La moneda de la transacción (por ejemplo, `BRL`).                             |
| `cryptocurrency`        | `object`  |  **Sí**   | La criptomoneda de la transacción (por ejemplo, `USDT`).                      |
| `pixKey`                | `object`  |  **Sí**   | La clave Pix del cliente para el retiro.                                      |
| `externalId`            | `string`  |  **No**   | Idempotencia.                                                                 |
| `identifiedDocumentPix` | `boolean` |  **No**   | Cuando es `true`, fuerza la verificación de titularidad del documento en Pix. |

:::info[Sobre la validación de titularidad]
El envío del parámetro `identifiedDocumentPix` con el valor `false` (o su ausencia) **no desactiva** la verificación de titularidad si está configurada como **obligatoria** en el panel administrativo de XGate para tu cuenta. 

Este parámetro sirve estrictamente para **forzar** la validación (enviando `true`) en cuentas donde la regla predeterminada del panel está desactivada. Para desactivar la verificación de titularidad de manera definitiva, es necesario un acuerdo comercial vía contrato.
:::

:::warning[Importante: Identificación del Cliente]
Para crear un depósito, es **obligatorio** identificar al usuario. Debes enviar el `customerId` (si el cliente ya existe) **O** el objeto `customer` (para crear un nuevo cliente en el momento del pedido). 

Nunca envíes ambos campos en la misma solicitud, ya que esto resultará en una falla de la transacción.
:::

:::tip[Buenas Prácticas: Prevención de Duplicidad]
Recomendamos encarecidamente enviar el campo `externalId`. Actúa como una clave de idempotencia, garantizando que el mismo pedido de depósito no se cree por duplicado en caso de fallas en la red, doble clic o reintentos accidentales por parte de tu sistema.
:::

---

## Respuestas

### Éxito (201 Created)

Devuelve el objeto de la orden creada, que contiene información sobre el `status` y el `_id` de la transacción.

```json
{
  "message": "Solicitação de Saque realizada com sucesso",
  "status": "PENDING",
  "_id": "69849e8c50****************"
}
```

### Errores comunes

| Estado  | Mensaje                 | Posible causa                                                                               |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado inválido o faltante.<br />• IP no permitida. |
| **404** | `Not Found`             | El cliente indicado en el campo `customerId` no existe.                                     |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                           |

---

## Cómo usar

El propósito de este endpoint es iniciar el flujo de cash-out con conversión de criptomonedas a BRL (**Cash-out**).

### Flujo de integración

1.  **Identificar al cliente:** Asegúrese de que el usuario exista en XGate (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>) y tenga su `_id`.
2.  **Registrar una clave Pix:** Después de crear el cliente, deberá registrar una clave Pix para él en <a href={useBaseUrl('/docs/fiat/pix/add')} target="_blank">Agregar clave Pix</a>.
3.  **Datos de la moneda:** Deberá obtener los datos de la moneda y la criptomoneda para agregarlos a la solicitud. Puede obtenerlos en <a href={useBaseUrl('/docs/fiat/withdraw/currency')} target="_blank">Monedas FIAT</a> y <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">Criptomonedas</a>.
4.  **Crear la orden:** Llame a este endpoint enviando el monto, customerId, currency, cryptocurrency y los datos de pixKey.
5.  **Esperar el pago:** El estado inicial será `PENDING`.

### Ejemplo práctico

Para crear órdenes de retiro con conversión de criptomonedas a BRL, debe seguir estos 5 pasos:

:::tip[Recomendación]
Debe crear un cliente antes de continuar con la creación del retiro.

Puede **<a href={useBaseUrl('/docs/customer/create')} target="_blank">hacer clic aquí</a>** para ir a la página de documentación de creación de clientes.
:::
>
**Paso 1:** Envíe el valor en USDT en el campo `amount` y el `_id` del cliente como `customerId`, como se resalta en los campos:
```json {2-3}
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
    "externalId": "67ce09d**************",
    "identifiedDocumentPix": true
}
```

**Paso 2:** Debe obtener la moneda fiduciaria con los datos del retiro.

Puede obtener la lista <a href={useBaseUrl('/docs/fiat/withdraw/currency')} target="_blank">haciendo clic aquí</a>.

```json {4-12}
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
    "externalId": "67ce09d**************",
    "identifiedDocumentPix": true
}
```

#### Detalles del objeto

Consulte los detalles de cada información en el objeto `currency` para construir su solicitud.

| Campo         | Tipo     | Requerido | Descripción                                                      |
| :------------ | :------- | :-------: | :--------------------------------------------------------------- |
| `_id`         | `string` |  **Sí**   | Identificador único de la moneda.                                |
| `name`        | `string` |  **Sí**   | Nombre de la moneda.                                             |
| `type`        | `string` |  **Sí**   | Tipo de método de pago o transacción asociado a la moneda.       |
| `createdDate` | `string` |  **No**   | Fecha en que la moneda se creó en el sistema.                    |
| `updatedDate` | `string` |  **No**   | Fecha de la última actualización de la información de la moneda. |
| `__v`         | `number` |  **No**   | Versión del registro de la moneda en la base de datos.           |
| `symbol`      | `string` |  **Sí**   | Símbolo de la moneda.                                            |

**Paso 3:** Debe obtener la criptomoneda para realizar la conversión del retiro.

Puede obtener la lista <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">haciendo clic aquí</a>.

```json {13-21}
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
    "externalId": "67ce09d**************",
    "identifiedDocumentPix": true
}
```

#### Detalles del objeto

Consulte los detalles de cada información en el objeto `cryptocurrency` para construir su solicitud.

| Campo         | Tipo     | Requerido | Descripción                                                            |
| :------------ | :------- | :-------: | :--------------------------------------------------------------------- |
| `_id`         | `string` |  **Sí**   | Identificador único de la criptomoneda.                                |
| `name`        | `string` |  **Sí**   | Nombre de la criptomoneda.                                             |
| `symbol`      | `string` |  **Sí**   | Símbolo de la criptomoneda.                                            |
| `coinGecko`   | `string` |  **No**   | Identificador de la criptomoneda en CoinGecko.                         |
| `updatedDate` | `string` |  **No**   | Fecha de la última actualización de la información de la criptomoneda. |
| `createdDate` | `string` |  **No**   | Fecha en que la criptomoneda se creó en el sistema.                    |
| `__v`         | `number` |  **No**   | Versión del registro de la criptomoneda en la base de datos.           |

**Paso 4:** Debe obtener los datos de la clave Pix e informarlos en el payload para que el retiro pueda procesarse.

Puede obtener la lista de claves Pix registradas <a href={useBaseUrl('/docs/fiat/pix/keys')} target="_blank">haciendo clic aquí</a> o <a href={useBaseUrl('/docs/fiat/pix/add')} target="_blank">agregar una nueva clave Pix</a>.

```json {22-26}
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
    "externalId": "67ce09d**************",
    "identifiedDocumentPix": true
}
```

**Paso 5 (Opcional):** Agregue `externalId` al final del código. Esto evitará que el cliente envíe la solicitud de retiro más de una vez, **evitando duplicados**.
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
    "externalId": "67ce09d**************",
    "identifiedDocumentPix": true
}
```

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
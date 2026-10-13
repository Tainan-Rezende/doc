---
sidebar_label: 'Crear depósito'
sidebar_position: 2
description: 'Este endpoint genera una orden de depósito con conversión automática.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CreatePixConversionDepositTester from '@site/src/components/CreatePixConversionDepositTester';
import AICopyButton from '@site/src/components/AICopyButton';
import CryptoDeprecationNotice from '@site/src/components/CryptoDeprecationNotice';

# Depósito crypto con conversión

<CryptoDeprecationNotice />

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Criar Pedido de Depósito FIAT com Conversão Crypto
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /deposit:
    post:
      summary: Criar Pedido de Depósito com Conversão
      description: Inicia um fluxo de cash-in onde o cliente paga em Fiat (Pix) e recebe o saldo convertido em Crypto. Retorna o código Pix (Copia e Cola).
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
                - cryptocurrency
              properties:
                amount:
                  type: number
                  description: O valor do depósito em moeda fiduciária (ex 100.50).
                customerId:
                  type: string
                  description: ID único do cliente. Não envie este campo se for utilizar o objeto 'customer'.
                customer:
                  type: object
                  description: Dados para criar o cliente junto com a ordem.
                  required:
                    - name
                    - document
                  properties:
                    name:
                      type: string
                    document:
                      type: string
                    phone:
                      type: string
                    email:
                      type: string
                      format: email
                currency:
                  type: object
                  description: Moeda fiduciária de origem (ex BRL).
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
                  description: Criptomoeda de destino para a conversão (ex USDT ou USDC).
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
                externalId:
                  type: string
                  description: Identificador de idempotência para controle interno.
                identifiedDocumentPix:
                  type: boolean
                  description: Quando definido como true, força a validação da titularidade/documento no Pix, independentemente da configuração padrão da conta.
      responses:
        '201':
          description: Sucesso. Retorna a ordem gerada, incluindo o código Pix Copia e Cola no campo data.code.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Pix Gerado com Sucesso
                  data:
                    type: object
                    properties:
                      status:
                        type: string
                        example: WAITING_PAYMENT
                      code:
                        type: string
                        description: Linha digitável (Pix Copia e Cola)
                      id:
                        type: string
                      customerId:
                        type: string
        '401':
          description: Unauthorized. Token inválido, ausente ou IP bloqueado.
        '404':
          description: Not Found. O customerId fornecido não existe.
        '409':
          description: Conflict. Conflito nos dados do customer.
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

Este endpoint genera una orden de depósito con **conversión automática**. El cliente realiza el pago en moneda fiduciaria (Pix/BRL) y el importe se acredita en criptomonedas (por ejemplo, USDT) en su cartera.

Cada orden está asociada necesariamente a un usuario. Esto garantiza que el saldo convertido se entregue correctamente, además de **facilitar la conciliación** y mantener un **historial organizado** de todas las operaciones de cambio.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/deposit
```

---

## Prueba de integración

Utilice el formulario a continuación para simular la creación de una orden y generar el código QR.

<CreatePixConversionDepositTester />

---

## Solicitud

Debe enviar el **encabezado de autenticación** y el **cuerpo** con los datos de la orden.

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Cuerpo (Request Body)

| Campo                   | Tipo      | Obligatorio | Descripción                                                                   |
| :---------------------- | :-------- | :---------: | :---------------------------------------------------------------------------- |
| `amount`                | `number`  |   **Sí**    | El importe del depósito (por ejemplo, `100.50`).                              |
| `customerId`            | `string`  |   **No**    | El ID único (`_id`) del cliente que realizará el depósito.                    |
| `customer`              | `object`  |   **No**    | Datos para crear el cliente junto con la orden de depósito.                   |
| `currency`              | `object`  |   **Sí**    | La moneda de la transacción (por ejemplo, `BRL`).                             |
| `cryptocurrency`        | `object`  |   **Sí**    | Criptomoneda de destino para la conversión (por ejemplo, USDT o USDC).        |
| `externalId`            | `string`  |   **No**    | Idempotencia                                                                  |
| `identifiedDocumentPix` | `boolean` |   **No**    | Cuando es `true`, fuerza la verificación de titularidad del documento en Pix. |

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

Devuelve el objeto de la orden creada, que contiene el `code` (Pix Copia y pega) para que el usuario lo pague.

```json
{
  "message": "Pix Gerado com Sucesso",
  "data": {
    "status": "WAITING_PAYMENT",
    "code": "00020126850014br.gov.bcb.pix2563pi************************************************************************************",
    "id": "696e28a43e09**************",
    "customerId": "68e7b8f0db**************"
  }
}
```

### Errores comunes

| Estado  | Mensaje                 | Posible causa                                                                                                  |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado faltante o inválido.<br />• IP no permitida.                    |
| **404** | `Not Found`             | El cliente indicado en el campo `customerId` no existe.                                                        |
| **409** | `Conflict`              | • El nombre de cliente proporcionado ya está registrado.<br />• El documento proporcionado ya está registrado. |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                                              |

---

## Cómo usar

El propósito de este endpoint es iniciar el flujo de entrada de dinero (**Cash-in**).

El retorno más importante aquí es el campo `code`. Contiene la cadena de "Pix Copia y pega". Debe mostrar este código a su usuario final o generar un código QR visual a partir de él.

### Flujo de integración

1.  **Crear/identificar al cliente:** Asegúrese de que el usuario exista en XGate (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>) y tenga su `_id`.
2.  **Crear la orden:** Llame a este endpoint pasando el importe y el ID del cliente.
3.  **Mostrar el Pix:** Tome el `code` de la respuesta y muéstrelo al usuario.
4.  **Esperar el pago:** El estado inicial será `PENDING`. Tan pronto como el usuario pague, el estado cambiará (a través de webhook o consulta).

### Ejemplo práctico

Para crear órdenes de depósito Pix, debe seguir estos 3 pasos:

**Paso 1:** Aquí tiene las opciones para crear la orden de depósito sin un cliente ya creado por la ruta (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>) o con uno ya creado.

:::tip[Recomendación]
El equipo de XGate recomienda que el cliente se cree mediante la ruta de creación de clientes (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>).

Puede **<a href={useBaseUrl('/docs/customer/create')} target="_blank">hacer clic aquí</a>** para ir a la página de documentación de creación de clientes.
:::
<Tabs>
    <TabItem value="with-client" label="Con cliente">
**1. Pase el `_id` del cliente como `customerId`, igual que en el campo resaltado:**
```json {3}
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
    "externalId": "67ce09d**************",
    "identifiedDocumentPix": true
}
```
    </TabItem>
    <TabItem value="no-client" label="Sin cliente">
    **1. Debe pasar el objeto `customer`, que creará el cliente al mismo tiempo que crea la orden de depósito:**
```json {3-8}
{
    "amount": 2,
    "customer": {
        "name": "Nombre",
        "phone": "92*********",
        "email": "email@example.com",
        "document": "123*********"
    }, 
    "currency": {
        "_id": "6722c8f***************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "202*********************",
        "updatedDate": "202*********************",
        "__v": 0,
        "symbol": "R$"
    },
    "cryptocurrency": {
        "_id": "67ca33*********************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "usdt",
        "updatedDate": "202*********************",
        "createdDate": "202*********************",
        "__v": 0
    },
    "externalId": "67ce09d**************",
    "identifiedDocumentPix": true
}
    ```
    :::warning[Importante]
    Los datos `name` y `document` son **obligatorios**.
    :::
    </TabItem>
</Tabs>

**Paso 2:** Debe obtener la moneda fiduciaria para la que está haciendo el depósito.

Puede obtener la lista de ellas <a href={useBaseUrl('/docs/fiat/deposit/currency')} target="_blank">haciendo clic aquí</a>.

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
    "externalId": "67ce09d**************",
    "identifiedDocumentPix": true
}
```

**Paso 3:** Debe obtener la criptomoneda para realizar la conversión.

Puede obtener la lista de ellas <a href={useBaseUrl('/docs/crypto/deposit/cryptocurrency')} target="_blank">haciendo clic aquí</a>.

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
    "externalId": "67ce09d**************",
    "identifiedDocumentPix": true
}
```

#### Detalles del objeto

Consulte los detalles de cada información en el objeto `currency` para construir su solicitud.

| Campo         | Tipo     | Obligatorio | Descripción                                                      |
| :------------ | :------- | :---------: | :--------------------------------------------------------------- |
| `_id`         | `string` |   **Sí**    | Identificador único de la moneda.                                |
| `name`        | `string` |   **Sí**    | Nombre de la moneda.                                             |
| `type`        | `string` |   **Sí**    | Tipo de método de pago o transacción asociado a la moneda.       |
| `createdDate` | `string` |   **No**    | Fecha en que la moneda se creó en el sistema.                    |
| `updatedDate` | `string` |   **No**    | Fecha de la última actualización de la información de la moneda. |
| `__v`         | `number` |   **No**    | Versión del registro de la moneda en la base de datos.           |
| `symbol`      | `string` |   **Sí**    | Símbolo de la moneda.                                            |

Consulte los detalles de cada información en el objeto `cryptocurrency` para construir su solicitud.

| Campo         | Tipo     | Obligatorio | Descripción                                                            |
| :------------ | :------- | :---------: | :--------------------------------------------------------------------- |
| `_id`         | `string` |   **Sí**    | Identificador único de la criptomoneda.                                |
| `name`        | `string` |   **Sí**    | Nombre de la criptomoneda.                                             |
| `symbol`      | `string` |   **Sí**    | Símbolo de la criptomoneda.                                            |
| `coinGecko`   | `string` |   **No**    | Identificador de la criptomoneda en CoinGecko.                         |
| `updatedDate` | `string` |   **No**    | Fecha de la última actualización de la información de la criptomoneda. |
| `createdDate` | `string` |   **No**    | Fecha en que la criptomoneda se creó en el sistema.                    |
| `__v`         | `number` |   **No**    | Versión del registro de la criptomoneda en la base de datos.           |

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
    const customerId = "*************";
    const amount = 10.90;

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const currencies = await axios.get(`${url_api}/deposit/company/currencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const cryptocurrencies = await axios.get(`${url_api}/deposit/company/cryptocurrencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/deposit`, {
            amount,
            customerId,
            currency: currencies.data[0],
            cryptocurrency: cryptocurrencies.data[0]
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
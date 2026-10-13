---
sidebar_label: 'Crear depósito'
sidebar_position: 2
description: 'Este endpoint crea una orden de depósito (intención de pago) para un cliente específico.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CreatePixDepositTester from '@site/src/components/CreatePixDepositTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Crear orden de depósito

<div className="ai-btn-wrapper">
<AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Criar Pedido de Depósito
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /deposit:
    post:
      summary: Criar Pedido de Depósito (Pix)
      description: Inicia um fluxo de cash-in criando um pedido de depósito. Retorna o código Pix (Copia e Cola) necessário para o pagamento do usuário final.
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
                  description: O valor do depósito (ex 100.50).
                customerId:
                  type: string
                  description: ID único do cliente. Não envie este campo se for utilizar o objeto 'customer'.
                customer:
                  type: object
                  description: Dados para criar o cliente junto com a ordem. Não envie este campo se utilizar o 'customerId'.
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
                  description: Objeto com a moeda fiduciária para o depósito (obtido na rota de moedas de depósito).
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
                externalId:
                  type: string
                  description: Identificador de idempotência para controle interno do integrador.
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
                      externalId:
                        type: string
                        description: Retornado quando enviado na requisição.
                  warnings:
                    type: array
                    description: Avisos não bloqueantes. Ex. CRYPTOCURRENCY_FIELD_IGNORED quando o campo cryptocurrency é enviado (ignorado a partir de 29/10/2026).
                    items:
                      type: object
                      properties:
                        code:
                          type: string
                        message:
                          type: string
        '401':
          description: Unauthorized. Token inválido, ausente ou IP bloqueado.
        '404':
          description: Not Found. O customerId fornecido não existe na base.
        '422':
          description: Política de pagador da empresa violada. Corpo { reason, message } com reason PAYER_TYPE_NOT_ALLOWED, DEPOSIT_TITULARITY_CUSTOMER_DOCUMENT_REQUIRED, PAYER_DOCUMENT_MISSING, PIX_POLICY_REQUIRES_PIX_V2 ou PIX_POLICY_PROVIDER_WITHOUT_PAYER.
        '503':
          description: PIX_POLICY_NOT_CONFIGURED. A política de Pix da empresa não está configurada.
        '409':
          description: Conflict. Conflito nos dados do customer (nome ou documento já cadastrado).
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

Este endpoint crea una orden de depósito (intención de pago) para un cliente específico. Cuando se crea la orden, el sistema devuelve los datos necesarios para que el usuario final complete el pago a través de Pix.

Cada orden debe estar asociada a un cliente. Esto garantiza que los fondos se acrediten al cliente correcto en su plataforma, **habilita la conciliación automática** y mantiene un **historial limpio** de todas las transacciones.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/deposit
```

---

## Prueba de integración

Utilice el formulario a continuación para simular la creación de una orden y generar el código QR.

<CreatePixDepositTester />

---

## Solicitud

Debe proporcionar el **encabezado** de autenticación y el **cuerpo** de la solicitud con los datos de la orden.

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Cuerpo (request body)

| Campo                   | Tipo      | Obligatorio | Descripción                                                                   |
| :---------------------- | :-------- | :---------: | :---------------------------------------------------------------------------- |
| `amount`                | `number`  |   **Sí**    | El monto del depósito (por ejemplo: `100.50`).                                |
| `customerId`            | `string`  |   **No**    | El `_id` único del cliente que realizará el depósito.                         |
| `customer`              | `object`  |   **No**    | Datos del cliente para crear el cliente junto con la orden de depósito.       |
| `currency`              | `string`  |   **Sí**    | La moneda de la transacción (por ejemplo: `BRL`).                             |
| `externalId`            | `string`  |   **No**    | Identificador de idempotencia.                                                |
| `identifiedDocumentPix` | `boolean` |   **No**    | Cuando es `true`, fuerza la verificación de titularidad del documento en Pix. |

:::warning[Campo `cryptocurrency` ignorado a partir del 29/10/2026]
El depósito con conversión a cripto se descontinúa el 29/10/2026. A partir de esa fecha, envíe solo `currency`: si se envía el campo `cryptocurrency`, este se **ignora**, el depósito se crea en BRL y la respuesta incluye el aviso `CRYPTOCURRENCY_FIELD_IGNORED` en `warnings`. Para obtener cripto, utilice la <a href={useBaseUrl('/docs/buy-sell/overview')}>Compra de Cripto</a> con el saldo en BRL.
:::

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

Devuelve el objeto de la orden creada, incluyendo el `code` (Pix Copia e Cola) para que el usuario realice el pago.

```json
{
  "message": "Pix Gerado com Sucesso",
  "data": {
    "status": "WAITING_PAYMENT",
    "code": "00020126850014br.gov.bcb.pix2563pi************************************************************************************",
    "id": "696e28a43e09**************",
    "customerId": "68e7b8f0db**************",
    "externalId": "pedido-7781"
  }
}
```

El campo `externalId` se devuelve cuando fue enviado en la solicitud.

#### Avisos (`warnings`)

La respuesta puede incluir avisos que **no impiden** la creación del depósito. Por ejemplo, cuando se envía el campo `cryptocurrency` a partir del 29/10/2026:

```json
{
  "message": "Pix Gerado com Sucesso",
  "data": {
    "status": "WAITING_PAYMENT",
    "code": "00020126850014br.gov.bcb.pix2563pi************",
    "id": "696e28a43e09**************",
    "customerId": "68e7b8f0db**************",
    "externalId": "pedido-7781"
  },
  "warnings": [
    {
      "code": "CRYPTOCURRENCY_FIELD_IGNORED",
      "message": "O campo cryptocurrency não é mais suportado; o depósito foi criado em BRL. Use purchase{} para comprar cripto."
    }
  ]
}
```

### Errores comunes

| Estado  | Mensaje                 | Causa probable                                                                                                  |
| :------ | :---------------------- | :-------------------------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado inválido o faltante.<br />• IP no permitido.                     |
| **404** | `Not Found`             | El `customerId` proporcionado no existe.                                                                        |
| **409** | `Conflict`              | • El nombre del cliente proporcionado ya está registrado.<br />• El documento proporcionado ya está registrado. |
| **422** | `{ reason, message }`   | Violación de la política de pagador de la empresa. Vea la tabla a continuación.                                 |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                                               |
| **503** | `PIX_POLICY_NOT_CONFIGURED` | La política de Pix de la empresa no está configurada. Contacte con soporte.                                 |

#### Política de pagador

Cada empresa puede tener reglas para los depósitos por API: tipo de pagador (persona física/jurídica, PF/PJ), titularidad (documento del customer o CNPJ de la empresa) y límites. Cuando se viola la regla al crear el depósito, la API responde `422` con el cuerpo `{ "reason", "message" }`:

| Reason                                          | Motivo                                                                                   |
| :---------------------------------------------- | :--------------------------------------------------------------------------------------- |
| `PAYER_TYPE_NOT_ALLOWED`                        | El tipo de pagador (PF/PJ) no está permitido por la política de la empresa.              |
| `DEPOSIT_TITULARITY_CUSTOMER_DOCUMENT_REQUIRED` | La política exige titularidad y el customer no tiene documento.                          |
| `PAYER_DOCUMENT_MISSING`                        | El documento del pagador es necesario y no fue informado.                                |
| `PIX_POLICY_REQUIRES_PIX_V2`                    | La política configurada exige Pix v2, que no está disponible para esta cuenta.           |
| `PIX_POLICY_PROVIDER_WITHOUT_PAYER`             | El proveedor de Pix no informa el pagador, lo cual es exigido por la política.           |

#### Estado `PAYER_REJECTED`

Cuando un Pix pagado viola una regla de pagador que no pudo bloquearse al crear el cobro (por ejemplo: tipo PF/PJ sin documento del pagador), el depósito queda con estado `PAYER_REJECTED` y **el monto se devuelve al pagador**. La consulta del depósito incluye el objeto `payerRuleViolation`:

```json
{
  "status": "PAYER_REJECTED",
  "payerRuleViolation": {
    "reason": "PAYER_TYPE_NOT_ALLOWED",
    "at": "2026-10-13T14:00:00.000Z",
    "refundedAt": "2026-10-13T14:00:05.000Z",
    "payer": { "name": "Fulano de Tal", "document": "***.456.789-**", "bank": "Banco Ejemplo" }
  }
}
```

---

## Cómo usar

Este endpoint inicia el flujo de cash-in.

El valor de retorno más importante es el campo `code`. Contiene la cadena "Pix Copia e Cola". Muestre este código a su usuario final o genere un código QR visual a partir de él.

### Flujo de integración

1.  **Crear/identificar al cliente:** Asegúrese de que el usuario exista en XGate (POST /customer) y obtenga su `_id`.
2.  **Crear la orden:** Llame a este endpoint con el monto y el ID del cliente (o el objeto del cliente).
3.  **Mostrar el Pix:** Tome el `code` de la respuesta y preséntelo al usuario.
4.  **Esperar el pago:** El estado inicial será `WAITING_PAYMENT`. Una vez que el usuario pague, el estado se actualizará (mediante webhook o polling).

### Ejemplo práctico

Para crear órdenes de depósito Pix, siga estos dos pasos:

**Paso 1:** Puede crear la orden de depósito con un cliente existente (POST /customer) o crear el cliente al mismo tiempo.

:::tip[Recomendación]
El equipo de XGate recomienda crear el cliente utilizando el endpoint de creación de clientes (POST /customer).

Puede **<a href={useBaseUrl('/docs/customer/create')} target="_blank">hacer clic aquí</a>** para abrir la documentación de creación de clientes.
:::
<Tabs>
    <TabItem value="with-client" label="Con cliente">
**1.1. Pasa el `_id` del cliente como `customerId`, como se muestra en el campo resaltado:**
```json {3}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6722ba**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "202*********************",
        "updatedDate": "202*********************",
        "__v": 0,
        "symbol": "R$"
    },
    "identifiedDocumentPix": true
}
```
    </TabItem>
    <TabItem value="no-client" label="Sin cliente">
    **1.1. Debe pasar el objeto `customer` para crear el cliente junto con la orden de depósito:**
```json {3-8}
{
    "amount": 0.2,
    "customer": {
        "name": "Client Name",
        "document": "12345678900",
        "phone": "+55123456789",
        "email": "client@domain.com"
    },
    "currency": {
        "_id": "6722ba**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "202*********************",
        "updatedDate": "202*********************",
        "__v": 0,
        "symbol": "R$"
    },
    "identifiedDocumentPix": true
}
    ```
    :::warning[Importante]
    Los campos `name` y `document` son **obligatorios**.
    :::
    </TabItem>
</Tabs>

**Paso 2:** Obtenga la moneda fiduciaria para el depósito.

Puede obtener la lista <a href={useBaseUrl('/docs/fiat/deposit/currency')} target="_blank">haciendo clic aquí</a>.

```json {4-12}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6722ba**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "202*********************",
        "updatedDate": "202*********************",
        "__v": 0,
        "symbol": "R$"
    },
    "identifiedDocumentPix": true
}
```

#### Detalles del objeto

Consulte los detalles de cada campo del objeto `currency` para construir su solicitud.

| Campo         | Tipo     | Obligatorio | Descripción                                                      |
| :------------ | :------- | :---------: | :--------------------------------------------------------------- |
| `_id`         | `string` |   **Sí**    | Identificador único de la moneda.                                |
| `name`        | `string` |   **Sí**    | Nombre de la moneda.                                             |
| `type`        | `string` |   **Sí**    | Método de pago o tipo de transacción asociado a la moneda.       |
| `createdDate` | `string` |   **No**    | Fecha en que la moneda se creó en el sistema.                    |
| `updatedDate` | `string` |   **No**    | Fecha de la última actualización de la información de la moneda. |
| `__v`         | `number` |   **No**    | Versión del registro en la base de datos de la moneda.           |
| `symbol`      | `string` |   **Sí**    | Símbolo de la moneda.                                            |

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
        const { data } = await axios.post(`${url_api}/deposit`, {
            amount,
            customerId,
            currency: currencies.data[0],
            identifiedDocumentPix: true
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
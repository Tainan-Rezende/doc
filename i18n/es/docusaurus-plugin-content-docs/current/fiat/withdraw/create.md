---
sidebar_label: 'Crear retiro'
sidebar_position: 2
description: 'Este endpoint crea una orden de retiro para un cliente específico.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CreatePixWithdrawTester from '@site/src/components/CreatePixWithdrawTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Crear orden de retiro

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Criar Pedido de Saque
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /withdraw:
    post:
      summary: Solicitar Saque (Cash-out)
      description: Cria uma ordem de saque para debitar fundos e transferir para a chave Pix de destino do cliente. Exige o saldo disponível na conta da empresa.
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
                - pixKey
              properties:
                amount:
                  type: number
                  description: O valor do saque (ex 100.50).
                customerId:
                  type: string
                  description: O ID único (_id) do cliente que receberá os fundos.
                externalId:
                  type: string
                  description: Identificador de idempotência para controle interno (opcional, mas recomendado).
                identifiedDocumentPix:
                  type: boolean
                  description: Quando definido como true, força a validação da titularidade/documento no Pix, independentemente da configuração padrão da conta.
                currency:
                  type: object
                  description: Objeto com os dados da moeda fiduciária (obtido via GET /withdraw/company/currencies).
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
                pixKey:
                  type: object
                  description: O objeto completo da chave Pix do cliente (obtido via GET /pix/customer/{id}/key).
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

Este endpoint crea una orden de retiro para un cliente específico. Cuando se crea una orden, el sistema procesa la transferencia de fondos a la clave Pix de destino proporcionada.

Cada orden debe estar asociada a un usuario. Esto garantiza que el importe se debite del saldo correcto en su plataforma, al tiempo que proporciona **seguridad transaccional** y mantiene un **historial organizado** de todos los retiros.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/withdraw
```

---

## Prueba de integración

Utilice el formulario a continuación para simular la creación de una orden de retiro.

<CreatePixWithdrawTester />

---

## Solicitud

Debe enviar el **encabezado de autenticación** y el **cuerpo** de la solicitud con los datos de la orden.

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Cuerpo (Request Body)

| Campo                   | Tipo      | Obligatorio | Descripción                                                                   |
| :---------------------- | :-------- | :---------: | :---------------------------------------------------------------------------- |
| `amount`                | `number`  |   **Sí**    | El importe del retiro (por ejemplo, `100.50`).                                |
| `customerId`            | `string`  |   **No**    | El ID único del cliente (`_id`) asociado a la orden.                          |
| `currency`              | `string`  |   **Sí**    | La moneda de la transacción (por ejemplo, `BRL`).                             |
| `externalId`            | `string`  |   **No**    | Clave de idempotencia                                                         |
| `identifiedDocumentPix` | `boolean` |   **No**    | Cuando es `true`, fuerza la verificación de titularidad del documento en Pix. |

:::info[Sobre la validación de titularidad]
El envío del parámetro `identifiedDocumentPix` con el valor `false` (o su ausencia) **no desactiva** la verificación de titularidad si está configurada como **obligatoria** en el panel administrativo de XGate para tu cuenta. 

Este parámetro sirve estrictamente para **forzar** la validación (enviando `true`) en cuentas donde la regla predeterminada del panel está desactivada. Para desactivar la verificación de titularidad de manera definitiva, es necesario un acuerdo comercial vía contrato.
:::

:::tip[Buenas Prácticas: Prevención de Duplicidad]
Recomendamos encarecidamente enviar el campo `externalId`. Actúa como una clave de idempotencia, garantizando que el mismo pedido de retiro no se cree por duplicado en caso de fallas en la red, doble clic o reintentos accidentales por parte de tu sistema.
:::

---

## Respuestas

### Éxito (201 Created)

Devuelve el objeto de la orden creada, que contiene el `_id` de la transacción y el `status` de la orden.

```json
{
    "message": "Solicitação de Saque realizada com sucesso",
    "status": "PENDING",
    "_id": "696ee03f66d708604799f67f"
}
```

### Errores comunes

| Estado  | Mensaje                 | Posible causa                                                                                                  |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado de autorización faltante o mal formado.<br />• IP no permitida. |
| **404** | `Not Found`             | El `customerId` proporcionado no existe.                                                                       |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                                              |

---

## Uso

Este endpoint está destinado a retiros (cash-outs), transfiriendo fondos desde su cuenta a la clave Pix de destino del cliente.

A diferencia de los depósitos, esta acción es pasiva para el usuario: solo espera recibir los fondos en su cuenta bancaria.

### Flujo de integración

1. **Preparar los datos:** Antes de llamar a este endpoint, ya debería haber recuperado el objeto completo de la clave Pix del cliente y el objeto de moneda (como se explicó en pasos anteriores).
2. **Solicitar el retiro:** Llame a este endpoint con el importe, el ID del cliente y los objetos `currency` y `pixKey`.
3. **Confirmación:** La API devolverá el estado de la transacción (por ejemplo, `PENDING` o `PAID`).
4. **Finalización:** El sistema procesa la transferencia bancaria. Actualice el saldo del cliente en su plataforma una vez que el estado confirme el éxito.

:::info[Validación de saldo]
Asegúrese de que la cuenta XGate tenga saldo disponible suficiente para cubrir el importe del retiro; de lo contrario, la solicitud puede devolver un error de fondos insuficientes.
:::

### Ejemplo práctico

Para crear órdenes de retiro Pix, necesita tres datos:

**1. Datos:** Debe tener el **ID del cliente**, que se devuelve al crear un cliente (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>).

```json {3}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-1**************",
        "updatedDate": "2024-1**************",
        "__v": 0,
        "symbol": "R$"
    },
    "pixKey": {
        "key": "+5512************",
        "type": "PHONE",
        "_id": "68fa5d54004*************"
    },
    "identifiedDocumentPix": true
}
```

**2. Datos:** Obtenga la moneda fiduciaria para el retiro.

Puede obtener la lista de monedas <a href={useBaseUrl('/docs/fiat/withdraw/currency')} target="_blank">aquí</a>.

```json {4-12}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-1**************",
        "updatedDate": "2024-1**************",
        "__v": 0,
        "symbol": "R$"
    },
    "pixKey": {
        "key": "+5512************",
        "type": "PHONE",
        "_id": "68fa5d54004*************"
    },
    "identifiedDocumentPix": true
}
```

#### Detalles del objeto

Consulte los detalles de cada propiedad en el objeto `currency` para construir su solicitud.

| Campo         | Tipo     | Obligatorio | Descripción                                                      |
| :------------ | :------- | :---------: | :--------------------------------------------------------------- |
| `_id`         | `string` |   **Sí**    | Identificador único de la moneda.                                |
| `name`        | `string` |   **Sí**    | Nombre de la moneda.                                             |
| `type`        | `string` |   **Sí**    | Tipo de método de pago o transacción asociado a la moneda.       |
| `createdDate` | `string` |   **No**    | Fecha en que la moneda se agregó al sistema.                     |
| `updatedDate` | `string` |   **No**    | Fecha de la última actualización de la información de la moneda. |
| `__v`         | `number` |   **No**    | Versión del registro de la moneda en la base de datos.           |
| `symbol`      | `number` |   **Sí**    | Símbolo de la moneda.                                            |

**3. Datos:** Obtenga la lista de claves Pix del cliente y seleccione una para incluir en la solicitud.

Puede obtener la lista de claves <a href={useBaseUrl('/docs/pix/keys')} target="_blank">aquí</a>.

```json {13-17}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-1**************",
        "updatedDate": "2024-1**************",
        "__v": 0,
        "symbol": "R$"
    },
    "pixKey": {
        "key": "+5512************",
        "type": "PHONE",
        "_id": "68fa5d54004*************"
    },
    "identifiedDocumentPix": true
}
```

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
    const key = "***********";
    const type = "CPF"

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const currencies = await axios.get(`${url_api}/withdraw/company/currencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const pixKeys = await axios.get(`${url_api}/pix/customer/${customerId}/key`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/withdraw`, {
            amount,
            customerId,
            currency: currencies.data[0],
            pixKey: pixKeys.data[0],
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
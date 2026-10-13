---
sidebar_label: 'Consulta de cliente'
sidebar_position: 1
description: 'Este endpoint consulta el registro de cliente en la base de datos de XGate.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ConsultCustomerTester from '@site/src/components/ConsultCustomerTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Consulta de cliente

<div className="ai-btn-wrapper">
<AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Consultar Cliente
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /customer/{id}:
    get:
      summary: Consultar Cliente
      description: Retorna os dados cadastrais completos de um cliente específico através do seu ID.
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
          description: ID único do cliente gerado pela XGate.
      responses:
        '200':
          description: Dados do cliente encontrados com sucesso.
          content:
            application/json:
              schema:
                type: object
                properties:
                  _id:
                    type: string
                  name:
                    type: string
                  email:
                    type: string
                  document:
                    type: string
                  version:
                    type: integer
                  createdDate:
                    type: string
                    format: date-time
                  updatedDate:
                    type: string
                    format: date-time
        '401':
          description: Unauthorized. Token inválido, não informado ou IP bloqueado.
        '404':
          description: Not Found. O ID informado não é válido ou o cliente não existe.
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

Este endpoint consulta el registro de cliente en la base de datos de XGate.

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>
```bash title="URL del endpoint"
https://api.xgateglobal.com/customer/CUSTOMER_ID
```

:::warning[Importante]
El valor **CUSTOMER_ID** hace referencia al `_id` devuelto al crear un cliente.
:::

:::tip[Consejo de integración: recuperar un ID]
La API de XGate utiliza el campo `name` como clave de validación para los clientes. Si pierde el `_id` de un usuario, envíe una solicitud de **Crear cliente** con el mismo nombre. El servidor detectará el nombre existente y devolverá un error amigable que incluirá el `_id` del registro existente, lo que le permitirá actualizar su base de datos interna.
:::

---

## Prueba de integración

Simule la creación de un cliente ahora. El resultado mostrará el `_id` generado.

<ConsultCustomerTester />

---

## Solicitud

### Encabezados obligatorios

| Encabezado      | Valor                | Descripción                |
| :-------------- | :------------------- | :------------------------- |
| `Authorization` | `Bearer <tu_token>` | Token de autenticación JWT. |

---

## Respuestas

### Éxito (200 OK)

Se encontraron los datos del cliente.

```json
{
  "_id": "697e15******************",
  "name": "Client Name",
  "email": "email@domain.com",
  "document": "123********",
  "version": 1,
  "createdDate": "202****************",
  "updatedDate": "202****************"
}
```

### Errores comunes

| Estado  | Mensaje                 | Posible motivo                                                                                                                                          |
| :------ | :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado faltante o inválido.<br /> • IP no permitido.<br />• No tiene autorización para realizar esta acción. |
| **404** | `Not Found`             | • El ID proporcionado no es válido.<br />El cliente no existe.                                                                                      |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                                                                                     |

---

## Cómo usar

La ruta de consulta del cliente es un endpoint de solo lectura. Utilícela para recuperar y verificar los datos actuales de un usuario ya registrado en su base de datos de XGate.

### Casos de uso comunes

A diferencia de las rutas de pago, no hay un flujo complejo aquí. Utilice este endpoint principalmente para:

1. **Auditoría y verificación:** Confirmar que el `document` (CPF/CNPJ) o el `email` vinculados al cliente sean correctos.
2. **Validación previa a la actualización:** Obtener los datos actuales de registro del usuario para completar previamente una pantalla de "Editar perfil" en su frontend.
3. **Sincronización de base de datos:** Asegurarse de que su base de datos interna permanezca actualizada y sincronizada con XGate.

### Ejemplo práctico
El propósito principal es ver datos de forma rápida y segura. Al solicitar el cliente usando su `_id`, recibirá el objeto completo del cliente.

**1. Lo que recibe al consultar el cliente:**

Observe en el ejemplo siguiente cómo la ruta devuelve la información vital, lo que le permite verificar el `document` (línea resaltada):
```json {5}
{
  "_id": "697e15******************",
  "name": "Client Name",
  "email": "email@domain.com",
  "document": "123********",
  "version": 1,
  "createdDate": "202****************",
  "updatedDate": "202****************"
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
  const customerId = "***********";

  try {
    const url_api = "https://api.xgateglobal.com"
    const login = await axios.post(`${url_api}/auth/token`, { email, password });
    const { data } = await axios.get(`${url_api}/customer/${customerId}`, {
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
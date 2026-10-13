---
sidebar_label: 'Actualizar'
sidebar_position: 3
description: 'Este endpoint permite actualizar el registro de cliente en la base de datos de XGate.'
sidebar_class_name: 'sidebar-method-put'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import UpdateCustomerTester from '@site/src/components/UpdateCustomerTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Actualizar cliente

<div className="ai-btn-wrapper">
<AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Atualizar Cliente
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /customer/{id}:
    put:
      summary: Atualizar Cliente
      description: Atualiza o registro de um cliente existente na base de dados da XGate.
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
          description: ID único do cliente (_id) retornado na criação.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - document
              properties:
                name:
                  type: string
                  description: Nome completo do cliente atualizado.
                document:
                  type: string
                  description: CPF ou CNPJ atualizado (apenas números).
                email:
                  type: string
                  format: email
                  description: E-mail do cliente para notificações (opcional).
                phone:
                  type: string
                  description: Telefone do cliente (opcional).
      responses:
        '200':
          description: OK. Cliente alterado com sucesso.
        '400':
          description: Bad Request. O nome e/ou documento do cliente é obrigatório.
        '401':
          description: Unauthorized. Token inválido, expirado ou não informado.
        '409':
          description: Conflict. O nome ou documento informado já está cadastrado para outro cliente.
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

Este endpoint permite actualizar el registro de cliente en la base de datos de XGate.

---

## Endpoint
- **Método:** <span className="badge badge--warning">PUT</span>
```bash title="URL del endpoint"
https://api.xgateglobal.com/customer/CUSTOMER_ID
```

:::warning[Importante]
El valor **CUSTOMER_ID** hace referencia al `_id` devuelto al crear un cliente.
:::

---

## Prueba de integración

Simule la actualización de un cliente ahora.

<UpdateCustomerTester />

---

## Solicitud

### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                 |
| :-------------- | :------------------ | :-------------------------- |
| `Authorization` | `Bearer <tu_token>` | Token de autenticación JWT. |

### Cuerpo de la solicitud

| Campo      | Tipo     | Obligatorio | Descripción                                         |
| :--------- | :------- | :---------- | :-------------------------------------------------- |
| `name`     | `string` | Sí          | Nombre completo del cliente.                        |
| `document` | `string` | Sí          | CPF o CNPJ.                                         |
| `email`    | `string` | No          | Correo electrónico del cliente para notificaciones. |
| `phone`    | `string` | No          | Número de teléfono del cliente.                     |

---

## Respuestas

### Éxito (200 OK)

Los datos del cliente se actualizaron correctamente.

```json
{
    "message":"Cliente alterado com sucesso"
}
```

### Errores comunes

| Estado  | Mensaje                 | Posible motivo                                                                                                                                       |
| :------ | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `Bad Request`           | Se requiere el nombre y/o documento del cliente.                                                                                                     |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado faltante o inválido.<br /> • IP no permitido.<br />• No tiene autorización para realizar esta acción. |
| **409** | `Conflict`              | • El nombre proporcionado ya está registrado.<br />• El documento proporcionado ya está registrado.                                                  |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                                                                                    |

---

## Cómo usar

La ruta de actualización del cliente es un endpoint de modificación de datos. Permite cambiar la información de registro de un usuario que ya existe en su base de datos de XGate.

### Casos de uso comunes

Utilice este endpoint principalmente en escenarios de mantenimiento de cuentas de usuario:

1. **Corrección de datos:** Corregir errores tipográficos en `name` o corregir el `document` (CPF/CNPJ) si el usuario lo proporcionó incorrectamente durante el registro.
2. **Actualización de contacto:** Modificar el `email` o el `phone` del cliente únicamente con fines de notificación y comunicación, manteniendo actualizados los datos de contacto administrativos.
3. **Sincronización de perfil:** Asegurarse de que, cuando el cliente actualice los datos de perfil en su aplicación o sitio, el cambio se refleje automáticamente en el ecosistema de XGate.

### Ejemplo práctico

El propósito principal de esta ruta es aplicar cambios y confirmar el éxito de la operación sin devolver grandes volúmenes de datos. Al solicitar la actualización con el `_id` del cliente en la URL y enviar la nueva información en el cuerpo, la API procesará el cambio y devolverá una simple confirmación.

**1. Lo que recibe cuando se actualiza el cliente correctamente:**
```json
{
    "message":"Cliente alterado com sucesso"
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
    const customer = {
        name: "Name client",
        phone: "119*******",
        email: "your_email@domain.com",
        document: "000000*******"
    }

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.put(`${url_api}/customer/${customerId}`, customer, {
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
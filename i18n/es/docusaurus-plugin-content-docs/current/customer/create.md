---
sidebar_label: 'Crear cliente'
sidebar_position: 2
description: 'Este endpoint crea un nuevo registro de cliente en la base de datos de XGate.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CreateCustomerTester from '@site/src/components/CreateCustomerTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Crear cliente

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
      info:
        title: API XGate - Criar Cliente
        version: 1.0.0
      servers:
        - url: https://api.xgateglobal.com
        description: Servidor de Produção XGate
      paths:
        /customer:
          post:
            summary: Criar Cliente
            description: Cria um novo registro de cliente na base da XGate e retorna o ID único (_id) necessário para futuras operações.
            security:
              - bearerAuth: []
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
                        description: Nome completo do cliente.
                      document:
                        type: string
                        description: CPF ou CNPJ.
                      email:
                        type: string
                        format: email
                        description: E-mail do cliente para notificações (opcional).
                      phone:
                        type: string
                        description: Telefone do cliente (opcional).
            responses:
              '201':
                description: Novo cliente criado com sucesso. Retorna o objeto do cliente com o \`_id\`.
              '200':
                description: Cliente já cadastrado. Retorna o \`_id\` do cliente existente.
              '400':
                description: Bad Request. Nome e/ou documento são obrigatórios.
              '401':
                description: Unauthorized. Token inválido, não informado ou IP bloqueado.
              '409':
                description: Conflict. Conflito de dados de cadastro.
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

Este endpoint crea un nuevo registro de cliente en la base de datos de XGate.

Crear un cliente es el primer paso de la integración, ya que devuelve el **ID del cliente** (`_id`), que es necesario para:
1.  Registrar claves Pix.
2.  Generar códigos QR de cobranza.
3.  Realizar retiros.

💡 **Nota:** Al crear un cliente, el sistema genera automáticamente y en paralelo todas las direcciones de billeteras de criptomonedas individualizadas para él.

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>
```bash title="URL del endpoint"
https://api.xgateglobal.com/customer
```

---

## Prueba de integración

Simule la creación de un cliente ahora. El resultado mostrará el `_id` generado.

<CreateCustomerTester />

---

## Solicitud

### Encabezados obligatorios

| Encabezado      | Valor                | Descripción                 |
| :-------------- | :------------------- | :-------------------------- |
| `Authorization` | `Bearer <tu_token>` | Token de autenticación JWT. |

### Cuerpo de la solicitud

| Campo      | Tipo     | Obligatorio | Descripción                                 |
| :--------- | :------- | :---------- | :------------------------------------------ |
| `name`     | `string` | Sí          | Nombre completo del cliente.                |
| `document` | `string` | Sí          | CPF o CNPJ.                                 |
| `email`    | `string` | No          | Correo electrónico del cliente para notificaciones. |
| `phone`    | `string` | No          | Número de teléfono del cliente.             |

---

## Respuestas

### Éxito (201 Created)

El cliente se creó correctamente y ya está disponible para su uso.

```json
{
  "message": "Nuevo cliente creado con éxito",
  "customer": {
    "_id": "696d1f3331117************",
    "name": "Name Client",
    "email": "email@domain",
    "document": "123***********"
  }
}
```

### Cliente ya registrado (200 OK)

Ya existe un cliente con el mismo nombre y/o documento. Cuando el servidor devuelve esta respuesta, incluye el `_id` del cliente existente.

```json
{
    "message": "El cliente ya está registrado en la base de datos",
    "customer": {
        "_id": "68e7b8f0dbed************"
    }
}
```

### Errores comunes

| Estado  | Mensaje                | Posible motivo                                                                                                                                      |
| :------ | :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `Bad Request`          | Se requiere el nombre y/o documento del cliente.                                                                                                 |
| **401** | `Unauthorized`         | • Token inválido o vencido.<br /> • Encabezado faltante o inválido.<br /> • IP no permitido.<br />• No tiene autorización para realizar esta acción. |
| **409** | `Conflict`             | • El nombre proporcionado ya está registrado.<br />• El documento proporcionado ya está registrado.                                             |
| **500** | `Internal Server Error`| Error interno del servidor. Contacte con soporte.                                                                                                 |

---

## Cómo usar

El **ID del cliente** (`_id`) es el identificador único que vincula al usuario con todas las operaciones financieras y de gestión dentro de la plataforma.

Necesitará este ID para:
1. **Transacciones:** Identificar origen/destino en depósitos y retiros.
2. **Claves Pix:** Crear, listar o eliminar claves vinculadas al cliente.
3. **Gestión:** Actualizar los datos de registro del cliente.

### Flujo de integración

1. **Generar token:** Obtenga un token en la <a href={useBaseUrl('/docs/authentication/login')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>ruta de autenticación</a> (POST /auth/token) para quedar autorizado a crear clientes.
2. **Crear el cliente:** Envíe la carga útil de la solicitud a la ruta (POST /customer) proporcionando los campos `name` y `document`.

### Ejemplo práctico

Para acreditar fondos (depósito), incluya el ID del cliente en el campo `customerId` de la carga útil.

**1. Lo que recibe al crear el cliente:**
```json {4}
{
  "message": "Nuevo cliente creado con éxito",
  "customer": {
    "_id": "696d1f3331117************",
    "name": "Name Client",
    "email": "email@domain",
    "document": "123***********"
  }
}
```
**2. Cómo usar la ruta de depósito (POST /deposit):**
```json {3}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-11-04T16:04:50.019Z",
        "updatedDate": "2024-11-07T02:23:38.606Z",
        "__v": 0,
        "symbol": "R$"
    }
}
```
El ID del cliente se pasa como `customerId` para crear una solicitud de depósito.

:::warning[Consejo de integración]
Guarde siempre el `_id` del cliente inmediatamente después de la creación. Lo utilizará en **100%** de las llamadas futuras relacionadas con este usuario.
:::

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
  const customer = {
    name: "Name client",
    phone: "119*******",
    email: "your_email@domain.com",
    document: "000000*******"
  }

  try {
    const url_api = "https://api.xgateglobal.com"
    const login = await axios.post(`${url_api}/auth/token`, { email, password });
    const { data } = await axios.post(`${url_api}/customer`, customer, {
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
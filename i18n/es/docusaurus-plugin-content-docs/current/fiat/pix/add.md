---
sidebar_label: 'Agregar clave Pix'
sidebar_position: 2
description: 'Este endpoint permite registrar una nueva clave Pix (correo electrónico, CPF, CNPJ, teléfono o aleatoria) para su cliente final.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import AddPixKeyTester from '@site/src/components/AddPixKeyTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Agregar clave Pix

<div className="ai-btn-wrapper">
<AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Adicionar Chave Pix
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /pix/customer/{clientId}/key:
    post:
      summary: Adicionar Chave Pix ao Cliente
      description: Cadastra uma nova chave Pix vinculada a um cliente específico para possibilitar a realização de saques.
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: clientId
          required: true
          schema:
            type: string
          description: O ID único (_id) do cliente.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - key
                - type
              properties:
                key:
                  type: string
                  description: O valor da chave Pix (ex: email, CPF, telefone).
                type:
                  type: string
                  enum: [EMAIL, CPF, CNPJ, PHONE, RANDOM]
                  description: O tipo da chave informada.
      responses:
        '201':
          description: Chave Pix adicionada com sucesso. Retorna o objeto completo da chave com o \`_id\`.
        '400':
          description: Bad Request. A chave informada não é válida.
        '401':
          description: Unauthorized. Token JWT inválido ou ausente.
        '404':
          description: Not Found. Cliente não encontrado ou chave já registrada.
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

Este endpoint permite registrar una nueva clave Pix (correo electrónico, CPF, CNPJ, teléfono o aleatoria) para su cliente final.

---
## Endpoint
 - **Método:** <span className="badge badge--info">POST</span>
```bash title="URL del endpoint"
https://api.xgateglobal.com/pix/customer/CLIENT_ID/key
```

:::warning[Importante]
El campo `CLIENT_ID` hace referencia al ID del cliente; si aún no lo ha creado, puede hacerlo desde la página de <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>crear clientes</a>.
:::

---

## Prueba de integración

Utilice el formulario a continuación para simular el registro de una clave Pix real.

<AddPixKeyTester />

---

## Solicitud

### Encabezados obligatorios

| Encabezado      | Valor                | Descripción                |
| :-------------- | :------------------- | :------------------------- |
| `Authorization` | `Bearer <tu_token>` | Token de autenticación JWT. |

### Parámetros de URL

| Parámetro  | Tipo     | Obligatorio | Descripción                                                           |
| :--------- | :------- | :----------: | :-------------------------------------------------------------------- |
| `CLIENT_ID` | `string` | **Sí**      | El `_id` del cliente al que desea agregar la clave Pix.               |

### Cuerpo de la solicitud

| Campo  | Tipo     | Obligatorio | Descripción                                                                        |
| :----- | :------- | :----------: | :--------------------------------------------------------------------------------- |
| `key`  | `string` |   Sí        | El valor de la clave Pix (por ejemplo: `your@email.com`, `+551199...`).         |
| `type` | `string` |   Sí        | El tipo de clave.<br />Valores aceptados: `EMAIL`, `CPF`, `CNPJ`, `PHONE`, `RANDOM`. |

---

## Respuestas

### Éxito (201 Created)

La clave se registró correctamente y ya está lista para su uso.

```json
{
  "message": "Chave Pix adicionada com sucesso",
  "key": {
    "key": "444***********",
    "type": "CPF",
    "_id": "696c604456f8***********"
  }
}
```

### Errores comunes

| Estado  | Mensaje                 | Posible causa                                                                                              |
| :------ | :---------------------- | :--------------------------------------------------------------------------------------------------------- |
| **400** | `Bad Request`           | La clave Pix proporcionada no es válida.                                                                  |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado inválido o faltante.<br /> • IP no permitido.         |
| **404** | `Not Found`             | • La clave Pix ya está registrada.<br />• La clave Pix no corresponde a un CPF válido.<br />• Cliente no encontrado. |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                                         |

## Cómo usar

El propósito principal de agregar claves Pix es permitir que el usuario realice un retiro (**Withdraw**) utilizando la clave recién creada.

La respuesta de este endpoint proporciona inmediatamente el **objeto completo** de la clave, que es necesario para construir la carga útil del retiro.

### Flujo de integración

1.  **Registrar la clave:** Llame a este endpoint (`POST /pix/customer/CLIENT_ID/key`).
2.  **Capturar:** La API devolverá los datos de la clave creada. Guarde este objeto.
3.  **Enviar:** Debe pasar el **objeto completo** recibido dentro de la propiedad `pixKey` en la carga útil del retiro.

:::warning[Advertencia de formato]
No envíe datos de clave Pix incompletos. La carga útil del retiro espera el **objeto JSON completo** que contiene `key`, `type` y `_id`.
:::

### Ejemplo práctico

**1. Lo que recibe al crear una clave Pix:**
```json
{
    "message": "Chave Pix adicionada com sucesso",
    "key": {
      "key": "+5512**********",
      "type": "PHONE",
      "_id": "68fa5d5400**********"
    }
}
```

**2. Cómo enviarla en el retiro (POST /withdraw):**

Tomará el objeto anterior e lo insertará dentro de `pixKey`:
```json {13-17}
{
    "amount": 0.2,
    "customerId": "68e7b8****************",
    "currency": {
        "_id": "67339fa800****************",
        "name": "BRL",
        "type": "PIX",
        "symbol": "R$",
        "createdDate": "2024-11-12T18:34:16.289Z",
        "updatedDate": "2024-11-12T18:34:16.289Z",
        "__v": 0
    },
    "pixKey": {
        "key": "+5512**********",
        "type": "PHONE",
        "_id": "68fa5d5400**********"
    }
}
```
Cada campo de este JSON se explica en la <a href={useBaseUrl('/docs/fiat/withdraw/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>página de retiros</a>.

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
    const customerId = "12************";
    const key = "+55***********";
    const type = "PHONE";

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.post(`${url_api}/pix/customer/${customerId}/key`, {
            key,
            type
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
    <TabItem value="python" label="Python">
        El ejemplo de integración utiliza la librería <code>requests</code>.

        **Instalando `requests`:**
    ```bash
    pip install requests
    ```

        **Ejemplo en Python:**
    ```py
import requests

email = "your_email@domain.com"
password = "**********"
customer_id = "12************"
key = "+55***********"
type_ = "PHONE"

try:
    url_api = "https://api.xgateglobal.com"
    
    # Autenticación para obtener el token
    login_response = requests.post(f"{url_api}/auth/token", json={"email": email, "password": password})
    login_response.raise_for_status()
    token = login_response.json().get("token")
    
    # Solicitud con autenticación
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"key": key, "type": type_}
    response = requests.post(f"{url_api}/pix/customer/{customer_id}/key", json=payload, headers=headers)
    response.raise_for_status()
    
    print(response.json())  # Respuesta
except requests.exceptions.RequestException as error:
    try:
        print(error.response.json().get("message"))  # Error
    except AttributeError:
        print("Error al procesar la solicitud.")
    ```
  </TabItem>
    <TabItem value="php" label="PHP">
        <p>Ejemplo de cómo agregar una clave Pix utilizando cURL nativo de PHP.</p>
    ```php
    $email = "your_email@domain.com";
$password = "**********";
$customerId = "12************";
$key = "+55***********";
$type = "PHONE";

$url_api = "https://api.xgateglobal.com";

try {
    // Autenticación para obtener el token
    $login_response = file_get_contents("$url_api/auth/token", false, stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => json_encode(['email' => $email, 'password' => $password])
        ]
    ]));
    
    $login_data = json_decode($login_response, true);
    $token = $login_data['token'] ?? '';
    
    // Solicitud con autenticación
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => "Authorization: Bearer $token\r\nContent-Type: application/json\r\n",
            'content' => json_encode(['key' => $key, 'type' => $type])
        ]
    ];
    
    $response = file_get_contents("$url_api/pix/customer/$customerId/key", false, stream_context_create($options));
    
    echo $response; // Respuesta
} catch (Exception $error) {
    echo "Error al procesar la solicitud.";
}
    ```
  </TabItem>
</Tabs>
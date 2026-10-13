---
sidebar_label: 'Claves Pix'
sidebar_position: 1
description: 'Este endpoint devuelve todas las claves Pix registradas para su cliente.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import PixKeysTester from '@site/src/components/PixKeysTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Listar claves Pix

<div className="ai-btn-wrapper">
<AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Listar Chaves Pix
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /pix/customer/{clientId}/key:
    get:
      summary: Listar Chaves Pix do Cliente
      description: Retorna uma lista (array) com todas as chaves Pix ativas cadastradas para o cliente informado. Útil para recuperar o _id da chave antes de um saque.
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: clientId
          required: true
          schema:
            type: string
          description: O ID único (_id) do cliente.
      responses:
        '200':
          description: Lista de chaves Pix recuperada com sucesso.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    key:
                      type: string
                      description: O valor da chave Pix.
                    type:
                      type: string
                      description: O tipo da chave (ex EMAIL, CPF, PHONE).
                    _id:
                      type: string
                      description: O ID único da chave Pix no sistema.
        '401':
          description: Unauthorized. Token JWT inválido, expirado ou ausente.
        '404':
          description: Not Found. Cliente não encontrado.
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

Este endpoint devuelve todas las claves Pix registradas para su cliente. Utilice esta ruta para verificar qué claves ya están activas antes de intentar registrar una nueva.

---
## Endpoint
- **Método:** <span className="badge badge--success">GET</span>
```bash title="URL del endpoint"
https://api.xgateglobal.com/pix/customer/CLIENT_ID/key
```
:::warning[Importante]
El campo `CLIENT_ID` hace referencia al ID del cliente; si aún no lo ha creado, puede hacerlo desde la <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>página de crear clientes</a>.
:::

---

## Prueba de integración

Utilice el formulario a continuación para simular el listado de claves Pix.

<PixKeysTester />

---

## Solicitud

La solicitud no requiere cuerpo (`body`); solo encabezados de autenticación **Headers**.

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Parámetros de URL

| Parámetro   | Tipo     | Obligatorio | Descripción                                                |
| :---------- | :------- | :---------: | :--------------------------------------------------------- |
| `CLIENT_ID` | `string` |   **Sí**    | El `_id` del cliente cuya lista de claves desea consultar. |

---

## Respuestas

### Éxito (200 OK)

Devuelve una lista (array) de objetos, donde cada objeto es una clave registrada.

```json
[
  {
    "key": "+5512************",
    "type": "PHONE",
    "_id": "68fa5d54004*************"
  }
]
```

### Errores comunes

| Estado  | Mensaje                 | Posible causa                                                                                |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado inválido o faltante.<br /> • IP no permitido. |
| **404** | `Not Found`             | Cliente no encontrado.                                                                       |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                            |

---

## Cómo usar

El propósito principal de listar las claves es permitir al usuario seleccionar una para realizar un retiro (**Withdraw**).

La respuesta de este endpoint proporciona el **objeto completo** de la clave, que es necesario para construir el payload del retiro.

### Flujo de integración

1.  **Listar las claves:** Llame a este endpoint (`GET /pix/customer/CLIENT_ID/key`).
2.  **Selección:** Elija qué clave desea utilizar, si hay más de una (por ejemplo, la primera de la lista).
3.  **Enviar:** Debe pasar el **objeto completo** dentro de la propiedad `pixKey` en el payload del retiro.

:::warning[Advertencia de formato]
No envíe datos incompletos de la clave Pix. El payload del retiro espera el **objeto JSON completo** que contiene `key`, `type` y `_id`.
:::

### Ejemplo práctico

**1. Lo que recibe al listar las claves Pix:**
```json
[
  {
    "key": "+5512**********",
    "type": "PHONE",
    "_id": "68fa5d5400**********"
  }
]
```

**2. Cómo debe enviarlo en el retiro (POST /withdraw):**

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
Cada campo de este JSON se explica en la <a href={useBaseUrl('/docs/fiat/withdraw/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>página de creación de solicitud de retiro</a>.

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
        const customerId = "12************"

        try {
            const url_api = "https://api.xgateglobal.com"
            const login = await axios.post(`${url_api}/auth/token`, { email, password });
            const { data } = await axios.get(`${url_api}/pix/customer/${customerId}/key`, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`
                }
            });
            console.log(data); // Respuesta
        } catch (error) {
            console.log(error.response.data.message) // Error
        }
    })();
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

try:
    url_api = "https://api.xgateglobal.com"
    
    # Inicio de sesión
    login_response = requests.post(f"{url_api}/auth/token", json={"email": email, "password": password})
    login_response.raise_for_status()  # Levanta un error si la respuesta no es 2xx
    
    token = login_response.json().get("token")

    # Buscar información PIX
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{url_api}/pix/customer/{customer_id}/key", headers=headers)
    response.raise_for_status()

    print(response.json())  # Respuesta

except requests.exceptions.RequestException as error:
    print(error.response.json().get("message", "Error desconocido"))  # Error
    ```
  </TabItem>
  <TabItem value="php" label="PHP">
    <p>Ejemplo de cómo obtener la lista de claves Pix utilizando cURL nativo de PHP.</p>
    ```php
    $email = "your_email@domain.com";
$password = "**********";
$customerId = "12************";

try {
    $url_api = "https://api.xgateglobal.com";

    // Inicio de sesión
    $login_ch = curl_init("$url_api/auth/token");
    curl_setopt($login_ch, CURLOPT_POST, true);
    curl_setopt($login_ch, CURLOPT_POSTFIELDS, json_encode(["email" => $email, "password" => $password]));
    curl_setopt($login_ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($login_ch, CURLOPT_RETURNTRANSFER, true);
    
    $login_response = curl_exec($login_ch);
    $login_info = json_decode($login_response, true);
    
    if (curl_errno($login_ch)) {
        throw new Exception("Error al iniciar sesión: " . curl_error($login_ch));
    }

    curl_close($login_ch);

    if (!isset($login_info["token"])) {
        throw new Exception("No se recibió el token.");
    }

    $token = $login_info["token"];

    // Buscar información PIX
    $pix_ch = curl_init("$url_api/pix/customer/$customerId/key");
    curl_setopt($pix_ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $token",
        "Content-Type: application/json"
    ]);
    curl_setopt($pix_ch, CURLOPT_RETURNTRANSFER, true);

    $pix_response = curl_exec($pix_ch);
    $pix_info = json_decode($pix_response, true);

    if (curl_errno($pix_ch)) {
        throw new Exception("Error al buscar datos PIX: " . curl_error($pix_ch));
    }

    curl_close($pix_ch);

    print_r($pix_info); // Respuesta

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
    ```
  </TabItem>
</Tabs>
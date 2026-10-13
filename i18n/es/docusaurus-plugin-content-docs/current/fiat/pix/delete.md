---
sidebar_label: 'Eliminar clave Pix'
sidebar_position: 2
description: "Este endpoint permite eliminar la clave Pix de un cliente."
sidebar_class_name: 'sidebar-method-delete'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DeletePixKeyTester from '@site/src/components/DeletePixKeyTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Eliminar clave Pix

<div className="ai-btn-wrapper">
<AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Remover Chave Pix
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /pix/customer/{clientId}/key/remove/{keyId}:
    delete:
      summary: Remover Chave Pix
      description: Remove permanentemente uma chave Pix vinculada a um cliente. A chave não poderá mais ser utilizada para transações de saque.
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: clientId
          required: true
          schema:
            type: string
          description: O ID único (_id) do cliente.
        - in: path
          name: keyId
          required: true
          schema:
            type: string
          description: O ID único (_id) da chave Pix que será removida.
      responses:
        '201':
          description: Sucesso. Chave Pix removida com sucesso.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Chave Pix removida com sucesso
        '401':
          description: Unauthorized. Token JWT inválido, expirado ou ausente.
        '404':
          description: Not Found. Cliente não encontrado ou Chave Pix inexistente.
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

Este endpoint permite eliminar la clave Pix de un cliente.

---
## Endpoint
- **Método:** <span className="badge badge--danger">DELETE</span>
```bash title="URL del endpoint"
https://api.xgateglobal.com/pix/customer/CLIENT_ID/key/remove/KEY_ID
```

:::warning[Importante]
El campo `CLIENT_ID` hace referencia al ID del cliente; si aún no lo ha creado, puede hacerlo desde la <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>página de crear clientes</a>.
:::
:::warning[Importante]
El campo `KEY_ID` hace referencia al ID de la clave Pix; si aún no ha creado una, puede hacerlo desde la <a href={useBaseUrl('/docs/fiat/pix/add')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>página de crear clave Pix</a>.
:::

---

## Prueba de integración

Utilice el formulario a continuación para simular la eliminación de una clave Pix real.

<DeletePixKeyTester />

---

## Solicitud

### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                 |
| :-------------- | :------------------ | :-------------------------- |
| `Authorization` | `Bearer <tu_token>` | Token de autenticación JWT. |

#### Parámetros de URL

| Parámetro   | Tipo     | Obligatorio | Descripción                                         |
| :---------- | :------- | :---------: | :-------------------------------------------------- |
| `CLIENT_ID` | `string` |   **Sí**    | El `_id` del cliente cuya clave Pix desea eliminar. |
| `KEY_ID`    | `string` |   **Sí**    | El `_id` de la clave Pix que desea eliminar.        |

---

## Respuestas

### Éxito (201 Created)

La clave se eliminó correctamente.

```json
{
  "message": "Chave Pix removida com sucesso"
}
```

### Errores comunes

| Estado  | Mensaje                 | Posible causa                                                                                |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado inválido o faltante.<br /> • IP no permitido. |
| **404** | `Not Found`             | • Cliente no encontrado.<br />• Clave Pix no encontrada.                                     |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                            |

## Cómo usar

Este endpoint permite el **mantenimiento** de la lista de claves de un usuario al eliminar claves obsoletas, incorrectas o que ya no se utilizan para retiros.

Una vez eliminada, la clave **ya no se puede utilizar** en ninguna transacción de retiro (`/withdraw`).

### Flujo de integración

Para eliminar una clave, necesita conocer su ID (`_id`). Flujo habitual:

1.  **Listar:** Llame a las claves del cliente (`GET /pix/customer/{id}/key`) para ver las opciones disponibles.
2.  **Identificar:** Capture el `_id` de la clave que desea eliminar.
3.  **Eliminar:** Envíe ese `_id` en la URL de este endpoint de eliminación.

:::danger[Acción destructiva]
La eliminación es permanente. Si un usuario intenta un retiro utilizando un objeto de una clave que ya ha sido eliminada, la API devolverá un error de validación.
:::

### Ejemplo práctico

**1. Buscar el ID en la lista:**
Al listar las claves, verá el campo `_id`.

```json {5}
[
  {
    "key": "+5512************",
    "type": "PHONE",
    "_id": "68fa5d54004*************"
  }
]
```

**2. Construir la URL de eliminación:**

Debe insertar el ID del cliente y el ID de la clave en la ruta:
```url
DELETE /pix/customer/68e7b8f0db*************/key/remove/68fa5d54004*************
```

**3. La respuesta:**

La respuesta esperada es el éxito (201 Created):

```json
{
  "message": "Chave Pix removida com sucesso"
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
  const customerId = "12************";
  const keyId = "1A***********";

  try {
    const url_api = "https://api.xgateglobal.com"
    const login = await axios.post(`${url_api}/auth/token`, { email, password });
    const { data } = await axios.delete(`${url_api}/pix/customer/${customerId}/key/remove/${keyId}`, {
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
  key_id = "1A***********"

  try:
    url_api = "https://api.xgateglobal.com"
      
    # Solicitud de login
    login_response = requests.post(f"{url_api}/auth/token", json={"email": email, "password": password})
    login_response.raise_for_status()
    token = login_response.json().get("token")
      
    # Solicitud de eliminación
    headers = {"Authorization": f"Bearer {token}"}
    delete_response = requests.delete(f"{url_api}/pix/customer/{customer_id}/key/remove/{key_id}", headers=headers)
    delete_response.raise_for_status()
      
    print(delete_response.json())  # Respuesta
  except requests.exceptions.RequestException as error:
    print(error.response.json().get("message", "Ocurrió un error"))  # Error
    ```
    </TabItem>
    <TabItem value="php" label="PHP">
    <p>Ejemplo de cómo eliminar una clave Pix utilizando cURL nativo de PHP.</p>
    ```php
  $email = "your_email@domain.com";
  $password = "**********";
  $customerId = "12************";
  $keyId = "1A***********";
  $url_api = "https://api.xgateglobal.com";

  $loginUrl = $url_api . "/auth/token";
  $loginData = json_encode(["email" => $email, "password" => $password]);

  $ch = curl_init($loginUrl);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
  curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

  $loginResponse = curl_exec($ch);
  if ($loginResponse === false) {
    die('Error de login: ' . curl_error($ch));
  }
  $token = json_decode($loginResponse, true)['token'];
  curl_close($ch);

  $deleteUrl = $url_api . "/pix/customer/$customerId/key/remove/$keyId";

  $ch = curl_init($deleteUrl);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Content-Type: application/json"
  ]);

  $response = curl_exec($ch);
  $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

  if ($response === false) {
    echo 'Error de cURL: ' . curl_error($ch);
  } else {
    if ($httpCode >= 200 && $httpCode < 300) {
      echo "Clave removida con éxito! (Status: $httpCode)";
    } else {
      echo "Error al eliminar: " . $response;
    }
  }

  curl_close($ch);
  ```
  </TabItem>
</Tabs>
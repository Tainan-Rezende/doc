---
sidebar_label: 'Inicio de sesión'
description: 'Toda la interacción con la API de XGate está protegida y requiere autenticación.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import AuthTester from '@site/src/components/AuthTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Inicio de sesión

<div className="ai-btn-wrapper">
<AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Token de Autenticação
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /auth/token:
    post:
      summary: Obter Token de Acesso
      description: Troca as credenciais do usuário (e-mail e senha) por um token JWT Bearer válido por 15 dias.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                  description: E-mail de acesso à plataforma.
                password:
                  type: string
                  format: password
                  description: Senha de acesso.
      responses:
        '200':
          description: Autenticação realizada com sucesso. Retorna o token JWT.
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                    description: Token JWT Bearer.
        '401':
          description: Não autorizado. E-mail ou senha incorretos.
        '500':
          description: Erro interno de servidor.`}
    />
</div>

Toda la interacción con la API de XGate está protegida y requiere autenticación. El primer paso para cualquier integración es obtener su token de acceso.

Este endpoint le permite intercambiar su `email` y `password` por un **token de portador** (en formato [JWT](https://jwt.io/)). Este token debe enviarse en todas las solicitudes futuras en el encabezado `Authorization`.

:::warning[Importante]
El token generado es válido durante **15 días**. Después de este período, deberá generar un nuevo token utilizando la misma ruta.
:::

---

## Endpoint

 - **Método:** <span className="badge badge--info">POST</span>
```bash title="URL del endpoint"
https://api.xgateglobal.com/auth/token
```

---

## Prueba de integración

Utilice el formulario a continuación para generar un token válido directamente desde su navegador.

<AuthTester />

---

## Solicitud

Envíe un objeto JSON en el `body` de la solicitud con las siguientes propiedades:

| Campo      | Tipo   | Obligatorio | Descripción                                |
| :--------- | :----- | :---------- | :----------------------------------------- |
| `email`    | String | Sí          | Su correo electrónico de acceso a la plataforma. |
| `password` | String | Sí          | Su contraseña de acceso.                  |

#### Ejemplo de cuerpo (JSON)
```json
{
  "email": "email@company.com",
  "password": "Your.Password"
}
```

---

## Respuestas

### Éxito (200 OK)

En caso de éxito, la API devolverá un objeto JSON que contiene su token de acceso:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibm******************************"
}
```

### Errores comunes

| Estado | Mensaje                 | Posible motivo                                                             |
| :----- | :---------------------- | :------------------------------------------------------------------------- |
| **401** | `No autorizado`        | • Correo electrónico o contraseña incorrectos.                             |
| **500** | `Error interno del servidor` | Error interno del servidor. Contacte con soporte.                  |

---
## Cómo usar

Después de recibir el token, debe almacenarlo de forma segura y enviarlo en todas las solicitudes posteriores a las rutas protegidas.

El token debe enviarse en el encabezado `Authorization` utilizando el prefijo `Bearer` (seguido de un espacio).

**Ejemplo de encabezado**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```
:::warning[Recordatorio de expiración]
El token vence en 15 días. Si comienza a recibir errores 401 Unauthorized en sus solicitudes (incluso con el token), es probable que haya expirado. Simplemente inicie sesión nuevamente para generar un nuevo token.
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

    const apiUrl = "https://api.xgateglobal.com";
    const credentials = {
        email: "your_email@domain.com",
        password: "**********"
    };

    (async () => {
        try {
            const response = await axios.post(`${apiUrl}/auth/token`, credentials);
            console.log(response.data);
        } catch (error) {
            if (error.response && error.response.data) {
            console.error(error.response.data.message || "Ocurrió un error");
            } else {
            console.error(error.message);
            }
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

    api_url = "https://api.xgateglobal.com"
    credentials = {
        "email": "your_email@domain.com",
        "password": "**********"
    }

    try:
        response = requests.post(f"{api_url}/auth/token", json=credentials)
        response.raise_for_status()  # Genera una excepción para errores 4xx/5xx
        print(response.json())

    except requests.exceptions.RequestException as error:
        if error.response is not None:
            # Mostrar el mensaje de error en la respuesta de la API
            print(error.response.json().get("message", "Ocurrió un error"))
        else:
            # Manejar errores de conexión
            print(f"Error de conexión: {error}")
    ```
  </TabItem>
    <TabItem value="php" label="PHP">
        <p>Ejemplo de obtención del token utilizando cURL nativo de PHP.</p>
    ```php

    $apiUrl = "https://api.xgateglobal.com";
    $credentials = [
        "email" => "your_email@domain.com",
        "password" => "**********"
    ];

    $payload = json_encode($credentials);

    // Inicializar cURL para el endpoint específico
    $ch = curl_init($apiUrl . "/auth/token");

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        echo $response;
    } else {
        $errorResponse = json_decode($response, true);
        // Verificar si la clave 'message' existe en la respuesta de error
        if (isset($errorResponse["message"])) {
            echo $errorResponse["message"];
        } else {
            echo "Ocurrió un error. Estado HTTP: " . $httpCode;
        }
    }
    ```
  </TabItem>
</Tabs>
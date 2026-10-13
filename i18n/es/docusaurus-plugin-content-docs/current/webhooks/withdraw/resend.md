---
sidebar_label: 'Reenviar webhook'
sidebar_position: 2
description: 'Este endpoint permite forzar el reenvío de una notificación webhook para una transacción de retiro específica.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import AICopyButton from '@site/src/components/AICopyButton';

# Reenviar webhook

<div className="ai-btn-wrapper">
<AICopyButton 
  promptText={`openapi: 3.0.3
info:
  title: API XGate - Reenviar Webhook de Saque
  version: 1.0.0
  description: Endpoint para forçar o reenvio de uma notificação de webhook para uma transação de saque específica.
servers:
  - url: https://api.xgateglobal.com
paths:
  /withdraw/{transactionId}/resend/webhook:
    post:
      summary: Reenviar Webhook de Saque
      description: Rota de contingência para acionar manualmente o envio do payload de webhook de um saque para a URL cadastrada no painel da empresa. Não necessita de corpo (body) na requisição.
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: transactionId
          required: true
          schema:
            type: string
          description: O ID (_id) da transação de saque.
      responses:
        '200':
          description: Sucesso. O gatilho foi acionado.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Webhook de saque reenviado com sucesso"
        '401':
          description: Não autorizado (Token inválido/expirado ou IP bloqueado).
        '404':
          description: Não Encontrado (Transação não existe ou ID é inválido).
        '500':
          description: Erro interno do servidor.
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

# INSTRUÇÕES PARA A IA:
# 1. Gere o código de integração para a linguagem solicitada pelo usuário.
# 2. IMPORTANTE: Esta é uma requisição POST, mas não envia corpo de dados (body vazio/null). O ID da transação vai direto na URL.
# 3. Inclua a passagem do token Bearer no Header de Autorização.
# 4. Adicione tratamento de erros com base nas respostas acima (ex: 404 para transação não encontrada).`} 
/>
</div>

Este endpoint permite forzar el reenvío de una notificación webhook para una transacción de retiro específica.

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/withdraw/TRANSACTION_ID/resend/webhook
```

:::warning[Importante]
El valor **TRANSACTION_ID** en la URL hace referencia al `_id` del retiro. Esta solicitud **no requiere cuerpo**, solo la URL parametrizada y el encabezado de autenticación.
:::

---

## Solicitud

### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                                            |
| :-------------- | :------------------ | :----------------------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | Token JWT de autenticación obtenido al iniciar sesión. |

---

## Respuestas

### Éxito (200 OK)

El comando fue recibido y XGate reenvió la carga útil del webhook a la URL registrada en su panel.

```json
{
    "message": "Webhook de saque reenviado com sucesso"
}
```

### Errores comunes

| Estado  | Mensaje                 | Causa probable                                                                                                                                                |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido o caducado.<br /> • Encabezado inválido o no proporcionado.<br /> • IP no permitida.<br />• No tiene autorización para realizar esta acción. |
| **404** | `Not Found`             | • El ID proporcionado es inválido.<br />• La transacción no existe.                                                                                           |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                                                                                             |

---

## Cómo usar

Esta es una ruta de contingencia y mantenimiento. A diferencia de las rutas de consulta, realiza una acción activa en XGate, provocando que nuestro servidor vuelva a disparar la notificación HTTP hacia su sistema.

### Casos de uso comunes

Usará este endpoint principalmente para:

1. **Recuperación ante fallos:** Si su servidor sufrió inestabilidad, falló o el firewall bloqueó la solicitud original de XGate, puede usar este endpoint para "volver a recuperar" la notificación y actualizar el estado en su base de datos.
2. **Pruebas de integración:** Durante la fase de desarrollo, puede disparar el webhook de una transacción antigua varias veces para comprobar que la lógica de su código receptor funciona correctamente.

### Ejemplo práctico

Simplemente haga un POST a la URL proporcionando el ID de la transacción. Recibirá un mensaje de éxito confirmando que se activó el reenvío.

```json
{
    "message": "Webhook de saque reenviado com sucesso"
}
```

---

## Integración

A continuación se muestra un ejemplo simple de cómo implementar esta llamada con Node.js. Como se trata de un `POST` sin cuerpo, simplemente enviamos un objeto vacío `{}` junto con los encabezados.

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    El ejemplo de integración utiliza la librería `Axios` para realizar la solicitud HTTP.

    **Instalando `Axios`:**
    ```bash
    npm install axios
    ```

    **Ejemplo en JavaScript:**
    ```javascript
    const axios = require("axios");

    (async () => {
        const email = "email@domain.com";
        const password = "••••••";
        const transactionId = "6997146*******************";

        try {
            const url_api = "https://api.xgateglobal.com";
            
            // 1. Obtener el token de autenticación
            const login = await axios.post(`${url_api}/auth/token`, { email, password });
            
            // 2. Activar el reenvío del webhook (POST sin cuerpo)
            const { data } = await axios.post(`${url_api}/withdraw/${transactionId}/resend/webhook`, {}, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`
                }
            });
            
            console.log("Respuesta:", data); 
            // Esperado: { message: 'Webhook de saque reenviado com sucesso' }

        } catch (error) {
            console.error("Error al reenviar:", error.response ? error.response.data : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
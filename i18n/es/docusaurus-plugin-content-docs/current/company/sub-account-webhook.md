---
sidebar_label: 'Webhook de subcuenta'
sidebar_position: 3
description: 'Este endpoint permite registrar automáticamente la primera URL de webhook para una subcuenta recién creada.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import AICopyButton from '@site/src/components/AICopyButton';

# Crear webhook de la subcuenta

<div className="ai-btn-wrapper">
<AICopyButton 
  promptText={`openapi: 3.0.3
info:
  title: API XGate - Criar Webhook da Subconta
  version: 1.0.0
  description: Endpoint de setup exclusivo para cadastrar a primeira URL de webhook de uma subconta recém-criada.
servers:
  - url: https://api.xgateglobal.com
paths:
  /webhook/subaccount:
    post:
      summary: Cadastrar Primeiro Webhook (Subconta)
      description: Salva a URL inicial de recebimento de notificações HTTP para a subconta. Retornará erro 400 se a subconta já possuir um webhook configurado.
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
                - externalWebhookUrl
              properties:
                name:
                  type: string
                  description: Nome interno de identificação do webhook.
                  example: "Primeiro Webhook - Subconta"
                externalWebhookUrl:
                  type: string
                  description: URL completa do servidor que receberá os payloads da XGate via POST.
                  example: "https://sua-empresa.com/api/webhooks/xgate"
      responses:
        '200':
          description: Sucesso. O webhook foi registrado e está ativo.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Primeiro Webhook cadastrado com sucesso"
        '400':
          description: Bad Request. A conta não é uma subconta válida ou já possui um webhook cadastrado.
        '401':
          description: Unauthorized. Token inválido, expirado ou não informado.
        '500':
          description: Internal Server Error.
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

# INSTRUÇÕES PARA A IA:
# 1. Gere o código de integração para a linguagem solicitada pelo usuário.
# 2. AVISO CRÍTICO DE AUTENTICAÇÃO: Coloque um comentário bem claro informando que o Bearer Token utilizado nesta requisição DEVE ser o token gerado com as credenciais da SUBCONTA, e não da Conta Principal (Master).
# 3. AVISO DE USO ÚNICO: Informe no código que esta rota serve apenas para o setup inicial. Se a subconta já tiver um webhook, a API retornará Erro 400.
# 4. Envie o payload JSON contendo os campos 'name' e 'externalWebhookUrl'.
# 5. Adicione tratamento de erros com foco no HTTP 400 (limite atingido).`} 
/>
</div>

Este endpoint permite registrar automáticamente la **primera URL de webhook** para una subcuenta recién creada.

:::warning[Regla de uso único]
Esta ruta fue diseñada exclusivamente para la configuración inicial de la subcuenta. **Solo permite guardar el primer webhook**. Si la subcuenta ya tiene un webhook configurado, la API devolverá un error.
:::

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/webhook/subaccount
```

---

## Solicitud

### Encabezados obligatorios

| Encabezado | Valor | Descripción |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <tu_token>` | Token JWT de autenticación de la **subcuenta**. |

### Cuerpo de la solicitud

| Parámetro | Tipo | Validación | Descripción |
| :--- | :--- | :--- | :--- |
| `name` | `string` | Obligatorio | Un nombre interno de identificación para el webhook (por ejemplo, "Primer webhook"). |
| `externalWebhookUrl` | `string` | Obligatorio | La URL completa de su servidor que recibirá los datos enviados por XGate vía POST. |

#### Ejemplo de payload

```json
{
    "externalWebhookUrl": "https://su-empresa.com/api/webhooks/subaccount/xgate",
    "name": "Primer webhook"
}
```

---

## Respuestas

### Éxito (200 OK)

La URL de notificación se registró y ya está activa para la subcuenta.

```json
{
    "message": "Primer webhook registrado con éxito"
}
```

### Errores comunes

| Estado | Mensaje | Motivo probable |
| :--- | :--- | :--- |
| **400** | `Bad Request` | • **Esta funcionalidad no está disponible para su cuenta**: la cuenta que realiza la solicitud no es una subcuenta válida para este flujo.<br /><br />• **Esta funcionalidad solo permite guardar el primer webhook de su cuenta**: la subcuenta **ya tiene** un webhook registrado. Esta ruta solo funciona cuando la lista de webhooks está vacía. |
| **401** | `Unauthorized` | • Token inválido o caducado.<br /> • Encabezado inválido o no proporcionado.<br /> • IP no permitido. |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte. |

---

## Cómo usar

### Casos de uso comunes

1. **Automatización de configuración (onboarding):** Cuando su cuenta principal (master) crea una subcuenta para un nuevo cliente corporativo, puede programar su sistema para iniciar sesión inmediatamente en la subcuenta recién creada y activar este endpoint. Esto garantiza que la subcuenta nazca lista para notificar a su gateway interno sobre los pagos, sin necesidad de intervención manual en el panel.

---

## Integración

A continuación se muestra un ejemplo simple de cómo implementar esta llamada con Node.js. Recuerde usar las credenciales de la subcuenta para obtener el token de autorización.

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    El ejemplo de integración utiliza la biblioteca `Axios` para realizar la solicitud HTTP.

    **Instalando `Axios`:**
    ```bash
    npm install axios
    ```

    **Ejemplo en JavaScript:**
    ```javascript
    const axios = require("axios");

    (async () => {
        // ATENCIÓN: use el correo electrónico y la contraseña de la SUBCUENTA para generar el token de esta acción
        const emailSubcuenta = "admin@subcuenta.com";
        const passwordSubcuenta = "••••••";

        try {
            const url_api = "https://api.xgateglobal.com";
            
            // 1. Obtener el token de autenticación de la subcuenta
            const login = await axios.post(`${url_api}/auth/token`, { 
                email: emailSubcuenta, 
                password: passwordSubcuenta 
            });
            
            // 2. Configurar el primer webhook
            const webhookData = {
                externalWebhookUrl: "https://api.su-empresa.com/webhooks/xgate/subaccount-1",
                name: "Webhook principal - Subcuenta 1"
            };

            const { data } = await axios.post(`${url_api}/webhook/subaccount`, webhookData, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`,
                    "Content-Type": "application/json"
                }
            });
            
            console.log("Respuesta:", data); 
            // Esperado: { message: 'Primer webhook registrado con éxito' }

        } catch (error) {
            console.error("Error al registrar webhook:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
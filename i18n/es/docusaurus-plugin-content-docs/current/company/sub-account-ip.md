---
sidebar_label: 'Permitir IP (retiro)'
sidebar_position: 4
description: 'Este endpoint permite registrar automáticamente el primer IP autorizado para realizar solicitudes de retiro en una subcuenta recién creada.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import AICopyButton from '@site/src/components/AICopyButton';

# Permitir IP de retiro en la subcuenta

<div className="ai-btn-wrapper">
<AICopyButton 
  promptText={`openapi: 3.0.3
info:
  title: API XGate - Liberar IP de Saque (Subconta)
  version: 1.0.0
  description: Endpoint de setup exclusivo para cadastrar o primeiro IP autorizado a realizar saques em uma subconta recém-criada.
servers:
  - url: https://api.xgateglobal.com
paths:
  /withdraw/allowed-ip/subaccount:
    post:
      summary: Cadastrar Primeiro IP de Saque
      description: Registra o IP do servidor que terá permissão para disparar saques nesta subconta. Retorna erro 400 se a subconta já possuir um IP cadastrado.
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - ip
              properties:
                ip:
                  type: string
                  description: Endereço IP (IPv4 ou IPv6) do servidor autorizado.
                  example: "8.8.8.8"
      responses:
        '200':
          description: Sucesso. O IP foi registrado e autorizado para saques.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Primeiro IP liberado para solicitação de saque cadastrado com sucesso"
        '400':
          description: Bad Request. A conta não é uma subconta válida ou já possui um IP cadastrado (limite atingido).
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
# 2. AVISO CRÍTICO DE AUTENTICAÇÃO: Coloque um comentário em destaque informando que o Bearer Token utilizado DEVE ser o da SUBCONTA, e não o da Conta Master.
# 3. AVISO DE USO ÚNICO: Explique no código que esta rota é apenas para o setup inicial. Se a subconta já tiver um IP cadastrado, a API retornará Erro 400. Novos IPs devem ser geridos via Dashboard.
# 4. AVISO DE ESCOPO: Informe ao desenvolvedor que este IP libera APENAS requisições de saque. Ele NÃO libera a rota de consulta de saldo.
# 5. O payload exige apenas o campo 'ip' em formato JSON.`} 
/>
</div>

Este endpoint permite registrar automáticamente el **primer IP autorizado** para realizar solicitudes de retiro en una subcuenta recién creada.

:::warning[Regla de uso único]
Esta ruta fue diseñada exclusivamente para la configuración inicial de la subcuenta. **Solo permite guardar el primer IP**. Si la subcuenta ya tiene un IP de retiro configurado, la API devolverá un error y los nuevos IP deberán agregarse desde el panel.
:::

:::info[Atención: retiro vs saldo]
El IP habilitado por este endpoint tiene permiso **exclusivo para crear retiros**. **No** otorga acceso a las rutas de consulta de saldo. La habilitación de IP para consulta de saldo tiene una configuración separada.
:::

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/withdraw/allowed-ip/subaccount
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
| `ip` | `string` | Obligatorio | La dirección IP (IPv4 o IPv6) de su servidor que tendrá permiso para disparar retiros en esta subcuenta. |

#### Ejemplo de payload

```json
{
    "ip": "8.8.8.8"
}
```

---

## Respuestas

### Éxito (200 OK)

La dirección IP se registró en la lista de permisos y ya puede solicitar retiros.

```json
{
    "message": "Primer IP habilitado para solicitud de retiro registrado con éxito"
}
```

### Errores comunes

Como se trata de una ruta de uso único, las validaciones de reglas de negocio suelen devolver un estado `400`.

| Estado | Mensaje | Motivo probable |
| :--- | :--- | :--- |
| **400** | `Bad Request` | • **Esta funcionalidad no está disponible para su cuenta**: esta ruta solo está disponible para registrar el primer IP de una subcuenta. La cuenta que realiza la solicitud no es una subcuenta válida para este flujo.<br /><br />• **Esta funcionalidad solo permite habilitar el primer IP de retiro de su cuenta**: cuando ya se ha registrado un primer IP. La subcuenta **ya tiene** un IP registrado y la ruta solo funciona cuando la lista está vacía. |
| **401** | `Unauthorized` | • Token inválido o caducado.<br /> • Encabezado inválido o no proporcionado.<br /> • IP de la solicitud no permitido. |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte. |

---

## Cómo usar

### Casos de uso comunes

1. **Automatización de configuración (onboarding):** Así como con los webhooks, inmediatamente después de crear la subcuenta vía API para un nuevo cliente, su sistema puede iniciar sesión en esa nueva subcuenta y registrar la IP fija de su servidor financiero. Esto garantiza que la subcuenta nazca lista y segura para procesar retiros automáticamente, sin necesidad de intervención manual de su equipo de soporte.

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
            
            // 2. Configurar el primer IP permitido para retiro
            const ipData = {
                ip: "8.8.8.8"
            };

            const { data } = await axios.post(`${url_api}/withdraw/allowed-ip/subaccount`, ipData, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`,
                    "Content-Type": "application/json"
                }
            });
            
            console.log("Respuesta:", data); 
            // Esperado: { message: 'Primer IP habilitado para solicitud de retiro registrado con éxito' }

        } catch (error) {
            console.error("Error al registrar IP:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
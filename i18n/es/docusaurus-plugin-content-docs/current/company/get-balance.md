---
sidebar_label: 'Consultar saldo'
sidebar_position: 1
description: 'Este endpoint le permite consultar los saldos disponibles en su cuenta de XGate.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import AICopyButton from '@site/src/components/AICopyButton';

# Consultar saldo de la empresa

<div className="ai-btn-wrapper">
<AICopyButton 
  promptText={`openapi: 3.0.3
info:
  title: API XGate - Consultar Saldo da Empresa
  version: 1.0.0
  description: Endpoint para consulta de saldos disponíveis (Fiat e Cripto). Requer Whitelist de IP.
servers:
  - url: https://api.xgateglobal.com
paths:
  /balance/company:
    post:
      summary: Consultar Saldo
      description: Retorna uma lista com os saldos da conta empresa. É possível filtrar por uma moeda específica ou enviar um corpo vazio para retornar tudo.
      security:
        - bearerAuth: []
      requestBody:
        description: Opcional. Envie um objeto vazio para saldo total ou detalhe o objeto currency/cryptocurrency para filtrar.
        content:
          application/json:
            schema:
              type: object
              properties:
                currency:
                  type: object
                  description: Filtro para moeda fiduciária.
                cryptocurrency:
                  type: object
                  description: Filtro para criptomoeda.
            example: {}
      responses:
        '200':
          description: Sucesso. Retorna um Array com os saldos encontrados.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
        '401':
          description: Não autorizado (Token inválido ou IP não cadastrado na Whitelist).
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

# INSTRUÇÕES PARA A IA:
# 1. Gere o código de integração para a linguagem solicitada.
# 2. AVISO CRÍTICO: Adicione um comentário em destaque no código informando que o IP do servidor deve ser cadastrado obrigatoriamente no painel da XGate (em Configurações > IP Permitidos para consulta de saldo). Sem isso, a API retornará 401.
# 3. Mostre que para consultar o saldo total, basta enviar um objeto vazio ({}) no corpo do POST.
# 4. A resposta é sempre um ARRAY. Mostre como iterar ou encontrar um saldo específico (ex: BRL).
# 5. Adicione tratamento para erro 401 (Unauthorized/IP Block).`} 
/>
</div>

Este endpoint le permite consultar los saldos disponibles en su cuenta de XGate. Puede obtener el saldo total (todas las monedas) o filtrar por una moneda fiduciaria o criptomoneda específica.

:::warning[Advertencia de seguridad - IP permitida]
Por motivos de seguridad, esta ruta requiere validación del origen. La IP del servidor que realiza la solicitud **debe estar registrada obligatoriamente** en su panel.

Acceda al menú **Configuración > IP permitidas para consulta de saldo** y agregue su IP. De lo contrario, la API devolverá un error de autorización.
:::

---

## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/balance/company
```

---

## Solicitud

### Encabezados obligatorios

| Encabezado | Valor | Descripción |
| --- | --- | --- |
| `Authorization` | `Bearer <tu_token>` | Token de autenticación JWT obtenido al iniciar sesión. |

### Cuerpo de la solicitud

Tiene 3 opciones de payload para enviar, dependiendo de lo que desee consultar:

**Opción 1: Consultar saldo total (Fiat y Cripto)**
Envíe un objeto vacío.

```json
{}
```

**Opción 2: Consultar solo moneda fiduciaria (Fiat)**
Envíe el objeto `currency` detallado.

```json
{
    "currency": {
        "_id": "6728f0a2cba3****************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-11-04T16:04:50.019Z",
        "updatedDate": "2024-11-07T02:23:38.606Z",
        "__v": 0,
        "symbol": "R$"
    }
}
```

**Opción 3: Consultar solo criptomoneda**
Envíe el objeto `cryptocurrency` detallado.

```json
{
    "cryptocurrency": {
        "_id": "67339b18ca59****************",
        "__v": 0,
        "coinGecko": "tether",
        "createdDate": "2024-11-12T18:14:48.380Z",
        "name": "USDT",
        "symbol": "USDT",
        "updatedDate": "2024-11-15T05:53:32.979Z"
    }
}
```

---

## Respuestas

La API siempre devolverá un *Array* que contiene los saldos encontrados.

### Éxito (200 OK)

**Respuesta para la Opción 1 (Saldo total):**

```json
[
    {
        "currency": {
            "type": "PIX",
            "name": "BRL"
        },
        "totalAmount": 1.94,
        "totalHeld": 0
    },
    {
        "cryptocurrency": {
            "name": "USDT",
            "symbol": "USDT"
        },
        "totalAmount": 0.866938
    }
]
```

**Respuesta para la Opción 2 (Solo Fiat):**

```json
[
    {
        "currency": {
            "type": "PIX",
            "name": "BRL"
        },
        "totalAmount": 1.94,
        "totalHeld": 0
    }
]
```

**Respuesta para la Opción 3 (Solo Cripto):**

```json
[
    {
        "cryptocurrency": {
            "name": "USDT",
            "symbol": "USDT"
        },
        "totalAmount": 0.866938
    }
]
```

### Errores comunes

| Estado | Mensaje | Motivo probable |
| --- | --- | --- |
| **401** | `Unauthorized` | • Token inválido o caducado.<br />• Encabezado inválido o no proporcionado.<br />• IP no registrada en la whitelist del panel. |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte. |

---

## Cómo usar

### Casos de uso comunes

1. **Mostrar en un dashboard personalizado:** Sincronice y muestre el saldo actualizado de la empresa directamente en su sistema administrativo interno, sin necesidad de iniciar sesión en el panel de XGate.
2. **Validación previa al retiro:** Antes de aprobar y disparar una solicitud de retiro masivo, su sistema puede consultar el saldo disponible (`totalAmount`) para garantizar que hay fondos suficientes, evitando errores de procesamiento.
3. **Monitoreo financiero:** Cree rutinas automatizadas que alerten a su equipo financiero cuando el saldo (Fiat o Cripto) caiga por debajo de un umbral operativo mínimo.

---

## Integración

A continuación se muestra un ejemplo de cómo implementar la consulta de **saldo total** usando Node.js.

**Instalando `Axios`:**
```bash
npm install axios
```

**Ejemplo en JavaScript:**
```javascript
const axios = require("axios");

(async () => {
    const email = "email@dominio.com";
    const password = "••••••";

    try {
        const url_api = "https://api.xgateglobal.com";
        
        // 1. Obtener token de autenticación
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        
        // 2. Consultar saldo total (Cuerpo vacío)
        // Nota: Para filtrar, simplemente agregue el objeto currency o cryptocurrency al cuerpo ({})
        const { data } = await axios.post(`${url_api}/balance/company`, {}, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        
        console.log("Saldo de la empresa:", JSON.stringify(data, null, 2));

        // Ejemplo de lectura del saldo en BRL (Reales brasileños):
        const saldoFiat = data.find(item => item.currency && item.currency.name === "BRL");
        if (saldoFiat) {
            console.log(`Saldo disponible en Reales: R$ ${saldoFiat.totalAmount}`);
        }

    } catch (error) {
        console.error("Error al buscar el saldo:", error.response ? error.response.data : error.message);
    }
})();
```
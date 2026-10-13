---
sidebar_label: 'Redes blockchain'
sidebar_position: 3
description: 'Este endpoint devuelve todas las redes blockchain compatibles con la plataforma.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ListDepositBlockchainNetworksTester from '@site/src/components/ListDepositBlockchainNetworksTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Listar redes blockchain

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Listar Redes Blockchain
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /deposit/company/blockchain-networks:
    get:
      summary: Listar Redes Blockchain
      description: Retorna uma lista de todas as redes blockchain suportadas pela plataforma (ex ERC-20, TRC-20, Solana Polygon). O objeto retornado é obrigatório para montar payloads de saque (cash-out) em criptomoedas.
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Sucesso. Lista de redes recuperada corretamente.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    _id:
                      type: string
                      description: ID único da rede.
                    name:
                      type: string
                      description: Nome da rede de transferência (ex TRC-20, ERC-20).
                    chainId:
                      type: string
                      description: Identificador da rede na blockchain (ex 56, 1).
                    chain:
                      type: string
                      description: Nome da blockchain principal (ex Ethereum).
                    symbol:
                      type: string
                      description: Símbolo do token nativo da rede (ex ETH).
                    cryptocurrencies:
                      type: array
                      items:
                        type: string
                    createdDate:
                      type: string
                      format: date-time
                    updatedDate:
                      type: string
                      format: date-time
                    __v:
                      type: integer
        '401':
          description: Unauthorized. Token inválido, expirado ou ausente.
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

Este endpoint devuelve todas las redes blockchain compatibles con la plataforma (por ejemplo, Ethereum, BSC y Polygon).

Esta lista es **fundamental para los retiros de criptomonedas** a billeteras externas. Dado que USDT existe en varias blockchains diferentes, debe especificar en qué red debe realizarse la transferencia para que el depósito llegue correctamente.

---
## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/deposit/company/blockchain-networks
```

---

## Prueba de integración

Utilice el formulario a continuación para ver las redes disponibles.

<ListDepositBlockchainNetworksTester />

---

## Solicitud

La solicitud no requiere cuerpo, solo los **encabezados de autenticación**.

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

---

## Respuestas

### Éxito (200 OK)

Devuelve la lista de redes.

```json
[
  {
    "_id": "672c15919**************",
    "name": "ERC-20",
    "chainId": "1",
    "cryptocurrencies": [...],
    "updatedDate": "2024-1**************",
    "createdDate": "2024-1**************",
    "__v": 0,
    "chain": "Ethereum",
    "uid": "01KH7NPXAX**************"
  },
  {
    "_id": "672c19adc**************",
    "name": "Polygon",
    "chainId": "137",
    "cryptocurrencies": [...],
    "updatedDate": "2024-1**************",
    "createdDate": "2024-1**************",
    "__v": 0,
    "chain": "Polygon",
    "symbol": "MATIC",
    "uid": "01KH7N1B2D**************"
  },
  {
    "_id": "69ea823198**************",
    "__v": 0,
    "chain": "Tron",
    "chainId": "728126428",
    "createdDate": "2026-0**************",
    "cryptocurrencies": [...],
    "name": "TRC-20",
    "symbol": "TRX",
    "uid": "01KHM0PNDZBSGFDE7DP6AQA72N",
    "updatedDate": "2026-0**************"
  },
  {
    "_id": "69ea849098**************",
    "__v": 0,
    "chain": "Solana",
    "createdDate": "2026-0**************",
    "cryptocurrencies": [...],
    "name": "Solana",
    "symbol": "SOL",
    "uid": "01KKZWMEH6**************",
    "updatedDate": "2026-0**************"
  }
]
```

### Errores comunes

| Estado  | Mensaje                 | Posible causa                                                                               |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado inválido o faltante.<br />• IP no permitida. |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                           |

---

## Cómo usar

Para realizar un **Depósito Crypto** (enviar USDT o USDC de XGate a una billetera externa), no basta con informar la moneda y el monto. Es obligatorio especificar la **Red (Blockchain Network)**.

### ¿Qué son estas Redes?
Imagina que el **USDT** o **USDC** es la carga (el dinero) y la **Red Blockchain** es la autopista por donde pasará esa carga. Trabajamos con las siguientes redes:

* **Ethereum / ERC-20:** La red principal de Ethereum. Generalmente tiene tarifas de gas más altas.
* **Polygon:** Una red creada para resolver el problema de escalabilidad de Ethereum, ofreciendo transacciones rápidas y de bajo costo.
* **Tron (TRC-20):** Extremadamente popular para transacciones de stablecoins (**utilizada solo para transacciones de USDT en XGate**), conocida por su alta velocidad y tarifas muy reducidas.
* **Solana:** Una de las redes más rápidas y eficientes del mercado actual, destacando por sus costos de transacción casi nulos.

:::danger[Importante]
Si tu cliente proporciona una dirección de billetera de la red **Solana**, debes seleccionar la red `Solana` en este listado. Enviar por la red equivocada (ej.: enviar a una dirección Tron usando la red Ethereum) resultará en una **falla en la transacción** y en la **posible pérdida permanente de los fondos**.
:::

### El Flujo de Integración

1.  **Consulta las Redes:** Llama a este endpoint para obtener las opciones disponibles y sus IDs.
2.  **Selecciona la Red:** Deja que tu usuario elija (ej.: "Selecciona la red de destino: ERC-20, TRC-20, Solana o Polygon") o selecciónala por sistema basándote en la dirección de la billetera.
3.  **Arma el Payload:** Toma el **objeto** de la red elegida e insértalo en el campo `blockchainNetwork` del payload de retiro.

### Ejemplo práctico

**1. Objeto de red que recibió en esta lista (por ejemplo, SOLANA):**
```json
{
  "_id": "69ea849098**************",
  "__v": 0,
  "chain": "Solana",
  "createdDate": "2026-0**************",
  "cryptocurrencies": [...],
  "name": "Solana",
  "symbol": "SOL",
  "uid": "01KKZWMEH6**************",
  "updatedDate": "2026-0**************"
}
```

**2. Cómo enviarlo en el retiro de criptomonedas (POST /withdraw):**

Observe cómo el objeto anterior se inserta en el campo `blockchainNetwork`:

```json {9-15}
{
    "amount": 2,
    "customerId": "6759a16f20***************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT"
    },
    "blockchainNetwork": {
      "_id": "69ea849098**************",
      "chain": "Solana",
      "name": "Solana",
      "symbol": "SOL",
      "uid": "01KKZWMEH6**************"
    },
    "wallet": "0x7A00e4a***************",
    "externalId": "6dd37763a2***************"
}
```

---

## Integración

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
  Este ejemplo de integración utiliza la librería <code>Axios</code> en Node.js.

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

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/withdraw/company/blockchain-networks`, {
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
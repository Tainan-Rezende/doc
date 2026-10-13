---
sidebar_label: 'Cotización Cripto a FIAT'
sidebar_position: 5
description: 'Este endpoint le permite calcular con anticipación cuánto recibirá el cliente en moneda fiduciaria al retirar un monto específico en criptomonedas.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetTetherConversionToFiatTester from '@site/src/components/GetTetherConversionToFiatTester';
import AICopyButton from '@site/src/components/AICopyButton';
import CryptoDeprecationNotice from '@site/src/components/CryptoDeprecationNotice';

# Cotización de Cripto a FIAT

<CryptoDeprecationNotice />

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Cotação Crypto para FIAT
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /withdraw/conversion/brl/pix:
    post:
      summary: Cotação Crypto para FIAT (Pix)
      description: Calcula antecipadamente o valor em moeda fiduciária (BRL) que o cliente receberá ao sacar um valor específico em criptomoeda. Rota apenas de consulta (não gera pedido de saque).
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - amount
                - cryptocurrency
              properties:
                amount:
                  type: number
                  description: Valor em Crypto que se deseja converter e cotar (ex 1.00).
                cryptocurrency:
                  type: object
                  description: Objeto completo com os dados da criptomoeda de origem (ex USDT, USDC).
                  required:
                    - _id
                    - name
                    - symbol
                  properties:
                    _id:
                      type: string
                    name:
                      type: string
                    symbol:
                      type: string
                    coinGecko:
                      type: string
      responses:
        '200':
          description: Sucesso. Retorna o valor convertido para BRL e a taxa de câmbio aplicada.
          content:
            application/json:
              schema:
                type: object
                properties:
                  amount:
                    type: number
                    description: Valor convertido na moeda fiduciária de destino.
                  currency:
                    type: string
                    description: Símbolo da moeda fiat (ex R$).
                  cryptoToFiatExchangeRate:
                    type: string
                    description: Taxa de câmbio utilizada no momento da cotação.
        '401':
          description: Unauthorized. Token JWT inválido, expirado ou ausente.
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

Este endpoint le permite calcular con anticipación cuánto recibirá el cliente en moneda fiduciaria al retirar un monto específico en criptomonedas.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/withdraw/conversion/brl/pix
```

---

## Prueba de integración

Utilice el formulario a continuación para simular la cotización. El sistema obtendrá automáticamente los datos de la criptomoneda y calculará cuánto produciría en moneda fiduciaria.

<GetTetherConversionToFiatTester />

---

## Solicitud

Debe enviar el **encabezado de autenticación** y el cuerpo JSON con el valor y el objeto de moneda.

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Cuerpo (Request Body)

| Campo            | Tipo     | Requerido | Descripción                                                                       |
| :--------------- | :------- | :-------: | :-------------------------------------------------------------------------------- |
| `amount`         | `number` |  **Sí**   | Monto en criptomonedas para el que desea calcular la cotización.                  |
| `cryptocurrency` | `object` |  **Sí**   | El objeto de la criptomoneda, obtenido desde la ruta de listado de criptomonedas. |

---

## Respuestas

### Éxito (200 OK)

Devuelve el valor convertido, la moneda y la tasa de cambio utilizada en ese momento.

```json
{
  "amount": 5.17,
  "currency": "R$",
  "cryptoToFiatExchangeRate": "R$ 5.170"
}
```

### Errores comunes

| Estado  | Mensaje                 | Posible causa                                                                               |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado inválido o faltante.<br />• IP no permitida. |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                           |

---

## Cómo usar

Esta ruta **no genera** una orden de pago; solo sirve para **consulta**.

### Flujo recomendado (UX)

1.  **Entrada:** El usuario escribe "1" (monto en criptomonedas) en su aplicación o sitio.
2.  **Consulta:** Su sistema llama a `POST /withdraw/conversion/brl/pix` enviando el valor 1 en criptomonedas y el objeto de la criptomoneda.
3.  **Visualización:** La API devuelve que esto equivale a `5.17`. Usted muestra: *"Recibirá aproximadamente R$ 5.17"*.
4.  **Acción:** Si el usuario está de acuerdo, llama a la ruta **Crear orden de retiro por conversión de Cripto a FIAT** (`POST /withdraw`).

### Ejemplo práctico

Siga los pasos a continuación para realizar la cotización de Cripto a FIAT.

**Paso 1:** Ingrese la cantidad en criptomonedas para la cotización:
```json {2}
{
    "amount": 1,
    "cryptocurrency": {
        "_id": "6733a2a9******************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "updatedDate": "202******************",
        "createdDate": "202******************",
        "__v": 0
    }
}
```

**Paso 2:** Debe obtener e inyectar el objeto de la criptomoneda dentro de `cryptocurrency`:

```json {3-11}
{
    "amount": 1,
    "cryptocurrency": {
        "_id": "6733a2a9******************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "updatedDate": "202******************",
        "createdDate": "202******************",
        "__v": 0
    }
}
```
Puede obtener la lista de criptomonedas <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">haciendo clic aquí</a>.

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
    const amount = 10.90;

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const cryptocurrencies = await axios.get(`${url_api}/withdraw/company/cryptocurrencies`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/withdraw/conversion/brl/pix`, {
            amount,
            cryptocurrency: cryptocurrencies.data[0]
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
</Tabs>
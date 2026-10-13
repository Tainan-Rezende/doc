---
sidebar_label: 'Cotización y Estimación'
sidebar_position: 4
description: 'Genera una cotización con precio garantizado para la compra o una estimación sin reserva de precio.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Cotización y Estimación

Dos rutas con el mismo cuerpo:

| Ruta                            | Permiso          | Uso                                                                                                                                       |
| :------------------------------ | :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /crypto/quotes`           | `CRYPTO.EXECUTE` | Genera una cotización con `quoteId` y precio **garantizado** durante `quoteTtlSeconds` (30 s), para usar en la compra. Solicitarla y no usarla no cuesta nada. |
| `POST /crypto/quotes/estimate`  | `CRYPTO.VIEW`    | Solo una estimación: no genera `quoteId` y no se reserva nada. Sirve para mostrar el valor aproximado ("≈") antes de comprar.              |

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="Cotización"
https://api.xgateglobal.com/crypto/quotes
```

```bash title="Estimación"
https://api.xgateglobal.com/crypto/quotes/estimate
```

---

## Solicitud

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Cuerpo (Request Body)

| Campo     | Tipo     | Obligatorio | Descripción                                                                                      |
| :-------- | :------- | :---------: | :----------------------------------------------------------------------------------------------- |
| `asset`   | `string` |   **Sí**    | `USDT` o `USDC`.                                                                                 |
| `network` | `string` |   **Sí**    | `POLYGON`, `ETHEREUM`, `TRON` o `SOLANA` (según el activo).                                      |
| `amount`  | `string` |   **Sí**    | Total en BRL que se debitará del saldo, string con 2 decimales (ej.: `"1500.00"`).               |

```json
{
  "asset": "USDT",
  "network": "TRON",
  "amount": "1500.00"
}
```

:::info[La tarifa se cobra en la cripto]
El `amount` es el total en BRL debitado, sin tarifa incluida. La tarifa **nunca se cobra en BRL**: se descuenta de la cantidad cripto entregada.
:::

---

## Respuestas (Responses)

### Éxito

`POST /crypto/quotes` responde **201 Created**:

```json
{
  "quoteId": "l3m8Qm1n0pV2cXk5dY9sTg4hWz7aB6eR1uJ0oK2qF3i",
  "expiresAt": "2026-10-13T14:03:52.114Z",
  "asset": "USDT",
  "network": "TRON",
  "amount": "1500.00",
  "rate": "5.45400000",
  "cryptoAmount": "275.027502",
  "feeAmount": "4.125414",
  "feeAsset": "USDT",
  "networkFee": "0.012000",
  "deliveredAmount": "270.890088"
}
```

`POST /crypto/quotes/estimate` responde **200 OK** con los mismos campos, **sin** `quoteId` ni `expiresAt`, y con `estimatedAt` (fecha de la estimación).

#### Descripción de los campos

| Campo             | Tipo     | Descripción                                                                      |
| :---------------- | :------- | :------------------------------------------------------------------------------- |
| `quoteId`         | `string` | *(Solo cotización)* Identificador para usar en `POST /crypto/purchases`.         |
| `expiresAt`       | `string` | *(Solo cotización)* Hasta cuándo está garantizado el precio.                     |
| `estimatedAt`     | `string` | *(Solo estimación)* Momento de la estimación.                                    |
| `asset`, `network`| `string` | Activo y red cotizados.                                                          |
| `amount`          | `string` | Total en BRL a debitar.                                                          |
| `rate`            | `string` | Precio de 1 unidad del activo en BRL (8 decimales).                              |
| `cryptoAmount`    | `string` | Cantidad bruta comprada (6 decimales).                                           |
| `feeAmount`       | `string` | Tarifa (XGate + referido), en el propio activo.                                  |
| `feeAsset`        | `string` | Activo en el que se cobra la tarifa.                                             |
| `networkFee`      | `string` | Gas de la red, descontado de la entrega.                                         |
| `deliveredAmount` | `string` | Cantidad que llega a la billetera.                                               |

#### Cómo se calcula el valor

```text
cryptoAmount    = amount ÷ rate                        (hacia abajo, 6 decimales)
feeAmount       = tarifa sobre cryptoAmount            (hacia arriba, en el propio activo)
deliveredAmount = cryptoAmount − feeAmount − networkFee
```

### Errores comunes

| Estado  | Reason                                                                                                                                                                  |
| :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`, `AMOUNT_MUST_BE_STRING`                                                                                                                            |
| **401** | `UNAUTHORIZED`                                                                                                                                                          |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`, `BUY_DISABLED`   |
| **422** | `ASSET_NOT_SUPPORTED`, `NETWORK_NOT_SUPPORTED`, `AMOUNT_BELOW_MIN`, `AMOUNT_ABOVE_MAX`, `AMOUNT_TOO_LOW_FOR_NETWORK_FEE`, `PAIR_MARGIN_NOT_CONFIGURED`, `PRICE_UNSTABLE` |
| **429** | `RATE_LIMITED`                                                                                                                                                          |
| **503** | `PRICE_STALE`, `NETWORK_FEE_UNAVAILABLE`, `CONFIGURATION_UNAVAILABLE`, `SERVICE_OVERLOADED`                                                                             |

Consulte el significado de cada código en <a href={useBaseUrl('/docs/buy-sell/errors')}>Códigos de Error</a>.

---

## Integración

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    **Ejemplo en JavaScript:**
    ```js
    const axios = require("axios");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const headers = { "Authorization": `Bearer ${login.data.token}` };
        const body = { asset: "USDT", network: "TRON", amount: "1500.00" }; // amount siempre como string

        // Estimación (no se reserva nada)
        const estimate = await axios.post(`${url_api}/crypto/quotes/estimate`, body, { headers });
        console.log("≈", estimate.data.deliveredAmount, estimate.data.asset);

        // Cotización con precio garantizado durante 30 segundos
        const quote = await axios.post(`${url_api}/crypto/quotes`, body, { headers });
        console.log(quote.data.quoteId, quote.data.expiresAt);
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

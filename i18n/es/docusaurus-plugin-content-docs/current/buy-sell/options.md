---
sidebar_label: 'Opciones'
sidebar_position: 3
description: 'Devuelve lo que la empresa puede hacer ahora: activos, redes, tarifas, límites de compra y direcciones guardadas.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Consultar Opciones

Devuelve lo que su empresa puede hacer ahora: activos y redes habilitados, tarifas, límites de compra, direcciones guardadas y validez de la cotización. Use esta ruta antes de cotizar o comprar.

- **Permiso:** `CRYPTO.VIEW`

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL del Endpoint"
https://api.xgateglobal.com/crypto/options
```

---

## Solicitud

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                                |
| :-------------- | :------------------ | :----------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión.   |

Esta ruta no recibe parámetros.

---

## Respuestas (Responses)

### Éxito (200 OK)

```json
{
  "assets": [
    {
      "asset": "USDT",
      "feeRate": "0.01500000",
      "spreadRate": "0.00800000",
      "networks": [
        { "network": "TRON", "networkFee": "0.012000", "networkFeeAsset": "USDT" },
        { "network": "POLYGON", "networkFee": "0.003000", "networkFeeAsset": "USDT" }
      ]
    },
    {
      "asset": "USDC",
      "feeRate": "0.01500000",
      "spreadRate": "0.00800000",
      "networks": [
        { "network": "SOLANA", "networkFee": "0.002000", "networkFeeAsset": "USDC" }
      ]
    }
  ],
  "buy": {
    "enabled": true,
    "minAmount": "50.00",
    "maxAmountPerTx": "100000.00",
    "dailyCap": "500000.00",
    "dailyRemaining": "498500.00",
    "totpThreshold": null,
    "autoApproval": false,
    "addresses": [
      {
        "addressId": "66f1a2b3c4d5e6f708192a3b",
        "alias": "Billetera de tesorería",
        "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
        "network": "TRON",
        "source": "MANUAL",
        "addedAt": "2026-10-01T12:00:00.000Z",
        "activeAt": "2026-10-01T12:00:00.000Z"
      }
    ]
  },
  "savedAddressesOnly": {
    "enabled": false,
    "newAddressHoldHours": 24
  },
  "quoteTtlSeconds": 30,
  "sale": {
    "enabled": false,
    "status": "DISABLED",
    "minAmount": { "USDT": null, "USDC": null },
    "depositAddresses": []
  }
}
```

#### Descripción de los campos

| Campo                                 | Tipo                       | Descripción                                                                                                                                                  |
| :------------------------------------ | :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets[].asset`                      | `USDT` \| `USDC`           | Activo.                                                                                                                                                      |
| `assets[].feeRate`                    | `string` \| `null`         | Tarifa de compra (XGate + referido) sobre la cantidad cripto. Es la base de `feeAmount`.                                                                     |
| `assets[].spreadRate`                 | `string` \| `null`         | Margen del par incluido en el `rate` (`rate = ask × (1 + spreadRate)`).                                                                                      |
| `assets[].networks[].network`         | `string`                   | Red disponible para el activo (`POLYGON`, `ETHEREUM`, `TRON`, `SOLANA`).                                                                                     |
| `assets[].networks[].networkFee`      | `string` \| `null`         | Gas estimado de la red, en el propio activo (6 decimales), descontado de la entrega. `null` cuando no está disponible o cuando la regla de la empresa es porcentual. |
| `assets[].networks[].networkFeeAsset` | `USDT` \| `USDC`           | Activo en el que se cobra el gas.                                                                                                                            |
| `buy.enabled`                         | `boolean`                  | Compra habilitada para la empresa.                                                                                                                           |
| `buy.minAmount`                       | `string`                   | Compra mínima, en BRL.                                                                                                                                       |
| `buy.maxAmountPerTx`                  | `string` \| `null`         | Máximo por compra, en BRL.                                                                                                                                   |
| `buy.dailyCap`                        | `string` \| `null`         | Tope diario de compra, en BRL.                                                                                                                               |
| `buy.dailyRemaining`                  | `string` \| `null`         | Cuánto resta aún del tope diario, en BRL.                                                                                                                    |
| `buy.totpThreshold`                   | `string` \| `null`         | Se usa solo en el panel. No aplica a la API.                                                                                                                 |
| `buy.autoApproval`                    | `boolean`                  | `true` = la compra no pasa por la cola de aprobación de XGate.                                                                                               |
| `buy.addresses[]`                     | `array`                    | Direcciones guardadas de la empresa: `addressId`, `alias`, `address`, `network`, `source` (`MANUAL` \| `CARD`), `addedAt`, `activeAt`. El `addressId` puede usarse como destino en la compra. |
| `savedAddressesOnly.enabled`          | `boolean`                  | Bloqueo "solo direcciones guardadas", activado por la empresa en el panel.                                                                                   |
| `savedAddressesOnly.newAddressHoldHours` | `integer`               | Período de carencia, en horas, de una dirección nueva cuando el bloqueo está activado (24).                                                                  |
| `quoteTtlSeconds`                     | `integer`                  | Validez de la cotización, en segundos (30).                                                                                                                  |
| `sale`                                | `object`                   | Reservado para la venta de cripto (disponible próximamente).                                                                                                 |

:::tip[Bloqueo de direcciones guardadas]
Con `savedAddressesOnly.enabled = true`, la compra solo acepta direcciones de `buy.addresses[]`, y una dirección recién registrada solo puede usarse después de `activeAt` (carencia de `newAddressHoldHours`).
:::

### Errores comunes

| Estado  | Reason                                                                                                                                  |
| :------ | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`                                                                                                                     |
| **401** | `UNAUTHORIZED`                                                                                                                          |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED` |
| **503** | `CONFIGURATION_UNAVAILABLE`, `SERVICE_OVERLOADED`                                                                                       |

Consulte el significado de cada código en <a href={useBaseUrl('/docs/buy-sell/errors')}>Códigos de Error</a>.

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

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/crypto/options`, {
            headers: { "Authorization": `Bearer ${login.data.token}` }
        });
        console.log(data.assets, data.buy); // Respuesta
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

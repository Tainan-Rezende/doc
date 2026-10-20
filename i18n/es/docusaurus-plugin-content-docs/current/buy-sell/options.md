---
sidebar_label: 'Opciones'
sidebar_position: 3
description: 'Devuelve las operaciones disponibles para la empresa: activos, redes, tarifas, límites de compra, direcciones guardadas y direcciones de venta.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Consultar opciones

Devuelve las operaciones disponibles para su empresa: activos y redes habilitados, tarifas, límites de compra, direcciones guardadas y vigencia de las cotizaciones. Utilice este endpoint antes de solicitar una cotización o realizar una compra.

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/crypto/options
```

---

## Solicitud

#### Encabezados obligatorios

| Encabezado      | Valor                | Descripción                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

Este endpoint no recibe parámetros.

---

## Respuestas

### Correcta (200 OK)

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
        "alias": "Carteira tesouraria",
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

<div className="tabela-nowrap">
| Campo                                    | Tipo               | Descripción                                                                                                                                                                                                        |
| :--------------------------------------- | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets[].asset`                         | `USDT` \| `USDC`   | Activo. |
| `assets[].feeRate`                       | `string` \| `null` | Tarifa de compra (XGate + comisión por referido) aplicada sobre la cantidad de cripto. Es la base de `feeAmount`. |
| `assets[].spreadRate`                    | `string` \| `null` | Margen del par incluido en `rate` (`rate = ask × (1 + spreadRate)`). |
| `assets[].networks[].network`            | `string`           | Red disponible para el activo (`POLYGON`, `ETHEREUM`, `TRON`, `SOLANA`). |
| `assets[].networks[].networkFee`         | `string` \| `null` | Gas de red estimado, expresado en el propio activo (6 decimales) y descontado del importe entregado. `null` cuando no está disponible o cuando la regla de tarifas de la empresa es porcentual. |
| `assets[].networks[].networkFeeAsset`    | `USDT` \| `USDC`   | Activo en el que se cobra el gas. |
| `buy.enabled`                            | `boolean`          | Indica si las compras están habilitadas para la empresa. |
| `buy.minAmount`                          | `string`           | Importe mínimo de compra en BRL. |
| `buy.maxAmountPerTx`                     | `string` \| `null` | Importe máximo por compra, en BRL. |
| `buy.dailyCap`                           | `string` \| `null` | Límite diario de compra, en BRL. |
| `buy.dailyRemaining`                     | `string` \| `null` | Importe restante del límite diario, en BRL. |
| `buy.totpThreshold`                      | `string` \| `null` | Se utiliza únicamente en el Dashboard. No se aplica a la API. |
| `buy.autoApproval`                       | `boolean`          | `true` = la compra no pasa por la cola de aprobación de XGate. |
| `buy.addresses[]`                        | `array`            | Direcciones guardadas de la empresa: `addressId`, `alias`, `address`, `network`, `source` (`MANUAL` \| `CARD`), `addedAt`, `activeAt`. Se puede utilizar `addressId` como destino de la compra. |
| `savedAddressesOnly.enabled`             | `boolean`          | Restricción «solo direcciones guardadas», habilitada por la empresa en el Dashboard. |
| `savedAddressesOnly.newAddressHoldHours` | `integer`          | Período de espera, en horas, para una dirección nueva cuando la restricción está habilitada (24). |
| `quoteTtlSeconds`                        | `integer`          | Vigencia de la cotización, en segundos (30). |
| `sale.enabled`                           | `boolean`          | Indica si XGate habilitó las ventas para la empresa. |
| `sale.status`                            | `string`           | `DISABLED` · `PROVISIONING` · `READY`. La primera consulta de una empresa con las ventas habilitadas inicia la creación de las direcciones: el estado permanece en `PROVISIONING` durante unos minutos y luego pasa a `READY`. |
| `sale.minAmount`                         | `object`           | Importe mínimo de venta por activo (`USDT`, `USDC`), expresado en el activo correspondiente. |
| `sale.depositAddresses[]`                | `array`            | Dirección fija de la empresa para cada par `asset` × `network` (`asset`, `network`, `address`). Está vacío mientras `sale.enabled` sea `false`. Consulte <a href={useBaseUrl('/docs/buy-sell/sales/sell')}>Vender cripto</a>. |
</div>

:::tip[Restricción de direcciones guardadas]
Cuando `savedAddressesOnly.enabled = true`, las compras solo aceptan direcciones de `buy.addresses[]`, y una dirección recién agregada solo se puede utilizar después de `activeAt` (el período de espera indicado por `newAddressHoldHours`).
:::

### Errores comunes

| Status  | Reason                                                                                                                                                |
| :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`                                                                                                                                   |
| **401** | `UNAUTHORIZED`                                                                                                                                        |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED` |
| **503** | `CONFIGURATION_UNAVAILABLE`, `SERVICE_OVERLOADED`                                                                                                     |

Consulte el significado de cada código en <a href={useBaseUrl('/docs/buy-sell/errors')}>Códigos de error</a>.

---

## Integración

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    Este ejemplo de integración utiliza la biblioteca <code>Axios</code> en Node.js.

    **Instalación de `Axios`:**
    ```bash
    npm install axios
    ```

    **Ejemplo de JavaScript:**
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
        console.log(data.assets, data.buy); // Response
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

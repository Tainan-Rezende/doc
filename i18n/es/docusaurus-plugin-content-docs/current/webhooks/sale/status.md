---
sidebar_label: 'Consultar Venta'
sidebar_position: 1
description: 'Consulta una venta de cripto por el ID.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Consultar Venta

Consulta una venta de cripto por el ID. Cada envío confirmado a la dirección fija de la empresa se convierte en una venta (vea <a href={useBaseUrl('/docs/buy-sell/sales/sell')}>Vender Cripto</a>); el `id` llega en el <a href={useBaseUrl('/docs/webhooks/sale/receive')}>webhook de venta</a>.

:::note[Disponible en noviembre de 2026]
La venta de cripto por la API estará disponible en noviembre de 2026.
:::

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL del Endpoint"
https://api.xgateglobal.com/crypto/sales/{id}
```

---

## Solicitud

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Path

| Parámetro | Tipo     | Descripción       |
| :-------- | :------- | :---------------- |
| `id`      | `string` | ID de la venta.   |

---

## Respuestas

### Éxito (200 OK)

```json
{
  "id": "6711c0e5a1b2c3d4e5f60718",
  "status": "SETTLED",
  "asset": "USDT",
  "network": "TRON",
  "depositAddress": "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
  "sourceAddress": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
  "txHash": "9f2c1e0b7a6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b3a2918070f6e5d4c",
  "cryptoAmount": "1000.000000",
  "rate": "5.41000000",
  "netCryptoAmount": "990.000000",
  "grossAmount": "5355.90",
  "feeAmount": "10.000000",
  "feeAsset": "USDT",
  "netAmount": "5355.90",
  "settlement": { "type": "BALANCE", "beneficiaryId": null, "withdrawId": null, "fallbackReason": null },
  "review": null,
  "receivedAt": "2026-11-13T14:03:22.114Z",
  "settledAt": "2026-11-13T14:03:24.870Z",
  "createdAt": "2026-11-13T14:03:22.114Z",
  "updatedAt": "2026-11-13T14:03:24.870Z"
}
```

### Objeto de la venta {#sale-object}

El mismo objeto se envía en el campo `data` de los <a href={useBaseUrl('/docs/webhooks/sale/receive')}>webhooks de venta</a>.

| Campo                      | Tipo               | Descripción                                                                                                                                                                     |
| :------------------------- | :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                       | `string`           | ID de la venta.                                                                                                                                                                 |
| `status`                   | `string`           | `RECEIVED` (recibida y confirmada, a la espera de precio) · `SETTLING` (precio congelado, acreditación en curso) · `SETTLED` (liquidada por la forma configurada; final) · `SETTLED_TO_BALANCE` (era Pix, se acreditó en el saldo; final). |
| `asset`, `network`         | `string`           | Activo y red.                                                                                                                                                                   |
| `depositAddress`           | `string`           | Dirección fija de la empresa que recibió.                                                                                                                                       |
| `sourceAddress`            | `string` \| `null` | Desde dónde salió la cripto, cuando la red lo informa.                                                                                                                          |
| `txHash`                   | `string` \| `null` | Hash on-chain del envío. Úselo para conciliar.                                                                                                                                  |
| `cryptoAmount`             | `string`           | Cantidad recibida (6 decimales).                                                                                                                                                |
| `rate`                     | `string` \| `null` | Precio en BRL por unidad (8 decimales), congelado en la liquidación.                                                                                                            |
| `feeAmount`, `feeAsset`    | `string` \| `null` | Tarifa en cripto sobre `cryptoAmount`.                                                                                                                                          |
| `netCryptoAmount`          | `string` \| `null` | `cryptoAmount − feeAmount`.                                                                                                                                                     |
| `grossAmount`, `netAmount` | `string` \| `null` | Monto acreditado en BRL (`netCryptoAmount × rate`, redondeado hacia abajo). Hoy son iguales.                                                                                    |
| `settlement`               | `object`           | `type` (`BALANCE` \| `PIX_KEY`), `beneficiaryId`, `withdrawId` (retiro Pix creado), `fallbackReason` (`PIX_SETTLEMENT_UNAVAILABLE` · `BENEFICIARY_NOT_ELIGIBLE` · `PAYOUT_REJECTED` · `PAYOUT_FAILED` · `PAYOUT_UNAVAILABLE` · `null`). |
| `review`                   | `object` \| `null` | Venta en análisis de XGate. `reason`: `BELOW_MINIMUM` · `COMPANY_UNAVAILABLE` · `COMPANY_BLOCKED` · `SELL_POLICY_MISSING` · `NET_NOT_POSITIVE` · `CONFIRMATIONS_TIMEOUT` · `CREDIT_REVIEW`. |
| `receivedAt`, `settledAt`, `createdAt`, `updatedAt` | `string` | Fechas ISO 8601 (UTC). `updatedAt` y `status` ordenan los webhooks que llegan fuera de orden.                                                          |

### Errores Comunes

| Status  | Reason                                                                        |
| :------ | :---------------------------------------------------------------------------- |
| **401** | `UNAUTHORIZED`                                                                |
| **403** | `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`            |
| **404** | `SALE_NOT_FOUND`: ID inexistente, con formato inválido o de otra empresa.     |

Vea el significado de cada código en <a href={useBaseUrl('/docs/buy-sell/errors')}>Códigos de Error</a>.

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
    const saleId = "6711c0e5a1b2c3d4e5f60718";

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/crypto/sales/${saleId}`, {
            headers: { "Authorization": `Bearer ${login.data.token}` }
        });
        console.log(data.status, data.txHash, data.netAmount, data.settlement.type); // Response
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

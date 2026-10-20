---
sidebar_label: 'Comprar cripto'
sidebar_position: 1
description: 'Compra USDT o USDC con el saldo en BRL de la empresa y envía las criptomonedas a la billetera de destino de la empresa.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Comprar cripto

Compra USDT o USDC con el saldo en BRL de la empresa. XGate envía las criptomonedas a la billetera de destino indicada, que debe pertenecer **a la propia empresa**.

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/crypto/purchases
```

---

## Solicitud

#### Encabezados obligatorios

| Encabezado | Valor | Descripción |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Modalidades de compra

Hay dos modalidades. **No mezcle los campos** de una con los de la otra.

<Tabs>
  <TabItem value="quote" label="Con cotización" default>
  Usa el precio garantizado de una <a href={useBaseUrl('/docs/buy-sell/quotes')}>cotización</a> (`quoteId`) que aún esté vigente. El activo, la red y el monto se obtienen de la cotización.

```json
{
  "externalId": "pedido-7781",
  "quoteId": "l3m8Qm1n0pV2cXk5dY9sTg4hWz7aB6eR1uJ0oK2qF3i",
  "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
}
```
  </TabItem>
  <TabItem value="market" label="A precio de mercado">
  Compra al precio disponible en el momento de la ejecución. `asset`, `network` y `amount` son obligatorios.

```json
{
  "externalId": "pedido-7782",
  "asset": "USDT",
  "network": "TRON",
  "amount": "1500.00",
  "addressId": "66f1a2b3c4d5e6f708192a3b"
}
```
  </TabItem>
</Tabs>

#### Cuerpo de la solicitud

| Campo | Tipo | Obligatorio | Descripción |
| :--------------------------- | :------- | :---------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `externalId` | `string` | **Sí** | Identificador de la compra en su sistema. De 1 a 128 caracteres ASCII imprimibles; no puede contener `/` ni comenzar con `$`. Debe ser único por empresa. |
| `address` | `string` | **Uno de los dos** | Billetera de destino declarada por la empresa, válida en la red y sin memo/tag. |
| `addressId` | `string` | **Uno de los dos** | Dirección guardada (`buy.addresses[].addressId` de <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a>). |
| `quoteId` | `string` | Modalidad con cotización | Cotización vigente. No se puede enviar junto con `asset`, `network` o `amount` (`400 CONFLICTING_FIELDS`). |
| `asset`, `network`, `amount` | `string` | Modalidad a precio de mercado | Activo, red y monto total en BRL (cadena con 2 decimales). Los tres campos son obligatorios si no se proporciona `quoteId`. |

:::tip[Idempotencia con externalId]
- El mismo `externalId` + el mismo cuerpo → **200 OK** con la compra ya creada (no se crea una compra nueva).
- El mismo `externalId` + un cuerpo diferente → `409 EXTERNAL_ID_CONFLICT`.
- Una compra rechazada queda registrada con el `externalId` utilizado. Para volver a intentarlo, **use otro `externalId`**.
:::

---

## Respuestas

### Correcta (201 Created)

La respuesta se devuelve después de fijar el precio y el débito en BRL (estado `EXECUTING`).

```json
{
  "id": "6710c2f4a1b2c3d4e5f60718",
  "externalId": "pedido-7781",
  "status": "EXECUTING",
  "channel": "API",
  "asset": "USDT",
  "network": "TRON",
  "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
  "amount": "1500.00",
  "rate": "5.45400000",
  "cryptoAmount": "275.027502",
  "feeAmount": "4.125414",
  "feeAsset": "USDT",
  "networkFee": "0.012000",
  "deliveredAmount": "270.890088",
  "quoteId": "l3m8Qm1n0pV2cXk5dY9sTg4hWz7aB6eR1uJ0oK2qF3i",
  "depositId": null,
  "approval": { "required": true, "decision": null, "decidedAt": null },
  "delivery": { "status": "WAITING_APPROVAL", "txHash": null, "confirmedAt": null },
  "rejection": null,
  "executedAt": "2026-10-13T14:03:40.512Z",
  "createdAt": "2026-10-13T14:03:40.204Z",
  "updatedAt": "2026-10-13T14:03:40.512Z"
}
```

### Ciclo de vida

```text
EXECUTING ──► PENDING_APPROVAL ──► DELIVERED
    │                │
    └────────────────┴──────────► REJECTED
```

- **Sin aprobación automática** (`buy.autoApproval = false`): la compra entra en la cola de aprobación de XGate (`PENDING_APPROVAL`). El precio ya está fijado y no cambiará.
- **Con aprobación automática:** la compra continúa directamente hasta `DELIVERED`.
- En `DELIVERED`, `delivery.txHash` contiene el hash de la transacción en la red.
- En `REJECTED`, `rejection.refunded = true` indica que el importe total en BRL, incluidas las tarifas, se devolvió al saldo.

Haga el seguimiento mediante <a href={useBaseUrl('/docs/webhooks/purchase/status')}>Consultar compra</a> o los <a href={useBaseUrl('/docs/webhooks/purchase/receive')}>webhooks de compra</a> (pestaña Webhooks › Webhook de compra de cripto).

:::info[Seguridad de la API]
La API no utiliza un código de autenticación (TOTP). La protección se basa en el token, la lista de IP permitidas y la cola de aprobación de XGate.
:::

### Objeto de compra {#purchase-object}

Consultar compra devuelve el mismo objeto; el webhook solo incluye un resumen.

| Campo | Tipo | Descripción |
| :----------------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `id` | `string` | ID de la compra en XGate. |
| `externalId` | `string` | ID de la compra en su sistema. |
| `status` | `string` | `PENDING_PAYMENT` · `EXECUTING` · `PENDING_APPROVAL` · `DELIVERED` · `REJECTED` · `EXPIRED`. |
| `channel` | `string` | Origen de la compra: `API`, `DASHBOARD` o `DEPOSIT`. |
| `asset`, `network`, `address` | `string` | Destino de las criptomonedas. |
| `amount` | `string` \| `null` | Importe total en BRL debitado del saldo. |
| `rate` | `string` \| `null` | Precio de una unidad en BRL (8 decimales), fijado en `executedAt`. |
| `cryptoAmount` | `string` \| `null` | `amount ÷ rate` (6 decimales). |
| `feeAmount`, `feeAsset` | `string` \| `null` | Tarifa de XGate más la comisión por referido, cobrada en cripto (`feeAsset` = el activo). |
| `networkFee` | `string` \| `null` | Gas de red descontado del importe entregado. |
| `deliveredAmount` | `string` \| `null` | Cantidad que se recibe en la billetera. |
| `quoteId` | `string` \| `null` | Cotización utilizada. `null` en una compra a precio de mercado. |
| `depositId` | `string` \| `null` | Depósito de origen, cuando `channel = DEPOSIT`. |
| `approval` | `object` | `required` (`boolean`), `decision` (`APPROVED` \| `REJECTED` \| `AUTO` \| `null`), `decidedAt`. |
| `delivery` | `object` | `status` (`WAITING_APPROVAL` · `QUEUED` · `SUBMITTED` · `CONFIRMING` · `CONFIRMED` · `UNDER_REVIEW` · `null`), `txHash`, `confirmedAt`. |
| `rejection` | `object` \| `null` | En `REJECTED`: `reason` (consulte <a href={useBaseUrl('/docs/buy-sell/errors#rejection-reasons')}>los motivos de rechazo</a>), `message` (en el idioma indicado por `Accept-Language`), `refunded`. |
| `executedAt`, `createdAt`, `updatedAt` | `string` | Fechas ISO 8601 (UTC). |

### Errores comunes

| Estado  | Motivo                                                                                                                                                                                                                                                                       |
| :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`, `AMOUNT_MUST_BE_STRING`, `CONFLICTING_FIELDS`                                                                                                                                                                                                           |
| **401** | `UNAUTHORIZED`                                                                                                                                                                                                                                                               |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`, `BUY_DISABLED`                                                                                                        |
| **404** | `SAVED_ADDRESS_NOT_FOUND`, `QUOTE_NOT_FOUND`                                                                                                                                                                                                                                 |
| **409** | `EXTERNAL_ID_CONFLICT`, `QUOTE_EXPIRED`, `QUOTE_ALREADY_USED`                                                                                                                                                                                                                |
| **422** | `ASSET_NOT_SUPPORTED`, `NETWORK_NOT_SUPPORTED`, `PAIR_MARGIN_NOT_CONFIGURED`, `AMOUNT_BELOW_MIN`, `AMOUNT_ABOVE_MAX`, `ADDRESS_INVALID_FOR_NETWORK`, `ADDRESS_NOT_SAVED`, `ADDRESS_ON_HOLD`, `SAVED_ADDRESS_NETWORK_MISMATCH`, `AMOUNT_TOO_LOW_FOR_NETWORK_FEE`, `INSUFFICIENT_BALANCE`, `PRICE_UNSTABLE` |
| **429** | `RATE_LIMITED`, `DAILY_CAP_EXCEEDED`, `OUTFLOW_HOURLY_CAP_EXCEEDED`                                                                                                                                                                                                          |
| **503** | `PRICE_STALE`, `NETWORK_FEE_UNAVAILABLE`, `CRYPTO_TEMPORARILY_UNAVAILABLE`, `CONFIGURATION_UNAVAILABLE`, `SERVICE_OVERLOADED`                                                                                                                                                |

:::warning[Rechazo durante la ejecución]
Si la compra se rechaza durante la ejecución (por saldo insuficiente, límites, precio o cotización vencida), la API devuelve un error **y** registra la compra como `REJECTED` con el `externalId` utilizado. En este caso, se envía el webhook `purchase.rejected`.
:::

Consulte el significado de cada código en <a href={useBaseUrl('/docs/buy-sell/errors')}>Códigos de error</a>.

---

## Integración

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    **Ejemplo de JavaScript (cotización + compra):**
    ```js
    const axios = require("axios");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const headers = { "Authorization": `Bearer ${login.data.token}` };

        // 1. Cotar (preço garantido por 30 segundos)
        const quote = await axios.post(`${url_api}/crypto/quotes`, {
            asset: "USDT",
            network: "TRON",
            amount: "1500.00" // sempre string
        }, { headers });

        // 2. Comprar com a cotação
        const { data } = await axios.post(`${url_api}/crypto/purchases`, {
            externalId: "pedido-7781",
            quoteId: quote.data.quoteId,
            address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
        }, { headers });

        console.log(data.id, data.status); // EXECUTING
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

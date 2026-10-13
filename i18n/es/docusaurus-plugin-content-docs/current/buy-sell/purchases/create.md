---
sidebar_label: 'Comprar Cripto'
sidebar_position: 1
description: 'Compra USDT o USDC con el saldo en BRL de la empresa y envía la cripto a la billetera de destino de la empresa.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Comprar Cripto

Compra USDT o USDC usando el saldo en BRL de la empresa. XGate envía la cripto a la billetera de destino indicada, que debe ser **de la propia empresa**.

- **Permiso:** `CRYPTO.EXECUTE`

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del Endpoint"
https://api.xgateglobal.com/crypto/purchases
```

---

## Solicitud

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Formas de compra

Existen dos formas. **No mezcle los campos** de una con los de la otra.

<Tabs>
  <TabItem value="quote" label="Con cotización" default>
  Usa el precio garantizado de una <a href={useBaseUrl('/docs/buy-sell/quotes')}>cotización</a> (`quoteId`) aún válida. El activo, la red y el monto provienen de la cotización.

```json
{
  "externalId": "pedido-7781",
  "quoteId": "l3m8Qm1n0pV2cXk5dY9sTg4hWz7aB6eR1uJ0oK2qF3i",
  "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
}
```
  </TabItem>
  <TabItem value="market" label="A mercado">
  Compra al precio del instante de la ejecución. `asset`, `network` y `amount` son obligatorios.

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

#### Cuerpo (request body)

| Campo                        | Tipo     | Obligatorio | Descripción                                                                                                                                                                     |
| :--------------------------- | :------- | :---------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `externalId`                 | `string` |   **Sí**    | Identificador de la compra en su sistema. De 1 a 128 caracteres ASCII imprimibles, sin `/` y sin comenzar con `$`. Único por empresa.                                           |
| `address`                    | `string` |  **Uno de los dos**  | Billetera de destino declarada de la empresa, válida en la red, sin memo/tag.                                                                                          |
| `addressId`                  | `string` |  **Uno de los dos**  | Dirección guardada (`buy.addresses[].addressId` de <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a>).                                            |
| `quoteId`                    | `string` |   Forma con cotización   | Cotización válida. No puede enviarse junto con `asset`, `network` o `amount` (`400 CONFLICTING_FIELDS`).                                                         |
| `asset`, `network`, `amount` | `string` |   Forma a mercado     | Activo, red y total en BRL (string con 2 decimales). Los tres son obligatorios cuando no hay `quoteId`.                                                                 |

:::tip[Idempotencia por el externalId]
- Mismo `externalId` + mismo cuerpo → **200 OK** con la compra ya creada (ninguna compra nueva).
- Mismo `externalId` + cuerpo diferente → `409 EXTERNAL_ID_CONFLICT`.
- Una compra rechazada queda registrada con el `externalId`. Para intentarlo de nuevo, **use otro `externalId`**.
:::

---

## Respuestas

### Éxito (201 Created)

La respuesta llega después de que el precio y el débito del BRL fueron fijados (status `EXECUTING`).

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

- **Sin aprobación automática** (`buy.autoApproval = false`): la compra entra en la cola de aprobación de XGate (`PENDING_APPROVAL`). El precio ya está fijado y no cambia.
- **Con aprobación automática:** la compra avanza directamente hasta `DELIVERED`.
- En `DELIVERED`, `delivery.txHash` trae el hash de la transacción en la red.
- En `REJECTED`, `rejection.refunded = true` indica que el BRL volvió íntegramente al saldo, comisión incluida.

Haga el seguimiento mediante <a href={useBaseUrl('/docs/buy-sell/purchases/list')}>GET /crypto/purchases/&#123;id&#125;</a> o mediante los <a href={useBaseUrl('/docs/buy-sell/webhooks')}>webhooks de compra</a>.

:::info[Seguridad en la API]
En la API no hay código del autenticador (TOTP). La protección es el token, la lista de IPs permitidas y la cola de aprobación de XGate.
:::

### Objeto de la compra {#purchase-object}

El mismo objeto se devuelve en la consulta y se envía en el campo `data` de los webhooks.

| Campo                    | Tipo               | Descripción                                                                                                                                     |
| :----------------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                     | `string`           | ID de la compra en XGate.                                                                                                                       |
| `externalId`             | `string`           | ID de la compra en su sistema.                                                                                                                  |
| `status`                 | `string`           | `PENDING_PAYMENT` · `EXECUTING` · `PENDING_APPROVAL` · `DELIVERED` · `REJECTED` · `EXPIRED`.                                                    |
| `channel`                | `string`           | Origen de la compra: `API`, `DASHBOARD` o `DEPOSIT`.                                                                                            |
| `asset`, `network`, `address` | `string`      | Destino de la cripto.                                                                                                                           |
| `amount`                 | `string` \| `null` | Total en BRL debitado del saldo.                                                                                                                |
| `rate`                   | `string` \| `null` | Precio de 1 unidad en BRL (8 decimales), fijado en `executedAt`.                                                                                |
| `cryptoAmount`           | `string` \| `null` | `amount ÷ rate` (6 decimales).                                                                                                                  |
| `feeAmount`, `feeAsset`  | `string` \| `null` | Comisión de XGate + referido, cobrada en cripto (`feeAsset` = el activo).                                                                       |
| `networkFee`             | `string` \| `null` | Gas descontado de la entrega.                                                                                                                   |
| `deliveredAmount`        | `string` \| `null` | Cantidad que llega a la billetera.                                                                                                              |
| `quoteId`                | `string` \| `null` | Cotización utilizada. `null` en la compra a mercado.                                                                                            |
| `depositId`              | `string` \| `null` | Depósito de origen, cuando `channel = DEPOSIT`.                                                                                                 |
| `approval`               | `object`           | `required` (`boolean`), `decision` (`APPROVED` \| `REJECTED` \| `AUTO` \| `null`), `decidedAt`.                                                 |
| `delivery`               | `object`           | `status` (`WAITING_APPROVAL` · `QUEUED` · `SUBMITTED` · `CONFIRMING` · `CONFIRMED` · `UNDER_REVIEW` · `null`), `txHash`, `confirmedAt`.         |
| `rejection`              | `object` \| `null` | En `REJECTED`: `reason` (consulte los <a href={useBaseUrl('/docs/buy-sell/errors#rejection-reasons')}>motivos de rechazo</a>), `message` (en el idioma del `Accept-Language`), `refunded`. |
| `executedAt`, `createdAt`, `updatedAt` | `string` | Fechas ISO 8601 (UTC).                                                                                                                 |

### Errores comunes

| Status  | Reason                                                                                                                                                                                                                                                                       |
| :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`, `AMOUNT_MUST_BE_STRING`, `CONFLICTING_FIELDS`                                                                                                                                                                                                           |
| **401** | `UNAUTHORIZED`                                                                                                                                                                                                                                                               |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`, `BUY_DISABLED`                                                                                                        |
| **404** | `SAVED_ADDRESS_NOT_FOUND`, `QUOTE_NOT_FOUND`                                                                                                                                                                                                                                 |
| **409** | `EXTERNAL_ID_CONFLICT`, `QUOTE_EXPIRED`, `QUOTE_ALREADY_USED`                                                                                                                                                                                                                |
| **422** | `ASSET_NOT_SUPPORTED`, `NETWORK_NOT_SUPPORTED`, `PAIR_MARGIN_NOT_CONFIGURED`, `AMOUNT_BELOW_MIN`, `AMOUNT_ABOVE_MAX`, `ADDRESS_INVALID_FOR_NETWORK`, `ADDRESS_NOT_SAVED`, `ADDRESS_ON_HOLD`, `SAVED_ADDRESS_NETWORK_MISMATCH`, `AMOUNT_TOO_LOW_FOR_NETWORK_FEE`, `INSUFFICIENT_BALANCE`, `PRICE_UNSTABLE` |
| **429** | `RATE_LIMITED`, `DAILY_CAP_EXCEEDED`, `OUTFLOW_HOURLY_CAP_EXCEEDED`                                                                                                                                                                                                          |
| **503** | `PRICE_STALE`, `NETWORK_FEE_UNAVAILABLE`, `CRYPTO_TEMPORARILY_UNAVAILABLE`, `CONFIGURATION_UNAVAILABLE`, `SERVICE_OVERLOADED`                                                                                                                                                |

:::warning[Rechazo en la ejecución]
Cuando la compra es rechazada en la ejecución (saldo insuficiente, límites, precio, cotización vencida), la API responde con el error **y** la compra queda registrada como `REJECTED`, con el `externalId` utilizado. En ese caso se envía el webhook `purchase.rejected`.
:::

Consulte el significado de cada código en <a href={useBaseUrl('/docs/buy-sell/errors')}>Códigos de Error</a>.

---

## Integración

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    **Ejemplo en JavaScript (cotización + compra):**
    ```js
    const axios = require("axios");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const headers = { "Authorization": `Bearer ${login.data.token}` };

        // 1. Cotizar (precio garantizado por 30 segundos)
        const quote = await axios.post(`${url_api}/crypto/quotes`, {
            asset: "USDT",
            network: "TRON",
            amount: "1500.00" // siempre string
        }, { headers });

        // 2. Comprar con la cotización
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

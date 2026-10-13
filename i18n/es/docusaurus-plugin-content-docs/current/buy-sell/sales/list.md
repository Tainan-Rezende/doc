---
draft: true
sidebar_label: 'Consultar ventas'
sidebar_position: 2
description: 'Lista las ventas de cripto de la empresa, consulta una venta por ID y genera el comprobante.'
sidebar_class_name: 'sidebar-method-get'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Consultar ventas

- **Permiso:** `CRYPTO.VIEW`

---

## Endpoints
- **Método:** <span className="badge badge--success">GET</span>

| Ruta                                  | Descripción                                   |
| :------------------------------------ | :-------------------------------------------- |
| `GET /crypto/sales`                   | Lista las ventas, de la más reciente a la más antigua. |
| `GET /crypto/sales/{id}`              | Consulta una venta.                           |
| `GET /crypto/sales/{id}/receipt`      | Comprobante en HTML.                          |

```bash title="URL del endpoint"
https://api.xgateglobal.com/crypto/sales
```

---

## Listar ventas

#### Query

| Parámetro    | Tipo      | Descripción                                        |
| :----------- | :-------- | :------------------------------------------------- |
| `status`     | `string`  | `RECEIVED`, `SETTLING`, `SETTLED`, `SETTLED_TO_BALANCE`. |
| `asset`      | `string`  | `USDT` o `USDC`.                                   |
| `network`    | `string`  | Red.                                               |
| `txHash`     | `string`  | Búsqueda exacta por el hash on-chain.              |
| `from`, `to` | `string`  | Intervalo inclusivo en `createdAt` (ISO 8601).     |
| `cursor`     | `string`  | `nextCursor` de la página anterior.                |
| `limit`      | `integer` | 1 a 100. Predeterminado: 20.                       |

#### Respuesta (200 OK)

```json
{
  "items": [
    {
      "id": "6720a1b2c3d4e5f607182930",
      "status": "SETTLED",
      "asset": "USDT",
      "network": "TRON",
      "depositAddress": "TXg8u3…",
      "sourceAddress": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
      "txHash": "4b7e0c2d9a…",
      "cryptoAmount": "500.000000",
      "rate": "5.39800000",
      "feeAmount": "7.500000",
      "feeAsset": "USDT",
      "netCryptoAmount": "492.500000",
      "grossAmount": "2658.51",
      "netAmount": "2658.51",
      "settlement": { "type": "BALANCE", "beneficiaryId": null, "withdrawId": null, "fallbackReason": null },
      "review": null,
      "receivedAt": "2026-11-10T13:00:12.000Z",
      "settledAt": "2026-11-10T13:00:45.000Z",
      "createdAt": "2026-11-10T13:00:12.000Z",
      "updatedAt": "2026-11-10T13:00:45.000Z"
    }
  ],
  "nextCursor": null
}
```

La descripción de cada campo está en <a href={useBaseUrl('/docs/buy-sell/sales/sell#sale-object')}>Objeto de la venta</a>.

---

## Consultar una venta

`GET /crypto/sales/{id}` devuelve el objeto de la venta. ID inexistente o de otra empresa → `404 SALE_NOT_FOUND`.

---

## Comprobante

`GET /crypto/sales/{id}/receipt` devuelve `{ "htmlTemplate": "<html>…" }`, solo para ventas `SETTLED` o `SETTLED_TO_BALANCE`; antes de eso, `409 RECEIPT_NOT_AVAILABLE`. En la venta liquidada por Pix, el comprobante incluye el beneficiario, la clave enmascarada, el ID del retiro y el E2E. Idioma según `Accept-Language` (`pt-BR` predeterminado, `en`).

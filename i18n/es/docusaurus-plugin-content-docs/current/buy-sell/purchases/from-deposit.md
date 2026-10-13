---
draft: true
sidebar_label: 'Compra a partir del Depósito'
sidebar_position: 4
description: 'Genera un depósito Pix en BRL que, al ser pagado, dispara automáticamente una compra de cripto en nombre de la empresa.'
sidebar_class_name: 'sidebar-method-post'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Compra a partir del Depósito

Puente de migración para quienes hoy usan el depósito con conversión. Al enviar el bloque `purchase` en el <a href={useBaseUrl('/docs/fiat/deposit/create')}>POST /deposit</a>, XGate genera el Pix en BRL y, cuando se paga, compra USDT/USDC **en nombre de la empresa, con su propio saldo**, enviando la cripto a la billetera indicada.

:::info[Disponibilidad]
Disponible solo por el canal API y únicamente cuando XGate habilite el recurso para su empresa.
:::

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del Endpoint"
https://api.xgateglobal.com/deposit
```

---

## Solicitud

El cuerpo es el mismo del depósito Pix, con `externalId` **obligatorio** y el bloque `purchase`:

```json
{
  "amount": "150.00",
  "customerId": "696d1f3331117************",
  "currency": { "_id": "6722ba**************", "name": "BRL", "type": "PIX", "symbol": "R$" },
  "externalId": "pedido-7781",
  "purchase": {
    "asset": "USDT",
    "network": "TRON",
    "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
  }
}
```

| Campo              | Tipo     | Obligatorio | Descripción                                                       |
| :----------------- | :------- | :---------: | :---------------------------------------------------------------- |
| `externalId`       | `string` |   **Sí**    | Obligatorio cuando hay `purchase`.                                |
| `amount`           | `string` |   **Sí**    | Monto en BRL con 2 decimales.                                     |
| `purchase.asset`   | `string` |   **Sí**    | `USDT` o `USDC`.                                                  |
| `purchase.network` | `string` |   **Sí**    | Red de entrega.                                                   |
| `purchase.address` | `string` |   **Sí**    | Billetera de destino declarada de la empresa.                     |

Antes de generar el Pix, XGate valida el activo, la red, la dirección, los límites y la habilitación de la compra. Cualquier rechazo responde con el error **y el depósito no se crea**.

---

## Respuesta (201 Created)

Igual a la del depósito Pix, más `data.purchase`:

```json
{
  "message": "Pix Gerado com Sucesso",
  "data": {
    "status": "WAITING_PAYMENT",
    "code": "00020126850014br.gov.bcb.pix2563pi**********",
    "id": "696e28a43e09**************",
    "customerId": "68e7b8f0db**************",
    "externalId": "pedido-7781",
    "purchase": { "id": "6710c2f4a1b2c3d4e5f60718", "status": "PENDING_PAYMENT" }
  }
}
```

---

## Flujo

1. `POST /deposit` con `purchase` → respuesta `201` con el Pix y `data.purchase` en `PENDING_PAYMENT`. Webhook `purchase.pending_payment`.
2. El pagador paga el Pix. El depósito pasa a `PAID` (webhook de depósito `CURRENCY`) y el BRL neto ingresa al saldo de la empresa.
3. La compra se ejecuta al precio de mercado del momento (`EXECUTING`, webhook `purchase.executing`), pasa por la cola de aprobación cuando la empresa no tiene aprobación automática (`PENDING_APPROVAL`) y termina en `DELIVERED` con `delivery.txHash`, o en `REJECTED` con el BRL devuelto al saldo.
4. Si el Pix no se paga dentro del plazo, la compra pasa a `EXPIRED` (webhook `purchase.expired`). El depósito sigue siendo un depósito normal.

La compra tiene `channel = DEPOSIT` y `depositId` completado. El pagador del Pix no compra nada: la titularidad y el tipo de pagador son reglas del Pix, independientes de la compra.

:::warning[Dos flujos de webhook]
Una compra a partir del depósito genera **dos flujos separados**: el webhook del depósito Pix (`CURRENCY`) y los eventos `purchase.*` (`CRYPTO_PURCHASE`). No existe un webhook combinado.
:::

### Eventos adicionales

| Evento (`type`)            | Status             | Cuándo                                         |
| :------------------------- | :----------------- | :--------------------------------------------- |
| `purchase.pending_payment` | `PENDING_PAYMENT`  | Compra creada, a la espera del pago del Pix.   |
| `purchase.expired`         | `EXPIRED`          | Pix no pagado dentro del plazo. **Final.**     |

---

## Errores

| Status  | Reason                                                                                                         |
| :------ | :------------------------------------------------------------------------------------------------------------- |
| **400** | `PURCHASE_API_ONLY` (token del panel), `CONFLICTING_FIELDS` (`purchase` junto con `cryptocurrency`), `VALIDATION_FAILED` (campo de `purchase` ausente, `externalId` ausente, `amount` fuera de BRL con 2 decimales) |
| **403** | `PERMISSION_DENIED`                                                                                            |
| **503** | `PURCHASE_UNAVAILABLE`, `FEATURE_STATUS_UNAVAILABLE`                                                           |

Además de estos, todos los reasons de la <a href={useBaseUrl('/docs/buy-sell/purchases/create')}>compra</a> (`CRYPTO_DISABLED`, `BUY_DISABLED`, `EXTERNAL_ID_CONFLICT`, `AMOUNT_*`, `ADDRESS_*`, `RATE_LIMITED`, `DAILY_CAP_EXCEEDED`...) se transmiten con el mismo status.

:::note[Próxima fase]
El `purchase` sustituye al `cryptocurrency` como puente de migración. En una fase posterior también se retirará: el flujo recomendado es `POST /deposit` en BRL y después `POST /crypto/purchases` con el saldo.
:::

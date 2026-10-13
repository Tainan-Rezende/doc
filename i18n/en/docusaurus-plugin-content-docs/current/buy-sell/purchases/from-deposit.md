---
draft: true
sidebar_label: 'Purchase from Deposit'
sidebar_position: 4
description: "Generates a BRL Pix deposit that, once paid, automatically triggers a crypto purchase on the company's behalf."
sidebar_class_name: 'sidebar-method-post'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Purchase from Deposit

Migration bridge for those who currently use the deposit with conversion. By sending the `purchase` block in <a href={useBaseUrl('/docs/fiat/deposit/create')}>POST /deposit</a>, XGate generates the BRL Pix and, once it is paid, buys USDT/USDC **on the company's behalf, with its own balance**, sending the crypto to the specified wallet.

:::info[Availability]
Available only through the API channel and only when XGate enables the feature for your company.
:::

---

## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/deposit
```

---

## Request

The body is the same as the Pix deposit, with a **required** `externalId` and the `purchase` block:

```json
{
  "amount": "150.00",
  "customerId": "696d1f3331117************",
  "currency": { "_id": "6722ba**************", "name": "BRL", "type": "PIX", "symbol": "R$" },
  "externalId": "order-7781",
  "purchase": {
    "asset": "USDT",
    "network": "TRON",
    "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
  }
}
```

| Field              | Type     | Required | Description                                                       |
| :----------------- | :------- | :------: | :---------------------------------------------------------------- |
| `externalId`       | `string` | **Yes**  | Required when `purchase` is present.                              |
| `amount`           | `string` | **Yes**  | Amount in BRL with 2 decimals.                                    |
| `purchase.asset`   | `string` | **Yes**  | `USDT` or `USDC`.                                                 |
| `purchase.network` | `string` | **Yes**  | Delivery network.                                                 |
| `purchase.address` | `string` | **Yes**  | Company's declared destination wallet.                            |

Before generating the Pix, XGate validates the asset, network, address, limits and purchase enablement. Any rejection returns the error **and the deposit is not created**.

---

## Response (201 Created)

Same as the Pix deposit, plus `data.purchase`:

```json
{
  "message": "Pix Gerado com Sucesso",
  "data": {
    "status": "WAITING_PAYMENT",
    "code": "00020126850014br.gov.bcb.pix2563pi**********",
    "id": "696e28a43e09**************",
    "customerId": "68e7b8f0db**************",
    "externalId": "order-7781",
    "purchase": { "id": "6710c2f4a1b2c3d4e5f60718", "status": "PENDING_PAYMENT" }
  }
}
```

---

## Flow

1. `POST /deposit` with `purchase` → `201` response with the Pix and `data.purchase` in `PENDING_PAYMENT`. Webhook `purchase.pending_payment`.
2. The payer pays the Pix. The deposit becomes `PAID` (`CURRENCY` deposit webhook) and the net BRL is credited to the company's balance.
3. The purchase executes at the market price of that moment (`EXECUTING`, webhook `purchase.executing`), goes through the approval queue when the company does not have automatic approval (`PENDING_APPROVAL`) and ends in `DELIVERED` with `delivery.txHash`, or in `REJECTED` with the BRL returned to the balance.
4. If the Pix is not paid in time, the purchase goes to `EXPIRED` (webhook `purchase.expired`). The deposit remains a regular deposit.

The purchase has `channel = DEPOSIT` and `depositId` filled in. The Pix payer does not buy anything: payer ownership and type are Pix rules, independent of the purchase.

:::warning[Two webhook flows]
A purchase from a deposit generates **two separate flows**: the Pix deposit webhook (`CURRENCY`) and the `purchase.*` events (`CRYPTO_PURCHASE`). There is no combined webhook.
:::

### Additional events

| Event (`type`)             | Status             | When                                           |
| :------------------------- | :----------------- | :--------------------------------------------- |
| `purchase.pending_payment` | `PENDING_PAYMENT`  | Purchase created, waiting for the Pix payment. |
| `purchase.expired`         | `EXPIRED`          | Pix not paid in time. **Final.**               |

---

## Errors

| Status  | Reason                                                                                                         |
| :------ | :------------------------------------------------------------------------------------------------------------- |
| **400** | `PURCHASE_API_ONLY` (dashboard token), `CONFLICTING_FIELDS` (`purchase` together with `cryptocurrency`), `VALIDATION_FAILED` (missing `purchase` field, missing `externalId`, `amount` not in BRL with 2 decimals) |
| **403** | `PERMISSION_DENIED`                                                                                            |
| **503** | `PURCHASE_UNAVAILABLE`, `FEATURE_STATUS_UNAVAILABLE`                                                           |

In addition, all <a href={useBaseUrl('/docs/buy-sell/purchases/create')}>purchase</a> reasons (`CRYPTO_DISABLED`, `BUY_DISABLED`, `EXTERNAL_ID_CONFLICT`, `AMOUNT_*`, `ADDRESS_*`, `RATE_LIMITED`, `DAILY_CAP_EXCEEDED`...) are passed through with the same status.

:::note[Next phase]
`purchase` replaces `cryptocurrency` as the migration bridge. In a later phase it will also be removed: the recommended flow is a BRL `POST /deposit` followed by `POST /crypto/purchases` using the balance.
:::

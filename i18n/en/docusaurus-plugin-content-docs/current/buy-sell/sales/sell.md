---
draft: true
sidebar_label: 'Sell Crypto'
sidebar_position: 1
description: "Send USDT or USDC to the company's fixed address at XGate and receive the amount in BRL in the balance or via Pix."
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Sell Crypto

To sell, the company sends USDT or USDC to a **fixed address** that XGate provides. Each transfer confirmed on the network becomes a sale, and the amount in reais is credited to the BRL balance or sent via Pix to an approved beneficiary, according to the company's configuration.

---

## Sale addresses

XGate gives the company **one fixed address per asset × network**, listed in <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a>, in the `sale` block:

```json
{
  "sale": {
    "enabled": true,
    "status": "READY",
    "minAmount": { "USDT": "10.000000", "USDC": "10.000000" },
    "depositAddresses": [
      { "asset": "USDT", "network": "TRON", "address": "TXg8u3…" },
      { "asset": "USDC", "network": "SOLANA", "address": "7mQe1…" }
    ]
  }
}
```

| Field                | Description                                                                                                                  |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| `enabled`            | Sale enabled for the company.                                                                                                |
| `status`             | `DISABLED`, `PROVISIONING` or `READY`. Addresses are created on the first query by a company with sales enabled: the status goes through `PROVISIONING` until `READY`. |
| `minAmount`          | Minimum sale per asset.                                                                                                      |
| `depositAddresses[]` | Fixed address for each `asset` × `network` pair.                                                                             |

---

## How it works

- **There is no sale order and no `POST /crypto/sales`.** Every transfer confirmed on the network to a fixed address becomes a market sale, with no minimum price and no on-chain refund. Ten transfers are ten sales.
- The price is frozen at settlement. The fee (XGate + referral) is charged in crypto on the amount received, and the BRL credited is `netCryptoAmount × rate`.
- Reconcile using the `txHash` of your transfer. The `sourceAddress` helps when the network provides it.

:::danger[Caution when sending]
Send only the asset and network of the address. **Sending another token or using another network results in loss.** Transfers below `sale.minAmount` are put under review.
:::

---

## Settlement method

The way to receive the BRL from the sale (**BRL balance** or **Pix to an approved beneficiary**) is configured **only in the XGate dashboard**, once per company, with the authenticator. The API does not change this choice: it shows the result in the `settlement` field of each sale.

Pix as a settlement method depends on XGate enabling the feature for your company. Without it, every sale is credited to the balance (`settlement.type = BALANCE`). If the beneficiary is no longer approved or the Pix fails, the sale is credited to the BRL balance: it never gets stuck.

---

## Sale status

```text
RECEIVED ──► SETTLING ──► SETTLED
                     └──► SETTLED_TO_BALANCE
```

| Status               | Meaning                                                                                                       |
| :------------------- | :------------------------------------------------------------------------------------------------------------ |
| `RECEIVED`           | Crypto received and confirmed, waiting for the price. Includes a sale suspended under review (with `review.reason`). |
| `SETTLING`           | Being settled.                                                                                                |
| `SETTLED`            | Settled using the configured method.                                                                          |
| `SETTLED_TO_BALANCE` | The method was Pix, but the amount was credited to the balance. `settlement.fallbackReason` explains why.     |

---

## Sale object {#sale-object}

The same object is returned by the query and sent in the `data` field of the `sale.*` webhooks.

| Field                     | Type               | Description                                                                                                     |
| :------------------------ | :----------------- | :-------------------------------------------------------------------------------------------------------------- |
| `id`                      | `string`           | Sale ID.                                                                                                        |
| `status`                  | `string`           | `RECEIVED` · `SETTLING` · `SETTLED` · `SETTLED_TO_BALANCE`.                                                     |
| `asset`, `network`        | `string`           | Asset and network.                                                                                              |
| `depositAddress`          | `string`           | Company's fixed address that received the funds.                                                                |
| `sourceAddress`           | `string` \| `null` | Where the crypto came from (when the network provides it).                                                      |
| `txHash`                  | `string` \| `null` | On-chain hash. Reconciliation key.                                                                              |
| `cryptoAmount`            | `string`           | Amount received (6 decimals).                                                                                   |
| `rate`                    | `string` \| `null` | BRL price frozen at settlement (8 decimals).                                                                    |
| `feeAmount`, `feeAsset`   | `string` \| `null` | Fee in crypto on `cryptoAmount`.                                                                                |
| `netCryptoAmount`         | `string` \| `null` | `cryptoAmount − feeAmount`.                                                                                     |
| `grossAmount`, `netAmount`| `string` \| `null` | Amount in BRL credited (`netCryptoAmount × rate`, rounded down).                                                |
| `settlement`              | `object`           | `type` (`BALANCE` \| `PIX_KEY`), `beneficiaryId`, `withdrawId` (Pix withdrawal created), `fallbackReason` (`PIX_SETTLEMENT_UNAVAILABLE` · `BENEFICIARY_NOT_ELIGIBLE` · `PAYOUT_REJECTED` · `PAYOUT_FAILED` · `PAYOUT_UNAVAILABLE` · `null`). |
| `review`                  | `object` \| `null` | `reason`: `BELOW_MINIMUM` · `COMPANY_UNAVAILABLE` · `COMPANY_BLOCKED` · `SELL_POLICY_MISSING` · `NET_NOT_POSITIVE` · `CONFIRMATIONS_TIMEOUT` · `CREDIT_REVIEW`. |
| `receivedAt`, `settledAt`, `createdAt`, `updatedAt` | `string` | ISO 8601 dates. `updatedAt` + `status` sort out-of-order webhooks.                             |

---

## Sale webhooks

In the dashboard, select the **Crypto Sales** type (`CRYPTO_SALE`). The envelope is the same as the <a href={useBaseUrl('/docs/buy-sell/webhooks')}>purchase webhooks</a> (`id`, `type`, `createdAt`, `data`), with `data` = sale object.

| Event (`type`)   | Dashboard status                    | When                                                                                       |
| :--------------- | :---------------------------------- | :----------------------------------------------------------------------------------------- |
| `sale.received`  | `RECEIVED`                          | Crypto received and confirmed at the fixed address.                                        |
| `sale.settled`   | `SETTLED` or `SETTLED_TO_BALANCE`   | BRL credited. `data.status` tells which of the two and `data.settlement` shows how.        |

---

## What is not available via the API

| Attempt                                             | Response                   |
| :-------------------------------------------------- | :------------------------- |
| `POST /crypto/sales`                                | `404 ROUTE_NOT_FOUND`      |
| Changing the settlement method with an API token    | `403 DASHBOARD_ONLY`       |
| Registering a beneficiary with an API token         | `403 PERMISSION_DENIED`    |

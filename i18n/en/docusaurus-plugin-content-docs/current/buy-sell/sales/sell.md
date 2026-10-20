---
sidebar_label: 'Sell Crypto'
sidebar_position: 6
description: 'Send USDT or USDC to the company’s fixed address at XGate and receive the amount in BRL in your balance or via Pix.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Sell Crypto

Crypto selling is active and available. To sell, the company sends USDT or USDC to a **fixed address** provided by XGate. Each transfer confirmed on the network becomes a sale, and the BRL amount is credited to the BRL balance or sent via Pix to an approved beneficiary, according to the company’s Dashboard configuration.

---

## How it works

- **There is no sale order or `POST` request.** XGate provides the company with **one fixed address per asset and network**. The company sends USDT or USDC from any wallet to that address, and **each transfer confirmed on the network becomes a sale**, at market price, with no minimum price and no on-chain refund. Ten transfers are ten sales.
- The price is locked at settlement. The fee (XGate + referral) is charged in crypto against the amount received, and the BRL credited is `netCryptoAmount × rate`.
- Reconcile using the `txHash` of your transfer. `sourceAddress` can help when the network provides it.

:::danger[Important when sending]
Send only the asset over the network specified for the address. **Sending a different token, or the correct token over the wrong network, will result in a loss with no refund.** USDC is not available on `TRON`.
:::

---

## Sale addresses

The addresses are returned in the `sale` object from <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a>:

```json
{
  "sale": {
    "enabled": true,
    "status": "READY",
    "minAmount": { "USDT": "10.000000", "USDC": "10.000000" },
    "depositAddresses": [
      { "asset": "USDT", "network": "TRON", "address": "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf" },
      { "asset": "USDC", "network": "SOLANA", "address": "7mQe1…" }
    ]
  }
}
```

| Field                | Type      | Description                                                                                                                                                   |
| :------------------- | :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`            | `boolean` | Whether selling is enabled for the company.                                                                                                                              |
| `status`             | `string`  | `DISABLED` · `PROVISIONING` · `READY`. The first request for a company with selling enabled triggers address creation: the status remains `PROVISIONING` for a few minutes, then changes to `READY`. |
| `minAmount`          | `object`  | Minimum sale amount per asset (`USDT`, `USDC`). Transfers below the minimum are flagged for review (`review.reason = BELOW_MINIMUM`).                                        |
| `depositAddresses[]` | `array`   | Fixed address for each pair: `asset`, `network`, `address`.                                                                                                   |

---

## Where the BRL goes

The method for receiving sale proceeds in BRL is configured **once in the XGate Dashboard** (Buy/Sell › Settings):

- The company’s **BRL balance**; or
- **Pix to an approved beneficiary**.

The API does not change this selection; it shows the result in the `settlement` field for each sale. If the Pix transfer cannot be completed (the beneficiary is not approved, or the withdrawal is rejected or fails), the amount is credited to the BRL balance and the sale ends in `SETTLED_TO_BALANCE`, with the reason in `settlement.fallbackReason`. A sale will never remain pending.

---

## Sale status

```text
RECEIVED ──► SETTLING ──► SETTLED
                     └──► SETTLED_TO_BALANCE
```

| Status               | Meaning                                                                                                  |
| :------------------- | :----------------------------------------------------------------------------------------------------------- |
| `RECEIVED`           | Crypto received and confirmed, awaiting pricing. A sale held for review by XGate appears here with `review.reason`. |
| `SETTLING`           | Price locked; credit in progress.                                                                       |
| `SETTLED`            | Settled using the configured method. **Final.**                                                                 |
| `SETTLED_TO_BALANCE` | Pix was the configured method, but the amount was credited to the balance. `settlement.fallbackReason` explains why. **Final.**         |

---

## Tracking

Track each sale using <a href={useBaseUrl('/docs/webhooks/sale/status')}>Get Sale</a> or the <a href={useBaseUrl('/docs/webhooks/sale/receive')}>sale webhooks</a> (`sale.*`), in the Webhooks tab › Crypto Sale Webhook. Field descriptions are available in the <a href={useBaseUrl('/docs/webhooks/sale/status#sale-object')}>Sale object</a>.
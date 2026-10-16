---
sidebar_label: 'Sell Crypto'
sidebar_position: 6
description: "Send USDT or USDC to the company's fixed address at XGate and receive the amount in BRL in the balance or via Pix."
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Sell Crypto

To sell, the company sends USDT or USDC to a **fixed address** that XGate provides. Each transfer confirmed on the network becomes a sale, and the amount in reais is credited to the BRL balance or sent via Pix to an approved beneficiary, according to the company's configuration in the dashboard.

:::note[Available in November 2026]
Selling crypto through the API will be released in November 2026. Until then, `sale.enabled` is `false` and `sale.depositAddresses` is empty in `GET /crypto/options`.
:::

---

## How it works

- **There is no sale order and no `POST`.** XGate gives the company **one fixed address per asset and network**. The company sends USDT or USDC from any wallet to that address, and **each transfer confirmed on the network becomes a sale**, at market price, with no minimum price and no on-chain refund. Ten transfers are ten sales.
- The price is set at settlement. The fee (XGate + referral) is charged in crypto on the amount received, and the BRL credited is `netCryptoAmount × rate`.
- Reconcile using the `txHash` of your transfer. The `sourceAddress` helps when the network provides it.

:::danger[Caution when sending]
Send only the asset and network of the address. **Sending another token, or the right token on the wrong network, results in loss, with no refund.** There is no USDC on `TRON`.
:::

---

## Sale addresses

The addresses are returned by <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a>, in the `sale` block:

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

| Field                | Type      | Description                                                                                                                                                 |
| :------------------- | :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`            | `boolean` | Sale enabled for the company.                                                                                                                               |
| `status`             | `string`  | `DISABLED` · `PROVISIONING` · `READY`. The first query by a company with sales enabled triggers the creation of the addresses: the status stays `PROVISIONING` for a few minutes and then becomes `READY`. |
| `minAmount`          | `object`  | Minimum sale per asset (`USDT`, `USDC`). Transfers below the minimum are put under review (`review.reason = BELOW_MINIMUM`).                                |
| `depositAddresses[]` | `array`   | Fixed address for each pair: `asset`, `network`, `address`.                                                                                                 |

---

## Where the BRL goes

The way to receive the BRL from the sale is configured **once, in the XGate dashboard** (Buy/Sell › Settings):

- The company's **BRL balance**; or
- **Pix to an approved beneficiary**.

The API does not change this choice: it shows the result in the `settlement` field of each sale. If the Pix cannot be made (beneficiary not approved, withdrawal refused or failed), the amount is credited to the BRL balance and the sale ends as `SETTLED_TO_BALANCE`, with the reason in `settlement.fallbackReason`. The sale never gets stuck.

---

## Sale status

```text
RECEIVED ──► SETTLING ──► SETTLED
                     └──► SETTLED_TO_BALANCE
```

| Status               | Meaning                                                                                                      |
| :------------------- | :----------------------------------------------------------------------------------------------------------- |
| `RECEIVED`           | Crypto received and confirmed, waiting for the price. A sale suspended under XGate review appears here, with `review.reason`. |
| `SETTLING`           | Price frozen, credit in progress.                                                                            |
| `SETTLED`            | Settled using the configured method. **Final.**                                                              |
| `SETTLED_TO_BALANCE` | The method was Pix, but the amount was credited to the balance. `settlement.fallbackReason` explains why. **Final.** |

---

## Tracking

Track each sale via <a href={useBaseUrl('/docs/webhooks/sale/status')}>Get Sale</a> or the <a href={useBaseUrl('/docs/webhooks/sale/receive')}>sale webhooks</a> (`sale.*`), in the Webhooks › Sales tab. The description of each field is in <a href={useBaseUrl('/docs/webhooks/sale/status#sale-object')}>Sale object</a>.

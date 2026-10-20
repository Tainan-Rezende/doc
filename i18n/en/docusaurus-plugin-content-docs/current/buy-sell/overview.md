---
sidebar_label: 'Overview'
sidebar_position: 1
description: 'Buy USDT and USDC using your company’s BRL balance at XGate and receive the crypto in the wallet you specify.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Crypto Buy & Sell

Crypto Buy & Sell is active and available. The company has a BRL balance at XGate and can **buy** USDT or USDC using that balance. XGate sends the purchased crypto directly to a wallet specified by the company and declared as its own.

To **sell**, the company sends USDT/USDC to a fixed address provided by XGate (one per network). Each transfer confirmed on the network becomes a sale, and the BRL proceeds are credited to the company’s BRL balance or sent via Pix to an approved beneficiary, according to the company’s Dashboard settings.

:::info[No crypto custody]
XGate does not custody crypto for companies: purchased crypto is sent directly to the company’s wallet, and sales are settled in BRL balance or via Pix. The company’s customers are not involved in either the purchase or sale.
:::

---

## Assets and networks

| Asset  | Networks                                         |
| :----- | :-------------------------------------------- |
| `USDT` | `POLYGON`, `ETHEREUM`, `TRON`, `SOLANA`       |
| `USDC` | `POLYGON`, `ETHEREUM`, `SOLANA`               |

---

## Purchase flow

1. **Get the options:** <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a> returns available assets, networks, fees, limits, and saved addresses.
2. **Get a quote (optional):** <a href={useBaseUrl('/docs/buy-sell/quotes')}>POST /crypto/quotes</a> guarantees the price for 30 seconds. To display an estimate only, use `POST /crypto/quotes/estimate`.
3. **Make a purchase:** call <a href={useBaseUrl('/docs/buy-sell/purchases/create')}>POST /crypto/purchases</a> with a quote or at market price. The BRL amount is debited from the balance.
4. **Track the purchase:** use <a href={useBaseUrl('/docs/webhooks/purchase/status')}>Get Purchase</a> or the <a href={useBaseUrl('/docs/webhooks/purchase/receive')}>purchase webhooks</a> (Webhooks tab › Crypto Purchase Webhook) until `DELIVERED` (crypto confirmed on the network) or `REJECTED` (BRL returned to the balance).

---

## Sale flow

1. **Get the addresses:** the `sale` object from <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a> contains the company’s fixed address for each asset and network.
2. **Send the crypto:** each transfer confirmed on the network to that address becomes a sale. See <a href={useBaseUrl('/docs/buy-sell/sales/sell')}>Sell Crypto</a>.
3. **Track the sale:** use <a href={useBaseUrl('/docs/webhooks/sale/status')}>Get Sale</a> or the <a href={useBaseUrl('/docs/webhooks/sale/receive')}>sale webhooks</a> (Webhooks tab › Crypto Sale Webhook) until `SETTLED` or `SETTLED_TO_BALANCE`.

---

## Legacy crypto routes

Legacy crypto routes (customer wallet, deposits with conversion, crypto withdrawals, and withdrawals with conversion) return `410 FEATURE_DISCONTINUED` starting 29/10/2026. The table below shows the current alternatives:

| Previous                                                | Current alternative                                                                    |
| :--------------------------------------------------- | :----------------------------------------------------------------------- |
| Pix deposit with `cryptocurrency` (conversion)        | BRL Pix deposit + `POST /crypto/purchases` using the balance               |
| Crypto withdrawal to an external wallet                   | `POST /crypto/purchases`: crypto is sent to a wallet **owned by the company**  |
| USDT/USDC withdrawal → Pix                                | No replacement: XGate does not hold crypto balances for companies             |
| Custodial wallet for a customer                     | No replacement: XGate does not custody crypto                                |
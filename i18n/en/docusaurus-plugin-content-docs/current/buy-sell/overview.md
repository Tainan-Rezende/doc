---
sidebar_label: 'Overview'
sidebar_position: 1
description: "Buy USDT and USDC with your company's BRL balance at XGate and receive the crypto in the wallet you choose."
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Crypto Buy & Sell

The company has a balance in Brazilian reais (BRL) at XGate. Through the API it **buys** USDT or USDC using that balance, and XGate sends the crypto to the wallet the company specifies (declared as its own).

To **sell**, the company sends USDT/USDC to a fixed address that XGate provides (one per network); each confirmed transfer becomes a sale, and the BRL amount is credited to the balance or sent via Pix to an approved beneficiary, according to the company's configuration in the dashboard.

:::info[No crypto custody]
There is no crypto balance at XGate: what the company buys goes straight to its wallet. The company's customer does not appear at any end of the purchase or the sale.
:::

:::note[Sales coming soon]
Selling crypto through the API will be released in November 2026. Until then, this section documents purchases.
:::

---

## Assets and networks

| Asset  | Networks                                      |
| :----- | :-------------------------------------------- |
| `USDT` | `POLYGON`, `ETHEREUM`, `TRON`, `SOLANA`       |
| `USDC` | `POLYGON`, `ETHEREUM`, `SOLANA`               |

There is no USDC on `TRON`, and the BSC network is not supported. The pairs enabled for your company are returned by <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a>.

---

## Enablement

XGate enables the product per company, in the backoffice. Purchases and sales are enabled separately. If any step is not enabled, the API responds:

| Enablement               | Error when disabled          |
| :----------------------- | :--------------------------- |
| Crypto enabled           | `403 CRYPTO_DISABLED`        |
| Crypto via API enabled   | `403 CRYPTO_API_DISABLED`    |
| Purchase enabled         | `403 BUY_DISABLED`           |

In addition, the company must have its list of **allowed IPs** registered in the dashboard. See the <a href={useBaseUrl('/docs/buy-sell/conventions')}>Conventions</a>.

---

## Purchase flow

1. **Check the options:** <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a> shows assets, networks, fees, limits and saved addresses.
2. **Quote (optional):** <a href={useBaseUrl('/docs/buy-sell/quotes')}>POST /crypto/quotes</a> locks the price for 30 seconds. To only display an approximate amount, use `POST /crypto/quotes/estimate`.
3. **Buy:** <a href={useBaseUrl('/docs/buy-sell/purchases/create')}>POST /crypto/purchases</a> with the quote or at market price. The BRL is debited from the balance.
4. **Track:** <a href={useBaseUrl('/docs/buy-sell/purchases/list')}>GET /crypto/purchases/&#123;id&#125;</a> or the <a href={useBaseUrl('/docs/buy-sell/webhooks')}>purchase webhooks</a>, until `DELIVERED` (crypto confirmed on the network) or `REJECTED` (BRL returned to the balance).
5. **Receipt:** <a href={useBaseUrl('/docs/buy-sell/purchases/receipt')}>GET /crypto/purchases/&#123;id&#125;/receipt</a>.

---

## Replacing the legacy flows

The old crypto flows (customer wallet, deposit with conversion, crypto withdrawal and withdrawal with conversion) are **discontinued on October 29, 2026**. The table below shows what to use instead:

| Before                                               | Now                                                                      |
| :--------------------------------------------------- | :----------------------------------------------------------------------- |
| Pix deposit with `cryptocurrency` (conversion)       | BRL Pix deposit + `POST /crypto/purchases` using the balance             |
| Crypto withdrawal to an external wallet              | `POST /crypto/purchases`: the crypto goes to a wallet **owned by the company** |
| USDT/USDC withdrawal → Pix                           | No replacement: the company no longer holds a crypto balance at XGate    |
| Customer custody wallet                              | No replacement: XGate does not hold crypto                               |

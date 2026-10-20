---
sidebar_label: 'Error Codes'
sidebar_position: 7
description: 'List of crypto API error codes (reason) and purchase rejection reasons.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Error Codes

Every crypto API error is returned in the `{ "reason", "message", "traceId" }` envelope (see <a href={useBaseUrl('/docs/buy-sell/conventions#error-format')}>Conventions</a>). Always use `reason` in your logic; `message` is for informational purposes only.

---

## Reasons by HTTP status

| HTTP    | Reasons                                                                                                                                                                                                                                                                                                                          |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`, `AMOUNT_MUST_BE_STRING`, `CONFLICTING_FIELDS`                                                                                                                                                                                                                                                               |
| **401** | `UNAUTHORIZED`                                                                                                                                                                                                                                                                                                                   |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`, `BUY_DISABLED`                                                                                                                                                            |
| **404** | `PURCHASE_NOT_FOUND`, `SALE_NOT_FOUND`, `QUOTE_NOT_FOUND`, `SAVED_ADDRESS_NOT_FOUND`, `ROUTE_NOT_FOUND`                                                                                                                                                                                                                          |
| **409** | `EXTERNAL_ID_CONFLICT`, `QUOTE_EXPIRED`, `QUOTE_ALREADY_USED`                                                                                                                                                                                                                                                                    |
| **410** | `FEATURE_DISCONTINUED` (legacy crypto routes, from 29/10/2026 onward)                                                                                                                                                                                                                                                         |
| **413** | `PAYLOAD_TOO_LARGE`                                                                                                                                                                                                                                                                                                              |
| **422** | `AMOUNT_BELOW_MIN`, `AMOUNT_ABOVE_MAX`, `AMOUNT_TOO_LOW_FOR_NETWORK_FEE`, `ASSET_NOT_SUPPORTED`, `NETWORK_NOT_SUPPORTED`, `ADDRESS_INVALID_FOR_NETWORK`, `ADDRESS_NOT_SAVED`, `ADDRESS_ON_HOLD`, `ADDRESS_NOT_ALLOWED`, `SAVED_ADDRESS_NETWORK_MISMATCH`, `INSUFFICIENT_BALANCE`, `PRICE_UNSTABLE`, `PAIR_MARGIN_NOT_CONFIGURED` |
| **429** | `RATE_LIMITED`, `DAILY_CAP_EXCEEDED`, `OUTFLOW_HOURLY_CAP_EXCEEDED`                                                                                                                                                                                                                                                              |
| **500** | `INTERNAL_SERVER_ERROR`                                                                                                                                                                                                                                                                                                          |
| **503** | `PRICE_STALE`, `NETWORK_FEE_UNAVAILABLE`, `CRYPTO_TEMPORARILY_UNAVAILABLE`, `CONFIGURATION_UNAVAILABLE`, `PURCHASE_UNAVAILABLE`, `SERVICE_OVERLOADED`, `FEATURE_STATUS_UNAVAILABLE`                                                                                                                                              |

---

## Meaning of the main reasons

| Reason                           | Meaning                                                          | What to do                                         |
| :------------------------------- | :------------------------------------------------------------------- | :-------------------------------------------------- |
| `VALIDATION_FAILED`              | A field is missing or has an invalid format.                                    | Correct the body or query.                        |
| `AMOUNT_MUST_BE_STRING`          | Monetary amount was sent as a number.                                 | Send it as a string (`"1500.00"`).                   |
| `CONFLICTING_FIELDS`             | Fields from different methods were combined (e.g., `quoteId` with `amount`). | Use only one method.                             |
| `PERMISSION_DENIED`              | The API user does not have access to this operation.                     | Contact XGate.                                  |
| `COMPANY_BLOCKED`                | The company is blocked.                                                   | Contact support.                                 |
| `ALLOWED_IPS_REQUIRED`           | The company has no allowed IP list.                           | Add IPs in the Dashboard.                            |
| `CLIENT_IP_NOT_ALLOWED`          | The request came from an IP outside the list.                             | Allow the IP in the Dashboard.                             |
| `CRYPTO_DISABLED`                | Crypto is not enabled for the company.                             | Contact XGate.                                   |
| `CRYPTO_API_DISABLED`            | Crypto API access is not enabled for the company.                    | Contact XGate.                                   |
| `BUY_DISABLED`                   | Purchases are not enabled for the company.                             | Contact XGate.                                   |
| `PURCHASE_NOT_FOUND`             | Purchase ID does not exist, is malformed, or belongs to another company.       | Check the `id` returned when the purchase was created.               |
| `SALE_NOT_FOUND`                 | Sale ID does not exist, is malformed, or belongs to another company.        | Check the `id` received in the webhook.                |
| `QUOTE_NOT_FOUND`                | `quoteId` does not exist.                                               | Generate a new quote.                                 |
| `QUOTE_EXPIRED`                  | The quote has passed its `expiresAt` time.                                     | Generate a new quote.                                 |
| `QUOTE_ALREADY_USED`             | The quote has already been used for another purchase.                              | Generate a new quote.                                 |
| `EXTERNAL_ID_CONFLICT`           | `externalId` has already been used with a different body.                               | Use a different `externalId`.                            |
| `SAVED_ADDRESS_NOT_FOUND`        | `addressId` does not exist.                                             | Check `buy.addresses[]`.                         |
| `SAVED_ADDRESS_NETWORK_MISMATCH` | The saved address belongs to a different network.                                    | Use an address for the purchase network.                    |
| `ADDRESS_INVALID_FOR_NETWORK`    | The address is invalid for the network.                                       | Check the address.                                |
| `ADDRESS_NOT_SAVED`              | The “saved addresses only” restriction is enabled, and the address is not saved.      | Save the address in the Dashboard or use `addressId`.    |
| `ADDRESS_ON_HOLD`                | The saved address is still within its hold period.                                    | Wait until `activeAt`.                            |
| `ASSET_NOT_SUPPORTED`            | The asset is unsupported or not enabled.                                 | Check `GET /crypto/options`.                     |
| `NETWORK_NOT_SUPPORTED`          | The network is not supported for the asset.                                     | Check `GET /crypto/options`.                     |
| `AMOUNT_BELOW_MIN`               | The amount is below `buy.minAmount`.                                     | Increase the amount.                                   |
| `AMOUNT_ABOVE_MAX`               | The amount exceeds `buy.maxAmountPerTx`.                                 | Split it into smaller purchases.                         |
| `AMOUNT_TOO_LOW_FOR_NETWORK_FEE` | The amount does not cover the fee and network gas.                            | Increase the amount or choose another network.            |
| `INSUFFICIENT_BALANCE`           | Insufficient BRL balance.                                              | Deposit BRL before purchasing.                     |
| `PAIR_MARGIN_NOT_CONFIGURED`     | The pair is not configured for the company.                           | Contact XGate.                                   |
| `PRICE_UNSTABLE`                 | The price is currently unstable. No amount was debited.                        | Try again shortly.                      |
| `PRICE_STALE`                    | The reference price is unavailable.                                    | Try again shortly.                      |
| `NETWORK_FEE_UNAVAILABLE`        | The network gas fee could not be estimated.                              | Try again or use another network.                |
| `RATE_LIMITED`                   | Too many requests per minute.                                          | Wait for `Retry-After`.                           |
| `DAILY_CAP_EXCEEDED`             | The daily purchase cap has been reached.                                      | Wait until the next day or check `buy.dailyRemaining`. |
| `OUTFLOW_HOURLY_CAP_EXCEEDED`    | The treasury’s hourly outflow cap has been reached.                        | Try again later.                        |
| `CRYPTO_TEMPORARILY_UNAVAILABLE` | Crypto is temporarily unavailable.                                 | Try again later.                        |
| `FEATURE_DISCONTINUED`           | A legacy crypto route, disabled on 29/10/2026.                      | Use the Crypto Buy & Sell API.                     |
| `FEATURE_STATUS_UNAVAILABLE`     | The discontinuation status could not be verified.               | Try again.                                   |

---

## Purchase rejection reasons {#rejection-reasons}

When a purchase ends in `REJECTED`, the `rejection.reason` field contains one of the reasons below. For all of them, `rejection.refunded = true` means the full BRL amount, including fees, was returned to the balance.

| `rejection.reason`               | Meaning                                   |
| :------------------------------- | :-------------------------------------------- |
| `INSUFFICIENT_BALANCE`           | Insufficient BRL balance.                       |
| `QUOTE_NOT_FOUND`                | Quote does not exist.                          |
| `QUOTE_EXPIRED`                  | Quote has expired.                              |
| `QUOTE_ALREADY_USED`             | Quote has already been used.                             |
| `PRICE_STALE`                    | Reference price is unavailable.             |
| `PRICE_UNSTABLE`                 | Price is unstable; no amount was debited.            |
| `NETWORK_FEE_UNAVAILABLE`        | Network gas fee is unavailable.                     |
| `AMOUNT_TOO_LOW_FOR_NETWORK_FEE` | Amount does not cover the fee and gas.               |
| `DAILY_CAP_EXCEEDED`             | Daily cap has been reached.                         |
| `OUTFLOW_HOURLY_CAP_EXCEEDED`    | Treasury’s hourly outflow cap has been reached. |
| `LIQUIDITY_UNAVAILABLE`          | Liquidity is unavailable.                        |
| `CRYPTO_TEMPORARILY_UNAVAILABLE` | Crypto is temporarily unavailable.          |
| `APPROVAL_REJECTED`              | Rejected in XGate’s approval queue.       |
| `PROVIDER_REJECTED`              | Rejected by the custody provider.                       |
| `SEND_FAILED`                    | Transfer failed; no funds were sent.                     |
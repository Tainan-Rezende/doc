---
sidebar_label: 'Error Codes'
sidebar_position: 7
description: 'List of crypto API error codes (reason) and purchase rejection reasons.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Error Codes

Every crypto API error comes in the `{ "reason", "message", "traceId" }` envelope (see <a href={useBaseUrl('/docs/buy-sell/conventions#error-format')}>Conventions</a>). Always use the `reason` in your logic; the `message` is informational only.

---

## Reasons by HTTP status

| HTTP    | Reasons                                                                                                                                                                                                                                                                              |
| :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`, `AMOUNT_MUST_BE_STRING`, `CONFLICTING_FIELDS`, `PURCHASE_API_ONLY`                                                                                                                                                                                              |
| **401** | `UNAUTHORIZED`                                                                                                                                                                                                                                                                       |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`, `BUY_DISABLED`, `DASHBOARD_ONLY`                                                                                              |
| **404** | `PURCHASE_NOT_FOUND`, `SALE_NOT_FOUND`, `QUOTE_NOT_FOUND`, `SAVED_ADDRESS_NOT_FOUND`, `ROUTE_NOT_FOUND`                                                                                                                                                                              |
| **409** | `EXTERNAL_ID_CONFLICT`, `QUOTE_EXPIRED`, `QUOTE_ALREADY_USED`, `RECEIPT_NOT_AVAILABLE`                                                                                                                                                                                               |
| **410** | `FEATURE_DISCONTINUED` (legacy crypto flows, as of October 29, 2026)                                                                                                                                                                                                                 |
| **413** | `PAYLOAD_TOO_LARGE`                                                                                                                                                                                                                                                                  |
| **422** | `AMOUNT_BELOW_MIN`, `AMOUNT_ABOVE_MAX`, `AMOUNT_TOO_LOW_FOR_NETWORK_FEE`, `ASSET_NOT_SUPPORTED`, `NETWORK_NOT_SUPPORTED`, `ADDRESS_INVALID_FOR_NETWORK`, `ADDRESS_NOT_SAVED`, `ADDRESS_ON_HOLD`, `ADDRESS_NOT_ALLOWED`, `SAVED_ADDRESS_NETWORK_MISMATCH`, `INSUFFICIENT_BALANCE`, `PRICE_UNSTABLE`, `PAIR_MARGIN_NOT_CONFIGURED` |
| **429** | `RATE_LIMITED`, `DAILY_CAP_EXCEEDED`, `OUTFLOW_HOURLY_CAP_EXCEEDED`                                                                                                                                                                                                                  |
| **500** | `INTERNAL_SERVER_ERROR`                                                                                                                                                                                                                                                              |
| **503** | `PRICE_STALE`, `NETWORK_FEE_UNAVAILABLE`, `CRYPTO_TEMPORARILY_UNAVAILABLE`, `CONFIGURATION_UNAVAILABLE`, `PURCHASE_UNAVAILABLE`, `SERVICE_OVERLOADED`, `FEATURE_STATUS_UNAVAILABLE`                                                                                                  |

---

## Meaning of the main reasons

| Reason                           | Meaning                                                                                         | What to do                                                        |
| :------------------------------- | :---------------------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| `VALIDATION_FAILED`              | Missing or malformed field.                                                                     | Fix the body or the query.                                        |
| `AMOUNT_MUST_BE_STRING`          | Monetary value sent as a number.                                                                | Send it as a string (`"1500.00"`).                                |
| `CONFLICTING_FIELDS`             | Fields from different forms mixed together (ex: `quoteId` with `amount`).                       | Use only one of the forms.                                        |
| `PERMISSION_DENIED`              | The API user does not have `CRYPTO.VIEW` or `CRYPTO.EXECUTE`.                                   | Request the permission.                                           |
| `COMPANY_BLOCKED`                | Company blocked.                                                                                | Contact support.                                                  |
| `ALLOWED_IPS_REQUIRED`           | The company has no allowed IP list.                                                             | Register IPs in the dashboard.                                    |
| `CLIENT_IP_NOT_ALLOWED`          | Request made from an IP outside the list.                                                       | Allow the IP in the dashboard.                                    |
| `CRYPTO_DISABLED`                | Crypto is not enabled for the company.                                                          | Contact XGate.                                                    |
| `CRYPTO_API_DISABLED`            | Crypto via API is not enabled for the company.                                                  | Contact XGate.                                                    |
| `BUY_DISABLED`                   | Purchase is not enabled for the company.                                                        | Contact XGate.                                                    |
| `QUOTE_NOT_FOUND`                | Nonexistent `quoteId`.                                                                          | Generate a new quote.                                             |
| `QUOTE_EXPIRED`                  | The quote is past `expiresAt`.                                                                  | Generate a new quote.                                             |
| `QUOTE_ALREADY_USED`             | The quote was already used in another purchase.                                                 | Generate a new quote.                                             |
| `EXTERNAL_ID_CONFLICT`           | `externalId` already used with a different body.                                                | Use another `externalId`.                                         |
| `SAVED_ADDRESS_NOT_FOUND`        | Nonexistent `addressId`.                                                                        | Check `buy.addresses[]`.                                          |
| `SAVED_ADDRESS_NETWORK_MISMATCH` | The saved address belongs to another network.                                                   | Use an address on the purchase network.                           |
| `ADDRESS_INVALID_FOR_NETWORK`    | Address invalid for the network.                                                                | Check the address.                                                |
| `ADDRESS_NOT_SAVED`              | "Saved addresses only" lock enabled and the address is not saved.                               | Save the address in the dashboard or use `addressId`.             |
| `ADDRESS_ON_HOLD`                | Saved address still in its hold period.                                                         | Wait until `activeAt`.                                            |
| `ASSET_NOT_SUPPORTED`            | Asset not supported or not enabled.                                                             | Check `GET /crypto/options`.                                      |
| `NETWORK_NOT_SUPPORTED`          | Network not supported for the asset.                                                            | Check `GET /crypto/options`.                                      |
| `AMOUNT_BELOW_MIN`               | Amount below `buy.minAmount`.                                                                   | Increase the amount.                                              |
| `AMOUNT_ABOVE_MAX`               | Amount above `buy.maxAmountPerTx`.                                                              | Split into smaller purchases.                                     |
| `AMOUNT_TOO_LOW_FOR_NETWORK_FEE` | The amount does not cover the fee and the network gas.                                          | Increase the amount or choose another network.                    |
| `INSUFFICIENT_BALANCE`           | Insufficient BRL balance.                                                                       | Deposit BRL before buying.                                        |
| `PAIR_MARGIN_NOT_CONFIGURED`     | The pair is not configured for the company.                                                     | Contact XGate.                                                    |
| `PRICE_UNSTABLE`                 | Price unstable at the moment. Nothing was debited.                                              | Try again shortly.                                                |
| `PRICE_STALE`                    | Reference price unavailable.                                                                    | Try again shortly.                                                |
| `NETWORK_FEE_UNAVAILABLE`        | Could not estimate the network gas.                                                             | Try again or use another network.                                 |
| `RATE_LIMITED`                   | Too many calls per minute.                                                                      | Wait for the `Retry-After`.                                       |
| `DAILY_CAP_EXCEEDED`             | Daily purchase cap reached.                                                                     | Wait for the next day or check `buy.dailyRemaining`.              |
| `OUTFLOW_HOURLY_CAP_EXCEEDED`    | Treasury hourly outflow cap reached.                                                            | Try again later.                                                  |
| `RECEIPT_NOT_AVAILABLE`          | Receipt requested before the purchase is `DELIVERED`.                                           | Wait for the delivery.                                            |
| `CRYPTO_TEMPORARILY_UNAVAILABLE` | Crypto temporarily unavailable.                                                                 | Try again later.                                                  |
| `FEATURE_DISCONTINUED`           | Route of a legacy crypto flow, discontinued on October 29, 2026.                                | Migrate to crypto purchases.                                      |
| `FEATURE_STATUS_UNAVAILABLE`     | Could not verify the discontinuation status.                                                    | Try again.                                                        |

---

## Purchase rejection reasons {#rejection-reasons}

When a purchase ends in `REJECTED`, the `rejection.reason` field contains one of the reasons below. In all of them, `rejection.refunded = true` means the BRL was fully returned to the balance, fee included.

| `rejection.reason`               | Meaning                                                           |
| :------------------------------- | :---------------------------------------------------------------- |
| `INSUFFICIENT_BALANCE`           | Insufficient BRL balance.                                         |
| `QUOTE_NOT_FOUND`                | Nonexistent quote.                                                |
| `QUOTE_EXPIRED`                  | Expired quote.                                                    |
| `QUOTE_ALREADY_USED`             | Quote already used.                                               |
| `PRICE_STALE`                    | Reference price unavailable.                                      |
| `PRICE_UNSTABLE`                 | Unstable price; nothing was debited.                              |
| `NETWORK_FEE_UNAVAILABLE`        | Network gas unavailable.                                          |
| `AMOUNT_TOO_LOW_FOR_NETWORK_FEE` | Amount does not cover the fee and the gas.                        |
| `DAILY_CAP_EXCEEDED`             | Daily cap reached.                                                |
| `OUTFLOW_HOURLY_CAP_EXCEEDED`    | Treasury hourly outflow cap reached.                              |
| `LIQUIDITY_UNAVAILABLE`          | Liquidity unavailable.                                            |
| `CRYPTO_TEMPORARILY_UNAVAILABLE` | Crypto temporarily unavailable.                                   |
| `APPROVAL_REJECTED`              | Rejected in XGate's approval queue.                               |
| `PROVIDER_REJECTED`              | Rejected by the custodian.                                        |
| `SEND_FAILED`                    | Sending error; nothing was sent.                                  |

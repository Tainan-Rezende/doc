---
sidebar_label: 'Receive Webhooks'
sidebar_position: 1
description: 'Webhooks are automatic notifications sent by XGate to your system whenever a transaction status changes.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Receiving Webhooks

Webhooks are automatic notifications sent by XGate to your system whenever a transaction status changes (e.g. a Pix deposit was paid, a settlement error occurred, or a withdrawal entered processing).

This eliminates the need for your system to repeatedly poll the API to know whether a payment has settled. XGate acts only as a messenger: we dispatch the information, and your system must be prepared to receive and handle it.

---

## Panel Setup

It is essential to understand that **XGate does not provide a webhook URL**. You (or your development team) must build a public route on your own server to receive the data. After creating this route, you must register it in the XGate panel.

Follow the steps below to configure notification delivery:

1. Access the **Webhooks** side menu in your XGate panel.
2. Click **+ Add Integration** or click **Configure** on an empty slot.
3. Fill in the destination fields:
   * **Name:** An internal identification name for you (e.g. "Main Server Webhook").
   * **URL:** The full endpoint address hosted on your server (e.g. `https://your-company.com/api/webhooks/xgate`).

4. **Events:** Select which notifications you want XGate to send to this URL. Events are divided into:
   * **CURRENCY:** Fiat currency transactions (Pix, including approval, rejection, errors, and the full refund/dispute workflow).
   * **CRYPTO_PURCHASE (Crypto Purchases):** Status changes of crypto purchases. See <a href={useBaseUrl('/docs/webhooks/purchase/receive')}>Crypto Purchase Webhooks</a>.
   * **CRYPTO_SALE (Crypto Sales):** Status changes of crypto sales. Only appears for companies with sales enabled. See <a href={useBaseUrl('/docs/webhooks/sale/receive')}>Crypto Sale Webhooks</a>.
   * **CRYPTOCURRENCY:** Transactions from old crypto routes. **Discontinued on October 29, 2026**: no longer sent.

:::info[Crypto events use a different format]
`CRYPTO_PURCHASE` and `CRYPTO_SALE` events use their own envelope (`id`, `type`, `createdAt`, `data`), different from the flat format described on this page. The `CRYPTO_PURCHASE` and `CRYPTO_SALE` types only appear for companies with crypto (and, for sales, selling) enabled.
:::

:::tip[Integration Tip]
Our recommendation is that you **enable all available events**. This ensures your database has a perfect mirror of what is happening in XGate, preventing transactions from getting stuck in outdated statuses. However, the final choice is yours.
:::

---

## Security: IP Whitelist

To ensure your system is not subject to fake webhook attacks (malicious users simulating that a payment was approved), XGate sends all notifications from a **Dedicated Fixed IP**.

We strongly recommend configuring your server firewall or adding validation in your code to accept only `POST` requests coming from the following IP:

**Official XGate IP:** `107.23.39.46`

---

## Idempotency and "externalId"

When creating Deposit or Withdrawal orders, you can send the `externalId` field. It has two vital functions:

1. **Preventing Duplicates (Idempotency):** Prevents network failures or a double click by your end customer from generating multiple identical transactions in XGate. If two requests are sent with the same `externalId`, the second one will be ignored.
2. **Traceability:** Acts as the unique order code in *your* system.

**Note:** If you send `externalId` when creating the transaction, XGate will return it inside the webhook payload, making it easier to look up in your database.

---

## How does the flow work?

1. You register **your URL** in the XGate panel and select the events.
2. When one of the selected events occurs, XGate makes a **POST** request to your URL from IP `107.23.39.46`.
3. Your system receives the JSON, processes the business logic, and **confirms receipt by returning an HTTP 200 OK**.

:::warning[Integration Best Practice]
Your server **MUST** return HTTP status `200` (OK) immediately after receiving the webhook. This is the standard practice to inform XGate that your system processed the notification successfully, properly closing the connection and avoiding communication failures (*timeouts*) between servers.
:::

---

## Request Format and Variations

The payload format varies slightly depending on whether the transaction involves only Fiat (Pix) or Cryptocurrencies (USDT).

:::warning[Crypto examples discontinued on October 29, 2026]
Examples 2 to 5 below belong to the old crypto routes (conversion, crypto withdrawal and crypto deposit), discontinued on October 29, 2026. From that date on, the payload in this format will only be the BRL Pix one (example 1).
:::

- **Method:** <span className="badge badge--info">POST</span>

### Payload Examples

**1. Standard Transaction (Pix BRL):**
Returns the `type` field specifying the method.
```json
{
    "id": "676071f1*************",
    "customerId": "123456*************",
    "status": "PAID",
    "name": "BRL",
    "type": "PIX",
    "amount": 2,
    "operation": "DEPOSIT"
}
```
**2. Withdrawal (USDT converted to Pix):**
The `type` field is omitted in operations that involve crypto balances.
```json
{
    "id": "676070dc*************",
    "customerId": "123456*************",
    "status": "PAID",
    "name": "USDT",
    "amount": 0.04,
    "operation": "WITHDRAW"
}
```
**3. Deposit (Pix converted to Crypto):**
```json
{
    "id": "676070*************",
    "customerId": "123456*************",
    "status": "PAID",
    "name": "USDT",
    "amount": 0.332,
    "operation": "DEPOSIT"
}
```
**4. Withdrawal (Crypto to Crypto)**
```json
{
  "id": "6a3a844fe2**************",
  "status": "PAID",
  "name": "USDT",
  "amount": 1,
  "operation": "WITHDRAW",
  "customerId": "6a1a379e1f**************",
  "txHash": "54vpJgzQ8C2ktDj7************************"
}
```
**5. Deposit (Crypto to Crypto)**
```json
{
  "id": "6a3da45e116****************",
  "status": "PAID",
  "name": "USDT",
  "amount": 4.7,
  "operation": "DEPOSIT",
  "customerId": "6a1a379e1fe****************",
  "txHash": "mtVZznAKV6m1eEjWrWaX****************"
}
```
### Field Description

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique transaction ID generated by XGate. |
| `status` | `string` | The current transaction status (ex: `PAID`, `PROCESSING`). |
| `name` | `string` | The base currency of the transaction (ex: `BRL`, `USDT`). |
| `type` | `string` | *(Conditional)* The method used (ex: `PIX`). Usually absent in transactions involving crypto balance. |
| `amount` | `number` | The value processed in the transaction. |
| `operation` | `string` | Defines whether it is an entry or exit (`DEPOSIT` or `WITHDRAW`). |
| `customerId` | `string` | Customer ID linked to the transaction. |
| `externalId` | `string` | *(Optional)* The order ID in your system. Returned only if sent by you when creating the transaction. |
| `txHash` | `string` | *(Conditional)* Blockchain transaction hash. Returned only in 100% crypto operations. |

---

## Possible Statuses

Your system should be prepared to process normal flow statuses and dispute/refund flow statuses (Chargeback).

### Main Transaction Flow

| Status                                                     | Meaning                                                                   | Recommended Action                                                                  |
| :--------------------------------------------------------- | :---------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| <span className="badge badge--secondary">PROCESSING</span> | The transaction is being processed.                                            | Only record the progress (common in withdrawals).                                   |
| <span className="badge badge--success">PAID</span>         | Transaction completed and paid successfully.                                       | **Release the balance/product and confirm deposit or withdrawal.**                        |
| <span className="badge badge--danger">ERROR</span>         | Operation failure (ex: incorrect Pix key in withdrawals, invalid account holder). | Notify the end user about the failure and suggest checking registered information. |
| <span className="badge badge--danger">REJECTED</span>      | Rejected by the clearing partner/bank.                                  | Rare event, treat as a definitive failure.                                  |

### Chargeback and Dispute Flow

| Status                                                                   | Meaning                                                                       | Recommended Action                                     |
| :----------------------------------------------------------------------- | :-------------------------------------------------------------------------------- | :--------------------------------------------------- |
| <span className="badge badge--warning">AWAITING_REFUND_CONTESTION</span> | The end customer opened a refund dispute with their bank. The balance is held. | Freeze the customer balance/service preventively. |
| <span className="badge badge--warning">AWAITING_BANK_VEREDICT</span>     | You submitted the dispute defense and we are waiting for the bank to judge.          | Wait for resolution.                                  |
| <span className="badge badge--warning">EXPIRED_DISPUTE</span>             | The deadline to submit dispute evidence has expired.                  | Record the dispute as lost.                          |
| <span className="badge badge--danger">REFUND_CANCELED</span>            | The refund was canceled by the bank (you won the dispute).                       | The held amount is returned to your account.              |
| <span className="badge badge--success">REFUND_APPROVED</span>             | The refund was approved by the bank (you lost the dispute).                        | The amount is returned to the end customer definitively.  |
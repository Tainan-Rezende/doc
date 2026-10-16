---
draft: true
sidebar_label: 'Beneficiaries'
sidebar_position: 3
description: "Lists the company's approved beneficiaries that can receive the proceeds of crypto sales via Pix."
sidebar_class_name: 'sidebar-method-get'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# List Beneficiaries

Lists the company's beneficiaries. Use it to understand the `settlement.beneficiaryId` of <a href={useBaseUrl('/docs/webhooks/sale/status')}>sales</a> settled via Pix.

:::info[Read-only]
Registering, deactivating and reactivating beneficiaries is done in the XGate dashboard and goes through review. The API only queries.
:::

---

## Endpoint
- **Method:** <span className="badge badge--success">GET</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/withdraw/beneficiaries?use=CRYPTO_SALE
```

---

## Query

| Parameter | Type      | Description                                                                                           |
| :-------- | :-------- | :---------------------------------------------------------------------------------------------------- |
| `use`     | `string`  | `PAYOUT` (withdrawal) or `CRYPTO_SALE` (sale). With `use`, only `APPROVED` beneficiaries are returned. |
| `status`  | `string`  | `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `REVOKED`, `DEACTIVATED`.                                   |
| `cursor`  | `string`  | `nextCursor` from the previous page.                                                                  |
| `limit`   | `integer` | 1 to 200. Default: 50.                                                                                |

---

## Response (200 OK)

```json
{
  "items": [
    {
      "id": "6721f0e1d2c3b4a596870a1b",
      "type": "SAME_OWNER",
      "status": "APPROVED",
      "pixKey": { "key": "12.345.678/0001-90", "type": "CNPJ" },
      "holderName": "Example Company Ltda",
      "holderDocument": "12345678000190",
      "relationship": null,
      "reviewNote": null,
      "createdBy": { "id": "66aa…", "email": "finance@company.com" },
      "reviewedAt": "2026-11-03T15:20:00.000Z",
      "contractFileId": null,
      "createdAt": "2026-11-03T12:00:00.000Z",
      "updatedAt": "2026-11-03T15:20:00.000Z",
      "usableFor": ["PAYOUT", "CRYPTO_SALE"]
    }
  ],
  "nextCursor": null
}
```

| Field                          | Description                                                                             |
| :----------------------------- | :-------------------------------------------------------------------------------------- |
| `type`                         | `SAME_OWNER`, `OWNER_PF`, `THIRD_PARTY_PJ` or `THIRD_PARTY_PF`.                         |
| `status`                       | `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `REVOKED` or `DEACTIVATED`.                   |
| `pixKey`                       | Pix key (`key`, `type`).                                                                |
| `holderName`, `holderDocument` | Key holder.                                                                             |
| `relationship`                 | Declared relationship with the company (third parties).                                 |
| `reviewNote`                   | Note from XGate's review.                                                               |
| `createdBy`                    | User who registered it (`id`, `email`).                                                 |
| `reviewedAt`                   | Review date.                                                                            |
| `contractFileId`               | Attached contract, when required.                                                       |
| `usableFor`                    | Allowed uses (`PAYOUT`, `CRYPTO_SALE`).                                                 |

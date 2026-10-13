---
draft: true
sidebar_label: 'Beneficiarios'
sidebar_position: 3
description: 'Lista los beneficiarios aprobados de la empresa que pueden recibir el monto de las ventas de cripto por Pix.'
sidebar_class_name: 'sidebar-method-get'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Listar beneficiarios

Lista los beneficiarios de la empresa. Úselo para entender el `settlement.beneficiaryId` de las <a href={useBaseUrl('/docs/buy-sell/sales/list')}>ventas</a> liquidadas por Pix.

- **Permiso:** `WITHDRAW_BENEFICIARY.VIEW`

:::info[Solo lectura]
El registro, la desactivación y la reactivación de beneficiarios se realizan en el panel de XGate y pasan por análisis. La API solo consulta.
:::

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/withdraw/beneficiaries?use=CRYPTO_SALE
```

---

## Query

| Parámetro | Tipo      | Descripción                                                                                           |
| :-------- | :-------- | :---------------------------------------------------------------------------------------------------- |
| `use`     | `string`  | `PAYOUT` (retiro) o `CRYPTO_SALE` (venta). Con `use`, solo se devuelven beneficiarios `APPROVED`.     |
| `status`  | `string`  | `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `REVOKED`, `DEACTIVATED`.                                   |
| `cursor`  | `string`  | `nextCursor` de la página anterior.                                                                   |
| `limit`   | `integer` | 1 a 200. Predeterminado: 50.                                                                          |

---

## Respuesta (200 OK)

```json
{
  "items": [
    {
      "id": "6721f0e1d2c3b4a596870a1b",
      "type": "SAME_OWNER",
      "status": "APPROVED",
      "pixKey": { "key": "12.345.678/0001-90", "type": "CNPJ" },
      "holderName": "Empresa Ejemplo Ltda",
      "holderDocument": "12345678000190",
      "relationship": null,
      "reviewNote": null,
      "createdBy": { "id": "66aa…", "email": "financeiro@empresa.com" },
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

| Campo                          | Descripción                                                                             |
| :----------------------------- | :-------------------------------------------------------------------------------------- |
| `type`                         | `SAME_OWNER`, `OWNER_PF`, `THIRD_PARTY_PJ` o `THIRD_PARTY_PF`.                          |
| `status`                       | `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `REVOKED` o `DEACTIVATED`.                    |
| `pixKey`                       | Clave Pix (`key`, `type`).                                                              |
| `holderName`, `holderDocument` | Titular de la clave.                                                                    |
| `relationship`                 | Relación declarada con la empresa (terceros).                                           |
| `reviewNote`                   | Observación del análisis de XGate.                                                      |
| `createdBy`                    | Usuario que realizó el registro (`id`, `email`).                                        |
| `reviewedAt`                   | Fecha del análisis.                                                                     |
| `contractFileId`               | Contrato adjunto, cuando se requiere.                                                   |
| `usableFor`                    | Usos permitidos (`PAYOUT`, `CRYPTO_SALE`).                                              |

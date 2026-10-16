---
draft: true
sidebar_label: 'Beneficiários'
sidebar_position: 3
description: 'Lista os beneficiários aprovados da empresa que podem receber o valor de vendas de cripto por Pix.'
sidebar_class_name: 'sidebar-method-get'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Listar Beneficiários

Lista os beneficiários da empresa. Use para entender o `settlement.beneficiaryId` das <a href={useBaseUrl('/docs/webhooks/sale/status')}>vendas</a> liquidadas por Pix.

:::info[Somente leitura]
Cadastro, desativação e reativação de beneficiários são feitos no painel da XGate e passam por análise. A API apenas consulta.
:::

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/withdraw/beneficiaries?use=CRYPTO_SALE
```

---

## Query

| Parâmetro | Tipo      | Descrição                                                                                             |
| :-------- | :-------- | :---------------------------------------------------------------------------------------------------- |
| `use`     | `string`  | `PAYOUT` (retirada) ou `CRYPTO_SALE` (venda). Com `use`, só retornam beneficiários `APPROVED`.        |
| `status`  | `string`  | `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `REVOKED`, `DEACTIVATED`.                                   |
| `cursor`  | `string`  | `nextCursor` da página anterior.                                                                      |
| `limit`   | `integer` | 1 a 200. Padrão: 50.                                                                                  |

---

## Resposta (200 OK)

```json
{
  "items": [
    {
      "id": "6721f0e1d2c3b4a596870a1b",
      "type": "SAME_OWNER",
      "status": "APPROVED",
      "pixKey": { "key": "12.345.678/0001-90", "type": "CNPJ" },
      "holderName": "Empresa Exemplo Ltda",
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

| Campo                          | Descrição                                                                               |
| :----------------------------- | :-------------------------------------------------------------------------------------- |
| `type`                         | `SAME_OWNER`, `OWNER_PF`, `THIRD_PARTY_PJ` ou `THIRD_PARTY_PF`.                         |
| `status`                       | `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `REVOKED` ou `DEACTIVATED`.                   |
| `pixKey`                       | Chave Pix (`key`, `type`).                                                              |
| `holderName`, `holderDocument` | Titular da chave.                                                                       |
| `relationship`                 | Relação declarada com a empresa (terceiros).                                            |
| `reviewNote`                   | Observação da análise da XGate.                                                         |
| `createdBy`                    | Usuário que cadastrou (`id`, `email`).                                                  |
| `reviewedAt`                   | Data da análise.                                                                        |
| `contractFileId`               | Contrato anexado, quando exigido.                                                       |
| `usableFor`                    | Usos permitidos (`PAYOUT`, `CRYPTO_SALE`).                                              |

---
draft: true
sidebar_label: 'Consultar Vendas'
sidebar_position: 2
description: 'Lista as vendas de cripto da empresa, consulta uma venda pelo ID e gera o comprovante.'
sidebar_class_name: 'sidebar-method-get'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Consultar Vendas

- **Permissão:** `CRYPTO.VIEW`

---

## Endpoints
- **Método:** <span className="badge badge--success">GET</span>

| Rota                                  | Descrição                                     |
| :------------------------------------ | :-------------------------------------------- |
| `GET /crypto/sales`                   | Lista as vendas, da mais recente para a mais antiga. |
| `GET /crypto/sales/{id}`              | Consulta uma venda.                           |
| `GET /crypto/sales/{id}/receipt`      | Comprovante em HTML.                          |

```bash title="URL do Endpoint"
https://api.xgateglobal.com/crypto/sales
```

---

## Listar vendas

#### Query

| Parâmetro    | Tipo      | Descrição                                          |
| :----------- | :-------- | :------------------------------------------------- |
| `status`     | `string`  | `RECEIVED`, `SETTLING`, `SETTLED`, `SETTLED_TO_BALANCE`. |
| `asset`      | `string`  | `USDT` ou `USDC`.                                  |
| `network`    | `string`  | Rede.                                              |
| `txHash`     | `string`  | Busca exata pelo hash on-chain.                    |
| `from`, `to` | `string`  | Intervalo inclusivo em `createdAt` (ISO 8601).     |
| `cursor`     | `string`  | `nextCursor` da página anterior.                   |
| `limit`      | `integer` | 1 a 100. Padrão: 20.                               |

#### Resposta (200 OK)

```json
{
  "items": [
    {
      "id": "6720a1b2c3d4e5f607182930",
      "status": "SETTLED",
      "asset": "USDT",
      "network": "TRON",
      "depositAddress": "TXg8u3…",
      "sourceAddress": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
      "txHash": "4b7e0c2d9a…",
      "cryptoAmount": "500.000000",
      "rate": "5.39800000",
      "feeAmount": "7.500000",
      "feeAsset": "USDT",
      "netCryptoAmount": "492.500000",
      "grossAmount": "2658.51",
      "netAmount": "2658.51",
      "settlement": { "type": "BALANCE", "beneficiaryId": null, "withdrawId": null, "fallbackReason": null },
      "review": null,
      "receivedAt": "2026-11-10T13:00:12.000Z",
      "settledAt": "2026-11-10T13:00:45.000Z",
      "createdAt": "2026-11-10T13:00:12.000Z",
      "updatedAt": "2026-11-10T13:00:45.000Z"
    }
  ],
  "nextCursor": null
}
```

A descrição de cada campo está em <a href={useBaseUrl('/docs/buy-sell/sales/sell#sale-object')}>Objeto da venda</a>.

---

## Consultar uma venda

`GET /crypto/sales/{id}` retorna o objeto da venda. ID inexistente ou de outra empresa → `404 SALE_NOT_FOUND`.

---

## Comprovante

`GET /crypto/sales/{id}/receipt` retorna `{ "htmlTemplate": "<html>…" }`, apenas para vendas `SETTLED` ou `SETTLED_TO_BALANCE`; antes disso, `409 RECEIPT_NOT_AVAILABLE`. Na venda liquidada por Pix, o comprovante traz o beneficiário, a chave mascarada, o ID do saque e o E2E. Idioma pelo `Accept-Language` (`pt-BR` padrão, `en`).

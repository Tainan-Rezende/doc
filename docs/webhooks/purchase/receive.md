---
sidebar_label: 'Receber webhooks de compra'
sidebar_position: 2
description: 'Eventos enviados pela XGate a cada mudança de status de uma compra de cripto (tipo CRYPTO_PURCHASE).'
sidebar_class_name: 'sidebar-method-post'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Receber Webhooks de Compra

A XGate envia um evento para a sua URL a cada mudança de status de uma compra de cripto.

---

## Configuração

A configuração é igual à dos demais webhooks (veja <a href={useBaseUrl('/docs/webhooks/receive')}>Receber Webhooks</a>): no painel da XGate, menu **Webhooks**, selecione o tipo de evento **Compras de Cripto** (`CRYPTO_PURCHASE`) e os status que deseja receber.

O tipo `CRYPTO_PURCHASE` só aparece para empresas com cripto liberada.

---

## Formato do evento

:::warning[Envelope diferente do legado]
Os eventos de cripto **não** usam o formato plano dos webhooks de depósito e saque (`id`, `status`, `amount`, `operation`...). Eles vêm em um envelope com `id`, `type`, `createdAt` e `data`.
:::

- **Método:** <span className="badge badge--info">POST</span>

```json
{
  "id": "evt_6710c5a2f0e1d2c3b4a59687",
  "type": "purchase.delivered",
  "createdAt": "2026-10-13T14:11:40.031Z",
  "data": {
    "id": "6710c2f4a1b2c3d4e5f60718",
    "externalId": "pedido-7781",
    "status": "DELIVERED",
    "channel": "API",
    "asset": "USDT",
    "network": "TRON",
    "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
    "amount": "1500.00",
    "rate": "5.45400000",
    "cryptoAmount": "275.027502",
    "feeAmount": "4.125414",
    "feeAsset": "USDT",
    "networkFee": "0.012000",
    "deliveredAmount": "270.890088",
    "quoteId": "l3m8Qm1n0pV2cXk5dY9sTg4hWz7aB6eR1uJ0oK2qF3i",
    "depositId": null,
    "approval": { "required": true, "decision": "APPROVED", "decidedAt": "2026-10-13T14:08:02.000Z" },
    "delivery": { "status": "CONFIRMED", "txHash": "9f2c1e7b0a…", "confirmedAt": "2026-10-13T14:11:39.000Z" },
    "rejection": null,
    "executedAt": "2026-10-13T14:03:40.512Z",
    "createdAt": "2026-10-13T14:03:40.204Z",
    "updatedAt": "2026-10-13T14:11:40.031Z"
  }
}
```

| Campo       | Tipo     | Descrição                                                                                                                     |
| :---------- | :------- | :---------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string` | ID único do evento. Use para descartar entregas repetidas.                                                                    |
| `type`      | `string` | Tipo do evento (tabela abaixo).                                                                                               |
| `createdAt` | `string` | Data de criação do evento (ISO 8601, UTC).                                                                                    |
| `data`      | `object` | Objeto da compra, igual ao de <a href={useBaseUrl('/docs/webhooks/purchase/status')}>Consultar Compra</a>.               |

---

## Eventos

| Evento (`type`)            | Status no painel   | Quando                                                                                     |
| :------------------------- | :----------------- | :----------------------------------------------------------------------------------------- |
| `purchase.pending_payment` | `PENDING_PAYMENT`  | Só em compra aberta a partir de um depósito: aguardando o pagamento do Pix.                |
| `purchase.executing`       | `EXECUTING`        | BRL debitado do saldo (em geral antes da resposta `201` do `POST`).                        |
| `purchase.pending_approval`| `PENDING_APPROVAL` | A compra entrou na fila de aprovação da XGate.                                             |
| `purchase.delivered`       | `DELIVERED`        | Cripto confirmada na rede; `data.delivery.txHash` preenchido. **Final.**                   |
| `purchase.rejected`        | `REJECTED`         | Compra não entregue; `data.rejection` traz `reason`, `message` e `refunded`. **Final.**    |
| `purchase.expired`         | `EXPIRED`          | O depósito de origem não foi pago no prazo. **Final.**                                     |

---

## Regras para o integrador

- **Um evento por mudança de status**, enviado uma vez. Mudanças internas dentro de `EXECUTING` não geram evento.
- **Entrega pelo menos uma vez:** o mesmo evento pode chegar mais de uma vez. Trate a idempotência pelo `id` do evento.
- **Ordem:** eventos podem chegar fora de ordem. Ordene por `data.updatedAt` e `data.status`.
- **Responda `200` rapidamente**, como nos demais webhooks.
- Uma compra recusada antes do débito (erro `422` no `POST`) gera só o evento `purchase.rejected`.

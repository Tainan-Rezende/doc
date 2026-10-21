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

:::warning[Envelope diferente dos webhooks de depósito e saque]
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
    "asset": "USDT",
    "network": "TRON",
    "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
    "amount": "1500.00",
    "deliveredAmount": "270.890088",
    "txHash": "9f2c1e7b0a…",
    "rejection": null,
    "updatedAt": "2026-10-13T14:11:40.031Z"
  }
}
```

### Envelope do evento

| Campo       | Tipo     | Descrição                                                                                                                                           |
| :---------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string` | ID único do evento. Use para descartar entregas repetidas.                                                                                          |
| `type`      | `string` | Tipo do evento (tabela abaixo).                                                                                                                     |
| `createdAt` | `string` | Data de criação do evento (ISO 8601, UTC).                                                                                                          |
| `data`      | `object` | Resumo da compra (tabela abaixo). O objeto completo está em <a href={useBaseUrl('/docs/webhooks/purchase/status')}>Consultar Compra</a>.            |

### Campos de `data` (resumo da compra)

<div className="tabela-nowrap">
| Campo             | Tipo               | Descrição                                                                                     |
| :---------------- | :----------------- | :-------------------------------------------------------------------------------------------- |
| `id`              | `string`           | Id da compra na XGate. Use em `GET /crypto/purchases/{id}`.                                   |
| `externalId`      | `string`           | Id do pedido no sistema do integrador.                                                        |
| `status`          | `string`           | `PENDING_PAYMENT` · `EXECUTING` · `PENDING_APPROVAL` · `DELIVERED` · `REJECTED` · `EXPIRED`.   |
| `asset`           | `string`           | Ativo comprado.                                                                               |
| `network`         | `string`           | Rede de entrega.                                                                              |
| `address`         | `string`           | Carteira de destino.                                                                          |
| `amount`          | `string`           | BRL debitado.                                                                                 |
| `deliveredAmount` | `string` \| `null` | Quantidade entregue (ou a entregar) na carteira. `null` antes da execução.                    |
| `txHash`          | `string` \| `null` | Hash on-chain em `DELIVERED`. `null` antes.                                                   |
| `rejection`       | `object` \| `null` | Só em `REJECTED`: `{ reason, refunded }`. `null` nos demais.                                 |
| `updatedAt`       | `string` (ISO)     | Última alteração; use com `status` para ordenar eventos fora de ordem.                       |
</div>
---

## Eventos

| Evento (`type`)            | Status no painel   | Quando                                                                                     |
| :------------------------- | :----------------- | :----------------------------------------------------------------------------------------- |
| `purchase.pending_payment` | `PENDING_PAYMENT`  | Só em compra aberta a partir de um depósito: aguardando o pagamento do Pix.                |
| `purchase.executing`       | `EXECUTING`        | BRL debitado do saldo (em geral antes da resposta `201` do `POST`).                        |
| `purchase.pending_approval`| `PENDING_APPROVAL` | A compra entrou na fila de aprovação da XGate.                                             |
| `purchase.delivered`       | `DELIVERED`        | Cripto confirmada na rede; `data.txHash` preenchido. **Final.**                            |
| `purchase.rejected`        | `REJECTED`         | Compra não entregue; `data.rejection` traz `reason` e `refunded`. **Final.**                |
| `purchase.expired`         | `EXPIRED`          | O depósito de origem não foi pago no prazo. **Final.**                                     |

---

## Regras para o integrador

- **Um evento por mudança de status**, enviado uma vez. Mudanças internas dentro de `EXECUTING` não geram evento.
- **Entrega pelo menos uma vez:** o mesmo evento pode chegar mais de uma vez. Trate a idempotência pelo `id` do evento.
- **Ordem:** eventos podem chegar fora de ordem. Ordene por `data.updatedAt` e `data.status`.
- **Responda `200` rapidamente**, como nos demais webhooks.
- Uma compra recusada antes do débito (erro `422` no `POST`) gera só o evento `purchase.rejected`.
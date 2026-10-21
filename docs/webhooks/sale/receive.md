---
sidebar_label: 'Receber webhooks de venda'
sidebar_position: 2
description: 'Eventos enviados pela XGate a cada mudança de status de uma venda de cripto (tipo CRYPTO_SALE).'
sidebar_class_name: 'sidebar-method-post'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Receber Webhooks de Venda

A XGate envia um evento para a sua URL a cada mudança de status de uma venda de cripto.

---

## Configuração

A configuração é igual à dos demais webhooks (veja <a href={useBaseUrl('/docs/webhooks/receive')}>Receber Webhooks</a>): no painel da XGate, menu **Webhooks**, selecione o tipo de evento **Vendas de Cripto** (`CRYPTO_SALE`) e os status que deseja receber.

O tipo `CRYPTO_SALE` só aparece para empresas com venda liberada.

---

## Formato do evento

:::warning[Envelope diferente dos webhooks de depósito e saque]
Os eventos de cripto **não** usam o formato plano dos webhooks de depósito e saque (`id`, `status`, `amount`, `operation`...). Eles vêm em um envelope com `id`, `type`, `createdAt` e `data`, o mesmo dos <a href={useBaseUrl('/docs/webhooks/purchase/receive')}>webhooks de compra</a>.
:::

- **Método:** <span className="badge badge--info">POST</span>

```json
{
  "id": "evt_6711c0e8b2c3d4e5f6071829",
  "type": "sale.settled",
  "createdAt": "2026-10-16T14:03:24.902Z",
  "data": {
    "id": "6711c0e5a1b2c3d4e5f60718",
    "status": "SETTLED",
    "asset": "USDT",
    "network": "TRON",
    "txHash": "9f2c1e0b7a6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b3a2918070f6e5d4c",
    "cryptoAmount": "1000.000000",
    "netAmount": "5355.90",
    "settlement": { "type": "BALANCE" },
    "updatedAt": "2026-10-16T14:03:24.870Z"
  }
}
```

### Envelope do evento

| Campo       | Tipo     | Descrição                                                                                                                                       |
| :---------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string` | ID único do evento. Use para descartar entregas repetidas.                                                                                      |
| `type`      | `string` | Tipo do evento (tabela abaixo).                                                                                                                 |
| `createdAt` | `string` | Data de criação do evento (ISO 8601, UTC).                                                                                                      |
| `data`      | `object` | Resumo da venda (tabela abaixo). O objeto completo está em <a href={useBaseUrl('/docs/webhooks/sale/status')}>Consultar Venda</a>.             |

### Campos de `data` (resumo da venda)

<div className="tabela-nowrap">
| Campo          | Tipo               | Descrição                                                                                                        |
| :------------- | :----------------- | :--------------------------------------------------------------------------------------------------------------- |
| `id`           | `string`           | Id da venda na XGate. Use em `GET /crypto/sales/{id}`.                                                           |
| `status`       | `string`           | `RECEIVED` · `SETTLING` · `SETTLED` · `SETTLED_TO_BALANCE`.                                                      |
| `asset`        | `string`           | Ativo recebido.                                                                                                  |
| `network`      | `string`           | Rede em que foi recebido.                                                                                        |
| `txHash`       | `string`           | Hash do envio do integrador. A venda não tem `externalId`; a conciliação é por este campo.                       |
| `cryptoAmount` | `string`           | Quantidade recebida.                                                                                             |
| `netAmount`    | `string` \| `null` | BRL creditado. `null` até a liquidação.                                                                          |
| `settlement`   | `object`           | `{ type }`: `BALANCE` ou `PIX_KEY`.                                                                              |
| `updatedAt`    | `string` (ISO)     | Última alteração; use com `status` para ordenar eventos fora de ordem.                                           |
</div>
---

## Eventos

| Evento (`type`) | Status no painel                  | Quando                                                                               |
| :-------------- | :-------------------------------- | :----------------------------------------------------------------------------------- |
| `sale.received` | `RECEIVED`                        | Cripto recebida e confirmada no endereço fixo.                                       |
| `sale.settled`  | `SETTLED` ou `SETTLED_TO_BALANCE` | BRL creditado. `data.status` diz qual dos dois e `data.settlement` mostra como. **Final.** |

---

## Regras para o integrador

- **Um evento por mudança de status**, enviado uma vez.
- **Entrega pelo menos uma vez:** o mesmo evento pode chegar mais de uma vez. Trate a idempotência pelo `id` do evento.
- **Ordem:** eventos podem chegar fora de ordem. Ordene por `data.updatedAt` e `data.status`.
- **Responda `200` rapidamente**, como nos demais webhooks.
- Concilie cada venda pelo `data.txHash` do seu envio.
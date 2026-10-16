---
sidebar_label: 'Receber webhooks de venda'
sidebar_position: 2
description: 'Eventos enviados pela XGate a cada mudança de status de uma venda de cripto (tipo CRYPTO_SALE).'
sidebar_class_name: 'sidebar-method-post'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Receber Webhooks de Venda

A XGate envia um evento para a sua URL a cada mudança de status de uma venda de cripto.

:::note[Disponível em novembro de 2026]
A venda de cripto pela API será liberada em novembro de 2026. O tipo `CRYPTO_SALE` só aparece para empresas com venda liberada.
:::

---

## Configuração

A configuração é igual à dos demais webhooks (veja <a href={useBaseUrl('/docs/webhooks/receive')}>Receber Webhooks</a>): no painel da XGate, menu **Webhooks**, selecione o tipo de evento **Vendas de Cripto** (`CRYPTO_SALE`) e os status que deseja receber.

---

## Formato do evento

:::warning[Envelope diferente do legado]
Os eventos de cripto **não** usam o formato plano dos webhooks de depósito e saque (`id`, `status`, `amount`, `operation`...). Eles vêm em um envelope com `id`, `type`, `createdAt` e `data`, o mesmo dos <a href={useBaseUrl('/docs/webhooks/purchase/receive')}>webhooks de compra</a>.
:::

- **Método:** <span className="badge badge--info">POST</span>

```json
{
  "id": "evt_6711c0e8b2c3d4e5f6071829",
  "type": "sale.settled",
  "createdAt": "2026-11-13T14:03:24.902Z",
  "data": {
    "id": "6711c0e5a1b2c3d4e5f60718",
    "status": "SETTLED",
    "asset": "USDT",
    "network": "TRON",
    "depositAddress": "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
    "sourceAddress": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
    "txHash": "9f2c1e0b7a6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b3a2918070f6e5d4c",
    "cryptoAmount": "1000.000000",
    "rate": "5.41000000",
    "netCryptoAmount": "990.000000",
    "grossAmount": "5355.90",
    "feeAmount": "10.000000",
    "feeAsset": "USDT",
    "netAmount": "5355.90",
    "settlement": { "type": "BALANCE", "beneficiaryId": null, "withdrawId": null, "fallbackReason": null },
    "review": null,
    "receivedAt": "2026-11-13T14:03:22.114Z",
    "settledAt": "2026-11-13T14:03:24.870Z",
    "createdAt": "2026-11-13T14:03:22.114Z",
    "updatedAt": "2026-11-13T14:03:24.870Z"
  }
}
```

| Campo       | Tipo     | Descrição                                                                                                          |
| :---------- | :------- | :----------------------------------------------------------------------------------------------------------------- |
| `id`        | `string` | ID único do evento. Use para descartar entregas repetidas.                                                         |
| `type`      | `string` | Tipo do evento (tabela abaixo).                                                                                    |
| `createdAt` | `string` | Data de criação do evento (ISO 8601, UTC).                                                                         |
| `data`      | `object` | Objeto da venda, igual ao de <a href={useBaseUrl('/docs/webhooks/sale/status#sale-object')}>Consultar Venda</a>.   |

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

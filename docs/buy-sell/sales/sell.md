---
draft: true
sidebar_label: 'Vender Cripto'
sidebar_position: 1
description: 'Envie USDT ou USDC para o endereço fixo da empresa na XGate e receba o valor em BRL no saldo ou por Pix.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Vender Cripto

Para vender, a empresa envia USDT ou USDC para um **endereço fixo** que a XGate dá a ela. Cada envio confirmado na rede vira uma venda, e o valor em reais é creditado no saldo BRL ou enviado por Pix para um beneficiário aprovado, conforme a configuração da empresa.

---

## Endereços de venda

A XGate dá à empresa **um endereço fixo por ativo × rede**, listado em <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a>, no bloco `sale`:

```json
{
  "sale": {
    "enabled": true,
    "status": "READY",
    "minAmount": { "USDT": "10.000000", "USDC": "10.000000" },
    "depositAddresses": [
      { "asset": "USDT", "network": "TRON", "address": "TXg8u3…" },
      { "asset": "USDC", "network": "SOLANA", "address": "7mQe1…" }
    ]
  }
}
```

| Campo                | Descrição                                                                                                                    |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| `enabled`            | Venda liberada para a empresa.                                                                                               |
| `status`             | `DISABLED`, `PROVISIONING` ou `READY`. Os endereços nascem na primeira consulta de uma empresa com venda liberada: o status passa por `PROVISIONING` até `READY`. |
| `minAmount`          | Venda mínima por ativo.                                                                                                      |
| `depositAddresses[]` | Endereço fixo de cada par `asset` × `network`.                                                                               |

---

## Como funciona

- **Não existe pedido de venda nem `POST /crypto/sales`.** Todo envio confirmado na rede para um endereço fixo vira uma venda a mercado, sem preço mínimo e sem devolução on-chain. Dez envios são dez vendas.
- O preço é congelado na liquidação. A taxa (XGate + indicação) é cobrada em cripto sobre a quantidade recebida, e o BRL creditado é `netCryptoAmount × rate`.
- Concilie pelo `txHash` do seu envio. O `sourceAddress` ajuda quando a rede o informa.

:::danger[Atenção ao enviar]
Envie apenas o ativo e a rede do endereço. **Enviar outro token ou usar outra rede resulta em perda.** Envios abaixo de `sale.minAmount` ficam em análise.
:::

---

## Forma de recebimento

A forma de receber o BRL da venda (**saldo BRL** ou **Pix para um beneficiário aprovado**) é configurada **somente no painel da XGate**, uma vez por empresa, com o autenticador. A API não altera essa escolha: ela mostra o resultado no campo `settlement` de cada venda.

O Pix como forma de recebimento depende de a XGate liberar o recurso para a sua empresa. Sem isso, toda venda cai no saldo (`settlement.type = BALANCE`). Se o beneficiário deixar de estar aprovado ou o Pix falhar, a venda cai no saldo BRL: ela nunca fica presa.

---

## Status da venda

```text
RECEIVED ──► SETTLING ──► SETTLED
                     └──► SETTLED_TO_BALANCE
```

| Status               | Significado                                                                                                   |
| :------------------- | :------------------------------------------------------------------------------------------------------------ |
| `RECEIVED`           | Cripto recebida e confirmada, aguardando preço. Inclui a venda suspensa em análise (com `review.reason`).      |
| `SETTLING`           | Em liquidação.                                                                                                |
| `SETTLED`            | Liquidada pela forma configurada.                                                                             |
| `SETTLED_TO_BALANCE` | A forma era Pix, mas o valor caiu no saldo. `settlement.fallbackReason` explica o motivo.                     |

---

## Objeto da venda {#sale-object}

O mesmo objeto é retornado na consulta e enviado no campo `data` dos webhooks `sale.*`.

| Campo                     | Tipo               | Descrição                                                                                                       |
| :------------------------ | :----------------- | :-------------------------------------------------------------------------------------------------------------- |
| `id`                      | `string`           | ID da venda.                                                                                                    |
| `status`                  | `string`           | `RECEIVED` · `SETTLING` · `SETTLED` · `SETTLED_TO_BALANCE`.                                                     |
| `asset`, `network`        | `string`           | Ativo e rede.                                                                                                   |
| `depositAddress`          | `string`           | Endereço fixo da empresa que recebeu.                                                                           |
| `sourceAddress`           | `string` \| `null` | De onde a cripto saiu (quando a rede informa).                                                                  |
| `txHash`                  | `string` \| `null` | Hash on-chain. Chave de conciliação.                                                                            |
| `cryptoAmount`            | `string`           | Quantidade recebida (6 casas).                                                                                  |
| `rate`                    | `string` \| `null` | Preço BRL congelado na liquidação (8 casas).                                                                    |
| `feeAmount`, `feeAsset`   | `string` \| `null` | Taxa em cripto sobre `cryptoAmount`.                                                                            |
| `netCryptoAmount`         | `string` \| `null` | `cryptoAmount − feeAmount`.                                                                                     |
| `grossAmount`, `netAmount`| `string` \| `null` | Valor em BRL creditado (`netCryptoAmount × rate`, para baixo).                                                  |
| `settlement`              | `object`           | `type` (`BALANCE` \| `PIX_KEY`), `beneficiaryId`, `withdrawId` (saque Pix criado), `fallbackReason` (`PIX_SETTLEMENT_UNAVAILABLE` · `BENEFICIARY_NOT_ELIGIBLE` · `PAYOUT_REJECTED` · `PAYOUT_FAILED` · `PAYOUT_UNAVAILABLE` · `null`). |
| `review`                  | `object` \| `null` | `reason`: `BELOW_MINIMUM` · `COMPANY_UNAVAILABLE` · `COMPANY_BLOCKED` · `SELL_POLICY_MISSING` · `NET_NOT_POSITIVE` · `CONFIRMATIONS_TIMEOUT` · `CREDIT_REVIEW`. |
| `receivedAt`, `settledAt`, `createdAt`, `updatedAt` | `string` | Datas ISO 8601. `updatedAt` + `status` ordenam webhooks fora de ordem.                         |

---

## Webhooks de venda

Selecione no painel o tipo **Vendas de Cripto** (`CRYPTO_SALE`). O envelope é o mesmo dos <a href={useBaseUrl('/docs/buy-sell/webhooks')}>webhooks de compra</a> (`id`, `type`, `createdAt`, `data`), com `data` = objeto da venda.

| Evento (`type`)  | Status no painel                    | Quando                                                                                     |
| :--------------- | :---------------------------------- | :----------------------------------------------------------------------------------------- |
| `sale.received`  | `RECEIVED`                          | Cripto recebida e confirmada no endereço fixo.                                             |
| `sale.settled`   | `SETTLED` ou `SETTLED_TO_BALANCE`   | BRL creditado. `data.status` diz qual dos dois e `data.settlement` mostra como.            |

---

## O que não existe pela API

| Tentativa                                           | Resposta                   |
| :-------------------------------------------------- | :------------------------- |
| `POST /crypto/sales`                                | `404 ROUTE_NOT_FOUND`      |
| Alterar a forma de recebimento com token de API     | `403 DASHBOARD_ONLY`       |
| Cadastrar beneficiário com token de API             | `403 PERMISSION_DENIED`    |

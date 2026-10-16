---
sidebar_label: 'Vender Cripto'
sidebar_position: 6
description: 'Envie USDT ou USDC para o endereço fixo da empresa na XGate e receba o valor em BRL no saldo ou por Pix.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Vender Cripto

Para vender, a empresa envia USDT ou USDC para um **endereço fixo** que a XGate dá a ela. Cada envio confirmado na rede vira uma venda, e o valor em reais é creditado no saldo BRL ou enviado por Pix para um beneficiário aprovado, conforme a configuração da empresa no painel.

:::note[Disponível em novembro de 2026]
A venda de cripto pela API será liberada em novembro de 2026. Até lá, `sale.enabled` vem `false` e `sale.depositAddresses` vem vazio em `GET /crypto/options`.
:::

---

## Como funciona

- **Não existe pedido de venda nem `POST`.** A XGate dá à empresa **um endereço fixo por ativo e rede**. A empresa envia USDT ou USDC de qualquer carteira para esse endereço, e **cada envio confirmado na rede vira uma venda**, a mercado, sem preço mínimo e sem devolução on-chain. Dez envios são dez vendas.
- O preço é fixado na liquidação. A taxa (XGate + indicação) é cobrada em cripto sobre a quantidade recebida, e o BRL creditado é `netCryptoAmount × rate`.
- Concilie pelo `txHash` do seu envio. O `sourceAddress` ajuda quando a rede o informa.

:::danger[Atenção ao enviar]
Envie apenas o ativo e a rede do endereço. **Enviar outro token, ou o token certo pela rede errada, resulta em perda, sem devolução.** Não existe USDC em `TRON`.
:::

---

## Endereços de venda

Os endereços vêm em <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a>, no bloco `sale`:

```json
{
  "sale": {
    "enabled": true,
    "status": "READY",
    "minAmount": { "USDT": "10.000000", "USDC": "10.000000" },
    "depositAddresses": [
      { "asset": "USDT", "network": "TRON", "address": "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf" },
      { "asset": "USDC", "network": "SOLANA", "address": "7mQe1…" }
    ]
  }
}
```

| Campo                | Tipo      | Descrição                                                                                                                                                   |
| :------------------- | :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`            | `boolean` | Venda liberada para a empresa.                                                                                                                              |
| `status`             | `string`  | `DISABLED` · `PROVISIONING` · `READY`. A primeira consulta de uma empresa com venda liberada dispara a criação dos endereços: o status fica `PROVISIONING` por alguns minutos e passa a `READY`. |
| `minAmount`          | `object`  | Venda mínima por ativo (`USDT`, `USDC`). Envios abaixo do mínimo ficam em análise (`review.reason = BELOW_MINIMUM`).                                        |
| `depositAddresses[]` | `array`   | Endereço fixo de cada par: `asset`, `network`, `address`.                                                                                                   |

---

## Para onde vai o BRL

A forma de receber o BRL da venda é configurada **uma vez, no painel da XGate** (Compra/Venda › Configurações):

- **Saldo em BRL** da empresa; ou
- **Pix para um beneficiário aprovado**.

A API não altera essa escolha: ela mostra o resultado no campo `settlement` de cada venda. Se o Pix não puder ser feito (beneficiário não aprovado, saque recusado ou falho), o valor cai no saldo BRL e a venda termina `SETTLED_TO_BALANCE`, com o motivo em `settlement.fallbackReason`. A venda nunca fica presa.

---

## Status da venda

```text
RECEIVED ──► SETTLING ──► SETTLED
                     └──► SETTLED_TO_BALANCE
```

| Status               | Significado                                                                                                  |
| :------------------- | :----------------------------------------------------------------------------------------------------------- |
| `RECEIVED`           | Cripto recebida e confirmada, aguardando preço. Uma venda suspensa em análise da XGate aparece aqui, com `review.reason`. |
| `SETTLING`           | Preço congelado, crédito em andamento.                                                                       |
| `SETTLED`            | Liquidada pela forma configurada. **Final.**                                                                 |
| `SETTLED_TO_BALANCE` | A forma era Pix, mas o valor caiu no saldo. `settlement.fallbackReason` explica o motivo. **Final.**         |

---

## Acompanhamento

Acompanhe cada venda por <a href={useBaseUrl('/docs/webhooks/sale/status')}>Consultar Venda</a> ou pelos <a href={useBaseUrl('/docs/webhooks/sale/receive')}>webhooks de venda</a> (`sale.*`), na aba Webhooks › Vendas Webhook. A descrição de cada campo está em <a href={useBaseUrl('/docs/webhooks/sale/status#sale-object')}>Objeto da venda</a>.

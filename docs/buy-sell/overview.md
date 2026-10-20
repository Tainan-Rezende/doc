---
sidebar_label: 'Visão Geral'
sidebar_position: 1
description: 'Compre USDT e USDC com o saldo em reais da sua empresa na XGate e receba a cripto na carteira que você indicar.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Compra e Venda de Cripto

A empresa tem saldo em reais (BRL) na XGate. Com a API ela **compra** USDT ou USDC usando esse saldo, e a XGate envia a cripto para a carteira que a empresa indicar (declarada como dela).

Para **vender**, a empresa envia USDT/USDC para um endereço fixo que a XGate dá a ela (um por rede); cada envio confirmado vira uma venda e o valor em reais cai no saldo ou vai por Pix para um beneficiário aprovado, conforme a configuração da empresa no painel.

:::info[Sem custódia de cripto]
Não existe saldo cripto na XGate: o que a empresa compra vai direto para a carteira dela. O customer da empresa não aparece em nenhuma ponta da compra ou da venda.
:::

---

## Ativos e redes

| Ativo  | Redes                                         |
| :----- | :-------------------------------------------- |
| `USDT` | `POLYGON`, `ETHEREUM`, `TRON`, `SOLANA`       |
| `USDC` | `POLYGON`, `ETHEREUM`, `SOLANA`               |

---

## Fluxo de compra

1. **Consulte as opções:** <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a> mostra ativos, redes, taxas, limites e endereços salvos.
2. **Cote (opcional):** <a href={useBaseUrl('/docs/buy-sell/quotes')}>POST /crypto/quotes</a> garante o preço por 30 segundos. Para só mostrar um valor aproximado, use `POST /crypto/quotes/estimate`.
3. **Compre:** <a href={useBaseUrl('/docs/buy-sell/purchases/create')}>POST /crypto/purchases</a> com a cotação ou a mercado. O BRL é debitado do saldo.
4. **Acompanhe:** <a href={useBaseUrl('/docs/webhooks/purchase/status')}>Consultar Compra</a> ou os <a href={useBaseUrl('/docs/webhooks/purchase/receive')}>webhooks de compra</a> (aba Webhooks › Compras Cripto Webhook), até `DELIVERED` (cripto confirmada na rede) ou `REJECTED` (BRL devolvido ao saldo).

---

## Fluxo de venda

1. **Pegue os endereços:** o bloco `sale` de <a href={useBaseUrl('/docs/buy-sell/options')}>GET /crypto/options</a> traz o endereço fixo da empresa para cada ativo e rede.
2. **Envie a cripto:** cada envio confirmado na rede para esse endereço vira uma venda. Veja <a href={useBaseUrl('/docs/buy-sell/sales/sell')}>Vender Cripto</a>.
3. **Acompanhe:** <a href={useBaseUrl('/docs/webhooks/sale/status')}>Consultar Venda</a> ou os <a href={useBaseUrl('/docs/webhooks/sale/receive')}>webhooks de venda</a> (aba Webhooks › Vendas Cripto Webhook), até `SETTLED` ou `SETTLED_TO_BALANCE`.

---

## Rotas antigas de cripto

As rotas antigas de cripto (carteira do customer, depósito com conversão, saque cripto e saque com conversão) deixam de funcionar em 29/10/2026. A tabela abaixo mostra o que usar no lugar:

| Antes                                                | Agora                                                                    |
| :--------------------------------------------------- | :----------------------------------------------------------------------- |
| Depósito Pix com `cryptocurrency` (conversão)        | Depósito Pix em BRL + `POST /crypto/purchases` com o saldo               |
| Saque cripto para carteira externa                   | `POST /crypto/purchases`: a cripto vai para uma carteira **da empresa**  |
| Saque USDT/USDC → Pix                                | Sem substituto: a empresa não tem mais saldo cripto na XGate             |
| Carteira de custódia do customer                     | Sem substituto: a XGate não guarda cripto                                |
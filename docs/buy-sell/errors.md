---
sidebar_label: 'Códigos de Erro'
sidebar_position: 7
description: 'Lista de códigos de erro (reason) da API de cripto e motivos de recusa da compra.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Códigos de Erro

Todo erro da API de cripto vem no envelope `{ "reason", "message", "traceId" }` (veja <a href={useBaseUrl('/docs/buy-sell/conventions#error-format')}>Convenções</a>). Use sempre o `reason` na sua lógica; a `message` é apenas informativa.

---

## Mapa de reasons por status HTTP

| HTTP    | Reasons                                                                                                                                                                                                                                                                                                                          |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`, `AMOUNT_MUST_BE_STRING`, `CONFLICTING_FIELDS`                                                                                                                                                                                                                                                               |
| **401** | `UNAUTHORIZED`                                                                                                                                                                                                                                                                                                                   |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`, `BUY_DISABLED`                                                                                                                                                            |
| **404** | `PURCHASE_NOT_FOUND`, `SALE_NOT_FOUND`, `QUOTE_NOT_FOUND`, `SAVED_ADDRESS_NOT_FOUND`, `ROUTE_NOT_FOUND`                                                                                                                                                                                                                          |
| **409** | `EXTERNAL_ID_CONFLICT`, `QUOTE_EXPIRED`, `QUOTE_ALREADY_USED`                                                                                                                                                                                                                                                                    |
| **410** | `FEATURE_DISCONTINUED` (rotas antigas de cripto, a partir de 29/10/2026)                                                                                                                                                                                                                                                         |
| **413** | `PAYLOAD_TOO_LARGE`                                                                                                                                                                                                                                                                                                              |
| **422** | `AMOUNT_BELOW_MIN`, `AMOUNT_ABOVE_MAX`, `AMOUNT_TOO_LOW_FOR_NETWORK_FEE`, `ASSET_NOT_SUPPORTED`, `NETWORK_NOT_SUPPORTED`, `ADDRESS_INVALID_FOR_NETWORK`, `ADDRESS_NOT_SAVED`, `ADDRESS_ON_HOLD`, `ADDRESS_NOT_ALLOWED`, `SAVED_ADDRESS_NETWORK_MISMATCH`, `INSUFFICIENT_BALANCE`, `PRICE_UNSTABLE`, `PAIR_MARGIN_NOT_CONFIGURED` |
| **429** | `RATE_LIMITED`, `DAILY_CAP_EXCEEDED`, `OUTFLOW_HOURLY_CAP_EXCEEDED`                                                                                                                                                                                                                                                              |
| **500** | `INTERNAL_SERVER_ERROR`                                                                                                                                                                                                                                                                                                          |
| **503** | `PRICE_STALE`, `NETWORK_FEE_UNAVAILABLE`, `CRYPTO_TEMPORARILY_UNAVAILABLE`, `CONFIGURATION_UNAVAILABLE`, `PURCHASE_UNAVAILABLE`, `SERVICE_OVERLOADED`, `FEATURE_STATUS_UNAVAILABLE`                                                                                                                                              |

---

## Significado dos principais reasons

| Reason                           | Significado                                                          | O que fazer                                         |
| :------------------------------- | :------------------------------------------------------------------- | :-------------------------------------------------- |
| `VALIDATION_FAILED`              | Campo ausente ou fora do formato.                                    | Corrigir o corpo ou a query.                        |
| `AMOUNT_MUST_BE_STRING`          | Valor monetário enviado como número.                                 | Enviar como string (`"1500.00"`).                   |
| `CONFLICTING_FIELDS`             | Campos de formas diferentes misturados (ex: `quoteId` com `amount`). | Usar só uma das formas.                             |
| `PERMISSION_DENIED`              | O usuário da API não tem acesso a esta operação.                     | Falar com a XGate.                                  |
| `COMPANY_BLOCKED`                | Empresa bloqueada.                                                   | Contatar o suporte.                                 |
| `ALLOWED_IPS_REQUIRED`           | A empresa não tem lista de IPs permitidos.                           | Cadastrar IPs no painel.                            |
| `CLIENT_IP_NOT_ALLOWED`          | Requisição feita de um IP fora da lista.                             | Liberar o IP no painel.                             |
| `CRYPTO_DISABLED`                | Cripto não está liberada para a empresa.                             | Contatar a XGate.                                   |
| `CRYPTO_API_DISABLED`            | Cripto pela API não está liberada para a empresa.                    | Contatar a XGate.                                   |
| `BUY_DISABLED`                   | Compra não está liberada para a empresa.                             | Contatar a XGate.                                   |
| `PURCHASE_NOT_FOUND`             | ID de compra inexistente, fora do formato ou de outra empresa.       | Conferir o `id` retornado na criação.               |
| `SALE_NOT_FOUND`                 | ID de venda inexistente, fora do formato ou de outra empresa.        | Conferir o `id` recebido no webhook.                |
| `QUOTE_NOT_FOUND`                | `quoteId` inexistente.                                               | Gerar nova cotação.                                 |
| `QUOTE_EXPIRED`                  | A cotação passou de `expiresAt`.                                     | Gerar nova cotação.                                 |
| `QUOTE_ALREADY_USED`             | A cotação já foi usada em outra compra.                              | Gerar nova cotação.                                 |
| `EXTERNAL_ID_CONFLICT`           | `externalId` já usado com outro corpo.                               | Usar outro `externalId`.                            |
| `SAVED_ADDRESS_NOT_FOUND`        | `addressId` inexistente.                                             | Conferir `buy.addresses[]`.                         |
| `SAVED_ADDRESS_NETWORK_MISMATCH` | O endereço salvo é de outra rede.                                    | Usar endereço da rede da compra.                    |
| `ADDRESS_INVALID_FOR_NETWORK`    | Endereço inválido para a rede.                                       | Conferir o endereço.                                |
| `ADDRESS_NOT_SAVED`              | Trava "só endereços salvos" ligada e o endereço não está salvo.      | Salvar o endereço no painel ou usar `addressId`.    |
| `ADDRESS_ON_HOLD`                | Endereço salvo ainda em carência.                                    | Aguardar até `activeAt`.                            |
| `ASSET_NOT_SUPPORTED`            | Ativo não suportado ou não liberado.                                 | Conferir `GET /crypto/options`.                     |
| `NETWORK_NOT_SUPPORTED`          | Rede não suportada para o ativo.                                     | Conferir `GET /crypto/options`.                     |
| `AMOUNT_BELOW_MIN`               | Valor abaixo de `buy.minAmount`.                                     | Aumentar o valor.                                   |
| `AMOUNT_ABOVE_MAX`               | Valor acima de `buy.maxAmountPerTx`.                                 | Dividir em compras menores.                         |
| `AMOUNT_TOO_LOW_FOR_NETWORK_FEE` | O valor não cobre a taxa e o gás da rede.                            | Aumentar o valor ou escolher outra rede.            |
| `INSUFFICIENT_BALANCE`           | Saldo BRL insuficiente.                                              | Depositar BRL antes de comprar.                     |
| `PAIR_MARGIN_NOT_CONFIGURED`     | O par não está configurado para a empresa.                           | Contatar a XGate.                                   |
| `PRICE_UNSTABLE`                 | Preço instável no momento. Nada foi debitado.                        | Tentar novamente em instantes.                      |
| `PRICE_STALE`                    | Preço de referência indisponível.                                    | Tentar novamente em instantes.                      |
| `NETWORK_FEE_UNAVAILABLE`        | Não foi possível estimar o gás da rede.                              | Tentar novamente ou usar outra rede.                |
| `RATE_LIMITED`                   | Muitas chamadas por minuto.                                          | Aguardar o `Retry-After`.                           |
| `DAILY_CAP_EXCEEDED`             | Teto diário de compra atingido.                                      | Aguardar o próximo dia ou ver `buy.dailyRemaining`. |
| `OUTFLOW_HOURLY_CAP_EXCEEDED`    | Teto horário de saída da tesouraria atingido.                        | Tentar novamente mais tarde.                        |
| `CRYPTO_TEMPORARILY_UNAVAILABLE` | Cripto temporariamente indisponível.                                 | Tentar novamente mais tarde.                        |
| `FEATURE_DISCONTINUED`           | Rota antiga de cripto, desligada em 29/10/2026.                      | Use a Compra e Venda de Cripto.                     |
| `FEATURE_STATUS_UNAVAILABLE`     | Não foi possível verificar o estado da descontinuação.               | Tentar novamente.                                   |

---

## Motivos de recusa da compra {#rejection-reasons}

Quando uma compra termina em `REJECTED`, o campo `rejection.reason` traz um dos motivos abaixo. Em todos eles, `rejection.refunded = true` significa que o BRL voltou integralmente ao saldo, taxa incluída.

| `rejection.reason`               | Significado                                   |
| :------------------------------- | :-------------------------------------------- |
| `INSUFFICIENT_BALANCE`           | Saldo BRL insuficiente.                       |
| `QUOTE_NOT_FOUND`                | Cotação inexistente.                          |
| `QUOTE_EXPIRED`                  | Cotação vencida.                              |
| `QUOTE_ALREADY_USED`             | Cotação já usada.                             |
| `PRICE_STALE`                    | Preço de referência indisponível.             |
| `PRICE_UNSTABLE`                 | Preço instável; nada foi debitado.            |
| `NETWORK_FEE_UNAVAILABLE`        | Gás da rede indisponível.                     |
| `AMOUNT_TOO_LOW_FOR_NETWORK_FEE` | Valor não cobre a taxa e o gás.               |
| `DAILY_CAP_EXCEEDED`             | Teto diário atingido.                         |
| `OUTFLOW_HOURLY_CAP_EXCEEDED`    | Teto horário de saída da tesouraria atingido. |
| `LIQUIDITY_UNAVAILABLE`          | Liquidez indisponível.                        |
| `CRYPTO_TEMPORARILY_UNAVAILABLE` | Cripto temporariamente indisponível.          |
| `APPROVAL_REJECTED`              | Recusada na fila de aprovação da XGate.       |
| `PROVIDER_REJECTED`              | Recusada pela custódia.                       |
| `SEND_FAILED`                    | Erro no envio; nada saiu.                     |
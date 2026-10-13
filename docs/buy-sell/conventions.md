---
sidebar_label: 'Convenções'
sidebar_position: 2
description: 'Regras que valem para todas as rotas /crypto: autenticação, IPs permitidos, permissões, formato de valores, erros, paginação e limites.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Convenções da API de Cripto

As regras abaixo valem para **todas** as rotas `/crypto/*`.

---

## Autenticação

Base URL e autenticação iguais ao resto da API:

```bash title="Base URL"
https://api.xgateglobal.com
```

| Header            | Valor                | Descrição                                                                                    |
| :---------------- | :------------------- | :------------------------------------------------------------------------------------------- |
| `Authorization`   | `Bearer <seu_token>` | Token obtido no <a href={useBaseUrl('/docs/authentication/login')}>login</a>.                |
| `Accept-Language` | `pt-BR` ou `en`      | *(Opcional)* Idioma das mensagens de erro e do comprovante. Padrão: `pt-BR`.                 |

A empresa é sempre a do token: não há parâmetro de empresa nas rotas.

---

## IPs permitidos

A empresa precisa ter a lista de IPs permitidos cadastrada no painel da XGate. A mesma lista usada para saque vale para toda a API de cripto.

| Situação                          | Resposta                      |
| :-------------------------------- | :---------------------------- |
| Empresa sem lista de IPs          | `403 ALLOWED_IPS_REQUIRED`    |
| Requisição de um IP fora da lista | `403 CLIENT_IP_NOT_ALLOWED`   |

---

## Permissões

O grupo do usuário da API precisa das permissões:

| Permissão        | Libera                                                                 |
| :--------------- | :--------------------------------------------------------------------- |
| `CRYPTO.VIEW`    | Consultar opções, estimativa, compras e comprovantes.                  |
| `CRYPTO.EXECUTE` | Cotar (`POST /crypto/quotes`) e comprar (`POST /crypto/purchases`).    |

Sem a permissão necessária: `403 PERMISSION_DENIED`.

---

## Valores em dinheiro

:::warning[Dinheiro é sempre string decimal]
Todo valor monetário trafega como **string decimal**, nunca como número: `"amount": "1500.00"`. Enviar número resulta em `400 AMOUNT_MUST_BE_STRING`.
:::

| Grandeza         | Casas decimais | Arredondamento        |
| :--------------- | :------------: | :-------------------- |
| BRL              | 2              | Para cima             |
| USDT / USDC      | 6              | Para baixo (entrega)  |
| `rate` (cotação) | 8              | —                     |

Datas seguem ISO 8601 em UTC (ex: `2026-10-13T14:03:52.114Z`).

---

## Formato de erro {#error-format}

Todo erro vem no mesmo envelope:

```json
{
  "reason": "INSUFFICIENT_BALANCE",
  "message": "Saldo insuficiente para a compra.",
  "traceId": "1-6710b8e4-3c1f2a9b7d5e4f6a8b9c0d1e"
}
```

| Campo     | Descrição                                                                                 |
| :-------- | :---------------------------------------------------------------------------------------- |
| `reason`  | Código estável do erro. **Use este campo na sua lógica.**                                 |
| `message` | Texto legível, em pt-BR por padrão ou em inglês com `Accept-Language: en`. Pode mudar.    |
| `traceId` | Protocolo para informar ao suporte da XGate.                                              |

A lista completa está em <a href={useBaseUrl('/docs/buy-sell/errors')}>Códigos de Erro</a>.

---

## Paginação

Listas são paginadas por cursor:

| Parâmetro | Descrição                                                         |
| :-------- | :---------------------------------------------------------------- |
| `limit`   | Itens por página, de 1 a 100. Padrão: 20.                         |
| `cursor`  | O `nextCursor` da página anterior. Omita na primeira página.      |

A resposta traz `{ "items": [...], "nextCursor": "..." }`. `nextCursor: null` indica a última página.

---

## Idempotência

A compra é idempotente pelo campo `externalId` (não existe header `Idempotency-Key`). Veja <a href={useBaseUrl('/docs/buy-sell/purchases/create')}>Comprar Cripto</a>.

---

## Limites

| Situação                                                         | Resposta                                       |
| :--------------------------------------------------------------- | :--------------------------------------------- |
| Excesso de chamadas por minuto em cotação, estimativa e compra   | `429 RATE_LIMITED` com header `Retry-After`    |
| Corpo da requisição acima de 256 KiB                             | `413 PAYLOAD_TOO_LARGE`                        |
| Serviço sobrecarregado                                           | `503 SERVICE_OVERLOADED` com `Retry-After`     |

Respeite o `Retry-After` (em segundos) antes de tentar de novo.

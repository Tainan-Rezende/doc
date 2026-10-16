# Portal da API: ajustes no rascunho da seção de cripto

2026-10-15 · Paulo Santos → quem está ajustando a documentação pública da API · rascunho conferido em https://tainan-rezende.github.io/doc/docs/intro (seção "Compra e Venda de Cripto" com 9 páginas, mais "Receber Webhooks") · base técnica: `docs/produto/doc-api-publica-compra-venda-2026-10-09.md` e o Swagger `GET /crypto/openapi.json`

## 1. Resumo

O rascunho está correto no conteúdo técnico. São quatro ajustes de produto, todos de escopo: **(1)** tirar toda menção a permissões, porque o cliente não configura isso; **(2)** em compras, documentar só a consulta de uma compra, sem a listagem e sem o comprovante; **(3)** os webhooks de compra e a consulta da compra vão para a aba **Webhooks**, no mesmo molde de "Depósitos Webhook" e "Saques Webhook"; **(4)** a venda de cripto entra, com a página "Vender", a consulta de uma venda e os webhooks de venda, mantendo o aviso de que a venda pela API é liberada em novembro de 2026. A seção 6 traz o sidebar final.

## 2. Tirar permissões

O integrador não vê nem configura permissão de grupo; quem libera é a XGate. Sai de todas as páginas qualquer menção a `CRYPTO.VIEW` e `CRYPTO.EXECUTE`:

| Página | O que sai |
| --- | --- |
| Convenções | A seção inteira "3. Permissões" (tabela com `CRYPTO.VIEW` / `CRYPTO.EXECUTE` e o `403 PERMISSION_DENIED`). As demais seções ficam, renumeradas. |
| Opções | A linha "Permissão: `CRYPTO.VIEW`". |
| Cotação e Estimativa | A coluna "Permissão" da tabela de rotas. |
| Comprar | A linha "Permission: `CRYPTO.EXECUTE`". |
| Consultar compra (página que muda de lugar, seção 4) | A linha "Permissão necessária: `CRYPTO.VIEW`". |
| Códigos de erro | Na tabela de significados, `PERMISSION_DENIED` vira "o usuário da API não tem acesso a esta operação; fale com a XGate", sem citar código de permissão. A seção "4. Permission and access-related reasons" sai (é repetição da tabela principal). |

`PERMISSION_DENIED` continua listado como reason de `403` nas tabelas de erro de cada rota; só o texto que explica deixa de citar permissões.

## 3. Compras: só a consulta de uma compra, sem comprovante

- **Sai a listagem.** `GET /crypto/purchases` (com `status`, `externalId`, `from`, `to`, `cursor`, `limit`) sai do portal, inclusive o exemplo Node que percorre páginas. Fica só `GET /crypto/purchases/{id}`, que vira a página "Consultar Compra" dentro da aba Webhooks (seção 4). Nela: header `Authorization`, path `id`, resposta `200` com o objeto da compra, erros `401 UNAUTHORIZED`, `403` (`COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`), `404 PURCHASE_NOT_FOUND` (id inexistente, fora do formato ou de outra empresa).
- **Sai a página "Comprovante"** (`GET /crypto/purchases/{id}/receipt`) inteira.
- **Referências a limpar:** no Visão geral, o passo "5. Receipt" do fluxo de compra sai, e o passo "4. Track" aponta para "Consultar Compra" e "Compras Webhook" na aba Webhooks; em Convenções, na seção de autenticação, "`Accept-Language` define o idioma das mensagens de erro e dos comprovantes" vira só "das mensagens de erro"; a seção "6. Paginação" sai (não sobra lista no portal); em Códigos de erro saem `RECEIPT_NOT_AVAILABLE` (409), `DASHBOARD_ONLY` (403) e `PURCHASE_API_ONLY` (400), que não acontecem nas rotas documentadas.
- A página "Comprar" fica como está, só sem a linha de permissão e trocando "através de `GET /crypto/purchases/{id}` ou dos webhooks de compra" pelos links novos da aba Webhooks.

## 4. Webhooks: compra e venda na aba principal

Hoje a página "Webhooks de Compra" está dentro de "Compra e Venda de Cripto". Ela muda de aba e ganha o mesmo desenho dos outros tipos:

| Aba Webhooks | Páginas |
| --- | --- |
| Receber Webhooks | como hoje, com os ajustes abaixo |
| Depósitos Webhook | Consultar Depósito · Reenviar Webhook (como hoje) |
| Saques Webhook | Consultar Saque · Reenviar Webhook (como hoje) |
| **Compras Webhook** (novo) | **Consultar Compra** (`GET /crypto/purchases/{id}`, conteúdo da seção 3) · **Receber webhooks de compra** (o conteúdo atual de "Webhooks de Compra": configuração do tipo `CRYPTO_PURCHASE`, envelope `{ id, type, createdAt, data }`, exemplo, tabela de eventos, regras) |
| **Vendas Webhook** (novo) | **Consultar Venda** (`GET /crypto/sales/{id}`) · **Receber webhooks de venda** (tipo `CRYPTO_SALE`), conteúdo na seção 5 |

Não existe "Reenviar Webhook" para compra e venda: não há rota de reenvio no crypto-v2. Deixar as duas pastas só com as duas páginas.

Ajustes na página **Receber Webhooks**: na lista de tipos, ao lado de `CRYPTO_PURCHASE`, entra `CRYPTO_SALE` ("mudanças de status de vendas de cripto; disponível a partir de novembro de 2026; só para empresas com venda liberada"), com link para "Vendas Webhook"; e a observação sobre o envelope próprio passa a citar os dois tipos (`CRYPTO_PURCHASE` e `CRYPTO_SALE`).

Na tabela de eventos de compra, acrescentar as duas linhas que faltam, para a lista bater com o catálogo do painel: `purchase.pending_payment` (status `PENDING_PAYMENT`, só compra aberta a partir de um depósito, aguardando o Pix) e `purchase.expired` (status `EXPIRED`, o depósito de origem não foi pago no prazo; final).

## 5. Venda de cripto: o que entra

Tudo com a faixa "A venda de cripto pela API será liberada em novembro de 2026", como o Visão geral já diz. Até lá `sale.enabled` vem `false` e `depositAddresses` vazio.

### 5.1 Página "Vender" (em Compra e Venda de Cripto, depois de "Comprar")

Texto base:

- Não existe pedido de venda nem `POST`. A XGate dá à empresa **um endereço fixo por ativo e rede**; a empresa envia USDT ou USDC de qualquer carteira para esse endereço, e **cada envio confirmado na rede vira uma venda**, a mercado, sem preço mínimo e sem devolução on-chain. Dez envios são dez vendas.
- Os endereços vêm em `GET /crypto/options`, bloco `sale`: `enabled`, `status` (`DISABLED` · `PROVISIONING` · `READY`), `minAmount { USDT, USDC }` e `depositAddresses[] { asset, network, address }`. A primeira consulta de uma empresa com venda liberada dispara a criação dos endereços: `status` fica `PROVISIONING` por alguns minutos e passa a `READY`.
- Aviso em destaque: enviar outro token, ou o token certo pela rede errada, é perda sem devolução. USDC não existe em TRON.
- O preço é fixado na liquidação; a taxa (XGate e indicação) é cobrada em cripto sobre a quantidade recebida; o BRL creditado é `netCryptoAmount × rate`.
- **Para onde vai o BRL** é configuração feita uma vez no painel da XGate (Compra/Venda › Configurações): saldo em BRL ou Pix para um beneficiário aprovado. A API não altera essa escolha; ela mostra o resultado em `settlement` de cada venda. Se o Pix não puder ser feito (beneficiário não aprovado, saque recusado ou falho), o valor cai no saldo BRL e a venda termina `SETTLED_TO_BALANCE` com o motivo em `settlement.fallbackReason`.
- Estados: `RECEIVED` → `SETTLING` → `SETTLED` ou `SETTLED_TO_BALANCE`. Venda suspensa em análise da XGate aparece como `RECEIVED` com `review.reason`.
- Acompanhar por "Consultar Venda" ou pelos webhooks `sale.*`. O integrador concilia pelo `txHash` do próprio envio.

Na página **Opções**, a linha `sale` da tabela deixa de ser "reservado, disponível em breve" e descreve os campos acima.

### 5.2 Página "Consultar Venda" (Webhooks › Vendas Webhook)

`GET https://api.xgateglobal.com/crypto/sales/{id}`, header `Authorization`, path `id`. `200` com o objeto da venda; erros `401 UNAUTHORIZED`, `403` (`COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`), `404 SALE_NOT_FOUND`.

Objeto da venda (também é o `data` dos webhooks):

| Campo | Tipo | Significado |
| --- | --- | --- |
| `id` | string | id da venda |
| `status` | string | `RECEIVED` (recebida e confirmada, aguardando preço) · `SETTLING` (preço congelado, crédito em andamento) · `SETTLED` (liquidada pela forma configurada; final) · `SETTLED_TO_BALANCE` (era Pix, caiu no saldo; final) |
| `asset`, `network` | string | ativo e rede |
| `depositAddress` | string | endereço fixo da empresa que recebeu |
| `sourceAddress` | string ou `null` | de onde a cripto saiu, quando a rede informa |
| `txHash` | string ou `null` | hash on-chain do envio |
| `cryptoAmount` | string | quantidade recebida (6 casas) |
| `rate` | string ou `null` | preço BRL por unidade, 8 casas, congelado na liquidação |
| `feeAmount`, `feeAsset` | string ou `null` | taxa em cripto sobre `cryptoAmount` |
| `netCryptoAmount` | string ou `null` | `cryptoAmount − feeAmount` |
| `grossAmount`, `netAmount` | string ou `null` | valor creditado em BRL (`netCryptoAmount × rate`, para baixo); hoje iguais |
| `settlement` | objeto | `type` (`BALANCE` ou `PIX_KEY`), `beneficiaryId`, `withdrawId` (saque Pix criado), `fallbackReason` (`PIX_SETTLEMENT_UNAVAILABLE` · `BENEFICIARY_NOT_ELIGIBLE` · `PAYOUT_REJECTED` · `PAYOUT_FAILED` · `PAYOUT_UNAVAILABLE` · `null`) |
| `review` | objeto ou `null` | `reason`: `BELOW_MINIMUM` · `COMPANY_UNAVAILABLE` · `COMPANY_BLOCKED` · `SELL_POLICY_MISSING` · `NET_NOT_POSITIVE` · `CONFIRMATIONS_TIMEOUT` · `CREDIT_REVIEW` |
| `receivedAt`, `settledAt`, `createdAt`, `updatedAt` | string | ISO 8601 UTC; `updatedAt` e `status` ordenam webhooks fora de ordem |

Exemplo:

```json
{
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
```

### 5.3 Página "Receber webhooks de venda" (Webhooks › Vendas Webhook)

Configuração igual à de compra: no painel › Webhooks, tipo **`CRYPTO_SALE`** ("Vendas de Cripto"), escolhendo os status. Mesmo envelope `{ id, type, createdAt, data }`, com `data` = objeto da venda.

| Evento (`type`) | Status no painel | Quando |
| --- | --- | --- |
| `sale.received` | `RECEIVED` | cripto recebida e confirmada no endereço fixo |
| `sale.settled` | `SETTLED` ou `SETTLED_TO_BALANCE` | BRL creditado; `data.status` diz qual dos dois e `data.settlement` diz como |

Mesmas regras do integrador da página de compra: um evento por mudança de status, entrega ao menos uma vez (tratar por `id`), ordenar por `data.updatedAt` e `data.status`, responder `200` rápido.

### 5.4 Códigos de erro

Entra `SALE_NOT_FOUND` (404) na tabela de significados: "id de venda inexistente, fora do formato ou de outra empresa".

## 6. Sidebar final

| Aba | Páginas |
| --- | --- |
| Compra e Venda de Cripto | Visão Geral · Convenções · Opções · Cotação e Estimativa · Comprar · **Vender** · Códigos de Erro |
| Webhooks | Receber Webhooks · Depósitos Webhook (Consultar Depósito, Reenviar Webhook) · Saques Webhook (Consultar Saque, Reenviar Webhook) · **Compras Webhook** (Consultar Compra, Receber webhooks de compra) · **Vendas Webhook** (Consultar Venda, Receber webhooks de venda) |

Saem da seção de cripto: "Compras › Consultar Compras" (vira Consultar Compra na aba Webhooks, só por id), "Compras › Comprovante" e "Webhooks de Compra" (vai para a aba Webhooks). As páginas legadas de cripto (Carteiras Crypto, Crypto com Conversão, Crypto Wallet) seguem no ar com o aviso de descontinuação até 29/10, como combinado.

## 7. Fontes

- Rascunho conferido: `/doc/docs/buy-sell/{overview, conventions, options, quotes, purchases/create, purchases/list, purchases/receipt, webhooks, errors}` e `/doc/docs/webhooks/receive`.
- Contrato: `GET /crypto/openapi.json` em dev; `crypto-v2/src/modules/crypto-sale/crypto-sale.schema.ts` (objeto da venda), `crypto-purchase.options.routes.ts` (bloco `sale`), `postback/src/modules/postback/postback-v2-domain.js` (tipos `CRYPTO_PURCHASE` e `CRYPTO_SALE`).
- Decisões: `docs/produto/doc-api-publica-compra-venda-2026-10-09.md` (seções 5 a 9); recebimento da venda configurado só no painel (12/10).

# Documentação pública da API: o que sai e o que entra com o Compra/Venda Cripto

2026-10-09, revisado em 12/10 contra os API Gateways REST de dev e prod · Paulo Santos → quem for ajustar a documentação pública da API (https://api.doc.xgateglobal.com) · base: PR 463 `feat/crypto-buy-sell` em `a6800e04`, revisado e aprovado em 09/10 · fonte de produto: `docs/produto/compra-venda-cripto-fonte-da-verdade-2026-09-28.md`

## 1. Para que serve e como ler

Este doc mapeia, página por página do portal atual, o que **sai**, o que **muda** e o que **entra** na documentação que os clientes usam para integrar via API, por causa do produto Compra/Venda Cripto e do fim da conversão e da custódia de cripto. Ele não substitui o Swagger: o contrato completo do serviço novo está em `GET https://api.xgateglobal.com/crypto/openapi.json` (página legível em `/crypto/docs`), e as tabelas de campos abaixo foram tiradas dele. Onde a decisão ainda é do Paulo ou precisa de confirmação do Fabricio, o item está marcado como **confirmar**.

Os paths deste doc são os da API pública (`https://api.xgateglobal.com`, API Gateway REST que repassa aos serviços), nunca os `/api/v1/...` internos. Em 12/10 conferi os dois gateways (dev `ff2yl9h2el`, prod `li2fuhv9k2`): toda rota legada citada aqui é `HTTP_PROXY` sem template de request/response e sem validator, então campo novo no corpo (`purchase{}`) e na resposta (`warnings`, `payerRuleViolation`, `data.purchase`) passam sem mexer no gateway. Os filhos novos de `/crypto` (`options`, `quotes`, `quotes/estimate`, `purchases`, `purchases/{id}`, `purchases/{id}/receipt`, `sales`, `sales/{id}`, `sales/{id}/receipt`, `openapi.json`, `docs`) existem em dev e **ainda não existem em prod**: nascem com o apply do Terraform do crypto-v2 em prod (`edge-public.tf`), que nunca rodou. E `GET /withdraw/beneficiaries` **não existe em nenhum gateway** (REST ou backoffice, dev ou prod): precisa de rota manual antes de ser documentado. Detalhe na seção 11.

Datas que organizam a publicação (fonte da verdade, seção 11):

- **14/10**: contrato da API de compra publicado e aviso aos integradores, 15 dias antes do corte. É a única data dura.
- **29/10 (30/10 03:00 UTC)**: corte. Saldos cripto internos sem escolha são vendidos em BRL; o campo `cryptocurrency` do depósito passa a ser ignorado; os fluxos legados de cripto respondem `410 FEATURE_DISCONTINUED`; a XGate não guarda mais cripto de empresa.
- **Novembro**: venda ligada (endereço fixo por empresa, `GET /crypto/sales`, webhooks `sale.*`), junto com o Cartão Global. Até lá, a seção de venda fica preparada mas não publicada.

Portanto, a publicação é em duas ondas: **onda 1 até 14/10** (seção nova de Compra, aviso de descontinuação com data nas páginas legadas, ajustes nas páginas que ficam) e **onda 2 em novembro** (Venda, beneficiários, webhooks `sale.*`). Em 29/10 as páginas legadas de cripto saem do menu. O portal tem três idiomas (pt-BR, en, es): toda mudança vale para os três. Os SDKs oficiais (`xgate` no NPM e `xgate/xgate-integration` no Composer) citados na Introdução também precisam ser revistos, mas isso fica fora deste doc.

## 2. Mapa do portal hoje × ação

| Página (sidebar) | Rota documentada | Ação | O que muda |
| --- | --- | --- | --- |
| Introdução `/docs/intro` | — | **Ajustar** | Tirar "conversão automática de FIAT para cripto" e "depósitos e saques em USDT e USDC". Entrar "compra e venda de USDT/USDC com o saldo em reais". |
| Autenticação › Login `/docs/authentication/login` | `POST /auth/token` | Mantém | Nada muda no login. |
| Clientes › Consultar / Criar / Atualizar | `GET`/`POST`/`PUT /customer…` | Mantém | — |
| Clientes › Chaves Pix (listar, adicionar, remover) | `/pix/customer/{id}/key…` | Mantém | — |
| Clientes › **Carteiras Crypto** `/docs/crypto/customer/wallet` | `GET /crypto/customer/{id}/wallet` | **Remover** (29/10) | Carteira de custódia por customer acaba. Depois do corte a rota responde `410 FEATURE_DISCONTINUED`. Ver seção 3. |
| Depósitos › FIAT › Moedas FIAT | `GET /deposit/company/currencies` | Mantém | — |
| Depósitos › FIAT › Criar Depósito `/docs/fiat/deposit/create` | `POST /deposit` | **Ajustar** | Entra o bloco opcional `purchase{}` (compra a partir do depósito, só API), o aviso de que `cryptocurrency` passa a ser ignorado, o campo `warnings` na resposta, os erros novos de política de pagador e o status `PAYER_REJECTED`. Ver seção 4.1. |
| Depósitos › **Crypto (com Conversão)** › Criptomoedas / Criar Depósito / Listar Redes / Cotação | `GET /deposit/company/cryptocurrencies`, `POST /deposit` com `cryptocurrency`, `GET /deposit/company/blockchain-networks`, `POST /deposit/conversion/tether` | **Remover** (29/10) | A conversão embutida no depósito acaba. Substituída pela compra (`POST /crypto/purchases`) e pela compra a partir do depósito (`purchase{}`). Ver seções 3 e 6. |
| Saques › FIAT › Moedas FIAT | `GET /withdraw/company/currencies` | Mantém | — |
| Saques › FIAT › Criar Saque `/docs/fiat/withdraw/create` | `POST /withdraw` | **Ajustar** | Entram os erros `422` de política de recebedor (`RECIPIENT_DOCUMENT_REQUIRED`, `RECIPIENT_TYPE_NOT_ALLOWED`, `PIX_POLICY_REQUIRES_PIX_V2`). Ver seção 4.2. |
| Saques › **Crypto (com Conversão)** › Criptomoedas / Saque (Crypto to FIAT) / Cotação | `GET /withdraw/company/cryptocurrencies`, `POST /withdraw` com `cryptocurrency` + `currency` + `pixKey`, `POST /withdraw/conversion/brl/pix` | **Remover** (29/10) | Saque USDT→PIX ao customer acaba (`410`). Sem substituto: a empresa não tem mais saldo cripto. |
| Saques › **Crypto (Wallet)** › Listar Redes / Criptomoedas / Cotação / Criar Saque | `GET /withdraw/company/blockchain-networks`, `GET /withdraw/company/cryptocurrencies`, `POST /withdraw/transaction/crypto/amount`, `POST /withdraw` com `cryptocurrency` + `blockchainNetwork` + `wallet` | **Remover** (29/10) | Saque cripto ao customer acaba (`410`). O que existe no lugar é a compra, que entrega USDT/USDC numa carteira **da empresa**. |
| Webhooks › Receber Webhooks `/docs/webhooks/receive` | configuração no painel + payload | **Ajustar** | Tipo `CRYPTOCURRENCY` sai do catálogo. Entram `CRYPTO_PURCHASE` e `CRYPTO_SALE` com envelope novo `{ id, type, createdAt, data }`. Os exemplos de "saque de USDT convertido para Pix", "Pix convertido para cripto" e "cripto para cripto" saem. Ver seção 8. |
| Webhooks › Depósitos Webhook › Consultar Depósito | `GET /deposit/{id}/details` | **Ajustar** | Saem os exemplos "Pix convertido para Crypto" e "Crypto" (e o `idempotencyKey` com `txHash`). Fica só o depósito Pix em BRL. Campos novos a confirmar (seção 11). |
| Webhooks › Depósitos Webhook › Reenviar Webhook | `…/resend/webhook` | Mantém | — |
| Webhooks › Saques Webhook › Consultar Saque | `GET /withdraw/{id}/details` | **Ajustar** | Saem os exemplos "Crypto para Fiat" e "Crypto para Crypto" e o `gasFeeAmount`. Fica só o saque Pix. |
| Webhooks › Saques Webhook › Reenviar Webhook | — | Mantém | — |
| Empresa › Consultar Saldo `/docs/company/get-balance` | `POST /balance/company` | **Ajustar** | Sai a opção 3 (`cryptocurrency` no body) e a linha de saldo cripto na resposta: depois do corte a empresa só tem saldo BRL. Ver seção 4.3. |
| Empresa › Criar Subconta | `POST /company/subaccount` | **Ajustar** | As listas de taxa `blockchainNetworks` e `cryptocurrencies` em `deposit` e `withdraw` perdem função. Manter só `currencies` (**confirmar** com o Fabricio se o backend passa a ignorar ou ainda exige). |
| Empresa › Webhook na Subconta | — | Mantém | — |
| Empresa › Liberar IP (Saque) `/docs/company/sub-account-ip` | lista de IPs permitidos | **Ajustar** | A mesma lista de IPs passa a ser obrigatória para toda a API de cripto (`403 ALLOWED_IPS_REQUIRED` sem lista, `403 CLIENT_IP_NOT_ALLOWED` fora dela). Renomear para "IPs permitidos (saque, saldo e cripto)". |
| **Compra e Venda de Cripto** (seção nova) | `/crypto/*` | **Novo** | Seções 5 a 10. |

## 3. O que sai: descontinuação dos fluxos legados de cripto

Os fluxos abaixo deixam de existir no corte (29/10). Antes dele continuam funcionando; por isso a onda 1 só coloca um **aviso com a data** no topo de cada página, e a remoção das páginas é em 29/10.

| Fluxo legado | Rota(s) | Comportamento depois do corte |
| --- | --- | --- |
| Carteira de custódia do customer | `GET /crypto/customer/{id}/wallet` | `410 { "reason": "FEATURE_DISCONTINUED", "message": "Esta funcionalidade de cripto foi descontinuada." }` |
| Saque cripto ao customer (carteira externa) | `POST /withdraw` com `cryptocurrency` + `blockchainNetwork` + `wallet`; `POST /withdraw/transaction/crypto/amount` | `410 FEATURE_DISCONTINUED` |
| Saque USDT/USDC → PIX ao customer | `POST /withdraw` com `cryptocurrency` + `currency` + `pixKey`; `POST /withdraw/conversion/{fiat}/{type}` | `410 FEATURE_DISCONTINUED` |
| Conversão (BRL → cripto) pelo withdraw | `POST /withdraw/conversion/{crypto}` e rotas `/company/conversion/*` | `410 FEATURE_DISCONTINUED` |
| Depósito com conversão | `POST /deposit` com `cryptocurrency` | **Não é erro.** O depósito é criado em BRL e a resposta traz `warnings[{ code: "CRYPTOCURRENCY_FIELD_IGNORED", message }]`. Ver 4.1. |
| Saldo cripto da empresa | `POST /balance/company` | A empresa deixa de ter saldo em USDT/USDC. Ver 4.3. |
| Webhook tipo `CRYPTOCURRENCY` | catálogo do painel | Sai do catálogo de eventos. Quem tinha o tipo configurado deixa de receber. |

Regras de leitura para o integrador:

- O `410` vem com `{ reason, message }`; a mensagem sai em pt-BR por padrão e em inglês com `Accept-Language: en`.
- Se a XGate não conseguir verificar o estado da descontinuação, essas mesmas rotas respondem `503 FEATURE_STATUS_UNAVAILABLE` ("tente novamente"). Vale só para as rotas de cripto; depósito e saque Pix nunca são afetados.
- As listagens `GET /deposit/company/cryptocurrencies`, `GET /deposit/company/blockchain-networks`, `GET /withdraw/company/cryptocurrencies` e `GET /withdraw/company/blockchain-networks` continuam respondendo, mas não servem para nada: saem da documentação.
- O saldo cripto que a empresa tinha é tratado pelo painel (migração: retirar para um endereço próprio ou vender em BRL); quem não escolher tem o saldo vendido em BRL na cotação do dia do corte. Isso não passa pela API.

## 4. O que muda nas páginas que ficam

### 4.1 `POST /deposit` (Depósitos › FIAT › Criar Depósito)

O depósito continua um Pix em BRL para um customer. Quatro mudanças:

**(a) Campo `cryptocurrency` ignorado a partir do corte.** O depósito é criado em BRL e a resposta `201` ganha `warnings`:

```json
{
  "message": "Pix Gerado com Sucesso",
  "data": { "status": "WAITING_PAYMENT", "code": "00020126…", "id": "…", "customerId": "…", "externalId": "…" },
  "warnings": [
    { "code": "CRYPTOCURRENCY_FIELD_IGNORED",
      "message": "O campo cryptocurrency não é mais suportado; o depósito foi criado em BRL. Use purchase{} para comprar cripto." }
  ]
}
```

Documentar: "envie só `currency`; `cryptocurrency` é ignorado e gera `warnings`". `data.externalId` volta quando foi enviado (hoje a página não mostra).

**(b) Bloco `purchase{}` (só canal API).** Comprar USDT/USDC assim que o Pix for pago, em nome da empresa, com o próprio saldo. Detalhe completo na seção 10. Resumo do contrato:

```json
{
  "amount": "150.00",
  "customerId": "…",
  "currency": { "_id": "…", "name": "BRL", "type": "PIX", "symbol": "R$" },
  "externalId": "pedido-7781",
  "purchase": { "asset": "USDT", "network": "TRON", "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE" }
}
```

Resposta `201` igual à de hoje, mais `data.purchase: { "id": "<purchaseId>", "status": "PENDING_PAYMENT" }`. Com `purchase{}`, `externalId` é obrigatório.

**(c) Erros novos de política de pagador (`422 { reason, message }`).** Cada empresa pode ter regra de depósito pela API: tipo de pagador (PF/PJ), titularidade (documento do customer ou CNPJ da empresa) e limites. Reasons: `PAYER_TYPE_NOT_ALLOWED`, `DEPOSIT_TITULARITY_CUSTOMER_DOCUMENT_REQUIRED`, `PAYER_DOCUMENT_MISSING`, `PIX_POLICY_REQUIRES_PIX_V2`, `PIX_POLICY_PROVIDER_WITHOUT_PAYER`. Se a política da empresa não estiver configurada: `503 PIX_POLICY_NOT_CONFIGURED`.

**(d) Status novo `PAYER_REJECTED`.** Quando um Pix pago viola a regra de pagador que não pôde ser barrada na cobrança (ex.: PF/PJ sem documento do pagador), o depósito fica `PAYER_REJECTED` e o valor é devolvido ao pagador. `GET /deposit/{id}` e a listagem devolvem `payerRuleViolation { reason, at, refundedAt, payer { name, document, bank } }`. **Confirmar** com o Fabricio se esse status é entregue pelo webhook `CURRENCY` (hoje o catálogo de eventos de depósito não o lista).

A página também cita `PENDING` como status inicial e mostra `WAITING_PAYMENT` no exemplo; o correto é `WAITING_PAYMENT`.

### 4.2 `POST /withdraw` (Saques › FIAT › Criar Saque)

O saque Pix pela API continua igual (`amount`, `customerId`, `currency`, `pixKey`, `externalId`, `identifiedDocumentPix`). Entram erros `422 { reason, message }` da política de recebedor da empresa (tipo PF/PJ do favorecido e titularidade): `RECIPIENT_DOCUMENT_REQUIRED`, `RECIPIENT_TYPE_NOT_ALLOWED`, `PIX_POLICY_REQUIRES_PIX_V2`. O `401` por API de saque bloqueada para a empresa (`COMPANY_WITHDRAW_API_IS_BLOCKED`) já existia e vale documentar. A página também corrigir: `currency.symbol` está como `number` (é `string`) e o exemplo de código posta em `/withdraw/conversion/brl/pix` (rota que sai).

### 4.3 `POST /balance/company` (Empresa › Consultar Saldo)

Depois do corte a empresa só tem saldo em BRL. Sai a "Opção 3: apenas Crypto" e sai a linha `{ "cryptocurrency": { "name": "USDT", … }, "totalAmount": … }` dos exemplos. O que a empresa compra vai para a carteira dela, nunca para um saldo na XGate. **Confirmar** com o Fabricio se a linha cripto some da resposta ou volta zerada no período de transição.

### 4.4 `GET /deposit/{id}/details` e `GET /withdraw/{id}/details`

Ficam só os exemplos Pix em BRL. Saem: `cryptocurrency{}` como perna de conversão, `idempotencyKey` com `txHash`, `blockchainNetwork`, `gasFeeAmount`. O detalhe do depósito passa a poder trazer `purchase { purchaseId, status }` quando a compra foi aberta por `purchase{}` (**confirmar** o nome exato dos campos nessa rota).

### 4.5 Receber Webhooks

Além do catálogo novo (seção 8), a página hoje diz que o payload tem `txHash` "apenas em operações 100% cripto" e `name` pode ser `USDT`: tudo isso sai. O payload legado fica só o de Pix em BRL (`id, status, name: BRL, type: PIX, amount, operation, customerId, externalId`).

## 5. O que entra: seção "Compra e Venda de Cripto"

Seção nova no sidebar, no mesmo nível de Depósitos e Saques. Sugestão de páginas: Visão geral · Convenções · Opções (`GET /crypto/options`) · Cotação e estimativa · Comprar · Consultar compras · Comprovante · Compra a partir do depósito · Webhooks de compra · (onda 2) Vender · Consultar vendas · Beneficiários · Webhooks de venda · Códigos de erro.

### Visão geral (texto para o portal)

A empresa tem saldo em reais (BRL) na XGate. Com a API ela **compra** USDT ou USDC usando esse saldo e a XGate envia a cripto para a carteira que a empresa indicar (declarada como dela). Para **vender**, a empresa envia USDT/USDC para um endereço fixo que a XGate dá a ela (um por rede); cada envio confirmado vira uma venda e o valor em reais cai no saldo ou vai por Pix para um beneficiário aprovado, conforme a configuração da empresa no painel. Não existe saldo cripto na XGate e o customer da empresa não aparece em nenhuma ponta.

Ativos e redes: `USDT` em `POLYGON`, `ETHEREUM`, `TRON` e `SOLANA`; `USDC` em `POLYGON`, `ETHEREUM` e `SOLANA` (não existe USDC em TRON; BSC saiu). Os pares liberados para a empresa vêm em `GET /crypto/options`.

Habilitação por empresa (a XGate liga no backoffice): cripto ligada (`403 CRYPTO_DISABLED`), cripto pela API ligada (`403 CRYPTO_API_DISABLED`), compra ligada (`403 BUY_DISABLED`). Compra e venda são liberadas separadamente.

### Convenções (valem para todo `/crypto/*`)

- Base URL e autenticação iguais ao resto da API: `https://api.xgateglobal.com`, `Authorization: Bearer <token>` do login. A empresa é sempre a do token.
- A empresa precisa ter a lista de IPs permitidos cadastrada no painel (`403 ALLOWED_IPS_REQUIRED` sem lista; `403 CLIENT_IP_NOT_ALLOWED` fora dela).
- Permissões do grupo do usuário da API: `CRYPTO.VIEW` para consultar (opções, estimativa, compras, vendas, comprovantes) e `CRYPTO.EXECUTE` para cotar e comprar. Sem a permissão: `403 PERMISSION_DENIED`. (**Confirmar** com o Fabricio como o grupo de integração recebe essas permissões.)
- **Dinheiro é sempre string decimal**, nunca número: `"amount": "1500.00"`. Número → `400 AMOUNT_MUST_BE_STRING`. BRL com 2 casas; USDT e USDC com 6; `rate` com 8. O valor em BRL arredonda para cima, a cripto entregue para baixo.
- Datas em ISO 8601 UTC.
- Erro sempre no envelope `{ "reason", "message", "traceId" }`. `reason` é o código estável; `message` sai em pt-BR, ou em inglês com `Accept-Language: en`; `traceId` é o protocolo para o suporte.
- Listas paginadas por cursor: `limit` (1 a 100, padrão 20) e `cursor` = `nextCursor` da página anterior; `nextCursor: null` é a última página.
- Idempotência da compra por `externalId` (não há header `Idempotency-Key`).
- Limite de chamadas por empresa por minuto em cotação, estimativa e compra: `429 RATE_LIMITED` com `Retry-After`.
- Corpo acima de 256 KiB: `413 PAYLOAD_TOO_LARGE`. Serviço sobrecarregado: `503 SERVICE_OVERLOADED` com `Retry-After`.

## 6. Endpoints de compra (onda 1)

### `GET /crypto/options` · `CRYPTO.VIEW`

O que a empresa pode fazer agora. Resposta `200`:

| Campo | Tipo | Significado |
| --- | --- | --- |
| `assets[].asset` | `USDT` \| `USDC` | ativo |
| `assets[].feeRate` | string decimal ou `null` | taxa de compra (XGate + indicação) sobre a quantidade cripto; é a base de `feeAmount` |
| `assets[].spreadRate` | string decimal ou `null` | margem do par embutida no `rate` (`rate = ask × (1 + spreadRate)`) |
| `assets[].networks[].network` | enum rede | rede disponível para o ativo |
| `assets[].networks[].networkFee` | string (6 casas) ou `null` | gás estimado da rede, no próprio ativo, descontado da entrega; `null` quando indisponível ou quando a regra da empresa é percentual |
| `assets[].networks[].networkFeeAsset` | `USDT` \| `USDC` | ativo em que o gás é cobrado |
| `buy.enabled` | boolean | compra liberada |
| `buy.minAmount` | string BRL | compra mínima |
| `buy.maxAmountPerTx` | string BRL ou `null` | máximo por compra |
| `buy.dailyCap` / `buy.dailyRemaining` | string BRL ou `null` | teto diário e quanto resta |
| `buy.totpThreshold` | string BRL ou `null` | só painel; não vale na API |
| `buy.autoApproval` | boolean | `true` = a compra não passa pela fila de aprovação da XGate |
| `buy.addresses[]` | lista | endereços salvos da empresa: `addressId, alias, address, network, source (MANUAL|CARD), addedAt, activeAt`; o `addressId` vale como destino em `POST /crypto/purchases` |
| `savedAddressesOnly.enabled` | boolean | trava "só endereços salvos" ligada pela empresa no painel |
| `savedAddressesOnly.newAddressHoldHours` | inteiro | carência (horas) de endereço novo com a trava ligada (24) |
| `quoteTtlSeconds` | inteiro | validade da cotação (30) |
| `sale` | objeto | onda 2: `enabled`, `status` (`DISABLED` \| `PROVISIONING` \| `READY`), `minAmount { USDT, USDC }`, `depositAddresses[] { asset, network, address }` |

Erros: `400 VALIDATION_FAILED`, `401 UNAUTHORIZED`, `403 PERMISSION_DENIED | COMPANY_MISMATCH | COMPANY_BLOCKED | ALLOWED_IPS_REQUIRED | CLIENT_IP_NOT_ALLOWED | CRYPTO_DISABLED | CRYPTO_API_DISABLED`, `503 CONFIGURATION_UNAVAILABLE | SERVICE_OVERLOADED`.

### `POST /crypto/quotes` · `CRYPTO.EXECUTE` e `POST /crypto/quotes/estimate` · `CRYPTO.VIEW`

Mesmo corpo: `{ "asset": "USDT", "network": "TRON", "amount": "1500.00" }`. `amount` é o total em BRL que será debitado, sem taxa embutida (a taxa é cobrada na cripto).

- `/quotes` → `201` com `quoteId` (preço garantido por `quoteTtlSeconds`), para usar em `POST /crypto/purchases`. Pedir e não usar não custa nada.
- `/quotes/estimate` → `200` sem `quoteId`/`expiresAt`, com `estimatedAt`; nada é reservado. Serve para mostrar o "≈" antes de comprar.

Resposta:

```json
{
  "quoteId": "l3m8Qm1n0pV2cXk5dY9sTg4hWz7aB6eR1uJ0oK2qF3i",
  "expiresAt": "2026-10-13T14:03:52.114Z",
  "asset": "USDT", "network": "TRON",
  "amount": "1500.00",
  "rate": "5.45400000",
  "cryptoAmount": "275.027502",
  "feeAmount": "4.125414", "feeAsset": "USDT",
  "networkFee": "0.012000",
  "deliveredAmount": "270.890088"
}
```

Conta: `cryptoAmount = amount ÷ rate` (para baixo, 6 casas); `feeAmount` = taxa sobre `cryptoAmount` (para cima, no próprio ativo); `deliveredAmount = cryptoAmount − feeAmount − networkFee`. **A taxa nunca é cobrada em BRL.**

Erros: `400 VALIDATION_FAILED | AMOUNT_MUST_BE_STRING`, `403` (os da tabela acima + `BUY_DISABLED`), `422 ASSET_NOT_SUPPORTED | NETWORK_NOT_SUPPORTED | AMOUNT_BELOW_MIN | AMOUNT_ABOVE_MAX | AMOUNT_TOO_LOW_FOR_NETWORK_FEE | PAIR_MARGIN_NOT_CONFIGURED | PRICE_UNSTABLE`, `429 RATE_LIMITED`, `503 PRICE_STALE | NETWORK_FEE_UNAVAILABLE | CONFIGURATION_UNAVAILABLE | SERVICE_OVERLOADED`.

### `POST /crypto/purchases` · `CRYPTO.EXECUTE`

Duas formas, sem misturar campos:

```json
{ "externalId": "pedido-7781", "quoteId": "l3m8Qm1n…", "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE" }
```

```json
{ "externalId": "pedido-7782", "asset": "USDT", "network": "TRON", "amount": "1500.00", "addressId": "66f1a2b3c4d5e6f708192a3b" }
```

| Campo | Regra |
| --- | --- |
| `externalId` | obrigatório; 1–128 caracteres ASCII imprimíveis, sem `/`, não começa com `$`; único por empresa. Mesmo `externalId` + mesmo corpo → `200` com a compra já criada; corpo diferente → `409 EXTERNAL_ID_CONFLICT`. Compra recusada fica registrada com o `externalId`: para tentar de novo, use outro. |
| `address` ou `addressId` | exatamente um dos dois. `address` = carteira de destino declarada da empresa, válida na rede, sem memo/tag. `addressId` = endereço salvo (`buy.addresses[]`). |
| `quoteId` | forma com cotação; não pode vir com `asset`/`network`/`amount` (`400 CONFLICTING_FIELDS`). |
| `asset`, `network`, `amount` | forma a mercado (preço do instante da execução); os três obrigatórios sem `quoteId`. |

Resposta `201` depois que preço e débito do BRL foram fixados (status `EXECUTING`). Daí: sem aprovação automática a compra vai para a fila da XGate (`PENDING_APPROVAL`, o preço não muda); com aprovação automática segue até `DELIVERED`. Acompanhar por `GET /crypto/purchases/{id}` ou pelos webhooks `purchase.*`. Pela API não há TOTP: a proteção é token + IPs permitidos + fila de aprovação.

Objeto da compra (também é o `data` dos webhooks):

| Campo | Tipo | Significado |
| --- | --- | --- |
| `id`, `externalId` | string | identificadores (XGate e empresa) |
| `status` | enum | `PENDING_PAYMENT` (só compra a partir do depósito) · `EXECUTING` · `PENDING_APPROVAL` · `DELIVERED` · `REJECTED` · `EXPIRED` |
| `channel` | enum | `API` · `DASHBOARD` · `DEPOSIT` |
| `asset`, `network`, `address` | — | destino |
| `amount` | string BRL ou `null` | total debitado do saldo |
| `rate` | string (8 casas) ou `null` | preço de 1 unidade em BRL, fixado em `executedAt` |
| `cryptoAmount` | string (6 casas) ou `null` | `amount ÷ rate` |
| `feeAmount`, `feeAsset` | string ou `null` | taxa XGate + indicação, cobrada em cripto (`feeAsset` = o ativo) |
| `networkFee` | string ou `null` | gás descontado da entrega |
| `deliveredAmount` | string ou `null` | o que chega na carteira |
| `quoteId` | string ou `null` | cotação usada; `null` a mercado |
| `depositId` | string ou `null` | depósito de origem quando `channel = DEPOSIT` |
| `approval` | objeto | `required` (bool), `decision` (`APPROVED` \| `REJECTED` \| `AUTO` \| `null`), `decidedAt` |
| `delivery` | objeto | `status` (`WAITING_APPROVAL` · `QUEUED` · `SUBMITTED` · `CONFIRMING` · `CONFIRMED` · `UNDER_REVIEW` · `null`), `txHash`, `confirmedAt` |
| `rejection` | objeto ou `null` | em `REJECTED`: `reason` (ver seção 9), `message` (idioma do `Accept-Language`), `refunded` (`true` = BRL voltou integralmente ao saldo) |
| `executedAt`, `createdAt`, `updatedAt` | ISO | — |

Erros do `POST`: `400 VALIDATION_FAILED | AMOUNT_MUST_BE_STRING | CONFLICTING_FIELDS`; `401 UNAUTHORIZED`; `403 PERMISSION_DENIED | COMPANY_MISMATCH | COMPANY_BLOCKED | ALLOWED_IPS_REQUIRED | CLIENT_IP_NOT_ALLOWED | CRYPTO_DISABLED | CRYPTO_API_DISABLED | BUY_DISABLED`; `404 SAVED_ADDRESS_NOT_FOUND | QUOTE_NOT_FOUND`; `409 EXTERNAL_ID_CONFLICT | QUOTE_EXPIRED | QUOTE_ALREADY_USED`; `422 ASSET_NOT_SUPPORTED | NETWORK_NOT_SUPPORTED | PAIR_MARGIN_NOT_CONFIGURED | AMOUNT_BELOW_MIN | AMOUNT_ABOVE_MAX | ADDRESS_INVALID_FOR_NETWORK | ADDRESS_NOT_SAVED | ADDRESS_ON_HOLD | SAVED_ADDRESS_NETWORK_MISMATCH | AMOUNT_TOO_LOW_FOR_NETWORK_FEE | INSUFFICIENT_BALANCE | PRICE_UNSTABLE`; `429 RATE_LIMITED | DAILY_CAP_EXCEEDED | OUTFLOW_HOURLY_CAP_EXCEEDED`; `503 PRICE_STALE | NETWORK_FEE_UNAVAILABLE | CRYPTO_TEMPORARILY_UNAVAILABLE | CONFIGURATION_UNAVAILABLE | SERVICE_OVERLOADED`. Recusa na execução (saldo, limites, preço, cotação vencida) responde o erro **e** deixa a compra registrada como `REJECTED`.

### `GET /crypto/purchases` e `GET /crypto/purchases/{id}` · `CRYPTO.VIEW`

Lista da mais recente para a mais antiga; filtros `status`, `externalId` (exato), `from`/`to` (intervalo inclusivo em `createdAt`), `cursor`, `limit`. Resposta `{ items[], nextCursor }`. Por id: `404 PURCHASE_NOT_FOUND` para id inexistente, fora do formato ou de outra empresa.

### `GET /crypto/purchases/{id}/receipt` · `CRYPTO.VIEW`

Comprovante em HTML, gerado na hora: `200 { "htmlTemplate": "<html>…" }`. Só compra `DELIVERED`; senão `409 RECEIPT_NOT_AVAILABLE`. Idioma pelo `Accept-Language` (pt-BR padrão, en).

## 7. Venda (onda 2, novembro)

Preparar as páginas agora; publicar quando a venda for ligada em produção. Decisão mantida em 12/10: **a forma de receber o BRL da venda (saldo em BRL ou Pix para um beneficiário aprovado) é configurada só no painel da XGate, uma vez por empresa, com autenticador.** A API não altera essa escolha; ela mostra o resultado em `settlement` de cada venda.

Texto base para a página "Vender":

- A XGate dá à empresa **um endereço fixo por ativo × rede** (`GET /crypto/options → sale.depositAddresses[] { asset, network, address }`). Os endereços nascem na primeira consulta de uma empresa com venda liberada: `sale.status` passa por `PROVISIONING` até `READY`.
- **Não existe pedido de venda nem `POST /crypto/sales`.** Todo envio confirmado na rede para um endereço fixo vira uma venda a mercado, sem preço mínimo e sem devolução on-chain. Dez envios são dez vendas. Venda mínima por ativo em `sale.minAmount`. Enviar outro token ou outra rede é perda.
- O preço é congelado na liquidação; a taxa (XGate + indicação) é cobrada em cripto sobre a quantidade recebida; o BRL creditado é `netCryptoAmount × rate`.
- Estados: `RECEIVED` → `SETTLING` → `SETTLED` (liquidada pela forma configurada) ou `SETTLED_TO_BALANCE` (a forma era Pix, mas o valor caiu no saldo; `settlement.fallbackReason` explica). Venda suspensa em análise da XGate aparece como `RECEIVED` com `review.reason`. Se o beneficiário não estiver mais aprovado ou o Pix falhar, a venda cai no saldo BRL; nunca fica presa.
- O integrador concilia pelo `txHash` do próprio envio; `sourceAddress` ajuda quando a rede o informa.

| Rota | Permissão | O que documentar |
| --- | --- | --- |
| `GET /crypto/options` | `CRYPTO.VIEW` | Bloco `sale`: `enabled`, `status` (`DISABLED` \| `PROVISIONING` \| `READY`), `minAmount { USDT, USDC }`, `depositAddresses[]`. |
| `GET /crypto/sales` | `CRYPTO.VIEW` | Lista da mais recente para a mais antiga. Filtros `status`, `asset`, `network`, `txHash` (exato), `from`/`to`, `cursor`, `limit` (1–100, padrão 20). `{ items[], nextCursor }`. |
| `GET /crypto/sales/{id}` | `CRYPTO.VIEW` | Uma venda. Id inexistente ou de outra empresa → `404 SALE_NOT_FOUND`. |
| `GET /crypto/sales/{id}/receipt` | `CRYPTO.VIEW` | `{ htmlTemplate }` só em `SETTLED`/`SETTLED_TO_BALANCE`; senão `409 RECEIPT_NOT_AVAILABLE`. Na venda por Pix traz beneficiário, chave mascarada, id do saque e E2E. |
| `GET /withdraw/beneficiaries?use=CRYPTO_SALE` | `WITHDRAW_BENEFICIARY.VIEW` | **Só leitura.** Beneficiários aprovados que podem receber venda, para o integrador entender o `settlement.beneficiaryId`. Query: `status`, `use` (`PAYOUT` retirada, `CRYPTO_SALE` venda; com `use`, só `APPROVED`), `cursor`, `limit` (1–200, padrão 50). Item: `id, type (SAME_OWNER \| OWNER_PF \| THIRD_PARTY_PJ \| THIRD_PARTY_PF), status (PENDING_REVIEW \| APPROVED \| REJECTED \| REVOKED \| DEACTIVATED), pixKey { key, type }, holderName, holderDocument, relationship, reviewNote, createdBy { id, email }, reviewedAt, contractFileId, createdAt, updatedAt, usableFor`. Cadastro, desativação e reativação ficam no painel, com análise da XGate. |

O que **não** existe via API, e como responde se o integrador tentar: `POST /crypto/sales` → `404 ROUTE_NOT_FOUND`; `GET`/`PUT /crypto/dashboard/settings` com token de API → `403 DASHBOARD_ONLY` (não documentar essa rota); `POST /withdraw/beneficiaries` com token de API → sem permissão (`WITHDRAW_BENEFICIARY.MANAGE` é do painel).

Objeto da venda (também é o `data` dos webhooks `sale.*`):

| Campo | Tipo | Significado |
| --- | --- | --- |
| `id` | string | id da venda |
| `status` | enum | `RECEIVED` (recebida e confirmada, aguardando preço; inclui a suspensa em análise, com `review`) · `SETTLING` · `SETTLED` · `SETTLED_TO_BALANCE` (era Pix, caiu no saldo) |
| `asset`, `network` | — | — |
| `depositAddress` | string | endereço fixo da empresa que recebeu |
| `sourceAddress` | string ou `null` | de onde a cripto saiu (quando a rede informa) |
| `txHash` | string ou `null` | hash on-chain; é a chave de conciliação do integrador |
| `cryptoAmount` | string (6 casas) | quantidade recebida |
| `rate` | string (8 casas) ou `null` | preço BRL congelado na liquidação |
| `feeAmount`, `feeAsset` | string ou `null` | taxa em cripto sobre `cryptoAmount` |
| `netCryptoAmount` | string ou `null` | `cryptoAmount − feeAmount` |
| `grossAmount`, `netAmount` | string BRL ou `null` | valor creditado (`netCryptoAmount × rate`, para baixo); hoje iguais |
| `settlement` | objeto | `type` (`BALANCE` \| `PIX_KEY`), `beneficiaryId`, `withdrawId` (saque Pix criado), `fallbackReason` (`PIX_SETTLEMENT_UNAVAILABLE` · `BENEFICIARY_NOT_ELIGIBLE` · `PAYOUT_REJECTED` · `PAYOUT_FAILED` · `PAYOUT_UNAVAILABLE` · `null`) |
| `review` | objeto ou `null` | `reason`: `BELOW_MINIMUM` · `COMPANY_UNAVAILABLE` · `COMPANY_BLOCKED` · `SELL_POLICY_MISSING` · `NET_NOT_POSITIVE` · `CONFIRMATIONS_TIMEOUT` · `CREDIT_REVIEW` |
| `receivedAt`, `settledAt`, `createdAt`, `updatedAt` | ISO | `updatedAt` + `status` ordenam webhooks fora de ordem |

Pix como forma de recebimento depende de a XGate liberar o tipo para a empresa e de ligar a liquidação por Pix no ambiente; sem isso toda venda cai no saldo (`settlement.type = BALANCE`). O portal descreve os dois caminhos e diz que a disponibilidade do Pix é por empresa.

## 8. Webhooks novos: `CRYPTO_PURCHASE` e `CRYPTO_SALE`

Configuração igual à de hoje (painel › Webhooks › escolher os eventos). Dois tipos novos no catálogo: **Compras de Cripto** (`CRYPTO_PURCHASE`) e **Vendas de Cripto** (`CRYPTO_SALE`). Eles só aparecem para empresa com cripto liberada. O tipo `CRYPTOCURRENCY` sai.

O envelope é **diferente do legado** (que é plano, com `id, status, amount, operation…`). Os eventos de cripto vêm assim:

```json
{
  "id": "<eventId único do evento>",
  "type": "purchase.delivered",
  "createdAt": "2026-10-13T14:11:40.031Z",
  "data": { "...objeto da compra, igual ao GET /crypto/purchases/{id}..." }
}
```

| Tipo configurado | Evento (`type`) | Status escolhido no painel | Quando |
| --- | --- | --- | --- |
| `CRYPTO_PURCHASE` | `purchase.pending_payment` | `PENDING_PAYMENT` | só compra a partir do depósito: criada, aguardando o Pix |
| | `purchase.executing` | `EXECUTING` | BRL debitado (em geral antes do `201` do `POST`) |
| | `purchase.pending_approval` | `PENDING_APPROVAL` | entrou na fila de aprovação da XGate |
| | `purchase.delivered` | `DELIVERED` | cripto confirmada na rede; `data.delivery.txHash` preenchido; final |
| | `purchase.rejected` | `REJECTED` | não entregue; `data.rejection { reason, message, refunded }`; final |
| | `purchase.expired` | `EXPIRED` | só compra a partir do depósito: Pix não pago no prazo; final |
| `CRYPTO_SALE` (onda 2) | `sale.received` | `RECEIVED` | cripto recebida e confirmada no endereço fixo |
| | `sale.settled` | `SETTLED` ou `SETTLED_TO_BALANCE` | BRL creditado; `data.status` diz qual dos dois; `data.settlement` traz como |

Regras para o integrador: um evento por mudança de status, uma vez; a mudança de passo dentro de `EXECUTING` não gera evento. Entrega pelo menos uma vez: tratar por `id` do evento (idempotência) e ordenar por `data.updatedAt` + `data.status`. Responder `200` rápido, como hoje. Compra recusada antes do débito (erro `422` no `POST`) gera só `purchase.rejected`. Uma compra a partir do depósito gera **dois fluxos separados**: o webhook legado do depósito Pix (`CURRENCY`, `PAID`) e os `purchase.*` (`CRYPTO_PURCHASE`); não existe webhook combinado. **Confirmar** com o Fabricio se o IP de saída (`107.23.39.46`) é o mesmo para esses eventos.

## 9. Enums e códigos de erro (cripto)

Mapa `reason` → HTTP, para a página "Códigos de erro":

| HTTP | Reasons |
| --- | --- |
| 400 | `VALIDATION_FAILED`, `AMOUNT_MUST_BE_STRING`, `CONFLICTING_FIELDS`, `PURCHASE_API_ONLY` |
| 401 | `UNAUTHORIZED` |
| 403 | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`, `BUY_DISABLED`, `DASHBOARD_ONLY` |
| 404 | `PURCHASE_NOT_FOUND`, `SALE_NOT_FOUND`, `QUOTE_NOT_FOUND`, `SAVED_ADDRESS_NOT_FOUND`, `ROUTE_NOT_FOUND` |
| 409 | `EXTERNAL_ID_CONFLICT`, `QUOTE_EXPIRED`, `QUOTE_ALREADY_USED`, `RECEIPT_NOT_AVAILABLE` |
| 413 | `PAYLOAD_TOO_LARGE` |
| 422 | `AMOUNT_BELOW_MIN`, `AMOUNT_ABOVE_MAX`, `AMOUNT_TOO_LOW_FOR_NETWORK_FEE`, `ASSET_NOT_SUPPORTED`, `NETWORK_NOT_SUPPORTED`, `ADDRESS_INVALID_FOR_NETWORK`, `ADDRESS_NOT_SAVED`, `ADDRESS_ON_HOLD`, `ADDRESS_NOT_ALLOWED`, `SAVED_ADDRESS_NETWORK_MISMATCH`, `INSUFFICIENT_BALANCE`, `PRICE_UNSTABLE`, `PAIR_MARGIN_NOT_CONFIGURED` |
| 429 | `RATE_LIMITED`, `DAILY_CAP_EXCEEDED`, `OUTFLOW_HOURLY_CAP_EXCEEDED` |
| 500 | `INTERNAL_SERVER_ERROR` |
| 503 | `PRICE_STALE`, `NETWORK_FEE_UNAVAILABLE`, `CRYPTO_TEMPORARILY_UNAVAILABLE`, `CONFIGURATION_UNAVAILABLE`, `PURCHASE_UNAVAILABLE`, `SERVICE_OVERLOADED` |

Motivos de recusa da compra (`rejection.reason`): `INSUFFICIENT_BALANCE` (saldo BRL insuficiente), `QUOTE_NOT_FOUND`, `QUOTE_EXPIRED`, `QUOTE_ALREADY_USED`, `PRICE_STALE` (preço de referência indisponível), `PRICE_UNSTABLE` (preço instável, nada debitado), `NETWORK_FEE_UNAVAILABLE`, `AMOUNT_TOO_LOW_FOR_NETWORK_FEE`, `DAILY_CAP_EXCEEDED`, `OUTFLOW_HOURLY_CAP_EXCEEDED` (teto horário de saída da tesouraria), `LIQUIDITY_UNAVAILABLE`, `CRYPTO_TEMPORARILY_UNAVAILABLE`, `APPROVAL_REJECTED` (recusada na fila), `PROVIDER_REJECTED` (recusada pela custódia), `SEND_FAILED` (erro no envio; nada saiu). Em todos, `refunded: true` significa que o BRL voltou integralmente ao saldo, taxa incluída.

## 10. Compra a partir do depósito (`purchase{}` no `POST /deposit`)

Ponte de migração para quem hoje usa depósito com conversão. Só canal API.

1. Integrador chama `POST /deposit` com `amount` (BRL), `customerId` ou `customer`, `currency`, **`externalId` obrigatório** e `purchase: { asset, network, address }`. Antes de gerar o Pix a XGate valida ativo, rede, endereço, limites e habilitação da compra; qualquer recusa responde o erro **e o depósito não é criado**.
   _Erros próprios: `400 PURCHASE_API_ONLY` (token do painel), `400 CONFLICTING_FIELDS` (`purchase` junto de `cryptocurrency`), `400 VALIDATION_FAILED` (campo de `purchase` ausente, `externalId` ausente, `amount` fora de BRL com 2 casas), `403 PERMISSION_DENIED`, `503 PURCHASE_UNAVAILABLE` ou `FEATURE_STATUS_UNAVAILABLE`. Mais todos os reasons de compra da seção 6 (`CRYPTO_DISABLED`, `BUY_DISABLED`, `EXTERNAL_ID_CONFLICT`, `AMOUNT_*`, `ADDRESS_*`, `RATE_LIMITED`, `DAILY_CAP_EXCEEDED`…), repassados com o mesmo status._
2. Resposta `201` com o Pix (`data.code`) e `data.purchase: { id, status: "PENDING_PAYMENT" }`. Webhook `purchase.pending_payment`.
3. O pagador paga o Pix. O depósito vira `PAID` (webhook legado `CURRENCY`) e o BRL líquido entra no saldo da empresa.
4. A compra executa em nome da empresa, com o próprio saldo, a preço de mercado do momento (`EXECUTING`, webhook `purchase.executing`), passa pela fila de aprovação quando a empresa não tem aprovação automática (`PENDING_APPROVAL`) e termina em `DELIVERED` com `delivery.txHash`, ou `REJECTED` com o BRL de volta ao saldo.
5. Se o Pix não for pago no prazo, a compra vai a `EXPIRED` (`purchase.expired`). O depósito continua um depósito normal.
   _`channel` da compra = `DEPOSIT`, `depositId` preenchido. O pagador do Pix não compra nada; titularidade e tipo do pagador são regras do Pix, independentes da compra. Depósito e compra não se referenciam no painel; o vínculo existe só na API._

Dois avisos para o texto: o `purchase{}` substitui o `cryptocurrency` como ponte; numa fase posterior ele também sai e o integrador passa a fazer `POST /deposit` em BRL e depois `POST /crypto/purchases` com o saldo. E ele depende de a XGate ligar o canal em produção (**confirmar** a data com o Fabricio; hoje está preparado e desligado).

## 11. Cronograma de publicação e pontos a confirmar

| Quando | O que publicar |
| --- | --- |
| Até 14/10 | Seção "Compra e Venda de Cripto" com Visão geral, Convenções, `GET /crypto/options`, cotação e estimativa, comprar, consultar, comprovante, webhooks de compra, códigos de erro (seções 5, 6, 8, 9). Aviso datado de descontinuação (29/10) no topo das páginas da seção 3. Ajustes das seções 4.1, 4.2, 4.5 e da página de IPs. Texto da Introdução. |
| 29/10 | Remover do menu: Carteiras Crypto, Depósitos › Crypto (com Conversão), Saques › Crypto (com Conversão), Saques › Crypto (Wallet). Ajustar Consultar Saldo (4.3), details (4.4), Subconta, exemplos de webhook legado. |
| Novembro | Vender, consultar vendas, comprovante da venda, beneficiários, webhooks `sale.*` (seções 7 e 8). Publicar `purchase{}` (seção 10) quando o canal for ligado, se ainda não tiver sido. |

Pontos que precisam de resposta do Fabricio (ou decisão do Paulo) antes de o texto ir ao ar; nenhum muda a estrutura acima:

- **Gateway de prod:** os filhos de `/crypto` do crypto-v2 (`options`, `quotes`, `quotes/estimate`, `purchases`, `purchases/{id}`, `purchases/{id}/receipt`, `sales`, `sales/{id}`, `sales/{id}/receipt`, `openapi.json`, `docs`) só existem em dev. Em prod dependem do primeiro apply do Terraform do crypto-v2 mais o `create-deployment` do stage. Até lá `GET https://api.xgateglobal.com/crypto/options` não existe. O portal só pode ir ao ar quando essa borda estiver publicada.
- **`/withdraw/beneficiaries` sem rota de gateway** (REST dev e prod, backoffice dev e prod, internal dev): a rota existe só na controller do withdraw. Vale para a API (`GET`), para o painel (`POST`, `DELETE`, `POST …/reactivate`) e para o backoffice (`POST /withdraw/backoffice/beneficiaries/filter`). Precisa ser criada à mão nos gateways legados antes da onda 2 e antes de o front testar.
- `GET /company/features` existe no gateway de dev e não no de prod (rota do painel, fora deste doc, mas é o mesmo tipo de pendência).
- Como o grupo do usuário de integração recebe `CRYPTO.VIEW`, `CRYPTO.EXECUTE` e `WITHDRAW_BENEFICIARY.VIEW` (automático no grupo de API ou configuração por empresa).
- IP de saída dos webhooks `CRYPTO_PURCHASE`/`CRYPTO_SALE` (mesmo `107.23.39.46`?).
- Se `PAYER_REJECTED` é entregue pelo webhook `CURRENCY` de depósito.
- Campos novos em `GET /deposit/{id}/details` (`purchase`, `payerRuleViolation`, `channel`).
- Se `POST /balance/company` deixa de devolver a linha cripto ou a devolve zerada.
- Se `POST /company/subaccount` passa a aceitar só `currencies` nas taxas.
- Data em que a compra a partir do depósito (`purchase{}`) é ligada em produção.
- Ambiente de homologação para testar os exemplos antes de publicar (o `crypto-v2` hoje só existe em dev).

## 12. Fontes

- Swagger do serviço novo: `GET /crypto/openapi.json` e `/crypto/docs` (só rotas públicas e de painel).
- Fonte da verdade do produto: `docs/produto/compra-venda-cripto-fonte-da-verdade-2026-09-28.md` (seções 1 a 4, 7, 9 e 11).
- Guia da API para o CS (mesmo produto, linguagem para atendimento): `docs/xgate-cripto-guia-endpoints-cs.txt`.
- Código do PR 463 em `a6800e04`: `crypto-v2/src/modules/{crypto-purchase,crypto-quote,crypto-sale,crypto-receipt}` (schemas e rotas), `deposit/src/modules/deposit/validation/purchase.js` e `purchase-messages.js`, `withdraw/src/modules/withdraw/withdraw-controller.js` e `crypto/src/modules/{wallet,conversion-order}` (descontinuação), `postback/src/modules/postback/postback-v2-domain.js` e `event.json` (webhooks).
- Portal atual: sitemap de https://api.doc.xgateglobal.com (37 páginas, lidas em 09/10/2026).
- API Gateway REST (`aws apigateway get-resources` / `get-integration`, 12/10/2026): dev `ff2yl9h2el` (476 recursos) e prod `li2fuhv9k2` (347 recursos); backoffice dev `cffbik8w3c`, prod `nju3gsmxp7`; internal dev `wb700powh3`.

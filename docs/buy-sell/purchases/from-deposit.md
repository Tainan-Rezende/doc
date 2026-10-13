---
draft: true
sidebar_label: 'Compra a partir do Depósito'
sidebar_position: 4
description: 'Gera um depósito Pix em BRL que, ao ser pago, dispara automaticamente uma compra de cripto em nome da empresa.'
sidebar_class_name: 'sidebar-method-post'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Compra a partir do Depósito

Ponte de migração para quem hoje usa o depósito com conversão. Ao enviar o bloco `purchase` no <a href={useBaseUrl('/docs/fiat/deposit/create')}>POST /deposit</a>, a XGate gera o Pix em BRL e, quando ele é pago, compra USDT/USDC **em nome da empresa, com o próprio saldo**, enviando a cripto para a carteira indicada.

:::info[Disponibilidade]
Disponível apenas pelo canal API e somente quando a XGate habilitar o recurso para a sua empresa.
:::

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/deposit
```

---

## Requisição

O corpo é o mesmo do depósito Pix, com `externalId` **obrigatório** e o bloco `purchase`:

```json
{
  "amount": "150.00",
  "customerId": "696d1f3331117************",
  "currency": { "_id": "6722ba**************", "name": "BRL", "type": "PIX", "symbol": "R$" },
  "externalId": "pedido-7781",
  "purchase": {
    "asset": "USDT",
    "network": "TRON",
    "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
  }
}
```

| Campo              | Tipo     | Obrigatório | Descrição                                                         |
| :----------------- | :------- | :---------: | :---------------------------------------------------------------- |
| `externalId`       | `string` |   **Sim**   | Obrigatório quando há `purchase`.                                 |
| `amount`           | `string` |   **Sim**   | Valor em BRL com 2 casas.                                         |
| `purchase.asset`   | `string` |   **Sim**   | `USDT` ou `USDC`.                                                 |
| `purchase.network` | `string` |   **Sim**   | Rede de entrega.                                                  |
| `purchase.address` | `string` |   **Sim**   | Carteira de destino declarada da empresa.                         |

Antes de gerar o Pix, a XGate valida ativo, rede, endereço, limites e habilitação da compra. Qualquer recusa responde o erro **e o depósito não é criado**.

---

## Resposta (201 Created)

Igual à do depósito Pix, mais `data.purchase`:

```json
{
  "message": "Pix Gerado com Sucesso",
  "data": {
    "status": "WAITING_PAYMENT",
    "code": "00020126850014br.gov.bcb.pix2563pi**********",
    "id": "696e28a43e09**************",
    "customerId": "68e7b8f0db**************",
    "externalId": "pedido-7781",
    "purchase": { "id": "6710c2f4a1b2c3d4e5f60718", "status": "PENDING_PAYMENT" }
  }
}
```

---

## Fluxo

1. `POST /deposit` com `purchase` → resposta `201` com o Pix e `data.purchase` em `PENDING_PAYMENT`. Webhook `purchase.pending_payment`.
2. O pagador paga o Pix. O depósito vira `PAID` (webhook de depósito `CURRENCY`) e o BRL líquido entra no saldo da empresa.
3. A compra executa a preço de mercado do momento (`EXECUTING`, webhook `purchase.executing`), passa pela fila de aprovação quando a empresa não tem aprovação automática (`PENDING_APPROVAL`) e termina em `DELIVERED` com `delivery.txHash`, ou em `REJECTED` com o BRL de volta ao saldo.
4. Se o Pix não for pago no prazo, a compra vai a `EXPIRED` (webhook `purchase.expired`). O depósito continua um depósito normal.

A compra tem `channel = DEPOSIT` e `depositId` preenchido. O pagador do Pix não compra nada: titularidade e tipo do pagador são regras do Pix, independentes da compra.

:::warning[Dois fluxos de webhook]
Uma compra a partir do depósito gera **dois fluxos separados**: o webhook do depósito Pix (`CURRENCY`) e os eventos `purchase.*` (`CRYPTO_PURCHASE`). Não existe webhook combinado.
:::

### Eventos adicionais

| Evento (`type`)            | Status             | Quando                                         |
| :------------------------- | :----------------- | :--------------------------------------------- |
| `purchase.pending_payment` | `PENDING_PAYMENT`  | Compra criada, aguardando o pagamento do Pix.  |
| `purchase.expired`         | `EXPIRED`          | Pix não pago no prazo. **Final.**              |

---

## Erros

| Status  | Reason                                                                                                         |
| :------ | :------------------------------------------------------------------------------------------------------------- |
| **400** | `PURCHASE_API_ONLY` (token do painel), `CONFLICTING_FIELDS` (`purchase` junto de `cryptocurrency`), `VALIDATION_FAILED` (campo de `purchase` ausente, `externalId` ausente, `amount` fora de BRL com 2 casas) |
| **403** | `PERMISSION_DENIED`                                                                                            |
| **503** | `PURCHASE_UNAVAILABLE`, `FEATURE_STATUS_UNAVAILABLE`                                                           |

Além desses, todos os reasons da <a href={useBaseUrl('/docs/buy-sell/purchases/create')}>compra</a> (`CRYPTO_DISABLED`, `BUY_DISABLED`, `EXTERNAL_ID_CONFLICT`, `AMOUNT_*`, `ADDRESS_*`, `RATE_LIMITED`, `DAILY_CAP_EXCEEDED`...) são repassados com o mesmo status.

:::note[Próxima fase]
O `purchase` substitui o `cryptocurrency` como ponte de migração. Numa fase posterior ele também sai: o fluxo recomendado é `POST /deposit` em BRL e depois `POST /crypto/purchases` com o saldo.
:::

---
sidebar_label: 'Receber Webhooks'
sidebar_position: 6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Recebimento de Webhooks

Os Webhooks são notificações automáticas enviadas pela XGate para o seu sistema sempre que o status de uma transação muda (ex: um depósito via Pix foi pago, ocorreu um erro na liquidação ou um saque entrou em processamento).

Isso elimina a necessidade do seu sistema ficar consultando a API repetidamente (*polling*) para saber se um pagamento caiu. A XGate faz o papel apenas de mensageira: nós disparamos as informações, e o seu sistema deve estar preparado para recebê-las e tratá-las.

---

## Configurando no Painel

É fundamental entender que a **XGate não fornece uma URL de webhook**. Você (ou sua equipe de desenvolvimento) precisa construir uma rota pública em seu próprio servidor para receber os dados. Após criar essa rota, você deve informá-la no painel da XGate.

Siga os passos abaixo para configurar o envio das notificações:

1. Acesse o menu lateral **Webhooks** no seu painel XGate.
2. Clique em **+ Adicionar Integração** ou clique em **Configurar** em um slot vazio.
3. Preencha os campos de destino:
   * **Nome:** Um nome de identificação interno para você (ex: "Webhook Servidor Principal").
   * **URL:** O endereço completo do endpoint hospedado no seu servidor (ex: `https://sua-empresa.com/api/webhooks/xgate`).

4. **Eventos:** Selecione quais notificações você deseja que a XGate envie para esta URL. Os eventos são divididos em:
   * **CRYPTOCURRENCY:** Transações via Crypto.
   * **CURRENCY:** Transações via Moeda Fiduciária (Pix, incluindo aprovação, rejeição, erros, e toda a esteira de estornos/contestações).

:::tip[Dica de Integração]
Nossa recomendação é que você **habilite todos os eventos disponíveis**. Isso garante que o seu banco de dados possua um espelhamento perfeito do que está acontecendo na XGate, evitando que transações fiquem presas em status desatualizados. No entanto, a escolha final fica a seu critério.
:::

---

## Segurança: Whitelist de IP

Para garantir que seu sistema não sofra ataques de webhooks falsos (usuários mal-intencionados simulando que um pagamento foi aprovado), a XGate envia todas as notificações a partir de um **IP Fixo Exclusivo**.

Recomendamos fortemente que você configure o firewall do seu servidor ou crie uma validação em seu código para aceitar apenas requisições `POST` vindas do seguinte IP:

**IP Oficial XGate:** `107.23.39.46`

---

## Idempotência e "externalId"

Ao criar pedidos de Depósito ou Saque, você pode enviar o campo `externalId`. Ele possui duas funções vitais:

1. **Prevenção de Duplicidade (Idempotência):** Impede que falhas de rede ou "duplo clique" do seu cliente final gerem múltiplas transações iguais na XGate. Se enviarmos duas requisições com o mesmo `externalId`, a segunda será ignorada.
2. **Rastreabilidade:** Funciona como o código único do pedido no *seu* sistema. 

**Nota:** Se você enviar o `externalId` na criação da transação, a XGate o devolverá dentro do payload do webhook, facilitando a busca no seu banco de dados.

---

## Como funciona o fluxo?

1. Você cadastra a **sua URL** no painel da XGate e seleciona os eventos.
2. Quando um dos eventos selecionados ocorre, a XGate faz uma requisição **POST** para a sua URL a partir do IP `107.23.39.46`.
3. Seu sistema recebe o JSON, processa a lógica de negócio e **confirma o recebimento retornando um HTTP 200 OK**.

:::warning[Boa Prática de Integração]
Seu servidor **DEVE** retornar o status HTTP `200` (OK) imediatamente após receber o webhook. Essa é a prática padrão para informar à XGate que seu sistema processou a notificação com sucesso, finalizando a conexão adequadamente e evitando falhas de comunicação (*timeouts*) entre os servidores.
:::

---

## Formato da Requisição e Variações

O formato do Payload varia ligeiramente dependendo se a transação envolve apenas Fiat (Pix) ou Criptomoedas (USDT).

- **Método:** <span className="badge badge--info">POST</span>

### Exemplos de Payload

**1. Transação Padrão (Pix BRL):**
Retorna o campo `type` especificando o método.

```json
{
    "id": "676071f1*************",
    "customerId": "123456*************",
    "status": "PAID",
    "name": "BRL",
    "type": "PIX",
    "amount": 2,
    "operation": "DEPOSIT"
}
```

**2. Saque (USDT convertido para Pix):**
O campo `type` é omitido nas operações que envolvem saldos cripto.

```json
{
    "id": "676070dc*************",
    "customerId": "123456*************",
    "status": "PAID",
    "name": "USDT",
    "amount": 0.04,
    "operation": "WITHDRAW"
}
```

**3. Depósito (Pix convertido para USDT ou USDT direto):**

```json
{
    "id": "676070*************",
    "customerId": "123456*************",
    "status": "PAID",
    "name": "USDT",
    "amount": 0.332,
    "operation": "DEPOSIT"
}
```

### Descrição dos Campos

| Campo        | Tipo     | Descrição                                                                                |
| :----------- | :------- | :--------------------------------------------------------------------------------------- |
| `id`         | `string` | ID único da transação gerado pela XGate.                                                 |
| `status`     | `string` | O status atual da transação (veja a tabela abaixo).                                      |
| `name`       | `string` | A moeda base da transação (ex: `BRL`, `USDT`).                                           |
| `type`       | `string` | *(Condicional)* O método utilizado (ex: `PIX`). Geralmente ausente em transações cripto. |
| `amount`     | `number` | O valor processado na transação.                                                         |
| `operation`  | `string` | Define se é uma entrada ou saída (`DEPOSIT` ou `WITHDRAW`).                              |
| `customerId` | `string` | ID do cliente vinculado à transação.                                                     |
| `externalId` | `string` | *(Opcional)* O ID do pedido no seu sistema, retornado apenas se enviado na criação.      |

---

## Status Possíveis

Seu sistema deve estar preparado para processar os status de fluxo normal e os status do fluxo de estornos (Chargeback).

### Fluxo Principal de Transações

| Status                                                     | Significado                                                                   | Ação Recomendada                                                                  |
| :--------------------------------------------------------- | :---------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| <span className="badge badge--secondary">PROCESSING</span> | A transação está sendo processada.                                            | Apenas registrar o andamento (comum em saques).                                   |
| <span className="badge badge--success">PAID</span>         | Transação concluída e paga com sucesso.                                       | **Liberar o saldo/produto ou confirmar o saque.**                                 |
| <span className="badge badge--danger">ERROR</span>         | Falha na operação (ex: chave Pix incorreta em saques, titularidade inválida). | Avisar o usuário final sobre a falha e sugerir verificar informações cadastradas. |
| <span className="badge badge--danger">REJECTED</span>      | Rejeitado pela liquidante/parceiro bancário.                                  | Raro de acontecer, tratar como falha definitiva.                                  |

### Fluxo de Estornos e Contestações (Chargeback)

| Status                                                                   | Significado                                                                       | Ação Recomendada                                     |
| :----------------------------------------------------------------------- | :-------------------------------------------------------------------------------- | :--------------------------------------------------- |
| <span className="badge badge--warning">AWAITING_REFUND_CONTESTION</span> | O cliente final abriu uma solicitação de estorno no banco dele. O saldo é retido. | Congelar o saldo/serviço do cliente preventivamente. |
| <span className="badge badge--warning">AWAITING_BANK_VEREDICT</span>     | Você enviou a defesa da contestação e estamos aguardando o banco julgar.          | Aguardar resolução.                                  |
| <span className="badge badge--danger">EXPIRED_DISPUTE</span>             | O prazo para enviar as provas de contestação do estorno expirou.                  | Registrar perda da disputa.                          |
| <span className="badge badge--success">REFUND_CANCELED</span>            | O estorno foi cancelado pelo banco (você ganhou a disputa).                       | O valor retido é devolvido à sua conta.              |
| <span className="badge badge--danger">REFUND_APPROVED</span>             | O estorno foi aprovado pelo banco (você perdeu a disputa).                        | O valor é devolvido ao cliente final em definitivo.  |

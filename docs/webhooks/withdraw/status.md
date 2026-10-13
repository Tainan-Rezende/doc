---
sidebar_label: 'Consultar Saque'
sidebar_position: 1
description: 'Este endpoint permite a consulta detalhada de uma solicitação de saque previamente criada.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import AICopyButton from '@site/src/components/AICopyButton';

# Consultar Saque

<div className="ai-btn-wrapper">
    <AICopyButton 
  promptText={`openapi: 3.0.3
info:
  title: API XGate - Consultar Detalhes do Saque
  version: 1.0.0
  description: Endpoint para consulta detalhada de transações de saque (Fiat, Crypto ou Conversão).
servers:
  - url: https://api.xgateglobal.com
paths:
  /withdraw/{transactionId}/details:
    get:
      summary: Consultar Saque
      description: Retorna o objeto completo de uma transação de saque através do ID único da XGate.
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: transactionId
          required: true
          schema:
            type: string
          description: O ID (_id) do saque gerado pela XGate.
      responses:
        '200':
          description: Sucesso. Retorna os detalhes da transação.
          content:
            application/json:
              schema:
                type: object
                properties:
                  _id:
                    type: string
                  currency:
                    type: object
                    description: Dados Fiat (presente em saques Pix ou conversão).
                  cryptocurrency:
                    type: object
                    description: Dados Crypto (presente em saques USDT ou conversão).
                  document:
                    type: string
                  customerId:
                    type: string
        '401':
          description: Não autorizado (Token inválido ou expirado).
        '404':
          description: Saque não encontrado.
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

# INSTRUÇÕES PARA A IA:
# 1. Gere o código de integração para a linguagem solicitada.
# 2. Utilize o método GET enviando o transactionId como parâmetro de path na URL.
# 3. Importante: A resposta pode conter o objeto 'currency' (para operações Fiat), 'cryptocurrency' (para operações Crypto) ou AMBOS (para conversões).
# 4. Inclua lógica para verificar o campo 'status' dentro desses objetos para confirmar se o pagamento foi realizado (ex: status === "PAID").
# 5. Adicione tratamento para erro 404 (transação inexistente).`} 
/>
</div>

Este endpoint permite a consulta detalhada de uma solicitação de saque previamente criada. Embora seja muito utilizado para verificar o "status do saque", ele retorna o objeto completo com todas as informações vitais da transação.

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/withdraw/ID_TRANSACAO/details
```

:::warning[Importante]
O valor **ID_TRANSACAO** na URL refere-se ao `_id` do saque gerado pela XGate no momento da criação da solicitação.
:::

---

## Requisição

### Headers Obrigatórios

| Header          | Valor                | Descrição                                  |
| :-------------- | :------------------- | :----------------------------------------- |
| `Authorization` | `Bearer <seu_token>` | Token JWT de autenticação obtido no login. |

---

## Respostas (Responses)

### Sucesso (200 OK)

A transação foi encontrada. A estrutura dos dados retornados varia de acordo com o tipo de operação (Fiat ou Crypto).

**1. Saque FIAT (BRL):**

```json
{
    "_id": "6a3da740e5****************",
    "externalId": "external-id-webhook-0101",
    "currency": {
        "type": "PIX",
        "name": "BRL",
        "status": "PAID",
        "amount": 0.2
    },
    "status": "APPROVED",
    "generatedReceiptAt": "2026-06-25T22:10:18.579Z",
    "customerId": "6a1a379e1fe**************"
}
```

**2. Saque Crypto para Fiat:**

```json
{
    "_id": "6a3da803e51**************",
    "externalId": "external-id-webhook-0102",
    "cryptocurrency": {
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "amount": 0.2,
        "status": "PAID"
    },
    "currency": {
        "type": "PIX",
        "name": "BRL",
        "status": "PAID",
        "amount": 1.05
    },
    "status": "APPROVED",
    "generatedReceiptAt": "2026-06-25T22:13:33.487Z",
    "customerId": "6a1a379e1fe**************"
}
```

**3. Saque Crypto para Crypto:**

```json
{
    "_id": "6a3d9ed4********************",
    "cryptocurrency": {
        "name": "USDT",
        "symbol": "USDT",
        "amount": 1,
        "status": "PAID",
        "coinGecko": "tether",
        "blockchainNetwork": {
            "name": "Solana",
            "chain": "Solana",
            "symbol": "SOL"
        }
    },
    "status": "APPROVED",
    "generatedReceiptAt": "2026-06-25T21:36:03.045Z",
    "customerId": "6a1a379e1fe9********************"
}
```

### Descrição dos Campos

*Nota: A estrutura da resposta é dinâmica. Saques puramente Fiat utilizam o objeto `currency`. Saques puramente Crypto utilizam `cryptocurrency`. Saques de Conversão (Crypto ➔ Pix) retornam ambos.*

| Campo                | Tipo     | Descrição                                                                                                                                                                                                                                    |
| :------------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_id`                | `string` | ID único da transação gerado pela XGate.                                                                                                                                                                                                     |
| `customerId`         | `string` | ID do cliente vinculado à transação na XGate.                                                                                                                                                                                                |
| `externalId`         | `string` | *(Opcional)* O ID do pedido no seu sistema, caso tenha sido enviado na criação do saque.                                                                                                                                                     |
| `status`             | `string` | Status geral de aprovação/processamento do saque na plataforma XGate (ex: `APPROVED`).                                                                                                                                                       |
| `generatedReceiptAt` | `string` | Data e hora exata da geração do recibo da transação (padrão ISO 8601).                                                                                                                                                                       |
| `currency`           | `object` | *(Condicional)* Dados financeiros da operação Fiat (Pix ou Conversões). Retorna propriedades como o status do pagamento (`status`), valor pago/convertido (`amount`), a moeda (`name`) e o método de destino (`type`).                       |
| `cryptocurrency`     | `object` | *(Condicional)* Dados da operação Crypto (Crypto ou Conversões). Retorna o status de transferência na rede (`status`), o valor deduzido (`amount`), dados do token (`name`, `symbol`, `coinGecko`) e detalhes da rede (`blockchainNetwork`). |

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido. |
| **404** | `Not Found`             | • ID da transação informado não é válido.<br />• O saque não existe no sistema.                   |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com o suporte.                                        |

---

## Como usar

Embora a forma mais eficiente de acompanhar saques seja através do recebimento de **Webhooks**, esta rota de consulta é um endpoint de leitura indispensável para a manutenção do seu sistema.

### Casos de Uso Comuns

Você utilizará este endpoint principalmente nas seguintes situações:

1. **Reconciliação e Auditoria:** Confirmar se o valor (`amount`), os dados de rede (`blockchainNetwork`) ou o recebedor (`document`/`wallet`) de um saque realizado na XGate batem exatamente com o que consta no seu banco de dados interno.
2. **Recuperação de Falhas (Fallback):** Caso o seu servidor fique offline e você perca o recebimento de um Webhook, você pode criar uma rotina (CRON) que consulta os saques "Pendentes" utilizando este endpoint para atualizar os status perdidos.
3. **Atendimento de Suporte (CS):** Buscar os dados de um saque específico em tempo real para ajudar um cliente final que está questionando o andamento de uma retirada ou o valor da taxa de rede (`gasFeeAmount`).

### Exemplo Prático

A finalidade primária é a verificação do andamento da transação. Ao consultar o endpoint, você focará no campo `status` correspondente à operação para determinar o que mostrar ao seu cliente final.

**Verificando a liquidação:**

No código abaixo, o sistema valida se a resposta possui o objeto `currency` (Fiat) ou `cryptocurrency` (Crypto) para extrair o status correto da transação:

---

## Integração

Abaixo, um exemplo simples de como implementar essa consulta utilizando Node.js.

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    O exemplo de integração utiliza a biblioteca `Axios` para realizar a requisição HTTP.

    **Instalando `Axios`:**
    ```bash
    npm install axios
    ```

    **Exemplo Javascript:**
    ```javascript
const axios = require("axios");

(async () => {
    const email = "email@domain.com";
    const password = "••••••";
    const transactionId = "6a3da740e5***************";

    try {
        const url_api = "https://api.xgateglobal.com";
        
        // 1. Obter token de autenticação
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        
        // 2. Consultar detalhes do saque
        const { data } = await axios.get(`${url_api}/withdraw/${transactionId}/details`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        
        console.log("Detalhes do Saque:", data);
        
        // Lógica dinâmica para identificar o tipo de saque com base na resposta
        let status = "Unknown";
        let mensagem = "";
        let destino = ""; // Inicia vazio para evitar informações falsas ou undefined

        if (data.currency && data.cryptocurrency) {
            // Cenário 2: Conversão (Crypto -> Pix)
            // Lemos o status da 'currency' pois é a ponta final (Fiat) que vai para o cliente
            status = data.currency.status; 
            mensagem = `Conversão: Saiu ${data.cryptocurrency.amount} ${data.cryptocurrency.name} e pagou ${data.currency.amount} ${data.currency.name}`;
            if (data.document) destino = `Pix (Doc: ${data.document})`;
            
        } else if (data.cryptocurrency) {
            // Cenário 3: 100% Crypto
            status = data.cryptocurrency.status;
            const rede = data.cryptocurrency.blockchainNetwork?.name || "Desconhecida";
            mensagem = `Crypto: ${data.cryptocurrency.amount} ${data.cryptocurrency.name} via rede ${rede}`;
            if (data.cryptocurrency.wallet) destino = `Carteira: ${data.cryptocurrency.wallet}`;
            
        } else if (data.currency) {
            // Cenário 1: 100% Fiat (Pix)
            status = data.currency.status;
            mensagem = `Fiat: ${data.currency.amount} ${data.currency.name} via ${data.currency.type}`;
            if (data.document) destino = `Pix (Doc: ${data.document})`;
        }
        
        // Formata a string de destino apenas se houver algum dado mapeado
        const sufixoDestino = destino ? ` | Destino: ${destino}` : "";

        // Validação da liquidação da transação
        if (status === "PAID") {
            console.log(`[PAGO] ${mensagem}${sufixoDestino}`);
        } else {
            console.log(`[${status}] ${mensagem}${sufixoDestino}`);
        }

    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                console.error("Erro 404: O saque não foi encontrado no sistema da XGate.");
            } else {
                console.error(`Erro na API (${error.response.status}):`, error.response.data);
            }
        } else {
            console.error("Erro de Conexão:", error.message);
        }
    }
})();
    ```
  </TabItem>
</Tabs>
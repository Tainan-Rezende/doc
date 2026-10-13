---
sidebar_label: 'Consultar Depósito'
sidebar_position: 1
description: 'Este endpoint permite a consulta detalhada de uma solicitação de depósito previamente criada.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import AICopyButton from '@site/src/components/AICopyButton';

# Consultar Depósito

<div className="ai-btn-wrapper">
    <AICopyButton 
  promptText={`openapi: 3.0.3
info:
  title: API XGate - Consultar Detalhes do Depósito
  version: 1.0.0
  description: Endpoint para consulta detalhada de solicitações de depósito (Fiat, Crypto ou Conversão).
servers:
  - url: https://api.xgateglobal.com
paths:
  /deposit/{transactionId}/details:
    get:
      summary: Consultar Depósito
      description: Retorna o objeto completo de uma transação de depósito através do ID único da XGate. Útil para verificar status e reconciliar dados.
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: transactionId
          required: true
          schema:
            type: string
          description: O ID (_id) do depósito gerado pela XGate.
      responses:
        '200':
          description: Sucesso. Retorna os detalhes da transação de depósito.
          content:
            application/json:
              schema:
                type: object
                properties:
                  _id:
                    type: string
                  currency:
                    type: object
                    description: Dados Fiat (presente em depósitos Pix).
                  cryptocurrency:
                    type: object
                    description: Dados Crypto (presente em depósitos USDT).
                  document:
                    type: string
                  identifiedDocumentPix:
                    type: boolean
                  customerId:
                    type: string
        '401':
          description: Não autorizado (Token inválido ou expirado).
        '404':
          description: Depósito não encontrado.
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

# INSTRUÇÕES PARA A IA:
# 1. Gere o código de integração para a linguagem solicitada pelo usuário.
# 2. Utilize o método GET enviando o transactionId como parâmetro de path na URL.
# 3. A resposta pode conter o objeto 'currency' (Fiat), 'cryptocurrency' (Crypto) ou ambos. 
# 4. Oriente o desenvolvedor a verificar o campo 'status' (ex: status === "PAID") dentro desses objetos para confirmar a liquidação.
# 5. Adicione tratamento de erro para o status 404 (transação não encontrada).`} 
/>
</div>

Este endpoint permite a consulta detalhada de uma solicitação de depósito previamente criada. Embora seja muito utilizado para verificar o "status do depósito", ele retorna o objeto completo com todas as informações vitais da transação.

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/deposit/ID_TRANSACAO/details
```

:::warning[Importante]
O valor **ID_TRANSACAO** na URL refere-se ao `_id` do depósito gerado pela XGate no momento da criação da solicitação.
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

**1. Depósito Pix (Fiat BRL):**

```json
{
    "_id": "6a3d60ffc37******************",
    "currency": {
        "name": "BRL",
        "type": "PIX",
        "amount": 0.2,
        "status": "PAID"
    },
    "generatedReceiptAt": "2026-06-25T17:10:45.584Z",
    "customerId": "6a1a379e1fe****************"
}
```

**2. Depósito Pix convertendo para Crypto:**

```json
{
    "_id": "6a3da62669a8*************",
    "currency": {
        "name": "BRL",
        "type": "PIX",
        "amount": 0.2,
        "status": "PAID"
    },
    "cryptocurrency": {
        "name": "USDT",
        "symbol": "USDT",
        "amount": 0.038234,
        "status": "PAID",
        "coinGecko": "tether"
    },
    "generatedReceiptAt": "2026-06-25T22:05:50.439Z",
    "customerId": "6a1a379e1fe*************"
}
```

**3. Depósito Crypto:**

```json
{
    "_id": "6a3da45e1**************",
    "idempotencyKey": "cryptocurrency:6a3da45bb503**************************************",
    "cryptocurrency": {
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether",
        "status": "PAID",
        "blockchainNetwork": {
            "name": "Solana"
        },
        "amount": 4.7
    },
    "generatedReceiptAt": "2026-06-25T21:57:50.512Z",
    "customerId": "6a1a379e**************"
}
```

### Descrição dos Campos

*Nota: A estrutura da resposta é dinâmica. Depósitos puramente Fiat utilizam o objeto `currency`. Depósitos puramente Crypto utilizam `cryptocurrency`. Depósitos de Conversão (Pix ➔ Crypto) retornam ambos.*

| Campo                | Tipo     | Descrição                                                                                                                                                                                                                                     |
| :------------------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_id`                | `string` | ID único da transação gerado pela XGate.                                                                                                                                                                                                      |
| `customerId`         | `string` | ID do cliente vinculado à transação na XGate.                                                                                                                                                                                                 |
| `generatedReceiptAt` | `string` | Data e hora exata da geração do recibo da transação (padrão ISO 8601).                                                                                                                                                                        |
| `idempotencyKey`     | `string` | *(Condicional)* Chave de idempotência (presente em depósitos crypto). Esta string sempre carrega o ID interno da **cryptocurrency** e o hash da transação na blockchain (**txHash**).                                                         |
| `currency`           | `object` | *(Condicional)* Dados financeiros da operação Fiat (Pix ou Conversões). Retorna propriedades como o status da liquidação fiduciária (`status`), o valor final (`amount`), a moeda (`name`) e o método (`type`).                               |
| `cryptocurrency`     | `object` | *(Condicional)* Dados da operação Crypto (Crypto ou Conversões). Retorna o status na blockchain (`status`), o valor processado (`amount`), dados da moeda (`name`, `symbol`, `coinGecko`) e detalhes da rede utilizada (`blockchainNetwork`). |

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido. |
| **404** | `Not Found`             | • ID da transação informado não é válido.<br />• O depósito não existe no sistema.                |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com o suporte.                                        |

---

## Como usar

Embora a forma mais eficiente de acompanhar depósitos seja através do recebimento de **Webhooks**, esta rota de consulta é um endpoint de leitura indispensável para a manutenção do seu sistema.

### Casos de Uso Comuns

Você utilizará este endpoint principalmente nas seguintes situações:

1. **Reconciliação e Auditoria:** Confirmar se o valor (`amount`), os dados de rede (`blockchainNetwork`) ou o pagador (`document`) de um depósito recebido na XGate batem exatamente com o que consta no seu banco de dados interno.
2. **Recuperação de Falhas (Fallback):** Caso o seu servidor fique offline e você perca o recebimento de um Webhook, você pode criar uma rotina (CRON) que consulta os depósitos "Pendentes" utilizando este endpoint para atualizar os status perdidos e liberar o saldo para o usuário.
3. **Atendimento de Suporte (CS):** Buscar os dados de um depósito específico em tempo real para ajudar um cliente final que enviou o dinheiro, mas afirma que o saldo não caiu na plataforma.

### Exemplo Prático

A finalidade primária é a verificação do andamento da transação. Ao consultar o endpoint, você focará no campo `status` correspondente à operação para determinar o que mostrar ao seu cliente final.

**Verificando o pagamento:**

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
    const transactionId = "6a3da45e116************";

    try {
        const url_api = "https://api.xgateglobal.com";
        
        // 1. Obter token de autenticação
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        
        // 2. Consultar detalhes do depósito
        const { data } = await axios.get(`${url_api}/deposit/${transactionId}/details`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        
        console.log("Detalhes do Depósito:", data);
        
        // Lógica dinâmica para identificar o tipo de depósito com base na resposta
        let status = "Unknown";
        let mensagem = "";
        let origem = ""; // Inicia vazio para não exibir informações incorretas

        if (data.currency && data.cryptocurrency) {
            // Cenário 2: Conversão (Pix -> Crypto)
            status = data.cryptocurrency.status;
            mensagem = `Conversão: Entrou ${data.currency.amount} ${data.currency.name} e converteu para ${data.cryptocurrency.amount} ${data.cryptocurrency.name}`;
            if (data.document) origem = `Pix (Doc: ${data.document})`;
            
        } else if (data.cryptocurrency) {
            // Cenário 3: 100% Crypto
            status = data.cryptocurrency.status;
            const rede = data.cryptocurrency.blockchainNetwork?.name || "Desconhecida";
            mensagem = `Crypto: ${data.cryptocurrency.amount} ${data.cryptocurrency.name} via rede ${rede}`;
            origem = `Rede Blockchain`;
            
        } else if (data.currency) {
            // Cenário 1: 100% Fiat (Pix)
            status = data.currency.status;
            mensagem = `Fiat: ${data.currency.amount} ${data.currency.name} via ${data.currency.type}`;
            if (data.document) origem = `Pix (Doc: ${data.document})`;
        }
        
        // Formata a string de origem apenas se houver algum dado mapeado
        const sufixoOrigem = origem ? ` | Origem: ${origem}` : "";

        // Validação da liquidação da transação
        if (status === "PAID") {
            console.log(`[PAGO] ${mensagem}${sufixoOrigem}`);
        } else {
            console.log(`[${status}] ${mensagem}${sufixoOrigem}`);
        }

    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                console.error("Erro 404: O depósito não foi encontrado no sistema da XGate.");
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
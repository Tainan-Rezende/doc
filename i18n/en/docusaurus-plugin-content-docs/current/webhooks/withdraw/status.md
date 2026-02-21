---
sidebar_label: 'Consultar Saque'
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Consultar Saque

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

**1. Saque Fiat para Fiat (BRL para Pix):**

```json
{
    "_id": "6996170*******************",
    "currency": {
        "name": "BRL",
        "type": "PIX",
        "amount": 0.2,
        "status": "PAID"
    },
    "document": "487********",
    "externalId": "webhook-test-a30c0229",
    "identifiedDocumentPix": true,
    "customerId": "697e15d*******************"
}
```

**2. Saque Crypto para Fiat (USDT convertido para BRL via Pix):**

```json
{
    "_id": "697ce3d*******************",
    "currency": {
        "name": "BRL",
        "type": "PIX",
        "amount": 72.86,
        "status": "PAID"
    },
    "cryptocurrency": {
        "name": "USDT",
        "symbol": "USDT",
        "amount": 14,
        "status": "PAID",
        "coinGecko": "tether",
        "blockchainNetwork": {
            "name": "Ethereum",
            "chain": "Ethereum",
            "symbol": "ETH",
            "chainId": "1"
        }
    },
    "document": "487********",
    "identifiedDocumentPix": true,
    "customerId": "68e7b8f*******************"
}
```

**3. Saque Crypto para Crypto (USDT enviado para carteira externa):**

```json
{
    "_id": "691366b*******************",
    "cryptocurrency": {
        "name": "USDT",
        "symbol": "USDT",
        "amount": 73,
        "status": "PAID",
        "coinGecko": "tether",
        "gasFeeAmount": 0.8100194404665713,
        "blockchainNetwork": {
            "name": "BEP-20",
            "chain": "BSC",
            "symbol": "BNB",
            "chainId": "56"
        },
        "wallet": "0xcf677a******************************"
    },
    "customerId": "691362b*******************"
}
```

### Descrição dos Campos

| Campo                   | Tipo      | Descrição                                                                                                                                                          |
| :---------------------- | :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_id`                   | `string`  | ID único da transação gerado pela XGate.                                                                                                                           |
| `currency`              | `object`  | *(Condicional)* Objeto contendo os dados financeiros Fiat da transação, como moeda (`name`), método (`type`), valor (`amount`) e status (`status`).                |
| `cryptocurrency`        | `object`  | *(Condicional)* Objeto contendo os dados Crypto da transação, como moeda, valor, status, rede blockchain utilizada, taxa de gás e endereço da carteira (`wallet`). |
| `document`              | `string`  | *(Condicional)* O CPF/CNPJ vinculado à conta de destino do Pix.                                                                                                    |
| `externalId`            | `string`  | *(Opcional)* O ID do pedido no seu sistema, caso tenha sido enviado na criação.                                                                                    |
| `identifiedDocumentPix` | `boolean` | *(Condicional)* Indica se o documento do recebedor foi validado com sucesso pela rede Pix.                                                                         |
| `customerId`            | `string`  | ID do cliente vinculado à transação na XGate.                                                                                                                      |

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
        const transactionId = "6996170*******************";

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
            
            // Exemplo dinâmico de uso da resposta (Fiat ou Crypto):
            const operacao = data.currency || data.cryptocurrency;
            
            if (operacao && operacao.status === "PAID") {
                const destino = data.document || data.cryptocurrency.wallet;
                console.log(`O saque foi pago com sucesso para o destino: ${destino}`);
            } else {
                console.log("Status da transação:", operacao ? operacao.status : "Desconhecido");
            }

        } catch (error) {
            console.error("Erro na consulta:", error.response ? error.response.data : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
---
sidebar_label: 'Reenviar Webhook'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Reenviar Webhook

Este endpoint permite forçar o reenvio de uma notificação de webhook para uma transação de saque específica.



---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/withdraw/ID_TRANSACAO/resend/webhook
```

:::warning[Importante]
O valor **ID_TRANSACAO** na URL refere-se ao `_id` do saque. Esta requisição **não necessita de corpo (body)**, apenas a URL parametrizada e o Header de autenticação.
:::

---

## Requisição

### Headers Obrigatórios

| Header | Valor | Descrição |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <seu_token>` | Token JWT de autenticação obtido no login. |

---

## Respostas (Responses)

### Sucesso (200 OK)

O comando foi recebido e a XGate reenviou o payload do webhook para a URL cadastrada no seu painel.

```json
{
    "message": "Webhook de saque reenviado com sucesso"
}
```

### Erros Comuns

| Status | Mensagem | Motivo Provável |
| :--- | :--- | :--- |
| **401** | `Unauthorized` | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido.<br />• Você não tem autorização para realizar essa ação. |
| **404** | `Not Found` | • ID informado não é válido.<br />• A transação não existe. |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com o suporte. |

---

## Como usar

Esta é uma rota de contingência e manutenção. Diferente das rotas de consulta, ela executa uma ação ativa na XGate, fazendo com que nosso servidor dispare novamente a notificação HTTP para o seu sistema.

### Casos de Uso Comuns

Você utilizará este endpoint principalmente para:

1. **Recuperação de Falhas:** Se o seu servidor passou por instabilidades, caiu, ou o firewall bloqueou a requisição original da XGate, você pode usar este endpoint para "puxar" a notificação novamente e atualizar o status no seu banco de dados.
2. **Testes de Integração:** Durante a fase de desenvolvimento, você pode disparar o webhook de uma transação antiga várias vezes para testar se a lógica do seu código de recebimento está funcionando corretamente.

### Exemplo Prático

Basta fazer um POST para a URL informando o ID da transação. Você receberá uma mensagem de sucesso confirmando que o gatilho foi acionado.

```json
{
    "message": "Webhook de saque reenviado com sucesso"
}
```

---

## Integração

Abaixo, um exemplo simples de como implementar essa chamada utilizando Node.js. Como é um `POST` sem corpo, enviamos apenas um objeto vazio `{}` seguido dos headers.

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
        const transactionId = "6997146*******************";

        try {
            const url_api = "https://api.xgateglobal.com";
            
            // 1. Obter token de autenticação
            const login = await axios.post(`${url_api}/auth/token`, { email, password });
            
            // 2. Disparar o reenvio do Webhook (POST sem body)
            const { data } = await axios.post(`${url_api}/withdraw/${transactionId}/resend/webhook`, {}, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`
                }
            });
            
            console.log("Resposta:", data); 
            // Esperado: { message: 'Webhook de saque reenviado com sucesso' }

        } catch (error) {
            console.error("Erro ao reenviar:", error.response ? error.response.data : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
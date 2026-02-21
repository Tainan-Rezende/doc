---
sidebar_label: 'Webhook na Subconta'
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Criar Webhook da Subconta

Este endpoint permite cadastrar automaticamente a **primeira URL de Webhook** para uma subconta recém-criada. 

:::warning[Regra de Uso Único]
Esta rota foi desenhada exclusivamente para a configuração inicial (setup) da subconta. **Ela permite salvar apenas o primeiro webhook**. Caso a subconta já possua um webhook configurado, a API retornará um erro.
:::

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/webhook/subaccount
```

---

## Requisição

### Headers Obrigatórios

| Header | Valor | Descrição |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <seu_token>` | Token JWT de autenticação da **Subconta**. |

### Corpo da Requisição (Body)

| Parâmetro | Tipo | Validação | Descrição |
| :--- | :--- | :--- | :--- |
| `name` | `string` | Obrigatório | Um nome de identificação interno para o webhook (ex: "Primeiro Webhook"). |
| `externalWebhookUrl` | `string` | Obrigatório | A URL completa do seu servidor que irá receber os dados enviados pela XGate via POST. |

#### Exemplo de Payload

```json
{
    "externalWebhookUrl": "https://sua-empresa.com/api/webhooks/subaccount/xgate",
    "name": "Primeiro Webhook"
}
```

---

## Respostas (Responses)

### Sucesso (200 OK)

A URL de notificação foi registrada e já está ativa para a subconta.

```json
{
    "message": "Primeiro Webhook cadastrado com sucesso"
}
```

### Erros Comuns

| Status | Mensagem | Motivo Provável |
| :--- | :--- | :--- |
| **400** | `Bad Request` | • **Essa funcionalidade não está disponível para a sua Conta**: A conta que fez a requisição não é uma subconta válida para este fluxo.<br /><br />• **Essa funcionalidade permite salvar somente o primeiro webhook da sua conta**: A subconta **já possui** um webhook cadastrado. Esta rota só funciona quando a lista de webhooks está vazia. |
| **401** | `Unauthorized` | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido. |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com o suporte. |

---

## Como usar

### Casos de Uso Comuns

1. **Automação de Setup (Onboarding):** Quando a sua Conta Principal (Master) cria uma subconta para um novo cliente corporativo, você pode programar o seu sistema para, logo em seguida, já fazer o login na subconta recém-criada e acionar este endpoint. Isso garante que a subconta já nasça pronta para notificar o seu gateway interno sobre os pagamentos, sem a necessidade de operação manual no painel.

---

## Integração

Abaixo, um exemplo simples de como implementar essa chamada utilizando Node.js. Lembre-se de utilizar as credenciais da subconta para obter o token de autorização.

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
        // ATENÇÃO: Use o e-mail e senha da SUBCONTA para gerar o token desta ação
        const emailSubconta = "admin@subconta.com";
        const passwordSubconta = "••••••";

        try {
            const url_api = "https://api.xgateglobal.com";
            
            // 1. Obter token de autenticação da Subconta
            const login = await axios.post(`${url_api}/auth/token`, { 
                email: emailSubconta, 
                password: passwordSubconta 
            });
            
            // 2. Configurar o primeiro webhook
            const webhookData = {
                externalWebhookUrl: "https://api.sua-empresa.com/webhooks/xgate/subconta-1",
                name: "Webhook Principal - Subconta 1"
            };

            const { data } = await axios.post(`${url_api}/webhook/subaccount`, webhookData, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`,
                    "Content-Type": "application/json"
                }
            });
            
            console.log("Resposta:", data); 
            // Esperado: { message: 'Primeiro Webhook cadastrado com sucesso' }

        } catch (error) {
            console.error("Erro ao cadastrar webhook:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
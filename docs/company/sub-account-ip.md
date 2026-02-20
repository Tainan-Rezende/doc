---
sidebar_label: 'Liberar IP (Saque)'
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Liberar IP de Saque na Subconta

Este endpoint permite cadastrar automaticamente o **primeiro IP autorizado** para realizar requisições de saque em uma subconta recém-criada.

:::warning[Regra de Uso Único]
Esta rota foi desenhada exclusivamente para a configuração inicial (setup) da subconta. **Ela permite salvar apenas o primeiro IP**. Caso a subconta já possua um IP de saque configurado, a API retornará um erro e novos IPs deverão ser adicionados via Dashboard.
:::

:::info[Atenção: Saque vs Saldo]
O IP liberado por este endpoint tem permissão **exclusiva para criação de saques**. Ele **não** libera acesso para as rotas de Consulta de Saldo. A liberação de IPs para consulta de saldo possui uma configuração separada.
:::


---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/withdraw/allowed-ip/subaccount
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
| `ip` | `string` | Obrigatório | O endereço IP (IPv4 ou IPv6) do seu servidor que terá permissão para disparar saques nesta subconta. |

#### Exemplo de Payload

```json
{
    "ip": "8.8.8.8"
}
```

---

## Respostas (Responses)

### Sucesso (200 OK)

O endereço IP foi registrado na lista de permissões e já pode solicitar saques.

```json
{
    "message": "Primeiro IP liberado para solicitação de saque cadastrado com sucesso"
}
```

### Erros Comuns

Como esta é uma rota de uso único, as validações de regra de negócio costumam retornar status `400`.

| Status | Mensagem | Motivo Provável |
| :--- | :--- | :--- |
| **400** | `Bad Request` | • **Essa funcionalidade não está disponível para a sua Conta**: Essa rota só é disponível para o cadastro do primeiro IP de uma subconta. A conta que fez a requisição não é uma subconta válida para este fluxo.<br /><br />• **Essa funcionalidade permite liberar somente o primeiro IP de saque da sua conta**: Quando já tenha sido cadastrado um primeiro IP. A subconta **já possui** um IP cadastrado e a rota só funciona quando a lista está vazia. |
| **401** | `Unauthorized` | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP da requisição não permitido. |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com o suporte. |

---

## Como usar

### Casos de Uso Comuns

1. **Automação de Setup (Onboarding):** Assim como o Webhook, logo após criar a subconta via API para um novo cliente, seu sistema pode realizar o login nessa nova subconta e registrar o IP fixo do seu servidor financeiro. Isso garante que a subconta já nasça pronta e segura para processar saques automaticamente, sem precisar de intervenção manual da sua equipe de suporte.

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
            
            // 2. Configurar o primeiro IP autorizado para saque
            const ipData = {
                ip: "8.8.8.8"
            };

            const { data } = await axios.post(`${url_api}/withdraw/allowed-ip/subaccount`, ipData, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`,
                    "Content-Type": "application/json"
                }
            });
            
            console.log("Resposta:", data); 
            // Esperado: { message: 'Primeiro IP liberado para solicitação de saque cadastrado com sucesso' }

        } catch (error) {
            console.error("Erro ao cadastrar IP:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
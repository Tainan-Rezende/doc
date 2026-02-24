---
sidebar_label: 'Atualizar'
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import UpdateCustomerTester from '@site/src/components/UpdateCustomerTester';

# Atualizar Cliente

Este endpoint permite atualizar o registro de cliente na base de dados da XGATE.

---

## Endpoint
- **Método:** <span className="badge badge--info">PUT</span>
```bash title="URL do Endpoint"
https://api.xgateglobal.com/customer/CUSTOMER_ID
```

:::warning[Importante]
O valor **CUSTOMER_ID** se refere ao `_id` informado ao criar um cliente. 
:::

---

## Testar Integração

Simule a atualização de um cliente agora mesmo.

<UpdateCustomerTester />

---

## Requisição

### Headers Obrigatórios

| Header          | Valor                | Descrição                  |
| :-------------- | :------------------- | :------------------------- |
| `Authorization` | `Bearer <seu_token>` | Token JWT de autenticação. |

### Corpo da Requisição (Body)

| Campo      | Tipo     | Obrigatório | Descrição                            |
| :--------- | :------- | :---------- | :----------------------------------- |
| `name`     | `string` | Sim         | Nome completo do cliente.            |
| `document` | `string` | Sim         | CPF ou CNPJ (apenas números).        |
| `email`    | `string` | Não         | E-mail do cliente para notificações. |
| `phone`    | `string` | Não         | Telefone do cliente.                 |

---

## Respostas (Responses)

### Sucesso (200 OK)

Os dados do cliente foram atualizados com sucesso.

```json
{
    "message":"Cliente alterado com sucesso"
}
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                                                                            |
| :------ | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `Bad Request`           | Nome e/ou documento do cliente é obrigatório.                                                                                                              |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido.<br />• Você não tem autorização para realizar essa ação. |
| **409** | `Conflict`              | • Nome informado já está cadastrado.<br />• Documento informado já está cadastrado.                                                                        |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                                                                                   |

---

## Como usar

A rota de atualização de cliente é um endpoint de modificação de dados. Ela permite alterar as informações cadastrais de um usuário que já existe na sua base de dados da XGate.

### Casos de Uso Comuns

Você utilizará este endpoint principalmente em situações de manutenção da conta do usuário:

1. **Correção de Dados:** Ajustar erros de digitação no `name` ou corrigir o `document` (CPF/CNPJ) caso o usuário tenha preenchido incorretamente no momento do cadastro.
2. **Atualização de Contato:** Modificar o `email` ou `phone` do cliente estritamente para fins de notificação e comunicação, mantendo os dados de contato administrativo sempre em dia.
3. **Manutenção Cadastral (Espelhamento):** Garantir que, sempre que o cliente alterar os dados de perfil no seu próprio aplicativo ou site, essa mudança seja refletida automaticamente no ecossistema da XGate.

### Exemplo Prático

A finalidade primária desta rota é aplicar as mudanças e confirmar o sucesso da operação, sem retornar um grande volume de dados. Ao fazer a requisição informando o `_id` do cliente na URL e enviando as novas informações no corpo (body), a API processará a alteração e retornará uma confirmação simples.

**1. O que você recebe ao atualizar o cliente com sucesso:**
```json
{
    "message":"Cliente alterado com sucesso"
}
```

---

## Integração

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    O exemplo de integração utiliza a biblioteca <code>Axios</code> em Node.js.

    **Instalando `Axios`:**
```bash
npm install axios
```

    **Exemplo Javascript:**
```js
const axios = require("axios");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";
    const customerId = "***********";
    const customer = {
        name: "Name client",
        phone: "119*******",
        email: "your_email@domain.com",
        document: "000000*******"
    }

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.put(`${url_api}/customer/${customerId}`, customer, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        console.log(data); // Response
    } catch (error) {
        console.log(error.response.data.message) // Error
    }
})()
```
  </TabItem>
</Tabs>
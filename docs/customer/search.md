---
sidebar_label: 'Consultar'
sidebar_position: 1
description: 'Este endpoint consulta o registro de cliente na base da XGATE.'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ConsultCustomerTester from '@site/src/components/ConsultCustomerTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Consultar Cliente

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Consultar Cliente
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /customer/{id}:
    get:
      summary: Consultar Cliente
      description: Retorna os dados cadastrais completos de um cliente específico através do seu ID.
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
          description: ID único do cliente gerado pela XGate.
      responses:
        '200':
          description: Dados do cliente encontrados com sucesso.
          content:
            application/json:
              schema:
                type: object
                properties:
                  _id:
                    type: string
                  name:
                    type: string
                  email:
                    type: string
                  document:
                    type: string
                  version:
                    type: integer
                  createdDate:
                    type: string
                    format: date-time
                  updatedDate:
                    type: string
                    format: date-time
        '401':
          description: Unauthorized. Token inválido, não informado ou IP bloqueado.
        '404':
          description: Not Found. O ID informado não é válido ou o cliente não existe.
        '500':
          description: Internal Server Error.
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT`}
    />
</div>

Este endpoint consulta o registro de cliente na base da XGATE.

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>
```bash title="URL do Endpoint"
https://api.xgateglobal.com/customer/CUSTOMER_ID
```

:::warning[Importante]
O valor **CUSTOMER_ID** se refere ao `_id` informado ao criar um cliente. 
:::

:::tip[Dica de Integração: Recuperando um id]
A API da XGate utiliza o campo `name` como chave de validação de clientes. Se você perdeu o `_id` de um usuário, faça uma requisição de **Criação de Cliente** com o nome dele. O servidor identificará o nome já existente e retornará um erro amigável contendo o `_id` do registro já existente, permitindo que você atualize seu banco de dados interno.
:::

---

## Testar Integração

Simule a criação de um cliente agora mesmo. O resultado mostrará o `_id` gerado.

<ConsultCustomerTester />

---

## Requisição

### Headers Obrigatórios

| Header          | Valor                | Descrição                  |
| :-------------- | :------------------- | :------------------------- |
| `Authorization` | `Bearer <seu_token>` | Token JWT de autenticação. |


---

## Respostas (Responses)

### Sucesso (200 OK)

Os dados do cliente foram encontrados.

```json
{
  "_id": "697e15******************",
  "name": "Client Name",
  "email": "email@domain.com",
  "document": "123********",
  "version": 1,
  "createdDate": "202****************",
  "updatedDate": "202****************"
}
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                                                                            |
| :------ | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido.<br />• Você não tem autorização para realizar essa ação. |
| **404** | `Not Found`             | • ID informado não é válido.<br />O cliente não existe.                                                                                                    |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                                                                                   |

---

## Como usar

A rota de consulta de cliente é um endpoint de leitura. Ela serve para que você possa resgatar e verificar os dados atuais de um usuário já cadastrado na sua base da XGate.


### Casos de Uso Comuns

Diferente de rotas de pagamento, não há um fluxo complexo aqui. Você utilizará este endpoint principalmente para:

1. **Auditoria e Verificação:** Confirmar se o `document` (CPF/CNPJ) ou `email` vinculados àquele cliente estão corretos.
2. **Validação Pré-Atualização:** Buscar os dados cadastrais atuais do usuário para preencher os campos de uma tela de "Editar Perfil" no seu aplicativo front-end.
3. **Sincronização de Banco de Dados:** Garantir que o seu banco de dados interno esteja sempre com as informações mais atualizadas em sincronia com a XGate.

### Exemplo Prático

A finalidade primária é a visualização rápida e segura dos dados. Ao fazer a requisição de consulta informando o _id do cliente, você receberá o objeto completo dele.

**1. O que você recebe ao consultar o cliente:**

Note no exemplo abaixo como a rota retorna as informações vitais, permitindo que você faça a conferência do documento (linha destacada):
```json {5}
{
  "_id": "697e15******************",
  "name": "Client Name",
  "email": "email@domain.com",
  "document": "123********",
  "version": 1,
  "createdDate": "202****************",
  "updatedDate": "202****************"
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

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/customer/${customerId}`, {
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
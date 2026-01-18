---
sidebar_label: 'Criar'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CreateCustomerTester from '@site/src/components/CreateCustomerTester';

# Criar Cliente

Este endpoint cria um novo registro de cliente na base da XGATE. 

A criação do cliente é o primeiro passo da integração, pois retorna o **ID do Cliente** (`_id`), que é obrigatório para:
1.  Cadastrar Chaves Pix.
2.  Gerar QR Codes de Cobrança.
3.  Realizar Saques.

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>
```bash title="URL do Endpoint"
https://api.xgateglobal.com/customer
```

---

## Testar Integração

Simule a criação de um cliente agora mesmo. O resultado mostrará o `_id` gerado.

<CreateCustomerTester />

---

## Requisição

### Headers Obrigatórios

| Header          | Valor                | Descrição                       |
| :-------------- | :------------------- | :------------------------------ |
| `Authorization` | `Bearer <seu_token>` | Token JWT de autenticação.      |
| `Content-Type`  | `application/json`   | Formato do corpo da requisição. |

### Corpo da Requisição (Body)

| Campo      | Tipo     | Obrigatório | Descrição                            |
| :--------- | :------- | :---------- | :----------------------------------- |
| `name`     | `string` | Sim         | Nome completo do cliente.            |
| `document` | `string` | Sim         | CPF ou CNPJ (apenas números).        |
| `email`    | `string` | Sim         | E-mail do cliente para notificações. |

---

## Respostas (Responses)

### Sucesso (201 Created)

O cliente foi criado com sucesso e já pode ser utilizado.

```json
{
  "message": "Novo cliente criado com sucesso",
  "customer": {
    "_id": "696d1f3331117************",
    "name": "Name Client",
    "email": "email@domail",
    "document": "123***********"
  }
}
```

### Já existe (200 OK)

Já existe um cliente cadastrado com o mesmo nome.
```json
{
    "message": "Cliente já está cadastrado na base de dados",
    "customer": {
        "_id": "68e7b8f0dbed************"
    }
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

O **ID do Cliente** (`_id`) é o identificador único que conecta o usuário a todas as operações financeiras e de gestão dentro da plataforma.

Você precisará deste ID obrigatoriamente para:
1. **Transações:** Identificar a origem/destino em Depósitos e Saques.
2. **Chaves Pix:** Criar, listar ou remover chaves vinculadas ao cliente.
3. **Gestão:** Atualizar dados cadastrais do cliente.

### Exemplo Prático: Criando um Depósito

Para creditar valores (Depósito), você deve passar o ID do cliente dentro do campo `customerId` do payload.

**1. O que você recebe ao criar o Cliente:**
```json {4}
{
  "message": "Novo cliente criado com sucesso",
  "customer": {
    "_id": "696d1f3331117************",
    "name": "Name Client",
    "email": "email@domail",
    "document": "123***********"
  }
}
```
**2. Como usar a rota de Depósito (POST /deposit):**
<!-- ```json {7}
{
  "message": "Pix Gerado com Sucesso",
  "data": {
    "status": "WAITING_PAYMENT",
    "code": "00020126850014br.gov.bcb.pix****************************************",
    "id": "696d2778c953************",
    "customerId": "696d1f3331117************"
  }
}
``` -->
```json {3}
{
    "amount": 0.2,
    "customerId": "696d1f3331117************",
    "currency": {
        "_id": "6728f0a2cba3**************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-11-04T16:04:50.019Z",
        "updatedDate": "2024-11-07T02:23:38.606Z",
        "__v": 0,
        "symbol": "R$"
    }
}
```
O ID do cliente é passado como `customerId` para criar um pedido de depósito.

:::tip[Dica de Integração]
Sempre armazene o `_id` do cliente logo após a criação. Você vai usá-lo em **100%** das chamadas futuras relacionadas a este usuário.
:::
---
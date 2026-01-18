---
sidebar_label: 'Adicionar Chave'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import AddPixKeyTester from '@site/src/components/AddPixKeyTester';

# Adicionar Chave Pix

Este endpoint permite cadastrar uma nova chave Pix (E-mail, CPF, Telefone ou Aleatória) para a sua conta.

:::info[Nota sobre Validação]
O sistema valida automaticamente se o formato da chave corresponde ao `type` informado (ex: se o CPF tem 11 dígitos, se o e-mail é válido, etc).
:::

---

## Requisição

### Headers Obrigatórios

| Header          | Valor                | Descrição                       |
| :-------------- | :------------------- | :------------------------------ |
| `Authorization` | `Bearer <seu_token>` | Token JWT de autenticação.      |
| `Content-Type`  | `application/json`   | Formato do corpo da requisição. |

### Corpo da Requisição (Body)

| Campo  | Tipo     | Obrigatório | Descrição                                                            |
| :----- | :------- | :---------- | :------------------------------------------------------------------- |
| `key`  | `string` | Sim         | O valor da chave Pix (ex: `seu@email.com`, `+551199...`).            |
| `type` | `string` | Sim         | O tipo da chave. Valores aceitos: `EMAIL`, `CPF`, `PHONE`, `RANDOM`. |

---

## Testar Integração

Utilize o formulário abaixo para simular o cadastro de uma chave real.

<AddPixKeyTester />

---

## Respostas (Responses)

### Sucesso (201 Created)

A chave foi cadastrada com sucesso e já está pronta para uso.

```json
{
  "message": "Chave Pix adicionada com sucesso",
  "key": {
    "key": "444***********",
    "type": "CPF",
    "_id": "696c604456f8***********"
  }
}
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                             |
| :------ | :---------------------- | :---------------------------------------------------------------------------------------------------------- |
| **400** | `Bad Request`           | Chave Pix digitada não é válida.                                                                            |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido.           |
| **404** | `Not Found`             | • Chave Pix já registrada.<br />• Chave Pix não corresponde a um CPF válido.<br />• Cliente não encontrado. |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                                    |

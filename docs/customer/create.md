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

| Header | Valor | Descrição |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <seu_token>` | Token JWT de autenticação. |
| `Content-Type` | `application/json` | Formato do corpo da requisição. |

### Corpo da Requisição (Body)

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `name` | `string` | Sim | Nome completo do cliente. |
| `document` | `string` | Sim | CPF ou CNPJ (apenas números). |
| `email` | `string` | Sim | E-mail do cliente para notificações. |

---
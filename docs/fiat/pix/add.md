---
sidebar_label: 'Adicionar Chave'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import AddPixKeyTester from '@site/src/components/AddPixKeyTester';

# Adicionar Chave Pix

Este endpoint permite cadastrar uma nova chave Pix (E-mail, CPF, CNPJ, Telefone ou Aleatória) para seu cliente final.

<!-- :::info[Nota sobre Validação]
O sistema valida automaticamente se o formato da chave corresponde ao `type` informado (ex: se o CPF tem 11 dígitos, se o e-mail é válido, etc).
::: -->

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>
```bash title="URL do Endpoint"
https://api.xgateglobal.com/pix/customer/CLIENT_ID/key
```

:::warning[Importante]
O campo `CLIENT_ID` se refere ao ID do cliente, se ainda não criou, você pode cria-lo a partir da página de <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>criar clientes</a>.
:::

---

## Testar Integração

Utilize o formulário abaixo para simular o cadastro de uma chave real.

<AddPixKeyTester />

---

## Requisição

### Headers Obrigatórios

| Header          | Valor                | Descrição                  |
| :-------------- | :------------------- | :------------------------- |
| `Authorization` | `Bearer <seu_token>` | Token JWT de autenticação. |

#### Parâmetros de URL

| Parâmetro   | Tipo     | Obrigatório | Descrição                                                 |
| :---------- | :------- | :---------: | :-------------------------------------------------------- |
| `CLIENT_ID` | `string` |   **Sim**   | O `_id` do cliente que você deseja adicionar a chave pix. |

### Corpo da Requisição (Body)

| Campo  | Tipo     | Obrigatório | Descrição                                                                         |
| :----- | :------- | :---------- | :-------------------------------------------------------------------------------- |
| `key`  | `string` | Sim         | O valor da chave Pix (ex: `seu@email.com`, `+551199...`).                         |
| `type` | `string` | Sim         | O tipo da chave.<br />Valores aceitos: `EMAIL`, `CPF`, `CNPJ`, `PHONE`, `RANDOM`. |

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

## Como usar

A principal finalidade da adição de chaves Pix é permitir que o usuário realize um saque (**Withdraw**) utilizando a chave recém-criada.

A resposta deste endpoint fornece imediatamente o **Objeto Completo** da chave, que é obrigatório na construção do payload de saque.

### O Fluxo de Integração

1.  **Cadastre a chave:** Chame este endpoint (`POST /pix/customer/CLIENT_ID/key`).
2.  **Captura:** A API retornará os dados da chave criada. Armazene esse objeto.
3.  **Envio:** Você deve passar o **objeto inteiro** recebido dentro da propriedade `pixKey` no payload de saque.

:::warning[Atenção ao Formato]
Não envie os dados da chave Pix incompletos. O payload de saque espera o **objeto JSON completo** contendo `key`, `type` e `_id`.
:::

### Exemplo Prático

**1. O que você recebe ao criar chave pix:**
```json

{
    "message": "Chave Pix adicionada com sucesso",
    "key": {
      "key": "+5512**********",
      "type": "PHONE",
      "_id": "68fa5d5400**********"
    }
}

```

**2. Como você deve enviar no Saque (POST /withdraw):**

Você vai pegar o objeto acima e injetá-lo dentro de pixKey:
```json {13-17}
{
    "amount": 0.2,
    "customerId": "68e7b8****************",
    "currency": {
        "_id": "67339fa800****************",
        "name": "BRL",
        "type": "PIX",
        "symbol": "R$",
        "createdDate": "2024-11-12T18:34:16.289Z",
        "updatedDate": "2024-11-12T18:34:16.289Z",
        "__v": 0
    },
    "pixKey": {
        "key": "+5512**********",
        "type": "PHONE",
        "_id": "68fa5d5400**********"
    }
}
```
Cada informação desse JSON será explicado na <a href={useBaseUrl('/docs/fiat/withdraw/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>página de saques</a>.

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
    const customerId = "12************";
    const key = "+55***********";
    const type = "PHONE";

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.post(`${url_api}/pix/customer/${customerId}/key`, {
            key,
            type
        }, {
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
  <TabItem value="python" label="Python">
    O exemplo de integração utiliza a biblioteca <code>requests</code>.

    **Instalando `requests`:**
    ```bash
    pip install requests
    ```

    **Exemplo Python:**
    ```py
import requests

email = "your_email@domain.com"
password = "**********"
customer_id = "12************"
key = "+55***********"
type_ = "PHONE"

try:
    url_api = "https://api.xgateglobal.com"
    
    # Autenticação para obter o token
    login_response = requests.post(f"{url_api}/auth/token", json={"email": email, "password": password})
    login_response.raise_for_status()
    token = login_response.json().get("token")
    
    # Requisição com autenticação
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"key": key, "type": type_}
    response = requests.post(f"{url_api}/pix/customer/{customer_id}/key", json=payload, headers=headers)
    response.raise_for_status()
    
    print(response.json())  # Response
except requests.exceptions.RequestException as error:
    try:
        print(error.response.json().get("message"))  # Error
    except AttributeError:
        print("Erro ao processar a requisição.")
    ```
  </TabItem>
  <TabItem value="php" label="PHP">
    <p>Exemplo de como adicionar chave pix usando cURL nativo do PHP.</p>
    ```php
    $email = "your_email@domain.com";
$password = "**********";
$customerId = "12************";
$key = "+55***********";
$type = "PHONE";

$url_api = "https://api.xgateglobal.com";

try {
    // Autenticação para obter o token
    $login_response = file_get_contents("$url_api/auth/token", false, stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => json_encode(['email' => $email, 'password' => $password])
        ]
    ]));
    
    $login_data = json_decode($login_response, true);
    $token = $login_data['token'] ?? '';
    
    // Requisição com autenticação
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => "Authorization: Bearer $token\r\nContent-Type: application/json\r\n",
            'content' => json_encode(['key' => $key, 'type' => $type])
        ]
    ];
    
    $response = file_get_contents("$url_api/pix/customer/$customerId/key", false, stream_context_create($options));
    
    echo $response; // Response
} catch (Exception $error) {
    echo "Erro ao processar a requisição.";
}
    ```
  </TabItem>
</Tabs>
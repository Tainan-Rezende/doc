---
sidebar_label: 'Remover Chave'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DeletePixKeyTester from '@site/src/components/DeletePixKeyTester';

# Remover Chave Pix

Este endpoint permite remover a chave pix de seu cliente final.

<!-- :::info[Nota sobre Validação]
O sistema valida automaticamente se o formato da chave corresponde ao `type` informado (ex: se o CPF tem 11 dígitos, se o e-mail é válido, etc).
::: -->

---
## Endpoint
- **Método:** <span className="badge badge--danger">DELETE</span>
```bash title="URL do Endpoint"
https://api.xgateglobal.com/pix/customer/CLIENT_ID/key/remove/KEY_ID
```

:::warning[Importante]
O campo `CLIENT_ID` se refere ao ID do cliente, se ainda não criou, você pode cria-lo a partir da página de <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>criar clientes</a>.
:::
:::warning[Importante]
O campo `KEY_ID` se refere ao ID da chave pix, se ainda não criou, você pode cria-la a partir da página de <a href={useBaseUrl('/docs/fiat/pix/add')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>criar chave pix</a>.
:::

---

## Testar Integração

Utilize o formulário abaixo para simular a remoção de uma chave real.

<DeletePixKeyTester />

---

## Requisição

### Headers Obrigatórios

| Header          | Valor                | Descrição                       |
| :-------------- | :------------------- | :------------------------------ |
| `Authorization` | `Bearer <seu_token>` | Token JWT de autenticação.      |

---

## Respostas (Responses)

### Sucesso (201 Created)

A chave foi removida com sucesso.

```json
{
  "message": "Chave Pix removida com sucesso"
}
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido. |
| **404** | `Not Found`             | • Cliente não encontrado.<br />• Chave Pix não encontrada.                                        |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                          |

## Como usar

A finalidade deste endpoint é permitir a **manutenção** da lista de chaves do usuário, removendo registros obsoletos, incorretos ou que não devem mais ser utilizados para saques.

Uma vez excluída, a chave **não poderá mais ser utilizada** em nenhuma transação de saque (`/withdraw`).

### O Fluxo de Integração

Para deletar uma chave, você precisa saber qual é o ID dela (`_id`). O fluxo comum é:

1.  **Listar:** Consulte as chaves do cliente (`GET /pix/customer/{id}/key`) para visualizar as opções.
2.  **Identificar:** Capture o `_id` da chave que deseja remover.
3.  **Remover:** Envie esse `_id` na URL deste endpoint de deleção.

:::danger[Ação Destrutiva]
A remoção é permanente. Se o usuário tentar realizar um saque enviando o objeto de uma chave que já foi deletada, a API retornará um erro de validação.
:::

### Exemplo Prático

**1. Encontrando o ID na Listagem:**
Ao listar as chaves, você verá o campo `_id`. É ele que precisamos.

```json {5}
[
  {
    "key": "+5512************",
    "type": "PHONE",
    "_id": "68fa5d54004*************"
  }
]
```

**2. Montando a URL de deleção:**

Você deve inserir o ID do cliente e o ID da chave na rota:
```url
DELETE /pix/customer/CLIENT_ID/key/remove/68fa5d54004*************
```

**3. A resposta:**

A resposta esperada deve ser sucesso (201 Created):

```json
{
  "message": "Chave Pix removida com sucesso"
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
    const customerId = "12************";
    const keyId = "1A***********";

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.delete(`${url_api}/pix/customer/${customerId}/key/remove/${keyId}`, {
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
key_id = "1A***********"

try:
    url_api = "https://api.xgateglobal.com"
    
    # Login request
    login_response = requests.post(f"{url_api}/auth/token", json={"email": email, "password": password})
    login_response.raise_for_status()
    token = login_response.json().get("token")
    
    # Delete request
    headers = {"Authorization": f"Bearer {token}"}
    delete_response = requests.delete(f"{url_api}/pix/customer/{customer_id}/key/remove/{key_id}", headers=headers)
    delete_response.raise_for_status()
    
    print(delete_response.json())  # Response
except requests.exceptions.RequestException as error:
    print(error.response.json().get("message", "An error occurred"))  # Error
    ```
  </TabItem>
  <TabItem value="php" label="PHP">
    <p>Exemplo de como adicionar chave pix usando cURL nativo do PHP.</p>
    ```php
$email = "your_email@domain.com";
$password = "**********";
$customerId = "12************";
$keyId = "1A***********";
$url_api = "https://api.xgateglobal.com";

$loginUrl = $url_api . "/auth/token";
$loginData = json_encode(["email" => $email, "password" => $password]);

$ch = curl_init($loginUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$loginResponse = curl_exec($ch);
if ($loginResponse === false) {
    die('Login Error: ' . curl_error($ch));
}
$token = json_decode($loginResponse, true)['token'];
curl_close($ch);

$deleteUrl = $url_api . "/pix/customer/$customerId/key/remove/$keyId";

$ch = curl_init($deleteUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($response === false) {
    echo 'Curl Error: ' . curl_error($ch);
} else {
    if ($httpCode >= 200 && $httpCode < 300) {
        echo "Chave removida com sucesso! (Status: $httpCode)";
    } else {
        echo "Erro ao remover: " . $response;
    }
}

curl_close($ch);
    ```
  </TabItem>
</Tabs>
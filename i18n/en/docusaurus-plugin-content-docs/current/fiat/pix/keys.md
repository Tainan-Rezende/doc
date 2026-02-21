---
sidebar_label: 'Chaves Pix'
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import PixKeysTester from '@site/src/components/PixKeysTester';

# Listar Chaves Pix

Este endpoint retorna todas as chaves Pix cadastradas para a sua conta. Use esta rota para consultar quais chaves você já tem ativas antes de tentar cadastrar uma nova.

---
## Endpoint
- **Método:** <span className="badge badge--success">GET</span>
```bash title="URL do Endpoint"
https://api.xgateglobal.com/pix/customer/CLIENT_ID/key
```
:::warning[Importante]
O campo `CLIENT_ID` se refere ao ID do cliente, se ainda não criou, você pode cria-lo a partir da página de <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>criar clientes</a>.
:::

---

## Testar Integração

Utilize o formulário abaixo para simular a listagem de chaves pix.

<PixKeysTester />

---

## Requisição

A requisição não requer corpo (`body`), apenas os **Headers** de autenticação.

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

#### Parâmetros de URL

| Parâmetro   | Tipo     | Obrigatório | Descrição |
| :---------- | :------- | :---------: | :-------- |
| `CLIENT_ID` | `string` | **Sim** | O `_id` do cliente que você deseja consultar a lista de chaves. |

---

## Respostas (Responses)

### Sucesso (200 OK)

Retorna uma lista (array) de objetos, onde cada objeto é uma chave cadastrada.

```json
[
  {
    "key": "+5512************",
    "type": "PHONE",
    "_id": "68fa5d54004*************"
  }
]
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido. |
| **404** | `Not Found`             | Cliente não encontrado.                                                                           |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                          |

---

## Como usar

A principal finalidade de listar as chaves é permitir que o usuário selecione uma delas para realizar um saque (**Withdraw**).

A resposta deste endpoint fornece o **Objeto Completo** da chave, que é obrigatório na construção do payload de saque.

### O Fluxo de Integração

1.  **Liste as chaves:** Chame este endpoint (`GET /pix/customer/CLIENT_ID/key`).
2.  **Seleção:** Escolha qual chave quer usar, se houver mais de uma (ex: a primeira da lista).
3.  **Envio:** Você deve passar o **objeto inteiro** dentro da propriedade `pixKey` no payload de saque.

:::warning[Atenção ao Formato]
Não envie os dados da chave pix incompleto. O payload de saque espera o **objeto JSON completo** contendo `key`, `type` e `_id`.
:::

### Exemplo Prático

**1. O que você recebe ao listar as chaves pix:**
```json
[
  {
    "key": "+5512**********",
    "type": "PHONE",
    "_id": "68fa5d5400**********"
  }
]
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
Cada informação desse JSON será explicado na <a href={useBaseUrl('/docs/fiat/withdraw/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>página de criar pedido de saques</a>.

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
        const customerId = "12************"

        try {
            const url_api = "https://api.xgateglobal.com"
            const login = await axios.post(`${url_api}/auth/token`, { email, password });
            const { data } = await axios.get(`${url_api}/pix/customer/${customerId}/key`, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`
                }
            });
            console.log(data); // Response
        } catch (error) {
            console.log(error.response.data.message) // Error
        }
    })();
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

try:
    url_api = "https://api.xgateglobal.com"
    
    # Login
    login_response = requests.post(f"{url_api}/auth/token", json={"email": email, "password": password})
    login_response.raise_for_status()  # Levanta um erro se a resposta não for 2xx
    
    token = login_response.json().get("token")

    # Buscar informações PIX
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{url_api}/pix/customer/{customer_id}/key", headers=headers)
    response.raise_for_status()

    print(response.json())  # Response

except requests.exceptions.RequestException as error:
    print(error.response.json().get("message", "Erro desconhecido"))  # Error
    ```
  </TabItem>
  <TabItem value="php" label="PHP">
    <p>Exemplo de como obter a lista de chaves pix usando cURL nativo do PHP.</p>
    ```php
    $email = "your_email@domain.com";
$password = "**********";
$customerId = "12************";

try {
    $url_api = "https://api.xgateglobal.com";

    // Login
    $login_ch = curl_init("$url_api/auth/token");
    curl_setopt($login_ch, CURLOPT_POST, true);
    curl_setopt($login_ch, CURLOPT_POSTFIELDS, json_encode(["email" => $email, "password" => $password]));
    curl_setopt($login_ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($login_ch, CURLOPT_RETURNTRANSFER, true);
    
    $login_response = curl_exec($login_ch);
    $login_info = json_decode($login_response, true);
    
    if (curl_errno($login_ch)) {
        throw new Exception("Erro ao fazer login: " . curl_error($login_ch));
    }

    curl_close($login_ch);

    if (!isset($login_info["token"])) {
        throw new Exception("Token não recebido.");
    }

    $token = $login_info["token"];

    // Buscar informações PIX
    $pix_ch = curl_init("$url_api/pix/customer/$customerId/key");
    curl_setopt($pix_ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $token",
        "Content-Type: application/json"
    ]);
    curl_setopt($pix_ch, CURLOPT_RETURNTRANSFER, true);

    $pix_response = curl_exec($pix_ch);
    $pix_info = json_decode($pix_response, true);

    if (curl_errno($pix_ch)) {
        throw new Exception("Erro ao buscar dados PIX: " . curl_error($pix_ch));
    }

    curl_close($pix_ch);

    print_r($pix_info); // Response

} catch (Exception $e) {
    echo "Erro: " . $e->getMessage();
}
    ```
  </TabItem>
</Tabs>
---
sidebar_label: 'Login'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import AuthTester from '@site/src/components/AuthTester';

# Fazer login

Toda a interação com a API XGATE é protegida e exige autenticação. O primeiro passo para qualquer integração é obter seu token de acesso.

Este endpoint permite que você troque seu `email` e `senha` por um **Bearer Token** (no formato [JWT](https://jwt.io/)). Este token deverá ser enviado em todas as futuras requisições no cabeçalho (header) `Authorization`.

**Importante:** O token gerado é válido por **15 dias**. Após esse período, você precisará gerar um novo token usando esta mesma rota.

---

## Endpoint

- **Método:** <span className="badge badge--info">POST</span>
```bash title="URL do Endpoint"
https://api.xgateglobal.com/auth/token
```

:::tip Teste em Tempo Real
Utilize o formulário abaixo para gerar um token válido diretamente pelo navegador.
:::

<AuthTester />

---

## Requisição

Envie um objeto JSON no corpo (`body`) da requisição com as seguintes propriedades:

| Campo      | Tipo   | Obrigatório | Descrição                          |
| :--------- | :----- | :---------- | :--------------------------------- |
| `email`    | String | Sim         | Seu e-mail de acesso à plataforma. |
| `password` | String | Sim         | Sua senha de acesso.               |

#### Exemplo de Body (JSON)

```json
{
  "email": "email@company.com",
  "password": "Your.Password"
}
```

---

## Respostas (Responses)

### Sucesso (200 OK)

Em caso de sucesso, a API retornará um objeto JSON contendo o seu token de acesso:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibm******************************"
}
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • E-mail ou senha incorretos. |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                          |

---
## Como usar

Após receber o token, você deve armazená-lo de forma segura e enviá-lo em todas as requisições subsequentes para rotas protegidas.

O token deve ser enviado no cabeçalho `Authorization` usando o prefixo `Bearer` (seguido de um espaço).

**Exemplo de Header**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```
:::warning[Lembrete de Expiração]
O token expira em 15 dias. Se você começar a receber erros 401 Unauthorized em suas requisições (mesmo com o token), é provável que ele tenha expirado. Basta realizar o login novamente para gerar um novo token.
:::

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

    const apiUrl = "https://api.xgateglobal.com";
    const credentials = {
        email: "your_email@domain.com",
        password: "**********"
    };

    (async () => {
        try {
            const response = await axios.post(`${apiUrl}/auth/token`, credentials);
            console.log(response.data);
        } catch (error) {
            if (error.response && error.response.data) {
            console.error(error.response.data.message || "An error occurred");
            } else {
            console.error(error.message);
            }
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

    api_url = "https://api.xgateglobal.com"
    credentials = {
        "email": "your_email@domain.com",
        "password": "**********"
    }

    try:
        response = requests.post(f"{api_url}/auth/token", json=credentials)
        response.raise_for_status()  # Raises an exception for 4xx/5xx errors
        print(response.json())

    except requests.exceptions.RequestException as error:
        if error.response is not None:
            # Print the error message from the API response
            print(error.response.json().get("message", "An error occurred"))
        else:
            # Handle connection errors
            print(f"Connection error: {error}")
    ```
  </TabItem>
  <TabItem value="php" label="PHP">
    <p>Exemplo de como obter o token usando cURL nativo do PHP.</p>
    ```php

    $apiUrl = "https://api.xgateglobal.com";
    $credentials = [
        "email" => "your_email@domain.com",
        "password" => "**********"
    ];

    $payload = json_encode($credentials);

    // Initialize cURL for the specific endpoint
    $ch = curl_init($apiUrl . "/auth/token");

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        echo $response;
    } else {
        $errorResponse = json_decode($response, true);
        // Check if 'message' key exists in the error response
        if (isset($errorResponse["message"])) {
            echo $errorResponse["message"];
        } else {
            echo "An error occurred. HTTP Status: " . $httpCode;
        }
    }
    ```
  </TabItem>
</Tabs>
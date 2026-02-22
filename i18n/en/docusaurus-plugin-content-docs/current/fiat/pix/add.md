---
sidebar_label: 'Add Pix Key'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import AddPixKeyTester from '@site/src/components/AddPixKeyTester';

# Add Pix Key

This endpoint allows registering a new Pix key (Email, CPF, CNPJ, Phone or Random) for your end customer.

---
## Endpoint
 - **Method:** <span className="badge badge--info">POST</span>
```bash title="Endpoint URL"
https://api.xgateglobal.com/pix/customer/CLIENT_ID/key
```

:::warning[Important]
The `CLIENT_ID` field refers to the customer ID; if you haven't created it yet, you can create it from the <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>create customers</a> page.
:::

---


## Test Integration

Use the form below to simulate registering a real Pix key.

<AddPixKeyTester />

---

## Request

### Required Headers

| Header          | Value                | Description               |
| :-------------- | :------------------- | :------------------------ |
| `Authorization` | `Bearer <your_token>` | JWT authentication token. |

### URL Parameters

| Parameter   | Type     | Required | Description                                                    |
| :---------- | :------- | :------: | :------------------------------------------------------------- |
| `CLIENT_ID` | `string` | **Yes**  | The `_id` of the customer to whom you want to add the Pix key. |

### Request Body

| Field  | Type     | Required | Description                                                                    |
| :----- | :------- | :------: | :----------------------------------------------------------------------------- |
| `key`  | `string` |   Yes    | The Pix key value (ex: `your@email.com`, `+551199...`).                        |
| `type` | `string` |   Yes    | The key type.<br />Accepted values: `EMAIL`, `CPF`, `CNPJ`, `PHONE`, `RANDOM`. |

---

## Responses

### Success (201 Created)

The key was successfully registered and is ready for use.

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

### Common Errors

| Status  | Message                 | Likely Cause                                                                                                |
| :------ | :---------------------- | :---------------------------------------------------------------------------------------------------------- |
| **400** | `Bad Request`           | The provided Pix key is not valid.                                                                          |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing header.<br /> • IP not allowed.                      |
| **404** | `Not Found`             | • Pix key already registered.<br />• Pix key does not correspond to a valid CPF.<br />• Customer not found. |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                                                     |

## How to use

The main purpose of adding Pix keys is to allow the user to perform a withdrawal (**Withdraw**) using the newly created key.

The response from this endpoint immediately provides the **Full Object** of the key, which is required when building the withdrawal payload.
### Integration Flow

1.  **Register the key:** Call this endpoint (`POST /pix/customer/CLIENT_ID/key`).
2.  **Capture:** The API will return the created key data. Store this object.
3.  **Submit:** You must pass the **entire object** received inside the `pixKey` property in the withdrawal payload.

:::warning[Format Warning]
Do not send incomplete Pix key data. The withdrawal payload expects the **complete JSON object** containing `key`, `type` and `_id`.
:::

### Practical Example

**1. What you receive when creating a Pix key:**
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

**2. How you should send it in the Withdrawal (POST /withdraw):**

You will take the object above and inject it inside `pixKey`:
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
Each field in this JSON is explained on the <a href={useBaseUrl('/docs/fiat/withdraw/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>withdrawals page</a>.

---

## Integration

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
        The integration example uses the <code>Axios</code> library in Node.js.

        **Installing `Axios`:**
    ```bash
    npm install axios
    ```

        **JavaScript Example:**
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
        The integration example uses the <code>requests</code> library.

        **Installing `requests`:**
    ```bash
    pip install requests
    ```

        **Python Example:**
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
        <p>Example of how to add a Pix key using native PHP cURL.</p>
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
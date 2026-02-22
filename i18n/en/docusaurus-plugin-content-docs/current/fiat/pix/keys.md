---
sidebar_label: 'Pix Keys'
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import PixKeysTester from '@site/src/components/PixKeysTester';

# List Pix Keys

This endpoint returns all Pix keys registered for your account. Use this route to check which keys are already active before attempting to register a new one.

---
## Endpoint
- **Method:** <span className="badge badge--success">GET</span>
```bash title="Endpoint URL"
https://api.xgateglobal.com/pix/customer/CLIENT_ID/key
```
:::warning[Important]
The `CLIENT_ID` field refers to the customer ID; if you haven't created it yet, you can create it from the <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>create customers</a> page.
:::

---

## Test Integration

Use the form below to simulate listing Pix keys.

<PixKeysTester />

---

## Request

The request does not require a body (`body`); only authentication **Headers**.

#### Required Headers

| Header          | Value                | Description                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <your_token>` | The JWT token obtained at login. |

#### URL Parameters

| Parameter   | Type     | Required | Description |
| :---------- | :------- | :------: | :-------- |
| `CLIENT_ID` | `string` | **Yes** | The `_id` of the customer whose key list you want to query. |

---

## Responses

### Success (200 OK)

Returns a list (array) of objects, where each object is a registered key.

```json
[
  {
    "key": "+5512************",
    "type": "PHONE",
    "_id": "68fa5d54004*************"
  }
]
```

### Common Errors

| Status  | Message                | Likely Cause                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing header.<br /> • IP not allowed. |
| **404** | `Not Found`             | Customer not found.                                                                           |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                          |

---

## How to use

The main purpose of listing keys is to allow the user to select one to perform a withdrawal (**Withdraw**).

The response from this endpoint provides the **Full Object** of the key, which is required when building the withdrawal payload.

### Integration Flow

1.  **List the keys:** Call this endpoint (`GET /pix/customer/CLIENT_ID/key`).
2.  **Selection:** Choose which key you want to use, if there is more than one (e.g., the first in the list).
3.  **Submit:** You must pass the **entire object** inside the `pixKey` property in the withdrawal payload.

:::warning[Format Warning]
Do not send incomplete Pix key data. The withdrawal payload expects the **complete JSON object** containing `key`, `type`, and `_id`.
:::

### Practical Example

**1. What you receive when listing Pix keys:**
```json
[
  {
    "key": "+5512**********",
    "type": "PHONE",
    "_id": "68fa5d5400**********"
  }
]
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
Each field in this JSON is explained on the <a href={useBaseUrl('/docs/fiat/withdraw/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>create withdrawal request page</a>.

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
    <p>Example of how to obtain the list of Pix keys using native PHP cURL.</p>
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
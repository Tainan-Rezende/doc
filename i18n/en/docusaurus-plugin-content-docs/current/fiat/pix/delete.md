---
sidebar_label: 'Remove Pix Key'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DeletePixKeyTester from '@site/src/components/DeletePixKeyTester';

# Remove Pix Key

This endpoint allows removing a customer's Pix key.

---
## Endpoint
- **Method:** <span className="badge badge--danger">DELETE</span>
```bash title="Endpoint URL"
https://api.xgateglobal.com/pix/customer/CLIENT_ID/key/remove/KEY_ID
```

:::warning[Important]
The `CLIENT_ID` field refers to the customer ID; if you haven't created it yet, you can create it from the <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>create customers</a> page.
:::
:::warning[Important]
The `KEY_ID` field refers to the Pix key ID; if you haven't created it yet, you can create one from the <a href={useBaseUrl('/docs/fiat/pix/add')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>create Pix key</a> page.
:::

---

## Test Integration

Use the form below to simulate removing a real Pix key.

<DeletePixKeyTester />

---

## Request

### Required Headers

| Header          | Value                | Description                  |
| :-------------- | :------------------- | :------------------------- |
| `Authorization` | `Bearer <seu_token>` | JWT authentication token. |

#### URL Parameters

| Parameter   | Type     | Required | Description                                               |
| :---------- | :------- | :------: | :------------------------------------------------------ |
| `CLIENT_ID` | `string` | **Yes**   | The `_id` of the customer whose Pix key you want to delete. |
| `KEY_ID`    | `string` | **Yes**   | The `_id` of the Pix key to remove.                        |

---

## Responses

### Success (201 Created)

The key was successfully removed.

```json
{
  "message": "Chave Pix removida com sucesso"
}
```

### Common Errors

| Status  | Message                | Likely Cause                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • Invalid or missing header.<br /> • IP not allowed. |
| **404** | `Not Found`             | • Customer not found.<br />• Pix key not found.                                        |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                          |

## How to use

This endpoint allows **maintenance** of a user's key list by removing obsolete, incorrect, or no longer used keys for withdrawals.

Once removed, the key **can no longer be used** in any withdrawal transaction (`/withdraw`).

### Integration Flow

To delete a key you need to know its ID (`_id`). Common flow:

1.  **List:** Call the customer's keys (`GET /pix/customer/{id}/key`) to view available options.
2.  **Identify:** Capture the `_id` of the key you want to remove.
3.  **Remove:** Send that `_id` in the URL of this deletion endpoint.

:::danger[Destructive Action]
Removal is permanent. If a user attempts a withdrawal using an object of a key that has already been deleted, the API will return a validation error.
:::

### Practical Example

**1. Finding the ID in the listing:**
When listing keys you will see the `_id` field.

```json {5}
[
  {
    "key": "+5512************",
    "type": "PHONE",
    "_id": "68fa5d54004*************"
  }
]
```

**2. Building the deletion URL:**

You must insert the customer ID and the key ID into the route:
```url
DELETE /pix/customer/68e7b8f0db*************/key/remove/68fa5d54004*************
```

**3. The response:**

Expected response is success (201 Created):

```json
{
  "message": "Chave Pix removida com sucesso"
}
```
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
  <p>Example of how to delete a Pix key using native PHP cURL.</p>
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
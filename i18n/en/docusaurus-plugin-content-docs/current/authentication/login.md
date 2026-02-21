---
sidebar_label: 'Login'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import AuthTester from '@site/src/components/AuthTester';

# Login

All interaction with the XGate API is secured and requires authentication. The first step for any integration is to obtain your access token.

This Endpoint allows you to exchange your `email` and `password` for a **Bearer Token** (in [JWT](https://jwt.io/) format). This token must be sent in all future requests in the `Authorization` Header.

:::warning[Important]
The generated token is valid for **15 days**. After this period, you will need to generate a new token using the same route.
:::

---

## Endpoint

- **Método:** <span className="badge badge--info">POST</span>
```bash title="URL do Endpoint"
https://api.xgateglobal.com/auth/token
```

---

## Test Integration

Use the form below to generate a valid token directly from your browser.

<AuthTester />

---

## Request

Send a JSON object in the request `body` with the following properties:

| Field      | Type   | Required    | Description                        |
| :--------- | :----- | :---------- | :--------------------------------- |
| `email`    | String | Yes         | Your platform access email.        |
| `password` | String | Yes         | Your access password.              |

#### Example Body (JSON)
```json
{
  "email": "email@company.com",
  "password": "Your.Password"
}
```

---

## Responses

### Success (200 OK)

On success, the API will return a JSON object containing your access token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibm******************************"
}
```

### Common Errors

| Status  | Message                 | Likely Reason                                                                                     |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Incorrect email or password.                                                                    |
| **500** | `Internal Server Error` | Internal server error. Contact support.                                                           |

---
## How to use

After receiving the token, you should store it securely and send it in all subsequent requests to protected routes.

The token must be sent in the `Authorization` Header using the `Bearer` prefix (followed by a space).

**Example Header**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```
:::warning[Expiration Reminder]
The token expires in 15 days. If you start receiving 401 Unauthorized errors in your requests (even with the token), it is likely expired. Simply login again to generate a new token.
:::

---

## Integration

<Tabs groupId="sdk-examples">
    <TabItem value="js" label="Node.js">
        The integration example uses the <code>Axios</code> library in Node.js.

        **Installing `Axios`:**
        ```bash
        npm install axios
        ```

        **Javascript Example:**
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
        The integration example uses the <code>requests</code> library.

        **Installing `requests`:**
        ```bash
        pip install requests
        ```

        **Python Example:**
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
        <p>Example of obtaining the token using PHP's native cURL.</p>
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
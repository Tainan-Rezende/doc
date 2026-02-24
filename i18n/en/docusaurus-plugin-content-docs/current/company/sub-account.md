---
sidebar_label: 'Create Subaccount'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Create Subaccount

This endpoint allows a Partner (Main Account) to create **Subaccounts** linked to their profile. 

A subaccount operates as an independent operation: it has its own balance, its own administrative users, and its own end customers. However, it is interconnected to your main account through a **Fee Split** system.

When creating the subaccount, you define a fee percentage (`fee`) for each deposit and withdrawal method. Every time the subaccount performs a transaction, this percentage will be deducted from it and automatically sent to your Main Account balance.

---

## Endpoint
- **Method:** <span className="badge badge--info">POST</span>

```bash title="Endpoint URL"
https://api.xgateglobal.com/company/subaccount
```

---

## Request

### Required Headers

| Header          | Value                | Description                                           |
| :-------------- | :------------------- | :---------------------------------------------------- |
| `Authorization` | `Bearer <your_token>` | JWT authentication token of your **Main Account**.    |

### Request Body

The creation payload is extensive, as you must send the new company data and configure all operational inbound (`deposit`) and outbound (`withdraw`) fees.

| Parameter  | Type     | Validation  | Description                                                                     |
| :--------- | :------- | :---------- | :------------------------------------------------------------------------------ |
| `user`     | `object` | Required    | Company data, `email` and `password` are used for first access to the system.   |
| `deposit`  | `object` | Required    | Deposit fees in `currency`, `cryptocurrency` and `blockchain`.                  |
| `withdraw` | `object` | Required    | Withdrawal fees in `currency`, `cryptocurrency` and `blockchain`.               |

:::tip[System Access]
Although the password (`password`) is sent in the request for the first access, the subaccount administrator can reset it later through the "Forgot my password" flow or if the platform requires a reset for security reasons.
:::

#### Payload Example

In the example below, the main account is configuring a **1% fee (`"value": 1`)** for subaccount operations.

```json
{
    "user": {
        "name": "Nome da Subconta Ltda",
        "email": "contato@subconta.com",
        "password": "SenhaSegura123!",
        "phone": {
            "type": "mobile",
            "number": "999999999",
            "areaCode": "11",
            "countryCode": "55"
        }
    },
    "deposit": {
        "currencies": [
            {
                "currency": {
                    "_id": "6728f0a2cb************",
                    "__v": 0,
                    "createdDate": "202************",
                    "name": "BRL",
                    "symbol": "R$",
                    "type": "PIX",
                    "updatedDate": "202************"
                },
                "fee": {
                    "type": "PERCENTAGE",
                    "value": 1
                }
            }
        ],
        "blockchainNetworks": [
            {
                "blockchainNetwork": {
                    "_id": "672c145e1************",
                    "__v": 0,
                    "chainId": "1",
                    "createdDate": "202************",
                    "name": "Ethereum",
                    "updatedDate": "202************"
                },
                "fee": {
                    "type": "PERCENTAGE",
                    "value": 1
                }
            }
        ],
        "cryptocurrencies": [
            {
                "cryptocurrency": {
                    "_id": "67339b18ca************",
                    "__v": 0,
                    "coinGecko": "tether",
                    "createdDate": "202************",
                    "name": "USDT",
                    "symbol": "USDT",
                    "updatedDate": "202************"
                },
                "fee": {
                    "type": "PERCENTAGE",
                    "value": 1
                }
            }
        ]
    },
    "withdraw": {
        "currencies": [
            {
                "currency": {
                    "_id": "67339fc000************",
                    "__v": 0,
                    "createdDate": "202************",
                    "name": "BRL",
                    "symbol": "R$",
                    "type": "PIX",
                    "updatedDate": "202************"
                },
                "fee": {
                    "type": "PERCENTAGE",
                    "value": 1
                }
            }
        ],
        "blockchainNetworks": [
            {
                "blockchainNetwork": {
                    "_id": "6733a3a20************",
                    "__v": 0,
                    "chain": "BSC",
                    "chainId": "56",
                    "createdDate": "202************",
                    "name": "BEP-20",
                    "symbol": "BNB",
                    "updatedDate": "202************"
                },
                "fee": {
                    "type": "PERCENTAGE",
                    "value": 1
                }
            }
        ],
        "cryptocurrencies": [
            {
                "cryptocurrency": {
                    "_id": "6732388e6e5************",
                    "__v": 0,
                    "coinGecko": "tether",
                    "createdDate": "202************",
                    "name": "USDT",
                    "symbol": "USDT",
                    "updatedDate": "202************"
                },
                "fee": {
                    "type": "PERCENTAGE",
                    "value": 1
                }
            }
        ]
    }
}
```

---

## Responses

### Success (200 OK)

The subaccount was structured and the payment split rules were successfully applied.

```json
{
    "message": "Subconta cadastrada com sucesso"
}
```

### Common Errors

| Status  | Message                 | Probable Cause                                                                                               |
| :------ | :---------------------- | :----------------------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Invalid or expired token.<br /> • You do not have "Partner" access level to create subaccounts.            |
| **500** | `Internal Server Error` | Internal server error. Verify if the structures of the `currency` and `cryptocurrency` objects are exact.    |

---

## How to Use

### Common Use Cases

1. **White-label and Reselling:** You have your own system or gateway and want to resell XGate's infrastructure to third parties (your corporate clients), charging an automatic *markup* (extra fee) on their transacted volume.
2. **Business Segregation:** You have different business fronts (e.g., E-commerce A, E-commerce B) and want to separate the cash flow and customers of each one to avoid mixing receipts, but centralizing the profit in the holding (Main Account).

### How to Build the Fee Payload

The key to the correct operation and pricing of this endpoint is the `fee` object. For each currency and network you enable, you need to inject the billing rule. The system supports two fee types (`type`):

**1. Percentage Fee (`PERCENTAGE`)**
Charges a percentage over the total transaction value.

```json
"fee": {
    "type": "PERCENTAGE",
    "value": 1
}
```
*Example: If the subaccount processes a R$ 100.00 deposit, it will receive R$ 99.00 and your Main Account will receive R$ 1.00.*

**2. Fixed Fee (`FIXED`)**
Charges an exact and fixed amount, regardless of the transaction size.

```json
"fee": {
    "type": "FIXED",
    "value": 2.50
}
```
*Example: If the subaccount processes a R$ 100.00 or a R$ 10,000.00 deposit, your Main Account will always receive exactly R$ 2.50 for that transaction.*

---

## Integration

Below is a base example in Node.js showing how to structure and send this large data payload. In practice, you will fetch the lists of available currencies in the XGate endpoints and dynamically build these arrays before sending.

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    The example uses the `Axios` library.

    **Installing `Axios`:**
    ```bash
    npm install axios
    ```

    **Javascript Example:**
    ```javascript
    const axios = require("axios");

    (async () => {
        const emailMaster = "seu-email-master@domain.com";
        const passwordMaster = "••••••";

        try {
            const url_api = "https://api.xgateglobal.com";
            
            // 1. Get Main Account token
            const login = await axios.post(`${url_api}/auth/token`, { 
                email: emailMaster, 
                password: passwordMaster 
            });
            
            // 2. Build Subaccount payload (Summarized for example)
            const subAccountData = {
                user: {
                    name: "Minha Subconta Revenda",
                    email: "admin@subconta.com",
                    password: "SenhaForte123",
                    phone: { type: "mobile", number: "999999999", areaCode: "11", countryCode: "55" }
                },
                deposit: {
                    currencies: [
                        {
                            currency: { "_id": "6728f0a2cba3ac9ea3009993", "name": "BRL", "type": "PIX" },
                            fee: { "type": "PERCENTAGE", "value": 1 }
                        }
                    ],
                    blockchainNetworks: [],
                    cryptocurrencies: []
                },
                withdraw: {
                    currencies: [
                        {
                            currency: { "_id": "67339fc00076c0dd9822b874", "name": "BRL", "type": "PIX" },
                            // Example using FIXED fee on withdrawal
                            fee: { "type": "FIXED", "value": 1.5 }
                        }
                    ],
                    blockchainNetworks: [],
                    cryptocurrencies: []
                }
            };
            
            // 3. Create Subaccount
            const { data } = await axios.post(`${url_api}/company/subaccount`, subAccountData, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`,
                    "Content-Type": "application/json"
                }
            });
            
            console.log("Response:", data); 
            // Expected: { message: 'Subconta cadastrada com sucesso' }

        } catch (error) {
            console.error("Error creating subaccount:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
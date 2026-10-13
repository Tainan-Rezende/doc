---
sidebar_label: 'Crear subcuenta'
sidebar_position: 2
description: 'Este endpoint permite que un partner (cuenta principal) cree subcuentas vinculadas a su perfil.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import AICopyButton from '@site/src/components/AICopyButton';

# Crear subcuenta

<div className="ai-btn-wrapper">
<AICopyButton 
  promptText={`openapi: 3.0.3
info:
  title: API XGate - Criar Subconta (Split de Taxas)
  version: 1.0.0
  description: Endpoint para criação de Subcontas atreladas à Conta Principal, permitindo configuração de comissões (markup) para depósitos e saques.
servers:
  - url: https://api.xgateglobal.com
paths:
  /company/subaccount:
    post:
      summary: Criar Subconta
      description: Cria uma subconta independente (saldo, usuários) atrelada à conta principal e configura as taxas retidas (fee) em cada operação.
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - user
                - deposit
                - withdraw
              properties:
                user:
                  type: object
                  description: Dados da empresa e credenciais de primeiro acesso (name, email, password, phone).
                deposit:
                  type: object
                  description: Configuração de taxas para depósitos. Contém arrays de moedas e redes.
                  properties:
                    currencies:
                      type: array
                      description: Lista de moedas fiduciárias com suas respectivas taxas (fee).
                    blockchainNetworks:
                      type: array
                      description: Lista de redes blockchain com suas respectivas taxas (fee).
                    cryptocurrencies:
                      type: array
                      description: Lista de criptomoedas com suas respectivas taxas (fee).
                withdraw:
                  type: object
                  description: Configuração de taxas para saques. Possui a mesma estrutura de arrays que o objeto 'deposit'.
      responses:
        '200':
          description: Sucesso.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Subconta cadastrada com sucesso"
        '401':
          description: Unauthorized. Token inválido, expirado ou usuário não possui nível "Partner".
        '500':
          description: Internal Server Error. Geralmente causado por má formatação nos objetos aninhados do payload.
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

# INSTRUÇÕES PARA A IA:
# 1. Gere o código de integração para a linguagem solicitada.
# 2. ALERTA DE PAYLOAD COMPLEXO: Como o JSON é muito grande, monte a estrutura do payload de forma modular e limpa no código gerado.
# 3. Explique que os objetos 'deposit' e 'withdraw' possuem 3 arrays cada: 'currencies', 'blockchainNetworks' e 'cryptocurrencies'.
# 4. Enfatize que para CADA item nesses arrays, é OBRIGATÓRIO enviar o objeto da moeda/rede e um objeto 'fee' com 'type' ("PERCENTAGE" ou "FIXED") e 'value' (número).
# 5. DICA DE OURO: Instrua o desenvolvedor a enviar arrays vazios ([]) caso não queira configurar taxas para algum grupo específico.
# 6. Adicione o Token Bearer no header de Authorization.`} 
/>
</div>

Este endpoint permite que un partner (cuenta principal) cree **subcuentas** vinculadas a su perfil.

Una subcuenta funciona como una operación independiente: tiene su propio saldo, sus propios usuarios administrativos y sus propios clientes finales. Sin embargo, está relacionada con su cuenta principal a través de un sistema de **split de comisiones**.

Al crear la subcuenta, define un porcentaje de comisión (`fee`) para cada método de depósito y retiro. Cada vez que la subcuenta realice una transacción, ese porcentaje se descontará de ella y se enviará automáticamente al saldo de su cuenta principal.

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/company/subaccount
```

---

## Solicitud

### Encabezados obligatorios

| Encabezado | Valor | Descripción |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <tu_token>` | Token JWT de autenticación de su **cuenta principal**. |

### Cuerpo de la solicitud

El payload de creación es extenso, ya que debe enviar los datos de la nueva empresa y configurar todas las comisiones operativas de entrada (`deposit`) y salida (`withdraw`).

| Parámetro | Tipo | Validación | Descripción |
| :--- | :--- | :--- | :--- |
| `user` | `object` | Obligatorio | Datos de la empresa; `email` y `password` se utilizan para el primer acceso al sistema. |
| `deposit` | `object` | Obligatorio | Comisiones de depósito en `currency`, `cryptocurrency` y `blockchain`. |
| `withdraw` | `object` | Obligatorio | Comisiones de retiro en `currency`, `cryptocurrency` y `blockchain`. |

:::tip[Acceso al sistema]
Aunque la contraseña (`password`) se envía en la solicitud para el primer acceso, el administrador de la subcuenta podrá restablecerla más adelante a través del flujo de “Olvidé mi contraseña” o si la plataforma exige un restablecimiento por motivos de seguridad.
:::

#### Ejemplo de payload

En el ejemplo siguiente, la cuenta principal está configurando una comisión de **1% (`"value": 1`)** para las operaciones de la subcuenta.

```json
{
    "user": {
        "name": "First User",
        "email": "contact@subaccount.com",
        "password": "Password@123",
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
                    "_id": "69ea849098**************",
                    "chain": "Solana",
                    "name": "Solana",
                    "symbol": "SOL"
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

## Respuestas

### Éxito (200 OK)

La subcuenta se estructuró y las reglas de split de pagos se aplicaron correctamente.

```json
{
    "message": "Subcuenta registrada con éxito"
}
```

### Errores comunes

| Estado | Mensaje | Motivo probable |
| :--- | :--- | :--- |
| **401** | `Unauthorized` | • Token inválido o caducado.<br /> • No tiene nivel de acceso "Partner" para crear subcuentas. |
| **500** | `Internal Server Error` | Error interno del servidor. Verifique si las estructuras de los objetos `currency` y `cryptocurrency` son exactas. |

---

## Cómo usar

### Casos de uso comunes

1. **White-label y reventa:** Tiene su propio sistema o gateway y desea revender la infraestructura de XGate a terceros (sus clientes corporativos), cobrando un *markup* (comisión adicional) automático sobre el volumen transaccionado por ellos.
2. **Segregación de negocios:** Tiene diferentes frentes de negocio (por ejemplo, E-commerce A, E-commerce B) y desea separar el flujo de caja y los clientes de cada uno para no mezclar los ingresos, pero centralizando la utilidad en la holding (cuenta principal).

### Cómo construir el payload de comisiones

La clave para el correcto funcionamiento y precio de este endpoint es el objeto `fee`. Para cada moneda y red que habilite, debe inyectar la regla de cobro. El sistema admite dos tipos de comisiones (`type`):

**1. Comisión por porcentaje (`PERCENTAGE`)**
Carga un porcentaje sobre el valor total de la transacción.

```json
"fee": {
    "type": "PERCENTAGE",
    "value": 1
}
```
*Ejemplo: si la subcuenta procesa un depósito de R$ 100,00, recibirá R$ 99,00 y su cuenta principal recibirá R$ 1,00.*

**2. Comisión fija (`FIXED`)**
Carga un monto exacto y fijo, independientemente del tamaño de la transacción.

```json
"fee": {
    "type": "FIXED",
    "value": 2.50
}
```
*Ejemplo: si la subcuenta procesa un depósito de R$ 100,00 o de R$ 10.000,00, su cuenta principal siempre recibirá exactamente R$ 2,50 por esa transacción.*

---

## Integración

A continuación se muestra un ejemplo base en Node.js sobre cómo estructurar y enviar este gran payload de datos. En la práctica, obtendrá las listas de monedas disponibles en los endpoints de XGate y construirá estos arrays dinámicamente antes de enviarlos.

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    El ejemplo utiliza la biblioteca `Axios`.

    **Instalando `Axios`:**
    ```bash
    npm install axios
    ```

    **Ejemplo en JavaScript:**
    ```javascript
    const axios = require("axios");

    (async () => {
        const emailMaster = "seu-email-master@domain.com";
        const passwordMaster = "••••••";

        try {
            const url_api = "https://api.xgateglobal.com";
            
            // 1. Obtener el token de la cuenta principal
            const login = await axios.post(`${url_api}/auth/token`, { 
                email: emailMaster, 
                password: passwordMaster 
            });
            
            // 2. Montar el payload de la subcuenta (resumido para el ejemplo)
            const subAccountData = {
                user: {
                    name: "Admin",
                    email: "admin@subaccount.com",
                    password: "Strong,Pass@123}{",
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
                            // Ejemplo usando comisión fija en el retiro
                            fee: { "type": "FIXED", "value": 1.5 }
                        }
                    ],
                    blockchainNetworks: [],
                    cryptocurrencies: []
                }
            };
            
            // 3. Crear la subcuenta
            const { data } = await axios.post(`${url_api}/company/subaccount`, subAccountData, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`,
                    "Content-Type": "application/json"
                }
            });
            
            console.log("Respuesta:", data); 
            // Esperado: { message: 'Subcuenta registrada con éxito' }

        } catch (error) {
            console.error("Error al crear subcuenta:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
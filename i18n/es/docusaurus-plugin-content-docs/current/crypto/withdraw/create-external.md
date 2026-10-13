---
sidebar_label: 'Retiro a billetera externa'
sidebar_position: 4
description: 'Este endpoint permite al cliente retirar criptomonedas a una billetera externa.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import WithdrawCryptoToWalletTester from '@site/src/components/WithdrawCryptoToWalletTester';
import AICopyButton from '@site/src/components/AICopyButton';
import CryptoDeprecationNotice from '@site/src/components/CryptoDeprecationNotice';

# Crear solicitud de retiro externo

<CryptoDeprecationNotice />

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Criar Saque para Carteira Externa (Crypto)
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /withdraw:
    post:
      summary: Solicitar Saque Crypto para Carteira Externa
      description: Cria uma ordem de saque de criptomoedas (ex USDT) transferindo os fundos para uma carteira externa do cliente através de uma rede blockchain específica.
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - amount
                - customerId
                - cryptocurrency
                - blockchainNetwork
                - wallet
              properties:
                amount:
                  type: number
                  description: O valor do saque na criptomoeda escolhida (ex 0.1).
                customerId:
                  type: string
                  description: O ID único (_id) do cliente que fará o saque.
                wallet:
                  type: string
                  description: Endereço público da carteira externa de destino.
                externalId:
                  type: string
                  description: Identificador de idempotência para controle interno (recomendado).
                cryptocurrency:
                  type: object
                  description: Objeto com os dados da criptomoeda de transação (ex USDT).
                  required:
                    - _id
                    - name
                    - symbol
                  properties:
                    _id:
                      type: string
                    name:
                      type: string
                    symbol:
                      type: string
                    coinGecko:
                      type: string
                blockchainNetwork:
                  type: object
                  description: Objeto com os dados da rede blockchain de transferência (ex TRC-20, ERC-20).
                  required:
                    - _id
                    - name
                    - chainId
                    - chain
                    - symbol
                  properties:
                    _id:
                      type: string
                    name:
                      type: string
                    chainId:
                      type: string
                    chain:
                      type: string
                    symbol:
                      type: string
      responses:
        '201':
          description: Sucesso. Retorna o status PENDING e o ID da transação.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Solicitação de Saque realizada com sucesso
                  status:
                    type: string
                    example: PENDING
                  _id:
                    type: string
        '401':
          description: Unauthorized. Token inválido, expirado ou ausente.
        '404':
          description: Not Found. O customerId fornecido não existe.
        '500':
          description: Internal Server Error.
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT`}
    />
</div>

Este endpoint permite al cliente retirar criptomonedas a una billetera externa.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/withdraw
```

---

## Prueba de integración

Utilice el formulario a continuación para simular la creación de una solicitud de retiro de criptomonedas a una billetera externa.

<WithdrawCryptoToWalletTester />

---

## Solicitud

Debe enviar el **encabezado de autenticación** y el **cuerpo** con los datos de la orden.

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Cuerpo (Request Body)

| Campo               | Tipo     | Requerido | Descripción                                                      |
| :------------------ | :------- | :-------: | :--------------------------------------------------------------- |
| `amount`            | `number` |  **Sí**   | El monto del retiro en USDT (por ejemplo, `0.1` mínimo).         |
| `customerId`        | `string` |  **Sí**   | El ID único (`_id`) del cliente que realizará el retiro.         |
| `cryptocurrency`    | `object` |  **Sí**   | La criptomoneda de la transacción (por ejemplo, `USDT`, `USDC`). |
| `blockchainNetwork` | `object` |  **Sí**   | Información sobre la red blockchain.                             |
| `wallet`            | `string` |  **Sí**   | La billetera a la que se enviarán los valores.                   |
| `externalId`        | `string` |  **No**   | Idempotencia.                                                    |

---

## Respuestas

### Éxito (201 Created)

Devuelve el objeto de la orden creada, que contiene información sobre el `status` y el `_id` de la transacción.

```json
{
  "message": "Solicitação de Saque realizada com sucesso",
  "status": "PENDING",
  "_id": "69849e8c50****************"
}
```

### Errores comunes

| Estado  | Mensaje                 | Posible causa                                                                               |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado inválido o faltante.<br />• IP no permitida. |
| **404** | `Not Found`             | El cliente indicado en el campo `customerId` no existe.                                     |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                           |

---

## Cómo usar

El propósito de este endpoint es iniciar el flujo de salida de dinero con conversión de criptomonedas a BRL (**Cash-out**).

### Flujo de integración

1.  **Identificar al cliente:** Asegúrese de que el usuario exista en XGate (<a href={useBaseUrl('/docs/customer/create')} target="_blank">POST /customer</a>) y tenga su `_id`.
2.  **Datos de la criptomoneda:** Deberá obtener los datos de la criptomoneda para agregar a la solicitud. Puede obtenerlos en <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">Criptomonedas</a>.
3.  **Datos de la red:** Deberá obtener los datos de la red; puede obtenerlos en <a href={useBaseUrl('/docs/crypto/withdraw/network')} target="_blank">Redes blockchain</a>.
4.  **Destino:** Agregue la clave pública de la billetera que recibirá el retiro en la billetera externa.
5.  **Enviar la solicitud:** Envíe la solicitud a XGate. El tiempo de aprobación puede variar según la red.

### Ejemplo práctico

Para crear solicitudes de retiro a billeteras externas, debe seguir estos 4 pasos:

:::tip[Recomendación]
Es necesario crear un cliente antes de continuar con la creación del retiro.

Puede **<a href={useBaseUrl('/docs/customer/create')} target="_blank">hacer clic aquí</a>** para ir a la página de documentación de creación de clientes.
:::
>
**Paso 1:** Ingrese el monto en USDT en `amount` y el `_id` del cliente como `customerId`, igual que en los campos resaltados:
```json {2-3}
{
    "amount": 2,
    "customerId": "672f40**************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT"
    },
    "blockchainNetwork": {
        "_id": "69ea849098**************",
        "chain": "Solana",
        "name": "Solana",
        "symbol": "SOL"
    },
    "wallet": "0x7A00e4a***************",
    "externalId": "6dd37763a2***************"
}
```

**Paso 2:** Debe obtener la criptomoneda con los datos para el retiro.

Puede obtener la lista de ellas <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">haciendo clic aquí</a>.

```json {4-8}
{
    "amount": 2,
    "customerId": "672f40**************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT"
    },
    "blockchainNetwork": {
        "_id": "69ea849098**************",
        "chain": "Solana",
        "name": "Solana",
        "symbol": "SOL"
    },
    "wallet": "0x7A00e4a***************",
    "externalId": "6dd37763a2***************"
}
```

:::tip[Criptomoneda]
Los datos de `cryptocurrency` también pueden obtenerse de la respuesta de la lista de redes blockchain. El ejemplo de integración en **Node.js** muestra cómo funciona.
:::

#### Detalles del objeto

Consulte los detalles de cada información en el objeto `cryptocurrency` para construir su solicitud.

| Campo         | Tipo     | Requerido | Descripción                                                            |
| :------------ | :------- | :-------: | :--------------------------------------------------------------------- |
| `_id`         | `string` |  **Sí**   | Identificador único de la criptomoneda.                                |
| `name`        | `string` |  **Sí**   | Nombre de la criptomoneda.                                             |
| `symbol`      | `string` |  **Sí**   | Símbolo de la criptomoneda.                                            |
| `coinGecko`   | `string` |  **No**   | Identificador de la criptomoneda en CoinGecko.                         |
| `updatedDate` | `string` |  **No**   | Fecha de la última actualización de la información de la criptomoneda. |
| `createdDate` | `string` |  **No**   | Fecha en que la criptomoneda se creó en el sistema.                    |
| `__v`         | `number` |  **No**   | Versión del registro de la criptomoneda en la base de datos.           |

**Paso 3:** Debe obtener los datos de la red blockchain.

Puede obtener la lista de ellas <a href={useBaseUrl('/docs/crypto/withdraw/network')} target="_blank">haciendo clic aquí</a>.

```json {9-14}
{
    "amount": 2,
    "customerId": "672f40**************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT"
    },
    "blockchainNetwork": {
        "_id": "69ea849098**************",
        "chain": "Solana",
        "name": "Solana",
        "symbol": "SOL"
    },
    "wallet": "0x7A00e4a***************",
    "externalId": "6dd37763a2***************"
}
```

:::warning[Recomendación]
Si su integración utiliza una red fija para todas las operaciones de retiro, recomendamos enviar los valores requeridos mediante **hard-code**. Esto optimiza el rendimiento de su aplicación y evita llamadas repetitivas al endpoint de listado de redes, que tiene un alto volumen de datos.
:::

#### Detalles del objeto

Consulte los detalles de cada información en el objeto `blockchainNetwork` para construir su solicitud.

| Campo              | Tipo     | Requerido | Descripción                                                        |
| :----------------- | :------- | :-------: | :----------------------------------------------------------------- |
| `_id`              | `string` |  **Sí**   | Identificador único de la red blockchain en el sistema.            |
| `name`             | `string` |  **Sí**   | Nombre técnico del estándar de red (por ejemplo, TRC-20, ERC-20).  |
| `chainId`          | `string` |  **Sí**   | ID numérico de la red (por ejemplo, 56 para BSC, 1 para Ethereum). |
| `cryptocurrencies` | `array`  |  **No**   | Lista de IDs de criptomonedas compatibles con esta red.            |
| `updatedDate`      | `string` |  **No**   | Fecha de la última actualización de los parámetros de la red.      |
| `createdDate`      | `string` |  **No**   | Fecha de creación del registro de la red en el sistema.            |
| `__v`              | `number` |  **No**   | Versión interna del registro en la base de datos.                  |
| `chain`            | `string` |  **Sí**   | Nombre simplificado de la blockchain (por ejemplo, BSC, ETH).      |
| `symbol`           | `string` |  **Sí**   | Símbolo de la moneda nativa de la red (por ejemplo, BNB, ETH).     |

**Paso 4:** Debe obtener la clave pública de la billetera donde se enviarán los valores del retiro.

```json {15}
{
    "amount": 2,
    "customerId": "672f40**************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT"
    },
    "blockchainNetwork": {
        "_id": "69ea849098**************",
        "chain": "Solana",
        "name": "Solana",
        "symbol": "SOL"
    },
    "wallet": "0x7A00e4a***************",
    "externalId": "6dd37763a2***************"
}
```

**Paso 5 (Opcional):** Agregue `externalId` al final del código. Esto evitará que el cliente envíe la solicitud de retiro más de una vez, **evitando duplicados**.
```json {16}
{
    "amount": 2,
    "customerId": "672f40**************",
    "cryptocurrency": {
        "_id": "67c0dd903***************",
        "name": "USDT",
        "symbol": "USDT"
    },
    "blockchainNetwork": {
        "_id": "69ea849098**************",
        "chain": "Solana",
        "name": "Solana",
        "symbol": "SOL"
    },
    "wallet": "0x7A00e4a***************",
    "externalId": "6dd37763a2***************"
}
```

---

## Integración

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    Este ejemplo de integración utiliza la librería <code>Axios</code> en Node.js.

    **Instalando `Axios`:**
    ```bash
    npm install axios
    ```

    **Ejemplo en JavaScript:**
```js
const axios = require("axios");

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";
    const amount = 10.90;
    const wallet = "0x*****************";
    const customerId = "**************";

    try {
        const url_api = "https://api.xgateglobal.com"
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const blockchains = await axios.get(`${url_api}//withdraw/company/blockchain-networks`, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        const { data } = await axios.post(`${url_api}/withdraw`, {
            amount,
            wallet,
            customerId,
            cryptocurrency: blockchains.data[0].cryptocurrencies[1].cryptocurrency, // USDT
            blockchainNetwork: blockchains.data[0],
        }, {
            headers: {
                "Authorization": `Bearer ${login.data.token}`
            }
        });
        console.log(data); // Respuesta
    } catch (error) {
        console.log(error.response.data.message) // Error
    }
})()
```
  </TabItem>
</Tabs>
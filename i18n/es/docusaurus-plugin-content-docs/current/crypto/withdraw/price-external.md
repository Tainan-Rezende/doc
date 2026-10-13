---
sidebar_label: 'Cotización para billetera'
sidebar_position: 6
description: 'Este endpoint le permite calcular con anticipación cuánto recibirá el cliente en criptomonedas al crear una solicitud de retiro a una billetera externa, descontando ya las comisiones de gas de la red blockchain.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetTetherToExternalTester from '@site/src/components/GetTetherToExternalTester';
import AICopyButton from '@site/src/components/AICopyButton';

# Cotización para billetera externa

<div className="ai-btn-wrapper">
  <AICopyButton 
      promptText={`openapi: 3.0.3
info:
  title: API XGate - Cotação para Carteira Externa
  version: 1.0.0
servers:
  - url: https://api.xgateglobal.com
    description: Servidor de Produção XGate
paths:
  /withdraw/transaction/crypto/amount:
    post:
      summary: Cotação para Saque em Carteira Externa
      description: Calcula o valor líquido que o cliente receberá em sua carteira externa, descontando antecipadamente as taxas de gás (network fees) da rede blockchain selecionada. Rota apenas de consulta (não gera pedido de saque).
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
                - cryptocurrency
                - blockchainNetwork
              properties:
                amount:
                  type: number
                  description: Valor bruto do saque em criptomoeda (ex 10).
                cryptocurrency:
                  type: object
                  description: Objeto completo com os dados da criptomoeda de origem (ex USDT).
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
                  description: Objeto completo com os dados da rede blockchain pela qual a transferência ocorrerá.
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
        '200':
          description: Sucesso. Retorna o valor líquido aproximado a ser recebido na carteira externa.
          content:
            application/json:
              schema:
                type: object
                properties:
                  amount:
                    type: number
                    description: Valor líquido calculado na mesma criptomoeda.
        '401':
          description: Unauthorized. Token JWT inválido, expirado ou ausente.
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

Este endpoint le permite calcular con anticipación cuánto recibirá el cliente en criptomonedas al crear una solicitud de retiro a una billetera externa, descontando ya las comisiones de gas de la red blockchain.

---
## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/withdraw/transaction/crypto/amount
```

---

## Prueba de integración

Utilice el formulario a continuación para simular un retiro a una billetera externa. El sistema obtendrá automáticamente los datos necesarios y calculará cuánto recibiría en criptomonedas.

<GetTetherToExternalTester />

---

## Solicitud

Debe enviar el **encabezado de autenticación** y el cuerpo JSON con el valor y el objeto de moneda.

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Cuerpo (Request Body)

| Campo               | Tipo     | Requerido | Descripción                                                                            |
| :------------------ | :------- | :-------: | :------------------------------------------------------------------------------------- |
| `amount`            | `number` |  **Sí**   | Monto en criptomonedas para el que desea calcular el retiro.                           |
| `cryptocurrency`    | `object` |  **Sí**   | El objeto de la criptomoneda, obtenido desde la ruta de listado de criptomonedas.      |
| `blockchainNetwork` | `object` |  **Sí**   | El objeto de la red blockchain, obtenido desde la ruta de listado de redes blockchain. |

---

## Respuestas

### Éxito (200 OK)

Devuelve el valor que aproximadamente se recibirá en la billetera externa.

```json
{
  "amount": 99.521567,
  "cryptocurrency": "USDC"
}
```

### Errores comunes

| Estado  | Mensaje                 | Posible causa                                                                               |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado inválido o faltante.<br />• IP no permitida. |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                           |

---

## Cómo usar

:::info[Solo Consulta]
Esta ruta **no genera** un pedido de retiro ni mueve fondos. Sirve **estrictamente para consulta** de cotizaciones y estimación de tarifas de la red.
:::

### El Flujo Recomendado (UX)

Para ofrecer la mejor experiencia a tus clientes, recomendamos el siguiente flujo de integración:

1. **Entrada del Usuario:** El cliente ingresa el monto que desea retirar (ej.: `10`) en tu aplicación o sitio web.
2. **Consulta de Cotización:** En segundo plano, tu sistema llama al endpoint `POST /withdraw/transaction/crypto/amount` enviando el valor de `10`, junto con los objetos de la **red** y de la **criptomoneda** seleccionadas.
3. **Visualización del Monto Neto:** La API calcula los costos de la blockchain y devuelve el monto exacto que llegará a la billetera de destino (ej.: `9.369984879637112 USDT`). Muestras en la pantalla algo como: *"Recibirás aproximadamente 9.36 USDT"*.
4. **Acción / Confirmación:** Si el usuario está de acuerdo con las tarifas y el monto neto, tu sistema entonces llama a la ruta definitiva de **Crear Pedido de Retiro** (`POST /withdraw`) para efectuar la transacción.

### Ejemplo práctico

Siga los pasos a continuación para realizar una cotización para billetera externa.

**Paso 1:** Ingrese la cantidad en USDT para la cotización:
```json {2}
{
    "amount": 100,
    "blockchainNetwork": {
        "_id": "69ea849098**************",
        "chain": "Solana",
        "name": "Solana",
    },
    "cryptocurrency": {
        "_id": "6733a2a9007**************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether"
    }
}
```

**Paso 2:** Debe obtener e inyectar el objeto de la red blockchain dentro de `blockchainNetwork`:

```json {3-7}
{
    "amount": 100,
    "blockchainNetwork": {
        "_id": "69ea849098**************",
        "chain": "Solana",
        "name": "Solana",
    },
    "cryptocurrency": {
        "_id": "6733a2a9007**************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether"
    }
}
```
Puede obtener la lista de redes blockchain <a href={useBaseUrl('/docs/crypto/withdraw/network')} target="_blank">haciendo clic aquí</a>.

**Paso 3:** Debe obtener e inyectar el objeto de la criptomoneda dentro de `cryptocurrency`:

```json {8-13}
{
    "amount": 100,
    "blockchainNetwork": {
        "_id": "69ea849098**************",
        "chain": "Solana",
        "name": "Solana",
    },
    "cryptocurrency": {
        "_id": "6733a2a9007**************",
        "name": "USDT",
        "symbol": "USDT",
        "coinGecko": "tether"
    }
}
```
Puede obtener la lista de criptomonedas <a href={useBaseUrl('/docs/crypto/withdraw/cryptocurrency')} target="_blank">haciendo clic aquí</a>.

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
  const email = "email@domain.com";
  const password = "••••••";
  const amount = 10;

  try {
    const url_api = "https://api.xgateglobal.com"
            
    // 1. Login
    const login = await axios.post(`${url_api}/auth/token`, { email, password });
    const config = {
      headers: { "Authorization": `Bearer ${login.data.token}` }
    };

    // 2. Fetch Networks and Cryptocurrencies
    const blockchains = await axios.get(`${url_api}/withdraw/company/blockchain-networks`, config);
            
    // Selects the first available network
    const selectedNetwork = blockchains.data[0];

    // Searches specifically for the USDT object within the network's crypto list
    const usdtObject = selectedNetwork.cryptocurrencies.find(
      item => item.cryptocurrency.symbol === 'USDT'
    );

    if (!usdtObject) {
      throw new Error(`USDT not found in ${selectedNetwork.name} network`);
    }

    // 3. Calculate Quote
    const { data } = await axios.post(`${url_api}/withdraw/transaction/crypto/amount`, {
      amount,
      cryptocurrency: usdtObject.cryptocurrency,
      blockchainNetwork: selectedNetwork
    }, config);

    console.log("Quote Received:", data); 
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
  }
})()
```
  </TabItem>
</Tabs>
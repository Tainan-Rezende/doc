---
sidebar_label: 'Obtener cartera crypto'
sidebar_position: 1
description: 'Este endpoint devuelve las carteras de criptomonedas asociadas a un cliente específico.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetCryptoWalletTester from '@site/src/components/GetCryptoWalletTester';
import AICopyButton from '@site/src/components/AICopyButton';
import CryptoDeprecationNotice from '@site/src/components/CryptoDeprecationNotice';

# Obtener cartera crypto

<CryptoDeprecationNotice />

<div className="ai-btn-wrapper">
  <AICopyButton 
    promptText={`openapi: 3.0.3
  info:
    title: API XGate - Buscar Carteiras Crypto
    version: 1.0.0
  servers:
    - url: https://api.xgateglobal.com
      description: Servidor de Produção XGate
  paths:
    /crypto/customer/{clientId}/wallet:
      get:
        summary: Buscar Carteiras Crypto do Cliente
        description: >
          Retorna as carteiras de criptomoedas associadas a um cliente específico.
          
          ⚠️ ATENÇÃO (COMPORTAMENTO ASSÍNCRONO): Este endpoint inicia a geração de carteiras na blockchain em segundo plano na primeira chamada.
          Se a blockchain ainda estiver gerando os endereços, a API responderá com um objeto contendo uma mensagem de provisionamento.
          Você (LLM/Gerador de Código) DEVE obrigatoriamente implementar uma lógica de retry (polling) com async/await: se o JSON de retorno contiver a propriedade 'message' indicando que está provisionando, aguarde de 1 a 2 segundos e realize uma nova tentativa (limite de 3 a 5 tentativas).
        security:
          - bearerAuth: []
        parameters:
          - in: path
            name: clientId
            required: true
            schema:
              type: string
            description: O ID único (_id) do cliente.
        responses:
          '200':
            description: Sucesso. Retorna as carteiras criadas ou uma mensagem de provisionamento em andamento.
            content:
              application/json:
                schema:
                  oneOf:
                    - type: array
                      description: Array com os dados das carteiras geradas com sucesso.
                      items:
                        type: object
                        properties:
                          publicKey:
                            type: string
                            description: Endereço público da carteira gerada para o cliente.
                          blockchainNetworks:
                            type: array
                            items:
                              type: string
                            description: Lista de redes blockchain aceitas nesse endereço (ex Ethereum, Solana, Polygon).
                          assets:
                            type: array
                            items:
                              type: string
                            description: Lista de ativos aceitos nesse endereço (ex USDT, USDC).
                    - type: object
                      description: Retorno temporário enquanto a blockchain realiza o provisionamento dos endereços.
                      properties:
                        message:
                          type: string
                          example: "Wait a few seconds, we are provisioning your wallet addresses"
          '401':
            description: Unauthorized. Token JWT inválido, expirado ou não informado.
          '404':
            description: Not Found. Cliente não encontrado.
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

Este endpoint devuelve las carteras de criptomonedas asociadas a un cliente específico.

Utilice esta ruta para obtener las claves públicas de depósito (publicKey) y verificar qué redes (blockchainNetworks) (por ejemplo, Polygon, Solana) y activos (assets) (por ejemplo, USDT, USDC) están disponibles para cada dirección.

---
## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL del endpoint"
https://api.xgateglobal.com/crypto/customer/CLIENT_ID/wallet
```

:::warning[Importante]
El campo `CLIENT_ID` hace referencia al ID del cliente. Si aún no lo ha creado, puede hacerlo desde la <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>página de crear clientes</a>.
:::

---

:::info[Comportamiento asíncrono (recomendación de reintento)]
Cuando solicite por primera vez las carteras de un cliente, la blockchain iniciará la generación de direcciones en segundo plano.

Durante estos segundos de creación, la API responderá con el mensaje:
`"Wait a few seconds, we are provisioning your wallet addresses"`.

**Recomendación técnica:** Asegúrese de que su aplicación utilice una lógica de **async/await con reintentos (polling)**. Configure su código para repetir la solicitud de 3 a 5 veces, con un intervalo de 1 a 5 segundos entre intentos, hasta que se devuelva el array con la `publicKey` definitiva.
*Puede encontrar un ejemplo práctico de esta implementación al final de esta página.*
:::

---

## Prueba de integración

Utilice el formulario a continuación para listar las carteras de un cliente.

<GetCryptoWalletTester />

---

## Solicitud

Debe enviar el **encabezado de autenticación** y pasar el **ID del cliente** en la URL.

#### Encabezados obligatorios

| Encabezado      | Valor               | Descripción                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `Authorization` | `Bearer <tu_token>` | El token JWT obtenido al iniciar sesión. |

#### Parámetros de URL

| Parámetro   | Tipo     | Obligatorio | Descripción                               |
| :---------- | :------- | :---------: | :---------------------------------------- |
| `CLIENT_ID` | `string` |   **Sí**    | El `_id` del cliente que desea consultar. |

---

## Respuestas

### Éxito (200 OK)

Devuelve un array con las carteras generadas, las criptomonedas aceptadas y la red que debe utilizarse para recibir depósitos.

```json
[
  {
    "publicKey": "0xda4e37a068a2fed2c******************",
    "blockchainNetworks": [
      "Polygon",
      "Ethereum"
    ],
    "assets": [
      "USDC",
      "USDT"
    ]
  },
  {
    "publicKey": "EGJCs2ZDNFksfZH******************",
    "blockchainNetworks": [
      "Solana"
    ],
    "assets": [
      "USDT",
      "USDC"
    ]
  },
  {
    "publicKey": "TNWraJD8jp3TK******************",
    "blockchainNetworks": [
      "Tron"
    ],
    "assets": [
      "USDT"
    ]
  }
]
```

:::warning[Importante]
Los depósitos de origen cripto no aparecen en la pestaña de depósitos del Dashboard hasta que se completan (Paid).
:::

:::danger[Riesgo de pérdida de fondos y fraude]
1. **USDT o USDC:** XGate solo procesa depósitos de **Tether (USDT)** y **USD Coin (USDC)**. Enviar cualquier otra criptomoneda (como Bitcoin, Ethereum nativo, TRX, etc.) provocará la **pérdida irreversible** de los fondos.
2. **Red correcta:** El depósito debe realizarse estrictamente a través de una de las redes enumeradas en nuestra API (por ejemplo, `ERC-20`, `Solana` o `Polygon`). Enviar fondos a través de redes no admitidas provocará la pérdida total de los fondos.
3. **Alerta de fraude ("Flash Tokens"):** Tenga cuidado con los estafadores que envían tokens falsos imitando a los originales (conocidos como "Flash USDT" o "Flash USDC"). Estas monedas falsas aparecen en la cartera pero no tienen valor real y no se pueden transaccionar. Siempre valide mediante el contrato inteligente que el token depositado sea el token oficial de Tether o Circle antes de liberar el saldo a su cliente final.
:::

### Errores comunes

| Estado  | Mensaje                 | Posible causa                                                                                |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido o vencido.<br /> • Encabezado inválido o faltante.<br /> • IP no permitida. |
| **404** | `Not Found`             | Cliente no encontrado.                                                                       |
| **500** | `Internal Server Error` | Error interno del servidor. Contacte con soporte.                                            |

---

## Cómo usar

La información entregada por esta ruta incluye la **dirección (publicKey)**, las **redes admitidas (blockchainNetworks)** y los **activos aceptados (assets)**. Se utilizarán siempre que usted o su cliente final quieran hacer un depósito de criptomonedas.

Cada objeto del array representa un formato de dirección específico que puede admitir una o más redes y uno o más activos simultáneamente:

| Dirección (`publicKey`) | Redes (`blockchainNetworks`) | Activos disponibles (`assets`) |
| :---------------------- | :--------------------------- | :----------------------------- |
| Formato EVM (`0x...`)   | `Polygon`, `Ethereum`        | `USDT`, `USDC`                 |
| Formato Solana          | `Solana`                     | `USDT`, `USDC`                 |
| Formato Tron (`T...`)   | `Tron`                       | `USDT`                         |

El flujo del usuario final debe estructurarse de la siguiente manera:
1. **Selección de activo:** El usuario elige si desea depositar **USDT** o **USDC**.
2. **Selección de red:** El sistema muestra las redes aceptadas (`blockchainNetworks`) según el activo elegido.
3. **Visualización de la dirección:** El sistema muestra la clave pública (`publicKey`) correspondiente a la combinación seleccionada.
4. **Transferencia de fondos:** El usuario va a su exchange o cartera externa y envía el activo elegido, utilizando estrictamente una de las redes listadas, a la dirección proporcionada.

### ⚠️ Reglas críticas de depósito

Para garantizar la seguridad de los fondos, el desarrollador debe mostrar advertencias claras en el frontend para el usuario final:

:::danger[Riesgo de pérdida de fondos y fraude]
1. **USDT o USDC:** XGate solo procesa depósitos de **Tether (USDT)** y **USD Coin (USDC)**. Enviar cualquier otra criptomoneda (como Bitcoin, Ethereum nativo, TRX, etc.) provocará la **pérdida irreversible** de los fondos.
2. **Red correcta:** El depósito debe realizarse estrictamente a través de una de las redes enumeradas en nuestra API (por ejemplo, `ERC-20`, `Solana` o `Polygon`). Enviar fondos a través de redes no admitidas provocará la pérdida total de los fondos.
3. **Alerta de fraude ("Flash Tokens"):** Tenga cuidado con los estafadores que envían tokens falsos imitando a los originales (conocidos como "Flash USDT" o "Flash USDC"). Estas monedas falsas aparecen en la cartera pero no tienen valor real y no se pueden transaccionar. Siempre valide mediante el contrato inteligente que el token depositado sea el token oficial de Tether o Circle antes de liberar el saldo a su cliente final.
:::

### Ejemplo de aplicación (UX)

Al integrar esta ruta, recomendamos que su interfaz muestre la información de forma clara y vinculada a la dirección generada específica. Por ejemplo:

> 💰 **Activos aceptados:** USDT o USDC
>
> 🌐 **Redes admitidas (para esta dirección):** Ethereum (ERC-20), Polygon
>
> 📍 **Dirección de depósito:**
> `0xda4e37a068a2fed2c******************` 📋 (botón de copia)
>
> ⚠️ *Advertencia: Envíe solo los activos listados utilizando las redes indicadas. Enviar otras monedas o usar redes incorrectas provocará la pérdida irreversible de los fondos.*

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

    // Función auxiliar para esperar (en milisegundos)
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    (async () => {
      const email = "your_email@domain.com";
      const password = "**********";
      const customerId = "************";
      const url_api = "https://api.xgateglobal.com";

      try {
        // 1. Autenticarse con la API
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const token = login.data.token;

        // 2. Función recursiva con reintentos para obtener o generar la cartera
        async function getWalletWithRetry(count = 0) {
          const { data } = await axios.get(`${url_api}/crypto/customer/${customerId}/wallet`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          // Si la API devuelve el mensaje de provisionamiento, espere 2 segundos y vuelva a intentarlo (máximo 3 intentos)
          if (
            data?.message === "Wait a few seconds, we are provisioning your wallet addresses" &&
            count < 3
          ) {
            console.log(`La cartera se está creando. Intento ${count + 1} de 3... Esperando 2 segundos.`);
            await sleep(2000);
            return getWalletWithRetry(count + 1);
          }

          return data;
        }

        console.log("Iniciando la obtención de la cartera...");
        const wallet = await getWalletWithRetry();
        console.log("Resultado final de la cartera:", wallet);

      } catch (error) {
        console.log("Error de ejecución:", error.response?.data?.message || error.message);
      }
    })();
    ```
  </TabItem>
</Tabs>
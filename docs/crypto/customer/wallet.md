---
sidebar_label: 'Buscar Carteira'
sidebar_position: 1
description: 'Este endpoint retorna as carteiras de criptomoedas associadas a um cliente específico.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GetCryptoWalletTester from '@site/src/components/GetCryptoWalletTester';
import AICopyButton from '@site/src/components/AICopyButton';
import CryptoDeprecationNotice from '@site/src/components/CryptoDeprecationNotice';

# Buscar Carteira Crypto

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

Este endpoint retorna as carteiras de criptomoedas associadas a um cliente específico.

Utilize esta rota para obter as chaves públicas de depósito (publicKey) e verificar quais redes (blockchainNetworks) (ex: Polygon, Solana) e ativos (assets) (ex: USDT, USDC) estão disponíveis para cada endereço.

---
## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/crypto/customer/CLIENT_ID/wallet
```

:::warning[Importante]
O campo `CLIENT_ID` se refere ao ID do cliente, se ainda não criou, você pode cria-lo a partir da página de <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>criar clientes</a>.
:::

---

:::info[Comportamento Assíncrono (Recomendação de Retry)]
Ao solicitar as carteiras de um cliente pela primeira vez, a blockchain iniciará a geração dos endereços em segundo plano. 

Durante esses segundos de criação, a API responderá com a mensagem: 
`"Wait a few seconds, we are provisioning your wallet addresses"`.

**Recomendação Técnica:** Certifique-se de que sua aplicação utiliza uma lógica de **async/await com retry (polling)**. Configure o seu código para repetir a requisição de 3 a 5 vezes, com um intervalo de 1 a 5 segundos entre as tentativas, até que o array com a `publicKey` definitiva seja retornado. *Você encontra um exemplo prático dessa implementação no final desta página.*
:::

---

## Testar Integração

Utilize o formulário abaixo para listar as carteiras de um cliente.

<GetCryptoWalletTester />

---

## Requisição

É necessário enviar o **Header** de autenticação e passar o **ID do Cliente** na URL.

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

#### Parâmetros de URL

| Parâmetro   | Tipo     | Obrigatório | Descrição                                     |
| :---------- | :------- | :---------: | :-------------------------------------------- |
| `CLIENT_ID` | `string` |   **Sim**   | O `_id` do cliente que você deseja consultar. |

---

## Respostas (Responses)

### Sucesso (200 OK)

Retorna um array com as carteiras geradas, as criptomoedas aceitas e a rede que deve ser utilizada para receber depósitos.

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
Depósitos de origem crypto não aparecem na aba depósitos da Dashboard até que sejam concluídas (Pagas).
:::

:::danger[Risco de Perda de Fundos e Fraudes]
1. **USDT ou USDC:** A XGate processa exclusivamente depósitos em **Tether (USDT)** e **USD Coin (USDC)**. O envio de outras criptomoedas (como Bitcoin, Ethereum nativo, TRX, etc.) resultará na **perda irreversível** do valor.
2. **Rede Correta:** O depósito deve ser feito obrigatoriamente através de uma das redes listadas na nossa API (ex: `ERC-20`, `Solana` ou `Polygon`). O envio por redes não suportadas causará a perda total dos fundos.
3. **Alerta de Fraude ("Flash Tokens"):** Cuidado com golpistas que enviam tokens falsos imitando os originais (conhecidos como "Flash USDT" ou "Flash USDC"). Essas moedas falsas aparecem na carteira, mas não têm valor real e não podem ser transacionadas. Sempre valide pelo contrato inteligente (*smart contract*) se o token depositado é o oficial da Tether ou da Circle antes de liberar o saldo para o seu cliente final.
:::

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                   |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------ |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • IP não permitido. |
| **404** | `Not Found`             | Cliente não encontrado.                                                                           |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com suporte.                                          |

---

## Como usar

As informações entregues nesta rota são o **Endereço (publicKey)**, as **Redes Suportadas (blockchainNetworks)** e os **Ativos Aceitos (assets)**. Elas serão utilizadas sempre que você ou seu cliente final desejar realizar um depósito em criptomoedas.

Cada objeto do array representa um formato de endereço específico que pode suportar uma ou mais redes e um ou mais ativos em paralelo:

| Endereço (`publicKey`) | Redes (`blockchainNetworks`) | Ativos Disponíveis (`assets`) |
| :--------------------- | :--------------------------- | :---------------------------- |
| Formato EVM (`0x...`)  | `Polygon`, `Ethereum`        | `USDT`, `USDC`                |
| Formato Solana         | `Solana`                     | `USDT`, `USDC`                |
| Formato Tron (`T...`)  | `Tron`                       | `USDT`                        |

O fluxo para o usuário final deve ser estruturado da seguinte forma:
1. **Seleção do Ativo:** O usuário escolhe se deseja depositar **USDT** ou **USDC**.
2. **Seleção da Rede:** O sistema exibe as redes aceitas (`blockchainNetworks`) com base no ativo escolhido.
3. **Exibição do Endereço:** O sistema exibe a chave pública (`publicKey`) correspondente à combinação selecionada.
4. **Envio dos Fundos:** O usuário vai até a corretora ou carteira externa dele e envia o ativo escolhido, utilizando obrigatoriamente uma das redes listadas, para o endereço fornecido.

### ⚠️ Regras Críticas de Depósito

Para garantir a segurança dos fundos, o desenvolvedor deve exibir avisos claros no front-end para o usuário final:

:::danger[Risco de Perda de Fundos e Fraudes]
1. **USDT ou USDC:** A XGate processa exclusivamente depósitos em **Tether (USDT)** e **USD Coin (USDC)**. O envio de outras criptomoedas (como Bitcoin, Ethereum nativo, TRX, etc.) resultará na **perda irreversível** do valor.
2. **Rede Correta:** O depósito deve ser feito obrigatoriamente através de uma das redes listadas na nossa API (ex: `ERC-20`, `Solana` ou `Polygon`). O envio por redes não suportadas causará a perda total dos fundos.
3. **Alerta de Fraude ("Flash Tokens"):** Cuidado com golpistas que enviam tokens falsos imitando os originais (conhecidos como "Flash USDT" ou "Flash USDC"). Essas moedas falsas aparecem na carteira, mas não têm valor real e não podem ser transacionadas. Sempre valide pelo contrato inteligente (*smart contract*) se o token depositado é o oficial da Tether ou da Circle antes de liberar o saldo para o seu cliente final.
:::

### Exemplo de Aplicação (UX)

Ao integrar essa rota, recomendamos que sua interface mostre as informações de forma clara e atrelada ao endereço específico gerado. Por exemplo:

> 💰 **Ativos Aceitos:** USDT ou USDC
>
> 🌐 **Redes Suportadas (para este endereço):** Ethereum (ERC-20), Polygon
>
> 📍 **Endereço de Depósito:**
> `0xda4e37a068a2fed2c******************` 📋 (Botão Copiar)
>
> ⚠️ *Atenção: Envie apenas os ativos listados acima usando as redes indicadas. O envio de outras moedas ou o uso de redes incorretas resultará na perda irreversível dos fundos.*

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

    // Função auxiliar para aguardar 2 segundos (2000ms)
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    (async () => {
      const email = "your_email@domain.com";
      const password = "**********";
      const customerId = "************";
      const url_api = "https://api.xgateglobal.com";

      try {
        // 1. Autenticação na API
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const token = login.data.token;

        // 2. Função recursiva com retry para buscar ou gerar a carteira
        async function getWalletWithRetry(count = 0) {
          const { data } = await axios.get(`${url_api}/crypto/customer/${customerId}/wallet`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          // Se a API retornar a mensagem de provisionamento, aguarda 2 segundos e tenta de novo (máximo 3 vezes)
          if (
            data?.message === "Wait a few seconds, we are provisioning your wallet addresses" &&
            count < 3
          ) {
            console.log(`Carteira em criação. Tentativa ${count + 1} de 3... Aguardando 2 segundos.`);
            await sleep(2000);
            return getWalletWithRetry(count + 1);
          }

          return data;
        }

        console.log("Iniciando busca da carteira...");
        const wallet = await getWalletWithRetry();
        console.log("Resultado final da carteira:", wallet);

      } catch (error) {
        console.log("Erro na execução:", error.response?.data?.message || error.message);
      }
    })();
    ```
  </TabItem>
</Tabs>
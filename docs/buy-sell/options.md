---
sidebar_label: 'Opções'
sidebar_position: 3
description: 'Retorna o que a empresa pode fazer agora: ativos, redes, taxas, limites de compra, endereços salvos e endereços de venda.'
sidebar_class_name: 'sidebar-method-get'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Consultar Opções

Retorna o que a sua empresa pode fazer agora: ativos e redes liberados, taxas, limites de compra, endereços salvos e validade da cotação. Use esta rota antes de cotar ou comprar.

---

## Endpoint
- **Método:** <span className="badge badge--success">GET</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/crypto/options
```

---

## Requisição

#### Headers Obrigatórios

| Header          | Valor                | Descrição                    |
| :-------------- | :------------------- | :--------------------------- |
| `Authorization` | `Bearer <seu_token>` | O token JWT obtido no login. |

Esta rota não recebe parâmetros.

---

## Respostas (Responses)

### Sucesso (200 OK)

```json
{
  "assets": [
    {
      "asset": "USDT",
      "feeRate": "0.01500000",
      "spreadRate": "0.00800000",
      "networks": [
        { "network": "TRON", "networkFee": "0.012000", "networkFeeAsset": "USDT" },
        { "network": "POLYGON", "networkFee": "0.003000", "networkFeeAsset": "USDT" }
      ]
    },
    {
      "asset": "USDC",
      "feeRate": "0.01500000",
      "spreadRate": "0.00800000",
      "networks": [
        { "network": "SOLANA", "networkFee": "0.002000", "networkFeeAsset": "USDC" }
      ]
    }
  ],
  "buy": {
    "enabled": true,
    "minAmount": "50.00",
    "maxAmountPerTx": "100000.00",
    "dailyCap": "500000.00",
    "dailyRemaining": "498500.00",
    "totpThreshold": null,
    "autoApproval": false,
    "addresses": [
      {
        "addressId": "66f1a2b3c4d5e6f708192a3b",
        "alias": "Carteira tesouraria",
        "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
        "network": "TRON",
        "source": "MANUAL",
        "addedAt": "2026-10-01T12:00:00.000Z",
        "activeAt": "2026-10-01T12:00:00.000Z"
      }
    ]
  },
  "savedAddressesOnly": {
    "enabled": false,
    "newAddressHoldHours": 24
  },
  "quoteTtlSeconds": 30,
  "sale": {
    "enabled": false,
    "status": "DISABLED",
    "minAmount": { "USDT": null, "USDC": null },
    "depositAddresses": []
  }
}
```

#### Descrição dos Campos

| Campo                                 | Tipo                       | Descrição                                                                                                                                               |
| :------------------------------------ | :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `assets[].asset`                      | `USDT` \| `USDC`           | Ativo.                                                                                                                                                  |
| `assets[].feeRate`                    | `string` \| `null`         | Taxa de compra (XGate + indicação) sobre a quantidade cripto. É a base de `feeAmount`.                                                                  |
| `assets[].spreadRate`                 | `string` \| `null`         | Margem do par embutida no `rate` (`rate = ask × (1 + spreadRate)`).                                                                                     |
| `assets[].networks[].network`         | `string`                   | Rede disponível para o ativo (`POLYGON`, `ETHEREUM`, `TRON`, `SOLANA`).                                                                                 |
| `assets[].networks[].networkFee`      | `string` \| `null`         | Gás estimado da rede, no próprio ativo (6 casas), descontado da entrega. `null` quando indisponível ou quando a regra da empresa é percentual.           |
| `assets[].networks[].networkFeeAsset` | `USDT` \| `USDC`           | Ativo em que o gás é cobrado.                                                                                                                           |
| `buy.enabled`                         | `boolean`                  | Compra liberada para a empresa.                                                                                                                         |
| `buy.minAmount`                       | `string`                   | Compra mínima, em BRL.                                                                                                                                  |
| `buy.maxAmountPerTx`                  | `string` \| `null`         | Máximo por compra, em BRL.                                                                                                                              |
| `buy.dailyCap`                        | `string` \| `null`         | Teto diário de compra, em BRL.                                                                                                                          |
| `buy.dailyRemaining`                  | `string` \| `null`         | Quanto ainda resta do teto diário, em BRL.                                                                                                              |
| `buy.totpThreshold`                   | `string` \| `null`         | Usado só no painel. Não se aplica à API.                                                                                                                |
| `buy.autoApproval`                    | `boolean`                  | `true` = a compra não passa pela fila de aprovação da XGate.                                                                                            |
| `buy.addresses[]`                     | `array`                    | Endereços salvos da empresa: `addressId`, `alias`, `address`, `network`, `source` (`MANUAL` \| `CARD`), `addedAt`, `activeAt`. O `addressId` pode ser usado como destino na compra. |
| `savedAddressesOnly.enabled`          | `boolean`                  | Trava "só endereços salvos", ligada pela empresa no painel.                                                                                             |
| `savedAddressesOnly.newAddressHoldHours` | `integer`               | Carência, em horas, de um endereço novo quando a trava está ligada (24).                                                                                |
| `quoteTtlSeconds`                     | `integer`                  | Validade da cotação, em segundos (30).                                                                                                                  |
| `sale.enabled`                        | `boolean`                  | Venda liberada para a empresa. Fica `false` até a liberação da venda pela API (novembro de 2026).                                                      |
| `sale.status`                         | `string`                   | `DISABLED` · `PROVISIONING` · `READY`. A primeira consulta de uma empresa com venda liberada cria os endereços: fica `PROVISIONING` por alguns minutos e passa a `READY`. |
| `sale.minAmount`                      | `object`                   | Venda mínima por ativo (`USDT`, `USDC`), na quantidade do ativo.                                                                                        |
| `sale.depositAddresses[]`             | `array`                    | Endereço fixo da empresa para cada par `asset` × `network` (`asset`, `network`, `address`). Vazio enquanto a venda não estiver liberada. Veja <a href={useBaseUrl('/docs/buy-sell/sales/sell')}>Vender Cripto</a>. |

:::tip[Trava de endereços salvos]
Com `savedAddressesOnly.enabled = true`, a compra só aceita endereços de `buy.addresses[]`, e um endereço recém-cadastrado só pode ser usado depois de `activeAt` (carência de `newAddressHoldHours`).
:::

### Erros Comuns

| Status  | Reason                                                                                                                                  |
| :------ | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`                                                                                                                     |
| **401** | `UNAUTHORIZED`                                                                                                                          |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED` |
| **503** | `CONFIGURATION_UNAVAILABLE`, `SERVICE_OVERLOADED`                                                                                       |

Veja o significado de cada código em <a href={useBaseUrl('/docs/buy-sell/errors')}>Códigos de Erro</a>.

---

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

(async () => {
    const email = "your_email@domain.com";
    const password = "**********";

    try {
        const url_api = "https://api.xgateglobal.com";
        const login = await axios.post(`${url_api}/auth/token`, { email, password });
        const { data } = await axios.get(`${url_api}/crypto/options`, {
            headers: { "Authorization": `Bearer ${login.data.token}` }
        });
        console.log(data.assets, data.buy); // Response
    } catch (error) {
        console.log(error.response.data.reason, error.response.data.message); // Error
    }
})()
    ```
  </TabItem>
</Tabs>

---
sidebar_label: 'Consultar Saldo'
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Consultar Saldo da Empresa

Este endpoint permite consultar os saldos disponíveis na sua conta da XGate. Você pode buscar o saldo total (todas as moedas) ou filtrar por uma moeda Fiat ou Criptomoeda específica.

:::warning[Aviso de Segurança - Whitelist de IP]
Por questões de segurança, esta rota exige validação de origem. O IP do servidor que fará a requisição **deve obrigatoriamente** estar cadastrado na sua dashboard. 

Acesse o menu **Configurações > IP Permitidos para consulta de saldo via API** e adicione o seu IP. Caso contrário, a API retornará um erro de autorização.
:::


---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/balance/company
```

---

## Requisição

### Headers Obrigatórios

| Header | Valor | Descrição |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <seu_token>` | Token JWT de autenticação obtido no login. |

### Corpo da Requisição (Body)

Você tem 3 opções de payload para enviar, dependendo do que deseja consultar:

**Opção 1: Consultar Todo o Saldo (Fiat e Crypto)**
Envie um objeto vazio.
```json
{}
```

**Opção 2: Consultar apenas Moeda Fiduciária (Fiat)**
Envie o objeto `currency` detalhado.
```json
{
    "currency": {
        "_id": "6728f0a2cba3****************",
        "name": "BRL",
        "type": "PIX",
        "createdDate": "2024-11-04T16:04:50.019Z",
        "updatedDate": "2024-11-07T02:23:38.606Z",
        "__v": 0,
        "symbol": "R$"
    }
}
```

**Opção 3: Consultar apenas Criptomoeda**
Envie o objeto `cryptocurrency` detalhado.
```json
{
    "cryptocurrency": {
        "_id": "67339b18ca59****************",
        "__v": 0,
        "coinGecko": "tether",
        "createdDate": "2024-11-12T18:14:48.380Z",
        "name": "USDT",
        "symbol": "USDT",
        "updatedDate": "2024-11-15T05:53:32.979Z"
    }
}
```

---

## Respostas (Responses)

A API sempre retornará um *Array* (lista) contendo os saldos encontrados.

### Sucesso (200 OK)

**Resposta para Opção 1 (Saldo Total):**
```json
[
    {
        "currency": {
            "type": "PIX",
            "name": "BRL"
        },
        "totalAmount": 1.94,
        "totalHeld": 0
    },
    {
        "cryptocurrency": {
            "name": "USDT",
            "symbol": "USDT"
        },
        "totalAmount": 0.866938
    }
]
```

**Resposta para Opção 2 (Apenas Fiat):**
```json
[
    {
        "currency": {
            "type": "PIX",
            "name": "BRL"
        },
        "totalAmount": 1.94,
        "totalHeld": 0
    }
]
```

**Resposta para Opção 3 (Apenas Crypto):**
```json
[
    {
        "cryptocurrency": {
            "name": "USDT",
            "symbol": "USDT"
        },
        "totalAmount": 0.866938
    }
]
```

### Erros Comuns

| Status | Mensagem | Motivo Provável |
| :--- | :--- | :--- |
| **401** | `Unauthorized` | • Token inválido ou expirado.<br /> • Header inválido ou não informado.<br /> • **IP não cadastrado na lista de permissões da Dashboard.** |
| **500** | `Internal Server Error` | Erro interno de servidor. Entrar em contato com o suporte. |

---

## Como usar

### Casos de Uso Comuns

1. **Exibição em Dashboard Próprio:** Sincronizar e exibir o saldo atualizado da empresa diretamente no seu sistema administrativo interno, sem a necessidade de logar no painel da XGate.
2. **Validação Pré-Saque:** Antes de aprovar e disparar uma requisição de saque (withdraw) massiva, seu sistema pode consultar o saldo disponível (`totalAmount`) para garantir que há fundos suficientes, evitando erros de processamento.
3. **Monitoramento Financeiro:** Criar rotinas automatizadas que alertam sua equipe financeira quando o saldo (Fiat ou Crypto) cai abaixo de um limite mínimo operacional.

---

## Integração

Abaixo, um exemplo de como implementar a consulta de **Saldo Total** utilizando Node.js. 

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    O exemplo de integração utiliza a biblioteca `Axios` para realizar a requisição HTTP.

    **Instalando `Axios`:**
    ```bash
    npm install axios
    ```

    **Exemplo Javascript:**
    ```javascript
    const axios = require("axios");

    (async () => {
        const email = "email@domain.com";
        const password = "••••••";

        try {
            const url_api = "https://api.xgateglobal.com";
            
            // 1. Obter token de autenticação
            const login = await axios.post(`${url_api}/auth/token`, { email, password });
            
            // 2. Consultar o saldo total (Body vazio)
            // Nota: Para filtrar, basta adicionar o objeto currency ou cryptocurrency no body ({})
            const { data } = await axios.post(`${url_api}/balance/company`, {}, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`
                }
            });
            
            console.log("Saldo da Empresa:", JSON.stringify(data, null, 2));

            // Exemplo de leitura do saldo BRL:
            const saldoFiat = data.find(item => item.currency && item.currency.name === "BRL");
            if (saldoFiat) {
                console.log(`Saldo disponível em Reais: R$ ${saldoFiat.totalAmount}`);
            }

        } catch (error) {
            console.error("Erro ao buscar saldo:", error.response ? error.response.data : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
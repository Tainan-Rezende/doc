---
sidebar_label: 'Criar Subconta'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Criar Subconta

Este endpoint permite que um Parceiro (Conta Principal) crie **Subcontas** atreladas ao seu perfil. 

Uma subconta funciona como uma operação independente: possui seu próprio saldo, seus próprios usuários administrativos e seus próprios clientes finais. No entanto, ela está interligada à sua conta principal através de um sistema de **Split de Taxas**.


Ao criar a subconta, você define um percentual de taxa (`fee`) para cada método de depósito e saque. Toda vez que a subconta realizar uma transação, esse percentual será descontado dela e enviado automaticamente para o saldo da sua Conta Principal.

---

## Endpoint
- **Método:** <span className="badge badge--info">POST</span>

```bash title="URL do Endpoint"
https://api.xgateglobal.com/company/subaccount
```

---

## Requisição

### Headers Obrigatórios

| Header          | Valor                | Descrição                                             |
| :-------------- | :------------------- | :---------------------------------------------------- |
| `Authorization` | `Bearer <seu_token>` | Token JWT de autenticação da sua **Conta Principal**. |

### Corpo da Requisição (Body)

O payload de criação é extenso, pois você deve enviar os dados da nova empresa e configurar todas as taxas operacionais de entrada (`deposit`) e saída (`withdraw`).

| Parâmetro  | Tipo     | Validação   | Descrição                                                                       |
| :--------- | :------- | :---------- | :------------------------------------------------------------------------------ |
| `user`     | `object` | Obrigatório | Dados da empresa, `email` e `password` é usado para primeiro acesso no sistema. |
| `deposit`  | `object` | Obrigatório | Taxas de depósito em `currency`, `cryptocurrency` e `blockchain`.               |
| `withdraw` | `object` | Obrigatório | Taxas de saque em `currency`, `cryptocurrency` e `blockchain`.                  |

:::tip[Acesso ao Sistema]
Embora a senha (`password`) seja enviada na requisição para o primeiro acesso, o administrador da subconta poderá redefini-la posteriormente através do fluxo de "Esqueci minha senha" ou caso a plataforma exija redefinição por motivos de segurança.
:::

#### Exemplo de Payload

No exemplo abaixo, a conta principal está configurando uma taxa de **1% (`"value": 1`)** para operações da subconta.

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

## Respostas (Responses)

### Sucesso (200 OK)

A subconta foi estruturada e as regras de split de pagamentos foram aplicadas com sucesso.

```json
{
    "message": "Subconta cadastrada com sucesso"
}
```

### Erros Comuns

| Status  | Mensagem                | Motivo Provável                                                                                              |
| :------ | :---------------------- | :----------------------------------------------------------------------------------------------------------- |
| **401** | `Unauthorized`          | • Token inválido ou expirado.<br /> • Você não tem nível de acesso "Partner" para criar subcontas.           |
| **500** | `Internal Server Error` | Erro interno de servidor. Verifique se as estruturas dos objetos `currency` e `cryptocurrency` estão exatas. |

---

## Como usar

### Casos de Uso Comuns

1. **White-label e Revenda:** Você tem o seu próprio sistema ou gateway e deseja revender a infraestrutura da XGate para terceiros (seus clientes corporativos), cobrando um *markup* (taxa extra) automático sobre o volume transacionado por eles.
2. **Segregação de Negócios:** Você possui diferentes frentes de negócio (ex: E-commerce A, E-commerce B) e deseja separar o caixa e os clientes de cada um para não misturar os recebimentos, mas centralizando o lucro na holding (Conta Principal).

### Como montar o Payload de Taxas

A chave para o funcionamento e precificação corretos deste endpoint é o objeto `fee`. Para cada moeda e rede que você habilitar, é preciso injetar a regra de cobrança. O sistema suporta dois tipos (`type`) de taxas:

**1. Taxa Percentual (`PERCENTAGE`)**
Cobra uma porcentagem sobre o valor total da transação.

```json
"fee": {
    "type": "PERCENTAGE",
    "value": 1
}
```
*Exemplo: Se a subconta processar um depósito de R$ 100,00, ela receberá R$ 99,00 e a sua Conta Principal receberá R$ 1,00.*

**2. Taxa Fixa (`FIXED`)**
Cobra um valor exato e fixo, independentemente do tamanho da transação.

```json
"fee": {
    "type": "FIXED",
    "value": 2.50
}
```
*Exemplo: Se a subconta processar um depósito de R$ 100,00 ou de R$ 10.000,00, a sua Conta Principal sempre receberá exatamente R$ 2,50 por aquela transação.*

---

## Integração

Abaixo, um exemplo base em Node.js mostrando como estruturar e enviar essa grande carga de dados. Na prática, você buscará as listas de moedas disponíveis nos endpoints da XGate e montará esses arrays dinamicamente antes de enviar.

<Tabs groupId="sdk-examples">
  <TabItem value="js" label="Node.js">
    O exemplo utiliza a biblioteca `Axios`.

    **Instalando `Axios`:**
    ```bash
    npm install axios
    ```

    **Exemplo Javascript:**
    ```javascript
    const axios = require("axios");

    (async () => {
        const emailMaster = "seu-email-master@domain.com";
        const passwordMaster = "••••••";

        try {
            const url_api = "https://api.xgateglobal.com";
            
            // 1. Obter token da Conta Principal
            const login = await axios.post(`${url_api}/auth/token`, { 
                email: emailMaster, 
                password: passwordMaster 
            });
            
            // 2. Montar o payload da Subconta (Resumido para o exemplo)
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
                            // Exemplo usando taxa FIXA no saque
                            fee: { "type": "FIXED", "value": 1.5 }
                        }
                    ],
                    blockchainNetworks: [],
                    cryptocurrencies: []
                }
            };
            
            // 3. Criar a Subconta
            const { data } = await axios.post(`${url_api}/company/subaccount`, subAccountData, {
                headers: {
                    "Authorization": `Bearer ${login.data.token}`,
                    "Content-Type": "application/json"
                }
            });
            
            console.log("Resposta:", data); 
            // Esperado: { message: 'Subconta cadastrada com sucesso' }

        } catch (error) {
            console.error("Erro ao criar subconta:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        }
    })();
    ```
  </TabItem>
</Tabs>
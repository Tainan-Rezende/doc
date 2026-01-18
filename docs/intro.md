---
sidebar_position: 1
---

# Introdução

## O que é a XGate?

XGate é uma solução moderna e poderosa para pagamentos e conversões financeiras, projetada para facilitar e automatizar transações via PIX e criptomoedas. Com uma API robusta, é perfeita para desenvolvedores que desejam integrar rapidamente funcionalidades financeiras às suas aplicações.

## Funcionalidades

- Processamento instantâneo via PIX;
- Conversão automática de moeda FIAT para Crypto
- Depósitos e saques com suporte a Bitcoin, Ethereum, SHIBA INU, USDT, USDC, BNB e MATIC
- Monitoramento em tempo real com dashboard avançado

## Pacotes Oficiais
Para simplificar e acelerar sua integração com a API da XGATE, nós oferecemos Pacotes de Desenvolvimento (SDKs) oficiais.

Em vez de você precisar montar manualmente cada requisição HTTP, gerenciar tokens de autenticação e formatar o `body` de cada chamada, nossos pacotes fazem todo o trabalho pesado para você.

Basta instalar o pacote correspondente à sua linguagem e chamar as funções já prontas.

---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="sdk-explicacao">
  <TabItem value="npm" label="NPM (para JavaScript/Node.js)" default>

    ### O que é o pacote NPM?

    **NPM** (Node Package Manager) é o gerenciador de pacotes padrão do ecossistema JavaScript. 

    Nosso pacote NPM (`xgate-client`) é uma biblioteca que "envolve" todas as rotas da nossa API em funções JavaScript fáceis de usar. Ele é ideal para:

    * **Backend:** Aplicações feitas em **Node.js** (como Express, NestJS, etc.).
    * **Frontend:** Aplicações modernas como **React**, **Angular** ou **Vue**.

    #### Principais Vantagens:

    * **Autenticação Automática:** Ele cuida da chamada de `login` e armazena o token para as próximas requisições.
    * **Funções Claras:** Em vez de `POST /deposit`, você simplesmente chama `xgate.criarDeposito({ ... })`.
    * **Tipagem (TypeScript):** Se você usa TypeScript, o pacote já informa os tipos corretos para cada função.

    A instalação dele é feita pela linha de comando e adiciona o pacote ao seu arquivo `package.json`.

  </TabItem>
  <TabItem value="composer" label="Composer (para PHP)">

    ### O que é o pacote Composer?

    **Composer** é o gerenciador de dependências padrão do ecossistema PHP.

    Nosso pacote Composer (`xgate/php-client`) é uma biblioteca que segue os padrões do PHP (PSR) e permite que você instancie um "Cliente" da nossa API dentro do seu projeto. Ele é ideal para:

    * **Frameworks Modernos:** Projetos em **Laravel**, **Symfony**, etc.
    * **PHP Puro:** Qualquer aplicação PHP que utilize o `autoload` do Composer.

    #### Principais Vantagens:

    * **Autenticação Simplificada:** Instancie o cliente com suas credenciais e ele gerencia o token para você.
    * **Métodos Organizados:** Em vez de configurar o cURL manualmente, você simplesmente chama `$xgate->criarDeposito([ ... ])`.
    * **Tratamento de Erros:** O pacote captura erros da API e os transforma em `Exceptions` do PHP, que você pode tratar facilmente com `try...catch`.

    A instalação dele é feita pela linha de comando e adiciona o pacote ao seu arquivo `composer.json`.

  </TabItem>
</Tabs>

## Instalação

<Tabs groupId="installation">
  <TabItem value="npm" label="NPM" default>

    ### Instalação NPM

    :::warning[Atenção]
      Este pacote é compatível com **JavaScript** e **TypeScript**, oferecendo tipagens completas para melhor experiência de desenvolvimento em aplicações modernas.
    :::

    ```bash
    npm install xgate
    ```

    Consulte o manual para instruções completas de instalação e uso:

    <a href="https://www.npmjs.com/package/xgate" class="button button--primary button--block"><i class="fa-solid fa-book-open"></i> Checar manual NPM</a>

  </TabItem>
  <TabItem value="composer" label="Composer">

    ### Instalação Composer

    :::warning[Atenção]
      Este pacote é compatível com PHP, oferecendo tipagens e orientação a objetos completas para melhor experiência de desenvolvimento em aplicações modernas.
    :::

    ```bash
    composer require xgate/xgate-integration dev-production
    ```

    Consulte o manual para instruções completas de instalação e uso:

    <a href="https://packagist.org/packages/xgate/xgate-integration" class="button button--primary button--block"><i class="fa-solid fa-book-open"></i> Checar manual Composer</a>

  </TabItem>
</Tabs>
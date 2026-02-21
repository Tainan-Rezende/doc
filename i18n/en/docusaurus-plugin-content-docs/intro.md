---
sidebar_position: 1
---

# Introduction

## What is XGate?

XGate is a modern and powerful solution for payments and financial conversions, designed to facilitate and automate transactions via PIX and cryptocurrencies. With a robust API, it's perfect for developers who want to quickly integrate financial functionality into their applications.

## Features

- Instant PIX processing;
- Automatic FIAT to Crypto currency conversion
- Deposits and withdrawals supporting Bitcoin, Ethereum, SHIBA INU, USDT, USDC, BNB, and MATIC
- Real-time monitoring with advanced dashboard

## Official Packages
To simplify and accelerate your integration with the XGATE API, we offer official Development Packages (SDKs).

Instead of having to manually build each HTTP request, manage authentication tokens, and format the `body` of each call, our packages do all the heavy lifting for you.

Just install the package corresponding to your language and call the pre-built functions.

---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="sdk-explicacao">
  <TabItem value="npm" label="NPM (for JavaScript/Node.js)" default>

    ### What is the NPM package?

    **NPM** (Node Package Manager) is the standard package manager for the JavaScript ecosystem. 

    Our NPM package (`xgate-client`) is a library that "wraps" all our API routes in easy-to-use JavaScript functions. It's ideal for:

    * **Backend:** Applications built with **Node.js** (such as Express, NestJS, etc.).
    * **Frontend:** Modern applications like **React**, **Angular**, or **Vue**.

    #### Key Advantages:

    * **Automatic Authentication:** It handles the `login` call and stores the token for subsequent requests.
    * **Clear Functions:** Instead of `POST /deposit`, you simply call `xgate.createDeposit({ ... })`.
    * **Typing (TypeScript):** If you use TypeScript, the package already provides correct types for each function.

    Installation is done via command line and adds the package to your `package.json` file.

  </TabItem>
  <TabItem value="composer" label="Composer (for PHP)">

    ### What is the Composer package?

    **Composer** is the standard dependency manager for the PHP ecosystem.

    Our Composer package (`xgate/php-client`) is a library that follows PHP standards (PSR) and allows you to instantiate a "Client" of our API within your project. It's ideal for:

    * **Modern Frameworks:** Projects using **Laravel**, **Symfony**, etc.
    * **Pure PHP:** Any PHP application that uses Composer's `autoload`.

    #### Key Advantages:

    * **Simplified Authentication:** Instantiate the client with your credentials and it manages the token for you.
    * **Organized Methods:** Instead of manually configuring cURL, you simply call `$xgate->createDeposit([ ... ])`.
    * **Error Handling:** The package captures API errors and transforms them into PHP `Exceptions`, which you can easily handle with `try...catch`.

    Installation is done via command line and adds the package to your `composer.json` file.

  </TabItem>
</Tabs>

## Installation

<Tabs groupId="installation">
  <TabItem value="npm" label="NPM" default>

    ### NPM Installation

    :::warning[Attention]
      This package is compatible with **JavaScript** and **TypeScript**, offering complete typing for a better development experience in modern applications.
    :::

    ```bash
    npm install xgate
    ```

    See the manual for complete installation and usage instructions:

    <a href="https://www.npmjs.com/package/xgate" class="button button--primary button--block"><i class="fa-solid fa-book-open"></i> Check NPM Manual</a>

  </TabItem>
  <TabItem value="composer" label="Composer">

    ### Composer Installation

    :::warning[Attention]
      This package is compatible with PHP, offering complete typing and object-oriented design for a better development experience in modern applications.
    :::

    ```bash
    composer require xgate/xgate-integration dev-production
    ```

    See the manual for complete installation and usage instructions:

    <a href="https://packagist.org/packages/xgate/xgate-integration" class="button button--primary button--block"><i class="fa-solid fa-book-open"></i> Check Composer Manual</a>

  </TabItem>
</Tabs>
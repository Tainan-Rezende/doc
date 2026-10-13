---
sidebar_position: 1
---

# Introducción

## ¿Qué es XGate?

XGate es una solución moderna y potente para pagos, diseñada para facilitar y automatizar transacciones a través de PIX y la compra y venta de criptomonedas. Con una API robusta, es perfecta para desarrolladores que desean integrar rápidamente funcionalidades financieras en sus aplicaciones.

## Características

- Procesamiento instantáneo de PIX;
- Depósitos y retiros en **BRL**;
- [Compra y venta](./buy-sell/overview.md) de **USDT** y **USDC** con el saldo en reales;
- Monitoreo en tiempo real con panel avanzado.

## Paquetes oficiales
Para simplificar y acelerar su integración con la API de XGATE, ofrecemos paquetes oficiales de desarrollo (SDKs).

En lugar de tener que construir manualmente cada solicitud HTTP, gestionar tokens de autenticación y formatear el `body` de cada llamada, nuestros paquetes hacen todo el trabajo pesado por usted.

Solo instale el paquete correspondiente a su lenguaje y llame a las funciones preconstruidas.

---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="sdk-explicacao">
  <TabItem value="npm" label="NPM (para JavaScript/Node.js)" default>

    ### ¿Qué es el paquete NPM?

    **NPM** (Node Package Manager) es el gestor de paquetes estándar del ecosistema de JavaScript.

    Nuestro paquete NPM (`xgate-client`) es una librería que "envuelve" todas nuestras rutas de API en funciones de JavaScript fáciles de usar. Es ideal para:

    * **Backend:** Aplicaciones desarrolladas con **Node.js** (como Express, NestJS, etc.).
    * **Frontend:** Aplicaciones modernas como **React**, **Angular** o **Vue**.

    #### Principales ventajas:

    * **Autenticación automática:** Gestiona la llamada `login` y almacena el token para solicitudes posteriores.
    * **Funciones claras:** En lugar de `POST /deposit`, simplemente llama a `xgate.createDeposit({ ... })`.
    * **Tipado (TypeScript):** Si utiliza TypeScript, el paquete ya proporciona los tipos correctos para cada función.

    La instalación se realiza mediante la línea de comandos y agrega el paquete a su archivo `package.json`.

  </TabItem>
  <TabItem value="composer" label="Composer (para PHP)">

    ### ¿Qué es el paquete Composer?

    **Composer** es el gestor de dependencias estándar del ecosistema de PHP.

    Nuestro paquete Composer (`xgate/php-client`) es una librería que sigue los estándares de PHP (PSR) y le permite instanciar un "Client" de nuestra API dentro de su proyecto. Es ideal para:

    * **Frameworks modernos:** Proyectos que utilizan **Laravel**, **Symfony**, etc.
    * **PHP puro:** Cualquier aplicación PHP que use el `autoload` de Composer.

    #### Principales ventajas:

    * **Autenticación simplificada:** Instancie el cliente con sus credenciales y él gestiona el token por usted.
    * **Métodos organizados:** En lugar de configurar cURL manualmente, simplemente llama a `$xgate->createDeposit([ ... ])`.
    * **Manejo de errores:** El paquete captura los errores de la API y los transforma en `Exceptions` de PHP, que puede manejar fácilmente con `try...catch`.

    La instalación se realiza mediante la línea de comandos y agrega el paquete a su archivo `composer.json`.

  </TabItem>
</Tabs>

## Instalación

<Tabs groupId="installation">
  <TabItem value="npm" label="NPM" default>

    ### Instalación con NPM

    :::warning[Atención]
      Este paquete es compatible con **JavaScript** y **TypeScript**, ofreciendo tipado completo para una mejor experiencia de desarrollo en aplicaciones modernas.
    :::

    ```bash
    npm install xgate
    ```

    Consulte el manual para obtener instrucciones completas de instalación y uso:

    <a href="https://www.npmjs.com/package/xgate" class="button button--primary button--block"><i class="fa-solid fa-book-open"></i> Consulte el manual de NPM.</a>

  </TabItem>
  <TabItem value="composer" label="Composer">

    ### Instalación con Composer

    :::warning[Atención]
      Este paquete es compatible con PHP, ofreciendo tipado completo y diseño orientado a objetos para una mejor experiencia de desarrollo en aplicaciones modernas.
    :::

    ```bash
    composer require xgate/xgate-integration dev-production
    ```

    Consulte el manual para obtener instrucciones completas de instalación y uso:

    <a href="https://packagist.org/packages/xgate/xgate-integration" class="button button--primary button--block"><i class="fa-solid fa-book-open"></i> Consultar manual de Composer</a>

  </TabItem>
</Tabs>
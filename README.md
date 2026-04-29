# XGate Documentation System 🚀

Este repositório contém o código-fonte da documentação oficial da API XGate. O projeto foi desenvolvido utilizando **Docusaurus 3** e **React**, focado em oferecer uma experiência de integração rápida e intuitiva para desenvolvedores.

## 🛠️ Tecnologias Utilizadas

- [Docusaurus 3](https://docusaurus.io/) - Framework para documentação estática.
- [React](https://reactjs.org/) - Biblioteca para interface de usuário.
- [Infima](https://infima.dev/) - Sistema de design focado em conteúdo.

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (Versão 20.0 ou superior recomendada)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

## 🚀 Instalação e Uso

1. **Clone o repositório:**
  ```bash
  git clone https://github.com/Tainan-Rezende/doc.git
  cd doc
  ```

2. **Instale as dependências:**
  ```bash
  npm install
  ```
3. **Inicie o servidor de desenvolvimento:**
   Você pode rodar a documentação no idioma de sua preferência utilizando os atalhos configurados:

   - **Português (Padrão):**
    ```bash
    npm start
    ```

   - **Inglês:**
    ```bash
    npm run start:en
    ```

O site estará disponível em http://localhost:3000.

## 🏗️ Build e Deploy

Para gerar os arquivos estáticos para produção:
    ```bash
    npm run build
    ```
Os arquivos serão gerados na pasta `/build`, prontos para serem hospedados em qualquer servidor estático (Vercel, Netlify, GitHub Pages, etc).

## 📦 Pacotes Oficiais (SDKs)

A documentação inclui guias para nossos pacotes oficiais, projetados para simplificar a integração com a API XGate em diversas linguagens. Estes SDKs abstraem a complexidade das requisições HTTP e gerenciamento de tokens.

---
© 2026 Equipe XGate. Todos os direitos reservados.
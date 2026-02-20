import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import styles from './index.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate from '@docusaurus/Translate';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            <Translate id="homepage.hero.button">Ler a documentação</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

function FAQItem({ question, children }) {
  return (
    <details style={{ marginBottom: '1rem', padding: '1.5rem', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '12px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
      <summary style={{ cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>
        {question}
      </summary>
      <div style={{ marginTop: '2rem' }}>
        {children}
      </div>
    </details>
  );
}

function Step({ number, title, children }) {
  return (
    <div style={{ marginBottom: '2.5rem', borderLeft: '2px solid var(--ifm-color-primary)', paddingLeft: '20px' }}>
      <h4 style={{ marginBottom: '1rem', color: 'var(--ifm-color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ backgroundColor: 'var(--ifm-color-primary)', color: '#fff', borderRadius: '4px', padding: '2px 8px', fontSize: '0.8rem' }}><Translate id="homepage.faq.step.label">PASSO</Translate> {number}</span>
        {title}
      </h4>
      <div>{children}</div>
    </div>
  );
}

// --- SEÇÃO FAQ COMPLETA ---
function FAQSection() {
  return (
    <div id="faq" className="container" style={{ padding: '4rem 0 0 0' }}>
      <Heading as="h2" style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}><Translate id="homepage.faq.title">Perguntas Frequentes</Translate></Heading>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* PERGUNTA 1: DEPÓSITO FIDUCIÁRIO */}
        <FAQItem question={<Translate id="homepage.faq.q1.title">Como fazer um depósito de moeda fiduciária?</Translate>}>
          <Step number="1" title={<Translate id="homepage.faq.q1.step1.title">Autenticação</Translate>}>
            <p><Translate id="homepage.faq.q1.step1.desc">Realize o login para obter seu token de acesso. Este token deve ser enviado no</Translate> <strong>Header</strong> <Translate id="homepage.faq.q1.step1.desc2">de todas as requisições seguintes.</Translate></p>
            <CodeBlock language="http">{`Authorization: Bearer eyJhbGci...`}</CodeBlock>
          </Step>
          <Step number="2" title={<Translate id="homepage.faq.q1.step2.title">Criar ou Identificar o Cliente</Translate>}>
            <p><Translate id="homepage.faq.q1.step2.desc">Envie os dados do pagador para a rota</Translate> <code>[POST] /customer</code>. <Translate id="homepage.faq.q1.step2.desc2">Se o cliente já existir, a API retornará o registro com o ID atual.</Translate></p>
            <CodeBlock language="json">{`{\n  "name": "João Silva",\n  "phone": "5511999999999",\n  "email": "joao@email.com",\n  "document": "12345678909"\n}`}</CodeBlock>
          </Step>
          <Step number="3" title={<Translate id="homepage.faq.q1.step3.title">Selecionar Moeda Fiduciária</Translate>}>
            <p><Translate id="homepage.faq.q1.step3.desc">Consulte as moedas disponíveis para sua conta em</Translate> <code>[GET] /deposit/company/currencies</code> <Translate id="homepage.faq.q1.step3.desc2">e utilize o objeto retornado.</Translate></p>
            <CodeBlock language="json">{`{\n  "_id": "6728f0...",\n  "name": "BRL",\n  "type": "PIX"\n}`}</CodeBlock>
          </Step>
          <Step number="4" title={<Translate id="homepage.faq.q1.step4.title">Gerar Pedido de Depósito</Translate>}>
            <p><Translate id="homepage.faq.q1.step4.desc">Envie o valor, o ID do cliente e o objeto da moeda para</Translate> <code>[POST] /deposit</code> <Translate id="homepage.faq.q1.step4.desc2">para receber o QR Code Pix.</Translate></p>
          </Step>
          <p>👉 <em><Translate id="homepage.faq.q1.footer">Para detalhes dos campos e erros, veja a página de</Translate> <strong><Link to={useBaseUrl('/docs/fiat/deposit/create')}><Translate id="homepage.faq.q1.footer.link">Criar Depósito Pix</Translate></Link></strong>.</em></p>
        </FAQItem>

        {/* PERGUNTA 2: SAQUE FIDUCIÁRIO */}
        <FAQItem question={<Translate id="homepage.faq.q2.title">Como fazer um saque de moeda fiduciária?</Translate>}>
          <Step number="1" title={<Translate id="homepage.faq.q2.step1.title">Identificar o Cliente e a Moeda</Translate>}>
            <p><Translate id="homepage.faq.q2.step1.desc">Após criar o cliente, consulte as moedas permitidas para saque em</Translate> <code>[GET] /withdraw/company/currencies</code>.</p>
          </Step>
          <Step number="2" title={<Translate id="homepage.faq.q2.step2.title">Criar a solicitação de saque</Translate>}>
            <p><Translate id="homepage.faq.q2.step2.desc">Envie os dados para a rota</Translate> <code>[POST] /withdraw</code>. <Translate id="homepage.faq.q2.step2.desc2">Para Pix, é obrigatório informar o CPF/CNPJ de destino no campo</Translate> <code>document</code>.</p>
            <CodeBlock language="json">{`{\n  "amount": 50.00,\n  "customerId": "ID_CLIENTE",\n  "document": "12345678909",\n  "currency": { "name": "BRL", "type": "PIX" }\n}`}</CodeBlock>
          </Step>
          <p>👉 <em><Translate id="homepage.faq.q2.footer">Para detalhes dos campos e erros, veja a página de</Translate> <strong><Link to={useBaseUrl('/docs/fiat/withdraw/create')}><Translate id="homepage.faq.q2.footer.link">Criar Saque Pix</Translate></Link></strong>.</em></p>
        </FAQItem>

        {/* PERGUNTA 3: DEPÓSITO CRYPTO */}
        <FAQItem question={<Translate id="homepage.faq.q3.title">Como fazer um depósito de criptomoeda?</Translate>}>
          <p style={{ marginBottom: '20px' }}><Translate id="homepage.faq.q3.intro">Este fluxo refere-se ao depósito direto de carteira para carteira (Crypto para Crypto).</Translate></p>
          <Step number="1" title={<Translate id="homepage.faq.q3.step1.title">Criação do Cliente</Translate>}>
            <p><Translate id="homepage.faq.q3.step1.desc">Registre o usuário final em</Translate> <code>[POST] /customer</code> <Translate id="homepage.faq.q3.step1.desc2">para obter seu identificador único.</Translate></p>
          </Step>
          <Step number="2" title={<Translate id="homepage.faq.q3.step2.title">Buscar PublicKey da Carteira</Translate>}>
            <p><Translate id="homepage.faq.q3.step2.desc">Solicite as chaves públicas (wallets) vinculadas ao cliente em</Translate> <code>[GET] /crypto/customer/ID_CLIENTE/wallet</code>.</p>
            <CodeBlock language="json">{`[\n  {\n    "blockchainNetworks": ["Ethereum", "BEP-20"],\n    "publicKey": "0x742d35..."\n  }\n]`}</CodeBlock>
          </Step>
          <p>👉 <em><Translate id="homepage.faq.q3.footer">Para detalhes dos campos e erros, veja a página de</Translate> <strong><Link to={useBaseUrl('/docs/crypto/deposit/create')}><Translate id="homepage.faq.q3.footer.link">Criar Depósito Crypto</Translate></Link></strong>.</em></p>
        </FAQItem>

        {/* PERGUNTA 4: SAQUE CRYPTO PARA CRYPTO */}
        <FAQItem question={<><Translate id="homepage.faq.q4.title.part1">Como fazer um</Translate> <strong><Translate id="homepage.faq.q4.title.bold1">saque</Translate></strong> <Translate id="homepage.faq.q4.title.part2">de</Translate> <strong><Translate id="homepage.faq.q4.title.bold2">criptomoeda</Translate></strong>?</>}>
          <p style={{ marginBottom: '20px' }}>
            <Translate id="homepage.faq.q4.intro">Este fluxo permite enviar criptomoedas do seu saldo XGate diretamente para uma carteira externa (Ex: Metamask, Ledger ou Exchange).</Translate>
          </p>

          <Step number="1" title={<Translate id="homepage.faq.q4.step1.title">Criar ou Identificar o Cliente</Translate>}>
            <p><Translate id="homepage.faq.q4.step1.desc">Certifique-se de que o cliente recebedor está cadastrado na rota</Translate> <code>[POST] /customer</code> <Translate id="homepage.faq.q4.step1.desc2">para obter o</Translate> <code>customerId</code>.</p>
            <CodeBlock language="json">{`{\n  "name": "Nome do Recebedor",\n  "email": "recebedor@email.com",\n  "document": "12345678909"\n}`}</CodeBlock>
          </Step>

          <Step number="2" title={<Translate id="homepage.faq.q4.step2.title">Buscar Redes e Criptomoedas disponíveis</Translate>}>
            <p><Translate id="homepage.faq.q4.step2.desc">Consulte as redes blockchain e moedas habilitadas para saque em</Translate> <code>[GET] /withdraw/company/blockchain-networks</code>.</p>
            <CodeBlock language="json">{`[\n  {\n    "name": "BEP-20",\n    "chainId": "56",\n    "chain": "BSC",\n    "symbol": "BNB",\n    "cryptocurrencies": [\n      { "name": "USDT", "symbol": "USDT" }\n    ]\n  }\n]`}</CodeBlock>
          </Step>

          <Step number="3" title={<Translate id="homepage.faq.q4.step3.title">Criar a solicitação de saque</Translate>}>
            <p><Translate id="homepage.faq.q4.step3.desc">Envie o payload para</Translate> <code>[POST] /withdraw</code>. <Translate id="homepage.faq.q4.step3.desc2">Note que a</Translate> <strong><Translate id="homepage.faq.q4.step3.bold">wallet</Translate></strong> <Translate id="homepage.faq.q4.step3.desc3">de destino é informada no final do objeto, após as definições de rede.</Translate></p>
            <CodeBlock language="json">{`{\n  "amount": 2,\n  "customerId": "6732388e6e540509cd594d27",\n  "cryptocurrency": {\n    "_id": "6793f5****************",\n    "name": "USDT",\n    "symbol": "USDT"\n  },\n  "blockchainNetwork": {\n    "_id": "6733a3****************",\n    "name": "BEP-20",\n    "chainId": "56",\n    "chain": "BSC",\n    "symbol": "BNB"\n  },\n  "wallet": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"\n}`}</CodeBlock>
            <p><Translate id="homepage.faq.q4.step3.note">A resposta confirmará o status como</Translate> <code>PENDING</code>.</p>
          </Step>
          <p>👉 <em><Translate id="homepage.faq.q4.footer">Para detalhes dos campos e erros, veja a página de</Translate> <strong><Link to={useBaseUrl('/docs/crypto/withdraw/create-external')}><Translate id="homepage.faq.q4.footer.link">Criar Saque Externo</Translate></Link></strong>.</em></p>
        </FAQItem>

        {/* PERGUNTA 5: DEPÓSITO FIDUCIÁRIO COM CONVERSÃO PARA CRYPTO */}
        <FAQItem question={<><Translate id="homepage.faq.q5.title.part1">Como fazer um</Translate> <strong><Translate id="homepage.faq.q5.title.bold1">depósito</Translate></strong> <Translate id="homepage.faq.q5.title.part2">com</Translate> <strong><Translate id="homepage.faq.q5.title.bold2">moeda fiduciária</Translate></strong> <Translate id="homepage.faq.q5.title.part3">e</Translate> <strong><Translate id="homepage.faq.q5.title.bold3">converter</Translate></strong> <Translate id="homepage.faq.q5.title.part4">para</Translate> <strong><Translate id="homepage.faq.q5.title.bold4">criptomoeda</Translate></strong>?</>}>
          <p style={{ marginBottom: '20px' }}>
            <Translate id="homepage.faq.q5.intro">Este fluxo é ideal para gateways que desejam receber pagamentos em Pix (BRL) e ter o saldo creditado automaticamente em Criptomoedas (ex: USDT) na sua conta XGate.</Translate>
          </p>

          <Step number="1" title={<Translate id="homepage.faq.q5.step1.title">Autenticação e Cliente</Translate>}>
            <p><Translate id="homepage.faq.q5.step1.desc">Certifique-se de estar autenticado e possuir o</Translate> <code>customerId</code> <Translate id="homepage.faq.q5.step1.desc2">do pagador gerado na rota</Translate> <code>[POST] /customer</code>.</p>
          </Step>

          <Step number="2" title={<Translate id="homepage.faq.q5.step2.title">Buscar Moeda Fiduciária (Origem)</Translate>}>
            <p><Translate id="homepage.faq.q5.step2.desc">Consulte a moeda que o cliente usará para pagar em</Translate> <code>[GET] /deposit/company/currencies</code> <Translate id="homepage.faq.q5.step2.desc2">e guarde o objeto (ex: BRL/PIX).</Translate></p>
            <CodeBlock language="json">{`{\n  "_id": "6728f0a2cba3ac9ea3009993",\n  "name": "BRL",\n  "symbol": "R$",\n  "type": "PIX"\n}`}</CodeBlock>
          </Step>

          <Step number="3" title={<Translate id="homepage.faq.q5.step3.title">Buscar Criptomoeda (Destino)</Translate>}>
            <p><Translate id="homepage.faq.q5.step3.desc">Consulte a criptomoeda que você deseja receber em</Translate> <code>[GET] /deposit/company/cryptocurrencies</code> <Translate id="homepage.faq.q5.step3.desc2">e guarde o objeto (ex: USDT).</Translate></p>
            <CodeBlock language="json">{`{\n  "_id": "67339b18ca592e9d570e8586",\n  "name": "USDT",\n  "symbol": "USDT",\n  "coinGecko": "tether"\n}`}</CodeBlock>
          </Step>

          <Step number="4" title={<Translate id="homepage.faq.q5.step4.title">Criar o pedido de depósito e conversão</Translate>}>
            <p><Translate id="homepage.faq.q5.step4.desc">Envie o valor, o ID do cliente e</Translate> <strong><Translate id="homepage.faq.q5.step4.bold">ambos os objetos de moeda</Translate></strong> <Translate id="homepage.faq.q5.step4.desc2">para a rota</Translate> <code>[POST] /deposit</code>.</p>
            <CodeBlock language="json">{`{\n  "amount": 100,\n  "customerId": "677e15d045407c7fa30c0229",\n  "currency": {\n    "_id": "6728f0a2cba3ac9ea3009993",\n    "name": "BRL",\n    "type": "PIX"\n  },\n  "cryptocurrency": {\n    "_id": "67339b18ca592e9d570e8586",\n    "name": "USDT",\n    "symbol": "USDT"\n  }\n}`}</CodeBlock>
            <p><strong><Translate id="homepage.faq.q5.step4.note.bold">Resposta:</Translate></strong> <Translate id="homepage.faq.q5.step4.note">A API retornará o status</Translate> <code>WAITING_PAYMENT</code> <Translate id="homepage.faq.q5.step4.note2">e o</Translate> <code>code</code> <Translate id="homepage.faq.q5.step4.note3">do Pix para o cliente pagar. Assim que compensado, a conversão para Crypto é instantânea.</Translate></p>
          </Step>
          <p>👉 <em><Translate id="homepage.faq.q5.footer">Para detalhes dos campos e erros, veja a página de</Translate> <strong><Link to={useBaseUrl('/docs/crypto/deposit/create')}><Translate id="homepage.faq.q5.footer.link">Criar Depósito convertendo para Crypto</Translate></Link></strong>.</em></p>
        </FAQItem>

        {/* PERGUNTA 6: SAQUE COM CONVERSÃO (CRYPTO -> FIAT) */}
        <FAQItem question={<><Translate id="homepage.faq.q6.title.part1">Como fazer um</Translate> <strong><Translate id="homepage.faq.q6.title.bold1">saque</Translate></strong> <Translate id="homepage.faq.q6.title.part2">com</Translate> <strong><Translate id="homepage.faq.q6.title.bold2">criptomoeda</Translate></strong> <Translate id="homepage.faq.q6.title.part3">e</Translate> <strong><Translate id="homepage.faq.q6.title.bold3">converter</Translate></strong> <Translate id="homepage.faq.q6.title.part4">para</Translate> <strong><Translate id="homepage.faq.q6.title.bold4">moeda fiduciária</Translate></strong>?</>}>
          <p style={{ marginBottom: '20px' }}>
            <Translate id="homepage.faq.q6.intro">Este fluxo permite que você utilize seu saldo em Criptomoedas (ex: USDT) para realizar um pagamento via Pix (BRL) para um cliente final, com a conversão de câmbio automática.</Translate>
          </p>

          <Step number="1" title={<Translate id="homepage.faq.q6.step1.title">Identificar o Cliente e Criar Chave Pix</Translate>}>
            <p><Translate id="homepage.faq.q6.step1.desc">Certifique-se de possuir o</Translate> <code>customerId</code> <Translate id="homepage.faq.q6.step1.desc2">e cadastre a chave Pix de destino para este cliente na rota</Translate> <code>[POST] /pix/customer/ID_CLIENTE/key</code>.</p>
            <CodeBlock language="json">{`{\n  "key": "12345678909",\n  "type": "CPF"\n}`}</CodeBlock>
            <p><strong>⚠️ <Translate id="homepage.faq.q6.step1.note.bold">IMPORTANTE:</Translate></strong> <Translate id="homepage.faq.q6.step1.note">O retorno desta rota fornecerá o</Translate> <code>_id</code> <Translate id="homepage.faq.q6.step1.note2">da chave Pix, necessário para o passo final.</Translate></p>
          </Step>

          <Step number="2" title={<Translate id="homepage.faq.q6.step2.title">Simular a Conversão (Opcional)</Translate>}>
            <p><Translate id="homepage.faq.q6.step2.desc">Para saber o valor exato em BRL antes de efetivar o saque, envie o objeto completo da criptomoeda para</Translate> <code>[POST] /withdraw/conversion/brl/pix</code>.</p>
            <CodeBlock language="json">{`{\n  "amount": 10,\n  "cryptocurrency": {\n    "_id": "6733a2a90076c0dd9822b86a",\n    "name": "USDT",\n    "symbol": "USDT",\n    "coinGecko": "tether",\n    "updatedDate": "2024-11-18T20:54:34.442Z",\n    "createdDate": "2024-11-12T18:47:05.649Z",\n    "__v": 0\n  }\n}`}</CodeBlock>
            <p><strong><Translate id="homepage.faq.q6.step2.response.bold">Resposta do servidor:</Translate></strong></p>
            <CodeBlock language="json">{`{\n  "amount": 51.72,\n  "currency": "R$",\n  "cryptoToFiatExchangeRate": "R$ 5.172"\n}`}</CodeBlock>
          </Step>

          <Step number="3" title={<Translate id="homepage.faq.q6.step3.title">Criar o pedido de saque com conversão</Translate>}>
            <p><Translate id="homepage.faq.q6.step3.desc">Envie o payload para</Translate> <code>[POST] /withdraw</code> <Translate id="homepage.faq.q6.step3.desc2">incluindo obrigatoriamente os</Translate> <strong><Translate id="homepage.faq.q6.step3.bold">_id</Translate></strong> <Translate id="homepage.faq.q6.step3.desc3">de cada recurso buscado nos passos anteriores.</Translate></p>
            <CodeBlock language="json">{`{\n  "amount": 10,\n  "customerId": "68e7b8f0dbed018132c69135",\n  "currency": {\n    "_id": "6728f0a2cba3ac9ea3009993",\n    "name": "BRL",\n    "type": "PIX"\n  },\n  "cryptocurrency": {\n    "_id": "6733a2a90076c0dd9822b86a",\n    "name": "USDT",\n    "symbol": "USDT"\n  },\n  "pixKey": {\n    "_id": "692c81d045407c7fa30c0229",\n    "key": "12345678909",\n    "type": "CPF"\n  }\n}`}</CodeBlock>
            <p><Translate id="homepage.faq.q6.step3.note">A XGate debitará 10 USDT do seu saldo e enviará R$ 51,72 via Pix para a chave informada.</Translate></p>
          </Step>
          <p>👉 <em><Translate id="homepage.faq.q6.footer">Para detalhes dos campos e erros, veja a página de</Translate> <strong><Link to={useBaseUrl('/docs/crypto/withdraw/create')}><Translate id="homepage.faq.q6.footer.link">Criar Saque Crypto convertendo para FIAT</Translate></Link></strong>.</em></p>
        </FAQItem>

        {/* PERGUNTA 7: CRIAR PARCEIRO NO PAINEL */}
        <FAQItem question={<><Translate id="homepage.faq.q7.title.part1">Como criar um</Translate> <strong><Translate id="homepage.faq.q7.title.bold1">parceiro</Translate></strong> <Translate id="homepage.faq.q7.title.part2">no</Translate> <strong><Translate id="homepage.faq.q7.title.bold2">painel administrativo</Translate></strong>?</>}>
          <p style={{ marginBottom: '20px' }}>
            <Translate id="homepage.faq.q7.intro">Se você prefere não utilizar a API para criar subcontas, pode realizar o processo manualmente através do Backoffice da XGate.</Translate>
          </p>

          <Step number="1" title={<Translate id="homepage.faq.q7.step1.title">Acessar o Menu Parceiros</Translate>}>
            <p><Translate id="homepage.faq.q7.step1.desc">No menu lateral esquerdo do seu painel, localize e clique na opção</Translate> <strong><Translate id="homepage.faq.q7.step1.bold">Parceiros</Translate></strong>.</p>
          </Step>

          <Step number="2" title={<Translate id="homepage.faq.q7.step2.title">Acessar a Lista</Translate>}>
            <p><Translate id="homepage.faq.q7.step2.desc">Dentro da seção, clique no botão</Translate> <strong><Translate id="homepage.faq.q7.step2.bold">Ver lista de parceiros</Translate></strong> <Translate id="homepage.faq.q7.step2.desc2">localizado no topo da página.</Translate></p>
          </Step>

          <Step number="3" title={<Translate id="homepage.faq.q7.step3.title">Iniciar Cadastro</Translate>}>
            <p><Translate id="homepage.faq.q7.step3.desc">Na tela de listagem, clique no botão azul</Translate> <strong><Translate id="homepage.faq.q7.step3.bold">+ Cadastrar parceiro</Translate></strong>.</p>
          </Step>

          <Step number="4" title={<Translate id="homepage.faq.q7.step4.title">Configuração e Salvamento</Translate>}>
            <p><Translate id="homepage.faq.q7.step4.desc">Um formulário será exibido. Preencha todos os dados da nova empresa (Subconta) e, principalmente, as regras de taxas (Fees) que deseja aplicar. Ao finalizar, clique no botão</Translate> <strong><Translate id="homepage.faq.q7.step4.bold">Salvar</Translate></strong> <Translate id="homepage.faq.q7.step4.desc2">no final do formulário.</Translate></p>
            <p><strong>✅ <Translate id="homepage.faq.q7.step4.note.bold">Resultado:</Translate></strong> <Translate id="homepage.faq.q7.step4.note">O parceiro receberá as credenciais de acesso por e-mail e você poderá acompanhar o volume transacionado por ele em tempo real.</Translate></p>
          </Step>
          <p>👉 <em><Translate id="homepage.faq.q7.footer">Aprenda a automatizar isso em</Translate> <strong><Link to={useBaseUrl('/docs/company/sub-account')}><Translate id="homepage.faq.q7.footer.link">Criar Subconta</Translate></Link></strong>.</em></p>
        </FAQItem>

      </div>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} | Documentação Oficial`}
      description="XGate: Solução robusta para pagamentos Pix e Criptomoedas com conversão automática.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <FAQSection />
      </main>
    </Layout>
  );
}
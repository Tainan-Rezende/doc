import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate from '@docusaurus/Translate';
import Details from '@theme/Details';
import Admonition from '@theme/Admonition';

// Componentes auxiliares do FAQ
function FAQItem({ question, children }) {
  return (
    <Details 
      summary={<summary style={{ fontSize: '1.2rem', fontWeight: 400 }}>{question}</summary>}
      style={{ 
        marginBottom: '.5rem', 
        padding: '1.5rem', 
        backgroundColor: 'var(--ifm-color-emphasis-100)', 
        borderRadius: '.35rem', 
        border: '1px solid var(--ifm-color-emphasis-200)' 
      }}
    >
      <div style={{ marginTop: '1rem' }}>
        {children}
      </div>
    </Details>
  );
}

function Step({ number, title, children }) {
  return (
    <div style={{ marginBottom: '2.5rem', borderLeft: '1px solid var(--ifm-color-primary)', paddingLeft: '20px' }}>
      <h4 style={{ marginBottom: '1rem', color: 'var(--ifm-color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ backgroundColor: 'var(--ifm-color-primary)', color: '#fff', borderRadius: '4px', padding: '2px 8px', fontSize: '0.8rem' }}><Translate id="homepage.faq.step.label">PASSO</Translate> {number}</span>
        {title}
      </h4>
      <div>{children}</div>
    </div>
  );
}

// A Página Principal de FAQ
export default function FAQ() {
  return (
    <Layout title="FAQ - Perguntas Frequentes" description="Perguntas frequentes sobre a integração com a API XGate.">
      <main style={{ padding: '4rem 0' }}>
        <div className="container">
          <Heading as="h1" style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', fontWeight: 500 }}>
            <Translate id="homepage.faq.title">Perguntas Frequentes</Translate>
          </Heading>

          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* PERGUNTA 1: DEPÓSITO PIX */}
            <FAQItem question={<Translate id="homepage.faq.q1.title">Como fazer um depósito de moeda fiduciária (Pix)?</Translate>}>
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
                <CodeBlock language="json">{`[\n  {\n    "_id": "6728f0******************",\n    "name": "BRL",\n    "type": "PIX",\n    "symbol": "R$"\n  }\n]`}</CodeBlock>
              </Step>
              <Step number="4" title={<Translate id="homepage.faq.q1.step4.title">Gerar Pedido de Depósito</Translate>}>
                <p><Translate id="homepage.faq.q1.step4.desc">Envie o valor, o ID do cliente e o objeto da moeda para</Translate> <code>[POST] /deposit</code> <Translate id="homepage.faq.q1.step4.desc2">para receber o QR Code Pix.</Translate></p>
                <CodeBlock language="json">{`{\n  "amount": 10,\n  "customerId": "675792************",\n  "currency": {\n    "_id": "67acba38************",\n    "name": "BRL",\n    "type": "PIX"\n  }\n}`}</CodeBlock>
              </Step>
              <p>👉 <em><Translate id="homepage.faq.q1.footer">Para detalhes dos campos e erros, veja a página de</Translate> <strong><Link to={useBaseUrl('/docs/fiat/deposit/create')}><Translate id="homepage.faq.q1.footer.link">Criar Depósito Pix</Translate></Link></strong>.</em></p>
            </FAQItem>

            {/* PERGUNTA 2: SAQUE PIX */}
            <FAQItem question={<Translate id="homepage.faq.q2.title">Como fazer um saque de moeda fiduciária (Pix)?</Translate>}>
              <Step number="1" title={<Translate id="homepage.faq.q2.step1.title">Autenticação</Translate>}>
                <p><Translate id="homepage.faq.q2.step1.desc">Realize o login para obter seu token de acesso. Ele é obrigatório no Header para gerar o saque.</Translate></p>
              </Step>
              <Step number="2" title={<Translate id="homepage.faq.q2.step2.title">Buscar Moedas para Saque</Translate>}>
                <p><Translate id="homepage.faq.q2.step2.desc">Consulte as moedas habilitadas para a sua conta através da rota</Translate> <code>[GET] /withdraw/company/currencies</code>.</p>
              </Step>
              <Step number="3" title={<Translate id="homepage.faq.q2.step3.title">Criar a solicitação de saque</Translate>}>
                <p><Translate id="homepage.faq.q2.step3.desc">Envie os dados para a rota</Translate> <code>[POST] /withdraw</code> <Translate id="homepage.faq.q2.step3.desc2">informando o valor, customerId, os dados da moeda e a chave Pix.</Translate></p>
                <CodeBlock language="json">{`{\n  "amount": 1,\n  "customerId": "67594a***************",\n  "currency": {\n    "_id": "67339fa***************",\n    "name": "BRL",\n    "type": "PIX"\n  },\n  "pixKey": {\n    "key": "02*********",\n    "type": "CPF"\n  }\n}`}</CodeBlock>
              </Step>
              <p>👉 <em><Translate id="homepage.faq.q2.footer">Para detalhes dos campos e erros, veja a página de</Translate> <strong><Link to={useBaseUrl('/docs/fiat/withdraw/create')}><Translate id="homepage.faq.q2.footer.link">Criar Saque Pix</Translate></Link></strong>.</em></p>
            </FAQItem>

            {/* PERGUNTA 3: COMPRA DE CRIPTO */}
            <FAQItem question={<Translate id="homepage.faq.q3.title">Como comprar criptomoedas (USDT ou USDC) usando saldo em Reais?</Translate>}>
              <p style={{ marginBottom: '20px' }}>
                <Translate id="homepage.faq.q3.intro">A empresa utiliza seu saldo em reais (BRL) na XGate para comprar USDT ou USDC. A XGate debita o valor e envia a criptomoeda diretamente para a carteira externa indicada por você.</Translate>
              </p>
              <Step number="1" title={<Translate id="homepage.faq.q3.step1.title">Consultar Opções e Cotação (Recomendado)</Translate>}>
                <p><Translate id="homepage.faq.q3.step1.desc">Consulte os pares liberados para sua empresa em</Translate> <code>[GET] /crypto/options</code>. <Translate id="homepage.faq.q3.step1.desc2">Se desejar travar a taxa de câmbio por 20 segundos, solicite uma cotação formal em</Translate> <code>[POST] /crypto/quotes</code>:</p>
                <CodeBlock language="json">{`{\n  "action": "BUY",\n  "asset": "USDT",\n  "network": "TRON",\n  "amount": "1500.00"\n}`}</CodeBlock>
              </Step>
              <Step number="2" title={<Translate id="homepage.faq.q3.step2.title">Criar a Ordem de Compra</Translate>}>
                <p><Translate id="homepage.faq.q3.step2.desc">Envie a ordem para</Translate> <code>[POST] /crypto/purchases</code> <Translate id="homepage.faq.q3.step2.desc2">informando o endereço da carteira de entrega e a cotação obtida (ou o valor direto):</Translate></p>
                <CodeBlock language="json">{`{\n  "quoteId": "l3m8Qm1n0pV2cXk5dY9sTg4hWz7aB6eR1uJ0oK2qF3i",\n  "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",\n  "externalId": "pedido-7781"\n}`}</CodeBlock>
              </Step>
              <Step number="3" title={<Translate id="homepage.faq.q3.step3.title">Acompanhar a Entrega</Translate>}>
                <p><Translate id="homepage.faq.q3.step3.desc">Acompanhe a liquidação e o hash da transferência na blockchain (txHash) pelo webhook</Translate> <code>CRYPTO_PURCHASE</code> <Translate id="homepage.faq.q3.step3.desc2">ou consultando</Translate> <code>[GET] /crypto/purchases/{'{id}'}</code>.</p>
              </Step>
              <p>👉 <em><Translate id="homepage.faq.q3.footer">Consulte o fluxo completo em</Translate> <strong><Link to={useBaseUrl('/docs/buy-sell/purchases/create')}><Translate id="homepage.faq.q3.footer.link">Comprar Cripto</Translate></Link></strong>.</em></p>
            </FAQItem>

            {/* PERGUNTA 4: VENDA DE CRIPTO */}
            <FAQItem question={<Translate id="homepage.faq.q4.title">Como vender criptomoedas e receber o valor em Reais (BRL)?</Translate>}>
              <p style={{ marginBottom: '20px' }}>
                <Translate id="homepage.faq.q4.intro">A venda de criptomoedas não possui endpoint de criação (sem POST). A sua empresa envia USDT ou USDC diretamente para um endereço fixo fornecido pela XGate. Cada transferência confirmada na rede vira uma venda automática.</Translate>
              </p>
              <Step number="1" title={<Translate id="homepage.faq.q4.step1.title">Obter o Endereço Fixo de Depósito</Translate>}>
                <p><Translate id="homepage.faq.q4.step1.desc">Consulte a rota</Translate> <code>[GET] /crypto/options</code> <Translate id="homepage.faq.q4.step1.desc2">para obter os endereços fixos da sua empresa por rede no campo</Translate> <code>sale.depositAddresses</code>.</p>
                <CodeBlock language="json">{`{\n  "network": "TRON",\n  "address": "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf"\n}`}</CodeBlock>
              </Step>
              <Step number="2" title={<Translate id="homepage.faq.q4.step2.title">Transferir os Ativos</Translate>}>
                <p><Translate id="homepage.faq.q4.step2.desc">Envie os tokens USDT ou USDC a partir da sua carteira para o endereço correspondente à rede desejada.</Translate></p>
              </Step>
              <Step number="3" title={<Translate id="homepage.faq.q4.step3.title">Liquidação em Reais (Saldo ou Pix)</Translate>}>
                <p><Translate id="homepage.faq.q4.step3.desc">Assim que a transferência atinge as confirmações de rede necessárias, a XGate converte o valor e credita em Reais no seu saldo em conta ou liquida via Pix para um beneficiário aprovado, conforme sua configuração.</Translate></p>
              </Step>
              <p>👉 <em><Translate id="homepage.faq.q4.footer">Consulte detalhes e regras de liquidação em</Translate> <strong><Link to={useBaseUrl('/docs/buy-sell/sales/sell')}><Translate id="homepage.faq.q4.footer.link">Vender Cripto</Translate></Link></strong>.</em></p>
            </FAQItem>

            {/* PERGUNTA 5: DESCONTINUAÇÃO DAS ROTAS ANTIGAS */}
            <FAQItem question={<Translate id="homepage.faq.q5.title">O que mudou nas rotas antigas de cripto (descontinuadas em 29/10/2026)?</Translate>}>
              <Admonition type="danger" title={<Translate id="homepage.faq.q5.admonition.title">Descontinuado em 29/10/2026</Translate>}>
                <p style={{ margin: 0 }}>
                  <Translate id="homepage.faq.q5.admonition.desc">
                    As rotas antigas de cripto (carteira do customer, depósito com conversão, saque cripto e saque com conversão) deixam de funcionar em 29/10/2026. A partir dessa data, qualquer chamada a essas rotas responde com o código
                  </Translate> <code>410 FEATURE_DISCONTINUED</code>. <Translate id="homepage.faq.q5.admonition.desc2">A XGate não realiza mais custódia de criptomoedas de empresas.</Translate>
                </p>
              </Admonition>

              <p style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                <Translate id="homepage.faq.q5.table.intro">Utilize a nova arquitetura de Compra e Venda de Cripto no lugar dos fluxos antigos:</Translate>
              </p>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--ifm-color-emphasis-300)' }}>
                      <th style={{ textAlign: 'left', padding: '8px' }}><Translate id="homepage.faq.q5.th1">O que você fazia antes</Translate></th>
                      <th style={{ textAlign: 'left', padding: '8px' }}><Translate id="homepage.faq.q5.th2">O que usar agora</Translate></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>
                      <td style={{ padding: '8px' }}><Translate id="homepage.faq.q5.r1.c1">Depósito Pix convertendo para cripto na carteira</Translate></td>
                      <td style={{ padding: '8px' }}><Link to={useBaseUrl('/docs/buy-sell/purchases/create')}><Translate id="homepage.faq.q5.r1.c2">Compra de Cripto (via saldo ou depósito)</Translate></Link></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>
                      <td style={{ padding: '8px' }}><Translate id="homepage.faq.q5.r2.c1">Saque cripto da carteira para endereço externo</Translate></td>
                      <td style={{ padding: '8px' }}><Link to={useBaseUrl('/docs/buy-sell/purchases/create')}><Translate id="homepage.faq.q5.r2.c2">Compra de Cripto com entrega direta na sua carteira</Translate></Link></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>
                      <td style={{ padding: '8px' }}><Translate id="homepage.faq.q5.r3.c1">Depósito de cripto para gerar saldo ou conversão para Pix</Translate></td>
                      <td style={{ padding: '8px' }}><Link to={useBaseUrl('/docs/buy-sell/sales/sell')}><Translate id="homepage.faq.q5.r3.c2">Venda de Cripto via endereço fixo</Translate></Link></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </FAQItem>

            {/* PERGUNTA 6: CRIAR PARCEIRO NO PAINEL */}
            <FAQItem question={<><Translate id="homepage.faq.q6.title.part1">Como criar um</Translate> <strong><Translate id="homepage.faq.q6.title.bold1">parceiro</Translate></strong> <Translate id="homepage.faq.q6.title.part2">no</Translate> <strong><Translate id="homepage.faq.q6.title.bold2">painel da XGate</Translate></strong>?</>}>
              <p style={{ marginBottom: '20px' }}>
                <Translate id="homepage.faq.q6.intro">Se você prefere não utilizar a API para criar subcontas, pode realizar o processo manualmente através do painel da XGate.</Translate>
              </p>

              <Step number="1" title={<Translate id="homepage.faq.q6.step1.title">Acessar o Menu Parceiros</Translate>}>
                <p><Translate id="homepage.faq.q6.step1.desc">No menu lateral esquerdo do seu painel, localize e clique na opção</Translate> <strong><Translate id="homepage.faq.q6.step1.bold">Parceiros</Translate></strong>.</p>
              </Step>

              <Step number="2" title={<Translate id="homepage.faq.q6.step2.title">Acessar a Lista</Translate>}>
                <p><Translate id="homepage.faq.q6.step2.desc">Dentro da seção, clique no botão</Translate> <strong><Translate id="homepage.faq.q6.step2.bold">Ver lista de parceiros</Translate></strong> <Translate id="homepage.faq.q6.step2.desc2">localizado no topo da página.</Translate></p>
              </Step>

              <Step number="3" title={<Translate id="homepage.faq.q6.step3.title">Iniciar Cadastro</Translate>}>
                <p><Translate id="homepage.faq.q6.step3.desc">Na tela de listagem, clique no botão azul</Translate> <strong><Translate id="homepage.faq.q6.step3.bold">+ Cadastrar parceiro</Translate></strong>.</p>
              </Step>

              <Step number="4" title={<Translate id="homepage.faq.q6.step4.title">Configuração e Salvamento</Translate>}>
                <p><Translate id="homepage.faq.q6.step4.desc">Um formulário será exibido. Preencha todos os dados da nova empresa (Subconta) e, principalmente, as regras de taxas (Fees) que deseja aplicar. Ao finalizar, clique no botão</Translate> <strong><Translate id="homepage.faq.q6.step4.bold">Salvar</Translate></strong> <Translate id="homepage.faq.q6.step4.desc2">no final do formulário.</Translate></p>
                <p><strong>✅ <Translate id="homepage.faq.q6.step4.note.bold">Resultado:</Translate></strong> <Translate id="homepage.faq.q6.step4.note">O parceiro receberá as credenciais de acesso por e-mail e você poderá acompanhar o volume transacionado por ele em tempo real.</Translate></p>
              </Step>
              <p>👉 <em><Translate id="homepage.faq.q6.footer">Aprenda a automatizar isso via API em</Translate> <strong><Link to={useBaseUrl('/docs/company/sub-account')}><Translate id="homepage.faq.q6.footer.link">Criar Subconta</Translate></Link></strong>.</em></p>
            </FAQItem>

            {/* PERGUNTA 7: STATUS CODES HTTP */}
            <FAQItem question={<Translate id="homepage.faq.q7.title">Quais são os códigos de status (HTTP) retornados pela API?</Translate>}>
              <p style={{ marginBottom: '20px' }}>
                <Translate id="homepage.faq.q7.intro">A API da XGate utiliza padrões REST e retorna códigos de status HTTP convencionais para indicar o sucesso ou a falha de uma requisição. Abaixo estão os principais códigos:</Translate>
              </p>

              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                  <strong style={{ color: 'var(--ifm-color-success)' }}>200 OK:</strong> <Translate id="homepage.faq.q7.200">A requisição foi recebida, processada e retornou com sucesso.</Translate>
                </li>
                <li style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                  <strong style={{ color: 'var(--ifm-color-success)' }}>201 Created:</strong> <Translate id="homepage.faq.q7.201">Recurso criado com sucesso no servidor (ex: criação de compra, cliente ou depósito).</Translate>
                </li>
                <li style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                  <strong style={{ color: 'var(--ifm-color-danger)' }}>400 Bad Request:</strong> <Translate id="homepage.faq.q7.400">Erro de validação. O corpo da requisição está mal formatado ou com campos ausentes.</Translate>
                </li>
                <li style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                  <strong style={{ color: 'var(--ifm-color-danger)' }}>401 Unauthorized:</strong> <Translate id="homepage.faq.q7.401">Falha de autenticação. Token Bearer ausente, expirado ou inválido.</Translate>
                </li>
                <li style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                  <strong style={{ color: 'var(--ifm-color-warning)' }}>403 Forbidden:</strong> <Translate id="homepage.faq.q7.403">Sem permissão. Autenticado, mas sem privilégios para executar a ação.</Translate>
                </li>
                <li style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                  <strong style={{ color: 'var(--ifm-color-warning)' }}>404 Not Found:</strong> <Translate id="homepage.faq.q7.404">O recurso solicitado não foi encontrado.</Translate>
                </li>
                <li style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                  <strong style={{ color: 'var(--ifm-color-danger)' }}>410 Gone (FEATURE_DISCONTINUED):</strong> <Translate id="homepage.faq.q7.410">Rota antiga de cripto desligada em 29/10/2026. Migre para a Compra e Venda de Cripto.</Translate>
                </li>
                <li style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                  <strong style={{ color: 'var(--ifm-color-warning)' }}>422 Unprocessable Entity:</strong> <Translate id="homepage.faq.q7.422">Erro de regra de negócio (ex: saldo insuficiente, cotação expirada ou parâmetros rejeitados).</Translate>
                </li>
                <li style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                  <strong style={{ color: 'var(--ifm-color-danger)' }}>500 Internal Server Error:</strong> <Translate id="homepage.faq.q7.500">Falha interna no servidor da XGate.</Translate>
                </li>
              </ul>

              <p style={{ marginTop: '20px' }}>
                <strong>💡 <Translate id="homepage.faq.q7.tip.bold">Dica para debugging:</Translate></strong> <Translate id="homepage.faq.q7.tip">Sempre que a API retornar um erro (série 400 ou 500), a resposta trará um objeto JSON com a propriedade</Translate> <code>message</code> <Translate id="homepage.faq.q7.tip2">ou</Translate> <code>reason</code> <Translate id="homepage.faq.q7.tip3">detalhando a falha.</Translate>
              </p>
            </FAQItem>

          </div>
        </div>
      </main>
    </Layout>
  );
}
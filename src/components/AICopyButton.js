import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function AICopyButton({ promptText }) {
  const { i18n } = useDocusaurusContext();
  const locale = i18n.currentLocale;
  
  const [copied, setCopied] = useState(false);

  const translations = {
    en: {
      btnNormal: "Copy AI Prompt",
      btnCopied: "Copied!",
      tooltip: "Use the OpenAPI specification to generate the integration code."
    },
    es: {
      btnNormal: "Copiar Prompt IA",
      btnCopied: "¡Copiado!",
      tooltip: "Utiliza la especificación OpenAPI para generar el código de integración."
    },
    pt: {
      btnNormal: "Copiar Prompt de Integração",
      btnCopied: "Copiado com sucesso!",
      tooltip: "Utilize a especificação OpenAPI para gerar o código de integração em qualquer linguagem."
    }
  };

  const t = translations[locale] || translations.pt;

  const handleCopy = () => {
    const regraGlobal = `\n\n# REGRA GLOBAL DE IDIOMA E BOAS PRÁTICAS:
# O usuário que colar este prompt pode falar outro idioma (Inglês, Espanhol, etc). 
# Você DEVE gerar os comentários (//) e explicações de texto ESTRITAMENTE no idioma em que o usuário fez o pedido. 
# NO ENTANTO, seguindo as boas práticas globais de programação, você DEVE manter TODOS os nomes de variáveis, funções e chaves do JSON em Inglês padrão. NUNCA traduza os nomes de variáveis ou chaves da API.`;

    const promptFinal = promptText + regraGlobal;

    navigator.clipboard.writeText(promptFinal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const SparkleIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  return (
    <button
      className={copied ? 'copied' : ''}
      onClick={handleCopy}
      title={t.tooltip}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 14px',
        backgroundColor: copied ? 'var(--ifm-color-primary)' : 'transparent',
        color: copied ? '#ffffff' : 'var(--ifm-color-emphasis-600)',
        border: copied ? '1px solid var(--ifm-color-primary)' : '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '0.85rem',
        transition: 'all 0.2s ease',
      }}
    >
      {copied ? <CheckIcon /> : <SparkleIcon />}
      {copied ? t.btnCopied : t.btnNormal}
    </button>
  );
}
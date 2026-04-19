import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function AICopyButton({ promptText }) {
  const { i18n } = useDocusaurusContext();
  const locale = i18n.currentLocale;
  
  const [copied, setCopied] = useState(false);

  const translations = {
    en: {
      title: "AI Code Generator",
      description: "Use the OpenAPI specification to generate the integration code in any programming language. Works perfectly with ChatGPT, Claude, GitHub Copilot, and Cursor.",
      btnNormal: "Copy Integration Prompt",
      btnCopied: "Prompt copied! Ready to paste."
    },
    es: {
      title: "Generador de Código IA",
      description: "Utiliza la especificación OpenAPI para generar el código de integración en cualquier lenguaje. Funciona perfectamente con ChatGPT, Claude, GitHub Copilot y Cursor.",
      btnNormal: "Copiar Prompt de Integración",
      btnCopied: "¡Prompt copiado! Listo para pegar."
    },
    pt: {
      title: "Gerador de Código via IA",
      description: "Utilize a especificação OpenAPI para gerar o código de integração na sua linguagem preferida. Funciona perfeitamente com ChatGPT, Claude, GitHub Copilot e Cursor.",
      btnNormal: "Copiar Prompt de Integração",
      btnCopied: "Prompt copiado! Pronto para colar."
    }
  };

  const t = translations[locale] || translations.pt;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Ícones SVG minimalistas para um visual mais profissional
  const SparkleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  return (
    <div style={{
      border: '1px solid var(--ifm-color-emphasis-200)',
      borderRadius: 'var(--ifm-global-radius)',
      padding: '20px',
      backgroundColor: 'var(--ifm-background-surface-color)',
      marginBottom: '1rem'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>
        <SparkleIcon />
        {t.title}
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)', marginBottom: '20px', lineHeight: '1.5' }}>
        {t.description}
      </p>
      
      <button
        onClick={handleCopy}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '12px 20px',
          backgroundColor: copied ? 'var(--ifm-color-success)' : 'var(--ifm-color-primary)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease',
        }}
      >
        {copied ? <CheckIcon /> : <SparkleIcon />}
        {copied ? t.btnCopied : t.btnNormal}
      </button>
    </div>
  );
}
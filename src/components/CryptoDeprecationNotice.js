import React from 'react';
import Admonition from '@theme/Admonition';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const translations = {
  'pt-br': {
    title: 'Descontinuado em 29/10/2026',
    body: 'Esta rota deixa de funcionar em 29/10/2026. A partir dessa data ela responde',
    replacement: 'Use a',
    link: 'Compra e Venda de Cripto',
  },
  en: {
    title: 'Discontinued on 2026-10-29',
    body: 'This route stops working on 2026-10-29. After this date it responds with',
    replacement: 'Use',
    link: 'Crypto Buy and Sell',
  },
  es: {
    title: 'Descontinuado el 29/10/2026',
    body: 'Esta ruta deja de funcionar el 29/10/2026. A partir de esa fecha responderá con',
    replacement: 'Utilice la',
    link: 'Compra y Venta de Cripto',
  },
};

export default function CryptoDeprecationNotice() {
  const { i18n } = useDocusaurusContext();
  const locale = (i18n?.currentLocale || 'pt-br').toLowerCase();

  const currentLang = locale.startsWith('en')
    ? 'en'
    : locale.startsWith('es')
    ? 'es'
    : 'pt-br';

  const t = translations[currentLang] || translations['pt-br'];

  return (
    <Admonition type="danger" title={t.title}>
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        {t.body} <code>410 FEATURE_DISCONTINUED</code>. {t.replacement}{' '}
        <Link to="/docs/buy-sell/overview">{t.link}</Link>.
      </p>
    </Admonition>
  );
}
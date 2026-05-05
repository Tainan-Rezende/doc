import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function AuthTester() {
  const { i18n: { currentLocale } } = useDocusaurusContext();

  // Dicionário de Traduções
  const translations = {
    'pt-br': {
      title: "Testar: Autenticação",
      step1: "1. Suas Credenciais",
      emailLabel: "Email",
      emailPlaceholder: "seu@email.com",
      passwordLabel: "Senha",
      btnLoading: "Autenticando...",
      btnNormal: "Obter Token",
      statusLabel: "Status:",
      errorText: "Erro",
      connError: "Erro na conexão"
    },
    en: {
      title: "Test: Authentication",
      step1: "1. Your Credentials",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      passwordLabel: "Password",
      btnLoading: "Authenticating...",
      btnNormal: "Get Token",
      statusLabel: "Status:",
      errorText: "Error",
      connError: "Connection Error"
    },
    es: {
      title: "Probar: Autenticación",
      step1: "1. Sus Credenciales",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@correo.com",
      passwordLabel: "Contraseña",
      btnLoading: "Autenticando...",
      btnNormal: "Obtener Token",
      statusLabel: "Estado:",
      errorText: "Error",
      connError: "Error de conexión"
    }
  };

  const t = translations[currentLocale] || translations.en;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);

    try {
      const response = await fetch('https://api.xgateglobal.com/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setResultado({ status: response.status, body: data });
    } catch (error) {
      setResultado({ erro: t.connError, detalhe: error.message });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px', borderRadius: 'var(--ifm-global-radius)', border: '1px solid var(--ifm-color-emphasis-300)', backgroundColor: 'var(--ifm-background-surface-color)', color: 'var(--ifm-font-color-base)', fontSize: '0.9rem' };
  const toggleButtonStyle = { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--ifm-font-color-secondary)', zIndex: 2, display: 'flex', alignItems: 'center' };

  return (
    <div style={{ padding: '20px', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 'var(--ifm-global-radius)', backgroundColor: 'var(--ifm-card-background-color)', boxShadow: 'var(--ifm-global-shadow-lw)', marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px' }}>
        <span style={{ fontSize: '1.5rem' }}>🔐</span>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
      </div>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
            {t.step1}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.emailLabel}</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder={t.emailPlaceholder} />
            </div>
            <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.passwordLabel}</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{ ...inputStyle, paddingRight: '45px' }} 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleButtonStyle}>
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                </div>
            </div>
        </div>

        <button type="submit" disabled={loading} className="button button--primary button--block">
          {loading ? t.btnLoading : t.btnNormal}
        </button>
      </form>

      {resultado && (
        <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <strong>{t.statusLabel}&nbsp;</strong>
            <span style={{ 
              fontWeight: 'bold', 
              color: resultado.status >= 200 && resultado.status < 300 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)' 
            }}>
              {resultado.status || t.errorText}
            </span>
          </div>
          
          <CodeBlock language="json">
             {JSON.stringify(resultado.body || resultado, null, 2)}
          </CodeBlock>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function ListWithdrawCryptoCurrenciesTester() {
  const { i18n: { currentLocale } } = useDocusaurusContext();

  const i18n = {
    'pt-br': {
      title: 'Testar: Listar Criptomoedas de Saque',
      step1: '1. Suas Credenciais',
      emailLabel: 'Email',
      emailPlaceholder: 'email@...',
      pwdLabel: 'Senha',
      btnExecute: 'Listar Criptos Disponíveis',
      btnLoading: 'Carregando...',
      status: 'Status',
      statusFail: 'Falha',
      errorAuth: 'Login falhou',
      errorGeneral: 'Erro'
    },
    en: {
      title: 'Test: List Withdrawal Cryptocurrencies',
      step1: '1. Your Credentials',
      emailLabel: 'Email',
      emailPlaceholder: 'email@...',
      pwdLabel: 'Password',
      btnExecute: 'List Available Cryptos',
      btnLoading: 'Loading...',
      status: 'Status',
      statusFail: 'Failed',
      errorAuth: 'Login failed',
      errorGeneral: 'Error'
    },
    es: {
      title: 'Probar: Listar Criptomonedas de Retiro',
      step1: '1. Sus Credenciales',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'correo@...',
      pwdLabel: 'Contraseña',
      btnExecute: 'Listar Criptos Disponibles',
      btnLoading: 'Cargando...',
      status: 'Estado',
      statusFail: 'Fallo',
      errorAuth: 'Autenticación fallida',
      errorGeneral: 'Error'
    }
  };

  const t = i18n[currentLocale] || i18n.en;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleList = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);

    try {
      const baseUrl = 'https://api.xgateglobal.com';
      
      const authResponse = await fetch(`${baseUrl}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const authData = await authResponse.json();

      if (!authResponse.ok || !authData.token) {
        throw new Error(`${t.errorAuth}: ${authData.message}`);
      }

      const response = await fetch(`${baseUrl}/withdraw/company/cryptocurrencies`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authData.token}`
        }
      });

      const data = await response.json();
      setResultado({ status: response.status, body: data });

    } catch (error) {
      setResultado({ erro: t.errorGeneral, detalhe: error.message });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px', borderRadius: 'var(--ifm-global-radius)', border: '1px solid var(--ifm-color-emphasis-300)', backgroundColor: 'var(--ifm-background-surface-color)', color: 'var(--ifm-font-color-base)', fontSize: '0.9rem' };
  const toggleButtonStyle = { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--ifm-font-color-secondary)', zIndex: 2, display: 'flex', alignItems: 'center' };

  return (
    <div style={{ padding: '20px', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 'var(--ifm-global-radius)', backgroundColor: 'var(--ifm-card-background-color)', boxShadow: 'var(--ifm-global-shadow-lw)', marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>🪙</span>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
      </div>

      <form onSubmit={handleList}>
        <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step1}</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.emailLabel}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder={t.emailPlaceholder} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.pwdLabel}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '45px' }}
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={toggleButtonStyle}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="button button--primary button--block">
          {loading ? t.btnLoading : t.btnExecute}
        </button>
      </form>

      {resultado && (
        <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <strong>{t.status}:&nbsp;</strong>
            {resultado.erro ? (
              <span style={{ fontWeight: 'bold', color: 'var(--ifm-color-danger)' }}>{t.statusFail}</span>
            ) : (
              <span style={{ fontWeight: 'bold', color: 'var(--ifm-color-success)' }}>{resultado.status} OK</span>
            )}
          </div>

          <CodeBlock language="json">
            {JSON.stringify(resultado.body || resultado, null, 2)}
          </CodeBlock>
        </div>
      )}
    </div>
  );
}
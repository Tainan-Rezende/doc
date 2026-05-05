import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function ListWithdrawCurrenciesTester() {
  const { i18n: { currentLocale } } = useDocusaurusContext();

  const i18n = {
    'pt-br': {
      title: "Testar: Listar Moedas (Saque)", // Removido o emoji daqui para evitar duplicidade
      step1: "1. Suas Credenciais",
      emailLabel: "Email",
      emailPh: "email@...",
      pwdLabel: "Senha",
      pwdPh: "••••••",
      btnLoading: "Carregando...",
      btnSubmit: "Listar Moedas de Saque", // Ajustado para bater com o print
      statusLabel: "Status:",
      statusFail: "Falha",
      statusOk: "OK",
      errAuth: "Login falhou",
      errDefault: "Erro"
    },
    en: {
      title: "Test: List Currencies (Withdraw)",
      step1: "1. Your Credentials",
      emailLabel: "Email",
      emailPh: "email@...",
      pwdLabel: "Password",
      pwdPh: "••••••",
      btnLoading: "Loading...",
      btnSubmit: "List Withdrawal Currencies",
      statusLabel: "Status:",
      statusFail: "Failed",
      statusOk: "OK",
      errAuth: "Login failed",
      errDefault: "Error"
    },
    es: {
      title: "Probar: Listar Monedas (Retiro)",
      step1: "1. Sus Credenciales",
      emailLabel: "Correo electrónico",
      emailPh: "correo@...",
      pwdLabel: "Contraseña",
      pwdPh: "••••••",
      btnLoading: "Cargando...",
      btnSubmit: "Listar Monedas de Retiro",
      statusLabel: "Estado:",
      statusFail: "Fallo",
      statusOk: "OK",
      errAuth: "Inicio de sesión fallido",
      errDefault: "Error"
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
        throw new Error(`${t.errAuth}: ${authData.message}`);
      }

      const response = await fetch(`${baseUrl}/withdraw/company/currencies`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authData.token}`
        }
      });

      const data = await response.json();
      setResultado({ status: response.status, body: data });

    } catch (error) {
      setResultado({ erro: t.errDefault, detalhe: error.message });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px', borderRadius: 'var(--ifm-global-radius)', border: '1px solid var(--ifm-color-emphasis-300)', backgroundColor: 'var(--ifm-background-surface-color)', color: 'var(--ifm-font-color-base)', fontSize: '0.9rem' };
  const toggleButtonStyle = { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--ifm-font-color-secondary)', zIndex: 2, display: 'flex', alignItems: 'center' };

  return (
    <div style={{ padding: '20px', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 'var(--ifm-global-radius)', backgroundColor: 'var(--ifm-card-background-color)', boxShadow: 'var(--ifm-global-shadow-lw)', marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px' }}>
        {/* Se o emoji estiver duplicando, ele provavelmente está vindo de um ícone inserido aqui ou via CSS no h3 */}
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
      </div>

      <form onSubmit={handleList}>
        <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step1}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.emailLabel}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder={t.emailPh} />
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
                placeholder={t.pwdPh}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleButtonStyle}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        </div>
        <button type="submit" disabled={loading} className="button button--primary button--block">
          {loading ? t.btnLoading : t.btnSubmit}
        </button>
      </form>

      {resultado && (
        <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <strong>{t.statusLabel}&nbsp;</strong>
            <span style={{ fontWeight: 'bold', color: resultado.erro ? 'var(--ifm-color-danger)' : 'var(--ifm-color-success)' }}>
              {resultado.erro ? t.statusFail : `${resultado.status} ${t.statusOk}`}
            </span>
          </div>
          <CodeBlock language="json">{JSON.stringify(resultado.body || resultado, null, 2)}</CodeBlock>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function ListWithdrawCurrenciesTester() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n.currentLocale;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      title: "💸 Test: List Currencies (Withdrawal)",
      emailPh: "email@...",
      pwdPh: "••••••",
      hidePwd: "Hide password",
      showPwd: "Show password",
      btnLoading: "Loading...",
      btnSubmit: "List Withdrawal Currencies",
      statusLabel: "Status:",
      statusFail: "Failed",
      statusOk: "OK",
      errAuth: "Login failed",
      errDefault: "Error"
    },
    es: {
      title: "💸 Probar: Listar Monedas (Retiro)",
      emailPh: "correo@...",
      pwdPh: "••••••",
      hidePwd: "Ocultar contraseña",
      showPwd: "Mostrar contraseña",
      btnLoading: "Cargando...",
      btnSubmit: "Listar Monedas de Retiro",
      statusLabel: "Estado:",
      statusFail: "Fallo",
      statusOk: "OK",
      errAuth: "Inicio de sesión fallido",
      errDefault: "Error"
    },
    pt: {
      title: "💸 Testar: Listar Moedas (Saque)",
      emailPh: "email@...",
      pwdPh: "••••••",
      hidePwd: "Ocultar senha",
      showPwd: "Mostrar senha",
      btnLoading: "Carregando...",
      btnSubmit: "Listar Moedas de Saque",
      statusLabel: "Status:",
      statusFail: "Falha",
      statusOk: "OK",
      errAuth: "Login falhou",
      errDefault: "Erro"
    }
  };

  const t = translations[locale] || translations.pt;

  const handleList = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);

    try {
      const authResponse = await fetch('https://api.xgateglobal.com/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const authData = await authResponse.json();

      if (!authResponse.ok || !authData.token) {
        throw new Error(`${t.errAuth}: ${authData.message}`);
      }

      const response = await fetch('https://api.xgateglobal.com/withdraw/company/currencies', {
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

  const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: 'var(--ifm-global-radius)',
    border: '1px solid var(--ifm-color-emphasis-300)',
    backgroundColor: 'var(--ifm-background-surface-color)',
    color: 'var(--ifm-font-color-base)',
  };

  const toggleButtonStyle = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    padding: '0',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <div style={{
      padding: '20px',
      border: '1px solid var(--ifm-color-emphasis-200)',
      borderRadius: 'var(--ifm-global-radius)',
      backgroundColor: 'var(--ifm-card-background-color)',
      marginTop: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>💸</span>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
      </div>

      <form onSubmit={handleList} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder={t.emailPh} />
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: '40px' }}
              placeholder={t.pwdPh}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={toggleButtonStyle}
              title={showPassword ? t.hidePwd : t.showPwd}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
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
            {resultado.erro ? (
              <span style={{ fontWeight: 'bold', color: 'var(--ifm-color-danger)' }}>{t.statusFail}</span>
            ) : (
              <span style={{ fontWeight: 'bold', color: 'var(--ifm-color-success)' }}>{resultado.status} {t.statusOk}</span>
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
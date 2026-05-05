import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function ConsultCustomerTester() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n.currentLocale;

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [customerId, setCustomerId] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [etapa, setEtapa] = useState('');

  const translations = {
    en: {
      title: "Test: Consult Customer",
      valTitle: "Validation Error",
      valMsg: "Customer ID is required.",
      stepAuth: "Authenticating...",
      stepQuery: "Querying Customer...",
      errAuth: "Login failed: Check credentials",
      errExec: "Execution Error",
      secAdmin: "1. Your Credentials",
      adminEmailLbl: "Your Email",
      adminPwdLbl: "Your Password",
      hidePwd: "Hide password",
      showPwd: "Show password",
      secData: "2. Query Data",
      customerIdLbl: "Customer ID (_id)",
      noClient: "Don't have a client?",
      createClient: "Click here to create",
      btnSubmit: "Consult Customer",
      resultLbl: "Result:",
      resultErr: "Error"
    },
    es: {
      title: "Probar: Consultar Cliente",
      valTitle: "Error de Validación",
      valMsg: "El ID del Cliente es obligatorio.",
      stepAuth: "Autenticando...",
      stepQuery: "Consultando Cliente...",
      errAuth: "Fallo en el inicio de sesión: Verifique credenciales",
      errExec: "Error de ejecución",
      secAdmin: "1. Tus Credenciales (Admin)",
      adminEmailLbl: "Tu Correo",
      adminPwdLbl: "Tu Contraseña",
      hidePwd: "Ocultar contraseña",
      showPwd: "Mostrar contraseña",
      secData: "2. Datos de Consulta",
      customerIdLbl: "ID de Cliente (_id)",
      noClient: "¿No tienes un cliente?",
      createClient: "Haz clic aquí para crear",
      btnSubmit: "Consultar Cliente",
      resultLbl: "Resultado:",
      resultErr: "Error"
    },
    pt: {
      title: "Testar: Consultar Cliente",
      valTitle: "Validação",
      valMsg: "O ID do Cliente é obrigatório.",
      stepAuth: "Autenticando...",
      stepQuery: "Consultando Cliente...",
      errAuth: "Falha no Login: Verifique credenciais",
      errExec: "Erro na execução",
      secAdmin: "1. Suas Credenciais",
      adminEmailLbl: "Seu Email",
      adminPwdLbl: "Sua Senha",
      hidePwd: "Ocultar senha",
      showPwd: "Mostrar senha",
      secData: "2. Dados da Consulta",
      customerIdLbl: "ID do Cliente (_id)",
      noClient: "Não possui cliente?",
      createClient: "Clique aqui para criar",
      btnSubmit: "Consultar Cliente",
      resultLbl: "Resultado:",
      resultErr: "Erro"
    }
  };

  const t = translations[locale] || translations.pt;

  const handleConsultCustomer = async (e) => {
    e.preventDefault();

    if (!customerId.trim()) {
      setResultado({
        erro: t.valTitle,
        detalhe: t.valMsg
      });
      return;
    }

    setLoading(true);
    setResultado(null);
    setEtapa(t.stepAuth);

    try {
      const authResponse = await fetch('https://api.xgateglobal.com/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const authData = await authResponse.json();

      if (!authResponse.ok || !authData.token) {
        throw new Error(t.errAuth);
      }

      setEtapa(t.stepQuery);

      const consultResponse = await fetch(`https://api.xgateglobal.com/customer/${customerId.trim()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authData.token}`
        }
      });

      const consultData = await consultResponse.json();
      setResultado({ status: consultResponse.status, body: consultData });

    } catch (error) {
      setResultado({ erro: t.errExec, detalhe: error.message });
    } finally {
      setLoading(false);
      setEtapa('');
    }
  };

  const inputStyle = { width: '100%', padding: '10px', borderRadius: 'var(--ifm-global-radius)', border: '1px solid var(--ifm-color-emphasis-300)', backgroundColor: 'var(--ifm-background-surface-color)', color: 'var(--ifm-font-color-base)', fontSize: '0.9rem' };
  const toggleButtonStyle = { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--ifm-font-color-secondary)', padding: '5px', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' };

  return (
    <div style={{ padding: '20px', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 'var(--ifm-global-radius)', backgroundColor: 'var(--ifm-card-background-color)', boxShadow: 'var(--ifm-global-shadow-lw)', marginTop: '20px' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px' }}>
        <span style={{ fontSize: '1.5rem' }}>🔍</span>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
      </div>

      <form onSubmit={handleConsultCustomer}>
        <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
          {t.secAdmin}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.adminEmailLbl}</label>
            <input type="email" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)} style={inputStyle} placeholder="admin@xgate..." />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.adminPwdLbl}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '45px' }}
                placeholder="••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleButtonStyle} title={showPassword ? t.hidePwd : t.showPwd}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        </div>

        <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

        <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
          {t.secData}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem' }}>
            {t.customerIdLbl}
          </label>
          <input type="text" required value={customerId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} placeholder="Ex: 697e15d..." />

          <div style={{ marginTop: '5px', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' }}>
            {t.noClient}{' '}
            <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
              {t.createClient}
            </a>
          </div>
        </div>

        <button type="submit" disabled={loading} className="button button--primary button--block">
          {loading ? etapa : t.btnSubmit}
        </button>
      </form>

      {resultado && (
        <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <strong>{t.resultLbl}</strong>
            <span style={{ fontWeight: 'bold', color: resultado.status >= 200 && resultado.status < 300 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)' }}>
              {resultado.status ? `${resultado.status} ${resultado.status === 200 ? 'OK' : ''}` : t.resultErr}
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
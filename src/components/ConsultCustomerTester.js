import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'; // 1. Importamos o hook do Docusaurus

export default function ConsultCustomerTester() {
  // 2. Descobrimos qual o idioma atual do site (ex: 'pt', 'en', 'es')
  const { i18n } = useDocusaurusContext();
  const isEn = i18n.currentLocale === 'en'; // Variável mágica que diz se é inglês

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [customerId, setCustomerId] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [etapa, setEtapa] = useState('');

  const handleConsultCustomer = async (e) => {
    e.preventDefault();
    
    if (!customerId.trim()) {
      setResultado({ 
        erro: isEn ? 'Validation Error' : 'Validação', 
        detalhe: isEn ? 'Customer ID is required.' : 'O ID do Cliente é obrigatório.' 
      });
      return;
    }

    setLoading(true);
    setResultado(null);
    setEtapa(isEn ? 'Authenticating...' : 'Autenticando...');

    try {
      const authResponse = await fetch('https://api.xgateglobal.com/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const authData = await authResponse.json();

      if (!authResponse.ok || !authData.token) {
        throw new Error(isEn ? 'Login failed: Check credentials' : 'Falha no Login: Verifique credenciais');
      }

      setEtapa(isEn ? 'Querying Customer...' : 'Consultando Cliente...');

      const consultResponse = await fetch(`https://api.xgateglobal.com/customer/${customerId.trim()}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${authData.token}`
        }
      });

      const consultData = await consultResponse.json();
      setResultado({ status: consultResponse.status, body: consultData });

    } catch (error) {
      setResultado({ erro: isEn ? 'Execution Error' : 'Erro na execução', detalhe: error.message });
    } finally {
      setLoading(false);
      setEtapa('');
    }
  };

  // ... (Estilos continuam iguais)
  const inputStyle = { width: '100%', padding: '10px', borderRadius: 'var(--ifm-global-radius)', border: '1px solid var(--ifm-color-emphasis-300)', backgroundColor: 'var(--ifm-background-surface-color)', color: 'var(--ifm-font-color-base)', fontSize: '0.9rem' };
  const toggleButtonStyle = { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--ifm-font-color-secondary)', padding: '5px', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' };

  return (
    <div style={{ padding: '20px', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 'var(--ifm-global-radius)', backgroundColor: 'var(--ifm-card-background-color)', boxShadow: 'var(--ifm-global-shadow-lw)', marginTop: '20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px' }}>
        <span style={{ fontSize: '1.5rem' }}>🔍</span>
        {/* Usamos o isEn ? 'Texto Inglês' : 'Texto Português' */}
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{isEn ? 'Test: Consult Customer' : 'Testar: Consultar Cliente'}</h3>
      </div>

      <form onSubmit={handleConsultCustomer}>
        <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
          {isEn ? '1. Your Credentials (Admin)' : '1. Suas Credenciais (Admin)'}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{isEn ? 'Your Email' : 'Seu Email'}</label>
                <input type="email" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)} style={inputStyle} placeholder="admin@xgate..." />
            </div>
            <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{isEn ? 'Your Password' : 'Sua Senha'}</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={adminPassword}
                        onChange={e => setAdminPassword(e.target.value)}
                        style={{ ...inputStyle, paddingRight: '45px' }}
                        placeholder="••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleButtonStyle} title={showPassword ? (isEn ? "Hide password" : "Ocultar senha") : (isEn ? "Show password" : "Mostrar senha")}>
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                </div>
            </div>
        </div>

        <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

        <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
          {isEn ? '2. Query Data' : '2. Dados da Consulta'}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem' }}>
              {isEn ? 'Customer ID (_id)' : 'ID do Cliente (_id)'}
            </label>
            <input type="text" required value={customerId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} placeholder="Ex: 697e15d..." />
        </div>

        <button type="submit" disabled={loading} className="button button--primary button--block">
          {loading ? etapa : (isEn ? 'Consult Customer' : 'Consultar Cliente')}
        </button>
      </form>

      {resultado && (
        <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <strong>{isEn ? 'Result:' : 'Resultado:'}</strong>
            <span style={{ fontWeight: 'bold', color: resultado.status >= 200 && resultado.status < 300 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)' }}>
              {resultado.status ? `${resultado.status} ${resultado.status === 200 ? 'OK' : ''}` : (isEn ? 'Error' : 'Erro')}
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
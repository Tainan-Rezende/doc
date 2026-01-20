import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';

export default function ListWithdrawCurrenciesTester() {
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
      const authResponse = await fetch('https://api.xgateglobal.com/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const authData = await authResponse.json();

      if (!authResponse.ok || !authData.token) {
        throw new Error(`Login falhou: ${authData.message}`);
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
      setResultado({ erro: 'Erro', detalhe: error.message });
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
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Testar: Listar Moedas (Saque)</h3>
      </div>

      <form onSubmit={handleList} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="email@..." />
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: '40px' }}
              placeholder="••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={toggleButtonStyle}
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="button button--primary button--block">
          {loading ? 'Carregando...' : 'Listar Moedas de Saque'}
        </button>
      </form>

      {resultado && (
        <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <strong>Status:&nbsp;</strong>
            {resultado.erro ? (
              <span style={{ fontWeight: 'bold', color: 'var(--ifm-color-danger)' }}>Falha</span>
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
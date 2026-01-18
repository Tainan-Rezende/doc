import React, { useState } from 'react';

export default function AuthTester() {
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
      setResultado({ erro: 'Erro na conexão', detalhe: error.message });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: 'var(--ifm-global-radius)',
    border: '1px solid var(--ifm-color-emphasis-300)',
    backgroundColor: 'var(--ifm-background-surface-color)',
    color: 'var(--ifm-font-color-base)',
    fontSize: '0.9rem'
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
    color: 'var(--ifm-font-color-secondary)',
    padding: '5px',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={{
      padding: '20px',
      border: '1px solid var(--ifm-color-emphasis-200)',
      borderRadius: 'var(--ifm-global-radius)',
      backgroundColor: 'var(--ifm-card-background-color)',
      boxShadow: 'var(--ifm-global-shadow-lw)',
      marginTop: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px' }}>
        <span style={{ fontSize: '1.5rem' }}>🔐</span>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Testar: Autenticação</h3>
      </div>

      <form onSubmit={handleLogin}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem' }}>Email</label>
          <input
            type="email"
            required
            value={email}
            placeholder="seu@email.com"
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem' }}>Senha</label>
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...inputStyle, paddingRight: '45px' }} 
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

        <button
          type="submit"
          disabled={loading}
          className="button button--primary button--block"
          style={{ marginBottom: '10px' }}
        >
          {loading ? 'Autenticando...' : 'Obter Token'}
        </button>
      </form>

      {resultado && (
        <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <strong>Status:&nbsp;</strong>
            <span style={{ 
              fontWeight: 'bold', 
              color: resultado.status >= 200 && resultado.status < 300 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)' 
            }}>
              {resultado.status || 'Erro'}
            </span>
          </div>
          
          <div style={{
            position: 'relative',
            backgroundColor: 'var(--ifm-pre-background)',
            borderRadius: 'var(--ifm-global-radius)',
            padding: '10px',
            border: '1px solid var(--ifm-color-emphasis-200)',
            overflowX: 'auto',
            maxHeight: '300px',
          }}>
            <pre style={{ margin: 0, background: 'transparent', fontSize: '0.75rem' }}>
              {JSON.stringify(resultado.body || resultado, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
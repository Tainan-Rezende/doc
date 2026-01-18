import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';

export default function CreateCustomerTester() {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [customerName, setCustomerName] = useState('');
  const [customerDoc, setCustomerDoc] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [etapa, setEtapa] = useState('');

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);
    setEtapa('Autenticando...');

    try {
      const authResponse = await fetch('https://api.xgateglobal.com/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const authData = await authResponse.json();

      if (!authResponse.ok || !authData.token) {
        throw new Error(`Falha no Login: ${authData.message || 'Verifique credenciais'}`);
      }

      setEtapa('Criando Cliente...');

      const createResponse = await fetch('https://api.xgateglobal.com/customer', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`
        },
        body: JSON.stringify({
          name: customerName,
          document: customerDoc,
          email: customerEmail
        })
      });

      const createData = await createResponse.json();
      setResultado({ status: createResponse.status, body: createData });

    } catch (error) {
      setResultado({ erro: 'Erro na execução', detalhe: error.message });
    } finally {
      setLoading(false);
      setEtapa('');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: 'var(--ifm-global-radius)',
    border: '1px solid var(--ifm-color-emphasis-300)',
    backgroundColor: 'var(--ifm-background-surface-color)',
    color: 'var(--ifm-font-color-base)',
    fontSize: '0.9rem',
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
        <span style={{ fontSize: '1.5rem' }}>👤</span>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Testar: Criar Novo Cliente</h3>
      </div>

      <form onSubmit={handleCreateCustomer}>
        <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>1. Suas Credenciais (Admin)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Seu Email</label>
                <input type="email" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)} style={inputStyle} placeholder="admin@xgate..." />
            </div>
            <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Sua Senha</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={adminPassword}
                        onChange={e => setAdminPassword(e.target.value)}
                        style={{ ...inputStyle, paddingRight: '45px' }}
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
        </div>

        <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

        <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>2. Dados do Novo Cliente</div>
        
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem' }}>Nome Completo</label>
            <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} style={inputStyle} placeholder="Ex: João da Silva" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Documento (CPF/CNPJ)</label>
                <input type="text" required value={customerDoc} onChange={e => setCustomerDoc(e.target.value)} style={inputStyle} placeholder="12345678900" />
            </div>
            <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Email do Cliente</label>
                <input type="email" required value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} style={inputStyle} placeholder="cliente@email.com" />
            </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="button button--primary button--block"
        >
          {loading ? etapa : 'Criar Cliente'}
        </button>
      </form>

      {resultado && (
        <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <strong>Resultado:</strong>
            <span style={{ 
              fontWeight: 'bold', 
              color: resultado.status >= 200 && resultado.status < 300 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)' 
            }}>
              {resultado.status ? `${resultado.status} ${resultado.status === 201 ? 'Created' : ''}` : 'Erro'}
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
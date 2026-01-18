import React, { useState } from 'react';

export default function ApiTester() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const fazerRequisicao = async () => {
    setLoading(true);
    setResultado(null);

    try {
      // Exemplo de requisição real (substitua pela URL da XGate)
      const response = await fetch('https://api.xgateglobal.com/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();
      setResultado(data);
    } catch (error) {
      setResultado({ erro: 'Falha na requisição', detalhe: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '20px', backgroundColor: '#f9f9f9' }}>
      <h4>⚡ Testar Integração</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block' }}>E-mail:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="form-control" // Se estiver usando classes do bootstrap ou docusaurus
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        
        <label style={{ display: 'block' }}>Senha:</label>
        <input 
          type="password" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <button 
        onClick={fazerRequisicao} 
        disabled={loading}
        style={{ 
          backgroundColor: '#25c2a0', color: 'white', padding: '10px 20px', 
          border: 'none', borderRadius: '4px', cursor: 'pointer' 
        }}
      >
        {loading ? 'Enviando...' : 'Enviar Requisição'}
      </button>

      {resultado && (
        <div style={{ marginTop: '20px' }}>
          <strong>Resposta da API:</strong>
          <pre style={{ background: '#333', color: '#fff', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(resultado, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
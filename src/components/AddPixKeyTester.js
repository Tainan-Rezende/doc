import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';

export default function AddPixKeyTester() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [clientId, setClientId] = useState('');

    const [pixKey, setPixKey] = useState('');
    const [keyType, setKeyType] = useState('EMAIL');

    const [showPassword, setShowPassword] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState('');

    const handleAddKey = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResultado(null);
        setEtapa('Autenticando...');

        try {
            const authResponse = await fetch('https://api.xgateglobal.com/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const authData = await authResponse.json();

            if (!authResponse.ok || !authData.token) {
                throw new Error(`Falha no Login: ${authData.message || 'Verifique credenciais'}`);
            }

            setEtapa('Cadastrando Chave...');

            const createResponse = await fetch(`https://api.xgateglobal.com/pix/customer/${clientId}/key`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    key: pixKey,
                    type: keyType
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
                <span style={{ fontSize: '1.5rem' }}>➕</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Testar: Adicionar Chave</h3>
            </div>

            <form onSubmit={handleAddKey}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Email</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="email@..." />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Senha</label>
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
                                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>ID Cliente</label>
                    <input type="text" required value={clientId} onChange={e => setClientId(e.target.value)} style={inputStyle} placeholder="66e8..." />
                </div>
                <div style={{ marginTop: '-10px', marginBottom: '15px', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' }}>
                    Não possui cliente?{' '}
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                    >
                        Clique aqui para criar
                    </a>.
                </div>

                <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem' }}>Tipo da Chave</label>
                    <select
                        value={keyType}
                        onChange={(e) => setKeyType(e.target.value)}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                        <option value="EMAIL">E-mail</option>
                        <option value="CPF">CPF</option>
                        <option value="CNPJ">CNPJ</option>
                        <option value="PHONE">Telefone</option>
                        <option value="RANDOM">Chave Aleatória</option>
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem' }}>Valor da Chave</label>
                    <input
                        type="text"
                        required
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        style={inputStyle}
                        placeholder={keyType === 'PHONE' ? '+5511999999999' : 'Digite a chave...'}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="button button--primary button--block"
                >
                    {loading ? etapa : 'Cadastrar Chave Pix'}
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
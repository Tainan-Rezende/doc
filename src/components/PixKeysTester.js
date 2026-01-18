import React, { useState } from 'react';

export default function PixKeysTester() {
    // Estados para os inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [clientId, setClientId] = useState('');

    // Controle de visualização
    const [showPassword, setShowPassword] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState(''); // Para mostrar ao usuário o que está acontecendo

    const handleFullTest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResultado(null);
        setEtapa('Autenticando...');

        try {
            // --- PASSO 1: AUTENTICAÇÃO ---
            const authResponse = await fetch('https://api.xgateglobal.com/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const authData = await authResponse.json();

            if (!authResponse.ok || !authData.token) {
                throw new Error(`Falha no Login (${authResponse.status}): ${authData.message || 'Verifique suas credenciais'}`);
            }

            const token = authData.token;
            setEtapa('Buscando Chaves...');

            // --- PASSO 2: BUSCAR CHAVES DO CLIENTE ---
            // Nota: Ajustei a URL conforme seu pedido: /pix/customer/CLIENT_ID/key
            const keysResponse = await fetch(`https://api.xgateglobal.com/pix/customer/${clientId}/key`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const keysData = await keysResponse.json();
            setResultado({ status: keysResponse.status, body: keysData });

        } catch (error) {
            setResultado({ erro: 'Erro na execução', detalhe: error.message });
        } finally {
            setLoading(false);
            setEtapa('');
        }
    };

    // Estilos (idênticos ao AuthTester para manter padrão)
    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: 'var(--ifm-global-radius)',
        border: '1px solid var(--ifm-color-emphasis-300)',
        backgroundColor: 'var(--ifm-background-surface-color)',
        color: 'var(--ifm-font-color-base)',
        fontSize: '0.9rem',
        // marginBottom removido, controlado pela div wrapper
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
                <span style={{ fontSize: '1.5rem' }}>🚀</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Testar: Listar chaves pix</h3>
            </div>

            <form onSubmit={handleFullTest}>
                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem' }}>Email</label>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="email"
                            required
                            value={email}
                            placeholder="seu@email.com"
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
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

                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem' }}>ID do Cliente (Client ID)</label>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="text"
                            required
                            value={clientId}
                            placeholder="Ex: 66e85..."
                            onChange={(e) => setClientId(e.target.value)}
                            style={inputStyle}
                        />
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
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="button button--primary button--block"
                    style={{ marginBottom: '10px' }}
                >
                    {loading ? etapa : 'Autenticar e Listar Chaves'}
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

                    {resultado.erro && (
                        <div style={{ color: 'var(--ifm-color-danger)', fontSize: '0.9rem', marginBottom: '10px' }}>
                            <strong>Erro:</strong> {resultado.detalhe}
                        </div>
                    )}

                    <div style={{
                        position: 'relative',
                        backgroundColor: 'var(--ifm-pre-background)',
                        borderRadius: 'var(--ifm-global-radius)',
                        padding: '10px',
                        border: '1px solid var(--ifm-color-emphasis-200)',
                        overflowX: 'auto',
                        maxHeight: '400px',
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
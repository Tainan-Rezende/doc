import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function WithdrawFiatToCryptoTester() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [amount, setAmount] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState('');

    const getStatusText = (code) => {
        const codes = {
            200: 'OK',
            201: 'Created',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            500: 'Internal Server Error',
        };
        return codes[code] || 'Unknown';
    };

    const handleCreateWithdraw = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResultado(null);

        try {
            const baseUrl = 'https://api.xgateglobal.com';
            
            setEtapa('Autenticando...');
            const authRes = await fetch(`${baseUrl}/auth/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const authData = await authRes.json();
            if (!authRes.ok) {
                setResultado({ status: authRes.status, body: authData });
                return;
            }
            const token = authData.token;

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            setEtapa('Buscando Cripto...');
            const cryptoRes = await fetch(`${baseUrl}/withdraw/company/cryptocurrencies`, { headers });
            const cryptoData = await cryptoRes.json();
            if (!cryptoRes.ok) {
                setResultado({ status: cryptoRes.status, body: cryptoData });
                return;
            }

            setEtapa('Buscando Moedas...');
            const currencyRes = await fetch(`${baseUrl}/withdraw/company/currencies`, { headers });
            const currencyData = await currencyRes.json();
            if (!currencyRes.ok) {
                setResultado({ status: currencyRes.status, body: currencyData });
                return;
            }

            setEtapa('Buscando Chave PIX...');
            const pixRes = await fetch(`${baseUrl}/pix/customer/${customerId}/key`, { headers });
            const pixData = await pixRes.json();
            if (!pixRes.ok) {
                setResultado({ status: pixRes.status, body: pixData });
                return;
            }

            setEtapa('Criando Saque...');
            const finalRes = await fetch(`${baseUrl}/withdraw`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    amount: Number(amount),
                    customerId: customerId,
                    currency: currencyData[0],
                    cryptocurrency: cryptoData[0],
                    pixKey: pixData[0]
                })
            });

            const finalData = await finalRes.json();
            setResultado({ status: finalRes.status, body: finalData });

        } catch (error) {
            setResultado({ erro: 'Erro de Rede', detalhe: error.message });
        } finally {
            setLoading(false);
            setEtapa('');
        }
    };

    const inputStyle = {
        width: '100%', padding: '10px', borderRadius: 'var(--ifm-global-radius)',
        border: '1px solid var(--ifm-color-emphasis-300)', backgroundColor: 'var(--ifm-background-surface-color)',
        color: 'var(--ifm-font-color-base)', fontSize: '0.9rem',
    };

    const toggleButtonStyle = {
        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem',
        color: 'var(--ifm-font-color-secondary)', zIndex: 2, display: 'flex', alignItems: 'center'
    };

    return (
        <div style={{
            padding: '20px', border: '1px solid var(--ifm-color-emphasis-200)',
            borderRadius: 'var(--ifm-global-radius)', backgroundColor: 'var(--ifm-card-background-color)',
            boxShadow: 'var(--ifm-global-shadow-lw)', marginTop: '20px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>🔄</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Testar: Saque Fiat para Crypto</h3>
            </div>

            <form onSubmit={handleCreateWithdraw}>
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
                                required value={password} onChange={e => setPassword(e.target.value)}
                                style={{ ...inputStyle, paddingRight: '45px' }} placeholder="••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleButtonStyle}>
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>ID do Cliente (Customer ID)</label>
                    <input type="text" required value={customerId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} placeholder="Ex: 66e85..." />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Valor do Saque (Amount) em USDT</label>
                    <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} placeholder="0.1" />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="button button--primary button--block"
                    style={{ marginBottom: '10px' }}
                >
                    {loading ? etapa : 'Executar Saque Crypto para FIAT'}
                </button>
            </form>

            {resultado && (
                <div style={{ marginTop: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <strong>Status:&nbsp;</strong>
                        <span style={{ 
                            fontWeight: 'bold', 
                            color: resultado.status >= 200 && resultado.status < 300 
                                ? 'var(--ifm-color-success)' 
                                : 'var(--ifm-color-danger)' 
                        }}>
                            {resultado.status ? `${resultado.status} ${getStatusText(resultado.status)}` : 'Erro de Rede'}
                        </span>
                    </div>
                    
                    {resultado.erro && (
                        <div style={{ color: 'var(--ifm-color-danger)', fontSize: '0.9rem', marginBottom: '10px' }}>
                            <strong>Detalhe:</strong> {resultado.detalhe}
                        </div>
                    )}

                    <CodeBlock language="json">
                        {JSON.stringify(resultado.body || resultado, null, 2)}
                    </CodeBlock>
                </div>
            )}
        </div>
    );
}
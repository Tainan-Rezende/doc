import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function CreatePixWithdrawTester() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [customerId, setCustomerId] = useState('');
    const [amount, setAmount] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState('');

    const handleCreateWithdraw = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResultado(null);
        setEtapa('Autenticando...');

        try {
            // 1. LOGIN
            const authResponse = await fetch('https://api.xgateglobal.com/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const authData = await authResponse.json();

            if (!authResponse.ok || !authData.token) {
                throw new Error(`Falha no Login (${authResponse.status}): ${authData.message || 'Verifique credenciais'}`);
            }

            const token = authData.token.trim();

            // 2. BUSCAR MOEDA DE SAQUE (WITHDRAW CURRENCY)
            setEtapa('Buscando Moeda...');
            
            const currencyResponse = await fetch('https://api.xgateglobal.com/withdraw/company/currencies', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const currencyList = await currencyResponse.json();
            if (!currencyResponse.ok || !Array.isArray(currencyList) || currencyList.length === 0) {
                 throw new Error(`Erro ao buscar moedas de saque: ${currencyList.message || 'Lista vazia'}`);
            }
            const selectedCurrency = currencyList[0];

            setEtapa('Buscando Chave Pix...');

            const keysResponse = await fetch(`https://api.xgateglobal.com/pix/customer/${customerId}/key`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const keysList = await keysResponse.json();
            if (!keysResponse.ok || !Array.isArray(keysList) || keysList.length === 0) {
                throw new Error(`Erro: O cliente ${customerId} não possui chaves Pix cadastradas para receber o saque.`);
            }
            const selectedPixKey = keysList[0];

            setEtapa('Solicitando Saque...');

            const withdrawResponse = await fetch('https://api.xgateglobal.com/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: Number(amount),
                    customerId: customerId,
                    currency: selectedCurrency,
                    pixKey: selectedPixKey
                })
            });

            const withdrawData = await withdrawResponse.json();
            setResultado({ status: withdrawResponse.status, body: withdrawData });

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
                <span style={{ fontSize: '1.5rem' }}>💸</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Testar: Criar Pedido de Saque</h3>
            </div>

            <form onSubmit={handleCreateWithdraw}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Email</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="user@..." />
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

                <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>ID do Cliente (Client ID)</label>
                    <input type="text" required value={customerId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} placeholder="Ex: 66e85..." />
                    <div style={{ marginTop: '5px', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' }}>
                        <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                            Criar cliente novo
                        </a>
                    </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Valor do Saque (Amount)</label>
                    <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} placeholder="50.00" />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="button button--primary button--block"
                    style={{ marginBottom: '10px' }}
                >
                    {loading ? etapa : 'Solicitar Saque'}
                </button>
            </form>

            {resultado && (
                <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <strong>Status:&nbsp;</strong>
                        {resultado.erro ? (
                            <span style={{ fontWeight: 'bold', color: 'var(--ifm-color-danger)' }}>Falha</span>
                        ) : (
                            <span style={{ fontWeight: 'bold', color: 'var(--ifm-color-success)' }}>{resultado.status} Created</span>
                        )}
                    </div>
                    
                    {resultado.erro && (
                        <div style={{ color: 'var(--ifm-color-danger)', fontSize: '0.9rem', marginBottom: '10px' }}>
                            <strong>Erro:</strong> {resultado.detalhe}
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
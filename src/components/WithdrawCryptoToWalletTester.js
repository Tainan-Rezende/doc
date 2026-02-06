import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';

export default function WithdrawCryptoToWalletTester() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [amount, setAmount] = useState('');
    const [wallet, setWallet] = useState('');
    const [customerId, setCustomerId] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState('');

    const getStatusText = (code) => {
        const codes = {
            201: 'Created',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            500: 'Internal Server Error',
        };
        return codes[code] || 'Unknown';
    };

    const handleWithdraw = async (e) => {
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

            setEtapa('Buscando Redes...');
            const netRes = await fetch(`${baseUrl}/withdraw/company/blockchain-networks`, { headers });
            const netData = await netRes.json();
            if (!netRes.ok) {
                setResultado({ status: netRes.status, body: netData });
                return;
            }

            const selectedNetwork = netData[0];
            const selectedCrypto = selectedNetwork.cryptocurrencies[1].cryptocurrency;

            setEtapa('Processando Saque...');
            const finalRes = await fetch(`${baseUrl}/withdraw`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    amount: Number(amount),
                    wallet: wallet,
                    customerId: customerId,
                    cryptocurrency: selectedCrypto,
                    blockchainNetwork: selectedNetwork
                })
            });

            const finalData = await finalRes.json();
            setResultado({ status: finalRes.status, body: finalData });

        } catch (error) {
            setResultado({ erro: 'Erro de Conexão', detalhe: error.message });
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
                <span style={{ fontSize: '1.5rem' }}>🔐</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Saque para Carteira Externa</h3>
            </div>

            <form onSubmit={handleWithdraw}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Valor (Amount)</label>
                        <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} placeholder="0.1" />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Customer ID</label>
                        <input type="text" required value={customerId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} placeholder="672f..." />
                    </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Wallet de Destino (Address)</label>
                    <input type="text" required value={wallet} onChange={e => setWallet(e.target.value)} style={inputStyle} placeholder="0x..." />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="button button--primary button--block"
                    style={{ marginBottom: '10px' }}
                >
                    {loading ? etapa : 'Criar Saque Crypto'}
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
                            {resultado.status ? `${resultado.status} ${getStatusText(resultado.status)}` : 'Erro'}
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
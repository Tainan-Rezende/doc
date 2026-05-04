import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const translations = {
    pt: {
        title: 'Testar: Cotação Crypto (Carteira Externa)',
        emailLabel: 'E-mail',
        passwordLabel: 'Senha',
        amountLabel: 'Valor em Crypto (Amount)',
        buttonText: 'Calcular Recebimento',
        authStep: 'Autenticando...',
        networkStep: 'Buscando Redes...',
        calcStep: 'Calculando Taxas...',
        connError: 'Erro de Conexão',
        noNetwork: 'Nenhuma rede blockchain disponível para esta conta.',
        noCryptoConf: (net) => `A rede ${net} não possui criptomoedas configuradas.`,
        noCryptoFound: (net) => `Nenhuma criptomoeda encontrada na rede ${net}.`,
        status: 'Status:',
        error: 'Erro',
        detail: 'Detalhe:'
    },
    en: {
        title: 'Test: Crypto Quote (External Wallet)',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        amountLabel: 'Crypto Amount',
        buttonText: 'Calculate Receipt',
        authStep: 'Authenticating...',
        networkStep: 'Fetching Networks...',
        calcStep: 'Calculating Fees...',
        connError: 'Connection Error',
        noNetwork: 'No blockchain network available for this account.',
        noCryptoConf: (net) => `Network ${net} has no configured cryptocurrencies.`,
        noCryptoFound: (net) => `No cryptocurrency found on network ${net}.`,
        status: 'Status:',
        error: 'Error',
        detail: 'Detail:'
    },
    es: {
        title: 'Probar: Cotización Crypto (Billetera Externa)',
        emailLabel: 'Correo Electrónico',
        passwordLabel: 'Contraseña',
        amountLabel: 'Monto en Crypto',
        buttonText: 'Calcular Recibo',
        authStep: 'Autenticando...',
        networkStep: 'Buscando Redes...',
        calcStep: 'Calculando Tarifas...',
        connError: 'Error de Conexión',
        noNetwork: 'No hay red blockchain disponible para esta cuenta.',
        noCryptoConf: (net) => `La red ${net} no tiene criptomonedas configuradas.`,
        noCryptoFound: (net) => `No se encontró criptomoneda en la red ${net}.`,
        status: 'Estado:',
        error: 'Error',
        detail: 'Detalle:'
    }
};

export default function GetCryptoToExternalTester() {
    const { i18n } = useDocusaurusContext();
    const currentLocale = i18n?.currentLocale || 'pt';
    const t = translations[currentLocale] || translations['pt'];

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [amount, setAmount] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState('');

    const getStatusText = (code) => {
        const codes = {
            200: 'OK',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            500: 'Internal Server Error',
        };
        return codes[code] || 'Unknown';
    };

    const handleConsultation = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResultado(null);

        try {
            const baseUrl = 'https://api.xgateglobal.com';

            setEtapa(t.authStep);
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

            setEtapa(t.networkStep);
            const netRes = await fetch(`${baseUrl}/withdraw/company/blockchain-networks`, { headers });
            const netData = await netRes.json();

            if (!netRes.ok) {
                setResultado({ status: netRes.status, body: netData });
                return;
            }

            if (!Array.isArray(netData) || netData.length === 0) {
                throw new Error(t.noNetwork);
            }

            const selectedNetwork = netData[0];
            
            if (!selectedNetwork.cryptocurrencies || selectedNetwork.cryptocurrencies.length === 0) {
                 throw new Error(t.noCryptoConf(selectedNetwork.name));
            }

            // Pega a primeira criptomoeda disponível na rede (ex: USDC, USDT, etc.)
            const cryptoObj = selectedNetwork.cryptocurrencies[0];

            if (!cryptoObj || !cryptoObj.cryptocurrency) {
                throw new Error(t.noCryptoFound(selectedNetwork.name));
            }

            const selectedCrypto = cryptoObj.cryptocurrency;

            setEtapa(t.calcStep);
            const quoteRes = await fetch(`${baseUrl}/withdraw/transaction/crypto/amount`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    amount: Number(amount),
                    cryptocurrency: selectedCrypto,
                    blockchainNetwork: selectedNetwork
                })
            });

            const quoteData = await quoteRes.json();
            setResultado({ status: quoteRes.status, body: quoteData });

        } catch (error) {
            setResultado({ erro: t.connError, detalhe: error.message });
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
                <span style={{ fontSize: '1.5rem' }}>📉</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
            </div>

            <form onSubmit={handleConsultation}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.emailLabel}</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="email@..." />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.passwordLabel}</label>
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
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.amountLabel}</label>
                    <input 
                        type="number" 
                        step="0.01" 
                        required 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        style={inputStyle} 
                        placeholder="Ex: 10.00" 
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="button button--primary button--block"
                    style={{ marginBottom: '10px' }}
                >
                    {loading ? etapa : t.buttonText}
                </button>
            </form>

            {resultado && (
                <div style={{ marginTop: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <strong>{t.status}&nbsp;</strong>
                        <span style={{ 
                            fontWeight: 'bold', 
                            color: resultado.status >= 200 && resultado.status < 300 
                                ? 'var(--ifm-color-success)' 
                                : 'var(--ifm-color-danger)' 
                        }}>
                            {resultado.status ? `${resultado.status} ${getStatusText(resultado.status)}` : t.error}
                        </span>
                    </div>

                    {resultado.erro && (
                        <div style={{ color: 'var(--ifm-color-danger)', fontSize: '0.9rem', marginBottom: '10px' }}>
                            <strong>{t.detail}</strong> {resultado.detalhe}
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
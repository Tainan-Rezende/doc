import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function GetCryptoToExternalTester() {
    const { i18n: { currentLocale } } = useDocusaurusContext();

    const i18n = {
        'pt-br': {
            title: 'Testar: Cotação Crypto (Carteira Externa)',
            step1: '1. Suas Credenciais',
            step2: '2. Dados da Simulação',
            emailLabel: 'Email',
            passwordLabel: 'Senha',
            amountLabel: 'Valor em Crypto (Amount)',
            buttonText: 'Calcular Recebimento',
            status: 'Status:',
            error: 'Erro',
            detail: 'Detalhe:',
            authStep: 'Autenticando...',
            networkStep: 'Buscando Redes...',
            calcStep: 'Calculando Taxas...',
            connError: 'Erro de Conexão ou Dados Inválidos',
            noNetwork: 'Nenhuma rede blockchain disponível para esta conta.',
            noCryptoConf: (net) => `A rede ${net} não possui criptomoedas configuradas.`,
            noCryptoFound: (net) => `Nenhuma criptomoeda encontrada na rede ${net}.`,
        },
        en: {
            title: 'Test: Crypto Quote (External Wallet)',
            step1: '1. Your Credentials',
            step2: '2. Simulation Data',
            emailLabel: 'Email',
            passwordLabel: 'Password',
            amountLabel: 'Crypto Amount',
            buttonText: 'Calculate Receipt',
            status: 'Status:',
            error: 'Error',
            detail: 'Detail:',
            authStep: 'Authenticating...',
            networkStep: 'Fetching Networks...',
            calcStep: 'Calculating Fees...',
            connError: 'Connection Error or Invalid Data',
            noNetwork: 'No blockchain network available for this account.',
            noCryptoConf: (net) => `Network ${net} has no configured cryptocurrencies.`,
            noCryptoFound: (net) => `No cryptocurrency found on network ${net}.`,
        },
        es: {
            title: 'Probar: Cotización Crypto (Billetera Externa)',
            step1: '1. Sus Credenciales',
            step2: '2. Datos de Simulación',
            emailLabel: 'Correo Electrónico',
            passwordLabel: 'Contraseña',
            amountLabel: 'Monto en Crypto',
            buttonText: 'Calcular Recibo',
            status: 'Estado:',
            error: 'Error',
            detail: 'Detalle:',
            authStep: 'Autenticando...',
            networkStep: 'Buscando Redes...',
            calcStep: 'Calculando Tarifas...',
            connError: 'Error de Conexión o Datos Inválidos',
            noNetwork: 'No hay red blockchain disponible para esta cuenta.',
            noCryptoConf: (net) => `La red ${net} no tiene criptomonedas configuradas.`,
            noCryptoFound: (net) => `No se encontró criptomoneda en la red ${net}.`,
        }
    };

    const t = i18n[currentLocale] || i18n.en;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [amount, setAmount] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState('');

    const getStatusText = (code) => {
        const codes = {
            200: 'OK', 201: 'Created', 400: 'Bad Request',
            401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found',
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
            
            if (!authRes.ok || !authData.token) {
                throw new Error(authData.message || t.connError);
            }
            const token = authData.token;

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            setEtapa(t.networkStep);
            const netRes = await fetch(`${baseUrl}/withdraw/company/blockchain-networks`, { headers });
            const netData = await netRes.json();

            if (!netRes.ok || !Array.isArray(netData) || netData.length === 0) {
                throw new Error(netData.message || t.noNetwork);
            }

            const selectedNetwork = netData[0];
            
            if (!selectedNetwork.cryptocurrencies || selectedNetwork.cryptocurrencies.length === 0) {
                 throw new Error(t.noCryptoConf(selectedNetwork.name));
            }

            const selectedCrypto = selectedNetwork.cryptocurrencies[1]?.cryptocurrency 
                                || selectedNetwork.cryptocurrencies[0]?.cryptocurrency;

            if (!selectedCrypto) {
                throw new Error(t.noCryptoFound(selectedNetwork.name));
            }

            setEtapa(t.calcStep);
            const quoteRes = await fetch(`${baseUrl}/withdraw/transaction/crypto/amount`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    amount: Number(amount),
                    blockchainNetwork: selectedNetwork,
                    cryptocurrency: selectedCrypto
                })
            });

            const quoteData = await quoteRes.json();
            setResultado({ status: quoteRes.status, body: quoteData });

        } catch (error) {
            setResultado({ erro: true, detalhe: error.message });
        } finally {
            setLoading(false);
            setEtapa('');
        }
    };

    const inputStyle = { width: '100%', padding: '10px', borderRadius: 'var(--ifm-global-radius)', border: '1px solid var(--ifm-color-emphasis-300)', backgroundColor: 'var(--ifm-background-surface-color)', color: 'var(--ifm-font-color-base)', fontSize: '0.9rem' };
    const toggleButtonStyle = { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--ifm-font-color-secondary)', zIndex: 2, display: 'flex', alignItems: 'center' };

    return (
        <div style={{ padding: '20px', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 'var(--ifm-global-radius)', backgroundColor: 'var(--ifm-card-background-color)', boxShadow: 'var(--ifm-global-shadow-lw)', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>📉</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
            </div>

            <form onSubmit={handleConsultation}>
                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step1}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.emailLabel}</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="email@..." />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.passwordLabel}</label>
                        <div style={{ position: 'relative' }}>
                            <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: '45px' }} placeholder="••••••" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleButtonStyle}>{showPassword ? '🙈' : '👁️'}</button>
                        </div>
                    </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step2}</div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.amountLabel}</label>
                    <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} placeholder="Ex: 100.00" />
                </div>

                <button type="submit" disabled={loading} className="button button--primary button--block" style={{ marginBottom: '10px' }}>
                    {loading ? etapa : t.buttonText}
                </button>
            </form>

            {resultado && (
                <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <strong>{t.status}&nbsp;</strong>
                        <span style={{ 
                            fontWeight: 'bold', 
                            color: resultado.erro ? 'var(--ifm-color-danger)' : 
                                  (resultado.status >= 200 && resultado.status < 300 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)')
                        }}>
                            {resultado.erro ? t.error : `${resultado.status} ${getStatusText(resultado.status)}`}
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
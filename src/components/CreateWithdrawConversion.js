import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function WithdrawFiatToCryptoTester() {
    const { i18n: { currentLocale } } = useDocusaurusContext();

    const i18n = {
        'pt-br': {
            title: 'Testar: Saque Crypto para Fiat',
            step1: '1. Suas Credenciais',
            step2: '2. Identificação do Cliente',
            step3: '3. Dados do Saque',
            emailLabel: 'Email',
            emailPh: 'email@...',
            pwdLabel: 'Senha',
            pwdPh: '••••••',
            customerLabel: 'ID do Cliente (Customer ID)',
            clientPh: 'Ex: 66e85...',
            noClient: 'Não possui cliente?',
            createClient: 'Clique aqui para criar',
            amountLabel: 'Valor do Saque em USDT',
            amountPh: 'Ex: 100.00',
            btnSubmit: 'Executar Saque Crypto para Fiat',
            statusLabel: 'Status:',
            statusFail: 'Falha',
            statusCreated: 'Created',
            errorLabel: 'Erro:',
            networkError: 'Erro de Conexão ou Dados Inválidos',
            stepAuth: 'Autenticando...',
            stepCrypto: 'Buscando Cripto...',
            stepCurrency: 'Buscando Moedas...',
            stepPix: 'Buscando Chave PIX...',
            stepFinal: 'Criando Saque...',
            hidePwd: 'Ocultar senha',
            showPwd: 'Mostrar senha'
        },
        en: {
            title: 'Test: Crypto to Fiat Withdraw',
            step1: '1. Your Credentials',
            step2: '2. Customer Identification',
            step3: '3. Withdrawal Data',
            emailLabel: 'Email',
            emailPh: 'email@...',
            pwdLabel: 'Password',
            pwdPh: '••••••',
            customerLabel: 'Customer ID',
            clientPh: 'Ex: 66e85...',
            noClient: "Don't have a client?",
            createClient: 'Click here to create',
            amountLabel: 'Withdrawal Amount in USDT',
            amountPh: 'Ex: 100.00',
            btnSubmit: 'Execute Fiat to Crypto Withdraw',
            statusLabel: 'Status:',
            statusFail: 'Failed',
            statusCreated: 'Created',
            errorLabel: 'Error:',
            networkError: 'Connection Error or Invalid Data',
            stepAuth: 'Authenticating...',
            stepCrypto: 'Fetching Crypto...',
            stepCurrency: 'Fetching Currencies...',
            stepPix: 'Fetching PIX Key...',
            stepFinal: 'Creating Withdrawal...',
            hidePwd: 'Hide password',
            showPwd: 'Show password'
        },
        es: {
            title: 'Probar: Retiro de Fiat a Crypto',
            step1: '1. Sus Credenciales',
            step2: '2. Identificación del Cliente',
            step3: '3. Datos del Retiro',
            emailLabel: 'Correo electrónico',
            emailPh: 'correo@...',
            pwdLabel: 'Contraseña',
            pwdPh: '••••••',
            customerLabel: 'ID del Cliente',
            clientPh: 'Ej: 66e85...',
            noClient: '¿No tienes un cliente?',
            createClient: 'Haz clic aquí para crear',
            amountLabel: 'Monto del Retiro en USDT',
            amountPh: 'Ej: 100.00',
            btnSubmit: 'Ejecutar Retiro de Fiat a Crypto',
            statusLabel: 'Estado:',
            statusFail: 'Fallo',
            statusCreated: 'Created',
            errorLabel: 'Error:',
            networkError: 'Error de Conexión o Datos Inválidos',
            stepAuth: 'Autenticando...',
            stepCrypto: 'Buscando Cripto...',
            stepCurrency: 'Buscando Monedas...',
            stepPix: 'Buscando Clave PIX...',
            stepFinal: 'Creando Retiro...',
            hidePwd: 'Ocultar contraseña',
            showPwd: 'Mostrar contraseña'
        }
    };

    const t = i18n[currentLocale] || i18n.en;

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
            200: 'OK', 201: 'Created', 400: 'Bad Request',
            401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found',
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
            
            setEtapa(t.stepAuth);
            const authRes = await fetch(`${baseUrl}/auth/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const authData = await authRes.json();
            
            if (!authRes.ok || !authData.token) {
                throw new Error(authData.message || t.networkError);
            }
            const token = authData.token;

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            setEtapa(t.stepCrypto);
            const cryptoRes = await fetch(`${baseUrl}/withdraw/company/cryptocurrencies`, { headers });
            const cryptoData = await cryptoRes.json();
            
            if (!cryptoRes.ok || !Array.isArray(cryptoData) || cryptoData.length === 0) {
                throw new Error(t.networkError);
            }

            setEtapa(t.stepCurrency);
            const currencyRes = await fetch(`${baseUrl}/withdraw/company/currencies`, { headers });
            const currencyData = await currencyRes.json();
            
            if (!currencyRes.ok || !Array.isArray(currencyData) || currencyData.length === 0) {
                throw new Error(t.networkError);
            }

            setEtapa(t.stepPix);
            const pixRes = await fetch(`${baseUrl}/pix/customer/${customerId}/key`, { headers });
            const pixData = await pixRes.json();
            
            if (!pixRes.ok || !Array.isArray(pixData) || pixData.length === 0) {
                throw new Error(t.networkError);
            }

            setEtapa(t.stepFinal);
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
                <span style={{ fontSize: '1.5rem' }}>🔄</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
            </div>

            <form onSubmit={handleCreateWithdraw}>
                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step1}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.emailLabel}</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder={t.emailPh} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.pwdLabel}</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={{ ...inputStyle, paddingRight: '45px' }}
                                placeholder={t.pwdPh}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleButtonStyle} title={showPassword ? t.hidePwd : t.showPwd}>
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step2}</div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.customerLabel}</label>
                    <input type="text" required value={customerId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} placeholder={t.clientPh} />
                    <div style={{ marginTop: '5px', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' }}>
                        {t.noClient}{' '}
                        <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                            {t.createClient}
                        </a>
                    </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step3}</div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.amountLabel}</label>
                    <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} placeholder={t.amountPh} />
                </div>

                <button type="submit" disabled={loading} className="button button--primary button--block" style={{ marginBottom: '10px' }}>
                    {loading ? etapa : t.btnSubmit}
                </button>
            </form>

            {resultado && (
                <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <strong>{t.statusLabel}&nbsp;</strong>
                        <span style={{ 
                            fontWeight: 'bold', 
                            color: resultado.erro ? 'var(--ifm-color-danger)' : 
                                  (resultado.status >= 200 && resultado.status < 300 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)')
                        }}>
                            {resultado.erro ? t.statusFail : `${resultado.status} ${getStatusText(resultado.status)}`}
                        </span>
                    </div>
                    
                    {resultado.erro && (
                        <div style={{ color: 'var(--ifm-color-danger)', fontSize: '0.9rem', marginBottom: '10px' }}>
                            <strong>{t.errorLabel}</strong> {resultado.detalhe}
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
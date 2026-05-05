import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function CreatePixDepositCryptoTester() {
    const { i18n: { currentLocale } } = useDocusaurusContext();

    const i18n = {
        'pt-br': {
            title: "💲 Testar: Criar Depósito (Pix para Crypto)",
            step1: "1. Suas Credenciais",
            step2: "2. Dados do Depósito",
            emailLabel: "Email",
            pwdLabel: "Senha",
            clientLabel: "ID do Cliente (Client ID)",
            clientPh: "Ex: 66e85...",
            noClient: "Não possui cliente?",
            createClient: "Clique aqui para criar",
            amountLabel: "Valor em BRL (Amount)",
            btnSubmit: "Gerar Pedido de Depósito Crypto",
            statusLabel: "Status:",
            statusFail: "Falha",
            statusOk: "OK",
            errorLabel: "Erro:",
            stepAuth: "Autenticando...",
            stepCurrency: "Buscando Moeda (FIAT)...",
            stepCrypto: "Buscando Criptomoeda...",
            stepOrder: "Criando Pedido...",
            errAuth: "Falha no Login",
            errCheckCreds: "Verifique credenciais",
            errCurrency: "Erro ao buscar moedas FIAT",
            errEmptyCurrency: "Lista de moedas retornou vazia.",
            errCrypto: "Erro ao buscar criptomoedas",
            errEmptyCrypto: "Lista de criptomoedas retornou vazia.",
            errExec: "Erro na execução",
            hidePwd: "Ocultar senha",
            showPwd: "Mostrar senha"
        },
        en: {
            title: "💲 Test: Create Deposit (Pix to Crypto)",
            step1: "1. Your Credentials",
            step2: "2. Deposit Data",
            emailLabel: "Email",
            pwdLabel: "Password",
            clientLabel: "Client ID",
            clientPh: "Ex: 66e85...",
            noClient: "Don't have a client?",
            createClient: "Click here to create",
            amountLabel: "Amount in BRL",
            btnSubmit: "Generate Crypto Deposit Order",
            statusLabel: "Status:",
            statusFail: "Failed",
            statusOk: "OK",
            errorLabel: "Error:",
            stepAuth: "Authenticating...",
            stepCurrency: "Fetching FIAT Currency...",
            stepCrypto: "Fetching Cryptocurrency...",
            stepOrder: "Creating Order...",
            errAuth: "Login Failed",
            errCheckCreds: "Check credentials",
            errCurrency: "Error fetching FIAT currencies",
            errEmptyCurrency: "FIAT currency list returned empty.",
            errCrypto: "Error fetching cryptocurrencies",
            errEmptyCrypto: "Cryptocurrency list returned empty.",
            errExec: "Execution Error",
            hidePwd: "Hide password",
            showPwd: "Show password"
        },
        es: {
            title: "💲 Probar: Crear Depósito (Pix a Crypto)",
            step1: "1. Sus Credenciales",
            step2: "2. Datos del Depósito",
            emailLabel: "Correo electrónico",
            pwdLabel: "Contraseña",
            clientLabel: "ID de Cliente (Client ID)",
            clientPh: "Ej: 66e85...",
            noClient: "¿No tienes un cliente?",
            createClient: "Haz clic aquí para crear",
            amountLabel: "Monto en BRL (Amount)",
            btnSubmit: "Generar Pedido de Depósito Crypto",
            statusLabel: "Estado:",
            statusFail: "Fallo",
            statusOk: "OK",
            errorLabel: "Error:",
            stepAuth: "Autenticando...",
            stepCurrency: "Buscando Moneda (FIAT)...",
            stepCrypto: "Buscando Criptomoneda...",
            stepOrder: "Creando Pedido...",
            errAuth: "Fallo de Inicio de Sesión",
            errCheckCreds: "Verifica tus credenciales",
            errCurrency: "Error al buscar monedas FIAT",
            errEmptyCurrency: "La lista de monedas FIAT está vacía.",
            errCrypto: "Error al buscar criptomonedas",
            errEmptyCrypto: "La lista de criptomonedas está vacía.",
            errExec: "Error de ejecución",
            hidePwd: "Ocultar contraseña",
            showPwd: "Mostrar contraseña"
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

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResultado(null);
        setEtapa(t.stepAuth);

        try {
            const baseUrl = 'https://api.xgateglobal.com';
            const authResponse = await fetch(`${baseUrl}/auth/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const authData = await authResponse.json();

            if (!authResponse.ok || !authData.token) {
                throw new Error(`${t.errAuth} (${authResponse.status}): ${authData.message || t.errCheckCreds}`);
            }

            const token = authData.token.trim();

            setEtapa(t.stepCurrency);
            const currencyResponse = await fetch(`${baseUrl}/deposit/company/currencies`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const currencyList = await currencyResponse.json();

            if (!currencyResponse.ok) {
                throw new Error(`${t.errCurrency}: ${currencyList.message || currencyResponse.statusText}`);
            }

            if (!Array.isArray(currencyList) || currencyList.length === 0) {
                throw new Error(t.errEmptyCurrency);
            }

            const selectedCurrency = currencyList[0];

            setEtapa(t.stepCrypto);
            const cryptoResponse = await fetch(`${baseUrl}/deposit/company/cryptocurrencies`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const cryptoList = await cryptoResponse.json();

            if (!cryptoResponse.ok) {
                throw new Error(`${t.errCrypto}: ${cryptoList.message || cryptoResponse.statusText}`);
            }

            if (!Array.isArray(cryptoList) || cryptoList.length === 0) {
                throw new Error(t.errEmptyCrypto);
            }

            const selectedCrypto = cryptoList[0];

            setEtapa(t.stepOrder);
            const orderResponse = await fetch(`${baseUrl}/deposit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: Number(amount),
                    customerId: customerId,
                    currency: selectedCurrency,
                    cryptocurrency: selectedCrypto
                })
            });

            const orderData = await orderResponse.json();
            setResultado({ status: orderResponse.status, body: orderData });

        } catch (error) {
            setResultado({ erro: t.errExec, detalhe: error.message });
        } finally {
            setLoading(false);
            setEtapa('');
        }
    };

    const inputStyle = { width: '100%', padding: '10px', borderRadius: 'var(--ifm-global-radius)', border: '1px solid var(--ifm-color-emphasis-300)', backgroundColor: 'var(--ifm-background-surface-color)', color: 'var(--ifm-font-color-base)', fontSize: '0.9rem' };
    const toggleButtonStyle = { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--ifm-font-color-secondary)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' };

    return (
        <div style={{ padding: '20px', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 'var(--ifm-global-radius)', backgroundColor: 'var(--ifm-card-background-color)', boxShadow: 'var(--ifm-global-shadow-lw)', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
            </div>

            <form onSubmit={handleCreateOrder}>
                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step1}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.emailLabel}</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="email@..." />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.pwdLabel}</label>
                        <div style={{ position: 'relative' }}>
                            <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: '45px' }} placeholder="••••••" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleButtonStyle} title={showPassword ? t.hidePwd : t.showPwd}>
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step2}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.clientLabel}</label>
                        <input type="text" required value={customerId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} placeholder={t.clientPh} />
                        <div style={{ marginTop: '5px', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' }}>
                            {t.noClient}{' '}
                            <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{t.createClient}</a>
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.amountLabel}</label>
                        <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} placeholder="100.00" />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="button button--primary button--block" style={{ marginBottom: '10px' }}>
                    {loading ? etapa : t.btnSubmit}
                </button>
            </form>

            {resultado && (
                <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <strong>{t.statusLabel}&nbsp;</strong>
                        <span style={{ fontWeight: 'bold', color: resultado.erro ? 'var(--ifm-color-danger)' : 'var(--ifm-color-success)' }}>
                            {resultado.erro ? t.statusFail : `${resultado.status} ${t.statusOk}`}
                        </span>
                    </div>
                    {resultado.erro && (
                        <div style={{ color: 'var(--ifm-color-danger)', fontSize: '0.9rem', marginBottom: '10px' }}>
                            <strong>{t.errorLabel}</strong> {resultado.detalhe}
                        </div>
                    )}
                    <CodeBlock language="json">{JSON.stringify(resultado.body || resultado, null, 2)}</CodeBlock>
                </div>
            )}
        </div>
    );
}
import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function CreatePixDepositTester() {
    const { i18n } = useDocusaurusContext();
    const locale = i18n.currentLocale;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [customerId, setCustomerId] = useState('');
    const [amount, setAmount] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState('');

    const translations = {
        en: {
            title: "💲 Test: Create Deposit Order",
            stepAuth: "Authenticating...",
            stepCurrency: "Fetching Currency...",
            stepOrder: "Creating Order...",
            errAuth: "Login Failed",
            errCheckCreds: "Check credentials",
            errCurrency: "Error fetching currencies",
            errEmptyCurrency: "Currency list returned empty.",
            errExec: "Execution Error",
            emailLabel: "Email",
            pwdLabel: "Password",
            hidePwd: "Hide password",
            showPwd: "Show password",
            clientLabel: "Client ID",
            clientPh: "Ex: 66e85...",
            createClient: "Create new client",
            amountLabel: "Amount",
            btnSubmit: "Generate Deposit Order",
            statusLabel: "Status:",
            statusFail: "Failed",
            statusOk: "OK",
            errorLabel: "Error:"
        },
        es: {
            title: "💲 Probar: Crear Pedido de Depósito",
            stepAuth: "Autenticando...",
            stepCurrency: "Buscando Moneda...",
            stepOrder: "Creando Pedido...",
            errAuth: "Fallo de Inicio de Sesión",
            errCheckCreds: "Verifica tus credenciales",
            errCurrency: "Error al buscar monedas",
            errEmptyCurrency: "La lista de monedas está vacía.",
            errExec: "Error de ejecución",
            emailLabel: "Correo electrónico",
            pwdLabel: "Contraseña",
            hidePwd: "Ocultar contraseña",
            showPwd: "Mostrar contraseña",
            clientLabel: "ID de Cliente (Client ID)",
            clientPh: "Ej: 66e85...",
            createClient: "Crear nuevo cliente",
            amountLabel: "Monto (Amount)",
            btnSubmit: "Generar Pedido de Depósito",
            statusLabel: "Estado:",
            statusFail: "Fallo",
            statusOk: "OK",
            errorLabel: "Error:"
        },
        pt: {
            title: "💲 Testar: Criar Pedido de Depósito",
            stepAuth: "Autenticando...",
            stepCurrency: "Buscando Moeda...",
            stepOrder: "Criando Pedido...",
            errAuth: "Falha no Login",
            errCheckCreds: "Verifique credenciais",
            errCurrency: "Erro ao buscar moedas",
            errEmptyCurrency: "Lista de moedas retornou vazia.",
            errExec: "Erro na execução",
            emailLabel: "Email",
            pwdLabel: "Senha",
            hidePwd: "Ocultar senha",
            showPwd: "Mostrar senha",
            clientLabel: "ID do Cliente (Client ID)",
            clientPh: "Ex: 66e85...",
            createClient: "Criar cliente novo",
            amountLabel: "Valor (Amount)",
            btnSubmit: "Gerar Pedido de Depósito",
            statusLabel: "Status:",
            statusFail: "Falha",
            statusOk: "OK",
            errorLabel: "Erro:"
        }
    };

    const t = translations[locale] || translations.pt;

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResultado(null);
        setEtapa(t.stepAuth);

        try {
            const authResponse = await fetch('https://api.xgateglobal.com/auth/token', {
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
            
            const currencyResponse = await fetch('https://api.xgateglobal.com/deposit/company/currencies', {
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

            setEtapa(t.stepOrder);

            const orderResponse = await fetch('https://api.xgateglobal.com/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: Number(amount),
                    customerId: customerId,
                    currency: selectedCurrency 
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
                <span style={{ fontSize: '1.5rem' }}>💲</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
            </div>

            <form onSubmit={handleCreateOrder}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.emailLabel}</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="email@..." />
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
                                placeholder="••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={toggleButtonStyle}
                                title={showPassword ? t.hidePwd : t.showPwd}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.clientLabel}</label>
                    <input type="text" required value={customerId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} placeholder={t.clientPh} />
                    <div style={{ marginTop: '5px', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' }}>
                        <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                            {t.createClient}
                        </a>
                    </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.amountLabel}</label>
                    <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} placeholder="100.00" />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="button button--primary button--block"
                    style={{ marginBottom: '10px' }}
                >
                    {loading ? etapa : t.btnSubmit}
                </button>
            </form>

            {resultado && (
                <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <strong>{t.statusLabel}&nbsp;</strong>
                        {resultado.erro ? (
                            <span style={{ fontWeight: 'bold', color: 'var(--ifm-color-danger)' }}>{t.statusFail}</span>
                        ) : (
                            <span style={{ fontWeight: 'bold', color: 'var(--ifm-color-success)' }}>{resultado.status} {t.statusOk}</span>
                        )}
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
import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function CreatePixWithdrawTester() {
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
            title: "💸 Test: Create Withdrawal Order",
            stepAuth: "Authenticating...",
            stepCurrency: "Fetching Currency...",
            stepPixKey: "Fetching Pix Key...",
            stepWithdraw: "Requesting Withdrawal...",
            errAuth: "Login Failed",
            errCheckCreds: "Check credentials",
            errCurrency: "Error fetching withdrawal currencies",
            errEmptyList: "Empty list",
            errNoPixKey: "Error: The client {customerId} has no registered Pix keys to receive the withdrawal.",
            errExec: "Execution Error",
            emailLabel: "Email",
            emailPh: "user@...",
            pwdLabel: "Password",
            pwdPh: "••••••",
            hidePwd: "Hide password",
            showPwd: "Show password",
            clientLabel: "Client ID",
            clientPh: "Ex: 66e85...",
            createClient: "Create new client",
            amountLabel: "Withdrawal Amount",
            amountPh: "50.00",
            btnSubmit: "Request Withdrawal",
            statusLabel: "Status:",
            statusFail: "Failed",
            statusCreated: "Created",
            errorLabel: "Error:"
        },
        es: {
            title: "💸 Probar: Crear Pedido de Retiro",
            stepAuth: "Autenticando...",
            stepCurrency: "Buscando Moneda...",
            stepPixKey: "Buscando Clave Pix...",
            stepWithdraw: "Solicitando Retiro...",
            errAuth: "Fallo de Inicio de Sesión",
            errCheckCreds: "Verifica tus credenciales",
            errCurrency: "Error al buscar monedas de retiro",
            errEmptyList: "Lista vacía",
            errNoPixKey: "Error: El cliente {customerId} no tiene claves Pix registradas para recibir el retiro.",
            errExec: "Error de ejecución",
            emailLabel: "Correo electrónico",
            emailPh: "usuario@...",
            pwdLabel: "Contraseña",
            pwdPh: "••••••",
            hidePwd: "Ocultar contraseña",
            showPwd: "Mostrar contraseña",
            clientLabel: "ID de Cliente (Client ID)",
            clientPh: "Ej: 66e85...",
            createClient: "Crear nuevo cliente",
            amountLabel: "Monto de Retiro (Amount)",
            amountPh: "50.00",
            btnSubmit: "Solicitar Retiro",
            statusLabel: "Estado:",
            statusFail: "Fallo",
            statusCreated: "Created",
            errorLabel: "Error:"
        },
        pt: {
            title: "💸 Testar: Criar Pedido de Saque",
            stepAuth: "Autenticando...",
            stepCurrency: "Buscando Moeda...",
            stepPixKey: "Buscando Chave Pix...",
            stepWithdraw: "Solicitando Saque...",
            errAuth: "Falha no Login",
            errCheckCreds: "Verifique credenciais",
            errCurrency: "Erro ao buscar moedas de saque",
            errEmptyList: "Lista vazia",
            errNoPixKey: "Erro: O cliente {customerId} não possui chaves Pix cadastradas para receber o saque.",
            errExec: "Erro na execução",
            emailLabel: "Email",
            emailPh: "user@...",
            pwdLabel: "Senha",
            pwdPh: "••••••",
            hidePwd: "Ocultar senha",
            showPwd: "Mostrar senha",
            clientLabel: "ID do Cliente (Client ID)",
            clientPh: "Ex: 66e85...",
            createClient: "Criar cliente novo",
            amountLabel: "Valor do Saque (Amount)",
            amountPh: "50.00",
            btnSubmit: "Solicitar Saque",
            statusLabel: "Status:",
            statusFail: "Falha",
            statusCreated: "Created",
            errorLabel: "Erro:"
        }
    };

    const t = translations[locale] || translations.pt;

    const handleCreateWithdraw = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResultado(null);
        setEtapa(t.stepAuth);

        try {
            // 1. LOGIN
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

            // 2. BUSCAR MOEDA DE SAQUE (WITHDRAW CURRENCY)
            setEtapa(t.stepCurrency);
            
            const currencyResponse = await fetch('https://api.xgateglobal.com/withdraw/company/currencies', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const currencyList = await currencyResponse.json();
            if (!currencyResponse.ok || !Array.isArray(currencyList) || currencyList.length === 0) {
                 throw new Error(`${t.errCurrency}: ${currencyList.message || t.errEmptyList}`);
            }
            const selectedCurrency = currencyList[0];

            // 3. BUSCAR CHAVE PIX DO CLIENTE
            setEtapa(t.stepPixKey);

            const keysResponse = await fetch(`https://api.xgateglobal.com/pix/customer/${customerId}/key`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const keysList = await keysResponse.json();
            if (!keysResponse.ok || !Array.isArray(keysList) || keysList.length === 0) {
                // Substitui dinamicamente o {customerId} na mensagem de erro
                throw new Error(t.errNoPixKey.replace('{customerId}', customerId));
            }
            const selectedPixKey = keysList[0];

            // 4. SOLICITAR SAQUE
            setEtapa(t.stepWithdraw);

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
                <span style={{ fontSize: '1.5rem' }}>💸</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
            </div>

            <form onSubmit={handleCreateWithdraw}>
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
                    <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} placeholder={t.amountPh} />
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
                            <span style={{ fontWeight: 'bold', color: 'var(--ifm-color-success)' }}>{resultado.status} {t.statusCreated}</span>
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
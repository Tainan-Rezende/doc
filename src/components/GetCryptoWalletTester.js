import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function GetCryptoWalletTester() {
    const { i18n: { currentLocale } } = useDocusaurusContext();

    const i18n = {
        'pt-br': {
            title: 'Testar: Listar Carteira Crypto',
            step1: '1. Suas Credenciais',
            step2: '2. Qual carteira deseja consultar?',
            emailLabel: 'Email',
            passLabel: 'Senha',
            customerLabel: 'ID do Cliente (Client ID)',
            customerHint: 'Não tem um cliente?',
            customerLink: 'Clique aqui para criar.',
            btnExecute: 'Buscar Carteira',
            status: 'Status',
            statusSuccess: 'OK',
            statusFail: 'Falha',
            errorLabel: 'Erro',
            stepAuth: 'Autenticando...',
            stepWallet: 'Buscando Carteira...',
            authError: 'Falha no Login',
            credHint: 'Verifique credenciais',
            execError: 'Erro na execução'
        },
        en: {
            title: 'Test: List Crypto Wallet',
            step1: '1. Your Credentials',
            step2: '2. Which wallet do you want to check?',
            emailLabel: 'Email',
            passLabel: 'Password',
            customerLabel: 'Client ID',
            customerHint: "Don't have a client?",
            customerLink: 'Click here to create.',
            btnExecute: 'Fetch Wallet',
            status: 'Status',
            statusSuccess: 'OK',
            statusFail: 'Failed',
            errorLabel: 'Error',
            stepAuth: 'Authenticating...',
            stepWallet: 'Fetching Wallet...',
            authError: 'Login Failed',
            credHint: 'Check credentials',
            execError: 'Execution Error'
        },
        es: {
            title: 'Probar: Listar Billetera Crypto',
            step1: '1. Sus Credenciales',
            step2: '2. ¿Qué billetera desea consultar?',
            emailLabel: 'Correo electrónico',
            passLabel: 'Contraseña',
            customerLabel: 'ID del Cliente',
            customerHint: '¿No tienes un cliente?',
            customerLink: 'Haz clic aquí para crear.',
            btnExecute: 'Buscar Billetera',
            status: 'Estado',
            statusSuccess: 'OK',
            statusFail: 'Fallo',
            errorLabel: 'Error',
            stepAuth: 'Autenticando...',
            stepWallet: 'Buscando Billetera...',
            authError: 'Error de inicio de sesión',
            credHint: 'Verifique las credenciales',
            execError: 'Error de ejecución'
        }
    };

    const t = i18n[currentLocale] || i18n.en;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [customerId, setCustomerId] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState('');

    const handleGetWallet = async (e) => {
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
                throw new Error(`${t.authError} (${authResponse.status}): ${authData.message || t.credHint}`);
            }

            const token = authData.token.trim();
            setEtapa(t.stepWallet);

            const walletResponse = await fetch(`${baseUrl}/crypto/customer/${customerId}/wallet`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const walletData = await walletResponse.json();
            setResultado({ status: walletResponse.status, body: walletData });

        } catch (error) {
            setResultado({ erro: t.execError, detalhe: error.message });
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
                <span style={{ fontSize: '1.5rem' }}>👛</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
            </div>

            <form onSubmit={handleGetWallet}>
                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step1}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.emailLabel}</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="email@..." />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.passLabel}</label>
                        <div style={{ position: 'relative' }}>
                            <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: '45px' }} placeholder="••••••" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleButtonStyle}>{showPassword ? '🙈' : '👁️'}</button>
                        </div>
                    </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step2}</div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.customerLabel}</label>
                    <input type="text" required value={customerId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} placeholder="Ex: 66e85..." />
                    <div style={{ marginTop: '5px', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' }}>
                        {t.customerHint} <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{t.customerLink}</a>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="button button--primary button--block" style={{ marginBottom: '10px' }}>
                    {loading ? etapa : t.btnExecute}
                </button>
            </form>

            {resultado && (
                <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <strong>{t.status}:&nbsp;</strong>
                        <span style={{ fontWeight: 'bold', color: resultado.erro ? 'var(--ifm-color-danger)' : 'var(--ifm-color-success)' }}>
                            {resultado.erro ? t.statusFail : `${resultado.status} ${t.statusSuccess}`}
                        </span>
                    </div>
                    {resultado.erro && (
                        <div style={{ color: 'var(--ifm-color-danger)', fontSize: '0.9rem', marginBottom: '10px' }}>
                            <strong>{t.errorLabel}:</strong> {resultado.detalhe}
                        </div>
                    )}
                    <CodeBlock language="json">{JSON.stringify(resultado.body || resultado, null, 2)}</CodeBlock>
                </div>
            )}
        </div>
    );
}
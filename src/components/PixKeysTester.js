import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function PixKeysTester() {
    const { i18n: { currentLocale } } = useDocusaurusContext();

    // Dicionário de traduções
    const i18n = {
        'pt-br': {
            title: "Testar: Listar Chaves Pix",
            step1: "1. Suas Credenciais",
            step2: "2. Qual cliente deseja consultar?",
            emailLabel: "Email",
            pwdLabel: "Senha",
            clientLabel: "ID do Cliente (Client ID)",
            clientPh: "Ex: 66e85...",
            noClient: "Não possui cliente?",
            createClient: "Clique aqui para criar",
            btnSubmit: "Autenticar e Listar Chaves",
            statusLabel: "Status:",
            statusFail: "Falha",
            statusOk: "OK",
            errorLabel: "Erro:",
            stepAuth: "Autenticando...",
            stepFetch: "Buscando Chaves...",
            errAuth: "Falha no Login",
            errCheckCreds: "Verifique suas credenciais",
            errExec: "Erro na execução"
        },
        en: {
            title: "Test: List Pix Keys",
            step1: "1. Your Credentials",
            step2: "2. Which customer do you want to check?",
            emailLabel: "Email",
            pwdLabel: "Password",
            clientLabel: "Client ID",
            clientPh: "Ex: 66e85...",
            noClient: "Don't have a client?",
            createClient: "Click here to create",
            btnSubmit: "Authenticate and List Keys",
            statusLabel: "Status:",
            statusFail: "Failed",
            statusOk: "OK",
            errorLabel: "Error:",
            stepAuth: "Authenticating...",
            stepFetch: "Fetching Keys...",
            errAuth: "Login Failed",
            errCheckCreds: "Check your credentials",
            errExec: "Execution Error"
        },
        es: {
            title: "Probar: Listar Claves Pix",
            step1: "1. Sus Credenciales",
            step2: "2. ¿Qué cliente desea consultar?",
            emailLabel: "Correo electrónico",
            pwdLabel: "Contraseña",
            clientLabel: "ID de Cliente (Client ID)",
            clientPh: "Ej: 66e85...",
            noClient: "¿No tienes un cliente?",
            createClient: "Haz clic aquí para crear",
            btnSubmit: "Autenticar y Listar Claves",
            statusLabel: "Estado:",
            statusFail: "Fallo",
            statusOk: "OK",
            errorLabel: "Error:",
            stepAuth: "Autenticando...",
            stepFetch: "Buscando Claves...",
            errAuth: "Fallo de Inicio de Sesión",
            errCheckCreds: "Verifica tus credenciales",
            errExec: "Error de ejecución"
        }
    };

    const t = i18n[currentLocale] || i18n.en;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [clientId, setClientId] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState('');

    const handleFullTest = async (e) => {
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

            const token = authData.token;
            setEtapa(t.stepFetch);

            const keysResponse = await fetch(`https://api.xgateglobal.com/pix/customer/${clientId}/key`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const keysData = await keysResponse.json();
            setResultado({ status: keysResponse.status, body: keysData });

        } catch (error) {
            setResultado({ erro: t.errExec, detalhe: error.message });
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
                <span style={{ fontSize: '1.5rem' }}>🚀</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
            </div>

            <form onSubmit={handleFullTest}>
                {/* PASSO 1 */}
                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
                    {t.step1}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.emailLabel}</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="seu@email.com" />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.pwdLabel}</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                required value={password} onChange={e => setPassword(e.target.value)}
                                style={{ ...inputStyle, paddingRight: '45px' }} placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleButtonStyle}>
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

                {/* PASSO 2 */}
                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
                    {t.step2}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.clientLabel}</label>
                    <input type="text" required value={clientId} onChange={e => setClientId(e.target.value)} style={inputStyle} placeholder={t.clientPh} />
                    <div style={{ marginTop: '5px', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' }}>
                        {t.noClient}{' '}
                        <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                            {t.createClient}
                        </a>
                    </div>
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
                        <span style={{ 
                            fontWeight: 'bold', 
                            color: resultado.erro ? 'var(--ifm-color-danger)' : 'var(--ifm-color-success)' 
                        }}>
                            {resultado.erro ? t.statusFail : `${resultado.status} ${t.statusOk}`}
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
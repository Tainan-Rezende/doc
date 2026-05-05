import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function AddPixKeyTester() {
    const { i18n: { currentLocale } } = useDocusaurusContext();

    const i18n = {
        'pt-br': {
            title: "Testar: Adicionar Chave Pix",
            step1: "1. Suas Credenciais",
            step2: "2. Qual cliente receberá a chave?",
            step3: "3. Dados da Nova Chave",
            email: "Email",
            password: "Senha",
            clientId: "ID do Cliente (Client ID)",
            noClient: "Não possui cliente?",
            createClient: "Clique aqui para criar",
            keyType: "Tipo da Chave",
            optEmail: "E-mail",
            optCpf: "CPF",
            optCnpj: "CNPJ",
            optPhone: "Telefone",
            optRandom: "Chave Aleatória",
            keyValue: "Valor da Chave",
            phKeyGeneric: "Digite a chave...",
            btnSubmit: "Cadastrar Chave Pix",
            resultLabel: "Resultado:",
            resultError: "Erro",
            hidePwd: "Ocultar senha",
            showPwd: "Mostrar senha",
            stepAuth: "Autenticando...",
            stepCreate: "Cadastrando Chave...",
            errAuth: "Falha no Login",
            errCheckCreds: "Verifique credenciais",
            errExec: "Erro na execução"
        },
        en: {
            title: "Test: Add Pix Key",
            step1: "1. Your Credentials",
            step2: "2. Which customer will receive the key?",
            step3: "3. New Key Data",
            email: "Email",
            password: "Password",
            clientId: "Client ID",
            noClient: "Don't have a client?",
            createClient: "Click here to create",
            keyType: "Key Type",
            optEmail: "E-mail",
            optCpf: "CPF",
            optCnpj: "CNPJ",
            optPhone: "Phone",
            optRandom: "Random Key",
            keyValue: "Key Value",
            phKeyGeneric: "Enter the key...",
            btnSubmit: "Register Pix Key",
            resultLabel: "Result:",
            resultError: "Error",
            hidePwd: "Hide password",
            showPwd: "Show password",
            stepAuth: "Authenticating...",
            stepCreate: "Registering Key...",
            errAuth: "Login Failed",
            errCheckCreds: "Check credentials",
            errExec: "Execution Error"
        },
        es: {
            title: "Probar: Añadir Clave Pix",
            step1: "1. Sus Credenciales",
            step2: "2. ¿Qué cliente recibirá la clave?",
            step3: "3. Datos de la Nueva Clave",
            email: "Correo electrónico",
            password: "Contraseña",
            clientId: "ID de Cliente",
            noClient: "¿No tienes un cliente?",
            createClient: "Haz clic aquí para crear",
            keyType: "Tipo de Clave",
            optEmail: "E-mail",
            optCpf: "CPF",
            optCnpj: "CNPJ",
            optPhone: "Teléfono",
            optRandom: "Clave Aleatoria",
            keyValue: "Valor de la Clave",
            phKeyGeneric: "Ingresa la clave...",
            btnSubmit: "Registrar Clave Pix",
            resultLabel: "Resultado:",
            resultError: "Error",
            hidePwd: "Ocultar contraseña",
            showPwd: "Mostrar contraseña",
            stepAuth: "Autenticando...",
            stepCreate: "Registrando Clave...",
            errAuth: "Fallo de Inicio de Sesión",
            errCheckCreds: "Verifique credenciales",
            errExec: "Error de ejecución"
        }
    };

    const t = i18n[currentLocale] || i18n.en;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [clientId, setCustomerId] = useState('');
    const [pixKey, setPixKey] = useState('');
    const [keyType, setKeyType] = useState('EMAIL');

    const [showPassword, setShowPassword] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState('');

    const handleAddKey = async (e) => {
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
                throw new Error(`${t.errAuth}: ${authData.message || t.errCheckCreds}`);
            }

            setEtapa(t.stepCreate);
            const createResponse = await fetch(`${baseUrl}/pix/customer/${clientId}/key`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    key: pixKey,
                    type: keyType
                })
            });

            const createData = await createResponse.json();
            setResultado({ status: createResponse.status, body: createData });

        } catch (error) {
            setResultado({ erro: t.errExec, detalhe: error.message });
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
                <span style={{ fontSize: '1.5rem' }}>➕</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
            </div>

            <form onSubmit={handleAddKey}>
                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step1}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.email}</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="email@..." />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.password}</label>
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
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.clientId}</label>
                    <input type="text" required value={clientId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} placeholder="66e8..." />
                    <div style={{ marginTop: '5px', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' }}>
                        {t.noClient} <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{t.createClient}</a>
                    </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step3}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.keyType}</label>
                        <select value={keyType} onChange={(e) => setKeyType(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                            <option value="EMAIL">{t.optEmail}</option>
                            <option value="CPF">{t.optCpf}</option>
                            <option value="CNPJ">{t.optCnpj}</option>
                            <option value="PHONE">{t.optPhone}</option>
                            <option value="RANDOM">{t.optRandom}</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.keyValue}</label>
                        <input type="text" required value={pixKey} onChange={(e) => setPixKey(e.target.value)} style={inputStyle} placeholder={keyType === 'PHONE' ? '+5511999999999' : t.phKeyGeneric} />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="button button--primary button--block">
                    {loading ? etapa : t.btnSubmit}
                </button>
            </form>

            {resultado && (
                <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <strong>{t.resultLabel}</strong>
                        <span style={{ fontWeight: 'bold', color: resultado.status >= 200 && resultado.status < 300 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)' }}>
                            {resultado.status ? `${resultado.status} ${resultado.status === 201 ? 'Created' : ''}` : t.resultError}
                        </span>
                    </div>
                    <CodeBlock language="json">{JSON.stringify(resultado.body || resultado, null, 2)}</CodeBlock>
                </div>
            )}
        </div>
    );
}
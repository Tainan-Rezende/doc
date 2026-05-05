import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function GetTetherConversionToFiatTester() {
    const { i18n: { currentLocale } } = useDocusaurusContext();

    const i18n = {
        'pt-br': {
            title: 'Testar: Cotação para Conversão',
            step1: '1. Suas Credenciais',
            step2: '2. Dados da Simulação',
            emailLabel: 'Email',
            emailPlaceholder: 'email@...',
            passLabel: 'Senha',
            pwdPh: '••••••',
            amountLabel: 'Valor em USDT (Amount)',
            placeholderAmount: 'Ex: 100.00',
            btnExecute: 'Consultar Cotação',
            status: 'Status',
            detail: 'Detalhe',
            errorNet: 'Erro de Conexão',
            errorNoCrypto: 'Nenhuma criptomoeda de saque encontrada para esta conta.',
            stepAuth: 'Autenticando...',
            stepCrypto: 'Buscando Cripto...',
            stepCalc: 'Calculando Cotação...',
            hidePwd: 'Ocultar senha',
            showPwd: 'Mostrar senha',
            error: 'Erro'
        },
        en: {
            title: 'Test: Conversion Quote',
            step1: '1. Your Credentials',
            step2: '2. Simulation Data',
            emailLabel: 'Email',
            emailPlaceholder: 'email@...',
            passLabel: 'Password',
            pwdPh: '••••••',
            amountLabel: 'Amount in USDT',
            placeholderAmount: 'Ex: 100.00',
            btnExecute: 'Consult Quote',
            status: 'Status',
            detail: 'Detail',
            errorNet: 'Connection Error',
            errorNoCrypto: 'No withdrawal cryptocurrency found for this account.',
            stepAuth: 'Authenticating...',
            stepCrypto: 'Fetching Crypto...',
            stepCalc: 'Calculating Quote...',
            hidePwd: 'Hide password',
            showPwd: 'Show password',
            error: 'Error'
        },
        es: {
            title: 'Probar: Cotización para Conversión',
            step1: '1. Sus Credenciales',
            step2: '2. Datos de Simulación',
            emailLabel: 'Correo electrónico',
            emailPlaceholder: 'correo@...',
            passLabel: 'Contraseña',
            pwdPh: '••••••',
            amountLabel: 'Monto en USDT',
            placeholderAmount: 'Ej: 100.00',
            btnExecute: 'Consultar Cotización',
            status: 'Estado',
            detail: 'Detalle',
            errorNet: 'Error de Conexión',
            errorNoCrypto: 'No se encontró ninguna criptomoneda de retiro para esta cuenta.',
            stepAuth: 'Autenticando...',
            stepCrypto: 'Buscando Cripto...',
            stepCalc: 'Calculando Cotización...',
            hidePwd: 'Ocultar contraseña',
            showPwd: 'Mostrar contraseña',
            error: 'Error'
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
            200: 'OK', 400: 'Bad Request', 401: 'Unauthorized',
            403: 'Forbidden', 404: 'Not Found', 500: 'Internal Server Error',
        };
        return codes[code] || 'Unknown';
    };

    const handleConsultation = async (e) => {
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
            
            if (!authRes.ok) {
                setResultado({ status: authRes.status, body: authData });
                return;
            }
            const token = authData.token;

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            setEtapa(t.stepCrypto);
            const cryptoRes = await fetch(`${baseUrl}/withdraw/company/cryptocurrencies`, { headers });
            const cryptoList = await cryptoRes.json();

            if (!cryptoRes.ok) {
                setResultado({ status: cryptoRes.status, body: cryptoList });
                return;
            }

            if (!Array.isArray(cryptoList) || cryptoList.length === 0) {
                throw new Error(t.errorNoCrypto);
            }

            const selectedCrypto = cryptoList[0];

            setEtapa(t.stepCalc);
            const conversionRes = await fetch(`${baseUrl}/withdraw/conversion/brl/pix`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    amount: Number(amount),
                    cryptocurrency: selectedCrypto
                })
            });

            const conversionData = await conversionRes.json();
            setResultado({ status: conversionRes.status, body: conversionData });

        } catch (error) {
            setResultado({ erro: t.errorNet, detalhe: error.message });
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
                <span style={{ fontSize: '1.5rem' }}>💱</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
            </div>

            <form onSubmit={handleConsultation}>
                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step1}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.emailLabel}</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder={t.emailPlaceholder} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.passLabel}</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                required value={password} onChange={e => setPassword(e.target.value)}
                                style={{ ...inputStyle, paddingRight: '45px' }} placeholder={t.pwdPh}
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
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.amountLabel}</label>
                    <input 
                        type="number" 
                        step="0.01" 
                        required 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        style={inputStyle} 
                        placeholder={t.placeholderAmount} 
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="button button--primary button--block"
                    style={{ marginBottom: '10px' }}
                >
                    {loading ? etapa : t.btnExecute}
                </button>
            </form>

            {resultado && (
                <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <strong>{t.status}:&nbsp;</strong>
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
                            <strong>{t.detail}:</strong> {resultado.detalhe}
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
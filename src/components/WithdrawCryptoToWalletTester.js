import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function WithdrawCryptoToWalletTester() {
    const { i18n: { currentLocale } } = useDocusaurusContext();

    const i18n = {
        'pt-br': {
            title: 'Saque para Carteira Externa',
            step1: '1. Suas Credenciais',
            step2: '2. Identificação do Cliente',
            step3: '3. Dados do Saque',
            emailLabel: 'Email',
            passLabel: 'Senha',
            amountLabel: 'Valor (Amount)',
            customerLabel: 'ID do Cliente (Customer ID)',
            walletLabel: 'Wallet de Destino (Address)',
            noCustomer: 'Não possui cliente?',
            createLink: 'Clique aqui para criar.',
            btnExecute: 'Criar Saque Crypto',
            status: 'Status',
            errorNet: 'Erro de Conexão',
            stepAuth: 'Autenticando...',
            stepNet: 'Buscando Redes...',
            stepFinal: 'Processando Saque...',
        },
        en: {
            title: 'Withdraw to External Wallet',
            step1: '1. Your Credentials',
            step2: '2. Customer Identification',
            step3: '3. Withdrawal Data',
            emailLabel: 'Email',
            passLabel: 'Password',
            amountLabel: 'Amount',
            customerLabel: 'Customer ID',
            walletLabel: 'Destination Wallet (Address)',
            noCustomer: 'Don\'t have a client?',
            createLink: 'Click here to create.',
            btnExecute: 'Create Crypto Withdrawal',
            status: 'Status',
            errorNet: 'Connection Error',
            stepAuth: 'Authenticating...',
            stepNet: 'Fetching Networks...',
            stepFinal: 'Processing Withdrawal...',
        },
        es: {
            title: 'Retiro a Billetera Externa',
            step1: '1. Sus Credenciales',
            step2: '2. Identificación del Cliente',
            step3: '3. Datos del Retiro',
            emailLabel: 'Correo electrónico',
            passLabel: 'Contraseña',
            amountLabel: 'Monto',
            customerLabel: 'ID del Cliente',
            walletLabel: 'Billetera de Destino (Address)',
            noCustomer: '¿No tienes un cliente?',
            createLink: 'Haz clic aquí para crear.',
            btnExecute: 'Crear Retiro Crypto',
            status: 'Estado',
            errorNet: 'Error de Conexión',
            stepAuth: 'Autenticando...',
            stepNet: 'Buscando Redes...',
            stepFinal: 'Procesando Retiro...',
        }
    };

    const t = i18n[currentLocale] || i18n.en;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [amount, setAmount] = useState('');
    const [wallet, setWallet] = useState('');
    const [customerId, setCustomerId] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState('');

    const getStatusText = (code) => {
        const codes = {
            201: 'Created',
            200: 'OK',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            500: 'Internal Server Error',
        };
        return codes[code] || 'Unknown';
    };

    const handleWithdraw = async (e) => {
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

            setEtapa(t.stepNet);
            const netRes = await fetch(`${baseUrl}/withdraw/company/blockchain-networks`, { headers });
            const netData = await netRes.json();
            if (!netRes.ok) {
                setResultado({ status: netRes.status, body: netData });
                return;
            }

            const selectedNetwork = netData[0];
            const selectedCrypto = selectedNetwork.cryptocurrencies[1].cryptocurrency;

            setEtapa(t.stepFinal);
            const finalRes = await fetch(`${baseUrl}/withdraw`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    amount: Number(amount),
                    wallet: wallet,
                    customerId: customerId,
                    cryptocurrency: selectedCrypto,
                    blockchainNetwork: selectedNetwork
                })
            });

            const finalData = await finalRes.json();
            setResultado({ status: finalRes.status, body: finalData });

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
                <span style={{ fontSize: '1.5rem' }}>🔐</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
            </div>

            <form onSubmit={handleWithdraw}>
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
                    <input type="text" required value={customerId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} placeholder="672f..." />
                    <div style={{ marginTop: '5px', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' }}>
                        {t.noCustomer} <a href={useBaseUrl('/docs/customer/create')} target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{t.createLink}</a>
                    </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

                <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step3}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.amountLabel}</label>
                        <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} placeholder="0.1" />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.walletLabel}</label>
                        <input type="text" required value={wallet} onChange={e => setWallet(e.target.value)} style={inputStyle} placeholder="0x..." />
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
                        <span style={{ fontWeight: 'bold', color: resultado.status >= 200 && resultado.status < 300 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)' }}>
                            {resultado.status ? `${resultado.status} ${getStatusText(resultado.status)}` : t.errorNet}
                        </span>
                    </div>
                    <CodeBlock language="json">{JSON.stringify(resultado.body || resultado, null, 2)}</CodeBlock>
                </div>
            )}
        </div>
    );
}
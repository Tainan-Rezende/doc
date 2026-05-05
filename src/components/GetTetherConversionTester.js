import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function GetTetherConversionTester() {
  const { i18n: { currentLocale } } = useDocusaurusContext();

  const i18n = {
    'pt-br': {
      title: 'Testar: Cotação para Conversão',
      step1: '1. Suas Credenciais',
      step2: '2. Dados da Simulação',
      emailLabel: 'Email',
      emailPlaceholder: 'email@...',
      pwdLabel: 'Senha',
      amountLabel: 'Valor em BRL para simular:',
      amountPlaceholder: 'Ex: 100.00',
      btnExecute: 'Cotar Valor em Crypto',
      status: 'Status',
      statusFail: 'Falha',
      stepAuth: 'Autenticando...',
      stepCurrency: 'Buscando Dados do BRL...',
      stepCalc: 'Calculando Conversão...',
      errorAuth: 'Login falhou',
      errorCurrency: 'Não foi possível obter a moeda BRL para cotação.',
      errorGeneral: 'Erro'
    },
    en: {
      title: 'Test: Conversion Quote',
      step1: '1. Your Credentials',
      step2: '2. Simulation Data',
      emailLabel: 'Email',
      emailPlaceholder: 'email@...',
      pwdLabel: 'Password',
      amountLabel: 'BRL amount to simulate:',
      amountPlaceholder: 'Ex: 100.00',
      btnExecute: 'Quote Crypto Value',
      status: 'Status',
      statusFail: 'Failed',
      stepAuth: 'Authenticating...',
      stepCurrency: 'Fetching BRL Data...',
      stepCalc: 'Calculating Conversion...',
      errorAuth: 'Login failed',
      errorCurrency: 'Could not obtain BRL currency for quotation.',
      errorGeneral: 'Error'
    },
    es: {
      title: 'Probar: Cotización para Conversión',
      step1: '1. Sus Credenciales',
      step2: '2. Datos de Simulación',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'correo@...',
      pwdLabel: 'Contraseña',
      amountLabel: 'Monto en BRL para simular:',
      amountPlaceholder: 'Ej: 100.00',
      btnExecute: 'Cotizar Valor en Crypto',
      status: 'Estado',
      statusFail: 'Fallo',
      stepAuth: 'Autenticando...',
      stepCurrency: 'Buscando Datos de BRL...',
      stepCalc: 'Calculando Conversión...',
      errorAuth: 'Autenticación fallida',
      errorCurrency: 'No se pudo obtener la moneda BRL para la cotización.',
      errorGeneral: 'Error'
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

  const handleConversion = async (e) => {
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
        throw new Error(`${t.errorAuth}: ${authData.message}`);
      }
      const token = authData.token.trim();

      setEtapa(t.stepCurrency);
      const currencyResponse = await fetch(`${baseUrl}/deposit/company/currencies`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const currencyList = await currencyResponse.json();
      
      if (!currencyResponse.ok || !Array.isArray(currencyList) || currencyList.length === 0) {
         throw new Error(t.errorCurrency);
      }
      const selectedCurrency = currencyList[0];

      setEtapa(t.stepCalc);
      const conversionResponse = await fetch(`${baseUrl}/deposit/conversion/tether`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            amount: Number(amount),
            currency: selectedCurrency
        })
      });

      const conversionData = await conversionResponse.json();
      setResultado({ status: conversionResponse.status, body: conversionData });

    } catch (error) {
      setResultado({ erro: t.errorGeneral, detalhe: error.message });
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

      <form onSubmit={handleConversion}>
        <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step1}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.emailLabel}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder={t.emailPlaceholder} />
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
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleButtonStyle}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        </div>

        <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

        <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>{t.step2}</div>
        <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.amountLabel}</label>
            <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} placeholder={t.amountPlaceholder} />
        </div>

        <button type="submit" disabled={loading} className="button button--primary button--block">
          {loading ? etapa : t.btnExecute}
        </button>
      </form>

      {resultado && (
        <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <strong>{t.status}:&nbsp;</strong>
            <span style={{ fontWeight: 'bold', color: resultado.erro ? 'var(--ifm-color-danger)' : 'var(--ifm-color-success)' }}>
              {resultado.erro ? t.statusFail : `${resultado.status} OK`}
            </span>
          </div>
          <CodeBlock language="json">{JSON.stringify(resultado.body || resultado, null, 2)}</CodeBlock>
        </div>
      )}
    </div>
  );
}
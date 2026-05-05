import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function UpdateCustomerTester() {
  const { i18n: { currentLocale } } = useDocusaurusContext();

  // Dicionário de traduções
  const i18n = {
    'pt-br': {
      title: 'Testar: Atualizar Cliente',
      step1: '1. Suas Credenciais',
      step2: '2. Qual cliente deseja alterar?',
      step3: '3. Novos Dados Cadastrais',
      adminEmail: 'Seu Email',
      adminPass: 'Sua Senha',
      customerIdLabel: 'ID do Cliente (_id)',
      noClient: "Não possui cliente?",
      createClient: "Clique aqui para criar",
      newName: 'Novo Nome Completo',
      placeholderName: 'Nome atualizado',
      document: 'Documento (CPF/CNPJ)',
      emailOpt: 'Email (Opcional)',
      phoneOpt: 'Telefone (Opcional)',
      btnExecute: 'Atualizar Cliente',
      result: 'Resultado:',
      statusOK: 'Sucesso',
      statusFail: 'Erro',
      authError: 'Falha no Login',
      credHint: 'Verifique credenciais',
      validError: 'Validação',
      idRequired: 'O ID do Cliente é obrigatório.',
      stepAuth: 'Autenticando...',
      stepUpdate: 'Atualizando Cliente...',
      execError: 'Erro na execução'
    },
    en: {
      title: 'Test: Update Customer',
      step1: '1. Your Credentials',
      step2: '2. Which customer do you want to update?',
      step3: '3. New Registration Data',
      adminEmail: 'Your Email',
      adminPass: 'Your Password',
      customerIdLabel: 'Customer ID (_id)',
      noClient: "Don't have a client?",
      createClient: "Click here to create",
      newName: 'New Full Name',
      placeholderName: 'Updated Name',
      document: 'Document (CPF/CNPJ)',
      emailOpt: 'Email (Optional)',
      phoneOpt: 'Phone (Optional)',
      btnExecute: 'Update Customer',
      result: 'Result:',
      statusOK: 'Success',
      statusFail: 'Error',
      authError: 'Login Failed',
      credHint: 'Check credentials',
      validError: 'Validation Error',
      idRequired: 'Customer ID is required.',
      stepAuth: 'Authenticating...',
      stepUpdate: 'Updating Customer...',
      execError: 'Execution Error'
    },
    es: {
      title: 'Probar: Actualizar Cliente',
      step1: '1. Sus Credenciales (Admin)',
      step2: '2. ¿Qué cliente desea cambiar?',
      step3: '3. Nuevos Datos de Registro',
      adminEmail: 'Su Correo',
      adminPass: 'Su Contraseña',
      customerIdLabel: 'ID del Cliente (_id)',
      noClient: "¿No tienes un cliente?",
      createClient: "Haz clic aquí para crear",
      newName: 'Nuevo Nombre Completo',
      placeholderName: 'Nombre actualizado',
      document: 'Documento (CPF/CNPJ)',
      emailOpt: 'Correo (Opcional)',
      phoneOpt: 'Teléfono (Opcional)',
      btnExecute: 'Actualizar Cliente',
      result: 'Resultado:',
      statusOK: 'Éxito',
      statusFail: 'Error',
      authError: 'Error de inicio de sesión',
      credHint: 'Verifique las credenciales',
      validError: 'Error de Validación',
      idRequired: 'El ID del Cliente es obligatorio.',
      stepAuth: 'Autenticando...',
      stepUpdate: 'Actualizando Cliente...',
      execError: 'Error de ejecución'
    }
  };

  const t = i18n[currentLocale] || i18n.en;

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerDoc, setCustomerDoc] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [etapa, setEtapa] = useState('');

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();

    if (!customerId.trim()) {
      setResultado({
        erro: t.validError,
        detalhe: t.idRequired
      });
      return;
    }

    setLoading(true);
    setResultado(null);
    setEtapa(t.stepAuth);

    try {
      const authResponse = await fetch('https://api.xgateglobal.com/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const authData = await authResponse.json();

      if (!authResponse.ok || !authData.token) {
        throw new Error(`${t.authError}: ${authData.message || t.credHint}`);
      }

      setEtapa(t.stepUpdate);

      const payload = {
        name: customerName,
        document: customerDoc
      };
      if (customerEmail) payload.email = customerEmail;
      if (customerPhone) payload.phone = customerPhone;

      const updateResponse = await fetch(`https://api.xgateglobal.com/customer/${customerId.trim()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`
        },
        body: JSON.stringify(payload)
      });

      const updateData = await updateResponse.json();
      setResultado({ status: updateResponse.status, body: updateData });

    } catch (error) {
      setResultado({ erro: t.execError, detalhe: error.message });
    } finally {
      setLoading(false);
      setEtapa('');
    }
  };

  const inputStyle = { width: '100%', padding: '10px', borderRadius: 'var(--ifm-global-radius)', border: '1px solid var(--ifm-color-emphasis-300)', backgroundColor: 'var(--ifm-background-surface-color)', color: 'var(--ifm-font-color-base)', fontSize: '0.9rem' };
  const toggleButtonStyle = { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--ifm-font-color-secondary)', padding: '5px', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' };

  return (
    <div style={{ padding: '20px', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 'var(--ifm-global-radius)', backgroundColor: 'var(--ifm-card-background-color)', boxShadow: 'var(--ifm-global-shadow-lw)', marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px' }}>
        <span style={{ fontSize: '1.5rem' }}>🔄</span>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
      </div>

      <form onSubmit={handleUpdateCustomer}>
        <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
          {t.step1}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.adminEmail}</label>
            <input type="email" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)} style={inputStyle} placeholder="admin@xgate..." />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.adminPass}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
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

        <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
          {t.step2}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem' }}>{t.customerIdLabel}</label>
          <input type="text" required value={customerId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} placeholder="Ex: 697e15d..." />

          <div style={{ marginTop: '5px', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' }}>
            {t.noClient}{' '}
            <a href={useBaseUrl('/docs/customer/create')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
              {t.createClient}
            </a>
          </div>
        </div>

        <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '20px 0' }} />

        <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
          {t.step3}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.newName}</label>
            <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} style={inputStyle} placeholder={t.placeholderName} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.document}</label>
            <input type="text" required value={customerDoc} onChange={e => setCustomerDoc(e.target.value)} style={inputStyle} placeholder="12345678900" />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.emailOpt}</label>
            <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} style={inputStyle} placeholder="novo@email.com" />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.phoneOpt}</label>
            <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} style={inputStyle} placeholder="11999999999" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="button button--primary button--block">
          {loading ? etapa : t.btnExecute}
        </button>
      </form>

      {resultado && (
        <div style={{ marginTop: '15px', animation: 'fade-in 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <strong>{t.result}</strong>
            <span style={{ fontWeight: 'bold', color: resultado.status >= 200 && resultado.status < 300 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)' }}>
              {resultado.status ? `${resultado.status} ${resultado.status === 200 ? 'OK' : ''}` : t.statusFail}
            </span>
          </div>

          <CodeBlock language="json">
            {JSON.stringify(resultado.body || resultado, null, 2)}
          </CodeBlock>
        </div>
      )}
    </div>
  );
}
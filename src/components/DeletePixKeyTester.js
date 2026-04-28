import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function DeletePixKeyTester() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n.currentLocale;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);

  const [customerId, setCustomerId] = useState('');
  const [keyId, setKeyId] = useState('');

  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [etapa, setEtapa] = useState('');

  const translations = {
    en: {
      title: "🗑️ Test: Remove Key",
      stepAuth: "Authenticating...",
      stepDelete: "Deleting Key...",
      errAuth: "Login Failed",
      errCheckCreds: "Check credentials",
      errExec: "Execution Error",
      successMsg: "Key successfully removed.",
      noDetailsMsg: "Error with no details in response body.",
      emailPh: "email@domain.com",
      pwdPh: "password",
      hidePwd: "Hide password",
      showPwd: "Show password",
      lblCustomer: "Customer ID (_id)",
      lblKeyId: "Pix Key ID (key _id)",
      phCustomer: "Ex: 66e85...",
      phKeyId: "Ex: 68fa5...",
      btnSubmit: "Delete Key Permanently",
      statusLabel: "Status: ",
      statusError: "Error"
    },
    es: {
      title: "🗑️ Probar: Eliminar Clave",
      stepAuth: "Autenticando...",
      stepDelete: "Eliminando Clave...",
      errAuth: "Fallo de Inicio de Sesión",
      errCheckCreds: "Verifique credenciales",
      errExec: "Error de ejecución",
      successMsg: "Clave eliminada con éxito.",
      noDetailsMsg: "Error sin detalles en el cuerpo de la respuesta.",
      emailPh: "correo@dominio.com",
      pwdPh: "contraseña",
      hidePwd: "Ocultar contraseña",
      showPwd: "Mostrar contraseña",
      lblCustomer: "Customer ID (_id)",
      lblKeyId: "Pix Key ID (_id de la clave)",
      phCustomer: "Ej: 66e85...",
      phKeyId: "Ej: 68fa5...",
      btnSubmit: "Eliminar Clave Permanentemente",
      statusLabel: "Estado: ",
      statusError: "Error"
    },
    pt: {
      title: "🗑️ Testar: Remover Chave",
      stepAuth: "Autenticando...",
      stepDelete: "Deletando Chave...",
      errAuth: "Falha no Login",
      errCheckCreds: "Verifique credenciais",
      errExec: "Erro na execução",
      successMsg: "Chave removida com sucesso.",
      noDetailsMsg: "Erro sem detalhes no corpo da resposta.",
      emailPh: "email@dominio.com",
      pwdPh: "senha",
      hidePwd: "Ocultar senha",
      showPwd: "Mostrar senha",
      lblCustomer: "Customer ID (_id)",
      lblKeyId: "Pix Key ID (_id da chave)",
      phCustomer: "Ex: 66e85...",
      phKeyId: "Ex: 68fa5...",
      btnSubmit: "Deletar Chave Permanentemente",
      statusLabel: "Status: ",
      statusError: "Erro"
    }
  };

  const t = translations[locale] || translations.pt;

  const handleDelete = async (e) => {
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
        throw new Error(`${t.errAuth}: ${authData.message || t.errCheckCreds}`);
      }

      setEtapa(t.stepDelete);

      const url = `https://api.xgateglobal.com/pix/customer/${customerId}/key/remove/${keyId}`;
      
      const deleteResponse = await fetch(url, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`
        }
      });

      let deleteData;
      
      try {
        deleteData = await deleteResponse.json();
      } catch (e) {
        if (deleteResponse.ok) {
           deleteData = { message: t.successMsg };
        } else {
           deleteData = { message: t.noDetailsMsg };
        }
      }

      setResultado({ status: deleteResponse.status, body: deleteData });
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
    marginBottom: '10px'
  };

  const toggleButtonStyle = {
    position: 'absolute',
    right: '10px',
    top: '38%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: 'var(--ifm-font-color-secondary)',
    padding: '0',
    zIndex: 2,
  };

  return (
    <div style={{
      padding: '20px',
      border: '1px solid var(--ifm-color-danger-darkest)',
      borderRadius: 'var(--ifm-global-radius)',
      backgroundColor: 'var(--ifm-card-background-color)',
      marginTop: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: 'var(--ifm-color-danger)' }}></div>

      <h3 style={{ marginBottom: '15px', color: 'var(--ifm-color-danger)' }}>{t.title}</h3>

      <form onSubmit={handleDelete}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder={t.emailPh} />
            </div>
            
            <div style={{ position: 'relative' }}>
                <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    style={{ ...inputStyle, paddingRight: '40px' }}
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

        <hr style={{ border: '0', borderTop: '1px dashed var(--ifm-color-emphasis-300)', margin: '10px 0' }} />

        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.lblCustomer}</label>
        <input type="text" required value={customerId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} placeholder={t.phCustomer} />

        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.lblKeyId}</label>
        <input type="text" required value={keyId} onChange={e => setKeyId(e.target.value)} style={inputStyle} placeholder={t.phKeyId} />

        <button type="submit" disabled={loading} className="button button--danger button--block">
          {loading ? etapa : t.btnSubmit}
        </button>
      </form>

      {resultado && (
        <div style={{ marginTop: '15px', padding: '10px', background: 'var(--ifm-pre-background)', borderRadius: '5px' }}>
          <strong>{t.statusLabel} </strong> 
          <span style={{ color: resultado.status >= 200 && resultado.status < 300 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)' }}>
             {resultado.status || t.statusError}
          </span>
          <pre style={{ margin: '5px 0 0 0', fontSize: '0.75rem' }}>{JSON.stringify(resultado.body || resultado, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
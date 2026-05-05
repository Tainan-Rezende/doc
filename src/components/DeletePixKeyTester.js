import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function DeletePixKeyTester() {
    const { i18n: { currentLocale } } = useDocusaurusContext();

    const i18n = {
        'pt-br': {
            title: 'Testar: Remover Chave Pix',
            step1: "1. Suas Credenciais",
            step2: "2. Qual chave deseja remover?",
            emailLabel: 'Email',
            passLabel: 'Senha',
            customerLabel: 'ID do Cliente (Customer ID)',
            keyLabel: 'ID da Chave Pix (Key ID)',
            noCustomer: 'Não possui cliente?',
            createLink: 'Clique aqui para criar.',
            noKey: 'Não sabe o ID da chave?',
            listLink: 'Liste as chaves cadastradas.',
            btnExecute: 'Deletar Chave Permanentemente',
            status: 'Status',
            detail: 'Detalhe',
            errorNet: 'Erro de Conexão',
            successMsg: 'Chave removida com sucesso.',
            noDetailsMsg: 'Resposta sem corpo detalhado.',
            stepAuth: 'Autenticando...',
            stepDelete: 'Removendo Chave...',
        },
        en: {
            title: 'Test: Remove Pix Key',
            step1: "1. Your Credentials",
            step2: "2. Which key do you want to remove?",
            emailLabel: 'Email',
            passLabel: 'Password',
            customerLabel: 'Customer ID',
            keyLabel: 'Pix Key ID',
            noCustomer: 'Don\'t have a client?',
            createLink: 'Click here to create.',
            noKey: 'Don\'t know the key ID?',
            listLink: 'List registered keys.',
            btnExecute: 'Delete Key Permanently',
            status: 'Status',
            detail: 'Detail',
            errorNet: 'Connection Error',
            successMsg: 'Key successfully removed.',
            noDetailsMsg: 'Response with no detailed body.',
            stepAuth: 'Authenticating...',
            stepDelete: 'Removing Key...',
        },
        es: {
            title: 'Probar: Eliminar Clave Pix',
            step1: "1. Sus Credenciales",
            step2: "2. ¿Qué clave desea eliminar?",
            emailLabel: 'Correo electrónico',
            passLabel: 'Contraseña',
            customerLabel: 'ID del Cliente',
            keyLabel: 'ID de la Clave Pix',
            noCustomer: '¿No tienes un cliente?',
            createLink: 'Haz clic aquí para crear.',
            noKey: '¿No conoces el ID de la clave?',
            listLink: 'Listar claves registradas.',
            btnExecute: 'Eliminar Clave Permanentemente',
            status: 'Estado',
            detail: 'Detalle',
            errorNet: 'Error de Conexión',
            successMsg: 'Clave eliminada con éxito.',
            noDetailsMsg: 'Respuesta sin cuerpo detallado.',
            stepAuth: 'Autenticando...',
            stepDelete: 'Eliminando Clave...',
        }
    };

    const t = i18n[currentLocale] || i18n.en;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [keyId, setKeyId] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState('');

    const handleDelete = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResultado(null);
        setEtapa(t.stepAuth);

        try {
            const baseUrl = 'https://api.xgateglobal.com';
            const authRes = await fetch(`${baseUrl}/auth/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const authData = await authRes.json();

            if (!authRes.ok || !authData.token) {
                setResultado({ status: authRes.status, body: authData });
                return;
            }

            setEtapa(t.stepDelete);
            const url = `${baseUrl}/pix/customer/${customerId}/key/remove/${keyId}`;
            
            const deleteRes = await fetch(url, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            });

            let deleteData;
            try {
                deleteData = await deleteRes.json();
            } catch (e) {
                deleteData = { message: deleteRes.ok ? t.successMsg : t.noDetailsMsg };
            }

            setResultado({ status: deleteRes.status, body: deleteData });
        } catch (error) {
            setResultado({ erro: t.errorNet, detalhe: error.message });
        } finally {
            setLoading(false);
            setEtapa('');
        }
    };

    const inputStyle = { width: '100%', padding: '10px', borderRadius: 'var(--ifm-global-radius)', border: '1px solid var(--ifm-color-emphasis-300)', backgroundColor: 'var(--ifm-background-surface-color)', color: 'var(--ifm-font-color-base)', fontSize: '0.9rem' };
    const hintStyle = { marginTop: '5px', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' };
    const toggleButtonStyle = { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--ifm-font-color-secondary)', zIndex: 2, display: 'flex', alignItems: 'center' };

    return (
        <div style={{ padding: '20px', border: '1px solid var(--ifm-color-danger-darkest)', borderRadius: 'var(--ifm-global-radius)', backgroundColor: 'var(--ifm-card-background-color)', boxShadow: 'var(--ifm-global-shadow-lw)', marginTop: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: 'var(--ifm-color-danger)' }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>🗑️</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--ifm-color-danger)' }}>{t.title}</h3>
            </div>

            <form onSubmit={handleDelete}>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.customerLabel}</label>
                        <input type="text" required value={customerId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} placeholder="Ex: 66e85..." />
                        <div style={hintStyle}>
                            {t.noCustomer} <a href={useBaseUrl('/docs/customer/create')} target="_blank" style={{fontWeight: 'bold'}}>{t.createLink}</a>
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.keyLabel}</label>
                        <input type="text" required value={keyId} onChange={e => setKeyId(e.target.value)} style={inputStyle} placeholder="Ex: 68fa5..." />
                        <div style={hintStyle}>
                            {t.noKey} <a href={useBaseUrl('/docs/pix/list-keys')} target="_blank" style={{fontWeight: 'bold'}}>{t.listLink}</a>
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="button button--danger button--block" style={{ marginBottom: '10px' }}>
                    {loading ? etapa : t.btnExecute}
                </button>
            </form>

            {resultado && (
                <div style={{ marginTop: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <strong>{t.status}:&nbsp;</strong>
                        <span style={{ fontWeight: 'bold', color: resultado.status >= 200 && resultado.status < 300 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)' }}>{resultado.status || 'Error'}</span>
                    </div>
                    {resultado.erro && (
                        <div style={{ color: 'var(--ifm-color-danger)', fontSize: '0.9rem', marginBottom: '10px' }}>
                            <strong>{t.detail}:</strong> {resultado.detalhe}
                        </div>
                    )}
                    <CodeBlock language="json">{JSON.stringify(resultado.body || resultado, null, 2)}</CodeBlock>
                </div>
            )}
        </div>
    );
}
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { verifyEmail, resendVerification } from '../../api/auth'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const navigate  = useNavigate()
  const { loginWithTokens } = useAuth()
  const token = params.get('token')

  const [state, setState] = useState('idle') // idle | loading | success | error
  const [message, setMessage]   = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [resendState, setResendState] = useState('idle') // idle | loading | sent | error
  const [resendMsg, setResendMsg]     = useState('')

  // Auto-verify when token is in URL
  useEffect(() => {
    if (!token) return
    setState('loading')
    verifyEmail(token)
      .then(({ data }) => {
        loginWithTokens(data.access, data.refresh, data.user)
        setState('success')
        setTimeout(() => navigate('/panel'), 2000)
      })
      .catch((err) => {
        setState('error')
        setMessage(err.response?.data?.detail || 'No se pudo verificar el email.')
      })
  }, [token]) // eslint-disable-line

  // Pre-fill email from registration
  useEffect(() => {
    const stored = sessionStorage.getItem('pending_verify_email')
    if (stored) setResendEmail(stored)
  }, [])

  const handleResend = async (e) => {
    e.preventDefault()
    setResendState('loading')
    try {
      const { data } = await resendVerification(resendEmail)
      setResendMsg(data.detail)
      setResendState('sent')
    } catch {
      setResendMsg('Error al reenviar. Inténtalo más tarde.')
      setResendState('error')
    }
  }

  // ── Verifying state (token in URL)
  if (token && state === 'loading') {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <Spinner />
          <p style={{ marginTop: 16, color: 'var(--muted)' }}>Verificando tu cuenta…</p>
        </div>
      </div>
    )
  }

  if (token && state === 'success') {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>¡Cuenta verificada!</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Redirigiendo al panel…</p>
        </div>
      </div>
    )
  }

  if (token && state === 'error') {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Enlace inválido</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>{message}</p>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Solicita un nuevo enlace:</p>
          <ResendForm
            email={resendEmail} setEmail={setResendEmail}
            onSubmit={handleResend} state={resendState} msg={resendMsg}
          />
        </div>
      </div>
    )
  }

  // ── Check inbox state (no token — just registered)
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📬</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Revisa tu email</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24, maxWidth: 340 }}>
          Hemos enviado un enlace de verificación a tu correo. Haz clic en el enlace para activar tu cuenta.
        </p>

        <div style={{ background: 'var(--blue-light)', borderRadius: 8, padding: '12px 16px', marginBottom: 28, textAlign: 'left', fontSize: 13, color: 'var(--blue-dark)' }}>
          <strong>¿No lo encuentras?</strong> Revisa la carpeta de <em>spam</em> o solicita un nuevo enlace.
        </div>

        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 10 }}>Reenviar enlace</p>
        <ResendForm
          email={resendEmail} setEmail={setResendEmail}
          onSubmit={handleResend} state={resendState} msg={resendMsg}
        />

        <p style={{ marginTop: 24, fontSize: 13, color: 'var(--muted)' }}>
          <Link to="/login" style={{ color: 'var(--blue)' }}>Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  )
}

function ResendForm({ email, setEmail, onSubmit, state, msg }) {
  return (
    <form onSubmit={onSubmit} style={{ width: '100%' }}>
      <input
        type="email" required value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="tu@email.com"
        style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: 14, outline: 'none', marginBottom: 10 }}
      />
      {msg && (
        <div style={{ fontSize: 13, marginBottom: 10, color: state === 'error' ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>
          {msg}
        </div>
      )}
      <Button type="submit" fullWidth disabled={state === 'loading' || state === 'sent'}>
        {state === 'loading' ? 'Enviando…' : state === 'sent' ? 'Enviado ✓' : 'Reenviar enlace'}
      </Button>
    </form>
  )
}

const pageStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }
const cardStyle = { background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', padding: '48px 40px', maxWidth: 440, width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }

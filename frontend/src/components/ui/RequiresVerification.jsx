import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from './Button'

/**
 * Wrap any interactive element to guard it behind email verification.
 *
 * Usage:
 *   <RequiresVerification>
 *     <button onClick={doSensitiveAction}>Reservar</button>
 *   </RequiresVerification>
 *
 * If the user IS verified, clicks pass through normally.
 * If NOT, a modal explains what they need to do and links to /panel/verificacion.
 */
export default function RequiresVerification({ children, message }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  if (user?.is_verified) return children

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowModal(true)
  }

  return (
    <>
      <div onClick={handleClick} style={{ display: 'contents', cursor: 'pointer' }}>
        {children}
      </div>

      {showModal && (
        <div style={overlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: 'var(--foreground)' }}>
              Verifica tu email primero
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 24 }}>
              {message || 'Para realizar esta acción necesitas verificar tu dirección de email.'}
              {' '}Revisa tu bandeja de entrada o solicita un nuevo enlace.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button onClick={() => { setShowModal(false); navigate('/panel/verificacion') }}>
                Ir a verificación
              </Button>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const overlayStyle = {
  position: 'fixed', inset: 0, zIndex: 1000,
  background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 24,
}
const modalStyle = {
  background: 'var(--white)', borderRadius: 'var(--radius)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
  padding: '40px 36px', maxWidth: 400, width: '100%', textAlign: 'center',
}

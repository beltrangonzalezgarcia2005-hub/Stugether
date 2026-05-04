import { useState, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDocuments, uploadDocument, resendVerification } from '../../../api/auth'
import { useAuth } from '../../../contexts/AuthContext'
import Spinner from '../../../components/ui/Spinner'
import Button from '../../../components/ui/Button'

// ── Doc type definitions per role ──────────────────────────────────────────
const STUDENT_DOCS = [
  { value: 'DNI',        label: 'DNI / Pasaporte',         icon: '🪪', desc: 'Documento de identidad oficial' },
  { value: 'ENROLLMENT', label: 'Carnet universitario',    icon: '🎓', desc: 'Acreditación de matrícula vigente' },
  { value: 'CONTRACT',   label: 'Contrato de arrendamiento', icon: '📋', desc: 'Contrato del piso actual o anterior' },
]
const OWNER_DOCS = [
  { value: 'DNI',            label: 'DNI / Pasaporte',                  icon: '🪪', desc: 'Documento de identidad oficial del propietario' },
  { value: 'PROPERTY_TITLE', label: 'Título de propiedad / Autorización', icon: '🏠', desc: 'Escritura o autorización de gestión del inmueble' },
]

const STATUS_CONFIG = {
  PENDING:   { label: 'Sin subir',      color: 'var(--muted)', bg: 'var(--border)' },
  IN_REVIEW: { label: 'En revisión ⏳', color: 'var(--amber)', bg: 'var(--amber-bg)' },
  APPROVED:  { label: 'Verificado ✓',  color: 'var(--green)', bg: 'var(--green-bg)' },
  REJECTED:  { label: 'Rechazado ✗',   color: 'var(--red)',   bg: 'var(--red-bg)' },
}

// ── Drop zone for file upload ───────────────────────────────────────────────
function DropZone({ onFile, disabled }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }, [onFile])

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current.click()}
      style={{
        border: `2px dashed ${dragging ? 'var(--blue)' : 'var(--border)'}`,
        borderRadius: 8, padding: '18px 14px', textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: dragging ? 'var(--blue-light)' : 'transparent',
        opacity: disabled ? 0.5 : 1, transition: 'all .15s',
      }}
    >
      <div style={{ fontSize: 26, marginBottom: 4 }}>📎</div>
      <div style={{ fontSize: 13, color: 'var(--muted)' }}>
        Arrastra aquí o <span style={{ color: 'var(--blue)', fontWeight: 600 }}>selecciona archivo</span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>PDF, JPG o PNG · máx. 10 MB</div>
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
        onChange={e => { if (e.target.files[0]) { onFile(e.target.files[0]); e.target.value = '' } }}
        disabled={disabled} />
    </div>
  )
}

// ── Email verification section ──────────────────────────────────────────────
function EmailVerificationSection({ user }) {
  const [resendState, setResendState] = useState('idle') // idle | loading | sent | error
  const [resendMsg, setResendMsg] = useState('')

  const handleResend = async () => {
    setResendState('loading')
    try {
      const { data } = await resendVerification(user.email)
      setResendMsg(data.detail)
      setResendState('sent')
    } catch {
      setResendMsg('Error al reenviar. Inténtalo más tarde.')
      setResendState('error')
    }
  }

  if (user?.is_verified) {
    return (
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={checkCircle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--green)' }}>Email verificado</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{user.email}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...sectionStyle, border: '1.5px solid #FDE68A', background: '#FFFBEB' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ ...checkCircle, background: '#F59E0B', flexShrink: 0 }}>
          <span style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>!</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#B45309', marginBottom: 4 }}>
            Email pendiente de verificación
          </div>
          <div style={{ fontSize: 13, color: '#92400E', marginBottom: 16, lineHeight: 1.5 }}>
            Hemos enviado un enlace de verificación a <strong>{user.email}</strong>.
            Haz clic en él para activar tu cuenta. Revisa también la carpeta de <em>spam</em>.
          </div>
          {resendMsg && (
            <div style={{
              fontSize: 13, marginBottom: 12, fontWeight: 600,
              color: resendState === 'error' ? 'var(--red)' : '#B45309',
            }}>
              {resendMsg}
            </div>
          )}
          <Button
            onClick={handleResend}
            disabled={resendState === 'loading' || resendState === 'sent'}
          >
            {resendState === 'loading' ? 'Enviando…' : resendState === 'sent' ? 'Enviado ✓' : 'Reenviar enlace de verificación'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Document card ───────────────────────────────────────────────────────────
function DocCard({ docDef, doc, onUpload, uploading }) {
  const { value, label, icon, desc } = docDef
  const st = doc ? STATUS_CONFIG[doc.status] : STATUS_CONFIG.PENDING

  return (
    <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ fontSize: 36, lineHeight: 1 }}>{icon}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{label}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{desc}</div>
        </div>
      </div>

      {doc && (
        <>
          <span style={{ background: st.bg, color: st.color, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600, display: 'inline-block', alignSelf: 'flex-start' }}>
            {st.label}
          </span>
          {doc.status === 'IN_REVIEW' && (
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
              🕐 En revisión. Tiempo estimado: <strong>24-48h laborables</strong>.
            </p>
          )}
          {doc.rejection_reason && (
            <div style={{ background: 'var(--red-bg)', color: 'var(--red)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
              <strong>Motivo del rechazo:</strong> {doc.rejection_reason}
            </div>
          )}
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            Subido: {new Date(doc.uploaded_at).toLocaleDateString('es-ES')}
          </div>
        </>
      )}

      {(!doc || doc.status !== 'APPROVED') && (
        <>
          <DropZone
            onFile={file => onUpload(file, value)}
            disabled={uploading === value}
          />
          {uploading === value && <div style={{ fontSize: 12, color: 'var(--blue)' }}>⏳ Subiendo…</div>}
        </>
      )}
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function Verification() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [uploading, setUploading] = useState(null)
  const [toast, setToast] = useState(null)

  const { data, isLoading } = useQuery({ queryKey: ['documents'], queryFn: getDocuments })
  const docs = data?.data?.results || data?.data || []

  const docTypes = user?.role === 'OWNER' ? OWNER_DOCS : STUDENT_DOCS

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const upload = useMutation({
    mutationFn: ({ file, docType }) => {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('doc_type', docType)
      return uploadDocument(fd)
    },
    onSuccess: () => { qc.invalidateQueries(['documents']); showToast('Documento enviado. Revisión en 24-48h.'); setUploading(null) },
    onError: () => { showToast('Error al subir el archivo.', 'error'); setUploading(null) },
  })

  const handleUpload = (file, docType) => {
    setUploading(docType)
    upload.mutate({ file, docType })
  }

  if (isLoading) return <Spinner />

  const approvedCount = docTypes.filter(d => docs.find(doc => doc.doc_type === d.value)?.status === 'APPROVED').length
  const allDocsVerified = approvedCount === docTypes.length
  const emailVerified = user?.is_verified

  // Overall progress: email (1 step) + each doc
  const totalSteps = 1 + docTypes.length
  const doneSteps = (emailVerified ? 1 : 0) + approvedCount
  const progress = Math.round((doneSteps / totalSteps) * 100)

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Verificación de cuenta</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 28, fontSize: 14 }}>
        Completa los pasos de verificación para acceder a todas las funcionalidades de Stuguether.
      </p>

      {/* Progress bar */}
      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Progreso de verificación</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--blue)' }}>{doneSteps}/{totalSteps} pasos</span>
        </div>
        <div style={{ height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: progress === 100 ? 'var(--green)' : 'var(--blue)', borderRadius: 5, transition: 'width .4s' }} />
        </div>
        {progress === 100 && (
          <div style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: 'var(--green)' }}>
            ✅ Cuenta completamente verificada
          </div>
        )}
      </div>

      {/* Email verification */}
      <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5 }}>
        Paso 1 — Email
      </h2>
      <EmailVerificationSection user={user} />

      {/* Document verification */}
      <h2 style={{ fontSize: 15, fontWeight: 700, margin: '28px 0 12px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5 }}>
        {user?.role === 'OWNER' ? 'Paso 2 — Documentos KYC' : 'Paso 2 — Documentos académicos'}
      </h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        La revisión de documentos tarda <strong>24-48h laborables</strong>. Cumple con la normativa RGPD/LOPD.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16, marginBottom: 24 }}>
        {docTypes.map(docDef => (
          <DocCard
            key={docDef.value}
            docDef={docDef}
            doc={docs.find(d => d.doc_type === docDef.value)}
            onUpload={handleUpload}
            uploading={uploading}
          />
        ))}
      </div>

      {/* Privacy notice */}
      <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '14px 18px', fontSize: 13, color: 'var(--muted)', display: 'flex', gap: 8 }}>
        <span>🔒</span>
        <span>
          <strong>Privacidad:</strong> Tus documentos se cifran en reposo y solo son accesibles por el equipo de revisión.
          Cumplimos con el <strong>RGPD</strong>.
        </span>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: toast.type === 'success' ? 'var(--green)' : 'var(--red)',
          color: 'white', borderRadius: 10, padding: '12px 18px', fontSize: 14, fontWeight: 600,
          boxShadow: '0 4px 16px rgba(0,0,0,.15)',
        }}>
          {toast.type === 'success' ? '✓ ' : '✗ '}{toast.msg}
        </div>
      )}
    </div>
  )
}

const sectionStyle = {
  background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)',
  padding: '20px 24px', marginBottom: 8,
}
const checkCircle = {
  width: 44, height: 44, borderRadius: '50%', background: 'var(--green)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}

import { useRef, useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDocuments, uploadDocument } from '../../../api/auth'
import Spinner from '../../../components/ui/Spinner'
import Button from '../../../components/ui/Button'

const DOC_TYPES = [
  { value:'DNI',        label:'DNI / Pasaporte',            icon:'🪪', desc:'Documento de identidad oficial. Debes subir una foto del anverso y otra del reverso en un mismo documento.' },
  { value:'ENROLLMENT', label:'Matrícula universitaria',     icon:'🎓', desc:'Justificante de matrícula del curso actual. Solo es necesario subir una foto del documento' },
  { value:'IBAN',       label:'IBAN domiciliación',          icon:'🏦', desc:'Número de cuenta para pagos automáticos' },
  { value:'CONTRACT', label:'Contrato de arrendamiento', icon:'📄', desc:'Contrato de alquiler del piso que quieres compartir. Acredita que eres el inquilino principal.' },
]

const STATUS = {
  PENDING:   { label:'Pendiente de envío',  color:'var(--muted)',  bg:'var(--border)' },
  IN_REVIEW: { label:'En revisión ⏳',       color:'var(--amber)',  bg:'var(--amber-bg)' },
  APPROVED:  { label:'Aprobado ✓',          color:'var(--green)',  bg:'var(--green-bg)' },
  REJECTED:  { label:'Rechazado ✗',         color:'var(--red)',    bg:'var(--red-bg)' },
}

function Toast({ toasts }) {
  return (
    <div style={{ position:'fixed', bottom:24, right:24, display:'flex', flexDirection:'column', gap:10, zIndex:9999 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'success' ? 'var(--green)' : 'var(--red)',
          color:'white', borderRadius:10, padding:'12px 18px', fontSize:14, fontWeight:600,
          boxShadow:'0 4px 16px rgba(0,0,0,.15)', minWidth:240,
          animation:'fadeInUp .2s ease',
        }}>
          {t.type === 'success' ? '✓ ' : '✗ '}{t.message}
        </div>
      ))}
    </div>
  )
}

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
      onClick={() => inputRef.current.click()}
      style={{
        border: `2px dashed ${dragging ? 'var(--blue)' : 'var(--border)'}`,
        borderRadius:8, padding:'20px 16px', textAlign:'center', cursor:'pointer',
        background: dragging ? 'var(--blue-light)' : 'transparent',
        transition:'all .15s',
      }}
    >
      <div style={{ fontSize:28, marginBottom:6 }}>📎</div>
      <div style={{ fontSize:13, color:'var(--muted)' }}>
        Arrastra aquí o <span style={{ color:'var(--blue)', fontWeight:600 }}>selecciona archivo</span>
      </div>
      <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>PDF, JPG o PNG · máx. 10 MB</div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display:'none' }}
        onChange={e => { if (e.target.files[0]) { onFile(e.target.files[0]); e.target.value = '' } }}
        disabled={disabled}
      />
    </div>
  )
}

export default function Documents() {
  const qc = useQueryClient()
  const [toasts, setToasts] = useState([])
  const [uploading, setUploading] = useState(null)

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  const { data, isLoading } = useQuery({ queryKey:['documents'], queryFn: getDocuments })
  const docs = data?.data?.results || []

  const upload = useMutation({
    mutationFn: ({ file, docType }) => {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('doc_type', docType)
      return uploadDocument(fd)
    },
    onSuccess: (_, { docType }) => {
      qc.invalidateQueries(['documents'])
      const label = DOC_TYPES.find(d => d.value === docType)?.label || docType
      addToast(`${label} enviado. Revisión en 24-48h.`, 'success')
      setUploading(null)
    },
    onError: () => {
      addToast('Error al subir el documento. Inténtalo de nuevo.', 'error')
      setUploading(null)
    },
  })

  if (isLoading) return <Spinner />

  const approvedCount = DOC_TYPES.filter(({ value }) =>
    docs.some(d => d.doc_type === value && d.status === 'APPROVED')
  ).length
  const total = DOC_TYPES.length
  const pct = Math.round(approvedCount / total * 100)

  return (
    <div>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Mis documentos</h1>
      <p style={{ color:'var(--muted)', marginBottom:16 }}>
        Verifica tu identidad para acceder a todas las funciones. La revisión tarda <strong>24-48 horas laborables</strong>.
      </p>

      {/* Progress */}
      <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:20, marginBottom:28, display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ position:'relative', width:64, height:64, flexShrink:0 }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" strokeWidth="5" />
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--blue)" strokeWidth="5"
              strokeDasharray={`${2 * Math.PI * 28 * pct / 100} 999`}
              strokeLinecap="round" transform="rotate(-90 32 32)" />
          </svg>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'var(--blue)' }}>
            {pct}%
          </div>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:700 }}>
            {pct === 100 ? '🎉 Perfil completamente verificado' : `Verificación al ${pct}%`}
          </div>
          <div style={{ fontSize:13, color:'var(--muted)', marginTop:2 }}>
            {approvedCount} de {total} documentos aprobados.{' '}
            {approvedCount < total && 'Completa tu perfil para acceder a todas las funciones.'}
          </div>
          {docs.some(d => d.status === 'IN_REVIEW') && (
            <div style={{ fontSize:12, color:'var(--amber)', marginTop:6, fontWeight:600 }}>
              ⏳ Tienes documentos en revisión — te notificaremos en 24-48h.
            </div>
          )}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
        {DOC_TYPES.map(({ value, label, icon, desc }) => {
          const doc = docs.find(d => d.doc_type === value)
          const st = doc ? STATUS[doc.status] : null
          const isUploadingThis = uploading === value

          return (
            <div key={value} style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:22, display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                <div style={{ fontSize:32, lineHeight:1 }}>{icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{label}</div>
                  <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{desc}</div>
                </div>
              </div>

              {doc ? (
                <div>
                  <span style={{ background:st.bg, color:st.color, borderRadius:20, padding:'3px 10px', fontSize:12, fontWeight:600, display:'inline-block', marginBottom:10 }}>
                    {st.label}
                  </span>

                  {doc.status === 'IN_REVIEW' && (
                    <p style={{ fontSize:12, color:'var(--muted)', marginBottom:10, display:'flex', gap:6, alignItems:'flex-start' }}>
                      <span>🕐</span>
                      <span>Tu documento está siendo revisado por el equipo de Stugether. Tiempo estimado: <strong>24-48h laborables</strong>.</span>
                    </p>
                  )}

                  {doc.rejection_reason && (
                    <div style={{ fontSize:12, color:'var(--red)', marginBottom:10, padding:'8px 12px', background:'var(--red-bg)', borderRadius:8 }}>
                      <strong>Motivo del rechazo:</strong> {doc.rejection_reason}
                    </div>
                  )}

                  <div style={{ fontSize:12, color:'var(--muted)', marginBottom:12 }}>
                    Enviado: {new Date(doc.uploaded_at).toLocaleDateString('es-ES')}
                    {doc.reviewed_at && ` · Revisado: ${new Date(doc.reviewed_at).toLocaleDateString('es-ES')}`}
                  </div>

                  {doc.status !== 'APPROVED' && (
                    <DropZone
                      onFile={file => { setUploading(value); upload.mutate({ file, docType: value }) }}
                      disabled={isUploadingThis}
                    />
                  )}
                  {isUploadingThis && (
                    <div style={{ fontSize:12, color:'var(--blue)', marginTop:8 }}>⏳ Subiendo…</div>
                  )}
                </div>
              ) : (
                <div>
                  <DropZone
                    onFile={file => { setUploading(value); upload.mutate({ file, docType: value }) }}
                    disabled={isUploadingThis}
                  />
                  {isUploadingThis && (
                    <div style={{ fontSize:12, color:'var(--blue)', marginTop:8 }}>⏳ Subiendo…</div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ background:'var(--bg)', borderRadius:'var(--radius)', padding:'16px 20px', marginTop:24, fontSize:13, color:'var(--muted)', display:'flex', gap:8 }}>
        <span>🔒</span>
        <span>
          <strong>Privacidad y seguridad:</strong> Tus documentos se transmiten por HTTPS y se almacenan con cifrado en reposo.
          Solo el equipo de verificación de Stugether tiene acceso. Cumplimos con el <strong>RGPD / LOPD</strong>.{' '}
          <a href="#" style={{ color:'var(--blue)' }}>Política de privacidad</a>
          {' · '}
          <a href="#" style={{ color:'var(--blue)' }}>Términos de servicio</a>
        </span>
      </div>

      <Toast toasts={toasts} />

      <style>{`
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  )
}

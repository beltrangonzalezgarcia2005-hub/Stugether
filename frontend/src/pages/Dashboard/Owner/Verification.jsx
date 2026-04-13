import { useState, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDocuments, uploadDocument } from '../../../api/auth'
import Spinner from '../../../components/ui/Spinner'

const DOC_TYPES = [
  { value:'DNI',            label:'DNI / Pasaporte',                  icon:'🪪', desc:'Documento de identidad oficial del propietario' },
  { value:'PROPERTY_TITLE', label:'Título de propiedad / Autorización', icon:'🏠', desc:'Escritura o autorización de gestión del inmueble' },
]

const STATUS = {
  PENDING:   { label:'Sin subir',      color:'var(--muted)',  bg:'var(--border)' },
  IN_REVIEW: { label:'En revisión ⏳', color:'var(--amber)',  bg:'var(--amber-bg)' },
  APPROVED:  { label:'Verificado ✓',  color:'var(--green)',  bg:'var(--green-bg)' },
  REJECTED:  { label:'Rechazado ✗',   color:'var(--red)',    bg:'var(--red-bg)' },
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
        borderRadius:8, padding:'18px 14px', textAlign:'center', cursor:'pointer',
        background: dragging ? 'var(--blue-light)' : 'transparent', transition:'all .15s',
      }}
    >
      <div style={{ fontSize:26, marginBottom:4 }}>📎</div>
      <div style={{ fontSize:13, color:'var(--muted)' }}>
        Arrastra aquí o <span style={{ color:'var(--blue)', fontWeight:600 }}>selecciona archivo</span>
      </div>
      <div style={{ fontSize:11, color:'var(--muted)', marginTop:3 }}>PDF, JPG o PNG</div>
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display:'none' }}
        onChange={e => { if (e.target.files[0]) { onFile(e.target.files[0]); e.target.value = '' } }}
        disabled={disabled} />
    </div>
  )
}

export default function Verification() {
  const qc = useQueryClient()
  const [uploading, setUploading] = useState(null)
  const [toast, setToast] = useState(null)

  const { data, isLoading } = useQuery({ queryKey:['documents'], queryFn: getDocuments })
  const docs = data?.data?.results || []

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

  if (isLoading) return <Spinner />

  const allVerified = DOC_TYPES.every(d => docs.find(doc => doc.doc_type === d.value)?.status === 'APPROVED')

  return (
    <div>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Verificación KYC</h1>
      <p style={{ color:'var(--muted)', marginBottom:28 }}>
        Para publicar pisos en Stugether debes verificar tu identidad. La revisión tarda <strong>24-48h laborables</strong>.
        Este proceso cumple con la normativa RGPD / LOPD.
      </p>

      <div style={{
        background: allVerified ? 'var(--green-bg)' : 'var(--amber-bg)',
        borderRadius:'var(--radius)', padding:'16px 20px', marginBottom:28, display:'flex', alignItems:'center', gap:12,
      }}>
        <span style={{ fontSize:24 }}>{allVerified ? '✅' : '⏳'}</span>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color: allVerified ? 'var(--green)' : 'var(--amber)' }}>
            {allVerified ? 'Cuenta verificada — puedes publicar pisos' : 'Verificación pendiente'}
          </div>
          <div style={{ fontSize:13, color:'var(--muted)' }}>
            {allVerified
              ? 'Todos tus documentos han sido validados.'
              : 'Sube los documentos requeridos. Te avisaremos cuando sean aprobados.'}
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:16 }}>
        {DOC_TYPES.map(({ value, label, icon, desc }) => {
          const doc = docs.find(d => d.doc_type === value)
          const st = doc ? STATUS[doc.status] : STATUS.PENDING
          const isUploadingThis = uploading === value

          return (
            <div key={value} style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:24, display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'flex', gap:12 }}>
                <div style={{ fontSize:36, lineHeight:1 }}>{icon}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700 }}>{label}</div>
                  <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{desc}</div>
                </div>
              </div>

              {doc && (
                <>
                  <span style={{ background:st.bg, color:st.color, borderRadius:20, padding:'3px 10px', fontSize:12, fontWeight:600, display:'inline-block' }}>
                    {st.label}
                  </span>
                  {doc.status === 'IN_REVIEW' && (
                    <p style={{ fontSize:12, color:'var(--muted)', margin:0 }}>
                      🕐 En revisión. Tiempo estimado: <strong>24-48h laborables</strong>.
                    </p>
                  )}
                  {doc.rejection_reason && (
                    <div style={{ background:'var(--red-bg)', color:'var(--red)', borderRadius:8, padding:'10px 14px', fontSize:13 }}>
                      <strong>Motivo:</strong> {doc.rejection_reason}
                    </div>
                  )}
                  <div style={{ fontSize:12, color:'var(--muted)' }}>
                    Subido: {new Date(doc.uploaded_at).toLocaleDateString('es-ES')}
                  </div>
                </>
              )}

              {(!doc || doc.status !== 'APPROVED') && (
                <>
                  <DropZone
                    onFile={file => { setUploading(value); upload.mutate({ file, docType: value }) }}
                    disabled={isUploadingThis}
                  />
                  {isUploadingThis && <div style={{ fontSize:12, color:'var(--blue)' }}>⏳ Subiendo…</div>}
                </>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ background:'var(--bg)', borderRadius:'var(--radius)', padding:'16px 20px', marginTop:24, fontSize:13, color:'var(--muted)', display:'flex', gap:8 }}>
        <span>🔒</span>
        <span>
          <strong>Privacidad:</strong> Tus documentos se cifran en reposo y solo son accesibles por el equipo de revisión.
          Cumplimos con el <strong>RGPD</strong>.{' '}
          <a href="#" style={{ color:'var(--blue)' }}>Política de privacidad</a>
        </span>
      </div>

      {toast && (
        <div style={{
          position:'fixed', bottom:24, right:24, zIndex:9999,
          background: toast.type === 'success' ? 'var(--green)' : 'var(--red)',
          color:'white', borderRadius:10, padding:'12px 18px', fontSize:14, fontWeight:600,
          boxShadow:'0 4px 16px rgba(0,0,0,.15)',
        }}>
          {toast.type === 'success' ? '✓ ' : '✗ '}{toast.msg}
        </div>
      )}
    </div>
  )
}

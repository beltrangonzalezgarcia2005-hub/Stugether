import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMe, updateMe } from '../../../api/auth'
import client from '../../../api/client'
import Button from '../../../components/ui/Button'
import Spinner from '../../../components/ui/Spinner'
import UniversitySelector from '../../../components/ui/UniversitySelector'

const HABITS = [
  { key: 'NO_SMOKER',   label: 'No fumador',   icon: '🚭' },
  { key: 'PET_FRIENDLY',label: 'Pet friendly',  icon: '🐾' },
  { key: 'STUDIOUS',    label: 'Estudioso',     icon: '📚' },
  { key: 'SOCIAL',      label: 'Social',        icon: '🎉' },
  { key: 'EARLY_RISER', label: 'Madrugador',    icon: '☀️' },
  { key: 'SPORTY',      label: 'Deportista',    icon: '⚽' },
  { key: 'TIDY',        label: 'Ordenado',      icon: '✨' },
]

function VerificationStatus({ user, docs }) {
  const sp = user?.student_profile
  const emailOk    = !!user?.is_verified
  const phoneOk    = !!user?.phone
  const enrollOk   = sp?.enrollment_verified
  const dniOk      = docs?.some(d => d.doc_type === 'DNI' && d.status === 'APPROVED')
  const contractOk = docs?.some(d => d.doc_type === 'CONTRACT' && d.status === 'APPROVED')

  const items = [
    { label: 'Email verificado',             done: emailOk,    action: null },
    { label: 'Teléfono verificado',          done: phoneOk,    action: '/panel/configuracion' },
    { label: 'Carnet universitario',         done: enrollOk,   action: '/panel/documentos' },
    { label: 'Documento de identidad',       done: dniOk,      action: '/panel/documentos' },
    { label: 'Contrato de arrendamiento',    done: contractOk, action: '/panel/documentos' },
  ]
  const progress = Math.round((items.filter(i => i.done).length / items.length) * 100)

  return (
    <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Estado de Verificación</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>Progreso de verificación</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>{progress}%</span>
      </div>
      <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--blue)', borderRadius: 4, transition: 'width .4s' }} />
      </div>
      {items.map(({ label, done, action }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: done ? 'var(--green-bg)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {done
              ? <span style={{ color: 'var(--green)', fontSize: 13, fontWeight: 700 }}>✓</span>
              : <span style={{ color: 'var(--muted)', fontSize: 11 }}>○</span>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: done ? 600 : 400, color: done ? 'var(--text)' : 'var(--muted)' }}>{label}</div>
          </div>
          {!done && action && (
            <a href={action} style={{ fontSize: 12, fontWeight: 700, color: 'white', background: 'var(--blue)', padding: '4px 12px', borderRadius: 20, textDecoration: 'none' }}>
              Completar
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Profile() {
  const qc = useQueryClient()
  const fileInputRef = useRef()
  const [editing, setEditing] = useState(false)
  const [saved, setSaved]     = useState(false)
  const [form, setForm]       = useState(null)

  const { data, isLoading } = useQuery({ queryKey: ['me'], queryFn: getMe })
  const user = data?.data
  const sp   = user?.student_profile

  const { data: docsData } = useQuery({
    queryKey: ['documents'],
    queryFn: () => client.get('/auth/documents/'),
  })
  const docs = docsData?.data?.results || docsData?.data || []

  const save = useMutation({
    mutationFn: (payload) => updateMe(payload),
    onSuccess: () => {
      qc.invalidateQueries(['me'])
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  const startEdit = () => {
    setForm({
      first_name:  user?.first_name  || '',
      last_name:   user?.last_name   || '',
      phone:       user?.phone       || '',
      bio:         user?.bio         || '',
      university:  sp?.university    || '',
      degree:      sp?.degree        || '',
      age:         sp?.age           || '',
      course:      sp?.course        || '',
      city:        sp?.city          || '',
      roommate_bio: sp?.roommate_bio || '',
      habits:      sp?.habits        || [],
    })
    setEditing(true)
  }

  const toggleHabit = (key) =>
    setForm(f => ({ ...f, habits: f.habits.includes(key) ? f.habits.filter(h => h !== key) : [...f.habits, key] }))

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('avatar', file)
    await client.patch('/auth/me/', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    qc.invalidateQueries(['me'])
  }

  const handleSubmit = () => {
    const payload = { ...form }
    if (!payload.age) payload.age = null
    if (!payload.course) payload.course = null
    if (typeof payload.university === 'object' && payload.university !== null) {
      payload.university = payload.university.universityName || ''
    }
    save.mutate(payload)
  }

  if (isLoading) return <Spinner />

  const avatarUrl = user?.avatar
  const initials  = `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Mi Perfil</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>Así te ven otros estudiantes</p>
        </div>
        {!editing
          ? <Button onClick={startEdit}>Editar Perfil</Button>
          : <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={save.isPending}>{save.isPending ? 'Guardando…' : 'Guardar'}</Button>
            </div>}
      </div>

      {saved && (
        <div style={{ background: 'var(--green-bg)', color: 'var(--green)', borderRadius: 8, padding: '12px 16px', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
          Perfil actualizado correctamente.
        </div>
      )}

      {/* Profile card */}
      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ height: 100, background: 'linear-gradient(135deg,#60A5FA,#2563EB)' }} />
        <div style={{ padding: '0 28px 24px', marginTop: -36 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid white', overflow: 'hidden', background: 'linear-gradient(135deg,#60A5FA,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {avatarUrl
                  ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>{initials}</span>}
              </div>
              {editing && (
                <>
                  <button type="button" onClick={() => fileInputRef.current.click()}
                    style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--blue)', border: '2px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white' }}>
                    ✎
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                </>
              )}
            </div>
            {user?.is_verified && (
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', background: 'var(--green-bg)', padding: '4px 10px', borderRadius: 20 }}>✓ Verificado</span>
            )}
          </div>
          {editing ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input style={inputStyle} value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Apellidos</label>
                <input style={inputStyle} value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{user?.first_name} {user?.last_name}</div>
              {sp?.university && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>🎓 {sp.university}</div>}
              {sp?.city && <div style={{ fontSize: 13, color: 'var(--muted)' }}>📍 {sp.city}</div>}
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 20 }}>

          {/* Academic info */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🎓 Información Académica</h2>
            {editing ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Edad</label><input style={inputStyle} type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} /></div>
                <div><label style={labelStyle}>Curso</label><input style={inputStyle} type="number" min="1" max="6" value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} /></div>
                <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>Grado / Carrera</label><input style={inputStyle} value={form.degree} onChange={e => setForm(f => ({ ...f, degree: e.target.value }))} /></div>
                <div style={{ gridColumn: '1/-1' }}>
                  <UniversitySelector
                    value={form.university}
                    onChange={val => setForm(f => ({ ...f, university: val }))}
                  />
                </div>

                <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>Ciudad</label><input style={inputStyle} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
                <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>Teléfono</label><input style={inputStyle} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'EDAD',        value: sp?.age ? `${sp.age} años` : '—' },
                  { label: 'GRADO',       value: sp?.degree || '—' },
                  { label: 'CURSO',       value: sp?.course ? `${sp.course}º Curso` : '—' },
                  { label: 'UNIVERSIDAD', value: sp?.university || '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sobre mí */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>💬 Sobre mí</h2>
            {editing ? (
              <>
                <label style={labelStyle}>Preséntate</label>
                <textarea rows={4} style={{ ...inputStyle, resize: 'vertical', marginBottom: 12 }} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                <label style={labelStyle}>Lo que busco en un compañero de piso</label>
                <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={form.roommate_bio} onChange={e => setForm(f => ({ ...f, roommate_bio: e.target.value }))} />
              </>
            ) : (
              <>
                {user?.bio
                  ? <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)', marginBottom: 16 }}>{user.bio}</p>
                  : <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>Añade una presentación personal.</p>}
                {sp?.roommate_bio && (
                  <div style={{ background: 'var(--blue-light)', borderRadius: 8, padding: '12px 16px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', marginBottom: 6 }}>Lo que busco en un compañero de piso</div>
                    <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>{sp.roommate_bio}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          {/* Lifestyle */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🏡 Lifestyle & Convivencia</h2>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>Mis hábitos y preferencias de convivencia</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {HABITS.map(({ key, label, icon }) => {
                const active = editing ? form.habits.includes(key) : sp?.habits?.includes(key)
                if (!editing && !active) return null
                return (
                  <div key={key}
                    onClick={() => editing && toggleHabit(key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                      borderRadius: 20, fontSize: 13, fontWeight: active ? 600 : 400,
                      background: active ? 'var(--blue-light)' : 'var(--bg)',
                      border: `1.5px solid ${active ? 'var(--blue)' : 'var(--border)'}`,
                      color: active ? 'var(--blue)' : 'var(--muted)',
                      cursor: editing ? 'pointer' : 'default',
                      transition: 'all .15s',
                    }}>
                    {icon} {label}
                  </div>
                )
              })}
              {!editing && !sp?.habits?.length && (
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>No has añadido hábitos todavía.</p>
              )}
            </div>
          </div>

          {/* Verification */}
          <VerificationStatus user={user} docs={docs} />
        </div>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--muted)', marginBottom: 6 }
const inputStyle = { width: '100%', boxSizing: 'border-box', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '9px 12px', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'var(--white)' }

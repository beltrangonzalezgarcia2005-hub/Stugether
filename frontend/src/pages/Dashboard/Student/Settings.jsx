import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { updateMe, changePassword, deleteAccount } from '../../../api/auth'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import UniversitySelector from '../../../components/ui/UniversitySelector'

// ─── Toggle switch ────────────────────────────────────────────────────────────
function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      style={{
        position: 'relative',
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: checked ? 'var(--blue)' : 'var(--border)',
        transition: 'background .2s',
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'var(--white)',
          boxShadow: '0 1px 3px rgba(0,0,0,.2)',
          transition: 'left .2s',
        }}
      />
    </button>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow)',
      padding: 24,
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Label style helper ───────────────────────────────────────────────────────
const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: .5,
  color: 'var(--muted)',
  marginBottom: 6,
}

// ─── Saved flash ─────────────────────────────────────────────────────────────
function SavedFlash({ show }) {
  if (!show) return null
  return <span style={{ marginLeft: 12, color: 'var(--green)', fontSize: 14, fontWeight: 600 }}>✓ Guardado</span>
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: PERFIL
// ═══════════════════════════════════════════════════════════════════════════════
function PerfilTab() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [savedPersonal, setSavedPersonal] = useState(false)
  const [savedAcademic, setSavedAcademic] = useState(false)

  const { register: regPersonal, handleSubmit: submitPersonal } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name:  user?.last_name  || '',
      phone:      user?.phone      || '',
      bio:        user?.bio        || '',
    },
  })

  const { register: regAcademic, handleSubmit: submitAcademic, control: controlAcademic } = useForm({
    defaultValues: {
      university: user?.student_profile?.university || '',
      degree:     user?.student_profile?.degree     || '',
    },
  })

  const flash = (setter) => {
    setter(true)
    setTimeout(() => setter(false), 3000)
  }

  const updatePersonal = useMutation({
    mutationFn: updateMe,
    onSuccess: () => { qc.invalidateQueries(['me']); flash(setSavedPersonal) },
  })

  const updateAcademic = useMutation({
    mutationFn: updateMe,
    onSuccess: () => { qc.invalidateQueries(['me']); flash(setSavedAcademic) },
  })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 840 }}>
      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Datos personales</h2>
        <form onSubmit={submitPersonal(d => updatePersonal.mutate(d))}>
          <Input label="Nombre"    {...regPersonal('first_name', { required: true })} />
          <Input label="Apellidos" {...regPersonal('last_name',  { required: true })} />
          <Input label="Teléfono" type="tel" placeholder="+34 600 000 000" {...regPersonal('phone')} />
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Bio</label>
            <textarea
              rows={3}
              placeholder="Cuéntanos algo sobre ti…"
              style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
              {...regPersonal('bio')}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button type="submit" disabled={updatePersonal.isPending}>
              {updatePersonal.isPending ? 'Guardando…' : 'Guardar cambios'}
            </Button>
            <SavedFlash show={savedPersonal} />
          </div>
        </form>
      </Card>

      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Datos académicos</h2>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
          Añade dónde estudias para que los propietarios puedan conocerte mejor.
        </p>
        <form onSubmit={submitAcademic(d => {
          const payload = { ...d }
          if (typeof payload.university === 'object' && payload.university !== null) {
            payload.university = payload.university.universityName || ''
          }
          updateAcademic.mutate(payload)
        })}>
          <Controller
            name="university"
            control={controlAcademic}
            render={({ field }) => (
              <UniversitySelector
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Input label="Carrera"     placeholder="Ej. Ingeniería Informática"             {...regAcademic('degree')} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button type="submit" variant="outline" disabled={updateAcademic.isPending}>
              {updateAcademic.isPending ? 'Guardando…' : 'Guardar'}
            </Button>
            <SavedFlash show={savedAcademic} />
          </div>
        </form>
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: SEGURIDAD
// ═══════════════════════════════════════════════════════════════════════════════
function SeguridadTab() {
  const { user } = useAuth()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saved, setSaved] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
  const newPwd = watch('new_password', '')

  const changePwd = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      reset()
      setFieldErrors({})
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
    onError: (err) => {
      setFieldErrors(err?.response?.data || {})
    },
  })

  const eyeBtn = (show, setShow) => (
    <button
      type="button"
      onClick={() => setShow(v => !v)}
      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 16, padding: 0 }}
    >
      {show ? '🙈' : '👁'}
    </button>
  )

  const pwdWrap = { position: 'relative', marginBottom: 16 }

  return (
    <div style={{ maxWidth: 480 }}>
      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Cambiar contraseña</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Elige una contraseña segura de al menos 8 caracteres.
        </p>

        <form onSubmit={handleSubmit(d => changePwd.mutate(d))}>
          {/* Current password */}
          <div style={pwdWrap}>
            <label style={labelStyle}>Contraseña actual</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrent ? 'text' : 'password'}
                style={{ width: '100%', border: `1.5px solid ${errors.current_password || fieldErrors.current_password ? 'var(--red)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '10px 40px 10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                {...register('current_password', { required: 'Campo obligatorio' })}
              />
              {eyeBtn(showCurrent, setShowCurrent)}
            </div>
            {(errors.current_password || fieldErrors.current_password) && (
              <span style={{ fontSize: 12, color: 'var(--red)' }}>
                {errors.current_password?.message || fieldErrors.current_password?.[0]}
              </span>
            )}
          </div>

          {/* New password */}
          <div style={pwdWrap}>
            <label style={labelStyle}>Nueva contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNew ? 'text' : 'password'}
                style={{ width: '100%', border: `1.5px solid ${errors.new_password || fieldErrors.new_password ? 'var(--red)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '10px 40px 10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                {...register('new_password', {
                  required: 'Campo obligatorio',
                  minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                })}
              />
              {eyeBtn(showNew, setShowNew)}
            </div>
            {(errors.new_password || fieldErrors.new_password) && (
              <span style={{ fontSize: 12, color: 'var(--red)' }}>
                {errors.new_password?.message || fieldErrors.new_password?.[0]}
              </span>
            )}
          </div>

          {/* Confirm */}
          <div style={pwdWrap}>
            <label style={labelStyle}>Confirmar nueva contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                style={{ width: '100%', border: `1.5px solid ${errors.confirm_new_password || fieldErrors.confirm_new_password ? 'var(--red)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '10px 40px 10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                {...register('confirm_new_password', {
                  required: 'Campo obligatorio',
                  validate: v => v === newPwd || 'Las contraseñas no coinciden',
                })}
              />
              {eyeBtn(showConfirm, setShowConfirm)}
            </div>
            {(errors.confirm_new_password || fieldErrors.confirm_new_password) && (
              <span style={{ fontSize: 12, color: 'var(--red)' }}>
                {errors.confirm_new_password?.message || fieldErrors.confirm_new_password?.[0]}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
            <Button type="submit" disabled={changePwd.isPending}>
              {changePwd.isPending ? 'Guardando…' : 'Actualizar contraseña'}
            </Button>
            <SavedFlash show={saved} />
          </div>
        </form>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 6 }}>Método de acceso</div>
          <div style={{ fontSize: 14, color: 'var(--text)' }}>
            Email y contraseña · <span style={{ color: 'var(--muted)' }}>{user?.email}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: NOTIFICACIONES
// ═══════════════════════════════════════════════════════════════════════════════
const NOTIF_ITEMS = [
  { key: 'mensajes',  label: 'Mensajes nuevos',           desc: 'Recibe un email cuando alguien te envía un mensaje.' },
  { key: 'reservas',  label: 'Actualizaciones de reservas', desc: 'Notificaciones sobre el estado de tus solicitudes y reservas.' },
  { key: 'avisos',    label: 'Avisos del sistema',         desc: 'Comunicaciones importantes sobre tu cuenta.' },
]

function NotificacionesTab() {
  const { user } = useAuth()
  const qc = useQueryClient()

  const defaults = {
    mensajes: true,
    reservas: true,
    avisos:   true,
    ...(user?.notification_preferences || {}),
  }
  const [prefs, setPrefs] = useState(defaults)
  const [saved, setSaved] = useState(false)

  const update = useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      qc.invalidateQueries(['me'])
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  const toggle = (key) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }))

  const handleSave = () => update.mutate({ notification_preferences: prefs })

  return (
    <div style={{ maxWidth: 600 }}>
      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Notificaciones por email</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Elige qué alertas quieres recibir en tu correo electrónico.
        </p>
        {NOTIF_ITEMS.map((item, i) => (
          <div
            key={item.key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 0',
              borderBottom: i < NOTIF_ITEMS.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{item.desc}</div>
            </div>
            <ToggleSwitch
              checked={prefs[item.key]}
              onChange={() => toggle(item.key)}
              disabled={update.isPending}
            />
          </div>
        ))}
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button onClick={handleSave} disabled={update.isPending}>
            {update.isPending ? 'Guardando…' : 'Guardar cambios'}
          </Button>
          {saved && (
            <span style={{ fontSize: 13, color: 'var(--success, #16a34a)' }}>
              ✓ Preferencias guardadas
            </span>
          )}
        </div>
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: CUENTA
// ═══════════════════════════════════════════════════════════════════════════════
function CuentaTab() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [areYouSure, setAreYouSure] = useState(false)

  const profilePublic = user?.student_profile?.profile_public ?? true
  const [pubValue, setPubValue] = useState(profilePublic)

  const updatePrivacy = useMutation({
    mutationFn: updateMe,
    onSuccess: () => qc.invalidateQueries(['me']),
  })

  const togglePrivacy = (val) => {
    setPubValue(val)
    updatePrivacy.mutate({ profile_public: val })
  }

  const deleteAcc = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      logout()
      navigate('/')
    },
  })

  return (
    <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Privacy — only for students */}
      {user?.role === 'STUDENT' && (
        <Card>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Privacidad</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
            Controla quién puede ver tu perfil público.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Perfil público</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                {pubValue
                  ? 'Cualquier persona puede ver tu perfil.'
                  : 'Solo tú puedes ver tu perfil.'}
              </div>
            </div>
            <ToggleSwitch
              checked={pubValue}
              onChange={togglePrivacy}
              disabled={updatePrivacy.isPending}
            />
          </div>
        </Card>
      )}

      {/* Account info */}
      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Información de cuenta</h2>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 4 }}>Email</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{user?.email}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 4 }}>Estado de verificación</div>
          {user?.is_verified
            ? <span style={{ color: 'var(--green)', fontWeight: 600, fontSize: 14 }}>✓ Verificado</span>
            : <span style={{ color: 'var(--amber)', fontWeight: 600, fontSize: 14 }}>⚠ Pendiente de verificación</span>
          }
        </div>
      </Card>

      {/* Danger zone */}
      <div style={{ background: 'var(--red-bg)', borderRadius: 'var(--radius)', padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--red)', marginBottom: 8 }}>Zona de peligro</h3>
        {!areYouSure ? (
          <>
            <p style={{ fontSize: 13, color: 'var(--red)', marginBottom: 12 }}>
              La eliminación de la cuenta es permanente e irreversible.
            </p>
            <Button variant="danger" size="sm" onClick={() => setAreYouSure(true)}>
              Eliminar cuenta
            </Button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'var(--red)', fontWeight: 600, marginBottom: 12 }}>
              ¿Estás seguro? Esta acción desactivará tu cuenta de forma permanente.
            </p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Button
                variant="danger"
                size="sm"
                disabled={deleteAcc.isPending}
                onClick={() => deleteAcc.mutate()}
              >
                {deleteAcc.isPending ? 'Eliminando…' : 'Sí, eliminar mi cuenta'}
              </Button>
              <button
                onClick={() => setAreYouSure(false)}
                style={{ fontSize: 13, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { key: 'perfil',         label: 'Perfil' },
  { key: 'seguridad',      label: 'Seguridad' },
  { key: 'notificaciones', label: 'Notificaciones' },
  { key: 'cuenta',         label: 'Cuenta' },
]

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = TABS.find(t => t.key === searchParams.get('tab'))?.key || 'perfil'

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Configuración</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Gestiona tu perfil, seguridad y preferencias.</p>

      {/* Tab bar */}
      <nav style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--border)', marginBottom: 28 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setSearchParams({ tab: t.key })}
            style={{
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === t.key ? 'var(--blue)' : 'var(--muted)',
              borderBottom: `2px solid ${activeTab === t.key ? 'var(--blue)' : 'transparent'}`,
              marginBottom: -2,
              transition: 'color .15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Tab panels */}
      {activeTab === 'perfil'         && <PerfilTab />}
      {activeTab === 'seguridad'      && <SeguridadTab />}
      {activeTab === 'notificaciones' && <NotificacionesTab />}
      {activeTab === 'cuenta'         && <CuentaTab />}
    </div>
  )
}

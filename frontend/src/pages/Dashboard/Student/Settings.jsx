import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { updateMe } from '../../../api/auth'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

export default function Settings() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const qc = useQueryClient()

  const { register, handleSubmit } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name:  user?.last_name  || '',
      phone:      user?.phone      || '',
      bio:        user?.bio        || '',
      university: user?.student_profile?.university || '',
      degree:     user?.student_profile?.degree     || '',
    }
  })

  const update = useMutation({
    mutationFn: (data) => updateMe(data),
    onSuccess: () => {
      qc.invalidateQueries(['me'])
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  return (
    <div>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Configuración</h1>
      <p style={{ color:'var(--muted)', marginBottom:28 }}>Actualiza tu perfil y datos personales.</p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, maxWidth:840 }}>

        {/* Personal data */}
        <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:24 }}>
          <h2 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Datos personales</h2>
          <form onSubmit={handleSubmit(d => update.mutate(d))}>
            <Input label="Nombre"    {...register('first_name', { required: true })} />
            <Input label="Apellidos" {...register('last_name',  { required: true })} />
            <Input label="Teléfono" type="tel" placeholder="+34 600 000 000" {...register('phone')} />
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'var(--muted)', marginBottom:6 }}>Bio</label>
              <textarea
                rows={3}
                placeholder="Cuéntanos algo sobre ti…"
                style={{ width:'100%', border:'1.5px solid var(--border)', borderRadius:'var(--radius)', padding:'10px 14px', fontSize:14, outline:'none', resize:'vertical', fontFamily:'inherit', boxSizing:'border-box' }}
                {...register('bio')}
              />
            </div>
            <Button type="submit" disabled={update.isPending}>
              {update.isPending ? 'Guardando…' : 'Guardar cambios'}
            </Button>
            {saved && <span style={{ marginLeft:12, color:'var(--green)', fontSize:14, fontWeight:600 }}>✓ Guardado</span>}
          </form>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Academic info — editable */}
          <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:24 }}>
            <h2 style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>Datos académicos</h2>
            <p style={{ fontSize:12, color:'var(--muted)', marginBottom:16 }}>
              Añade dónde estudias para que los propietarios puedan conocerte mejor.
            </p>
            <form onSubmit={handleSubmit(d => update.mutate(d))}>
              <Input label="Universidad" placeholder="Ej. Universidad Complutense de Madrid" {...register('university')} />
              <Input label="Carrera"     placeholder="Ej. Ingeniería Informática" {...register('degree')} />
              <Button type="submit" variant="outline" disabled={update.isPending}>
                {update.isPending ? 'Guardando…' : 'Guardar'}
              </Button>
              {saved && <span style={{ marginLeft:12, color:'var(--green)', fontSize:14, fontWeight:600 }}>✓ Guardado</span>}
            </form>
          </div>

          {/* Account info */}
          <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:24 }}>
            <h2 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Cuenta</h2>
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>Email</div>
              <div style={{ fontSize:14, fontWeight:500 }}>{user?.email}</div>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>Estado de verificación</div>
              {user?.is_verified
                ? <span style={{ color:'var(--green)', fontWeight:600, fontSize:14 }}>✓ Verificado</span>
                : <span style={{ color:'var(--amber)', fontWeight:600, fontSize:14 }}>⚠ Pendiente de verificación</span>
              }
            </div>
          </div>

          {/* Danger zone */}
          <div style={{ background:'var(--red-bg)', borderRadius:'var(--radius)', padding:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'var(--red)', marginBottom:8 }}>Zona de peligro</h3>
            <p style={{ fontSize:13, color:'var(--red)', marginBottom:12 }}>
              La eliminación de la cuenta es permanente e irreversible.
            </p>
            <Button variant="danger" size="sm">Eliminar cuenta</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

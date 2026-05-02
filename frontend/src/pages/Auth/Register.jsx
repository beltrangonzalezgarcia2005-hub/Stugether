import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import UniversitySelector from '../../components/ui/UniversitySelector'

const schema = z.object({
  first_name: z.string().min(2, 'Mínimo 2 caracteres'),
  last_name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  university: z.string().optional(),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  password_confirm: z.string(),
}).refine(d => d.password === d.password_confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirm'],
})

export default function Register() {
  const { register: authRegister } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setServerError('')
    const payload = { ...data }
    if (typeof payload.university === 'object' && payload.university !== null) {
      payload.university = payload.university.universityName || ''
    }
    try {
      await authRegister(payload)
      sessionStorage.setItem('pending_verify_email', data.email)
      navigate('/verificar-email')
    } catch (err) {
      const d = err.response?.data
      setServerError(d?.email?.[0] || d?.detail || 'Error al registrarse. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:24 }}>
      <div style={{ width:'100%', maxWidth:480 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <Link to="/" style={{ fontSize:26, fontWeight:800, color:'var(--blue)', letterSpacing:-.5, textDecoration:'none' }}>
            Stugether
          </Link>
          <h1 style={{ fontSize:22, fontWeight:700, marginTop:16, marginBottom:6 }}>Crea tu cuenta</h1>
          <p style={{ color:'var(--muted)' }}>Es gratis y solo tarda 2 minutos</p>
        </div>

        <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow-md)', padding:32 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Input label="Nombre" placeholder="Ana" error={errors.first_name?.message} {...register('first_name')} />
              <Input label="Apellidos" placeholder="López" error={errors.last_name?.message} {...register('last_name')} />
            </div>
            <Input label="Email" type="email" placeholder="tu@email.com" error={errors.email?.message} {...register('email')} />
            <Controller
              name="university"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <UniversitySelector
                  label="Universidad (opcional)"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Input label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" error={errors.password?.message} {...register('password')} />
            <Input label="Confirmar contraseña" type="password" placeholder="Repite la contraseña" error={errors.password_confirm?.message} {...register('password_confirm')} />

            {serverError && (
              <div style={{ background:'var(--red-bg)', color:'var(--red)', borderRadius:8, padding:'10px 14px', fontSize:14, marginBottom:16 }}>
                {serverError}
              </div>
            )}

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Creando cuenta…' : 'Crear cuenta gratis'}
            </Button>
          </form>

          <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'var(--muted)' }}>
            Al registrarte aceptas nuestros <a href="#" style={{ color:'var(--blue)' }}>Términos de uso</a> y{' '}
            <a href="#" style={{ color:'var(--blue)' }}>Política de privacidad (RGPD)</a>
          </p>

          <p style={{ textAlign:'center', marginTop:12, fontSize:14, color:'var(--muted)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color:'var(--blue)', fontWeight:600 }}>Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

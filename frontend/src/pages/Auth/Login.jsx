import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Introduce tu contraseña'),
})

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [unverified, setUnverified] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setServerError('')
    setUnverified(false)
    try {
      const user = await login(data.email, data.password)
      const from = location.state?.from?.pathname
      navigate(from || '/panel', { replace: true })
    } catch (err) {
      if (err.response?.data?.unverified) {
        setUnverified(true)
        setServerError(err.response.data.detail)
      } else {
        setServerError(err.response?.data?.detail || 'Email o contraseña incorrectos.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:24 }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <Link to="/" style={{ fontSize:26, fontWeight:800, color:'var(--blue)', letterSpacing:-.5, textDecoration:'none' }}>
            Stugether
          </Link>
          <h1 style={{ fontSize:22, fontWeight:700, marginTop:16, marginBottom:6 }}>Bienvenido de vuelta</h1>
          <p style={{ color:'var(--muted)' }}>Inicia sesión en tu cuenta</p>
        </div>

        <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow-md)', padding:32 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="Tu contraseña"
              error={errors.password?.message}
              {...register('password')}
            />

            {serverError && (
              <div style={{ background: unverified ? '#EFF6FF' : 'var(--red-bg)', color: unverified ? '#1D4ED8' : 'var(--red)', borderRadius:8, padding:'12px 14px', fontSize:14, marginBottom:16, lineHeight:1.5 }}>
                {serverError}
                {unverified && (
                  <span>
                    {' '}
                    <Link to="/verificar-email" style={{ color:'#1D4ED8', fontWeight:700, textDecoration:'underline' }}>
                      Reenviar enlace de verificación
                    </Link>
                  </span>
                )}
              </div>
            )}

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </Button>
          </form>

          <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--muted)' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/registro" style={{ color:'var(--blue)', fontWeight:600 }}>Regístrate gratis</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

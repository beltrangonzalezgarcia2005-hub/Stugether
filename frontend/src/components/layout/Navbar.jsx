import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../ui/Button'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const dashPath = '/panel/perfil'

  return (
    <nav style={{
      position:'sticky', top:0, zIndex:100, background:'var(--white)',
      borderBottom:'1px solid var(--border)', boxShadow:'var(--shadow)',
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', gap:32, height:64 }}>
        <Link to="/" style={{ fontSize:22, fontWeight:800, color:'var(--blue)', letterSpacing:-.5, flexShrink:0, textDecoration:'none' }}>
          Stu<span style={{ color:'var(--blue-dark)' }}>gether</span>
        </Link>

        <div style={{ display:'flex', alignItems:'center', gap:4, flex:1 }}>
          {[
            { to:'/', label:'Inicio' },
            { to:'/buscar', label:'Buscar piso' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding:'6px 14px', borderRadius:8, fontSize:14, fontWeight:500, textDecoration:'none',
              color: location.pathname === to ? 'var(--blue)' : 'var(--muted)',
              background: location.pathname === to ? 'var(--blue-light)' : 'transparent',
            }}>
              {label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link to={dashPath} style={{
              padding:'6px 14px', borderRadius:8, fontSize:14, fontWeight:500, textDecoration:'none',
              color: location.pathname.startsWith('/panel') ? 'var(--blue)' : 'var(--muted)',
              background: location.pathname.startsWith('/panel') ? 'var(--blue-light)' : 'transparent',
            }}>
              Perfil
            </Link>
          )}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10, marginLeft:'auto' }}>
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>Salir</Button>
          ) : (
            <>
              <Link to="/login"><Button variant="outline" size="sm">Iniciar sesión</Button></Link>
              <Link to="/registro"><Button variant="primary" size="sm">Registrarse</Button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

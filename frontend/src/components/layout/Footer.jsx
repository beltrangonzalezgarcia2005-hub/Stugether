import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const linkStyle = { display: 'block', fontSize: 13, marginBottom: 6, color: 'rgba(255,255,255,.6)', textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none', padding: 0, textAlign: 'left', fontFamily: 'inherit' }

export default function Footer() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  function handlePublicarAnuncio() {
    if (!isAuthenticated) return navigate('/registro')
    if (!user?.is_verified) return navigate('/panel/verificacion')
    navigate('/panel/anuncios/nuevo')
  }

  return (
    <footer style={{ background: '#111827', color: 'rgba(255,255,255,.7)', padding: '48px 0 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 10 }}>Stugether</div>
            <p style={{ fontSize: 13, maxWidth: 240 }}>
              La plataforma de alquiler estudiantil verificado. Seguridad, transparencia y contratos académicos.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, marginBottom: 12 }}>Estudiantes</h4>
            <Link to="/buscar" style={linkStyle}>Buscar piso</Link>
            <Link to="/como-funciona" style={linkStyle}>Cómo funciona</Link>
            <Link to="/pago-escrow" style={linkStyle}>Pago Escrow</Link>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, marginBottom: 12 }}>Propietarios</h4>
            <button onClick={handlePublicarAnuncio} style={linkStyle}>Publicar anuncio</button>
            <Link to="/panel/verificacion" style={linkStyle}>Verificación</Link>
            <Link to="/comisiones" style={linkStyle}>Comisiones</Link>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, marginBottom: 12 }}>Empresa</h4>
            <Link to="/sobre-nosotros" style={linkStyle}>Sobre nosotros</Link>
            <Link to="/privacidad" style={linkStyle}>Privacidad (RGPD)</Link>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span>© 2025 Stugether SL · Todos los derechos reservados</span>
          <span>ES / EN</span>
        </div>
      </div>
    </footer>
  )
}

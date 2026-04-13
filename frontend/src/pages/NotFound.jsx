import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Navbar from '../components/layout/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, textAlign:'center', padding:24 }}>
        <div style={{ fontSize:80 }}>🏚️</div>
        <h1 style={{ fontSize:28, fontWeight:800 }}>404 — Página no encontrada</h1>
        <p style={{ color:'var(--muted)', maxWidth:320 }}>La página que buscas no existe o ha sido movida.</p>
        <Link to="/"><Button size="lg">Volver al inicio</Button></Link>
      </div>
    </>
  )
}

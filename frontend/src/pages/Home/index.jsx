import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProperties } from '../../api/properties'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import PropertyCard from '../../components/features/PropertyCard'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import UniversitySelector from '../../components/ui/UniversitySelector'

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [search, setSearch] = useState({ university: '', campus: '', city: '' })
  const [uniSelection, setUniSelection] = useState('')

  const { data: featuredData, isLoading } = useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: () => getProperties({ featured: true, page_size: 3 }),
  })
  const featured = featuredData?.data?.results || []

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.university) params.set('university', search.university)
    if (search.campus) params.set('campus', search.campus)
    if (search.city) params.set('city', search.city)
    navigate(`/buscar?${params.toString()}`)
  }

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{ background:'linear-gradient(135deg,#1E40AF 0%,#2563EB 50%,#3B82F6 100%)', padding:'80px 0 100px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', bottom:-2, left:0, right:0, height:60, background:'var(--bg)', clipPath:'ellipse(55% 100% at 50% 100%)' }} />
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', textAlign:'center', color:'white', position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.3)', borderRadius:20, padding:'4px 14px', fontSize:13, fontWeight:500, marginBottom:20 }}>
            ✨ La plataforma de alquiler para estudiantes
          </div>
          <h1 style={{ fontSize:'clamp(28px,5vw,52px)', fontWeight:800, lineHeight:1.15, marginBottom:16 }}>
            Tu piso cerca de tu universidad,<br />con total seguridad
          </h1>
          <p style={{ fontSize:18, opacity:.85, marginBottom:40, maxWidth:540, margin:'0 auto 40px' }}>
            Pisos verificados, contratos adaptados al calendario académico y pagos protegidos con sistema Escrow.
          </p>

          <form onSubmit={handleSearch} style={{ background:'white', borderRadius:14, padding:8, display:'flex', alignItems:'center', gap:8, maxWidth:720, margin:'0 auto', boxShadow:'var(--shadow-lg)' }}>
            <div style={{ flex:1, padding:'8px 16px' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:.5, marginBottom:2 }}>Universidad</div>
              <UniversitySelector
                label=""
                placeholder="Ej. Universidad Complutense"
                value={uniSelection}
                onChange={sel => {
                  setUniSelection(sel)
                  const name = typeof sel === 'object' && sel ? sel.universityName : sel
                  const campusId = typeof sel === 'object' && sel ? (sel.campusId || '') : ''
                  setSearch(s => ({ ...s, university: name || '', campus: campusId }))
                }}
                containerStyle={{ marginBottom: 0 }}
                inputStyle={{ border: 'none', outline: 'none', padding: '0', fontSize: 15, fontWeight: 500, color: 'var(--text)', borderRadius: 0 }}
                hideIcon
              />
            </div>
            <div style={{ width:1, height:40, background:'var(--border)' }} />
            <div style={{ flex:1, padding:'8px 16px' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:.5, marginBottom:2 }}>Ciudad</div>
              <input
                value={search.city}
                onChange={e => setSearch(s => ({ ...s, city: e.target.value }))}
                placeholder="Madrid, Barcelona…"
                style={{ border:'none', outline:'none', fontSize:15, fontWeight:500, width:'100%', color:'var(--text)' }}
              />
            </div>
            <Button type="submit" size="lg">🔍 Buscar alojamiento</Button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
        <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow-md)', padding:'28px 40px', display:'flex', justifyContent:'space-around', alignItems:'center', marginTop:-40, position:'relative', zIndex:2 }}>
          {[['5.200+','Pisos verificados'], ['120+','Universidades'], ['98%','Reseñas positivas'], ['€0','Sorpresas en el pago']].map(([n, l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:30, fontWeight:800, color:'var(--blue)' }}>{n}</div>
              <div style={{ fontSize:13, color:'var(--muted)', marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cómo funciona */}
      <section style={{ padding:'80px 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:26, fontWeight:700, marginBottom:8 }}>¿Cómo funciona Stugether?</h2>
            <p style={{ color:'var(--muted)' }}>Tres pasos para encontrar y asegurar tu alojamiento ideal</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:32 }}>
            {[
              { icon:'🎓', step:'01', title:'Busca por universidad', desc:'Encuentra pisos verificados a minutos del campus con mapa y tiempos reales.' },
              { icon:'📋', step:'02', title:'Reserva con garantía', desc:'Envía tu solicitud. El propietario tiene 24h. Verifica tu identidad y matrícula.' },
              { icon:'🔒', step:'03', title:'Paga de forma protegida', desc:'Tu dinero queda retenido por Stugether. El propietario cobra 48h después de tu entrada.' },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} style={{ textAlign:'center' }}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--blue-light)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:28 }}>{icon}</div>
                <div style={{ fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>Paso {step}</div>
                <h3 style={{ fontSize:17, fontWeight:700, marginBottom:8 }}>{title}</h3>
                <p style={{ color:'var(--muted)', fontSize:14 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings destacados */}
      <section style={{ padding:'60px 0', background:'var(--white)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:26, fontWeight:700, marginBottom:8 }}>Pisos destacados</h2>
            <p style={{ color:'var(--muted)' }}>Seleccionados y verificados por el equipo de Stugether</p>
          </div>
          {isLoading ? <Spinner /> : (
            featured.length > 0 ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
                {featured.map(p => <PropertyCard key={p.id} property={p} />)}
              </div>
            ) : (
              <p style={{ textAlign:'center', color:'var(--muted)' }}>Aún no hay pisos destacados. ¡Pronto añadiremos más!</p>
            )
          )}
          <div style={{ textAlign:'center', marginTop:36 }}>
            <Link to="/buscar"><Button variant="outline" size="lg">Ver todos los pisos →</Button></Link>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section style={{ padding:'80px 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:26, fontWeight:700, marginBottom:8 }}>Diseñado para que confíes</h2>
            <p style={{ color:'var(--muted)' }}>Cada elemento de Stugether está pensado para protegerte</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {[
              { icon:'🪪', title:'Verificación KYC', desc:'Todos los propietarios y estudiantes verifican su identidad con documentación oficial.' },
              { icon:'🔒', title:'Pago protegido (Escrow)', desc:'Tu dinero queda retenido. El propietario solo cobra 48h después de tu entrada confirmada.' },
              { icon:'📅', title:'Contratos académicos', desc:'Contratos adaptados al calendario universitario. Sin cláusulas abusivas ni letra pequeña.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:28, textAlign:'center' }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--blue-light)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:36 }}>{icon}</div>
                <h3 style={{ fontSize:17, fontWeight:700, marginBottom:8 }}>{title}</h3>
                <p style={{ color:'var(--muted)', fontSize:14 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'0 0 80px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ background:'linear-gradient(135deg,var(--blue) 0%,var(--blue-dark) 100%)', borderRadius:20, padding:'60px 40px', display:'grid', gridTemplateColumns:'1fr 1px 1fr', gap:40, alignItems:'center' }}>

            {/* Buscar piso */}
            <div style={{ textAlign:'center', color:'white' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
              <h3 style={{ fontSize:22, fontWeight:700, marginBottom:8 }}>Busca tu piso</h3>
              <p style={{ opacity:.8, fontSize:14, marginBottom:20 }}>
                Encuentra alojamiento cerca de tu universidad con precios y fechas adaptadas al calendario académico.
              </p>
              <Link to="/buscar">
                <button style={{ padding:'14px 28px', fontSize:16, fontWeight:700, borderRadius:'var(--radius)', cursor:'pointer', background:'white', color:'var(--blue)', border:'none' }}>
                  Buscar ahora
                </button>
              </Link>
            </div>

            <div style={{ background:'rgba(255,255,255,.2)', height:'100%' }} />

            {/* Publicar piso */}
            <div style={{ textAlign:'center', color:'white' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🏠</div>
              <h3 style={{ fontSize:22, fontWeight:700, marginBottom:8 }}>Publica tu piso</h3>
              <p style={{ opacity:.8, fontSize:14, marginBottom:20 }}>
                ¿Tienes una habitación o piso disponible? Publícalo gratis y llega a miles de estudiantes verificados.
              </p>
              <button
                onClick={() => navigate(isAuthenticated ? '/panel/anuncios/nuevo' : '/registro')}
                style={{ padding:'14px 28px', fontSize:16, fontWeight:700, borderRadius:'var(--radius)', cursor:'pointer', background:'transparent', color:'white', border:'2px solid rgba(255,255,255,.6)' }}
              >
                {isAuthenticated ? 'Crear anuncio' : 'Empieza gratis'}
              </button>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const s = {
  page: { background: '#fff', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, #111827 0%, #1e3a5f 100%)', color: '#fff', padding: '100px 24px 80px' },
  heroInner: { maxWidth: 800, margin: '0 auto', textAlign: 'center' },
  tag: { display: 'inline-block', background: 'rgba(99,102,241,.25)', color: '#a5b4fc', fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', padding: '6px 16px', borderRadius: 20, marginBottom: 24 },
  heroTitle: { fontSize: 48, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 },
  heroSub: { fontSize: 18, color: 'rgba(255,255,255,.75)', maxWidth: 580, margin: '0 auto' },
  section: { maxWidth: 900, margin: '0 auto', padding: '72px 24px' },
  sectionTitle: { fontSize: 32, fontWeight: 800, color: '#111827', marginBottom: 16 },
  lead: { fontSize: 17, color: '#374151', lineHeight: 1.8, marginBottom: 20 },
  divider: { border: 'none', borderTop: '1px solid #e5e7eb', margin: '64px 0' },
  valuesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32, marginTop: 40 },
  card: { background: '#f9fafb', borderRadius: 16, padding: '32px 28px', border: '1px solid #e5e7eb' },
  cardIcon: { fontSize: 36, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#6b7280', lineHeight: 1.7 },
  cta: { background: '#f0f4ff', borderRadius: 20, padding: '56px 24px', textAlign: 'center', marginTop: 64 },
  ctaTitle: { fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 12 },
  ctaSub: { fontSize: 16, color: '#6b7280', marginBottom: 28 },
  ctaBtn: { display: 'inline-block', background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: 15, padding: '14px 36px', borderRadius: 12, textDecoration: 'none' },
}

export default function SobreNosotros() {
  return (
    <div style={s.page}>
      <Navbar />
      <section style={s.hero}>
        <div style={s.heroInner}>
          <span style={s.tag}>Sobre nosotros</span>
          <h1 style={s.heroTitle}>El alquiler estudiantil,<br />como debería haber sido siempre</h1>
          <p style={s.heroSub}>Nacimos para devolver la seguridad y la transparencia al alquiler entre estudiantes, eliminando intermediarios y construyendo confianza real.</p>
        </div>
      </section>

      <div style={s.section}>
        <h2 style={s.sectionTitle}>Nuestra historia</h2>
        <p style={s.lead}>
          Todo empezó en 2023, cuando dos estudiantes universitarios buscaban piso para compartir en Madrid. Lo que encontraron fue un mercado opaco, lleno de anuncios sin verificar, propietarios sin garantías y estudiantes que pagaban fianzas sin ningún tipo de protección legal.
        </p>
        <p style={s.lead}>
          Después de vivir en primera persona lo frustrante que puede llegar a ser ese proceso, decidieron que tenía que existir una solución mejor. Una plataforma diseñada desde cero para estudiantes, por personas que han pasado por lo mismo.
        </p>
        <p style={s.lead}>
          Así nació Stugether: una plataforma donde los propietarios verifican su identidad y sus inmuebles, donde los estudiantes pueden reservar con seguridad gracias al sistema Escrow, y donde la comunidad es el verdadero motor. Sin comisiones abusivas, sin letra pequeña, sin sorpresas.
        </p>

        <hr style={s.divider} />

        <h2 style={s.sectionTitle}>Nuestros valores</h2>
        <p style={s.lead}>Creemos que vivir bien empieza por encontrar un hogar en el que confíes. Estos son los principios que guían cada decisión que tomamos.</p>

        <div style={s.valuesGrid}>
          <div style={s.card}>
            <div style={s.cardIcon}>🔒</div>
            <div style={s.cardTitle}>Seguridad ante todo</div>
            <p style={s.cardText}>Verificamos la identidad de propietarios y estudiantes. Los pagos están protegidos por nuestro sistema Escrow. Nadie cobra hasta que el estudiante confirma que todo está en orden.</p>
          </div>
          <div style={s.card}>
            <div style={s.cardIcon}>🔍</div>
            <div style={s.cardTitle}>Transparencia total</div>
            <p style={s.cardText}>Sin comisiones ocultas, sin tarifas sorpresa. Publicamos exactamente cómo funcionan nuestros costes y qué cubre cada euro que pasa por la plataforma.</p>
          </div>
          <div style={s.card}>
            <div style={s.cardIcon}>🤝</div>
            <div style={s.cardTitle}>Comunidad real</div>
            <p style={s.cardText}>Stugether no es solo un marketplace: es una red de estudiantes que se ayudan. Los perfiles verificados, las valoraciones honestas y el soporte humano hacen que la comunidad funcione.</p>
          </div>
        </div>

        <div style={s.cta}>
          <div style={s.ctaTitle}>¿Listo para encontrar tu piso ideal?</div>
          <p style={s.ctaSub}>Busca entre cientos de habitaciones verificadas cerca de tu universidad.</p>
          <Link to="/buscar" style={s.ctaBtn}>Buscar piso ahora</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

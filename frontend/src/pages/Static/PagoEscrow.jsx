import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const s = {
  page: { background: '#fff', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, #111827 0%, #064e3b 100%)', color: '#fff', padding: '90px 24px 70px', textAlign: 'center' },
  heroInner: { maxWidth: 720, margin: '0 auto' },
  tag: { display: 'inline-block', background: 'rgba(16,185,129,.2)', color: '#6ee7b7', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', padding: '5px 14px', borderRadius: 20, marginBottom: 20 },
  heroTitle: { fontSize: 44, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 },
  heroSub: { fontSize: 17, color: 'rgba(255,255,255,.75)', maxWidth: 560, margin: '0 auto' },
  section: { maxWidth: 900, margin: '0 auto', padding: '72px 24px' },
  h2: { fontSize: 30, fontWeight: 800, color: '#111827', marginBottom: 16 },
  p: { fontSize: 16, color: '#374151', lineHeight: 1.85, marginBottom: 18 },
  highlight: { background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 14, padding: '24px 28px', marginBottom: 36 },
  highlightTitle: { fontSize: 18, fontWeight: 700, color: '#065f46', marginBottom: 8 },
  highlightText: { fontSize: 15, color: '#047857', lineHeight: 1.7, margin: 0 },
  timeline: { position: 'relative', marginTop: 40, marginBottom: 48 },
  timelineItem: { display: 'flex', gap: 24, marginBottom: 32, alignItems: 'flex-start' },
  timelineBadge: { width: 48, height: 48, borderRadius: '50%', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 },
  timelineContent: { flex: 1 },
  timelineTitle: { fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 4 },
  timelineText: { fontSize: 14, color: '#6b7280', lineHeight: 1.75 },
  divider: { border: 'none', borderTop: '1px solid #e5e7eb', margin: '56px 0' },
  guaranteesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginTop: 32 },
  guaranteeCard: { background: '#f9fafb', borderRadius: 14, padding: '24px 20px', border: '1px solid #e5e7eb', textAlign: 'center' },
  guaranteeIcon: { fontSize: 32, marginBottom: 12 },
  guaranteeTitle: { fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 6 },
  guaranteeText: { fontSize: 13, color: '#6b7280', lineHeight: 1.7 },
  cta: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '56px 24px', textAlign: 'center', marginTop: 64 },
  ctaTitle: { fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 10 },
  ctaSub: { fontSize: 15, color: '#6b7280', marginBottom: 28 },
  ctaBtn: { display: 'inline-block', background: '#059669', color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 32px', borderRadius: 12, textDecoration: 'none' },
}

const steps = [
  { icon: '💳', title: 'El estudiante realiza el pago', text: 'Al confirmar la reserva, el estudiante abona el importe acordado (primer mes + fianza) a través de la pasarela segura de Stugether. El dinero no va al propietario directamente.' },
  { icon: '🔐', title: 'Los fondos quedan retenidos', text: 'El importe se deposita en una cuenta de custodia gestionada por Stugether. Ni el propietario ni ningún tercero pueden acceder a él hasta que se cumplan las condiciones acordadas.' },
  { icon: '🏠', title: 'El estudiante se instala', text: 'El estudiante accede al inmueble en la fecha pactada. Dispone de un período de revisión de 48 horas para comprobar que el piso corresponde exactamente a lo anunciado.' },
  { icon: '✅', title: 'Confirmación y liberación del pago', text: 'Si todo está en orden, el estudiante confirma la conformidad desde su panel. En ese momento, el pago se libera automáticamente al propietario. Si hay algún problema, el equipo de Stugether media en la resolución antes de liberar fondos.' },
]

const guarantees = [
  { icon: '🛡️', title: 'Protección total del pago', text: 'Nadie puede acceder a los fondos hasta que ambas partes confirmen que todo está correcto.' },
  { icon: '⚡', title: 'Liberación inmediata', text: 'Una vez confirmada la conformidad, el propietario recibe el pago en 1-2 días hábiles.' },
  { icon: '🔍', title: 'Mediación en disputas', text: 'Nuestro equipo revisa y resuelve cualquier incidencia antes de liberar o devolver fondos.' },
  { icon: '↩️', title: 'Devolución garantizada', text: 'Si el inmueble no corresponde al anuncio, gestionamos la devolución íntegra al estudiante.' },
]

export default function PagoEscrow() {
  return (
    <div style={s.page}>
      <Navbar />
      <section style={s.hero}>
        <div style={s.heroInner}>
          <span style={s.tag}>Seguridad de pagos</span>
          <h1 style={s.heroTitle}>Pago Escrow:<br />tu dinero, protegido</h1>
          <p style={s.heroSub}>El sistema que garantiza que tanto el estudiante como el propietario estén protegidos en cada transacción.</p>
        </div>
      </section>

      <div style={s.section}>
        <div style={s.highlight}>
          <div style={s.highlightTitle}>¿Qué es el pago Escrow?</div>
          <p style={s.highlightText}>Escrow es un sistema de custodia de fondos en el que un tercero de confianza (Stugether) retiene el dinero hasta que ambas partes confirman que se han cumplido las condiciones del acuerdo. Elimina el riesgo de estafas, impagos y malentendidos de forma definitiva.</p>
        </div>

        <h2 style={s.h2}>¿Por qué lo añadimos?</h2>
        <p style={s.p}>El alquiler estudiantil tradicional está lleno de situaciones que generan desconfianza: estudiantes que pagan fianzas y nunca acceden al piso, propietarios que no reciben el pago tras la entrada, inmuebles que no coinciden con las fotos del anuncio.</p>
        <p style={s.p}>Cuando fundamos Stugether, tuvimos claro que la única forma de construir una plataforma en la que realmente se pudiera confiar era eliminando ese riesgo desde la raíz. El pago Escrow es nuestra respuesta: una capa de seguridad que protege a ambas partes sin añadir fricciones innecesarias al proceso.</p>

        <hr style={s.divider} />

        <h2 style={s.h2}>Cómo funciona paso a paso</h2>
        <div style={s.timeline}>
          {steps.map((step, i) => (
            <div key={i} style={s.timelineItem}>
              <div style={s.timelineBadge}>{step.icon}</div>
              <div style={s.timelineContent}>
                <div style={s.timelineTitle}>Paso {i + 1}: {step.title}</div>
                <p style={s.timelineText}>{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <hr style={s.divider} />

        <h2 style={s.h2}>Garantías del sistema</h2>
        <div style={s.guaranteesGrid}>
          {guarantees.map((g, i) => (
            <div key={i} style={s.guaranteeCard}>
              <div style={s.guaranteeIcon}>{g.icon}</div>
              <div style={s.guaranteeTitle}>{g.title}</div>
              <p style={s.guaranteeText}>{g.text}</p>
            </div>
          ))}
        </div>

        <div style={s.cta}>
          <div style={s.ctaTitle}>Reserva con la seguridad que mereces</div>
          <p style={s.ctaSub}>Busca tu piso ideal y paga con la tranquilidad de saber que tu dinero está protegido.</p>
          <Link to="/buscar" style={s.ctaBtn}>Buscar piso ahora</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

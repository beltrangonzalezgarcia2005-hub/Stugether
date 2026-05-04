import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const s = {
  page: { background: '#fff', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, #111827 0%, #1e3a5f 100%)', color: '#fff', padding: '90px 24px 70px', textAlign: 'center' },
  heroInner: { maxWidth: 720, margin: '0 auto' },
  tag: { display: 'inline-block', background: 'rgba(99,102,241,.25)', color: '#a5b4fc', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', padding: '5px 14px', borderRadius: 20, marginBottom: 20 },
  heroTitle: { fontSize: 44, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 },
  heroSub: { fontSize: 17, color: 'rgba(255,255,255,.75)' },
  section: { maxWidth: 960, margin: '0 auto', padding: '72px 24px' },
  tabsRow: { display: 'flex', gap: 12, marginBottom: 56, justifyContent: 'center', flexWrap: 'wrap' },
  tabActive: { padding: '10px 24px', borderRadius: 30, background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' },
  tabInactive: { padding: '10px 24px', borderRadius: 30, background: '#f3f4f6', color: '#374151', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 },
  step: { position: 'relative', background: '#f9fafb', borderRadius: 18, padding: '36px 28px', border: '1px solid #e5e7eb' },
  stepNum: { width: 40, height: 40, borderRadius: '50%', background: '#4f46e5', color: '#fff', fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  stepIcon: { fontSize: 32, marginBottom: 12 },
  stepTitle: { fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 10 },
  stepText: { fontSize: 14, color: '#6b7280', lineHeight: 1.75 },
  divider: { border: 'none', borderTop: '1px solid #e5e7eb', margin: '64px 0' },
  h2: { fontSize: 30, fontWeight: 800, color: '#111827', marginBottom: 12, textAlign: 'center' },
  sub: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' },
  faqItem: { borderBottom: '1px solid #e5e7eb', padding: '20px 0' },
  faqQ: { fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 },
  faqA: { fontSize: 14, color: '#6b7280', lineHeight: 1.75 },
  cta: { background: '#f0f4ff', borderRadius: 20, padding: '56px 24px', textAlign: 'center', marginTop: 64 },
  ctaTitle: { fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 12 },
  ctaSub: { fontSize: 16, color: '#6b7280', marginBottom: 28 },
  ctaBtns: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  ctaBtnPrimary: { display: 'inline-block', background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 32px', borderRadius: 12, textDecoration: 'none' },
  ctaBtnSecondary: { display: 'inline-block', background: '#fff', color: '#4f46e5', fontWeight: 700, fontSize: 15, padding: '13px 32px', borderRadius: 12, textDecoration: 'none', border: '2px solid #4f46e5' },
}

const studentSteps = [
  { icon: '🔍', title: 'Busca tu piso', text: 'Filtra por ciudad, campus universitario, precio mensual, número de compañeros y servicios incluidos. Cada anuncio muestra fotos reales y el perfil verificado del propietario.' },
  { icon: '✉️', title: 'Solicita la habitación', text: 'Envía una solicitud al propietario desde la ficha del anuncio. Puedes presentarte brevemente y hacer preguntas. La comunicación es directa, sin intermediarios.' },
  { icon: '🔒', title: 'Reserva con Escrow', text: 'Una vez aceptada tu solicitud, realizas el pago a través de nuestro sistema Escrow. El dinero queda retenido de forma segura hasta que confirmas que todo está en orden.' },
  { icon: '🏠', title: 'Vive tranquilo', text: 'Una vez en el piso y satisfecho, liberas el pago al propietario con un clic. Ambas partes dejan valoraciones. El contrato digital queda guardado en tu perfil.' },
]

const ownerSteps = [
  { icon: '📝', title: 'Publica tu anuncio', text: 'Crea tu anuncio en minutos: añade fotos, describe el espacio, indica el precio y las normas de convivencia. El proceso es completamente gratuito.' },
  { icon: '✅', title: 'Verifica tu identidad', text: 'Sube tu DNI y la documentación del inmueble. Nuestro equipo lo revisa en 24-48 horas. La verificación da confianza a los estudiantes y mejora tu visibilidad.' },
  { icon: '📬', title: 'Gestiona las solicitudes', text: 'Recibe solicitudes de estudiantes verificados directamente en tu panel. Revisa sus perfiles, acepta o rechaza, y comunícate con ellos antes de confirmar.' },
  { icon: '💶', title: 'Cobra de forma segura', text: 'El estudiante paga a través de Escrow. Cuando confirma que todo está bien, recibes el importe íntegro en tu cuenta. Sin riesgos, sin impagos sorpresa.' },
]

const faqs = [
  { q: '¿Cuánto tiempo tarda la verificación de identidad?', a: 'El proceso de verificación suele completarse en un plazo de 24 a 48 horas hábiles. Recibirás una notificación en cuanto tu documentación sea revisada.' },
  { q: '¿Qué pasa si el piso no corresponde al anuncio?', a: 'Si el inmueble no coincide con lo descrito, tienes hasta 48 horas desde la llegada para comunicarlo a nuestro equipo. Revisamos el caso y, si se confirma, el pago queda retenido y gestionamos la devolución.' },
  { q: '¿Puedo cancelar una reserva?', a: 'Sí. Las condiciones de cancelación dependen de la política acordada entre propietario y estudiante. Stugether aplica una política estándar de cancelación gratuita hasta 7 días antes de la fecha de entrada.' },
  { q: '¿Hay que firmar un contrato?', a: 'Sí. Stugether genera automáticamente un contrato digital con validez legal entre propietario y estudiante, adaptado a la normativa de arrendamiento española.' },
]

export default function ComoFunciona() {
  return (
    <div style={s.page}>
      <Navbar />
      <section style={s.hero}>
        <div style={s.heroInner}>
          <span style={s.tag}>Guía rápida</span>
          <h1 style={s.heroTitle}>Cómo funciona Stugether</h1>
          <p style={s.heroSub}>Reservar una habitación verificada nunca había sido tan sencillo. Te explicamos el proceso paso a paso, tanto si eres estudiante como propietario.</p>
        </div>
      </section>

      <div style={s.section}>
        <h2 style={s.h2}>Para estudiantes</h2>
        <p style={s.sub}>Encuentra, reserva y vive en tu piso ideal con total seguridad en 4 pasos.</p>
        <div style={s.stepsGrid}>
          {studentSteps.map((step, i) => (
            <div key={i} style={s.step}>
              <div style={s.stepNum}>{i + 1}</div>
              <div style={s.stepIcon}>{step.icon}</div>
              <div style={s.stepTitle}>{step.title}</div>
              <p style={s.stepText}>{step.text}</p>
            </div>
          ))}
        </div>

        <hr style={s.divider} />

        <h2 style={s.h2}>Para propietarios</h2>
        <p style={s.sub}>Publica gratis, recibe solicitudes de estudiantes verificados y cobra sin riesgos.</p>
        <div style={s.stepsGrid}>
          {ownerSteps.map((step, i) => (
            <div key={i} style={s.step}>
              <div style={s.stepNum}>{i + 1}</div>
              <div style={s.stepIcon}>{step.icon}</div>
              <div style={s.stepTitle}>{step.title}</div>
              <p style={s.stepText}>{step.text}</p>
            </div>
          ))}
        </div>

        <hr style={s.divider} />

        <h2 style={s.h2}>Preguntas frecuentes</h2>
        <div style={{ maxWidth: 700, margin: '32px auto 0' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={s.faqItem}>
              <div style={s.faqQ}>{faq.q}</div>
              <p style={s.faqA}>{faq.a}</p>
            </div>
          ))}
        </div>

        <div style={s.cta}>
          <div style={s.ctaTitle}>¿Todo claro? Empieza ahora</div>
          <p style={s.ctaSub}>Únete a la comunidad de estudiantes y propietarios que ya confían en Stugether.</p>
          <div style={s.ctaBtns}>
            <Link to="/buscar" style={s.ctaBtnPrimary}>Buscar piso</Link>
            <Link to="/registro" style={s.ctaBtnSecondary}>Publicar anuncio</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

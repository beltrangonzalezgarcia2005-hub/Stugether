import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const s = {
  page: { background: '#fff', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, #111827 0%, #1e3a5f 100%)', color: '#fff', padding: '90px 24px 70px' },
  heroInner: { maxWidth: 800, margin: '0 auto', textAlign: 'center' },
  tag: { display: 'inline-block', background: 'rgba(99,102,241,.25)', color: '#a5b4fc', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', padding: '5px 14px', borderRadius: 20, marginBottom: 20 },
  heroTitle: { fontSize: 44, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 },
  heroSub: { fontSize: 17, color: 'rgba(255,255,255,.75)', maxWidth: 560, margin: '0 auto' },
  section: { maxWidth: 900, margin: '0 auto', padding: '72px 24px' },
  h2: { fontSize: 30, fontWeight: 800, color: '#111827', marginBottom: 16 },
  p: { fontSize: 16, color: '#374151', lineHeight: 1.85, marginBottom: 18 },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 32, marginBottom: 48, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,.07)' },
  thead: { background: '#111827' },
  th: { padding: '16px 20px', color: '#fff', fontSize: 13, fontWeight: 700, textAlign: 'left', textTransform: 'uppercase', letterSpacing: .5 },
  trEven: { background: '#f9fafb' },
  trOdd: { background: '#fff' },
  td: { padding: '16px 20px', fontSize: 15, color: '#374151', borderBottom: '1px solid #e5e7eb' },
  tdGreen: { padding: '16px 20px', fontSize: 15, color: '#059669', fontWeight: 700, borderBottom: '1px solid #e5e7eb' },
  highlight: { background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 14, padding: '24px 28px', marginBottom: 36 },
  highlightTitle: { fontSize: 18, fontWeight: 700, color: '#065f46', marginBottom: 8 },
  highlightText: { fontSize: 15, color: '#047857', lineHeight: 1.7, margin: 0 },
  vsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32, marginBottom: 48 },
  vsCard: { borderRadius: 14, padding: '28px 24px', border: '1px solid #e5e7eb' },
  vsCardRed: { borderRadius: 14, padding: '28px 24px', background: '#fef2f2', border: '1px solid #fecaca' },
  vsCardGreen: { borderRadius: 14, padding: '28px 24px', background: '#f0fdf4', border: '1px solid #bbf7d0' },
  vsTitle: { fontSize: 16, fontWeight: 700, marginBottom: 12 },
  vsList: { paddingLeft: 18, margin: 0 },
  vsLi: { fontSize: 14, lineHeight: 1.8, marginBottom: 4 },
  cta: { background: '#f0f4ff', borderRadius: 20, padding: '48px 24px', textAlign: 'center' },
  ctaTitle: { fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 10 },
  ctaSub: { fontSize: 15, color: '#6b7280', marginBottom: 24 },
  ctaBtn: { display: 'inline-block', background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 32px', borderRadius: 12, textDecoration: 'none' },
}

export default function Comisiones() {
  return (
    <div style={s.page}>
      <Navbar />
      <section style={s.hero}>
        <div style={s.heroInner}>
          <span style={s.tag}>Transparencia</span>
          <h1 style={s.heroTitle}>Comisiones claras,<br />sin letra pequeña</h1>
          <p style={s.heroSub}>En Stugether los propietarios no cobran comisiones. Solo pagamos una pequeña tarifa de servicio para mantener la plataforma segura y operativa.</p>
        </div>
      </section>

      <div style={s.section}>
        <div style={s.highlight}>
          <div style={s.highlightTitle}>El propietario siempre cobra el 100% del alquiler</div>
          <p style={s.highlightText}>A diferencia de las agencias tradicionales, el propietario en Stugether nunca cede un porcentaje de la renta. Su único papel es publicar su espacio y encontrar a los compañeros o inquilinos ideales. Toda la comisión de servicio recae sobre el estudiante, y es una tarifa única, no mensual.</p>
        </div>

        <h2 style={s.h2}>¿Cómo funcionan las comisiones?</h2>
        <p style={s.p}>Stugether cobra una <strong>tarifa de servicio única al estudiante</strong> en el momento en que se formaliza una reserva. Esta tarifa cubre la verificación de identidades, la custodia del pago mediante Escrow, el soporte durante todo el proceso y el contrato digital entre las partes.</p>

        <table style={s.table}>
          <thead style={s.thead}>
            <tr>
              <th style={s.th}>¿Quién paga?</th>
              <th style={s.th}>Concepto</th>
              <th style={s.th}>Importe</th>
            </tr>
          </thead>
          <tbody>
            <tr style={s.trOdd}>
              <td style={s.td}>Propietario</td>
              <td style={s.td}>Publicar anuncio en la plataforma</td>
              <td style={{ ...s.td, ...{ color: '#059669', fontWeight: 700 } }}>Gratis</td>
            </tr>
            <tr style={s.trEven}>
              <td style={s.td}>Propietario</td>
              <td style={s.td}>Gestión de solicitudes y mensajes</td>
              <td style={{ ...s.td, ...{ color: '#059669', fontWeight: 700 } }}>Gratis</td>
            </tr>
            <tr style={s.trOdd}>
              <td style={s.td}>Estudiante</td>
              <td style={s.td}>Tarifa de servicio (única por reserva confirmada)</td>
              <td style={s.td}>~5% del primer mes</td>
            </tr>
            <tr style={s.trEven}>
              <td style={s.td}>Estudiante</td>
              <td style={s.td}>Pagos mensuales posteriores</td>
              <td style={{ ...s.td, ...{ color: '#059669', fontWeight: 700 } }}>Sin comisión</td>
            </tr>
          </tbody>
        </table>

        <h2 style={s.h2}>Stugether vs. agencias tradicionales</h2>
        <p style={s.p}>Las agencias inmobiliarias cobran habitualmente una mensualidad completa de comisión al inquilino, y otra al propietario. En Stugether, eliminamos ese coste injustificado y aportamos más valor a cambio de mucho menos.</p>

        <div style={s.vsGrid}>
          <div style={s.vsCardRed}>
            <div style={{ ...s.vsTitle, color: '#991b1b' }}>Agencia tradicional</div>
            <ul style={s.vsList}>
              <li style={s.vsLi}>El propietario paga 1 mes de comisión</li>
              <li style={s.vsLi}>El inquilino paga 1 mes de comisión</li>
              <li style={s.vsLi}>Sin verificación de identidades</li>
              <li style={s.vsLi}>Sin protección en el pago</li>
              <li style={s.vsLi}>Contrato en papel, sin seguimiento</li>
            </ul>
          </div>
          <div style={s.vsCardGreen}>
            <div style={{ ...s.vsTitle, color: '#065f46' }}>Stugether</div>
            <ul style={s.vsList}>
              <li style={s.vsLi}>El propietario paga 0€ de comisión</li>
              <li style={s.vsLi}>El estudiante paga ~5% (solo una vez)</li>
              <li style={s.vsLi}>Verificación de identidad incluida</li>
              <li style={s.vsLi}>Pago protegido por Escrow</li>
              <li style={s.vsLi}>Contrato digital con validez legal</li>
            </ul>
          </div>
        </div>

        <h2 style={s.h2}>¿Qué incluye la tarifa de servicio?</h2>
        <p style={s.p}>La tarifa que abona el estudiante no es solo un ticket de entrada a la plataforma. Cubre un conjunto de servicios diseñados para proteger a ambas partes:</p>
        <ul style={{ paddingLeft: 20 }}>
          {[
            'Verificación de identidad del propietario y del estudiante',
            'Custodia del pago mediante sistema Escrow certificado',
            'Generación del contrato de arrendamiento digital',
            'Soporte humano durante todo el proceso de reserva',
            'Resolución de incidencias en caso de disputas',
            'Garantía de devolución si el inmueble no corresponde al anuncio',
          ].map(item => (
            <li key={item} style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 8 }}>
              {item}
            </li>
          ))}
        </ul>

        <div style={s.cta}>
          <div style={s.ctaTitle}>¿Tienes una habitación que publicar?</div>
          <p style={s.ctaSub}>Es totalmente gratuito. Publica tu anuncio y empieza a recibir solicitudes verificadas hoy mismo.</p>
          <Link to="/registro" style={s.ctaBtn}>Publicar gratis</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

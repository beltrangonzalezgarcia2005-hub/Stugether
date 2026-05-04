import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const s = {
  page: { background: '#fff', minHeight: '100vh' },
  hero: { background: '#111827', color: '#fff', padding: '80px 24px 60px' },
  heroInner: { maxWidth: 800, margin: '0 auto' },
  tag: { display: 'inline-block', background: 'rgba(99,102,241,.25)', color: '#a5b4fc', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', padding: '5px 14px', borderRadius: 20, marginBottom: 20 },
  heroTitle: { fontSize: 40, fontWeight: 800, marginBottom: 12 },
  heroSub: { fontSize: 15, color: 'rgba(255,255,255,.65)' },
  body: { maxWidth: 800, margin: '0 auto', padding: '64px 24px' },
  h2: { fontSize: 22, fontWeight: 700, color: '#111827', marginTop: 48, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #e5e7eb' },
  p: { fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 },
  ul: { paddingLeft: 20, marginBottom: 14 },
  li: { fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 6 },
  highlight: { background: '#f0f4ff', border: '1px solid #c7d2fe', borderRadius: 10, padding: '16px 20px', marginBottom: 20 },
  highlightText: { fontSize: 14, color: '#3730a3', lineHeight: 1.7, margin: 0 },
  updated: { fontSize: 13, color: '#9ca3af', marginBottom: 32 },
}

export default function Privacidad() {
  return (
    <div style={s.page}>
      <Navbar />
      <section style={s.hero}>
        <div style={s.heroInner}>
          <span style={s.tag}>Legal</span>
          <h1 style={s.heroTitle}>Política de Privacidad</h1>
          <p style={s.heroSub}>Conforme al Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD)</p>
        </div>
      </section>

      <div style={s.body}>
        <p style={s.updated}>Última actualización: 1 de enero de 2025</p>

        <div style={s.highlight}>
          <p style={s.highlightText}>En Stugether nos tomamos muy en serio la privacidad de nuestros usuarios. Este documento explica de forma clara y accesible qué datos recogemos, para qué los usamos y cuáles son tus derechos.</p>
        </div>

        <h2 style={s.h2}>1. Responsable del tratamiento</h2>
        <p style={s.p}>El responsable del tratamiento de tus datos personales es <strong>Stugether SL</strong>, con domicilio social en España. Puedes contactarnos en cualquier momento a través de <strong>privacidad@stugether.com</strong>.</p>

        <h2 style={s.h2}>2. Datos que recogemos</h2>
        <p style={s.p}>Recogemos únicamente los datos necesarios para prestarte el servicio:</p>
        <ul style={s.ul}>
          <li style={s.li}><strong>Datos de registro:</strong> nombre, apellidos, dirección de correo electrónico y contraseña cifrada.</li>
          <li style={s.li}><strong>Datos de verificación de identidad:</strong> documento de identidad (DNI/NIE/Pasaporte), matrícula universitaria o documentación de titularidad del inmueble.</li>
          <li style={s.li}><strong>Datos de perfil:</strong> foto de perfil, universidad, descripción personal (opcionales).</li>
          <li style={s.li}><strong>Datos de uso:</strong> búsquedas realizadas, anuncios visitados, reservas efectuadas.</li>
          <li style={s.li}><strong>Datos de pago:</strong> procesados directamente por nuestro proveedor de pagos certificado. Stugether no almacena datos de tarjeta bancaria.</li>
          <li style={s.li}><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo y cookies de sesión.</li>
        </ul>

        <h2 style={s.h2}>3. Finalidad y base legal del tratamiento</h2>
        <p style={s.p}>Tratamos tus datos con las siguientes finalidades y bases legales:</p>
        <ul style={s.ul}>
          <li style={s.li}><strong>Ejecución del contrato (Art. 6.1.b RGPD):</strong> gestionar tu cuenta, procesar reservas y pagos, facilitar la comunicación entre usuarios.</li>
          <li style={s.li}><strong>Cumplimiento de obligaciones legales (Art. 6.1.c RGPD):</strong> verificación de identidad conforme a la normativa de prevención del blanqueo de capitales.</li>
          <li style={s.li}><strong>Interés legítimo (Art. 6.1.f RGPD):</strong> prevención del fraude, seguridad de la plataforma y mejora del servicio.</li>
          <li style={s.li}><strong>Consentimiento (Art. 6.1.a RGPD):</strong> envío de comunicaciones comerciales y notificaciones opcionales (puedes retirar el consentimiento en cualquier momento).</li>
        </ul>

        <h2 style={s.h2}>4. Conservación de los datos</h2>
        <p style={s.p}>Conservamos tus datos personales durante el tiempo que mantengas tu cuenta activa. Una vez eliminada la cuenta, los datos se suprimen en un plazo máximo de <strong>30 días</strong>, salvo los que debamos conservar por obligación legal (que se mantendrán bloqueados durante el período legalmente exigido).</p>
        <p style={s.p}>Los documentos de verificación de identidad se eliminan a los <strong>6 meses</strong> de completar el proceso de verificación.</p>

        <h2 style={s.h2}>5. Destinatarios de los datos</h2>
        <p style={s.p}>No vendemos ni cedemos tus datos a terceros con fines comerciales. Únicamente los compartimos con:</p>
        <ul style={s.ul}>
          <li style={s.li}><strong>Proveedores de servicios tecnológicos</strong> (alojamiento, correo electrónico, procesamiento de pagos) bajo contratos de encargo de tratamiento.</li>
          <li style={s.li}><strong>Autoridades competentes</strong> cuando exista obligación legal.</li>
          <li style={s.li}>Otros usuarios de la plataforma, exclusivamente los <strong>datos del perfil público</strong> que hayas decidido mostrar.</li>
        </ul>

        <h2 style={s.h2}>6. Tus derechos</h2>
        <p style={s.p}>Conforme al RGPD, tienes los siguientes derechos sobre tus datos personales:</p>
        <ul style={s.ul}>
          <li style={s.li}><strong>Acceso:</strong> conocer qué datos tenemos sobre ti.</li>
          <li style={s.li}><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
          <li style={s.li}><strong>Supresión ("derecho al olvido"):</strong> solicitar que eliminemos tus datos cuando ya no sean necesarios.</li>
          <li style={s.li}><strong>Limitación:</strong> solicitar que restrinjamos el tratamiento en determinadas circunstancias.</li>
          <li style={s.li}><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado y de uso común.</li>
          <li style={s.li}><strong>Oposición:</strong> oponerte al tratamiento basado en interés legítimo.</li>
        </ul>
        <p style={s.p}>Para ejercer cualquiera de estos derechos, escríbenos a <strong>privacidad@stugether.com</strong>. Responderemos en un plazo máximo de 30 días. Si no estás satisfecho con nuestra respuesta, tienes derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong>.</p>

        <h2 style={s.h2}>7. Cookies</h2>
        <p style={s.p}>Utilizamos cookies técnicas imprescindibles para el funcionamiento de la plataforma (sesión, seguridad) y cookies analíticas propias para mejorar el servicio. No utilizamos cookies de terceros con fines publicitarios.</p>
        <p style={s.p}>Puedes configurar tu navegador para bloquear las cookies analíticas sin que ello afecte al funcionamiento esencial de Stugether.</p>

        <h2 style={s.h2}>8. Seguridad</h2>
        <p style={s.p}>Aplicamos medidas técnicas y organizativas apropiadas para proteger tus datos: cifrado en tránsito (TLS), contraseñas almacenadas con hash, acceso restringido a los datos por parte de nuestro equipo y auditorías periódicas de seguridad.</p>

        <h2 style={s.h2}>9. Contacto</h2>
        <p style={s.p}>Para cualquier consulta relacionada con la privacidad, puedes contactar con nuestro Delegado de Protección de Datos en: <strong>privacidad@stugether.com</strong></p>
      </div>
      <Footer />
    </div>
  )
}

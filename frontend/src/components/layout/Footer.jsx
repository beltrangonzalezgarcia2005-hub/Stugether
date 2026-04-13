export default function Footer() {
  return (
    <footer style={{ background:'#111827', color:'rgba(255,255,255,.7)', padding:'48px 0 24px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, marginBottom:40 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:800, color:'white', marginBottom:10 }}>Stugether</div>
            <p style={{ fontSize:13, maxWidth:240 }}>
              La plataforma de alquiler estudiantil verificado. Seguridad, transparencia y contratos académicos.
            </p>
          </div>
          {[
            { title:'Estudiantes', links:['Buscar piso','Cómo funciona','Pago Escrow'] },
            { title:'Propietarios', links:['Publicar anuncio','Verificación','Comisiones'] },
            { title:'Empresa', links:['Sobre nosotros','Blog','Privacidad (RGPD)'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 style={{ color:'white', fontSize:13, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, marginBottom:12 }}>
                {title}
              </h4>
              {links.map(l => (
                <a key={l} href="#" style={{ display:'block', fontSize:13, marginBottom:6, color:'rgba(255,255,255,.6)', textDecoration:'none' }}>{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,.1)', paddingTop:20, display:'flex', justifyContent:'space-between', fontSize:12 }}>
          <span>© 2025 Stugether SL · Todos los derechos reservados</span>
          <span>ES / EN</span>
        </div>
      </div>
    </footer>
  )
}

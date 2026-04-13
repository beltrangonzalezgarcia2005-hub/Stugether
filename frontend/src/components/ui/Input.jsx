export default function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display:'block',fontSize:12,fontWeight:700,textTransform:'uppercase',
          letterSpacing:.5,color:'var(--muted)',marginBottom:6 }}>
          {label}
        </label>
      )}
      <input
        style={{
          width:'100%',border:`1.5px solid ${error?'var(--red)':'var(--border)'}`,
          borderRadius:'var(--radius)',padding:'10px 14px',fontSize:14,outline:'none',
          background:'var(--white)',
        }}
        {...props}
      />
      {error && <span style={{ color:'var(--red)',fontSize:12,marginTop:4,display:'block' }}>{error}</span>}
    </div>
  )
}

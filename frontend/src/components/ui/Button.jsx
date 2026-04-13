export default function Button({
  children, variant = 'primary', size = 'md',
  fullWidth = false, disabled = false, type = 'button', onClick, className = ''
}) {
  const base = {
    display:'inline-flex',alignItems:'center',justifyContent:'center',gap:6,
    borderRadius:'var(--radius)',fontFamily:'inherit',fontWeight:600,
    border:'none',cursor:disabled?'not-allowed':'pointer',
    opacity:disabled?0.6:1,transition:'all .15s',
  }
  const sizes = {
    sm:  { padding:'6px 14px',fontSize:13 },
    md:  { padding:'10px 20px',fontSize:14 },
    lg:  { padding:'14px 28px',fontSize:16 },
  }
  const variants = {
    primary: { background:'var(--blue)',color:'var(--white)' },
    outline: { background:'var(--white)',color:'var(--blue)',border:'1.5px solid var(--blue)' },
    ghost:   { background:'transparent',color:'var(--muted)' },
    danger:  { background:'var(--red)',color:'var(--white)' },
    white:   { background:'var(--white)',color:'var(--blue)' },
  }
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], width:fullWidth?'100%':undefined }}
      className={className}
    >
      {children}
    </button>
  )
}

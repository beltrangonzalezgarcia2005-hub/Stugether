export default function Badge({ variant = 'blue', children, className = '' }) {
  const variants = {
    green:  'background:var(--green-bg);color:var(--green)',
    blue:   'background:var(--blue-light);color:var(--blue-dark)',
    amber:  'background:var(--amber-bg);color:var(--amber)',
    red:    'background:var(--red-bg);color:var(--red)',
  }
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',gap:4,
      padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:600,
      ...Object.fromEntries(variants[variant].split(';').map(s => s.split(':')))
    }} className={className}>
      {children}
    </span>
  )
}

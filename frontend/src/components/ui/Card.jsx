export default function Card({ children, className = '', style = {} }) {
  return (
    <div style={{
      background:'var(--white)',borderRadius:'var(--radius)',
      boxShadow:'var(--shadow)',overflow:'hidden',...style
    }} className={className}>
      {children}
    </div>
  )
}

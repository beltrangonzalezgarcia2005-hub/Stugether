import { Link } from 'react-router-dom'
import { addFavorite, removeFavorite } from '../../api/properties'
import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'

const GRAD = [
  'linear-gradient(135deg,#93C5FD,#BFDBFE)',
  'linear-gradient(135deg,#6EE7B7,#A7F3D0)',
  'linear-gradient(135deg,#FCA5A5,#FCD34D)',
  'linear-gradient(135deg,#C4B5FD,#DDD6FE)',
  'linear-gradient(135deg,#FDE68A,#FCA5A5)',
]

export default function PropertyCard({ property, onFavoriteToggle }) {
  const { isAuthenticated } = useAuth()
  const [fav, setFav] = useState(property.is_favorited)
  const grad = GRAD[property.id % GRAD.length]
  const nearest = property.nearby_universities?.[0]
  const hasUtilities = property.amenities?.some(a => a.key === 'UTILITIES')

  const toggleFav = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) return
    try {
      if (fav) {
        await removeFavorite(property.id)
      } else {
        await addFavorite(property.id)
      }
      setFav(!fav)
      onFavoriteToggle?.()
    } catch { /* noop */ }
  }

  return (
    <Link to={`/piso/${property.id}`} style={{ textDecoration:'none', color:'inherit' }}>
      <div style={{
        background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)',
        overflow:'hidden', cursor:'pointer', transition:'transform .2s, box-shadow .2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)' }}
        onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='var(--shadow)' }}
      >
        <div style={{ height:200, position:'relative' }}>
          {property.images?.[0]
            ? <img src={property.images[0].image} alt={property.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            : <div style={{ width:'100%', height:'100%', background:grad }} />
          }
          <button onClick={toggleFav} style={{
            position:'absolute', top:12, right:12, background:'white', border:'none',
            borderRadius:'50%', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:16, boxShadow:'var(--shadow)', cursor:'pointer',
          }}>
            {fav ? '❤️' : '🤍'}
          </button>
          <div style={{ position:'absolute', top:12, left:12, display:'flex', gap:6, flexWrap:'wrap' }}>
            {property.is_verified && (
              <span style={{ background:'var(--green-bg)', color:'var(--green)', borderRadius:20, padding:'3px 10px', fontSize:12, fontWeight:600 }}>
                ✓ Verificado
              </span>
            )}
          </div>
        </div>
        <div style={{ padding:16 }}>
          <div style={{ fontSize:20, fontWeight:800, color:'var(--blue)' }}>
            {property.price_month}€ <span style={{ fontSize:13, fontWeight:400, color:'var(--muted)' }}>/mes</span>
          </div>
          <div style={{ fontSize:15, fontWeight:600, margin:'4px 0' }}>{property.title}</div>
          <div style={{ fontSize:13, color:'var(--muted)', display:'flex', gap:12, flexWrap:'wrap' }}>
            {nearest && <span>🏫 {nearest.minutes_walk} min · {nearest.university.name}</span>}
            {property.companions > 0 && <span>👥 {property.companions} compañero{property.companions > 1 ? 's' : ''}</span>}
            {hasUtilities && <span>⚡ Gastos incl.</span>}
          </div>
          {property.avg_rating && (
            <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, fontWeight:600, marginTop:10 }}>
              <span style={{ color:'#FBBF24' }}>★</span>
              <strong>{property.avg_rating}</strong>
              <span style={{ color:'var(--muted)', fontWeight:400 }}>({property.review_count})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

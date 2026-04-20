import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addFavorite, removeFavorite } from '../../api/properties'
import { useAuth } from '../../contexts/AuthContext'
import { useQueryClient } from '@tanstack/react-query'

const GRAD = [
  'linear-gradient(135deg,#93C5FD,#BFDBFE)',
  'linear-gradient(135deg,#6EE7B7,#A7F3D0)',
  'linear-gradient(135deg,#FCA5A5,#FCD34D)',
  'linear-gradient(135deg,#C4B5FD,#DDD6FE)',
  'linear-gradient(135deg,#FDE68A,#FCA5A5)',
]

export default function PropertyCard({ property, onFavoriteToggle }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [fav, setFav]           = useState(property.is_favorited)
  const [pending, setPending]   = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  const grad    = GRAD[property.id % GRAD.length]
  const nearest = property.nearby_universities?.[0]
  const hasUtilities = property.amenities?.some(a => a.key === 'UTILITIES')

  const toggleFav = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) { navigate('/login'); return }
    if (pending) return
    setPending(true)
    try {
      if (fav) {
        await removeFavorite(property.id)
        setFav(false)
        setJustSaved(false)
      } else {
        await addFavorite(property.id)
        setFav(true)
        setJustSaved(true)
        // Hide the banner after 4 s
        setTimeout(() => setJustSaved(false), 4000)
        qc.invalidateQueries(['favorites'])
      }
      onFavoriteToggle?.()
    } catch { /* noop */ }
    finally { setPending(false) }
  }

  return (
    <Link to={`/piso/${property.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div
        style={{
          background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)',
          overflow: 'hidden', cursor: 'pointer', transition: 'transform .2s, box-shadow .2s', position: 'relative',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
      >
        {/* Image */}
        <div style={{ height: 200, position: 'relative' }}>
          {property.images?.[0]
            ? <img src={property.images[0].image} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', background: grad }} />
          }

          {/* Favorite button */}
          <button
            onClick={toggleFav}
            title={fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            style={{
              position: 'absolute', top: 12, right: 12,
              background: fav ? 'var(--blue)' : 'white',
              border: 'none', borderRadius: '50%',
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, boxShadow: 'var(--shadow)', cursor: pending ? 'wait' : 'pointer',
              transition: 'background .2s, transform .15s',
              transform: pending ? 'scale(.9)' : 'scale(1)',
            }}
          >
            {fav ? '❤️' : '🤍'}
          </button>

          {/* Badges */}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {property.is_verified && (
              <span style={{ background: 'var(--green-bg)', color: 'var(--green)', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>
                ✓ Verificado
              </span>
            )}
            {property.is_featured && (
              <span style={{ background: '#FEF3C7', color: '#92400E', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>
                ⭐ Destacado
              </span>
            )}
          </div>
        </div>

        {/* "Saved" banner — appears briefly after adding */}
        {justSaved && (
          <div
            onClick={e => e.preventDefault()}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'var(--blue)', color: 'white',
              padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontSize: 13, fontWeight: 600, zIndex: 10,
              animation: 'slideUp .2s ease',
            }}
          >
            <span>✓ Guardado en favoritos</span>
            <Link
              to="/panel/favoritos"
              onClick={e => e.stopPropagation()}
              style={{ color: 'white', fontWeight: 700, fontSize: 12, border: '1.5px solid rgba(255,255,255,.6)', borderRadius: 20, padding: '3px 10px', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              Ver favoritos →
            </Link>
          </div>
        )}

        {/* Info */}
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--blue)' }}>
            {property.price_month}€ <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)' }}>/mes</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, margin: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {property.title}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
            {nearest && <span>🏫 {nearest.minutes_walk} min · {nearest.university.name}</span>}
            {property.companions > 0 && <span>👥 {property.companions} compañero{property.companions > 1 ? 's' : ''}</span>}
            {hasUtilities && <span>⚡ Gastos incl.</span>}
          </div>
          {property.avg_rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, marginTop: 6 }}>
              <span style={{ color: '#FBBF24' }}>★</span>
              <strong>{property.avg_rating}</strong>
              <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({property.review_count})</span>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </Link>
  )
}

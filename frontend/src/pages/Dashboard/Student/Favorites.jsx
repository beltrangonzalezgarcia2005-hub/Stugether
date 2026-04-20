import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFavorites, removeFavorite } from '../../../api/properties'
import { Link } from 'react-router-dom'
import Spinner from '../../../components/ui/Spinner'
import Button from '../../../components/ui/Button'

const TYPE_LABEL = { ROOM: 'Habitación', FULL: 'Piso entero', STUDIO: 'Estudio' }

export default function Favorites() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['favorites'], queryFn: getFavorites })
  const favorites = data?.data?.results || data?.data || []

  const remove = useMutation({
    mutationFn: (propertyId) => removeFavorite(propertyId),
    onSuccess: () => qc.invalidateQueries(['favorites']),
  })

  if (isLoading) return <Spinner />

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Favoritos</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            {favorites.length} piso{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/buscar"><Button variant="outline">Explorar más pisos</Button></Link>
      </div>

      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🏠</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Todavía no has guardado ningún piso</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 14 }}>
            Haz clic en el corazón ❤️ de cualquier anuncio para guardarlo aquí.
          </p>
          <Link to="/buscar"><Button>Explorar pisos</Button></Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
          {favorites.map(({ id, property: p }) => {
            const nearest     = p.nearby_universities?.[0]
            const hasUtilities = p.amenities?.some(a => a.key === 'UTILITIES')
            const hasWifi      = p.amenities?.some(a => a.key === 'WIFI')
            const hasFurnished = p.amenities?.some(a => a.key === 'FURNISHED')

            return (
              <div key={id} style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Image */}
                <div style={{ height: 180, position: 'relative', flexShrink: 0 }}>
                  {p.images?.[0]
                    ? <img src={p.images[0].image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#93C5FD,#BFDBFE)' }} />
                  }
                  {/* Remove favorite */}
                  <button
                    onClick={() => remove.mutate(p.id)}
                    title="Quitar de favoritos"
                    style={{
                      position: 'absolute', top: 10, right: 10, background: 'white',
                      border: 'none', borderRadius: '50%', width: 34, height: 34,
                      cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: 'var(--shadow)', transition: 'transform .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = ''}
                  >
                    ❤️
                  </button>
                  {/* Type badge */}
                  <span style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,.55)', color: 'white', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
                    {TYPE_LABEL[p.property_type] || p.property_type}
                  </span>
                  {p.is_verified && (
                    <span style={{ position: 'absolute', top: 10, left: 10, background: 'var(--green-bg)', color: 'var(--green)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
                      ✓ Verificado
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue)', lineHeight: 1 }}>
                    {p.price_month}€ <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)' }}>/mes</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>📍 {p.city}{p.neighborhood ? ` · ${p.neighborhood}` : ''}</div>

                  {/* Quick stats */}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    {p.bathrooms && <span>🚿 {p.bathrooms} baño{p.bathrooms > 1 ? 's' : ''}</span>}
                    {p.companions > 0 && <span>👥 {p.companions} compañero{p.companions > 1 ? 's' : ''}</span>}
                    {nearest && <span>🏫 {nearest.minutes_walk} min</span>}
                  </div>

                  {/* Amenity chips */}
                  {(hasUtilities || hasWifi || hasFurnished) && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                      {hasUtilities && <span style={chipStyle}>⚡ Gastos incl.</span>}
                      {hasWifi      && <span style={chipStyle}>📶 WiFi</span>}
                      {hasFurnished && <span style={chipStyle}>🛋️ Amueblado</span>}
                    </div>
                  )}

                  {/* Rating */}
                  {p.avg_rating > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                      <span style={{ color: '#FBBF24' }}>★</span>
                      <strong>{p.avg_rating}</strong>
                      <span style={{ color: 'var(--muted)', fontSize: 12 }}>({p.review_count} reseña{p.review_count !== 1 ? 's' : ''})</span>
                    </div>
                  )}

                  {/* Deposit */}
                  {p.deposit > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>Fianza: {p.deposit}€</div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
                  <Link to={`/piso/${p.id}`} style={{ flex: 1 }}>
                    <Button fullWidth>Ver piso</Button>
                  </Link>
                  <button
                    onClick={() => remove.mutate(p.id)}
                    title="Quitar de favoritos"
                    disabled={remove.isPending}
                    style={{ padding: '0 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--white)', cursor: 'pointer', color: 'var(--muted)', fontSize: 13, fontWeight: 500, transition: 'border-color .15s, color .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const chipStyle = {
  fontSize: 11, fontWeight: 600,
  background: 'var(--blue-light)', color: 'var(--blue-dark)',
  borderRadius: 20, padding: '3px 9px',
}

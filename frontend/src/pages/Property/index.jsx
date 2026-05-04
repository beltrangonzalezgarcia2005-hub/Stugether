import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { getProperty, addFavorite, removeFavorite } from '../../api/properties'
import { getReviews } from '../../api/reviews'
import { createReservation } from '../../api/reservations'
import { createConversation } from '../../api/messages'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import UserAvatar from '../../components/ui/UserAvatar'
import RequiresVerification from '../../components/ui/RequiresVerification'

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const GRAD = ['linear-gradient(135deg,#93C5FD,#BFDBFE)', 'linear-gradient(135deg,#6EE7B7,#A7F3D0)', 'linear-gradient(135deg,#C4B5FD,#DDD6FE)']

export default function PropertyDetail() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [bookingDates, setBookingDates] = useState({ start_date: '', end_date: '' })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')

  const contactOwner = useMutation({
    mutationFn: ({ ownerId, propertyId }) => createConversation(ownerId, propertyId),
    onSuccess: () => navigate('/panel/mensajes'),
  })

  const [lightbox, setLightbox] = useState(null) // index of open image, or null

  const qc = useQueryClient()
  const [fav, setFav]         = useState(false)
  const [favPending, setFavPending] = useState(false)
  const [justSaved, setJustSaved]   = useState(false)

  const { data: propData, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getProperty(id),
  })
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getReviews(id),
  })

  const p = propData?.data
  const reviews = reviewsData?.data?.results || []

  useEffect(() => { if (p) setFav(!!p.is_favorited) }, [p?.id])

  const toggleFav = async (e) => {
    e?.stopPropagation()
    if (!isAuthenticated) { navigate('/login'); return }
    if (favPending) return
    setFavPending(true)
    try {
      if (fav) {
        await removeFavorite(p.id)
        setFav(false)
        setJustSaved(false)
      } else {
        await addFavorite(p.id)
        setFav(true)
        setJustSaved(true)
        setTimeout(() => setJustSaved(false), 4000)
        qc.invalidateQueries(['favorites'])
      }
    } catch { /* noop */ }
    finally { setFavPending(false) }
  }

  const calcMonths = () => {
    if (!bookingDates.start_date || !bookingDates.end_date) return 0
    const diff = (new Date(bookingDates.end_date) - new Date(bookingDates.start_date)) / (1000 * 60 * 60 * 24 * 30)
    return Math.max(1, Math.round(diff))
  }
  const months = calcMonths()
  const subtotal = p ? months * parseFloat(p.price_month) : 0
  const serviceFee = subtotal * 0.07
  const total = subtotal + parseFloat(p?.deposit || 0) + serviceFee

  const handleReservation = async () => {
    if (!isAuthenticated) return navigate('/login')
    if (!bookingDates.start_date || !bookingDates.end_date) return setBookingError('Selecciona las fechas de entrada y salida.')
    setBookingLoading(true)
    setBookingError('')
    try {
      await createReservation({
        property: p.id,
        start_date: bookingDates.start_date,
        end_date: bookingDates.end_date,
        months,
        monthly_price: p.price_month,
        deposit: p.deposit,
      })
      navigate('/panel/reservas')
    } catch (err) {
      setBookingError(err.response?.data?.detail || 'Error al solicitar la reserva.')
    } finally {
      setBookingLoading(false)
    }
  }

  const allImages = p?.images || []

  const openLightbox = (idx) => setLightbox(idx)
  const closeLightbox = () => setLightbox(null)
  const prevImage = (e) => { e.stopPropagation(); setLightbox(i => (i - 1 + allImages.length) % allImages.length) }
  const nextImage = (e) => { e.stopPropagation(); setLightbox(i => (i + 1) % allImages.length) }

  if (isLoading) return <><Navbar /><Spinner /></>

  if (!p) return <><Navbar /><div style={{ padding:40, textAlign:'center' }}>Piso no encontrado.</div></>

  const nearest = p.nearby_universities?.[0]

  return (
    <div>
      <Navbar />

      <div style={{ background:'var(--white)', borderBottom:'1px solid var(--border)', padding:'14px 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', gap:8, fontSize:14, color:'var(--muted)' }}>
          <Link to="/buscar" style={{ color:'var(--blue)', fontWeight:500 }}>← Volver a resultados</Link>
          <span>/</span><span>{p.city}</span>
          <span>/</span><span style={{ color:'var(--text)', fontWeight:500 }}>{p.title}</span>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'24px 24px 60px' }}>
        {/* Gallery */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gridTemplateRows:'1fr 1fr', gap:8, height:420, borderRadius:'var(--radius)', overflow:'hidden', marginBottom:8 }}>
          <div
            onClick={() => p.images?.[0] && openLightbox(0)}
            style={{ gridRow:'1/3', background: p.images?.[0] ? undefined : GRAD[0], cursor: p.images?.[0] ? 'zoom-in' : 'default', position:'relative', overflow:'hidden' }}
          >
            {p.images?.[0] && <img src={p.images[0].image} alt={p.title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .2s' }}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />}
          </div>
          {[1, 2].map((i) => (
            <div key={i}
              onClick={() => p.images?.[i] && openLightbox(i)}
              style={{ background: p.images?.[i] ? undefined : GRAD[i], cursor: p.images?.[i] ? 'zoom-in' : 'default', position:'relative', overflow:'hidden' }}
            >
              {p.images?.[i] && <img src={p.images[i].image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .2s' }}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />}
            </div>
          ))}
        </div>

        {/* Lightbox overlay */}
        {lightbox !== null && allImages.length > 0 && (
          <div onClick={closeLightbox} style={{
            position:'fixed', inset:0, zIndex:1000,
            background:'rgba(0,0,0,.92)', display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <button onClick={closeLightbox} style={{
              position:'absolute', top:20, right:24, background:'none', border:'none',
              color:'white', fontSize:32, cursor:'pointer', lineHeight:1,
            }}>×</button>

            {allImages.length > 1 && (
              <button onClick={prevImage} style={{
                position:'absolute', left:16, background:'rgba(255,255,255,.15)', border:'none',
                color:'white', fontSize:28, borderRadius:'50%', width:48, height:48, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>‹</button>
            )}

            <img
              src={allImages[lightbox].image}
              alt=""
              style={{ maxHeight:'90vh', maxWidth:'90vw', objectFit:'contain', borderRadius:8, boxShadow:'0 0 60px rgba(0,0,0,.6)' }}
              onClick={e => e.stopPropagation()}
            />

            {allImages.length > 1 && (
              <button onClick={nextImage} style={{
                position:'absolute', right:16, background:'rgba(255,255,255,.15)', border:'none',
                color:'white', fontSize:28, borderRadius:'50%', width:48, height:48, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>›</button>
            )}

            <div style={{ position:'absolute', bottom:20, color:'rgba(255,255,255,.7)', fontSize:14 }}>
              {lightbox + 1} / {allImages.length}
            </div>
          </div>
        )}

        {/* Layout */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:32, alignItems:'start', marginTop:24 }}>
          {/* Left */}
          <div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
              {p.is_verified && <span style={{ background:'var(--green-bg)', color:'var(--green)', borderRadius:20, padding:'3px 10px', fontSize:12, fontWeight:600 }}>✓ Verificado</span>}
              {p.amenities?.some(a => a.key === 'UTILITIES') && <span style={{ background:'var(--blue-light)', color:'var(--blue-dark)', borderRadius:20, padding:'3px 10px', fontSize:12, fontWeight:600 }}>⚡ Gastos incluidos</span>}
            </div>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:6 }}>
              <h1 style={{ fontSize:26, fontWeight:800, margin:0, flex:1 }}>{p.title}</h1>
              <button
                onClick={toggleFav}
                title={fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                disabled={favPending}
                style={{
                  display:'flex', alignItems:'center', gap:6, flexShrink:0,
                  padding:'8px 16px', borderRadius:'var(--radius)',
                  border:`1.5px solid ${fav ? 'var(--blue)' : 'var(--border)'}`,
                  background: fav ? 'var(--blue-light)' : 'var(--white)',
                  color: fav ? 'var(--blue)' : 'var(--muted)',
                  fontSize:14, fontWeight:600, cursor: favPending ? 'wait' : 'pointer',
                  transition:'all .15s',
                }}
              >
                <span style={{ fontSize:17 }}>{fav ? '❤️' : '🤍'}</span>
                {fav ? 'Guardado' : 'Guardar'}
              </button>
            </div>
            {justSaved && (
              <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'var(--blue)', color:'white', borderRadius:8, padding:'8px 14px', fontSize:13, fontWeight:600, marginBottom:8 }}>
                <span>✓ Guardado en favoritos</span>
                <Link to="/panel/favoritos" style={{ color:'white', fontWeight:700, border:'1.5px solid rgba(255,255,255,.6)', borderRadius:20, padding:'2px 10px', textDecoration:'none', fontSize:12 }}>
                  Ver favoritos →
                </Link>
              </div>
            )}
            <div style={{ fontSize:15, color:'var(--muted)', marginBottom:10 }}>📍 {p.address}, {p.city}</div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              {p.avg_rating && <><span style={{ color:'#FBBF24' }}>{'★'.repeat(Math.round(p.avg_rating))}</span><strong>{p.avg_rating}</strong><span style={{ color:'var(--muted)', fontSize:13 }}>({p.review_count} reseñas)</span></>}
              {nearest && <span style={{ fontSize:14, fontWeight:500, color:'var(--blue)', background:'var(--blue-light)', padding:'4px 12px', borderRadius:20 }}>🏫 {nearest.minutes_walk} min · {nearest.university.name}</span>}
            </div>

            {/* Quick info */}
            <div style={{ display:'flex', background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', margin:'20px 0', overflow:'hidden' }}>
              {[
                [p.room_m2 ? `${p.room_m2}m²` : '—', 'Habitación'],
                [p.total_m2 ? `${p.total_m2}m²` : '—', 'Piso total'],
                [p.companions, 'Compañeros'],
                [p.bathrooms, 'Baños'],
                [p.floor || '—', 'Planta'],
              ].map(([val, lbl]) => (
                <div key={lbl} style={{ flex:1, padding:16, textAlign:'center', borderRight:'1px solid var(--border)' }}>
                  <div style={{ fontSize:20, fontWeight:800 }}>{val}</div>
                  <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{lbl}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:24, marginBottom:20 }}>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>📝 Descripción</div>
              <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.7 }}>{p.description}</p>
            </div>

            {/* Amenities */}
            {p.amenities?.length > 0 && (
              <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:24, marginBottom:20 }}>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>🏠 Características</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {p.amenities.map(a => (
                    <div key={a.key} style={{ display:'flex', alignItems:'center', gap:8, fontSize:14 }}>
                      <span>✓</span> {a.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner */}
            <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:24, marginBottom:20 }}>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>👤 Propietario</div>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <UserAvatar
                  src={p.owner?.avatar}
                  name={p.owner?.full_name}
                  size={60}
                  userId={p.owner?.id}
                />
                <div style={{ flex:1 }}>
                  <Link to={`/perfil/${p.owner?.id}`} style={{ textDecoration:'none', color:'inherit' }}>
                    <div style={{ fontSize:16, fontWeight:700 }}>{p.owner?.full_name} {p.owner?.is_verified && <span style={{ fontSize:12, color:'var(--green)' }}>✓</span>}</div>
                  </Link>
                  <div style={{ fontSize:13, color:'var(--muted)' }}>Propietario en Stugether</div>
                </div>
                <RequiresVerification message="Para contactar con el propietario necesitas verificar tu email.">
                  <Button
                    variant="outline"
                    disabled={contactOwner.isPending || !isAuthenticated}
                    onClick={() => isAuthenticated
                      ? contactOwner.mutate({ ownerId: p.owner?.id, propertyId: p.id })
                      : navigate('/login')
                    }
                  >
                    {contactOwner.isPending ? '…' : isAuthenticated ? 'Contactar' : 'Inicia sesión'}
                  </Button>
                </RequiresVerification>
              </div>
            </div>

            {/* Location map */}
            {p.lat && p.lng && (
              <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:24, marginBottom:20 }}>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>📍 Ubicación</div>
                <div style={{ height:280, borderRadius:8, overflow:'hidden', marginBottom:10 }}>
                  <MapContainer center={[p.lat, p.lng]} zoom={15} style={{ height:'100%', width:'100%' }} scrollWheelZoom={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                    <Marker position={[p.lat, p.lng]}>
                      <Popup><strong>{p.title}</strong><br />{p.address}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
                <div style={{ fontSize:13, color:'var(--muted)' }}>📍 {p.address}, {p.city}</div>
                {p.nearby_universities?.map(u => (
                  <div key={u.university.id} style={{ fontSize:13, color:'var(--muted)', marginTop:4 }}>
                    🏫 {u.university.name} — {u.minutes_walk} min a pie
                  </div>
                ))}
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:24 }}>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>⭐ Reseñas ({p.review_count})</div>
                {reviews.map((r, i) => (
                  <div key={r.id} style={{ paddingBottom:20, marginBottom:20, borderBottom: i < reviews.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                      <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#60A5FA,#2563EB)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'white', flexShrink:0 }}>
                        {r.student_detail?.first_name?.[0]}
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:600 }}>{r.student_detail?.full_name} · <span style={{ color:'#FBBF24' }}>{'★'.repeat(r.rating)}</span></div>
                        <div style={{ fontSize:12, color:'var(--muted)' }}>{r.period_start} – {r.period_end}</div>
                      </div>
                    </div>
                    <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.6 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow-lg)', padding:24, position:'sticky', top:90 }}>
            <div style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>{p.price_month}€ <span style={{ fontSize:15, fontWeight:400, color:'var(--muted)' }}>/mes</span></div>
            {p.avg_rating && <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:14, marginBottom:20 }}><span style={{ color:'#FBBF24' }}>★</span><strong>{p.avg_rating}</strong><span style={{ color:'var(--muted)' }}>({p.review_count})</span></div>}

            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'var(--muted)', marginBottom:6 }}>Fecha de entrada</label>
              <input type="date" value={bookingDates.start_date} onChange={e => setBookingDates(d => ({ ...d, start_date: e.target.value }))}
                style={{ width:'100%', border:'1.5px solid var(--border)', borderRadius:8, padding:'10px 12px', fontSize:14, outline:'none' }} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'var(--muted)', marginBottom:6 }}>Fecha de salida</label>
              <input type="date" value={bookingDates.end_date} onChange={e => setBookingDates(d => ({ ...d, end_date: e.target.value }))}
                style={{ width:'100%', border:'1.5px solid var(--border)', borderRadius:8, padding:'10px 12px', fontSize:14, outline:'none' }} />
            </div>

            {months > 0 && (
              <div style={{ background:'var(--bg)', borderRadius:8, padding:14, margin:'0 0 16px' }}>
                {[
                  [`${p.price_month}€ × ${months} meses`, `${subtotal.toFixed(2)}€`],
                  ['Fianza (1 mes)', `${p.deposit}€`],
                  ['Tarifa de servicio (7%)', `${serviceFee.toFixed(2)}€`],
                ].map(([l, v]) => (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:14, marginBottom:8, color:'var(--muted)' }}><span>{l}</span><span>{v}</span></div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:15, fontWeight:700, paddingTop:8, borderTop:'1px solid var(--border)' }}>
                  <span>Total primer pago</span><span>{total.toFixed(2)}€</span>
                </div>
              </div>
            )}

            <div style={{ display:'flex', alignItems:'flex-start', gap:10, background:'var(--green-bg)', borderRadius:8, padding:12, marginBottom:16, fontSize:13, color:'var(--green)' }}>
              <span style={{ fontSize:18, flexShrink:0 }}>🔒</span>
              <div><strong>Pago Escrow protegido.</strong> Tu dinero queda retenido hasta 48h después de tu entrada confirmada.</div>
            </div>

            {bookingError && <div style={{ background:'var(--red-bg)', color:'var(--red)', borderRadius:8, padding:'10px 14px', fontSize:14, marginBottom:12 }}>{bookingError}</div>}

            <RequiresVerification message="Para solicitar una reserva necesitas verificar tu email.">
              <button onClick={handleReservation} disabled={bookingLoading} style={{
                width:'100%', padding:14, fontSize:16, borderRadius:'var(--radius)', border:'none',
                background:'var(--blue)', color:'white', fontWeight:700, cursor:'pointer',
              }}>
                {bookingLoading ? 'Enviando…' : isAuthenticated ? 'Solicitar reserva' : 'Inicia sesión para reservar'}
              </button>
            </RequiresVerification>
            <div style={{ textAlign:'center', fontSize:12, color:'var(--muted)', marginTop:10 }}>
              No se te cobrará hasta que el propietario acepte
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

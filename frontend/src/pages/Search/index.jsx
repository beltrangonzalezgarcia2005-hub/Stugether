import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { getProperties } from '../../api/properties'
import Navbar from '../../components/layout/Navbar'
import PropertyCard from '../../components/features/PropertyCard'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import UniversitySelector from '../../components/ui/UniversitySelector'

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const PROPERTY_TYPES = [
  { value:'', label:'Todos' },
  { value:'ROOM', label:'Habitación' },
  { value:'FULL', label:'Piso entero' },
  { value:'STUDIO', label:'Estudio' },
]

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    university: searchParams.get('university') || '',
    campus: searchParams.get('campus') || '',
    city: searchParams.get('city') || '',
    min_price: '',
    max_price: '',
    property_type: '',
    is_verified: false,
    pets_allowed: false,
    amenity: '',
    ordering: '-created_at',
    page: 1,
  })
  // holds the full selector value object for UniversitySelector
  const [uniSelection, setUniSelection] = useState(
    searchParams.get('university') ? { universityName: searchParams.get('university'), campusId: searchParams.get('campus') || null, campusName: null } : ''
  )

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => getProperties(Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== false))),
  })

  const results = data?.data?.results || []
  const count = data?.data?.count || 0
  const mapCenter = results[0]?.lat ? [results[0].lat, results[0].lng] : [40.416775, -3.70379]

  const setFilter = (key, value) => setFilters(f => ({ ...f, [key]: value, page: 1 }))

  return (
    <div>
      <Navbar />

      {/* Top search bar */}
      <div style={{ background:'var(--white)', borderBottom:'1px solid var(--border)', padding:'16px 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', gap:12 }}>
          <UniversitySelector
            label=""
            placeholder="Universidad o ciudad…"
            value={uniSelection}
            onChange={sel => {
              setUniSelection(sel)
              const name = typeof sel === 'object' && sel ? sel.universityName : sel
              const campusId = typeof sel === 'object' && sel ? (sel.campusId || '') : ''
              setFilters(f => ({ ...f, university: name || '', campus: campusId, page: 1 }))
            }}
            containerStyle={{ marginBottom: 0, flex: 1, maxWidth: 360 }}
          />
          <select
            value={filters.ordering}
            onChange={e => setFilter('ordering', e.target.value)}
            style={{ border:'1.5px solid var(--border)', borderRadius:8, padding:'8px 12px', fontSize:13, background:'white', marginLeft:'auto' }}
          >
            <option value="-created_at">Más recientes</option>
            <option value="price_month">Precio: menor primero</option>
            <option value="-price_month">Precio: mayor primero</option>
          </select>
        </div>
      </div>

      {/* Layout: filters | results | map */}
      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr 36%', minHeight:'calc(100vh - 130px)' }}>

        {/* Filters */}
        <aside style={{ background:'var(--white)', borderRight:'1px solid var(--border)', padding:'20px 16px', overflowY:'auto', boxSizing:'border-box' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <strong style={{ fontSize:15 }}>Filtros</strong>
            <button onClick={() => setFilters(f => ({ ...f, min_price:'', max_price:'', property_type:'', is_verified:false, pets_allowed:false }))}
              style={{ color:'var(--blue)', fontSize:13, fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>
              Limpiar
            </button>
          </div>

          {/* Price */}
          <div style={{ marginBottom:20, paddingBottom:20, borderBottom:'1px solid var(--border)' }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'var(--muted)', marginBottom:10 }}>Precio mensual (€)</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <div>
                <div style={{ fontSize:11, color:'var(--muted)', marginBottom:4 }}>Mínimo</div>
                <input type="number" placeholder="0" value={filters.min_price} onChange={e => setFilter('min_price', e.target.value)}
                  style={{ width:'100%', boxSizing:'border-box', border:'1.5px solid var(--border)', borderRadius:8, padding:'8px 10px', fontSize:14, outline:'none' }} />
              </div>
              <div>
                <div style={{ fontSize:11, color:'var(--muted)', marginBottom:4 }}>Máximo</div>
                <input type="number" placeholder="∞" value={filters.max_price} onChange={e => setFilter('max_price', e.target.value)}
                  style={{ width:'100%', boxSizing:'border-box', border:'1.5px solid var(--border)', borderRadius:8, padding:'8px 10px', fontSize:14, outline:'none' }} />
              </div>
            </div>
          </div>

          {/* Type */}
          <div style={{ marginBottom:20, paddingBottom:20, borderBottom:'1px solid var(--border)' }}>
            <div style={{ fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'var(--muted)', marginBottom:12 }}>Tipo de alojamiento</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {PROPERTY_TYPES.map(({ value, label }) => (
                <button key={value} onClick={() => setFilter('property_type', value)} style={{
                  padding:'6px 14px', borderRadius:20, fontSize:13, fontWeight:500, cursor:'pointer', transition:'all .15s',
                  border: `1.5px solid ${filters.property_type === value ? 'var(--blue)' : 'var(--border)'}`,
                  background: filters.property_type === value ? 'var(--blue-light)' : 'white',
                  color: filters.property_type === value ? 'var(--blue)' : 'var(--text)',
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'var(--muted)', marginBottom:12 }}>Características</div>
            {[
              { key:'is_verified', label:'Solo verificados' },
              { key:'pets_allowed', label:'Mascotas permitidas' },
            ].map(({ key, label }) => (
              <label key={key} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, cursor:'pointer', fontSize:14 }}>
                <input type="checkbox" checked={!!filters[key]} onChange={e => setFilter(key, e.target.checked)}
                  style={{ width:16, height:16, accentColor:'var(--blue)' }} />
                {label}
              </label>
            ))}
          </div>

          <Button fullWidth onClick={refetch}>Aplicar filtros</Button>
        </aside>

        {/* Results */}
        <div style={{ padding:20, overflowY:'auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontSize:14, color:'var(--muted)' }}>
              <strong style={{ color:'var(--text)' }}>{count} pisos</strong>
              {filters.university && ` cerca de ${filters.university}`}
            </div>
          </div>

          {isLoading ? <Spinner /> : results.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:'var(--muted)' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
              <p>No encontramos pisos con estos filtros.</p>
              <Link to="/buscar"><Button variant="outline" style={{ marginTop:16 }}>Ver todos</Button></Link>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {results.map(p => (
                <Link key={p.id} to={`/piso/${p.id}`} style={{ textDecoration:'none' }}>
                  <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', display:'flex', overflow:'hidden', cursor:'pointer', transition:'box-shadow .15s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow='var(--shadow-md)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow='var(--shadow)'}
                  >
                    <div style={{ width:180, flexShrink:0 }}>
                      {p.images?.[0]
                        ? <img src={p.images[0].image} alt={p.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        : <div style={{ width:'100%', height:'100%', minHeight:140, background:'linear-gradient(135deg,#93C5FD,#BFDBFE)' }} />
                      }
                    </div>
                    <div style={{ padding:'14px 18px', flex:1 }}>
                      <div style={{ display:'flex', justifyContent:'space-between' }}>
                        <div style={{ fontSize:22, fontWeight:800, color:'var(--blue)' }}>{p.price_month}€ <span style={{ fontSize:13, fontWeight:400, color:'var(--muted)' }}>/mes</span></div>
                      </div>
                      <div style={{ fontSize:15, fontWeight:600, margin:'4px 0 6px' }}>{p.title}</div>
                      <div style={{ fontSize:13, color:'var(--muted)', display:'flex', gap:14, flexWrap:'wrap', marginBottom:8 }}>
                        <span>📍 {p.neighborhood || p.city}</span>
                        {p.nearby_universities?.[0] && <span>🏫 {p.nearby_universities[0].minutes_walk} min</span>}
                        {p.total_m2 && <span>🏠 {p.total_m2} m²</span>}
                      </div>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
                        {p.is_verified && <span style={{ background:'var(--green-bg)', color:'var(--green)', borderRadius:20, padding:'3px 10px', fontSize:12, fontWeight:600 }}>✓ Verificado</span>}
                        {p.amenities?.some(a => a.key === 'UTILITIES') && <span style={{ background:'var(--blue-light)', color:'var(--blue-dark)', borderRadius:20, padding:'3px 10px', fontSize:12, fontWeight:600 }}>⚡ Gastos incl.</span>}
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        {p.avg_rating ? <div style={{ fontSize:13, fontWeight:600 }}><span style={{ color:'#FBBF24' }}>★</span> {p.avg_rating} <span style={{ color:'var(--muted)', fontWeight:400 }}>({p.review_count})</span></div> : <div />}
                        <Button size="sm">Ver más →</Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div style={{ position:'sticky', top:130, height:'calc(100vh - 130px)' }}>
          <MapContainer center={mapCenter} zoom={13} style={{ height:'100%', width:'100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
            {results.filter(p => p.lat && p.lng).map(p => (
              <Marker key={p.id} position={[p.lat, p.lng]}>
                <Popup>
                  <strong>{p.title}</strong><br />{p.price_month}€/mes
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyProperties, deleteProperty } from '../../../api/properties'
import { Link } from 'react-router-dom'
import Spinner from '../../../components/ui/Spinner'
import Button from '../../../components/ui/Button'

export default function MyListings() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['my-properties'],
    queryFn: getMyProperties,
  })
  const properties = data?.data?.results || []

  const del = useMutation({
    mutationFn: (id) => deleteProperty(id),
    onSuccess: () => qc.invalidateQueries(['my-properties']),
  })

  if (isLoading) return <Spinner />

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Mis anuncios</h1>
          <p style={{ color:'var(--muted)' }}>{properties.length} propiedad{properties.length !== 1 ? 'es' : ''} publicada{properties.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/panel/anuncios/nuevo"><Button>+ Nuevo anuncio</Button></Link>
      </div>

      {properties.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🏠</div>
          <p style={{ color:'var(--muted)', marginBottom:20 }}>Todavía no has publicado ningún anuncio.</p>
          <Link to="/panel/anuncios/nuevo"><Button>Publicar mi primer piso</Button></Link>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {properties.map(p => (
            <div key={p.id} style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', display:'flex', overflow:'hidden' }}>
              <div style={{ width:140, flexShrink:0 }}>
                {p.images?.[0]
                  ? <img src={p.images[0].image} alt={p.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <div style={{ width:'100%', height:'100%', minHeight:110, background:'linear-gradient(135deg,#93C5FD,#BFDBFE)' }} />
                }
              </div>
              <div style={{ padding:'14px 18px', flex:1, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>{p.title}</div>
                  <div style={{ fontSize:13, color:'var(--muted)', marginBottom:8 }}>📍 {p.address}, {p.city}</div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontSize:16, fontWeight:800, color:'var(--blue)' }}>{p.price_month}€/mes</span>
                    {p.is_verified
                      ? <span style={{ background:'var(--green-bg)', color:'var(--green)', borderRadius:20, padding:'3px 8px', fontSize:12, fontWeight:600 }}>✓ Verificado</span>
                      : <span style={{ background:'var(--amber-bg)', color:'var(--amber)', borderRadius:20, padding:'3px 8px', fontSize:12, fontWeight:600 }}>⏳ Pendiente</span>
                    }
                    {p.is_active
                      ? <span style={{ background:'var(--green-bg)', color:'var(--green)', borderRadius:20, padding:'3px 8px', fontSize:12, fontWeight:600 }}>Activo</span>
                      : <span style={{ background:'var(--border)', color:'var(--muted)', borderRadius:20, padding:'3px 8px', fontSize:12, fontWeight:600 }}>Inactivo</span>
                    }
                    {p.avg_rating && <span style={{ fontSize:13 }}><span style={{ color:'#FBBF24' }}>★</span> {p.avg_rating} ({p.review_count})</span>}
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <Link to={`/piso/${p.id}`}><Button variant="outline" size="sm">Ver</Button></Link>
                  <Link to={`/panel/anuncios/${p.id}/editar`}><Button variant="outline" size="sm">✏️ Editar</Button></Link>
                  <Button variant="danger" size="sm" onClick={() => window.confirm('¿Eliminar este anuncio?') && del.mutate(p.id)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

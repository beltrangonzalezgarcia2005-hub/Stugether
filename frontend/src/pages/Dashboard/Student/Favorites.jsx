import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFavorites, removeFavorite } from '../../../api/properties'
import { Link } from 'react-router-dom'
import Spinner from '../../../components/ui/Spinner'
import Button from '../../../components/ui/Button'

export default function Favorites() {
  const { data, isLoading } = useQuery({ queryKey:['favorites'], queryFn: getFavorites })
  const qc = useQueryClient()
  const remove = useMutation({
    mutationFn: (propertyId) => removeFavorite(propertyId),
    onSuccess: () => qc.invalidateQueries(['favorites']),
  })

  const favorites = data?.data?.results || []

  if (isLoading) return <Spinner />

  return (
    <div>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Favoritos</h1>
      <p style={{ color:'var(--muted)', marginBottom:28 }}>{favorites.length} piso{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}</p>

      {favorites.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>❤️</div>
          <p style={{ color:'var(--muted)', marginBottom:20 }}>Todavía no has guardado ningún piso.</p>
          <Link to="/buscar"><Button>Explorar pisos</Button></Link>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {favorites.map(({ id, property: p }) => (
            <div key={id} style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', overflow:'hidden' }}>
              <div style={{ height:160, position:'relative' }}>
                {p.images?.[0]
                  ? <img src={p.images[0].image} alt={p.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#93C5FD,#BFDBFE)' }} />
                }
                <button onClick={() => remove.mutate(p.id)} style={{
                  position:'absolute', top:10, right:10, background:'white', border:'none',
                  borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:16,
                  display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow)',
                }}>❤️</button>
              </div>
              <div style={{ padding:14 }}>
                <div style={{ fontSize:18, fontWeight:800, color:'var(--blue)' }}>{p.price_month}€ <span style={{ fontSize:13, fontWeight:400, color:'var(--muted)' }}>/mes</span></div>
                <div style={{ fontSize:14, fontWeight:600, margin:'4px 0' }}>{p.title}</div>
                <div style={{ fontSize:13, color:'var(--muted)', marginBottom:12 }}>{p.city}</div>
                <Link to={`/piso/${p.id}`}><Button variant="outline" fullWidth size="sm">Ver detalles</Button></Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

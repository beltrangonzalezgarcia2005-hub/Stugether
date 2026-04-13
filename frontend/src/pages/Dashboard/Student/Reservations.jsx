import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReservations, updateReservationStatus } from '../../../api/reservations'
import { Link } from 'react-router-dom'
import Spinner from '../../../components/ui/Spinner'
import Button from '../../../components/ui/Button'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const STATUS_LABELS = {
  PENDING:   { label:'Pendiente',   color:'var(--amber)',  bg:'var(--amber-bg)' },
  ACCEPTED:  { label:'Aceptada',    color:'var(--blue)',   bg:'var(--blue-light)' },
  CONFIRMED: { label:'Confirmada',  color:'var(--green)',  bg:'var(--green-bg)' },
  CANCELLED: { label:'Cancelada',   color:'var(--red)',    bg:'var(--red-bg)' },
  COMPLETED: { label:'Completada',  color:'var(--muted)',  bg:'var(--border)' },
}

export default function Reservations() {
  const { data, isLoading } = useQuery({ queryKey:['reservations'], queryFn: getReservations })
  const qc = useQueryClient()
  const cancel = useMutation({
    mutationFn: (id) => updateReservationStatus(id, 'CANCELLED'),
    onSuccess: () => qc.invalidateQueries(['reservations']),
  })

  const reservations = data?.data?.results || []

  if (isLoading) return <Spinner />

  return (
    <div>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Mis reservas</h1>
      <p style={{ color:'var(--muted)', marginBottom:28 }}>Gestiona todas tus reservas activas y pasadas.</p>

      {reservations.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🏠</div>
          <p style={{ color:'var(--muted)', marginBottom:20 }}>Todavía no tienes ninguna reserva.</p>
          <Link to="/buscar"><Button>Buscar piso</Button></Link>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {reservations.map(r => {
            const status = STATUS_LABELS[r.status] || STATUS_LABELS.PENDING
            const p = r.property_detail
            return (
              <div key={r.id} style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:20 }}>
                <div style={{ display:'flex', gap:16 }}>
                  <div style={{ width:120, flexShrink:0, borderRadius:8, overflow:'hidden', height:90 }}>
                    {p?.images?.[0]
                      ? <img src={p.images[0].image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#93C5FD,#BFDBFE)' }} />
                    }
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <Link to={`/piso/${p?.id}`} style={{ fontSize:15, fontWeight:700, color:'var(--text)', textDecoration:'none' }}>
                          {p?.title}
                        </Link>
                        <div style={{ fontSize:13, color:'var(--muted)', marginTop:2 }}>📍 {p?.address}</div>
                      </div>
                      <span style={{ background:status.bg, color:status.color, borderRadius:20, padding:'3px 12px', fontSize:12, fontWeight:600 }}>
                        {status.label}
                      </span>
                    </div>
                    <div style={{ display:'flex', gap:20, margin:'10px 0', fontSize:13 }}>
                      <div><div style={{ color:'var(--muted)', fontSize:11 }}>ENTRADA</div><strong>{r.start_date}</strong></div>
                      <div><div style={{ color:'var(--muted)', fontSize:11 }}>SALIDA</div><strong>{r.end_date}</strong></div>
                      <div><div style={{ color:'var(--muted)', fontSize:11 }}>RENTA</div><strong>{r.monthly_price}€/mes</strong></div>
                      <div><div style={{ color:'var(--muted)', fontSize:11 }}>TOTAL</div><strong>{r.total}€</strong></div>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      {r.payment_status === 'ESCROW' && (
                        <span style={{ background:'var(--green-bg)', color:'var(--green)', borderRadius:20, padding:'3px 12px', fontSize:12, fontWeight:600 }}>
                          🔒 Pago Escrow activo
                        </span>
                      )}
                      {r.status === 'PENDING' && (
                        <Button variant="danger" size="sm" onClick={() => cancel.mutate(r.id)} disabled={cancel.isPending}>
                          Cancelar solicitud
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

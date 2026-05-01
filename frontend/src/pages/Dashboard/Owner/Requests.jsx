import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReservations, updateReservationStatus } from '../../../api/reservations'
import { Link } from 'react-router-dom'
import Spinner from '../../../components/ui/Spinner'
import Button from '../../../components/ui/Button'
import UserAvatar from '../../../components/ui/UserAvatar'
import { useAuth } from '../../../contexts/AuthContext'

const STATUS_LABELS = {
  PENDING:   { label:'Pendiente',   color:'var(--amber)',  bg:'var(--amber-bg)' },
  ACCEPTED:  { label:'Aceptada',    color:'var(--blue)',   bg:'var(--blue-light)' },
  CONFIRMED: { label:'Confirmada',  color:'var(--green)',  bg:'var(--green-bg)' },
  CANCELLED: { label:'Cancelada',   color:'var(--red)',    bg:'var(--red-bg)' },
  COMPLETED: { label:'Completada',  color:'var(--muted)',  bg:'var(--border)' },
}

export default function Requests() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey:['reservations'], queryFn: getReservations })
  const reservations = data?.data?.results || []
  const pending = reservations.filter(r => r.status === 'PENDING')
  const others = reservations.filter(r => r.status !== 'PENDING')

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => updateReservationStatus(id, status),
    onSuccess: () => qc.invalidateQueries(['reservations']),
  })

  if (isLoading) return <Spinner />

  const ReservationRow = ({ r }) => {
    const status = STATUS_LABELS[r.status] || STATUS_LABELS.PENDING
    const student = r.student_detail
    return (
      <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:20, marginBottom:14 }}>
        <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
          <div style={{ width:100, flexShrink:0, borderRadius:8, overflow:'hidden', height:76 }}>
            {r.property_detail?.images?.[0]
              ? <img src={r.property_detail.images[0].image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#93C5FD,#BFDBFE)' }} />
            }
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <Link to={`/piso/${r.property_detail?.id}`} style={{ fontSize:14, fontWeight:700, color:'var(--text)', textDecoration:'none' }}>
                {r.property_detail?.title}
              </Link>
              <span style={{ background:status.bg, color:status.color, borderRadius:20, padding:'3px 10px', fontSize:12, fontWeight:600 }}>
                {status.label}
              </span>
            </div>

            {/* Student info */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <UserAvatar src={student?.avatar} name={student?.full_name} size={28} />
              <span style={{ fontSize:13, fontWeight:600 }}>{student?.full_name}</span>
              {student?.is_verified && <span style={{ fontSize:11, color:'var(--green)', fontWeight:600 }}>✓ Verificado</span>}
            </div>

            <div style={{ display:'flex', gap:16, fontSize:13, color:'var(--muted)', marginBottom:12, flexWrap:'wrap' }}>
              <span>📅 {r.start_date} → {r.end_date}</span>
              <span>📆 {r.months} meses</span>
              <span>💰 {r.monthly_price}€/mes</span>
              <span>Total: <strong style={{ color:'var(--text)' }}>{r.total}€</strong></span>
            </div>

            {r.status === 'PENDING' && user?.role === 'OWNER' && (
              <div style={{ display:'flex', gap:8 }}>
                <Button
                  variant="primary" size="sm"
                  disabled={updateStatus.isPending}
                  onClick={() => updateStatus.mutate({ id: r.id, status: 'ACCEPTED' })}
                >
                  ✓ Aceptar
                </Button>
                <Button
                  variant="danger" size="sm"
                  disabled={updateStatus.isPending}
                  onClick={() => updateStatus.mutate({ id: r.id, status: 'CANCELLED' })}
                >
                  ✕ Rechazar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Solicitudes de reserva</h1>
      <p style={{ color:'var(--muted)', marginBottom:28 }}>Gestiona las solicitudes de los estudiantes. Tienes 24h para responder.</p>

      {pending.length > 0 && (
        <div style={{ marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <h2 style={{ fontSize:16, fontWeight:700 }}>Pendientes de respuesta</h2>
            <span style={{ background:'var(--amber-bg)', color:'var(--amber)', borderRadius:20, padding:'2px 10px', fontSize:12, fontWeight:700 }}>
              {pending.length}
            </span>
          </div>
          {pending.map(r => <ReservationRow key={r.id} r={r} />)}
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h2 style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>Historial</h2>
          {others.map(r => <ReservationRow key={r.id} r={r} />)}
        </div>
      )}

      {reservations.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 0', background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>📋</div>
          <p style={{ color:'var(--muted)' }}>No tienes solicitudes de reserva todavía.</p>
        </div>
      )}
    </div>
  )
}

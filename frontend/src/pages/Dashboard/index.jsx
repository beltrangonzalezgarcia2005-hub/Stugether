import { Outlet, Navigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import { getConversations } from '../../api/messages'
import { getReservations } from '../../api/reservations'

const NAV = [
  { to:'/panel/reservas',      icon:'🏠', label:'Mis reservas' },
  { to:'/panel/favoritos',     icon:'❤️', label:'Favoritos' },
  { to:'/panel/anuncios',      icon:'🏢', label:'Mis anuncios' },
  { to:'/panel/solicitudes',   icon:'📋', label:'Solicitudes' },
  { to:'/panel/mensajes',      icon:'💬', label:'Mensajes' },
  { to:'/panel/documentos',    icon:'📄', label:'Documentos' },
  { to:'/panel/verificacion',  icon:'🪪', label:'Verificación' },
  { to:'/panel/configuracion', icon:'⚙️', label:'Configuración' },
]

export default function Dashboard() {
  const { data: convData } = useQuery({ queryKey:['conversations'], queryFn: getConversations })
  const { data: resData }  = useQuery({ queryKey:['reservations'],  queryFn: getReservations })

  const unread  = convData?.data?.results?.reduce((acc, c) => acc + (c.unread_count || 0), 0) || 0
  const pending = resData?.data?.results?.filter(r => r.status === 'PENDING').length || 0

  const navItems = NAV.map(item => {
    if (item.label === 'Mensajes')   return { ...item, badge: unread }
    if (item.label === 'Solicitudes') return { ...item, badge: pending }
    return item
  })

  return (
    <>
      <Navbar />
      <DashboardLayout navItems={navItems}>
        <Outlet />
      </DashboardLayout>
    </>
  )
}

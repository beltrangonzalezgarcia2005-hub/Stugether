import { Outlet, Navigate } from 'react-router-dom'
import Navbar from '../../../components/layout/Navbar'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import { getConversations } from '../../../api/messages'

const NAV = [
  { to:'/panel/estudiante/reservas', icon:'🏠', label:'Mis reservas' },
  { to:'/panel/estudiante/favoritos', icon:'❤️', label:'Favoritos' },
  { to:'/panel/estudiante/mensajes', icon:'💬', label:'Mensajes' },
  { to:'/panel/estudiante/documentos', icon:'📄', label:'Mis documentos' },
  { to:'/panel/estudiante/configuracion', icon:'⚙️', label:'Configuración' },
]

export default function StudentDashboard() {
  const { data } = useQuery({ queryKey:['conversations'], queryFn: getConversations })
  const unread = data?.data?.results?.reduce((acc, c) => acc + (c.unread_count || 0), 0) || 0

  const navItems = NAV.map(item =>
    item.label === 'Mensajes' ? { ...item, badge: unread } : item
  )

  return (
    <>
      <Navbar />
      <DashboardLayout navItems={navItems}>
        <Outlet />
      </DashboardLayout>
    </>
  )
}

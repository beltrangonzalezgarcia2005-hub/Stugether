import { Outlet } from 'react-router-dom'
import Navbar from '../../../components/layout/Navbar'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import { getReservations } from '../../../api/reservations'

const NAV = [
  { to:'/panel/propietario/anuncios', icon:'🏠', label:'Mis anuncios' },
  { to:'/panel/propietario/nuevo', icon:'➕', label:'Nuevo anuncio' },
  { to:'/panel/propietario/solicitudes', icon:'📋', label:'Solicitudes' },
  { to:'/panel/propietario/mensajes', icon:'💬', label:'Mensajes' },
  { to:'/panel/propietario/verificacion', icon:'🪪', label:'Verificación' },
  { to:'/panel/propietario/configuracion', icon:'⚙️', label:'Configuración' },
]

export default function OwnerDashboard() {
  const { data } = useQuery({ queryKey:['reservations'], queryFn: getReservations })
  const pending = data?.data?.results?.filter(r => r.status === 'PENDING').length || 0

  const navItems = NAV.map(item =>
    item.label === 'Solicitudes' ? { ...item, badge: pending } : item
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

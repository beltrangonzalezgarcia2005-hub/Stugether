import { useState } from 'react'
import { Outlet, Navigate, Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import { getConversations } from '../../api/messages'
import { getReservations } from '../../api/reservations'
import { useAuth } from '../../contexts/AuthContext'

const NAV = [
  { to:'/panel/reservas',      icon:'🏠', label:'Mis reservas' },
  { to:'/panel/favoritos',     icon:'❤️', label:'Favoritos' },
  { to:'/panel/anuncios',      icon:'🏢', label:'Mis anuncios' },
  { to:'/panel/solicitudes',   icon:'📋', label:'Solicitudes' },
  { to:'/panel/mensajes',      icon:'💬', label:'Mensajes' },
  { to:'/panel/documentos',    icon:'📄', label:'Documentos' },
  { to:'/panel/verificacion',  icon:'🪪', label:'Verificación' },
  { to:'/panel/configuracion', icon:'⚙️', label:'Configuración' },
  { to:'/panel/perfil',        icon:'👤', label:'Mi Perfil' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const { data: convData } = useQuery({ queryKey:['conversations'], queryFn: getConversations })
  const { data: resData }  = useQuery({ queryKey:['reservations'],  queryFn: getReservations })

  const unread  = convData?.data?.results?.reduce((acc, c) => acc + (c.unread_count || 0), 0) || 0
  const pending = resData?.data?.results?.filter(r => r.status === 'PENDING').length || 0

  const navItems = NAV.map(item => {
    if (item.label === 'Mensajes')   return { ...item, badge: unread }
    if (item.label === 'Solicitudes') return { ...item, badge: pending }
    return item
  })

  const showBanner = !user?.is_verified && !bannerDismissed

  return (
    <>
      <Navbar />
      {showBanner && (
        <div style={{
          background: '#FEF3C7', borderBottom: '1px solid #FDE68A',
          padding: '12px 24px', display: 'flex', alignItems: 'center',
          gap: 12, fontSize: 14,
        }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span style={{ flex: 1, color: '#92400E' }}>
            <strong>Verifica tu email</strong> para acceder a todas las funcionalidades de Stuguether.{' '}
            <Link to="/panel/verificacion" style={{ color: '#B45309', fontWeight: 700 }}>
              Ver estado de verificación
            </Link>
          </span>
          <button
            onClick={() => setBannerDismissed(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#92400E', lineHeight: 1, padding: 4 }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      )}
      <DashboardLayout navItems={navItems}>
        <Outlet />
      </DashboardLayout>
    </>
  )
}

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function DashboardLayout({ children, navItems }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'calc(100vh - 64px)' }}>
      <aside style={{ background:'var(--white)', borderRight:'1px solid var(--border)', padding:'24px 0', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'0 20px 20px', borderBottom:'1px solid var(--border)', marginBottom:16 }}>
          <div style={{
            width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#60A5FA,#2563EB)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:18, color:'white', fontWeight:700, marginBottom:10,
          }}>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div style={{ fontSize:15, fontWeight:700 }}>{user?.first_name} {user?.last_name}</div>
          <div style={{ fontSize:12, color:'var(--muted)', marginBottom:8 }}>
            {user?.student_profile?.university || user?.email}
          </div>
          {user?.is_verified && (
            <span style={{ fontSize:12, fontWeight:600, color:'var(--green)', background:'var(--green-bg)', padding:'2px 8px', borderRadius:20 }}>
              ✓ Verificado
            </span>
          )}
        </div>

        <nav style={{ flex:1, padding:'0 12px' }}>
          {navItems.map(({ to, icon, label, badge }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
              borderRadius:8, fontSize:14, fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--blue)' : 'var(--muted)',
              background: isActive ? 'var(--blue-light)' : 'transparent',
              textDecoration:'none', marginBottom:2, transition:'all .15s',
            })}>
              <span style={{ fontSize:18 }}>{icon}</span>
              <span>{label}</span>
              {badge > 0 && (
                <span style={{ marginLeft:'auto', background:'var(--red)', color:'white', borderRadius:10, padding:'1px 7px', fontSize:11, fontWeight:700 }}>
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding:'16px 24px', marginTop:'auto', borderTop:'1px solid var(--border)' }}>
          <button onClick={handleLogout} style={{ background:'none', border:'none', color:'var(--muted)', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      <main style={{ padding:32, background:'var(--bg)', overflowY:'auto' }}>
        {children}
      </main>
    </div>
  )
}

import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getUser, getUserPublicProperties } from '../../api/users'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/layout/Navbar'
import Spinner from '../../components/ui/Spinner'
import PropertyCard from '../../components/features/PropertyCard'

const HABITS = {
  NO_SMOKER:   { label: 'No fumador',  icon: '🚭' },
  PET_FRIENDLY:{ label: 'Pet friendly', icon: '🐾' },
  STUDIOUS:    { label: 'Estudioso',   icon: '📚' },
  SOCIAL:      { label: 'Social',      icon: '🎉' },
  EARLY_RISER: { label: 'Madrugador',  icon: '☀️' },
  SPORTY:      { label: 'Deportista',  icon: '⚽' },
  TIDY:        { label: 'Ordenado',    icon: '✨' },
}

export default function PublicProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const isOwner = authUser && String(authUser.id) === String(id)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
  })
  const { data: propsData } = useQuery({
    queryKey: ['user-properties', id],
    queryFn: () => getUserPublicProperties(id),
    enabled: !!id,
  })
  const user = data?.data
  const sp   = user?.student_profile
  const userProperties = propsData?.data?.results || propsData?.data || []

  if (isLoading) return <><Navbar /><div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spinner /></div></>
  if (isError || !user) return (
    <>
      <Navbar />
      <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Perfil no encontrado</h1>
        <button onClick={() => navigate(-1)} style={{ color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>← Volver</button>
      </div>
    </>
  )

  const initials  = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`
  const habits    = sp?.habits || []

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Volver
        </button>

        {/* Profile card */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ height: 100, background: 'linear-gradient(135deg,#60A5FA,#2563EB)' }} />
          <div style={{ padding: '0 28px 24px', marginTop: -36 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid white', overflow: 'hidden', background: 'linear-gradient(135deg,#60A5FA,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user.avatar
                  ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>{initials}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {user.is_verified && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', background: 'var(--green-bg)', padding: '4px 10px', borderRadius: 20 }}>✓ Verificado</span>
                )}
                {isOwner && (
                  <button
                    onClick={() => navigate('/panel/configuracion?tab=perfil')}
                    style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue)', background: 'var(--white)', border: '1.5px solid var(--blue)', borderRadius: 'var(--radius)', padding: '6px 14px', cursor: 'pointer' }}
                  >
                    Editar perfil
                  </button>
                )}
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{user.first_name} {user.last_name}</div>
            {sp?.university && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>🎓 {sp.university}</div>}
            {sp?.city && <div style={{ fontSize: 13, color: 'var(--muted)' }}>📍 {sp.city}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 20 }}>
            {/* Academic */}
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🎓 Información Académica</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'EDAD',        value: sp?.age ? `${sp.age} años` : null },
                  { label: 'GRADO',       value: sp?.degree || null },
                  { label: 'CURSO',       value: sp?.course ? `${sp.course}º Curso` : null },
                  { label: 'UNIVERSIDAD', value: sp?.university || null },
                ].filter(i => i.value).map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sobre mí */}
            {(user.bio || sp?.roommate_bio) && (
              <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 28 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>💬 Sobre mí</h2>
                {user.bio && <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)', marginBottom: 16 }}>{user.bio}</p>}
                {sp?.roommate_bio && (
                  <div style={{ background: 'var(--blue-light)', borderRadius: 8, padding: '12px 16px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', marginBottom: 6 }}>Lo que busca en un compañero de piso</div>
                    <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>{sp.roommate_bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lifestyle */}
          {habits.length > 0 && (
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🏡 Lifestyle & Convivencia</h2>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>Mis hábitos y preferencias de convivencia</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {habits.map(key => {
                  const h = HABITS[key]
                  if (!h) return null
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, background: 'var(--blue-light)', border: '1.5px solid var(--blue)', color: 'var(--blue)' }}>
                      {h.icon} {h.label}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {userProperties.length > 0 && (
          <div style={{ marginTop: 20, background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🏠 Anuncios de este usuario</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {userProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

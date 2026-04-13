import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getProperty, updateProperty, uploadPropertyImage } from '../../../api/properties'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Spinner from '../../../components/ui/Spinner'

const schema = z.object({
  title:         z.string().min(5, 'Mínimo 5 caracteres'),
  description:   z.string().min(20, 'Mínimo 20 caracteres'),
  address:       z.string().min(5, 'Introduce la dirección completa'),
  city:          z.string().min(2, 'Introduce la ciudad'),
  neighborhood:  z.string().optional(),
  property_type: z.enum(['ROOM', 'FULL', 'STUDIO']),
  price_month:   z.coerce.number().min(1, 'Precio requerido'),
  deposit:       z.coerce.number().min(0),
  room_m2:       z.coerce.number().optional(),
  total_m2:      z.coerce.number().optional(),
  companions:    z.coerce.number().min(0).max(20),
  bathrooms:     z.coerce.number().min(1),
  floor:         z.string().optional(),
  gender_pref:   z.enum(['NONE', 'FEMALE', 'MALE']),
  pets_allowed:  z.boolean().optional(),
  elevator:      z.boolean().optional(),
})

const AMENITY_OPTIONS = [
  { key:'WIFI',            label:'WiFi alta velocidad',  icon:'📶' },
  { key:'UTILITIES',       label:'Gastos incluidos',      icon:'⚡' },
  { key:'FURNISHED',       label:'Amueblado',             icon:'🛋️' },
  { key:'PARKING',         label:'Parking incluido',      icon:'🅿️' },
  { key:'AC',              label:'Aire acondicionado',    icon:'❄️' },
  { key:'HEATING',         label:'Calefacción',           icon:'🔥' },
  { key:'WASHER',          label:'Lavadora',              icon:'🧺' },
  { key:'DESK',            label:'Escritorio de estudio', icon:'🖥️' },
  { key:'ERGONOMIC_CHAIR', label:'Silla ergonómica',      icon:'🪑' },
]

export default function EditListing() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef()

  const [serverError, setServerError]             = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [newPhotos, setNewPhotos]                 = useState([])
  const [saved, setSaved]                         = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn:  () => getProperty(id),
  })
  const p = data?.data

  const { register, reset, watch, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const propertyType = watch('property_type')
  const genderPref   = watch('gender_pref')

  useEffect(() => {
    if (!p) return
    reset({
      title:         p.title         || '',
      description:   p.description   || '',
      address:       p.address       || '',
      city:          p.city          || '',
      neighborhood:  p.neighborhood  || '',
      property_type: p.property_type || 'ROOM',
      price_month:   p.price_month   || '',
      deposit:       p.deposit       || 0,
      room_m2:       p.room_m2       || '',
      total_m2:      p.total_m2      || '',
      companions:    p.companions     ?? 0,
      bathrooms:     p.bathrooms     || 1,
      floor:         p.floor         || '',
      gender_pref:   p.gender_pref   || 'NONE',
      pets_allowed:  p.pets_allowed  || false,
      elevator:      p.elevator      || false,
    })
    setSelectedAmenities(p.amenities?.map(a => a.key) || [])
  }, [p, reset])

  const update = useMutation({
    mutationFn: async (formData) => {
      await updateProperty(id, formData)
      for (const { file } of newPhotos) {
        try { await uploadPropertyImage(id, file) } catch (_) { /* skip failed */ }
      }
    },
    onSuccess: () => {
      setSaved(true)
      setNewPhotos([])
      setTimeout(() => navigate('/panel/anuncios'), 1500)
    },
    onError: (err) => setServerError(err.response?.data?.detail || 'Error al guardar los cambios.'),
  })

  const toggleAmenity = (key) =>
    setSelectedAmenities(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    setNewPhotos(prev => [...prev, ...files.map(f => ({ file: f, preview: URL.createObjectURL(f) }))].slice(0, 10))
    e.target.value = ''
  }

  const radioBtn = (active) => ({
    padding:'12px 8px', border:`2px solid ${active ? 'var(--blue)' : 'var(--border)'}`,
    borderRadius:8, fontSize:14, fontWeight: active ? 700 : 500, textAlign:'center',
    background: active ? 'var(--blue-light)' : 'var(--white)',
    color: active ? 'var(--blue)' : 'var(--text)', transition:'all .15s', cursor:'pointer',
  })

  if (isLoading) return <Spinner />

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
        <button onClick={() => navigate('/panel/anuncios')} type="button"
          style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:22, padding:0 }}>
          ←
        </button>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, marginBottom:2 }}>Editar anuncio</h1>
          <p style={{ color:'var(--muted)', fontSize:13 }}>{p?.title}</p>
        </div>
      </div>

      <div style={{ display:'grid', gap:20, maxWidth:720 }}>

        {/* Basic info */}
        <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:28 }}>
          <h2 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Información básica</h2>
          <Input label="Título *" error={errors.title?.message} {...register('title')} />

          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'var(--muted)', marginBottom:8 }}>
              Tipo de alojamiento *
            </label>
            <div style={{ display:'flex', gap:10 }}>
              {[{ v:'ROOM', l:'Habitación' }, { v:'FULL', l:'Piso entero' }, { v:'STUDIO', l:'Estudio' }].map(({ v, l }) => (
                <label key={v} style={{ flex:1 }}>
                  <input type="radio" value={v} {...register('property_type')} style={{ display:'none' }} />
                  <div style={radioBtn(propertyType === v)}>{l}</div>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'var(--muted)', marginBottom:6 }}>
              Descripción *
            </label>
            <textarea rows={5}
              style={{ width:'100%', boxSizing:'border-box', border:`1.5px solid ${errors.description ? 'var(--red)' : 'var(--border)'}`, borderRadius:'var(--radius)', padding:'10px 14px', fontSize:14, outline:'none', resize:'vertical', fontFamily:'inherit' }}
              {...register('description')}
            />
            {errors.description && <span style={{ color:'var(--red)', fontSize:12 }}>{errors.description.message}</span>}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Input label="Precio mensual (€) *" type="number" min="1" error={errors.price_month?.message} {...register('price_month')} />
            <Input label="Fianza (€) *" type="number" min="0" {...register('deposit')} />
          </div>
        </div>

        {/* Location */}
        <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:28 }}>
          <h2 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Ubicación</h2>
          <Input label="Dirección *" error={errors.address?.message} {...register('address')} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Input label="Ciudad *" error={errors.city?.message} {...register('city')} />
            <Input label="Barrio" {...register('neighborhood')} />
          </div>
        </div>

        {/* Details */}
        <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:28 }}>
          <h2 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Detalles</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Input label="Tamaño habitación (m²)" type="number" {...register('room_m2')} />
            <Input label="Tamaño piso total (m²)" type="number" {...register('total_m2')} />
            <Input label="Nº compañeros" type="number" min="0" {...register('companions')} />
            <Input label="Nº baños" type="number" min="1" {...register('bathrooms')} />
            <Input label="Planta" {...register('floor')} />
          </div>
        </div>

        {/* Photos */}
        <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:28 }}>
          <h2 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Fotos</h2>
          {p?.images?.length > 0 && (
            <>
              <p style={{ fontSize:13, color:'var(--muted)', marginBottom:10 }}>Fotos actuales:</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
                {p.images.map((img, idx) => (
                  <div key={img.id} style={{ position:'relative', aspectRatio:'1', borderRadius:8, overflow:'hidden', border:'2px solid var(--border)' }}>
                    <img src={img.image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    {idx === 0 && <span style={{ position:'absolute', top:6, left:6, background:'var(--blue)', color:'white', fontSize:10, fontWeight:700, borderRadius:4, padding:'2px 6px' }}>PORTADA</span>}
                  </div>
                ))}
              </div>
            </>
          )}
          {newPhotos.length > 0 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
              {newPhotos.map(({ preview }, idx) => (
                <div key={idx} style={{ position:'relative', aspectRatio:'1', borderRadius:8, overflow:'hidden', border:'2px solid var(--blue)' }}>
                  <img src={preview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  <button type="button" onClick={() => setNewPhotos(prev => prev.filter((_, i) => i !== idx))}
                    style={{ position:'absolute', top:6, right:6, background:'rgba(0,0,0,.6)', border:'none', borderRadius:'50%', width:22, height:22, color:'white', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div onClick={() => fileInputRef.current.click()}
            style={{ border:'2px dashed var(--border)', borderRadius:'var(--radius)', padding:'24px', textAlign:'center', cursor:'pointer', background:'var(--blue-light)' }}>
            <div style={{ fontSize:28, marginBottom:6 }}>📸</div>
            <div style={{ fontSize:14, color:'var(--blue-dark)', fontWeight:600 }}>Añadir más fotos</div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple style={{ display:'none' }} onChange={handlePhotoChange} />
        </div>

        {/* Amenities */}
        <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:28 }}>
          <h2 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Características</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
            {AMENITY_OPTIONS.map(({ key, label, icon }) => {
              const active = selectedAmenities.includes(key)
              return (
                <div key={key} onClick={() => toggleAmenity(key)} style={{
                  display:'flex', alignItems:'center', gap:10, padding:'12px 14px',
                  border:`2px solid ${active ? 'var(--blue)' : 'var(--border)'}`, borderRadius:8, cursor:'pointer',
                  background: active ? 'var(--blue-light)' : 'var(--white)', transition:'all .15s',
                }}>
                  <span style={{ fontSize:20 }}>{icon}</span>
                  <span style={{ fontSize:14, fontWeight: active ? 600 : 400 }}>{label}</span>
                  {active && <span style={{ marginLeft:'auto', color:'var(--blue)', fontWeight:700 }}>✓</span>}
                </div>
              )
            })}
          </div>

          <label style={{ display:'block', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'var(--muted)', marginBottom:8 }}>
            Preferencia de compañeros
          </label>
          <div style={{ display:'flex', gap:10, marginBottom:16 }}>
            {[{ v:'NONE', l:'Sin preferencia' }, { v:'FEMALE', l:'Solo chicas' }, { v:'MALE', l:'Solo chicos' }].map(({ v, l }) => (
              <label key={v} style={{ flex:1 }}>
                <input type="radio" value={v} {...register('gender_pref')} style={{ display:'none' }} />
                <div style={radioBtn(genderPref === v)}>{l}</div>
              </label>
            ))}
          </div>

          {[{ k:'pets_allowed', l:'Se admiten mascotas' }, { k:'elevator', l:'El edificio tiene ascensor' }].map(({ k, l }) => (
            <label key={k} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14, cursor:'pointer', fontSize:14, fontWeight:500, padding:'12px 14px', border:'1.5px solid var(--border)', borderRadius:8 }}>
              <input type="checkbox" {...register(k)} style={{ width:18, height:18, accentColor:'var(--blue)' }} />
              {l}
            </label>
          ))}
        </div>

        {serverError && (
          <div style={{ background:'var(--red-bg)', color:'var(--red)', borderRadius:8, padding:'12px 16px', fontSize:14 }}>
            {serverError}
          </div>
        )}
        {saved && (
          <div style={{ background:'var(--green-bg)', color:'var(--green)', borderRadius:8, padding:'12px 16px', fontSize:14, fontWeight:600 }}>
            Cambios guardados correctamente.
          </div>
        )}

        <div style={{ display:'flex', gap:12, paddingBottom:32 }}>
          <Button variant="outline" onClick={() => navigate('/panel/anuncios')} type="button">Cancelar</Button>
          <Button onClick={() => handleSubmit(d => update.mutate(d))()} disabled={update.isPending} type="button">
            {update.isPending ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </div>
  )
}

import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createProperty, uploadPropertyImage, geocodeAddress } from '../../../api/properties'
import client from '../../../api/client'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

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

const STEPS = ['Información básica', 'Ubicación', 'Detalles', 'Fotos', 'Características']

export default function NewListing() {
  const [step, setStep]                     = useState(0)
  const [serverError, setServerError]       = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [photos, setPhotos]                 = useState([])
  const [geocoding, setGeocoding]           = useState(false)
  const [geocodeMsg, setGeocodeMsg]         = useState('')
  const [coords, setCoords]                 = useState({ lat: null, lng: null })
  const fileInputRef                        = useRef()
  const navigate                            = useNavigate()

  const { register, handleSubmit, trigger, getValues, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      property_type: 'ROOM',
      companions: 0,
      bathrooms: 1,
      gender_pref: 'NONE',
      pets_allowed: false,
      elevator: false,
    },
  })

  const propertyType = watch('property_type')
  const genderPref   = watch('gender_pref')

  const handleGeocode = async () => {
    const { address, city } = getValues()
    if (!address || !city) return
    setGeocoding(true)
    setGeocodeMsg('')
    const result = await geocodeAddress(`${address}, ${city}, España`)
    setGeocoding(false)
    if (result) {
      setCoords(result)
      setGeocodeMsg(`✓ Ubicado: ${result.lat.toFixed(5)}, ${result.lng.toFixed(5)}`)
    } else {
      setGeocodeMsg('No pudimos geocodificar la dirección. Continúa igualmente.')
    }
  }

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    const newPhotos = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }))
    setPhotos(prev => [...prev, ...newPhotos].slice(0, 10))
    e.target.value = ''
  }

  const toggleAmenity = (key) =>
    setSelectedAmenities(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])

  const stepFields = [
    ['title', 'description', 'property_type', 'price_month', 'deposit'],
    ['address', 'city', 'neighborhood'],
    ['room_m2', 'total_m2', 'companions', 'bathrooms', 'floor'],
    [],
    ['gender_pref', 'pets_allowed', 'elevator'],
  ]

  const nextStep = async () => {
    const valid = await trigger(stepFields[step])
    if (valid) { setServerError(''); setStep(s => s + 1) }
  }

  const prevStep = () => { setServerError(''); setStep(s => s - 1) }

  const create = useMutation({
    mutationFn: async (formData) => {
      const payload = { ...formData, ...coords }
      const { data: property } = await createProperty(payload)
      for (const { file } of photos) {
        try { await uploadPropertyImage(property.id, file) } catch { /* skip failed photo */ }
      }
      for (const key of selectedAmenities) {
        try { await client.post(`/properties/${property.id}/amenities/`, { key }) } catch { /* skip */ }
      }
      return property
    },
    onSuccess: () => navigate('/panel/anuncios'),
    onError: (err) => setServerError(err.response?.data?.detail || 'Error al crear el anuncio. Comprueba los datos e inténtalo de nuevo.'),
  })

  const onPublish = () => {
    handleSubmit(d => create.mutate(d))()
  }

  /* ── Shared style helpers ─────────────────────────────── */
  const radioBtn = (active) => ({
    padding: '12px 8px', border: `2px solid ${active ? 'var(--blue)' : 'var(--border)'}`,
    borderRadius: 8, fontSize: 14, fontWeight: active ? 700 : 500,
    background: active ? 'var(--blue-light)' : 'var(--white)',
    color: active ? 'var(--blue)' : 'var(--text)', transition: 'all .15s', cursor: 'pointer',
    textAlign: 'center',
  })

  return (
    <div>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Nuevo anuncio</h1>
      <p style={{ color:'var(--muted)', marginBottom:28 }}>Publica tu propiedad y accede a miles de estudiantes verificados.</p>

      {/* Progress steps */}
      <div style={{ display:'flex', alignItems:'center', marginBottom:32 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length - 1 ? 1 : undefined }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{
                width:30, height:30, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, fontWeight:700, flexShrink:0,
                background: i < step ? 'var(--green)' : i === step ? 'var(--blue)' : 'var(--border)',
                color: i <= step ? 'white' : 'var(--muted)',
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize:13, fontWeight: i === step ? 700 : 400, color: i === step ? 'var(--blue)' : i < step ? 'var(--green)' : 'var(--muted)', whiteSpace:'nowrap' }}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex:1, height:2, background: i < step ? 'var(--green)' : 'var(--border)', margin:'0 12px' }} />
            )}
          </div>
        ))}
      </div>

      {/* NO <form> wrapper — prevents accidental submit on Enter */}
      <div style={{ background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', padding:28, maxWidth:720 }}>

        {/* ─── Step 0: Basic info ─────────────────────────── */}
        {step === 0 && (
          <>
            <Input label="Título del anuncio *" placeholder="Ej. Habitación luminosa en piso compartido – Malasaña"
              error={errors.title?.message} {...register('title')} />

            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'var(--muted)', marginBottom:8 }}>
                Tipo de alojamiento *
              </label>
              <div style={{ display:'flex', gap:10 }}>
                {[{ v:'ROOM', l:'🛏 Habitación' }, { v:'FULL', l:'🏠 Piso entero' }, { v:'STUDIO', l:'🏢 Estudio' }].map(({ v, l }) => (
                  <label key={v} style={{ flex:1 }}>
                    <input type="radio" value={v} {...register('property_type')} style={{ display:'none' }} />
                    <div style={radioBtn(propertyType === v)}>{l}</div>
                  </label>
                ))}
              </div>
              {errors.property_type && <span style={{ color:'var(--red)', fontSize:12 }}>{errors.property_type.message}</span>}
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'var(--muted)', marginBottom:6 }}>
                Descripción detallada *
              </label>
              <textarea rows={6}
                placeholder="Describe el piso con detalle: luminosidad, ambiente, equipamiento, normas de la casa, transporte cercano…"
                style={{ width:'100%', boxSizing:'border-box', border:`1.5px solid ${errors.description ? 'var(--red)' : 'var(--border)'}`, borderRadius:'var(--radius)', padding:'10px 14px', fontSize:14, outline:'none', resize:'vertical', fontFamily:'inherit' }}
                {...register('description')}
              />
              {errors.description && <span style={{ color:'var(--red)', fontSize:12 }}>{errors.description.message}</span>}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Input label="Precio mensual (€) *" type="number" min="1" placeholder="450"
                error={errors.price_month?.message} {...register('price_month')} />
              <Input label="Fianza (€) *" type="number" min="0" placeholder="450"
                error={errors.deposit?.message} {...register('deposit')} />
            </div>
          </>
        )}

        {/* ─── Step 1: Location ───────────────────────────── */}
        {step === 1 && (
          <>
            <Input label="Dirección completa *" placeholder="Calle Gran Vía 42, 3º A"
              error={errors.address?.message} {...register('address')} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Input label="Ciudad *" placeholder="Madrid" error={errors.city?.message} {...register('city')} />
              <Input label="Barrio / Zona" placeholder="Malasaña" {...register('neighborhood')} />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'8px 0 16px' }}>
              <Button type="button" variant="outline" onClick={handleGeocode} disabled={geocoding}>
                {geocoding ? '⏳ Localizando…' : '📍 Localizar en el mapa'}
              </Button>
              {geocodeMsg && (
                <span style={{ fontSize:13, color: geocodeMsg.startsWith('✓') ? 'var(--green)' : 'var(--amber)' }}>
                  {geocodeMsg}
                </span>
              )}
            </div>
            <div style={{ background:'var(--blue-light)', borderRadius:8, padding:'12px 16px', fontSize:13, color:'var(--blue-dark)' }}>
              💡 Pulsa "Localizar" para que tu piso aparezca en el mapa de búsqueda.
            </div>
          </>
        )}

        {/* ─── Step 2: Details ──────────────────────────────── */}
        {step === 2 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Input label="Tamaño habitación (m²)" type="number" min="1" placeholder="12" {...register('room_m2')} />
            <Input label="Tamaño piso total (m²)" type="number" min="1" placeholder="70" {...register('total_m2')} />
            <Input label="Nº compañeros" type="number" min="0" max="20" placeholder="2" {...register('companions')} />
            <Input label="Nº baños" type="number" min="1" placeholder="1" {...register('bathrooms')} />
            <Input label="Planta" placeholder="3ª" {...register('floor')} />
          </div>
        )}

        {/* ─── Step 3: Photos ───────────────────────────────── */}
        {step === 3 && (
          <>
            <label style={{ display:'block', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'var(--muted)', marginBottom:8 }}>
              Fotos del piso (máx. 10)
            </label>
            <p style={{ fontSize:13, color:'var(--muted)', marginBottom:16 }}>
              Los anuncios con más de 5 fotos reciben un 60% más de visitas.
            </p>

            {photos.length > 0 && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
                {photos.map(({ preview }, idx) => (
                  <div key={idx} style={{ position:'relative', aspectRatio:'1', borderRadius:8, overflow:'hidden', border:'2px solid var(--border)' }}>
                    <img src={preview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    {idx === 0 && (
                      <span style={{ position:'absolute', top:6, left:6, background:'var(--blue)', color:'white', fontSize:10, fontWeight:700, borderRadius:4, padding:'2px 6px' }}>
                        PORTADA
                      </span>
                    )}
                    <button type="button" onClick={() => setPhotos(prev => prev.filter((_, i) => i !== idx))} style={{
                      position:'absolute', top:6, right:6, background:'rgba(0,0,0,.6)', border:'none',
                      borderRadius:'50%', width:22, height:22, color:'white', fontSize:13,
                      display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
                    }}>×</button>
                  </div>
                ))}
              </div>
            )}

            {photos.length < 10 && (
              <div
                onClick={() => fileInputRef.current.click()}
                style={{ border:'2px dashed var(--border)', borderRadius:'var(--radius)', padding:'36px 24px', textAlign:'center', cursor:'pointer', background:'var(--blue-light)', transition:'all .15s' }}
                onMouseEnter={e => e.currentTarget.style.background='#BFDBFE'}
                onMouseLeave={e => e.currentTarget.style.background='var(--blue-light)'}
              >
                <div style={{ fontSize:36, marginBottom:8 }}>📸</div>
                <div style={{ fontSize:15, fontWeight:600, color:'var(--blue-dark)', marginBottom:4 }}>Haz clic para subir fotos</div>
                <div style={{ fontSize:13, color:'var(--muted)' }}>JPG, PNG o WEBP · {10 - photos.length} disponibles</div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple style={{ display:'none' }} onChange={handlePhotoChange} />

            {photos.length === 0 && (
              <div style={{ background:'var(--amber-bg)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'var(--amber)', marginTop:12 }}>
                ⚠️ Puedes continuar sin fotos, pero el anuncio tendrá menos visibilidad.
              </div>
            )}
          </>
        )}

        {/* ─── Step 4: Amenities & preferences ─────────────── */}
        {step === 4 && (
          <>
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'var(--muted)', marginBottom:12 }}>
                Características y servicios
              </label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {AMENITY_OPTIONS.map(({ key, label, icon }) => {
                  const active = selectedAmenities.includes(key)
                  return (
                    <div key={key} onClick={() => toggleAmenity(key)} style={{
                      display:'flex', alignItems:'center', gap:10, padding:'12px 14px',
                      border:`2px solid ${active ? 'var(--blue)' : 'var(--border)'}`,
                      borderRadius:8, cursor:'pointer',
                      background: active ? 'var(--blue-light)' : 'var(--white)',
                      transition:'all .15s',
                    }}>
                      <span style={{ fontSize:20 }}>{icon}</span>
                      <span style={{ fontSize:14, fontWeight: active ? 600 : 400 }}>{label}</span>
                      {active && <span style={{ marginLeft:'auto', color:'var(--blue)', fontWeight:700 }}>✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'var(--muted)', marginBottom:8 }}>
                Preferencia de compañeros
              </label>
              <div style={{ display:'flex', gap:10 }}>
                {[{ v:'NONE', l:'Sin preferencia' }, { v:'FEMALE', l:'Solo chicas' }, { v:'MALE', l:'Solo chicos' }].map(({ v, l }) => (
                  <label key={v} style={{ flex:1 }}>
                    <input type="radio" value={v} {...register('gender_pref')} style={{ display:'none' }} />
                    <div style={radioBtn(genderPref === v)}>{l}</div>
                  </label>
                ))}
              </div>
            </div>

            {[{ k:'pets_allowed', l:'🐾 Se admiten mascotas' }, { k:'elevator', l:'🛗 El edificio tiene ascensor' }].map(({ k, l }) => (
              <label key={k} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14, cursor:'pointer', fontSize:14, fontWeight:500, padding:'12px 14px', border:'1.5px solid var(--border)', borderRadius:8 }}>
                <input type="checkbox" {...register(k)} style={{ width:18, height:18, accentColor:'var(--blue)' }} />
                {l}
              </label>
            ))}
          </>
        )}

        {serverError && (
          <div style={{ background:'var(--red-bg)', color:'var(--red)', borderRadius:8, padding:'10px 14px', fontSize:14, marginTop:16 }}>
            {serverError}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:28, paddingTop:20, borderTop:'1px solid var(--border)' }}>
          {step > 0
            ? <Button variant="outline" onClick={prevStep} type="button">← Anterior</Button>
            : <div />
          }
          {step < STEPS.length - 1
            ? <Button onClick={nextStep} type="button">Siguiente →</Button>
            : (
              <Button onClick={onPublish} disabled={create.isPending} size="lg" type="button">
                {create.isPending ? '⏳ Publicando…' : '🚀 Publicar anuncio'}
              </Button>
            )
          }
        </div>
      </div>
    </div>
  )
}

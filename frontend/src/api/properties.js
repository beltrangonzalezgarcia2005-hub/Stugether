import client from './client'

export const getProperties = (params) => client.get('/properties/', { params })
export const getProperty = (id) => client.get(`/properties/${id}/`)
export const createProperty = (data) => client.post('/properties/', data)
export const updateProperty = (id, data) => client.patch(`/properties/${id}/`, data)
export const deleteProperty = (id) => client.delete(`/properties/${id}/`)
export const getUniversities = (search) => client.get('/properties/universities/', { params: { search } })
export const getFavorites = () => client.get('/properties/favorites/')
export const addFavorite = (property_id) => client.post('/properties/favorites/', { property_id })
export const removeFavorite = (property_id) => client.delete(`/properties/favorites/${property_id}/`)
export const getMyProperties = () => client.get('/properties/mine/')
export const uploadPropertyImage = (propertyId, file) => {
  const fd = new FormData()
  fd.append('image', file)
  return client.post(`/properties/${propertyId}/images/`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const geocodeAddress = async (address) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
    { headers: { 'Accept-Language': 'es' } }
  )
  const data = await res.json()
  if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  return null
}

import client from './client'

export const getReservations = () => client.get('/reservations/')
export const getReservation = (id) => client.get(`/reservations/${id}/`)
export const createReservation = (data) => client.post('/reservations/', data)
export const updateReservationStatus = (id, status) => client.patch(`/reservations/${id}/`, { status })

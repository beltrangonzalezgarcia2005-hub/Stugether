import client from './client'

export const register = (data) => client.post('/auth/register/', data)
export const login = (email, password) => client.post('/auth/login/', { email, password })
export const getMe = () => client.get('/auth/me/')
export const updateMe = (data) => client.patch('/auth/me/', data)
export const getDocuments = () => client.get('/auth/documents/')
export const uploadDocument = (data) => client.post('/auth/documents/', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

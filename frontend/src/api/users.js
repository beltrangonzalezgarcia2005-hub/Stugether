import client from './client'

export const getUser = (id) => client.get(`/auth/users/${id}/`)

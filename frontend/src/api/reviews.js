import client from './client'

export const getReviews = (propertyId) => client.get(`/property/${propertyId}/`)
export const createReview = (propertyId, data) => client.post(`/property/${propertyId}/`, data)

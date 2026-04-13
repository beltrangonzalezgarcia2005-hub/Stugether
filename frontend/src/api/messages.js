import client from './client'

export const getConversations = () => client.get('/messages/conversations/')
export const createConversation = (other_user_id, property_id) =>
  client.post('/messages/conversations/', { other_user_id, property: property_id })
export const getMessages = (conversationId) =>
  client.get(`/messages/conversations/${conversationId}/messages/`)
export const sendMessage = (conversationId, body) =>
  client.post(`/messages/conversations/${conversationId}/messages/`, { body })

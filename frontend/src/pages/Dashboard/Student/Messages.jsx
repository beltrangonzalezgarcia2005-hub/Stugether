import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getConversations, getMessages, sendMessage } from '../../../api/messages'
import { useAuth } from '../../../contexts/AuthContext'
import Spinner from '../../../components/ui/Spinner'
import Button from '../../../components/ui/Button'

export default function Messages() {
  const { user } = useAuth()
  const [activeConv, setActiveConv] = useState(null)
  const [newMsg, setNewMsg]         = useState('')
  const [sendError, setSendError]   = useState('')
  const bottomRef = useRef(null)
  const qc = useQueryClient()

  const { data: convData, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
    refetchInterval: 10000,
  })
  const conversations = convData?.data?.results || convData?.data || []

  const { data: msgData } = useQuery({
    queryKey: ['messages', activeConv],
    queryFn: () => getMessages(activeConv),
    enabled: !!activeConv,
    refetchInterval: 5000,
  })
  const messages = msgData?.data?.results || msgData?.data || []

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const send = useMutation({
    mutationFn: () => sendMessage(activeConv, newMsg.trim()),
    onSuccess: () => {
      setNewMsg('')
      setSendError('')
      qc.invalidateQueries(['messages', activeConv])
      qc.invalidateQueries(['conversations'])
    },
    onError: (err) => {
      const detail = err.response?.data?.body?.[0] || err.response?.data?.detail || 'Error al enviar el mensaje.'
      setSendError(detail)
    },
  })

  const handleSend = () => {
    if (!newMsg.trim() || send.isPending) return
    setSendError('')
    send.mutate()
  }

  const activeConvData = conversations.find(c => c.id === activeConv)

  if (isLoading) return <Spinner />

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28 }}>Mensajes</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: 'calc(100vh - 220px)', background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>

        {/* Conversation list */}
        <div style={{ borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
              <p style={{ fontSize: 14 }}>No tienes mensajes todavía.</p>
            </div>
          ) : conversations.map(conv => {
            const other = conv.other_participant
            const initials = `${other?.first_name?.[0] || ''}${other?.last_name?.[0] || ''}` || '?'
            const isActive = activeConv === conv.id
            return (
              <div key={conv.id} onClick={() => setActiveConv(conv.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer',
                background: isActive ? 'var(--blue-light)' : 'transparent',
                borderBottom: '1px solid var(--border)',
                transition: 'background .1s',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#60A5FA,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: conv.unread_count > 0 ? 700 : 600 }}>
                    {other?.full_name || 'Usuario'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.last_message?.body || 'Sin mensajes'}
                  </div>
                </div>
                {conv.unread_count > 0 && (
                  <span style={{ background: 'var(--blue)', color: 'white', borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    {conv.unread_count}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Chat area */}
        {activeConv ? (
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#60A5FA,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>
                {activeConvData?.other_participant?.first_name?.[0] || '?'}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{activeConvData?.other_participant?.full_name || 'Usuario'}</div>
                {activeConvData?.related_property && (
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Sobre: propiedad #{activeConvData.related_property}</div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginTop: 32 }}>
                  Aún no hay mensajes. ¡Empieza la conversación!
                </div>
              )}
              {messages.map(m => {
                const isMe = m.sender === user?.id
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '70%', padding: '10px 14px', borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      background: isMe ? 'var(--blue)' : 'var(--blue-light)',
                      color: isMe ? 'white' : 'var(--text)',
                      fontSize: 14,
                    }}>
                      {!isMe && (
                        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--muted)' }}>
                          {m.sender_detail?.full_name}
                        </div>
                      )}
                      <div style={{ lineHeight: 1.5 }}>{m.body}</div>
                      <div style={{ fontSize: 11, marginTop: 4, textAlign: 'right', opacity: .7 }}>
                        {new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
              {sendError && (
                <div style={{ background: 'var(--red-bg)', color: 'var(--red)', borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>
                  ⚠️ {sendError}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  value={newMsg}
                  onChange={e => { setNewMsg(e.target.value); setSendError('') }}
                  placeholder="Escribe un mensaje…"
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  style={{ flex: 1, border: `1.5px solid ${sendError ? 'var(--red)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: 14, outline: 'none' }}
                />
                <Button onClick={handleSend} disabled={!newMsg.trim() || send.isPending}>
                  {send.isPending ? '…' : 'Enviar'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', gap: 12 }}>
            <div style={{ fontSize: 40 }}>💬</div>
            <p style={{ fontSize: 14 }}>Selecciona una conversación</p>
          </div>
        )}
      </div>
    </div>
  )
}

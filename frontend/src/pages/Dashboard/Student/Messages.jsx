import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getConversations, getMessages, sendMessage } from '../../../api/messages'
import Spinner from '../../../components/ui/Spinner'
import Button from '../../../components/ui/Button'

export default function Messages() {
  const [activeConv, setActiveConv] = useState(null)
  const [newMsg, setNewMsg] = useState('')
  const qc = useQueryClient()

  const { data: convData, isLoading } = useQuery({ queryKey:['conversations'], queryFn: getConversations })
  const conversations = convData?.data?.results || []

  const { data: msgData } = useQuery({
    queryKey: ['messages', activeConv],
    queryFn: () => getMessages(activeConv),
    enabled: !!activeConv,
    refetchInterval: 5000,
  })
  const messages = msgData?.data?.results || []

  const send = useMutation({
    mutationFn: () => sendMessage(activeConv, newMsg),
    onSuccess: () => {
      setNewMsg('')
      qc.invalidateQueries(['messages', activeConv])
    },
  })

  if (isLoading) return <Spinner />

  return (
    <div>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:28 }}>Mensajes</h1>
      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:0, height:'calc(100vh - 240px)', background:'var(--white)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', overflow:'hidden' }}>
        {/* Conversations list */}
        <div style={{ borderRight:'1px solid var(--border)', overflowY:'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ padding:24, textAlign:'center', color:'var(--muted)' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>💬</div>
              <p>No tienes mensajes todavía.</p>
            </div>
          ) : conversations.map(conv => (
            <div key={conv.id} onClick={() => setActiveConv(conv.id)} style={{
              display:'flex', alignItems:'center', gap:12, padding:'14px 16px', cursor:'pointer',
              background: activeConv === conv.id ? 'var(--blue-light)' : 'transparent',
              borderBottom:'1px solid var(--border)',
            }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#60A5FA,#2563EB)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:14, flexShrink:0 }}>
                {conv.other_participant?.first_name?.[0] || '?'}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:600 }}>{conv.other_participant?.full_name || 'Usuario'}</div>
                <div style={{ fontSize:13, color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {conv.last_message?.body || 'Sin mensajes'}
                </div>
              </div>
              {conv.unread_count > 0 && (
                <span style={{ background:'var(--blue)', color:'white', borderRadius:10, padding:'1px 7px', fontSize:11, fontWeight:700, flexShrink:0 }}>
                  {conv.unread_count}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Chat area */}
        {activeConv ? (
          <div style={{ display:'flex', flexDirection:'column' }}>
            <div style={{ flex:1, overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:12 }}>
              {messages.map(m => (
                <div key={m.id} style={{ display:'flex', justifyContent: m.sender === m.sender_detail?.id ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth:'70%', padding:'10px 14px', borderRadius:12,
                    background: 'var(--blue-light)', color:'var(--text)', fontSize:14,
                  }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'var(--muted)', marginBottom:4 }}>{m.sender_detail?.full_name}</div>
                    {m.body}
                    <div style={{ fontSize:11, color:'var(--muted)', marginTop:4, textAlign:'right' }}>
                      {new Date(m.created_at).toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:16, borderTop:'1px solid var(--border)', display:'flex', gap:10 }}>
              <input
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                placeholder="Escribe un mensaje…"
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && newMsg.trim() && send.mutate()}
                style={{ flex:1, border:'1.5px solid var(--border)', borderRadius:'var(--radius)', padding:'10px 14px', fontSize:14, outline:'none' }}
              />
              <Button onClick={() => newMsg.trim() && send.mutate()} disabled={!newMsg.trim() || send.isPending}>
                Enviar
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted)' }}>
            Selecciona una conversación
          </div>
        )}
      </div>
    </div>
  )
}

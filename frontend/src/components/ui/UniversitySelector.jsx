import { useState, useEffect, useRef, useCallback } from 'react'
import { getUniversities } from '../../api/properties'

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--muted)',
  marginBottom: 6,
}

export default function UniversitySelector({ value = '', onChange, label = 'Universidad', placeholder = 'Busca tu universidad…', error, containerStyle, inputStyle: inputStyleOverride, hideIcon = false }) {
  const [query, setQuery] = useState(value)
  const [options, setOptions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)
  const containerRef = useRef(null)

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    setQuery(value || '')
  }, [value])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchOptions = useCallback((q) => {
    if (!q || q.length < 2) {
      setOptions([])
      setOpen(false)
      return
    }
    setLoading(true)
    getUniversities(q)
      .then((res) => {
        setOptions(res.data || [])
        setOpen(true)
      })
      .catch(() => setOptions([]))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const q = e.target.value
    setQuery(q)
    onChange(q) // propagate raw text so form stays in sync while typing
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchOptions(q), 300)
  }

  const handleSelect = (name) => {
    setQuery(name)
    onChange(name)
    setOptions([])
    setOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} style={{ marginBottom: 16, position: 'relative', ...containerStyle }}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => options.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            border: `1.5px solid ${error ? 'var(--red)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)',
            padding: '10px 36px 10px 14px',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'inherit',
            ...inputStyleOverride,
          }}
        />
        {!hideIcon && (
          <span style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: 14, color: 'var(--muted)', pointerEvents: 'none',
          }}>
            {loading ? '⏳' : '🎓'}
          </span>
        )}
      </div>

      {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}

      {open && options.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          background: 'var(--white)',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-md)',
          listStyle: 'none',
          margin: 0,
          padding: '4px 0',
          zIndex: 100,
          maxHeight: 240,
          overflowY: 'auto',
        }}>
          {options.map((u) => (
            <li
              key={u.id}
              onMouseDown={() => handleSelect(u.name)}
              style={{
                padding: '10px 14px',
                cursor: 'pointer',
                fontSize: 14,
                borderBottom: '1px solid var(--border)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontWeight: 600 }}>{u.name}</div>
              {u.city && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{u.city}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

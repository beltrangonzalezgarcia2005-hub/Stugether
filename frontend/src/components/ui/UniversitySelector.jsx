import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
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

// value shape: { universityName, campusId, campusName } or '' for empty
export default function UniversitySelector({
  value = '',
  onChange,
  label = 'Universidad',
  placeholder = 'Busca tu universidad…',
  error,
  containerStyle,
  inputStyle: inputStyleOverride,
  hideIcon = false,
}) {
  const parsed = typeof value === 'object' && value !== null ? value : null
  const [query, setQuery] = useState(parsed?.universityName || (typeof value === 'string' ? value : ''))
  const [options, setOptions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dropdownRect, setDropdownRect] = useState(null)

  // Step 2: campus selection
  const [selectedUniversity, setSelectedUniversity] = useState(null) // full university object with campuses[]
  const [campusOpen, setCampusOpen] = useState(false)
  const [campusRect, setCampusRect] = useState(null)

  const debounceRef = useRef(null)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const campusTriggerRef = useRef(null)

  useEffect(() => {
    const v = typeof value === 'object' && value !== null ? value : null
    setQuery(v?.universityName || (typeof value === 'string' ? value : ''))
  }, [value])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setCampusOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Reposition university dropdown
  useEffect(() => {
    if (!open) return
    const reposition = () => {
      if (inputRef.current) setDropdownRect(inputRef.current.getBoundingClientRect())
    }
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [open])

  // Reposition campus dropdown
  useEffect(() => {
    if (!campusOpen) return
    const reposition = () => {
      if (campusTriggerRef.current) setCampusRect(campusTriggerRef.current.getBoundingClientRect())
    }
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [campusOpen])

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
        if (inputRef.current) setDropdownRect(inputRef.current.getBoundingClientRect())
        setOpen(true)
      })
      .catch(() => setOptions([]))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const q = e.target.value
    setQuery(q)
    setSelectedUniversity(null)
    setCampusOpen(false)
    onChange(q)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchOptions(q), 300)
  }

  const handleSelectUniversity = (uni) => {
    setQuery(uni.name)
    setOptions([])
    setOpen(false)

    if (!uni.campuses || uni.campuses.length <= 1) {
      // Single campus — resolve immediately
      const campus = uni.campuses?.[0] || null
      onChange({
        universityName: uni.name,
        campusId: campus?.id || null,
        campusName: campus?.name || uni.name,
      })
      setSelectedUniversity(null)
    } else {
      // Multiple campuses — open second step
      setSelectedUniversity(uni)
      setTimeout(() => {
        if (campusTriggerRef.current) {
          setCampusRect(campusTriggerRef.current.getBoundingClientRect())
          setCampusOpen(true)
        }
      }, 0)
      onChange({ universityName: uni.name, campusId: null, campusName: null })
    }
  }

  const handleSelectCampus = (campus) => {
    setCampusOpen(false)
    onChange({
      universityName: selectedUniversity.name,
      campusId: campus.id,
      campusName: campus.name,
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); setCampusOpen(false) }
  }

  const handleFocus = () => {
    if (options.length > 0 && inputRef.current) {
      setDropdownRect(inputRef.current.getBoundingClientRect())
      setOpen(true)
    }
  }

  const campusValue = typeof value === 'object' && value !== null ? value.campusName : null

  const universityDropdown = open && options.length > 0 && dropdownRect
    ? createPortal(
        <ul style={{
          position: 'fixed', top: dropdownRect.bottom + 4, left: dropdownRect.left,
          width: dropdownRect.width, background: 'var(--white)',
          border: '1.5px solid var(--border)', borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-md)', listStyle: 'none', margin: 0,
          padding: '4px 0', zIndex: 9999, maxHeight: 240, overflowY: 'auto',
        }}>
          {options.map((u) => (
            <li key={u.id} onMouseDown={() => handleSelectUniversity(u)}
              style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 14, borderBottom: '1px solid var(--border)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontWeight: 600 }}>{u.name}</div>
              {u.city && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{u.city}</div>}
            </li>
          ))}
        </ul>,
        document.body
      )
    : null

  const campusDropdown = campusOpen && selectedUniversity && campusRect
    ? createPortal(
        <ul style={{
          position: 'fixed', top: campusRect.bottom + 4, left: campusRect.left,
          width: Math.max(campusRect.width, 260), background: 'var(--white)',
          border: '1.5px solid var(--border)', borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-md)', listStyle: 'none', margin: 0,
          padding: '4px 0', zIndex: 9999, maxHeight: 240, overflowY: 'auto',
        }}>
          <li style={{ padding: '8px 14px 4px', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Selecciona tu campus
          </li>
          {selectedUniversity.campuses.map((c) => (
            <li key={c.id} onMouseDown={() => handleSelectCampus(c)}
              style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 14, borderBottom: '1px solid var(--border)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              {c.city && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{c.city}</div>}
            </li>
          ))}
        </ul>,
        document.body
      )
    : null

  return (
    <div ref={containerRef} style={{ marginBottom: 16, position: 'relative', ...containerStyle }}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
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

      {/* Campus selector — shown after university is chosen */}
      {selectedUniversity && (
        <div ref={campusTriggerRef} style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
            Campus / Facultad
          </div>
          <button
            type="button"
            onClick={() => {
              if (campusTriggerRef.current) setCampusRect(campusTriggerRef.current.getBoundingClientRect())
              setCampusOpen(o => !o)
            }}
            style={{
              width: '100%', textAlign: 'left', cursor: 'pointer',
              border: `1.5px solid ${error ? 'var(--red)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: 14,
              background: 'var(--white)', fontFamily: 'inherit', color: campusValue ? 'var(--text)' : 'var(--muted)',
            }}
          >
            {campusValue || 'Selecciona tu campus…'}
          </button>
        </div>
      )}

      {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}

      {universityDropdown}
      {campusDropdown}
    </div>
  )
}

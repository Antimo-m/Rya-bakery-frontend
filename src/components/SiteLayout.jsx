import { useEffect, useState } from 'react'
import { NavLink, Link as RouterLink } from 'react-router-dom'
import { FiArchive, FiShoppingBag } from 'react-icons/fi'
import logo from '../assets/rya-logo.svg'
import { useCart } from '../context/useCart'
import { useError } from '../context/useError'
import { useToast } from '../context/useToast'
import { isOpenNow } from '../data/brand'

function SiteLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [compactNav, setCompactNav] = useState(true)
  const { count } = useCart()
  const { error, clearError } = useError()
  const { toast } = useToast()
  const open = isOpenNow()

  useEffect(() => {
    const updateNavMode = () => {
      const compact = window.innerWidth <= 900
      setCompactNav(compact)
      if (!compact) setMenuOpen(false)
    }

    updateNavMode()
    window.addEventListener('resize', updateNavMode)

    return () => window.removeEventListener('resize', updateNavMode)
  }, [])

  return (
    <div className="site-shell">
      <header className={`site-header ${compactNav ? 'is-compact' : ''}`}>
        <div className="brand-stack">
          <RouterLink className="brand-link" to="/">
            <img src={logo} alt="" />
            <span>
              <strong>Rya Bakery</strong>
              <small>Bakery & Cafe</small>
            </span>
          </RouterLink>
          <span className={`nav-live-badge ${open ? 'is-open' : 'is-closed'}`}>
            <i className="live-dot"></i>
            Via Timavo, Genova · {open ? 'Aperto ora' : 'Chiuso ora'}
          </span>
        </div>
        <button
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
          className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav
          aria-label="Navigazione principale"
          className={`site-nav ${menuOpen ? 'is-open' : ''}`}
          id="primary-navigation"
        >
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/prodotti" onClick={() => setMenuOpen(false)}>Prodotti</NavLink>
          <NavLink to="/informazioni" onClick={() => setMenuOpen(false)}>Informazioni</NavLink>
        </nav>
        <div className="site-actions" aria-label="Azioni cliente">
          <RouterLink className="site-icon-link" to="/ordini" aria-label="I tuoi ordini">
            <FiArchive aria-hidden="true" />
          </RouterLink>
          <RouterLink className="site-icon-link" to="/carrello" aria-label={`Carrello con ${count} prodotti`}>
            <FiShoppingBag aria-hidden="true" />
            {count > 0 && <span>{count}</span>}
          </RouterLink>
        </div>
      </header>

      {error && (
        <div className="app-error" role="status">
          <span>{error.message}</span>
          <button aria-label="Chiudi messaggio errore" type="button" onClick={clearError}>Chiudi</button>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.text}</div>}

      {children}
    </div>
  )
}

export default SiteLayout

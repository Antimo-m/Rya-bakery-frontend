import { useState } from 'react'
import { NavLink, Link as RouterLink } from 'react-router-dom'
import logo from '../assets/rya-logo.svg'
import { useCart } from '../context/useCart'
import { useError } from '../context/useError'
import { useToast } from '../context/useToast'
import { isOpenNow } from '../data/brand'

function SiteLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { count } = useCart()
  const { error, clearError } = useError()
  const { toast } = useToast()
  const open = isOpenNow()

  return (
    <div className="site-shell">
      <header className="site-header">
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
          <NavLink to="/carrello" onClick={() => setMenuOpen(false)}>Carrello {count > 0 ? `(${count})` : ''}</NavLink>
          <NavLink to="/informazioni" onClick={() => setMenuOpen(false)}>Informazioni</NavLink>
        </nav>
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

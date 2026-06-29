import { useEffect, useState } from 'react'
import { NavLink, Link as RouterLink } from 'react-router-dom'
import { FiArchive, FiClock, FiShoppingBag } from 'react-icons/fi'
import { MdPlace } from 'react-icons/md'
import logo from '../assets/RyaBakery.png'
import { useCart } from '../context/useCart'
import { useError } from '../context/useError'
import { useToast } from '../context/useToast'
import { getStoreStatus, openingHours, socialLinks } from '../data/brand'

function SiteLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [compactNav, setCompactNav] = useState(() => window.innerWidth <= 900)
  const [storeStatus, setStoreStatus] = useState(() => getStoreStatus())
  const { count } = useCart()
  const { error, clearError } = useError()
  const { toast } = useToast()
  const { open, closingSoon, minutesUntilClose, closesAt } = storeStatus
  const iconBySocial = {
    'Google Maps': <MdPlace aria-hidden="true" />,
  }

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

  useEffect(() => {
    const interval = window.setInterval(() => setStoreStatus(getStoreStatus()), 60_000)

    return () => window.clearInterval(interval)
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
        </div>
      </header>

      {closingSoon && (
        <div className="closing-notice" role="status">
          <FiClock aria-hidden="true" />
          <span>
            Il negozio chiude alle {closesAt}: mancano circa {minutesUntilClose} minuti.
            Se vuoi ordinare, questo è il momento giusto.
          </span>
        </div>
      )}

      {error && (
        <div className="app-error" role="status">
          <span>{error.message}</span>
          <button aria-label="Chiudi messaggio errore" type="button" onClick={clearError}>Chiudi</button>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.text}</div>}

      {children}

      <footer className="site-footer">
        <div className="site-footer__brand">
          <RouterLink className="brand-link" to="/">
            <img src={logo} alt="" />
            <span>
              <strong>Rya Bakery</strong>
              <small>Bakery & Cafe</small>
            </span>
          </RouterLink>
          <p>Bakery & cafè a dispozione per voi per colazioni, pausa pranzo e aperitivi in Via Timavo 59.</p>
        </div>
        <nav aria-label="Link utili footer">
          <RouterLink to="/prodotti">Prodotti</RouterLink>
          <RouterLink to="/ordini">I tuoi ordini</RouterLink>
          <RouterLink to="/informazioni">Informazioni</RouterLink>
          <RouterLink to="/privacy">Privacy policy</RouterLink>
        </nav>
        <div>
          <span>Via Timavo 59, Genova</span>
          <strong>{openingHours[0].hours}</strong>
          <div className="site-footer__socials">
            {socialLinks.map((social) => (
              <a
                aria-label={`${social.label} Rya Bakery`}
                className={social.color ? `is-${social.color}` : ''}
                href={social.href}
                key={social.label}
                target="_blank"
                rel="noreferrer"
              >
                {iconBySocial[social.label]}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SiteLayout

import { NavLink, Link as RouterLink } from 'react-router-dom'
import logo from '../assets/rya-logo.svg'
import { useCart } from '../context/useCart'
import { useError } from '../context/useError'
import { useToast } from '../context/useToast'

function SiteLayout({ children }) {
  const { count } = useCart()
  const { error, clearError } = useError()
  const { toast } = useToast()

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="brand-stack">
          <RouterLink className="brand-link" to="/">
            <img src={logo} alt="" />
            <span>
              <strong>Rya Bakery</strong>
              <small>Via Timavo, Genova</small>
            </span>
          </RouterLink>
          <span className="nav-live-badge"><i className="live-dot"></i>Aperto ora</span>
        </div>
        <nav className="site-nav" aria-label="Navigazione principale">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/prodotti">Prodotti</NavLink>
          <NavLink to="/carrello">Carrello {count > 0 ? `(${count})` : ''}</NavLink>
          <NavLink to="/informazioni">Informazioni</NavLink>
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

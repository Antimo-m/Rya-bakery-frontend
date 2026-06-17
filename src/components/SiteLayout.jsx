import { useCart } from '../context/useCart'
import { useToast } from '../context/useToast'
import Link from './Link'

function SiteLayout({ children }) {
  const { count } = useCart()
  const { toast } = useToast()

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand-link" to="/">
          <span>Rya Bakery</span>
          <small>Via Timavo, Genova</small>
        </Link>
        <nav className="site-nav" aria-label="Navigazione principale">
          <Link to="/">Home</Link>
          <Link to="/ordina">Ordina</Link>
          <Link to="/carrello">Carrello {count > 0 ? `(${count})` : ''}</Link>
          <Link to="/contatti">Contatti</Link>
        </nav>
      </header>

      {toast && <div className={`toast ${toast.type}`}>{toast.text}</div>}

      {children}
    </div>
  )
}

export default SiteLayout

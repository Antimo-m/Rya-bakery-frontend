import Link from '../components/Link'

function NotFoundPage() {
  return (
    <main className="page error-page" tabIndex="-1">
      <p className="eyebrow">404</p>
      <h1>Pagina non trovata</h1>
      <p>La pagina che cerchi non e disponibile. Puoi tornare ai prodotti o rientrare dalla home.</p>
      <div className="hero-actions">
        <Link className="btn" to="/prodotti">Vai ai prodotti</Link>
        <Link className="btn secondary" to="/">Torna alla home</Link>
      </div>
    </main>
  )
}

export default NotFoundPage

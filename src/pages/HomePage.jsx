import Link from '../components/Link'

function HomePage() {
  return (
    <main>
      <section className="hero-page">
        <div>
          <p className="eyebrow">Bar e bakery in Via Timavo</p>
          <h1>Rya Bakery</h1>
          <p>Consulta il catalogo, aggiungi prodotti al carrello e invia il tuo ordine direttamente dal tavolo.</p>
          <div className="hero-actions">
            <Link className="btn" to="/ordina">Ordina ora</Link>
            <Link className="btn secondary light" to="/carrello">Apri carrello</Link>
          </div>
        </div>
      </section>

      <section className="live-local">
        <div className="live-local__status">
          <span className="live-dot"></span>
          <strong>Aperto ora</strong>
          <small>Via Timavo, Genova</small>
        </div>
        <div>
          <p className="eyebrow">Ordine al tavolo</p>
          <h2>Il banco digitale per una pausa piu semplice.</h2>
          <p>Scegli colazione, bakery e salato dal telefono. Lo staff riceve tutto nel gestionale e prepara l ordine.</p>
        </div>
        <div className="live-cards">
          <article><span>Tempo medio</span><strong>5-8 min</strong></article>
          <article><span>Servizio</span><strong>Al tavolo</strong></article>
          <article><span>Catalogo</span><strong>Live</strong></article>
        </div>
      </section>
    </main>
  )
}

export default HomePage

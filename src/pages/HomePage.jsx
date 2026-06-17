import { useEffect, useState } from 'react'
import { getProducts } from '../api/client'
import Link from '../components/Link'
import ProductCarousel from '../components/ProductCarousel'
import { useError } from '../context/useError'
import { useCart } from '../context/useCart'

function HomePage() {
  const [products, setProducts] = useState([])
  const { euro } = useCart()
  const { reportError } = useError()

  useEffect(() => {
    getProducts({ page: 1, per_page: 10 })
      .then((data) => setProducts((data.products || []).slice(0, 10)))
      .catch((error) => reportError(error.message || 'Prodotti non disponibili.', error.status))
  }, [reportError])

  return (
    <main>
      <section className="hero-page">
        <div>
          <p className="eyebrow">Bar e bakery in Via Timavo</p>
          <h1>Rya Bakery</h1>
          <p>Consulta il catalogo, aggiungi prodotti al carrello e invia il tuo ordine direttamente dal tavolo.</p>
          <div className="hero-actions">
            <Link className="btn" to="/prodotti">Vai ai prodotti</Link>
            <Link className="btn secondary light" to="/carrello">Apri carrello</Link>
          </div>
        </div>
      </section>

      <section className="live-local">
        <div>
          <p className="eyebrow">Ordine al tavolo</p>
          <h2>Pausa semplice, prodotti sempre a portata.</h2>
          <p>Scegli colazione, bakery e salato dal telefono. Lo staff riceve tutto nel gestionale e prepara l ordine.</p>
        </div>
        <div className="live-cards">
          <article><span>Tempo medio</span><strong>5-8 min</strong></article>
          <article><span>Servizio</span><strong>Al tavolo</strong></article>
          <article><span>Catalogo</span><strong>Live</strong></article>
        </div>
      </section>

      <section className="digital-counter" aria-labelledby="digital-counter-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Il banco digitale</p>
            <h2 id="digital-counter-title">Scorri i prodotti piu richiesti.</h2>
          </div>
          <Link className="btn secondary" to="/prodotti">Vai ai prodotti</Link>
        </div>
        <ProductCarousel products={products} euro={euro} />
      </section>
    </main>
  )
}

export default HomePage

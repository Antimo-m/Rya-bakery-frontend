import { useEffect, useState } from 'react'
import { getMostOrderedProducts, getProducts, normalizeProducts } from '../api/client'
import Link from '../components/Link'
import ProductCarousel from '../components/ProductCarousel'
import { useCart } from '../context/useCart'
import { showcaseItems } from '../data/brand'
import { fallbackProducts } from '../data/fallbackProducts'

function HomePage() {
  const [products, setProducts] = useState([])
  const [activeShowcase, setActiveShowcase] = useState(0)
  const { euro } = useCart()

  useEffect(() => {
    getMostOrderedProducts({ limit: 10 })
      .then((data) => {
        if ((data.products || []).length > 0) {
          setProducts(data.products)
          return
        }

        return getProducts({ page: 1, per_page: 10 })
          .then((fallbackData) => setProducts((fallbackData.products || []).slice(0, 10)))
      })
      .catch(() => {
        setProducts(normalizeProducts(fallbackProducts))
      })
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveShowcase((current) => (current + 1) % showcaseItems.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  const featured = showcaseItems[activeShowcase]

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

      <section className="visual-showcase" aria-labelledby="showcase-title">
        <div className="showcase-copy">
          <p className="eyebrow">Bakery & Cafe</p>
          <h2 id="showcase-title">Qui troverai alcuni spunti provenienti dal nostro banco</h2>
          <p>Una selezione che alterna dolce e salato, tutto a tua disposizione</p>
          <div className="showcase-tabs" aria-label="Prodotti in evidenza">
            {showcaseItems.map((item, index) => (
              <button
                aria-label={`Mostra ${item.title}`}
                aria-pressed={activeShowcase === index}
                className={activeShowcase === index ? 'active' : ''}
                key={item.title}
                type="button"
                onClick={() => setActiveShowcase(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="showcase-stage">
          <img src={featured.image} alt="" />
          <article>
            <span>In evidenza</span>
            <strong>{featured.title}</strong>
            <p>{featured.subtitle}</p>
          </article>
        </div>
      </section>

      <section className="digital-counter" aria-labelledby="digital-counter-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Il banco digitale</p>
            <h2 id="digital-counter-title">Scopri i prodotti piu richiesti.</h2>
          </div>
        </div>
        <ProductCarousel products={products} euro={euro} />
        <div className="carousel-cta">
          <Link className="btn btn-pill" to="/prodotti">Vai ai prodotti</Link>
        </div>
      </section>
    </main>
  )
}

export default HomePage

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct, normalizeProduct } from '../api/client'
import Link from '../components/Link'
import { useCart } from '../context/useCart'
import { useError } from '../context/useError'
import { useToast } from '../context/useToast'
import { fallbackProducts } from '../data/fallbackProducts'

function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { addProduct, euro } = useCart()
  const { reportError } = useError()
  const { notify } = useToast()

  useEffect(() => {
    getProduct(slug)
      .then((data) => {
        setProduct(data.product)
        setNotFound(false)
      })
      .catch((error) => {
        if (error.status === 404) {
          setNotFound(true)
          setProduct(null)
          reportError('Prodotto non trovato.', 404)
          return
        }

        const fallbackProduct = fallbackProducts.find((item) => item.slug === slug)

        if (fallbackProduct) {
          setProduct(normalizeProduct(fallbackProduct))
          setNotFound(false)
          return
        }

        reportError(error.message || 'Prodotto non disponibile.', error.status)
        notify('error', 'Prodotto temporaneamente non disponibile.')
      })
      .finally(() => setLoading(false))
  }, [notify, reportError, slug])

  if (loading) {
    return <main className="page"><p className="empty-state">Caricamento prodotto...</p></main>
  }

  if (notFound || !product) {
    return (
      <main className="page error-page">
        <p className="eyebrow">Prodotto non disponibile</p>
        <h1>Non abbiamo trovato questo prodotto</h1>
        <p className="empty-state">Prodotto non trovato.</p>
        <Link className="btn secondary" to="/prodotti">Torna ai prodotti</Link>
      </main>
    )
  }

  return (
    <main className="page">
      <article className="product-detail">
        <img src={product.image_url} alt="" loading="lazy" />
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <strong>{euro.format(product.price)}</strong>
          <div className="detail-actions">
            <button
              className="btn"
              type="button"
              disabled={!product.is_available}
              onClick={() => {
                addProduct(product)
                notify('success', `${product.name} aggiunto al carrello.`)
              }}
            >
              {product.is_available ? 'Aggiungi al carrello' : 'Non disponibile'}
            </button>
            <Link className="btn secondary" to="/prodotti">Torna ai prodotti</Link>
          </div>
        </div>
      </article>
    </main>
  )
}

export default ProductDetailPage

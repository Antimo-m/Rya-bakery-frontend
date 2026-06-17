import { useEffect, useState } from 'react'
import { getProduct } from '../api/client'
import Link from '../components/Link'
import { useCart } from '../context/useCart'
import { useToast } from '../context/useToast'

function ProductDetailPage({ slug }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addProduct, euro } = useCart()
  const { notify } = useToast()

  useEffect(() => {
    getProduct(slug)
      .then((data) => setProduct(data.product))
      .catch((error) => notify('error', error.message || 'Prodotto non disponibile.'))
      .finally(() => setLoading(false))
  }, [notify, slug])

  if (loading) {
    return <main className="page"><p className="empty-state">Caricamento prodotto...</p></main>
  }

  if (!product) {
    return (
      <main className="page">
        <p className="empty-state">Prodotto non trovato.</p>
        <Link className="btn secondary" to="/ordina">Torna al catalogo</Link>
      </main>
    )
  }

  return (
    <main className="page">
      <article className="product-detail">
        <img src={product.image_url} alt="" />
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
            <Link className="btn secondary" to="/ordina">Torna ai prodotti</Link>
          </div>
        </div>
      </article>
    </main>
  )
}

export default ProductDetailPage

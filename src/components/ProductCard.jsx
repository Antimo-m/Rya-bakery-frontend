import { useCart } from '../context/useCart'
import { useToast } from '../context/useToast'
import Link from './Link'

function ProductCard({ product }) {
  const { addProduct, euro } = useCart()
  const { notify } = useToast()

  return (
    <article className={`product-card ${!product.is_available ? 'is-disabled' : ''}`}>
      <img src={product.image_url} alt="" />
      <div className="product-card__body">
        <span>{product.category || 'Bakery'}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <strong>{euro.format(product.price)}</strong>
      </div>
      <div className="product-card__actions">
        <Link className="btn secondary" to={`/prodotti/${product.slug}`}>Dettaglio</Link>
        <button
          className="btn"
          type="button"
          disabled={!product.is_available}
          onClick={() => {
            addProduct(product)
            notify('success', `${product.name} aggiunto al carrello.`)
          }}
        >
          {product.is_available ? 'Aggiungi' : 'Non disponibile'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard

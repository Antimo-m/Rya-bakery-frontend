import { FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import Link from './Link'
import ProductBadges from './ProductBadges'
import { useCart } from '../context/useCart'
import { useToast } from '../context/useToast'

function ProductCard({ product }) {
  const price = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(product.price)
  const { cartItems, addProduct, setQuantity, maxProductQuantity, maxProductMessage } = useCart()
  const { notify } = useToast()
  const cartLine = cartItems.find((item) => item.product.slug === product.slug)
  const isAtLimit = cartLine?.quantity >= maxProductQuantity

  return (
    <article className={`product-card ${!product.is_available ? 'is-disabled' : ''}`}>
      <Link
        aria-label={`Apri dettaglio prodotto ${product.name}`}
        className="product-card__link"
        to={`/prodotti/${product.slug}`}
      >
        <img src={product.image_url} alt="" loading="lazy" />
        <div className="product-card__body">
          <ProductBadges badges={product.badges} compact />
          <span>{product.category || 'Bakery'}</span>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <strong>{price}</strong>
          {!product.is_available && <em>Non disponibile</em>}
        </div>
      </Link>
      <div className="product-card__actions">
        {cartLine ? (
          <div className="quantity-control compact">
            <button
              aria-label={`Riduci quantita di ${product.name}`}
              type="button"
              onClick={() => setQuantity(product.slug, cartLine.quantity - 1)}
            >
              <FiMinus aria-hidden="true" />
            </button>
            <input
              aria-label={`Quantita ${product.name}`}
              inputMode="numeric"
              min="1"
              max={maxProductQuantity}
              type="number"
              value={cartLine.quantity}
              onChange={(event) => {
                if (event.target.value !== '') setQuantity(product.slug, event.target.value)
              }}
            />
            <button
              aria-label={`Aumenta quantita di ${product.name}`}
              type="button"
              aria-disabled={isAtLimit}
              title={isAtLimit ? maxProductMessage : `Aumenta quantita di ${product.name}`}
              onClick={() => setQuantity(product.slug, cartLine.quantity + 1)}
            >
              <FiPlus aria-hidden="true" />
            </button>
            <span aria-live="polite">{cartLine.quantity} nel carrello</span>
          </div>
        ) : (
          <button
            className="product-card__cart"
            type="button"
            disabled={!product.is_available}
            aria-label={product.is_available ? `Aggiungi ${product.name} al carrello` : `${product.name} non disponibile`}
            onClick={() => {
              if (addProduct(product)) {
                notify('success', `${product.name} aggiunto al carrello.`)
              }
            }}
          >
            <FiShoppingBag aria-hidden="true" />
            {product.is_available ? 'Aggiungi' : 'Non disponibile'}
          </button>
        )}
      </div>
    </article>
  )
}

export default ProductCard

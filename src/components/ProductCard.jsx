import Link from './Link'

function ProductCard({ product }) {
  const price = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(product.price)

  return (
    <article className={`product-card ${!product.is_available ? 'is-disabled' : ''}`}>
      <Link
        aria-label={`Apri dettaglio prodotto ${product.name}`}
        className="product-card__link"
        to={`/prodotti/${product.slug}`}
      >
        <img src={product.image_url} alt="" />
        <div className="product-card__body">
          <span>{product.category || 'Bakery'}</span>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <strong>{price}</strong>
          {!product.is_available && <em>Non disponibile</em>}
        </div>
      </Link>
    </article>
  )
}

export default ProductCard

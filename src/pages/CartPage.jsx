import { useEffect, useRef } from 'react'
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import Link from '../components/Link'
import { useCart } from '../context/useCart'

function CartPage() {
  const { cartItems, total, euro, maxProductQuantity, maxProductMessage, removeProduct, setQuantity } = useCart()
  const titleRef = useRef(null)
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  return (
    <main className="page cart-page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Carrello</p>
          <h1 ref={titleRef} tabIndex="-1">Il tuo carrello</h1>
        </div>
      </header>
      <p>Rivedi le tue scelte prima di mandarle al banco.</p>

      {cartItems.length === 0 ? (
        <section className="empty-panel">
          <p>Il carrello e vuoto, ma il banco ha qualcosa di buono per te.</p>
          <Link className="btn" to="/prodotti">Scegli prodotti</Link>
        </section>
      ) : (
        <section className="cart-page" aria-label="Riepilogo carrello">
          <div className="cart-list">
            <div className="cart-list__head">
              <span>{itemCount} prodotti selezionati</span>
              <strong>{euro.format(total)}</strong>
            </div>
            {cartItems.map((item) => (
              <article className="cart-line" key={item.product.slug}>
                <img className="cart-line__image" src={item.product.image_url} alt="" />
                <div className="cart-line__content">
                  <div>
                    <h2>{item.product.name}</h2>
                    <span>{euro.format(item.product.price)} cad.</span>
                  </div>
                </div>
                <div className="quantity-control">
                  <button
                    aria-label={`Riduci quantita di ${item.product.name}`}
                    type="button"
                    onClick={() => setQuantity(item.product.slug, item.quantity - 1)}
                  >
                    <FiMinus aria-hidden="true" />
                  </button>
                  <input
                    aria-label={`Quantita ${item.product.name}`}
                    inputMode="numeric"
                    min="1"
                    max={maxProductQuantity}
                    type="number"
                    value={item.quantity}
                    onChange={(event) => {
                      if (event.target.value !== '') {
                        setQuantity(item.product.slug, event.target.value)
                      }
                    }}
                  />
                  <button
                    aria-label={`Aumenta quantita di ${item.product.name}`}
                    type="button"
                    aria-disabled={item.quantity >= maxProductQuantity}
                    title={item.quantity >= maxProductQuantity ? maxProductMessage : `Aumenta quantita di ${item.product.name}`}
                    onClick={() => setQuantity(item.product.slug, item.quantity + 1)}
                  >
                    <FiPlus aria-hidden="true" />
                  </button>
                </div>
                <div className="cart-line__aside">
                  <strong className="cart-line__total">{euro.format(item.lineTotal)}</strong>
                  <button
                    className="cart-remove"
                    type="button"
                    aria-label={`Rimuovi ${item.product.name}`}
                    onClick={() => removeProduct(item.product.slug)}
                  >
                    <FiTrash2 aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <aside className="cart-summary" aria-label="Totale carrello">
            <span>Riepilogo ordine</span>
            <strong>{euro.format(total)}</strong>
            <dl className="cart-summary__meta">
              <div>
                <dt>Prodotti</dt>
                <dd>{itemCount}</dd>
              </div>
              <div>
                <dt>Servizio</dt>
                <dd>Al tavolo</dd>
              </div>
            </dl>
            <Link className="btn" to="/checkout">Procedi all ordine</Link>
            <Link className="btn cart-continue" to="/prodotti">Continua scelta</Link>
          </aside>
        </section>
      )}
    </main>
  )
}

export default CartPage

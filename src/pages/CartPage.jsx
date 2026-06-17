import { useEffect, useRef } from 'react'
import Link from '../components/Link'
import { useCart } from '../context/useCart'

function CartPage() {
  const { cartItems, total, euro, setQuantity } = useCart()
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Carrello</p>
          <h1 ref={titleRef} tabIndex="-1">Il tuo carrello</h1>
        </div>
        <p>Controlla quantita e totale prima di inviare l ordine al banco.</p>
      </header>

      {cartItems.length === 0 ? (
        <section className="empty-panel">
          <p>Il carrello e vuoto.</p>
          <Link className="btn" to="/prodotti">Scegli prodotti</Link>
        </section>
      ) : (
        <section className="cart-page" aria-label="Riepilogo carrello">
          <div className="cart-list">
            {cartItems.map((item) => (
              <article className="cart-line" key={item.product.slug}>
                <div>
                  <h2>{item.product.name}</h2>
                  <span>{item.quantity} x {euro.format(item.product.price)}</span>
                </div>
                <div className="quantity-control">
                  <button
                    aria-label={`Riduci quantita di ${item.product.name}`}
                    type="button"
                    onClick={() => setQuantity(item.product.slug, item.quantity - 1)}
                  >
                    -
                  </button>
                  <strong aria-live="polite">{item.quantity}</strong>
                  <button
                    aria-label={`Aumenta quantita di ${item.product.name}`}
                    type="button"
                    onClick={() => setQuantity(item.product.slug, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <strong className="cart-line__total">{euro.format(item.lineTotal)}</strong>
              </article>
            ))}
          </div>
          <aside className="cart-summary" aria-label="Totale carrello">
            <span>Totale</span>
            <strong>{euro.format(total)}</strong>
            <Link className="btn" to="/checkout">Procedi all ordine</Link>
          </aside>
        </section>
      )}
    </main>
  )
}

export default CartPage

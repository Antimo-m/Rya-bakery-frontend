import Link from '../components/Link'
import { useCart } from '../context/useCart'

function CartPage() {
  const { cartItems, total, euro, setQuantity } = useCart()

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Carrello</p>
        <h1>Il tuo ordine</h1>
      </header>

      {cartItems.length === 0 ? (
        <section className="empty-panel">
          <p>Il carrello e vuoto.</p>
          <Link className="btn" to="/ordina">Scegli prodotti</Link>
        </section>
      ) : (
        <section className="cart-page">
          <div className="cart-list">
            {cartItems.map((item) => (
              <article className="cart-line" key={item.product.slug}>
                <div>
                  <h2>{item.product.name}</h2>
                  <span>{euro.format(item.lineTotal)}</span>
                </div>
                <div className="quantity-control">
                  <button type="button" onClick={() => setQuantity(item.product.slug, item.quantity - 1)}>-</button>
                  <strong>{item.quantity}</strong>
                  <button type="button" onClick={() => setQuantity(item.product.slug, item.quantity + 1)}>+</button>
                </div>
              </article>
            ))}
          </div>
          <aside className="cart-summary">
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

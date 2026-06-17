import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../api/client'
import Link from '../components/Link'
import { useCart } from '../context/useCart'
import { useError } from '../context/useError'
import { useToast } from '../context/useToast'

function CheckoutPage() {
  const [customerName, setCustomerName] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [sending, setSending] = useState(false)
  const navigate = useNavigate()
  const { cartItems, total, euro, clearCart } = useCart()
  const { reportError } = useError()
  const { notify } = useToast()

  async function submitOrder(event) {
    event.preventDefault()

    if (cartItems.length === 0) {
      notify('error', 'Aggiungi almeno un prodotto prima di inviare l ordine.')
      navigate('/prodotti')
      return
    }

    setSending(true)

    try {
      const data = await createOrder({
        customer_name: customerName,
        table_number: Number(tableNumber),
        notes,
        items: cartItems.map((item) => ({
          product_slug: item.product.slug,
          quantity: item.quantity,
        })),
      })

      clearCart()
      navigate('/conferma-ordine', { state: { order: data.order } })
    } catch (error) {
      reportError(error.message || 'Ordine non inviato.', error.status)
      notify('error', error.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="page checkout-layout">
      <form className="checkout-form" onSubmit={submitOrder}>
        <header className="page-header compact">
          <p className="eyebrow">Checkout</p>
          <h1>Conferma ordine</h1>
        </header>

        <label>
          Nome cliente
          <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} required maxLength="80" placeholder="Es. Naomi" />
        </label>

        <label>
          Numero tavolo
          <input value={tableNumber} onChange={(event) => setTableNumber(event.target.value)} required type="number" min="1" max="999" placeholder="Es. 4" />
        </label>

        <label>
          Note
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength="500" rows="4" placeholder="Allergie o preferenze" />
        </label>

        <button className="btn" type="submit" disabled={sending}>
          {sending ? 'Invio ordine...' : 'Invia ordine'}
        </button>
      </form>

      <aside className="checkout-summary">
        <h2>Riepilogo</h2>
        {cartItems.length === 0 ? (
          <p>Il carrello e vuoto.</p>
        ) : (
          cartItems.map((item) => (
            <div className="summary-line" key={item.product.slug}>
              <span>{item.quantity}x {item.product.name}</span>
              <strong>{euro.format(item.lineTotal)}</strong>
            </div>
          ))
        )}
        <div className="summary-total">
          <span>Totale</span>
          <strong>{euro.format(total)}</strong>
        </div>
        <Link className="btn secondary" to="/carrello">Modifica carrello</Link>
      </aside>
    </main>
  )
}

export default CheckoutPage

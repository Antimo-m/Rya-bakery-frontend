import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../api/client'
import Link from '../components/Link'
import { useCart } from '../context/useCart'
import { useError } from '../context/useError'
import { useToast } from '../context/useToast'
import { storeOrder } from '../data/orderStorage'

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
      notify('error', 'Scegli almeno una specialita dal banco prima di inviare l ordine.')
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
      storeOrder(data.order)
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
          <p className="eyebrow">Ultimo controllo</p>
          <h1>Conferma il tuo ordine</h1>
        </header>

        <label>
          Nome cliente
          <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} required maxLength="80" placeholder="Il nome per chiamarti al banco" />
        </label>

        <label>
          Numero tavolo
          <input value={tableNumber} onChange={(event) => setTableNumber(event.target.value)} required type="number" min="1" max="999" placeholder="Il tuo tavolo" />
        </label>

        <label>
          Note
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength="500" rows="4" placeholder="Allergie, preferenze o una nota per il banco" />
        </label>

        <button className="btn" type="submit" disabled={sending}>
          {sending ? 'Stiamo inviando al banco...' : 'Invia al banco'}
        </button>
      </form>

      <aside className="checkout-summary">
        <h2>Riepilogo</h2>
        {cartItems.length === 0 ? (
          <p>Il carrello e ancora vuoto.</p>
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

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrder, getProduct } from '../api/client'
import Link from '../components/Link'
import { useCart } from '../context/useCart'
import { useError } from '../context/useError'
import { useToast } from '../context/useToast'
import { formatOrderReference, getHistoricalStoredOrders, mergeStoredOrders } from '../data/orderStorage'

const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
const dateFormatter = new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium', timeStyle: 'short' })

function OrdersHistoryPage() {
  const [orders, setOrders] = useState(() => getHistoricalStoredOrders())
  const [reorderingSlug, setReorderingSlug] = useState(null)
  const { replaceCart } = useCart()
  const { notify } = useToast()
  const { reportError } = useError()
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    Promise.allSettled(getHistoricalStoredOrders().map((order) => getOrder(order.slug)))
      .then((results) => {
        if (!active) return

        const currentOrders = getHistoricalStoredOrders()
        const refreshed = results
          .map((result, index) => (result.status === 'fulfilled' ? result.value.order : currentOrders[index]))
          .filter(Boolean)

        mergeStoredOrders(refreshed)
        setOrders(getHistoricalStoredOrders())
      })

    return () => {
      active = false
    }
  }, [])

  async function reorder(order) {
    setReorderingSlug(order.slug)

    try {
      const products = await Promise.all((order.items || []).map(async (item) => {
        const data = await getProduct(item.product_slug)

        return {
          product: data.product,
          quantity: item.quantity,
        }
      }))

      const added = replaceCart(products)

      if (!added) {
        notify('error', 'Nessun prodotto disponibile per ricreare questo ordine.')
        return
      }

      notify('success', 'Ordine ricreato nel checkout.')
      navigate('/checkout')
    } catch (error) {
      reportError(error.message || 'Non siamo riusciti a ricreare questo ordine.', error.status)
      notify('error', error.message)
    } finally {
      setReorderingSlug(null)
    }
  }

  return (
    <main className="page orders-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Cronologia</p>
          <h1>Storico ordini</h1>
        </div>
      </header>
      <div className="orders-page__intro">
        <p>Tutti gli ordini salvati su questo dispositivo, pronti da consultare o ricreare.</p>
        <Link className="btn secondary" to="/ordini">Ordini recenti</Link>
      </div>

      {orders.length === 0 ? (
        <section className="empty-panel">
          <p>Non ci sono ancora ordini nello storico di questo dispositivo.</p>
          <Link className="btn" to="/prodotti">Scegli dal banco</Link>
        </section>
      ) : (
        <section className="orders-list" aria-label="Storico ordini effettuati">
          {orders.map((order) => (
            <article className="order-card" key={order.slug}>
              <div className="order-card__header">
                <div>
                  <span className={`order-status ${order.status}`}>{order.status_label}</span>
                  <h2>{formatOrderReference(order)}</h2>
                  <p>{order.created_at ? dateFormatter.format(new Date(order.created_at)) : order.customer_name}</p>
                </div>
                <strong>{euro.format(order.total_price)}</strong>
              </div>
              <ul>
                {order.items?.map((item) => (
                  <li key={`${order.slug}-${item.product_slug}`}>
                    <span className="order-product">
                      {item.product_image_url && <img src={item.product_image_url} alt="" loading="lazy" />}
                      <span>{item.quantity}x {item.product_name}</span>
                    </span>
                    <strong>{euro.format(item.line_total)}</strong>
                  </li>
                ))}
              </ul>
              <footer>
                <span>Tavolo {order.table_number} · riferimento ordine</span>
                <button className="btn secondary" type="button" onClick={() => reorder(order)} disabled={reorderingSlug === order.slug}>
                  {reorderingSlug === order.slug ? 'Preparazione...' : 'Ordina di nuovo'}
                </button>
              </footer>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default OrdersHistoryPage

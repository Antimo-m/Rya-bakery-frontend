import { useEffect, useState } from 'react'
import { getOrder } from '../api/client'
import Link from '../components/Link'
import { getStoredOrders } from '../data/orderStorage'

const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
const dateFormatter = new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium', timeStyle: 'short' })

function OrdersPage() {
  const [orders, setOrders] = useState(() => getStoredOrders())

  useEffect(() => {
    let active = true

    Promise.allSettled(getStoredOrders().map((order) => getOrder(order.slug)))
      .then((results) => {
        if (!active) return

        const refreshed = results
          .map((result, index) => (result.status === 'fulfilled' ? result.value.order : getStoredOrders()[index]))
          .filter(Boolean)

        setOrders(refreshed)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="page orders-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">I tuoi ordini</p>
          <h1>Ordini</h1>
        </div>
        <p>Consulta gli ordini inviati da questo dispositivo e controlla lo stato aggiornato dal banco.</p>
      </header>

      {orders.length === 0 ? (
        <section className="empty-panel">
          <p>Non hai ancora inviato ordini da questo dispositivo.</p>
          <Link className="btn" to="/prodotti">Scegli prodotti</Link>
        </section>
      ) : (
        <section className="orders-list" aria-label="Ordini effettuati">
          {orders.map((order) => (
            <article className="order-card" key={order.slug}>
              <div>
                <span className={`order-status ${order.status}`}>{order.status_label}</span>
                <h2>{order.customer_name}</h2>
                <p>Tavolo {order.table_number} · {order.created_at ? dateFormatter.format(new Date(order.created_at)) : order.slug}</p>
              </div>
              <ul>
                {order.items?.map((item) => (
                  <li key={`${order.slug}-${item.product_slug}`}>
                    <span>{item.quantity}x {item.product_name}</span>
                    <strong>{euro.format(item.line_total)}</strong>
                  </li>
                ))}
              </ul>
              <footer>
                <span>Totale</span>
                <strong>{euro.format(order.total_price)}</strong>
              </footer>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default OrdersPage

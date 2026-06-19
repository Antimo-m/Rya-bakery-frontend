import { useEffect, useMemo, useState } from 'react'
import { getOrder } from '../api/client'
import Link from '../components/Link'
import { getStoredOrders, storeOrder } from '../data/orderStorage'
import echo from '../lib/echo'

const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
const dateFormatter = new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium', timeStyle: 'short' })
const orderSteps = ['received', 'pending', 'delivered']

function getProgress(status) {
  const index = orderSteps.indexOf(status)
  return index === -1 ? 1 : index + 1
}

function OrdersPage() {
  const [orders, setOrders] = useState(() => getStoredOrders())
  const orderSlugKey = useMemo(() => orders.map((order) => order.slug).filter(Boolean).join('|'), [orders])

  useEffect(() => {
    let active = true

    Promise.allSettled(getStoredOrders().map((order) => getOrder(order.slug)))
      .then((results) => {
        if (!active) return

        const refreshed = results
          .map((result, index) => (result.status === 'fulfilled' ? result.value.order : getStoredOrders()[index]))
          .filter(Boolean)

        setOrders(refreshed)
        refreshed.forEach(storeOrder)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const orderSlugs = orderSlugKey ? orderSlugKey.split('|') : []

    orderSlugs.forEach((slug) => {
      echo.channel(`orders.${slug}`).listen('.order.status.updated', (event) => {
        setOrders((currentOrders) => currentOrders.map((order) => {
          if (order.slug !== event.order?.slug) return order

          const updatedOrder = { ...order, ...event.order }
          storeOrder(updatedOrder)

          return updatedOrder
        }))
      })
    })

    return () => {
      orderSlugs.forEach((slug) => echo.leave(`orders.${slug}`))
    }
  }, [orderSlugKey])

  return (
    <main className="page orders-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Dal banco al tavolo</p>
          <h1>I tuoi ordini</h1>
        </div>
      </header>
      <p>Segui la preparazione in tempo reale: ti avvisiamo quando il tuo ordine e pronto.</p>

      {orders.length === 0 ? (
        <section className="empty-panel">
          <p>Non hai ancora ordinato da questo dispositivo. Il banco e pronto quando vuoi.</p>
          <Link className="btn" to="/prodotti">Scegli dal banco</Link>
        </section>
      ) : (
        <section className="orders-list" aria-label="Ordini effettuati">
          {orders.map((order) => (
            <article className="order-card" key={order.slug}>
              <div className="order-card__header">
                <div>
                  <span className={`order-status ${order.status}`}>{order.status_label}</span>
                  <h2>Ordine {order.slug}</h2>
                  <p>{order.created_at ? dateFormatter.format(new Date(order.created_at)) : order.customer_name}</p>
                </div>
                <strong>{euro.format(order.total_price)}</strong>
              </div>
              <div className="order-progress" style={{ '--progress': getProgress(order.status) }}>
                <span>Ricevuto</span>
                <span>In preparazione</span>
                <span>Pronto</span>
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
                <span>Tavolo {order.table_number}</span>
                <Link to="/prodotti">Ordina ancora</Link>
              </footer>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default OrdersPage

import { useEffect, useMemo, useRef, useState } from 'react'
import { getOrder } from '../api/client'
import Link from '../components/Link'
import { formatOrderReference, getRecentStoredOrders, mergeStoredOrders } from '../data/orderStorage'
import echo from '../lib/echo'
import { useToast } from '../context/useToast'

const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
const dateFormatter = new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium', timeStyle: 'short' })
const orderSteps = ['received', 'pending', 'delivered']
const readyMessage = 'Il tuo ordine è pronto. Vieni a ritirarlo al banco. Grazie per averci scelto.'

function getProgress(status) {
  const index = orderSteps.indexOf(status)
  return index === -1 ? 1 : index + 1
}

function OrdersPage() {
  const [orders, setOrders] = useState(() => getRecentStoredOrders())
  const notifiedReadyOrders = useRef(new Set())
  const { notify } = useToast()
  const orderSlugKey = useMemo(() => orders.map((order) => order.slug).filter(Boolean).join('|'), [orders])

  useEffect(() => {
    let active = true

    const refreshOrders = async () => {
      const storedOrders = getRecentStoredOrders()
      const results = await Promise.allSettled(storedOrders.map((order) => getOrder(order.slug)))

      if (!active) return

      const refreshed = results
        .map((result, index) => (result.status === 'fulfilled' ? result.value.order : storedOrders[index]))
        .filter(Boolean)

      mergeStoredOrders(refreshed)
      setOrders((currentOrders) => {
        refreshed.forEach((order) => {
          const previous = currentOrders.find((item) => item.slug === order.slug)
          if (order.status === 'delivered' && previous?.status !== 'delivered' && !notifiedReadyOrders.current.has(order.slug)) {
            notifiedReadyOrders.current.add(order.slug)
            notify('success', order.pickup_message || readyMessage)
          }
        })
        return getRecentStoredOrders()
      })
    }

    refreshOrders()
    const interval = window.setInterval(refreshOrders, 15_000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [notify])

  useEffect(() => {
    const orderSlugs = orderSlugKey ? orderSlugKey.split('|') : []

    orderSlugs.forEach((slug) => {
      echo.channel(`orders.${slug}`).listen('.order.status.updated', (event) => {
        setOrders((currentOrders) => currentOrders.map((order) => {
          if (order.slug !== event.order?.slug) return order

          const updatedOrder = { ...order, ...event.order }
          mergeStoredOrders([updatedOrder])

          if (updatedOrder.status === 'delivered' && order.status !== 'delivered' && !notifiedReadyOrders.current.has(order.slug)) {
            notifiedReadyOrders.current.add(order.slug)
            notify('success', updatedOrder.pickup_message || readyMessage)
          }

          return updatedOrder
        }))
      })
    })

    return () => {
      orderSlugs.forEach((slug) => echo.leave(`orders.${slug}`))
    }
  }, [notify, orderSlugKey])

  return (
    <main className="page orders-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Ritiro al banco</p>
          <h1>I tuoi ordini</h1>
        </div>
      </header>
      <div className="orders-page__intro">
        <p>Segui la preparazione in tempo reale: quando l ordine è pronto, vieni a ritirarlo al banco.</p>
        <Link className="btn secondary" to="/ordini/storico">Storico ordini</Link>
      </div>

      {orders.length === 0 ? (
        <section className="empty-panel">
          <p>Non hai ordini recenti su questo dispositivo. Puoi consultarli nello storico o scegliere dal banco.</p>
          <Link className="btn" to="/prodotti">Scegli dal banco</Link>
        </section>
      ) : (
        <section className="orders-list" aria-label="Ordini effettuati">
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
              <div className="order-progress" style={{ '--progress': getProgress(order.status) }}>
                <span>Ricevuto</span>
                <span>In preparazione</span>
                <span>Pronto</span>
              </div>
              {order.status === 'delivered' && (
                <div className="order-ready-notice" role="status">
                  <strong>Il tuo ordine è pronto.</strong>
                  <span>Vieni a ritirarlo al banco. Grazie per averci scelto.</span>
                </div>
              )}
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

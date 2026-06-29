import { useLocation } from 'react-router-dom'
import Link from '../components/Link'

const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

function ConfirmationPage() {
  const { state } = useLocation()
  const order = state?.order

  return (
    <main className="page confirmation-page">
      <section className="confirmation-card">
        <p className="eyebrow">Ordine inviato</p>
        <h1>Grazie, {order?.customer_name || 'cliente'}</h1>
        <p>Il banco ha ricevuto tutto. Segui la preparazione dalla pagina ordini e attendi l avviso prima del ritiro.</p>
        <div className="confirmation-pickup-note">
          <strong>Come funziona</strong>
          <span>Quando l ordine sarà pronto, vieni a ritirarlo al banco.</span>
        </div>

        {order && (
          <dl className="order-recap">
            <div><dt>Codice</dt><dd>{order.slug}</dd></div>
            <div><dt>Riferimento tavolo</dt><dd>{order.table_number}</dd></div>
            <div><dt>Stato</dt><dd>{order.status_label}</dd></div>
            <div><dt>Totale</dt><dd>{euro.format(order.total_price)}</dd></div>
          </dl>
        )}

        <Link className="btn" to="/prodotti">Ordina ancora</Link>
      </section>
    </main>
  )
}

export default ConfirmationPage

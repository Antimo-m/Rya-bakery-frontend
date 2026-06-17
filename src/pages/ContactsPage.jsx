function ContactsPage() {
  return (
    <main className="page">
      <section className="contacts-page">
        <div>
          <p className="eyebrow">Informazioni locale</p>
          <h1>Rya Bakery, Via Timavo</h1>
          <p>Un punto caldo e pratico per colazione, pausa pranzo e bakery da gustare al tavolo.</p>
        </div>

        <div className="contact-grid">
          <article>
            <span>Stato</span>
            <strong><i className="live-dot"></i> Aperto ora</strong>
            <p>Ordini digitali disponibili dal tavolo.</p>
          </article>
          <article>
            <span>Posizione</span>
            <strong>Via Timavo, Genova</strong>
            <p>Comodo per una pausa veloce o un ordine al banco.</p>
          </article>
          <article>
            <span>Esperienza</span>
            <strong>Bakery moderna</strong>
            <p>Caffetteria, dolci, salati e bevande in un flusso semplice.</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default ContactsPage

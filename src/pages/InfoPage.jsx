import { FaPhoneAlt } from 'react-icons/fa'
import { MdAccessTime, MdDirections, MdEmail, MdPlace } from 'react-icons/md'
import { isOpenNow, openingHours, socialLinks } from '../data/brand'

function InfoPage() {
  const open = isOpenNow()
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Via%20Timavo%2059%2C%20Genova'
  const iconBySocial = {
    'Google Maps': <MdPlace aria-hidden="true" />,
  }

  return (
    <main className="page">
      <section className="contacts-page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Informazioni</p>
            <h1>Rya Bakery, Via Timavo</h1>
          </div>
          <p>Un punto caldo e pratico per colazione, pausa pranzo e bakery da gustare al tavolo.</p>
        </div>

        <div className="info-layout">
          <div className="map-panel" aria-label="Mappa posizione Rya Bakery">
            <div className="custom-map">
              <iframe
                className="map-frame"
                title="Mappa Rya Bakery & Cafe - Via Timavo 59, Genova"
                src="https://maps.google.com/maps?q=Via%20Timavo%2059%2C%20Genova&t=&z=16&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <span className="map-pin" aria-hidden="true"><i></i></span>
              <div className="map-card">
                <span className={`map-status ${open ? 'is-open' : 'is-closed'}`}>{open ? 'Aperto ora' : 'Chiuso ora'}</span>
                <strong>Rya Bakery & Cafe</strong>
                <small>Via Timavo 59, Genova</small>
                <a href={mapsUrl} target="_blank" rel="noreferrer">
                  <MdDirections aria-hidden="true" />
                  Indicazioni
                </a>
              </div>
            </div>
          </div>

          <div className="info-details">
            <article>
              <MdPlace aria-hidden="true" />
              <div>
                <span>Indirizzo</span>
                <strong>Via Timavo 59, Genova</strong>
                <p>Comodo per una pausa veloce o un ordine al banco.</p>
              </div>
            </article>
            <article>
              <FaPhoneAlt aria-hidden="true" />
              <div>
                <span>Telefono</span>
                <strong><a href="tel:+393475776266"> 347 577 6266</a></strong>
                <p>Per informazioni su disponibilita e ordini speciali.</p>
              </div>
            </article>
            <article>
              <MdEmail aria-hidden="true" />
              <div>
                <span>Email</span>
                <strong><a href="mailto:hello@ryabakery.com">hello@ryabakery.com</a></strong>
                <p>Rispondiamo appena il banco rallenta un attimo.</p>
              </div>
            </article>
            <article>
              <MdAccessTime aria-hidden="true" />
              <div>
                <span>Orari</span>
                <strong>{open ? 'Aperto ora' : 'Chiuso ora'}</strong>
                <p>Orari configurabili in sviluppo, in attesa di fonte ufficiale verificata.</p>
              </div>
            </article>
          </div>
        </div>

        <section className="hours-panel" aria-label="Orari di apertura">
          {openingHours.map((item) => (
            <div key={item.day}>
              <span>{item.day}</span>
              <strong>{item.hours}</strong>
            </div>
          ))}
        </section>

        <div className="social-links" aria-label="Social Rya Bakery">
          {socialLinks.map((social) => (
            social.verified ? (
              <a
                href={social.href}
                key={social.label}
                target="_blank"
                rel="noreferrer"
                aria-label={`${social.label} Rya Bakery`}
                className={social.color ? `is-${social.color}` : ''}
              >
                {iconBySocial[social.label]}
              </a>
            ) : (
              <span
                aria-label={`${social.label} Rya Bakery non verificato`}
                aria-disabled="true"
                className={`social-links__disabled ${social.color ? `is-${social.color}` : ''}`}
                role="img"
                key={social.label}
                title={`${social.label} non verificato online`}
              >
                {iconBySocial[social.label]}
              </span>
            )
          ))}
        </div>
      </section>
    </main>
  )
}

export default InfoPage

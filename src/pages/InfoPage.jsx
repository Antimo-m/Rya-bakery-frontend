import { divIcon } from 'leaflet'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaTiktok } from 'react-icons/fa'
import { MdEmail, MdPlace } from 'react-icons/md'

const position = [44.4103, 8.9576]
const markerIcon = divIcon({
  className: 'map-pin',
  html: '<span></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

function InfoPage() {
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
            <MapContainer center={position} scrollWheelZoom={false} zoom={15}>
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker icon={markerIcon} position={position} />
            </MapContainer>
          </div>

          <div className="info-details">
            <article>
              <MdPlace aria-hidden="true" />
              <div>
                <span>Indirizzo</span>
                <strong>Via Timavo, Genova</strong>
                <p>Comodo per una pausa veloce o un ordine al banco.</p>
              </div>
            </article>
            <article>
              <FaPhoneAlt aria-hidden="true" />
              <div>
                <span>Telefono</span>
                <strong><a href="tel:+390101234567">010 123 4567</a></strong>
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
          </div>
        </div>

        <div className="social-links" aria-label="Social Rya Bakery">
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram Rya Bakery">
            <FaInstagram aria-hidden="true" />
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook Rya Bakery">
            <FaFacebookF aria-hidden="true" />
          </a>
          <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok Rya Bakery">
            <FaTiktok aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  )
}

export default InfoPage

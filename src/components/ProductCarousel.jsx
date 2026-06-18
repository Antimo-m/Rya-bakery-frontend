import { A11y, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import Link from './Link'

function ProductCarousel({ products, euro }) {
  if (!products.length) {
    return <p className="empty-state">Il banco digitale si sta preparando.</p>
  }

  return (
    <div className="carousel-shell">
      <button aria-label="Prodotti precedenti" className="carousel-arrow carousel-arrow--prev" type="button">
        <span aria-hidden="true">‹</span>
      </button>
      <Swiper
        aria-label="Prodotti in evidenza"
        className="digital-carousel"
        modules={[A11y, Navigation]}
        navigation={{
          prevEl: '.carousel-arrow--prev',
          nextEl: '.carousel-arrow--next',
        }}
        spaceBetween={18}
        slidesPerView={1.08}
        breakpoints={{
          620: { slidesPerView: 2.2 },
          900: { slidesPerView: 3 },
          1160: { slidesPerView: 4 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.slug}>
            <Link className="digital-slide" to={`/prodotti/${product.slug}`}>
              <img src={product.image_url} alt="" />
              <span>{product.category || 'Bakery'}</span>
              <strong>{product.name}</strong>
              <small>{euro.format(product.price)}</small>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <button aria-label="Prodotti successivi" className="carousel-arrow carousel-arrow--next" type="button">
        <span aria-hidden="true">›</span>
      </button>
    </div>
  )
}

export default ProductCarousel

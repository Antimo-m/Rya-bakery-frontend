import { A11y, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import Link from './Link'

function ProductCarousel({ products, euro }) {
  if (!products.length) {
    return <p className="empty-state">Il banco digitale si sta preparando.</p>
  }

  return (
    <Swiper
      aria-label="Prodotti in evidenza"
      className="digital-carousel"
      modules={[A11y, Navigation]}
      navigation
      spaceBetween={14}
      slidesPerView={1.2}
      breakpoints={{
        620: { slidesPerView: 2.4 },
        900: { slidesPerView: 3.5 },
        1160: { slidesPerView: 4.2 },
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
  )
}

export default ProductCarousel

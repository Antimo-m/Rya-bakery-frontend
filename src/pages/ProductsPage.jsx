import { useEffect, useMemo, useState } from 'react'
import { getProducts } from '../api/client'
import ProductCard from '../components/ProductCard'
import { fallbackProducts } from '../data/fallbackProducts'

const PER_PAGE = 10
const SKELETON_CARDS = Array.from({ length: 6 }, (_, index) => index)

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(['Tutto'])
  const [category, setCategory] = useState('Tutto')
  const [page, setPage] = useState(1)
  const [serverMeta, setServerMeta] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({
      page,
      per_page: PER_PAGE,
      category: category === 'Tutto' ? undefined : category,
    })
      .then((data) => {
        setProducts(data.products || [])
        setCategories(['Tutto', ...(data.categories || [])])
        setServerMeta(data.meta || null)
      })
      .catch(() => {
        setProducts(fallbackProducts)
        setCategories(['Tutto', ...new Set(fallbackProducts.map((product) => product.category))])
        setServerMeta(null)
      })
      .finally(() => setLoading(false))
  }, [category, page])

  const filteredProducts = useMemo(() => (
    category === 'Tutto' ? products : products.filter((product) => product.category === category)
  ), [category, products])

  const totalProducts = serverMeta?.total ?? filteredProducts.length
  const totalPages = Math.max(1, serverMeta?.last_page ?? Math.ceil(totalProducts / PER_PAGE))
  const currentProducts = serverMeta
    ? products
    : filteredProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <main className="page">
      <header className="page-header order-header">
        <div>
          <p className="eyebrow">Prodotti dal tavolo</p>
          <h1>Prodotti</h1>
        </div>
        <p>Scegli cosa desideri, aggiungi al carrello e conferma con nome e numero tavolo.</p>
      </header>

      <div className="category-tabs">
        {categories.map((item) => (
          <button
            key={item}
            aria-pressed={category === item}
            className={category === item ? 'active' : ''}
            type="button"
            onClick={() => {
              setCategory(item)
              setPage(1)
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <section className="product-grid" aria-label="Caricamento catalogo">
          {SKELETON_CARDS.map((item) => (
            <article className="product-card product-card--skeleton" key={item}>
              <span></span>
              <div>
                <i></i>
                <i></i>
                <i></i>
              </div>
            </article>
          ))}
        </section>
      ) : currentProducts.length === 0 ? (
        <p className="empty-state">Nessun prodotto disponibile in questa selezione.</p>
      ) : (
        <>
          <div className="catalog-meta">
            <span>{totalProducts} prodotti disponibili</span>
            <strong>Pagina {page} / {totalPages}</strong>
          </div>
          <section className="product-grid" aria-label="Catalogo prodotti">
            {currentProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
          </section>

          <nav className="pagination" aria-label="Paginazione prodotti">
            <button
              aria-label="Pagina precedente"
              className="pagination__arrow"
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              ‹
            </button>
            <span>{page} / {totalPages}</span>
            <button
              aria-label="Pagina successiva"
              className="pagination__arrow"
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              ›
            </button>
          </nav>
        </>
      )}
    </main>
  )
}

export default ProductsPage

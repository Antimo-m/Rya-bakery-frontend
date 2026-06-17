import { useEffect, useMemo, useState } from 'react'
import { getProducts } from '../api/client'
import ProductCard from '../components/ProductCard'
import { useError } from '../context/useError'
import { useToast } from '../context/useToast'

const PER_PAGE = 10

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(['Tutto'])
  const [category, setCategory] = useState('Tutto')
  const [page, setPage] = useState(1)
  const [serverMeta, setServerMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const { reportError } = useError()
  const { notify } = useToast()

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
      .catch((error) => {
        reportError(error.message || 'Catalogo non disponibile.', error.status)
        notify('error', 'Catalogo temporaneamente non disponibile.')
      })
      .finally(() => setLoading(false))
  }, [category, notify, page, reportError])

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
        <p className="empty-state">Caricamento prodotti...</p>
      ) : currentProducts.length === 0 ? (
        <p className="empty-state">Nessun prodotto disponibile in questa selezione.</p>
      ) : (
        <>
          <section className="product-grid" aria-label="Catalogo prodotti">
            {currentProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
          </section>

          <nav className="pagination" aria-label="Paginazione prodotti">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Indietro
            </button>
            <span>Pagina {page} di {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Avanti
            </button>
          </nav>
        </>
      )}
    </main>
  )
}

export default ProductsPage

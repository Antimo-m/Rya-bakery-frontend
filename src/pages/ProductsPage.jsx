import { useEffect, useMemo, useState } from 'react'
import { getProducts } from '../api/client'
import ProductCard from '../components/ProductCard'
import { useToast } from '../context/useToast'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(['Tutto'])
  const [category, setCategory] = useState('Tutto')
  const [loading, setLoading] = useState(true)
  const { notify } = useToast()

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data.products || [])
        setCategories(['Tutto', ...(data.categories || [])])
      })
      .catch((error) => notify('error', error.message || 'Catalogo non disponibile.'))
      .finally(() => setLoading(false))
  }, [notify])

  const filteredProducts = useMemo(() => (
    category === 'Tutto' ? products : products.filter((product) => product.category === category)
  ), [category, products])

  return (
    <main className="page">
      <header className="page-header order-header">
        <div>
          <p className="eyebrow">Ordina dal tavolo</p>
          <h1>Catalogo prodotti</h1>
        </div>
        <p>Scegli cosa desideri, aggiungi al carrello e conferma con nome e numero tavolo.</p>
      </header>

      <div className="category-tabs">
        {categories.map((item) => (
          <button key={item} className={category === item ? 'active' : ''} type="button" onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="empty-state">Caricamento prodotti...</p>
      ) : (
        <section className="product-grid">
          {filteredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
        </section>
      )}
    </main>
  )
}

export default ProductsPage

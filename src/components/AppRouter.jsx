import { useEffect, useMemo, useState } from 'react'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'
import ConfirmationPage from '../pages/ConfirmationPage'
import ContactsPage from '../pages/ContactsPage'
import HomePage from '../pages/HomePage'
import ProductDetailPage from '../pages/ProductDetailPage'
import ProductsPage from '../pages/ProductsPage'

function AppRouter() {
  const [location, setLocation] = useState({
    pathname: window.location.pathname,
    state: window.history.state || {},
  })

  useEffect(() => {
    const onPopState = () => setLocation({
      pathname: window.location.pathname,
      state: window.history.state || {},
    })

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const titles = {
      '/': 'Rya Bakery | Home',
      '/ordina': 'Rya Bakery | Ordina',
      '/prodotti': 'Rya Bakery | Ordina',
      '/carrello': 'Rya Bakery | Carrello',
      '/checkout': 'Rya Bakery | Checkout',
      '/conferma-ordine': 'Rya Bakery | Conferma ordine',
      '/contatti': 'Rya Bakery | Contatti',
    }

    document.title = titles[location.pathname] || 'Rya Bakery | Prodotto'
  }, [location.pathname])

  return useMemo(() => {
    if (location.pathname === '/') return <HomePage />
    if (location.pathname === '/ordina') return <ProductsPage />
    if (location.pathname === '/prodotti') return <ProductsPage />
    if (location.pathname.startsWith('/prodotti/')) return <ProductDetailPage slug={location.pathname.replace('/prodotti/', '')} />
    if (location.pathname === '/carrello') return <CartPage />
    if (location.pathname === '/checkout') return <CheckoutPage />
    if (location.pathname === '/conferma-ordine') return <ConfirmationPage order={location.state?.order} />
    if (location.pathname === '/contatti') return <ContactsPage />

    return <HomePage />
  }, [location])
}

export default AppRouter

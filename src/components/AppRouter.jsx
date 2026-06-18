import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'
import ConfirmationPage from '../pages/ConfirmationPage'
import InfoPage from '../pages/InfoPage'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import OrdersPage from '../pages/OrdersPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import ProductsPage from '../pages/ProductsPage'
import PrivacyPage from '../pages/PrivacyPage'

function PageTitle() {
  const location = useLocation()

  useEffect(() => {
    const titles = {
      '/': 'Rya Bakery | Home',
      '/prodotti': 'Rya Bakery | Prodotti',
      '/carrello': 'Rya Bakery | Carrello',
      '/ordini': 'Rya Bakery | Ordini',
      '/checkout': 'Rya Bakery | Checkout',
      '/conferma-ordine': 'Rya Bakery | Conferma ordine',
      '/informazioni': 'Rya Bakery | Informazioni',
      '/privacy': 'Rya Bakery | Privacy',
    }

    document.title = titles[location.pathname] || (
      location.pathname.startsWith('/prodotti/')
        ? 'Rya Bakery | Prodotto'
        : 'Rya Bakery | Pagina non trovata'
    )
  }, [location.pathname])

  return null
}

function AppRouter() {
  return (
    <>
      <PageTitle />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ordina" element={<Navigate to="/prodotti" replace />} />
        <Route path="/prodotti" element={<ProductsPage />} />
        <Route path="/prodotti/:slug" element={<ProductDetailPage />} />
        <Route path="/carrello" element={<CartPage />} />
        <Route path="/ordini" element={<OrdersPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/conferma-ordine" element={<ConfirmationPage />} />
        <Route path="/contatti" element={<Navigate to="/informazioni" replace />} />
        <Route path="/informazioni" element={<InfoPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default AppRouter

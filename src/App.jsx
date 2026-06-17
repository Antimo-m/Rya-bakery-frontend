import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import AppRouter from './components/AppRouter'
import SiteLayout from './components/SiteLayout'

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <SiteLayout>
          <AppRouter/>
        </SiteLayout>
      </CartProvider>
    </ToastProvider>
  )
}

export default App

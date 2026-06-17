import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { ErrorProvider } from './context/ErrorContext'
import { ToastProvider } from './context/ToastContext'
import AppRouter from './components/AppRouter'
import SiteLayout from './components/SiteLayout'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ErrorProvider>
          <CartProvider>
            <SiteLayout>
              <AppRouter />
            </SiteLayout>
          </CartProvider>
        </ErrorProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App

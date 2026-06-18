import { useMemo, useState } from 'react'
import { CartContext } from './cart-context'
const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

export function CartProvider({ children }) {
  const [items, setItems] = useState({})

  function addProduct(product, quantity = 1) {
    if (!product?.is_available) return

    setItems((current) => ({
      ...current,
      [product.slug]: {
        product,
        quantity: (current[product.slug]?.quantity || 0) + quantity,
      },
    }))
  }

  function setQuantity(slug, quantity) {
    const normalizedQuantity = Number(quantity)

    setItems((current) => {
      const next = { ...current }

      if (!Number.isFinite(normalizedQuantity) || normalizedQuantity < 1) {
        delete next[slug]
      } else if (next[slug]) {
        next[slug] = { ...next[slug], quantity: Math.floor(normalizedQuantity) }
      }

      return next
    })
  }

  function removeProduct(slug) {
    setItems((current) => {
      const next = { ...current }
      delete next[slug]
      return next
    })
  }

  function clearCart() {
    setItems({})
  }

  const cartItems = useMemo(() => Object.values(items).map((item) => ({
    ...item,
    lineTotal: item.product.price * item.quantity,
  })), [items])

  const total = cartItems.reduce((sum, item) => sum + item.lineTotal, 0)
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, count, total, euro, addProduct, setQuantity, removeProduct, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

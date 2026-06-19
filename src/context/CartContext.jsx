import { useMemo, useState } from 'react'
import { CartContext } from './cart-context'
import { useToast } from './useToast'
const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
const MAX_PRODUCT_QUANTITY = 20
const MAX_PRODUCT_MESSAGE = 'Puoi aggiungere al massimo 20 unita per singolo prodotto.'

export function CartProvider({ children }) {
  const [items, setItems] = useState({})
  const { notify } = useToast()

  function notifyMaxQuantity() {
    notify('error', MAX_PRODUCT_MESSAGE)
  }

  function addProduct(product, quantity = 1) {
    if (!product?.is_available) return
    const currentQuantity = items[product.slug]?.quantity || 0
    const requestedQuantity = currentQuantity + quantity

    if (requestedQuantity > MAX_PRODUCT_QUANTITY) {
      notifyMaxQuantity()
      return false
    }

    setItems((current) => {
      return {
        ...current,
        [product.slug]: {
          product,
          quantity: requestedQuantity,
        },
      }
    })

    return true
  }

  function setQuantity(slug, quantity) {
    const normalizedQuantity = Number(quantity)

    if (Number.isFinite(normalizedQuantity) && Math.floor(normalizedQuantity) > MAX_PRODUCT_QUANTITY && items[slug]) {
      notifyMaxQuantity()
      return false
    }

    setItems((current) => {
      const next = { ...current }

      if (!Number.isFinite(normalizedQuantity) || normalizedQuantity < 1) {
        delete next[slug]
      } else if (next[slug]) {
        const requestedQuantity = Math.floor(normalizedQuantity)

        next[slug] = { ...next[slug], quantity: requestedQuantity }
      }

      return next
    })

    return true
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
    <CartContext.Provider value={{ cartItems, count, total, euro, maxProductQuantity: MAX_PRODUCT_QUANTITY, maxProductMessage: MAX_PRODUCT_MESSAGE, addProduct, setQuantity, removeProduct, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

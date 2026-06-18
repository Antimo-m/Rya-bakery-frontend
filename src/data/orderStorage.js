const STORAGE_KEY = 'rya-bakery-orders'

export function getStoredOrders() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function storeOrder(order) {
  const orders = getStoredOrders().filter((item) => item.slug !== order.slug)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...orders].slice(0, 20)))
}

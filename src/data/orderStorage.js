const STORAGE_KEY = 'rya-bakery-orders'
const RECENT_ORDER_WINDOW_MS = 24 * 60 * 60 * 1000
const MAX_STORED_ORDERS = 100

function getOrderTime(order) {
  const timestamp = Date.parse(order?.created_at || '')

  return Number.isNaN(timestamp) ? 0 : timestamp
}

export function getStoredOrders() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function getRecentStoredOrders() {
  const cutoff = Date.now() - RECENT_ORDER_WINDOW_MS

  return getStoredOrders().filter((order) => {
    const createdAt = getOrderTime(order)

    return createdAt === 0 || createdAt >= cutoff
  })
}

export function getHistoricalStoredOrders() {
  return getStoredOrders()
}

export function storeOrder(order) {
  const orders = getStoredOrders().filter((item) => item.slug !== order.slug)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...orders].slice(0, MAX_STORED_ORDERS)))
}

export function mergeStoredOrders(updatedOrders) {
  const updatesBySlug = new Map(updatedOrders.filter((order) => order?.slug).map((order) => [order.slug, order]))
  const merged = getStoredOrders().map((order) => updatesBySlug.get(order.slug) || order)
  const missingUpdates = updatedOrders.filter((order) => order?.slug && !merged.some((item) => item.slug === order.slug))

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...missingUpdates, ...merged].slice(0, MAX_STORED_ORDERS)))
}

export function formatOrderReference(order) {
  const fallback = String(order?.id || '').trim()
  const slug = String(order?.slug || fallback || '').trim()
  const readable = slug.replace(/^ordine[-_]?/i, '').replace(/[^a-z0-9]/gi, '').toUpperCase()
  const shortCode = readable.slice(-8) || fallback || 'RYA'

  return `Ordine: #${shortCode}`
}

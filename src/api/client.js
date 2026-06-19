const configuredBackendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
const BACKEND_URL = configuredBackendUrl.endsWith('/api') ? configuredBackendUrl.slice(0, -4) : configuredBackendUrl
const API_URL = configuredBackendUrl.endsWith('/api') ? configuredBackendUrl : `${configuredBackendUrl}/api`
const PRODUCT_PLACEHOLDER_URL = `${BACKEND_URL}/images/rya-product-placeholder.svg`

function buildPath(path, params = {}) {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value)
    }
  })

  return `${path}${search.toString() ? `?${search.toString()}` : ''}`
}

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const validationMessage = Object.values(data.errors || {})?.[0]?.[0]
      const error = new Error(validationMessage || data.message || 'Richiesta non completata.')
      error.status = response.status
      throw error
    }

    return data
  } catch (error) {
    if (!error.status) {
      error.message = 'Connessione al catalogo non disponibile.'
    }

    throw error
  }
}

function normalizeImageUrl(imageUrl) {
  if (!imageUrl) return PRODUCT_PLACEHOLDER_URL

  try {
    return new URL(imageUrl, BACKEND_URL).toString()
  } catch {
    return PRODUCT_PLACEHOLDER_URL
  }
}

export function normalizeProduct(product) {
  if (!product) return product

  return {
    ...product,
    image_url: normalizeImageUrl(product.image_url || product.cover_url || product.photo_url),
  }
}

export function normalizeProducts(products = []) {
  return products.map(normalizeProduct)
}

function normalizeOrder(order) {
  if (!order) return order

  return {
    ...order,
    items: (order.items || []).map((item) => ({
      ...item,
      product_image_url: normalizeImageUrl(item.product_image_url || item.image_url),
    })),
  }
}

export function getProducts(params = {}) {
  return request(buildPath('/products', params)).then((data) => ({
    ...data,
    products: normalizeProducts(data.products || []),
  }))
}

export function getProduct(slug) {
  return request(`/products/${slug}`).then((data) => ({
    ...data,
    product: normalizeProduct(data.product),
  }))
}

export function getOrder(slug) {
  return request(`/orders/${slug}`).then((data) => ({
    ...data,
    order: normalizeOrder(data.order),
  }))
}

export function createOrder(payload) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((data) => ({
    ...data,
    order: normalizeOrder(data.order),
  }))
}

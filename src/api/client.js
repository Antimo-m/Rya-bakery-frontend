const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
const API_URL = BACKEND_URL.endsWith('/api') ? BACKEND_URL : `${BACKEND_URL}/api`

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

export function getProducts(params = {}) {
  return request(buildPath('/products', params))
}

export function getProduct(slug) {
  return request(`/products/${slug}`)
}

export function createOrder(payload) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

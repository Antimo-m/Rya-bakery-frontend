const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

async function request(path, options = {}) {
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
    throw new Error(validationMessage || data.message || 'Richiesta non completata.')
  }

  return data
}

export function getProducts() {
  return request('/products')
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

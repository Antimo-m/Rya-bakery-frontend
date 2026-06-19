import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

const configuredBackendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
const backendUrl = configuredBackendUrl.endsWith('/api') ? configuredBackendUrl.slice(0, -4) : configuredBackendUrl
const backendHost = new URL(backendUrl).hostname
const configuredHost = import.meta.env.VITE_REVERB_HOST
const wsHost = configuredHost && !['127.0.0.1', 'localhost'].includes(configuredHost)
  ? configuredHost
  : backendHost

const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY || 'local-key',
  wsHost,
  wsPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
  enabledTransports: ['ws', 'wss'],
})

export default echo

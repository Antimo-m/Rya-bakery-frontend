import cappuccinoImage from '../assets/products/cappuccino-rya.jpg'
import cornettoImage from '../assets/products/cornetto-crema.jpg'
import focacciaImage from '../assets/products/focaccia-farcita.jpg'
import pastryBoxImage from '../assets/products/pastry-box.jpg'
import spremutaImage from '../assets/products/spremuta-fresca.jpg'

export const openingHours = [
  { day: 'Lunedi', hours: '07:00 - 19:30' },
  { day: 'Martedi', hours: '07:00 - 19:30' },
  { day: 'Mercoledi', hours: '07:00 - 19:30' },
  { day: 'Giovedi', hours: '07:00 - 19:30' },
  { day: 'Venerdi', hours: '07:00 - 19:30' },
  { day: 'Sabato', hours: '08:00 - 19:30' },
  { day: 'Domenica', hours: '08:00 - 13:00' },
]

export const socialLinks = [
  {
    label: 'Google Maps',
    href: 'https://www.google.com/maps/search/?api=1&query=Via%20Timavo%2059%2C%20Genova',
    verified: true,
    color: 'maps',
  },
]

export const showcaseItems = [
  {
    title: 'Cornetto bronzo',
    subtitle: 'Sfoglia dorata, crema vellutata',
    image: cornettoImage,
  },
  {
    title: 'Cappuccino signature',
    subtitle: 'Latte setoso e tostatura intensa',
    image: cappuccinoImage,
  },
  {
    title: 'Bakery salata',
    subtitle: 'Impasti morbidi, farciture fresche',
    image: focacciaImage,
  },
  {
    title: 'Dessert da banco',
    subtitle: 'Piccola pasticceria pronta da scegliere',
    image: pastryBoxImage,
  },
  {
    title: 'Pausa emerald',
    subtitle: 'Ordina dal tavolo, ritira al banco',
    image: spremutaImage,
  },
]

const STORE_TIME_ZONE = 'Europe/Rome'
const WEEKDAY_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}
const weeklySchedule = [
    ['08:00', '13:00'],
    ['07:00', '19:30'],
    ['07:00', '19:30'],
    ['07:00', '19:30'],
    ['07:00', '19:30'],
    ['07:00', '19:30'],
    ['08:00', '19:30'],
  ]

function storeDateParts(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: STORE_TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))

  return {
    day: WEEKDAY_INDEX[values.weekday],
    hour: Number(values.hour),
    minute: Number(values.minute),
  }
}

export function getStoreStatus(date = new Date()) {
  const { day, hour, minute } = storeDateParts(date)
  const schedule = weeklySchedule[day]

  const minutes = hour * 60 + minute
  const [openHour, openMinute] = schedule[0].split(':').map(Number)
  const [closeHour, closeMinute] = schedule[1].split(':').map(Number)
  const openMinutes = openHour * 60 + openMinute
  const closeMinutes = closeHour * 60 + closeMinute
  const open = minutes >= openMinutes && minutes < closeMinutes
  const minutesUntilClose = open ? closeMinutes - minutes : null

  return {
    open,
    closingSoon: open && minutesUntilClose <= 30,
    minutesUntilClose,
    closesAt: schedule[1],
  }
}

export function isOpenNow(date = new Date()) {
  return getStoreStatus(date).open
}

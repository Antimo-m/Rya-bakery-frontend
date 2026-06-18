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
    label: 'Instagram',
    href: '',
    verified: false,
  },
  {
    label: 'Facebook',
    href: '',
    verified: false,
  },
  {
    label: 'TikTok',
    href: '',
    verified: false,
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
    subtitle: 'Un momento curato dal tavolo al banco',
    image: spremutaImage,
  },
]

export function isOpenNow(date = new Date()) {
  const day = date.getDay()
  const schedule = [
    ['08:00', '13:00'],
    ['07:00', '19:30'],
    ['07:00', '19:30'],
    ['07:00', '19:30'],
    ['07:00', '19:30'],
    ['07:00', '19:30'],
    ['08:00', '19:30'],
  ][day]

  const minutes = date.getHours() * 60 + date.getMinutes()
  const [openHour, openMinute] = schedule[0].split(':').map(Number)
  const [closeHour, closeMinute] = schedule[1].split(':').map(Number)
  const openMinutes = openHour * 60 + openMinute
  const closeMinutes = closeHour * 60 + closeMinute

  return minutes >= openMinutes && minutes < closeMinutes
}

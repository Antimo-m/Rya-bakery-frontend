import cappuccinoImage from '../assets/products/cappuccino-rya.jpg'
import cornettoImage from '../assets/products/cornetto-crema.jpg'
import focacciaImage from '../assets/products/focaccia-farcita.jpg'
import pastryBoxImage from '../assets/products/pastry-box.jpg'
import spremutaImage from '../assets/products/spremuta-fresca.jpg'

export const fallbackProducts = [
  {
    name: 'Cornetto crema',
    slug: 'cornetto-crema',
    category: 'Dolce',
    description: 'Sfoglia dorata con crema morbida, pensata per una colazione lenta.',
    price: 2.8,
    image_url: cornettoImage,
    is_available: true,
  },
  {
    name: 'Cappuccino Rya',
    slug: 'cappuccino-rya',
    category: 'Caffetteria',
    description: 'Espresso intenso, latte montato fine e una finitura vellutata.',
    price: 2.2,
    image_url: cappuccinoImage,
    is_available: true,
  },
  {
    name: 'Focaccia farcita',
    slug: 'focaccia-farcita',
    category: 'Salato',
    description: 'Impasto soffice, farcitura fresca e taglio generoso da pausa pranzo.',
    price: 5.5,
    image_url: focacciaImage,
    is_available: true,
  },
  {
    name: 'Mini pastry box',
    slug: 'mini-pastry-box',
    category: 'Pasticceria',
    description: 'Piccola selezione dolce dal banco, elegante e facile da condividere.',
    price: 7.5,
    image_url: pastryBoxImage,
    is_available: true,
  },
  {
    name: 'Toast emerald',
    slug: 'toast-emerald',
    category: 'Salato',
    description: 'Pane caldo, ingredienti essenziali e servizio rapido al tavolo.',
    price: 6,
    image_url: focacciaImage,
    is_available: true,
  },
  {
    name: 'Spremuta fresca',
    slug: 'spremuta-fresca',
    category: 'Bevande',
    description: 'Agrumi freschi e note luminose per accompagnare il banco bakery.',
    price: 3.8,
    image_url: spremutaImage,
    is_available: true,
  },
]

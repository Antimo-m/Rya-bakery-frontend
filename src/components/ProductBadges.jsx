import { FiAward, FiClock, FiStar } from 'react-icons/fi'

const badgeIcons = {
  best_seller: FiAward,
  new: FiStar,
  freshly_baked: FiClock,
}

function ProductBadges({ badges = [], compact = false }) {
  if (!badges.length) return null

  return (
    <div className={`product-badges ${compact ? 'compact' : ''}`} aria-label="Evidenze prodotto">
      {badges.map((badge) => {
        const Icon = badgeIcons[badge.type] || FiStar

        return (
          <span className={`product-badge ${badge.type}`} key={badge.type}>
            <Icon aria-hidden="true" />
            {badge.label}
          </span>
        )
      })}
    </div>
  )
}

export default ProductBadges

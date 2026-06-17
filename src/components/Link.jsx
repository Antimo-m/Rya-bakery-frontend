import { Link as RouterLink } from 'react-router-dom'

function Link({ to, state, children, className, ...props }) {
  return (
    <RouterLink
      className={className}
      state={state}
      to={to}
      {...props}
    >
      {children}
    </RouterLink>
  )
}

export default Link

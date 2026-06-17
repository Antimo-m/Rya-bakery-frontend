import { navigate } from './navigation'

function Link({ to, state, children, className }) {
  return (
    <a
      className={className}
      href={to}
      onClick={(event) => {
        event.preventDefault()
        navigate(to, state)
      }}
    >
      {children}
    </a>
  )
}

export default Link

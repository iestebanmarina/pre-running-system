import PropTypes from 'prop-types'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = ''
}) => {
  // Base styles
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2'

  // Variant styles
  const variantStyles = {
    primary: 'bg-gradient-to-r from-accent-orange to-accent-pink text-white hover:scale-[1.02] hover:shadow-lg focus:ring-accent-orange',
    secondary: 'bg-white border-2 border-black text-black hover:bg-black hover:text-white focus:ring-black',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  }

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg'
  }

  // Disabled styles
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string
}

export default Button

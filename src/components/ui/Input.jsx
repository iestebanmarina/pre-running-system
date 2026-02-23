import PropTypes from 'prop-types'

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = ''
}) => {
  // Base input styles
  const baseStyles = 'w-full px-3 py-2 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1'

  // Error vs normal border styles
  const borderStyles = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-border focus:ring-accent-orange focus:border-accent-orange'

  // Disabled styles
  const disabledStyles = disabled ? 'bg-surface cursor-not-allowed opacity-60' : 'bg-white'

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-black mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`${baseStyles} ${borderStyles} ${disabledStyles} ${className}`}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
}

export default Input

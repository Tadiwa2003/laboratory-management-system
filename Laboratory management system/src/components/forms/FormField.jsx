const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  register, 
  error, 
  placeholder,
  required = false,
  className = '',
  ...props 
}) => {
  const inputClasses = `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
    error
      ? 'border-red-500 dark:border-red-500'
      : 'border-gray-300 dark:border-gray-600'
  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          id={name}
          {...register(name, { required: required && `${label || name} is required` })}
          placeholder={placeholder}
          rows={4}
          className={inputClasses}
          {...props}
        />
      ) : (
        <input
          id={name}
          type={type}
          {...register(name, { required: required && `${label || name} is required` })}
          placeholder={placeholder}
          className={inputClasses}
          {...props}
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</p>
      )}
    </div>
  );
};

export default FormField;


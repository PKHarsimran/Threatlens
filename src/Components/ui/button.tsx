import * as React from "react"

const buttonVariants = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900",
  ghost: "hover:bg-gray-100 text-gray-900",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
}

const Button = React.forwardRef(({ className = "", variant = "default", size = "default", asChild, children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${baseStyles} ${buttonVariants[variant]} ${sizeStyles[size]} ${className}`,
      ref,
      ...props,
    })
  }

  return (
    <button
      className={`${baseStyles} ${buttonVariants[variant]} ${sizeStyles[size]} ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = "Button"

export { Button }
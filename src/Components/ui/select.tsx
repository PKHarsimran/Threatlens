import * as React from "react"

const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value || "")

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setIsOpen(false)
  }

  React.useEffect(() => {
    setSelectedValue(value || "")
  }, [value])

  return (
    <div className="relative" {...props}>
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            selectedValue,
          })
        }
        if (child.type === SelectContent) {
          return isOpen ? React.cloneElement(child, {
            onValueChange: handleValueChange,
          }) : null
        }
        return child
      })}
    </div>
  )
}

const SelectTrigger = ({ className = "", children, onClick, selectedValue }) => (
  <button
    type="button"
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
)

const SelectValue = ({ placeholder, value }) => (
  <span className="text-sm">{value || placeholder}</span>
)

const SelectContent = ({ className = "", children, onValueChange }) => (
  <div className={`absolute z-50 top-full left-0 right-0 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${className}`}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { onValueChange })
    )}
  </div>
)

const SelectItem = ({ className = "", children, value, onValueChange }) => (
  <div
    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${className}`}
    onClick={() => onValueChange?.(value)}
  >
    {children}
  </div>
)

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}
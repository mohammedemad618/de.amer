import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils/cn'
import { Spinner } from './spinner'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success'

type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
  isLoading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-indigo-500 shadow-soft',
  secondary: 'bg-accent-turquoise text-white hover:bg-teal-500 shadow-soft',
  outline: 'border border-primary text-primary hover:bg-primary/10',
  ghost: 'text-neutral-700 hover:bg-neutral-100',
  success: 'bg-green-500 text-white hover:bg-green-600 shadow-soft'
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-base',
  lg: 'px-6 py-3 text-lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
    const Component = asChild ? Slot : 'button'
    return (
      <Component
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition focus-ring disabled:cursor-not-allowed disabled:opacity-50 gap-2',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && !asChild && <Spinner className="w-4 h-4" aria-hidden="true" />}
        {children}
      </Component>
    )
  }
)
Button.displayName = 'Button'

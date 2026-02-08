import * as React from 'react'
import { cn } from '@/lib/utils/cn'

type InputSize = 'sm' | 'md' | 'lg'

type InputState = 'default' | 'error' | 'disabled'

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: InputSize
  state?: InputState
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg'
}

const stateClasses: Record<InputState, string> = {
  default: 'border-neutral-200 focus:border-primary',
  error: 'border-error text-error placeholder:text-error/70 focus:border-error',
  disabled: 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size = 'md', state = 'default', disabled, ...props }, ref) => {
    const computedState = disabled ? 'disabled' : state

    return (
      <input
        className={cn(
          'w-full rounded-xl border bg-white text-neutral-900 transition focus-ring',
          sizeClasses[size],
          stateClasses[computedState],
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

import type { PressableProps } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import { Text } from '@ui/components'
import { cn } from '@ui/utils'
import { cssInterop } from 'nativewind'

interface ButtonProps extends PressableProps {
  children: React.ReactNode
  className?: string
}

cssInterop(Pressable, {
  className: 'style',
})

export const Button = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  ButtonProps
>(({ children, className, ...props }, ref) => {
  let content = children
  if (typeof content === 'string') content = <Text>{children}</Text>

  return (
    <Pressable
      ref={ref}
      className={cn('rounded-full px-4 py-2', className)}
      {...props}
    >
      {content}
    </Pressable>
  )
})

Button.displayName = 'Button'

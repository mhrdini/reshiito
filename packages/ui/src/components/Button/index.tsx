import type { PressableProps } from 'react-native'
import React from 'react'
import { Pressable as RNPressable } from 'react-native'
import { Text } from '@ui/components/Text'
import { cn } from '@ui/utils'
import { cssInterop } from 'nativewind'

interface ButtonProps extends PressableProps {
  children: React.ReactNode
  className?: string
  textClassName?: string
}

const Pressable = cssInterop(RNPressable, {
  className: 'style',
})

export const Button = React.forwardRef<
  React.ComponentRef<typeof RNPressable>,
  ButtonProps
>(({ children, className, textClassName, ...props }, ref) => {
  let content = children
  if (typeof children === 'string') {
    content = (
      <Text className={cn('text-black dark:text-white', textClassName)}>
        {children}
      </Text>
    )
  }

  return (
    <Pressable
      ref={ref}
      className={cn(
        'rounded-full bg-slate-300 px-4 py-2 active:bg-slate-200 dark:bg-slate-700 dark:active:bg-slate-600',
        className,
      )}
      {...props}
    >
      {content}
    </Pressable>
  )
})

Button.displayName = 'Button'

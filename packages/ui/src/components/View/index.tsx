import type { ViewProps as RNViewProps } from 'react-native'
import React from 'react'
import { View as RNView } from 'react-native'
import { cssInterop } from 'nativewind'
import { cn } from 'ui/utils'

interface ViewProps extends RNViewProps {
  children?: React.ReactNode
  className?: string
}

cssInterop(RNView, {
  className: 'style',
})

export const View = React.forwardRef<
  React.ComponentRef<typeof RNView>,
  ViewProps
>(({ children, className, ...props }, ref) => {
  return (
    <RNView ref={ref} className={cn(className)} {...props}>
      {children}
    </RNView>
  )
})

View.displayName = 'View'

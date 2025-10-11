import type * as ZustandExportedTypes from 'zustand'
import { act } from '@testing-library/react-native'

const actualZustand = jest.requireActual<typeof ZustandExportedTypes>('zustand')

export const storeResetFns = new Set<() => void>()

const createUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  const store = actualZustand.create(stateCreator)
  const initialState = store.getState()

  storeResetFns.add(() =>
    (store.setState as (state: T, replace: true) => void)(initialState, true),
  )

  const originalSetState = store.setState
  store.setState = ((...args: Parameters<typeof originalSetState>) => {
    act(() => {
      originalSetState(...args)
    })
  }) as typeof store.setState

  return store
}

export const create = (<T>(
  stateCreator?: ZustandExportedTypes.StateCreator<T>,
) => {
  if (!stateCreator) {
    return (creator: ZustandExportedTypes.StateCreator<T>) =>
      createUncurried(creator)
  }
  return createUncurried(stateCreator)
}) as typeof actualZustand.create

export const createStore = actualZustand.createStore

afterEach(() => {
  act(() => {
    storeResetFns.forEach(resetFn => resetFn())
  })
})

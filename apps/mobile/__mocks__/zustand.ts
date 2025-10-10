import type * as ZustandExportedTypes from 'zustand'
import { act } from '@testing-library/react-native'

// Import the real Zustand package safely
const actualZustand = jest.requireActual<typeof ZustandExportedTypes>('zustand')

// Track all store reset functions
export const storeResetFns = new Set<() => void>()

// Helper for creating a store and tracking its initial state
const createUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  const store = actualZustand.create(stateCreator)
  const initialState = store.getState()
  storeResetFns.add(() => store.setState(initialState, true))
  return store
}

// ✅ Wrap create() to support both curried and uncurried API
export const create = (<T>(
  stateCreator?: ZustandExportedTypes.StateCreator<T>,
) => {
  if (!stateCreator) {
    // Curried form: create()<T>(stateCreator)
    return (creator: ZustandExportedTypes.StateCreator<T>) =>
      createUncurried(creator)
  }
  // Uncurried form: create(stateCreator)
  return createUncurried(stateCreator)
}) as typeof ZustandExportedTypes.create

// Export other Zustand utilities as needed
export const createStore = actualZustand.createStore

// Automatically reset all stores after each test
afterEach(() => {
  act(() => {
    storeResetFns.forEach(resetFn => resetFn())
  })
})

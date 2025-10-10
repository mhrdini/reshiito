export const mockBack = jest.fn()
export const mockDismissAll = jest.fn()

export function useRouter() {
  return { back: mockBack, dismissAll: mockDismissAll }
}

// Automatically reset mocks after each test
afterEach(() => {
  mockBack.mockClear()
  mockDismissAll.mockClear()
})

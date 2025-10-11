export const mockBack = jest.fn()
export const mockDismissAll = jest.fn()
export const mockNavigate = jest.fn()

export function useRouter() {
  return { back: mockBack, dismissAll: mockDismissAll, navigate: mockNavigate }
}

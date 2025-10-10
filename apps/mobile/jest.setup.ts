import '@testing-library/jest-dom'

// Manual mocks from '__mocks__' directory
jest.mock('zustand')

jest.mock('expo-router')

jest.mock('expo-camera')

// Manual mocks
jest.mock('expo-media-library', () => ({
  saveToLibraryAsync: jest.fn().mockResolvedValue('mock-uri'),
  usePermissions: jest.fn(() => [
    { granted: true }, // permission object
    jest.fn(), // request function
  ]),
}))

// Internal modules mocks
jest.mock('@/features/ocr/utils', () => ({
  convertToImage: jest.fn(result => ({
    uri: result.uri,
    height: 100,
    width: 100,
    base64: 'bW9jaw==',
  })),
}))

jest.mock('@/features/ocr/hooks', () => ({
  usePermissions: () => ({
    permissions: true,
    requestPermissions: jest.fn(),
  }),
}))

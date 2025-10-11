import '@testing-library/jest-dom'

import { MOCK_OCR_TEXT } from './src/constants'

// Manual mocks from '__mocks__' directory
// jest.mock('zustand')

jest.mock('expo-router')

jest.mock('expo-camera')

jest.mock('expo-image-picker')

jest.mock('expo-media-library')

// Internal modules
jest.mock('@/features/ocr/utils', () => ({
  convertToImage: jest.fn(result => ({
    uri: result.uri,
    width: result.width,
    height: result.height,
    base64: result.base64,
  })),
}))

jest.mock('@/features/ocr/hooks', () => ({
  usePermissions: () => ({
    permissions: true,
    requestPermissions: jest.fn(),
  }),
  useOCR: () => ({
    extractText: jest.fn().mockResolvedValue(MOCK_OCR_TEXT),
    isPending: false,
    isSuccess: true,
  }),
}))

jest.mock('@/features/ocr/ocr.query', () => ({
  usePerformOCRMutation: jest.fn(),
}))

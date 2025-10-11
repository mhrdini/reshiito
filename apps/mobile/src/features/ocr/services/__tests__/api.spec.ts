import { getOCR, postOCR } from '@/features/ocr/services/api'
import { API_PREFIX_URL } from '@/lib/apiClient'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { OCRRequest, OCRResponse } from 'types/schemas'

const mockGetOCRResponse: OCRResponse = { text: 'OCR service is running' }
const mockPostOCRResponse: OCRResponse = { text: 'Hello World' }

const server = setupServer(
  rest.get(`${API_PREFIX_URL}/ocr`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(mockGetOCRResponse)),
  ),
  rest.post(`${API_PREFIX_URL}/ocr`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(mockPostOCRResponse)),
  ),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('OCR API wrappers', () => {
  it('throws when getOCR receives a server error', async () => {
    server.use(
      rest.get(`${API_PREFIX_URL}/ocr`, (req, res, ctx) =>
        res(ctx.status(500)),
      ),
    )
    await expect(getOCR()).rejects.toThrow()
  })

  it('throws when postOCR receives a server error', async () => {
    server.use(
      rest.post(`${API_PREFIX_URL}/ocr`, (req, res, ctx) =>
        res(ctx.status(500)),
      ),
    )
    const requestData: OCRRequest = { b64: 'iVBORw0KGgoAAAANSUhEUgAAAAUA' }
    await expect(postOCR(requestData)).rejects.toThrow()
  })
})

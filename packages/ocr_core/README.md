# OCR Core

## Data Flow

### Image OCR Processing Flow

```css
[Client Upload]
      │
      ▼
[Endpoint] (ocr.py) ──> get_ocr_service() ──> [OCRServiceInterface]
      │                                 │
      │                                 ▼
      │                        Injected OCRStrategy
      │                                 │
      ▼                                 ▼
[ImageInputStrategy] ──> PIL.Image ──> run_ocr / run_ocr_async
                                        │
                                        ▼
                                [Core OCR functions]
                                        │
                                        ▼
                            [Helpers: preprocess/save temp]
                                        │
                                        ▼
                              Extracted text returned
                                        │
                                        ▼
                            [Service → Endpoint → Client]
```

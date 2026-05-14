import { formatDuration, formatSize, extractVideoMetadata } from '../utils/videoMetadata'

test('formatDuration formats seconds to mm:ss', () => {
  expect(formatDuration(0)).toBe('0:00')
  expect(formatDuration(61)).toBe('1:01')
  expect(formatDuration(125)).toBe('2:05')
  expect(formatDuration(3599)).toBe('59:59')
})

test('formatSize formats bytes to human-readable', () => {
  expect(formatSize(500)).toBe('500 Ko')
  expect(formatSize(2_500_000)).toBe('2 Mo')
  expect(formatSize(1_500_000_000)).toBe('1.5 Go')
})

test('extractVideoMetadata resolves with duration and thumbnailUrl', async () => {
  const loadedListeners: Array<() => void> = []
  const seekedListeners: Array<() => void> = []

  const mockVideo = {
    duration: 42,
    videoWidth: 640,
    videoHeight: 480,
    preload: '',
    muted: false,
    playsInline: false,
    src: '',
    currentTime: 0,
    addEventListener: vi.fn((event: string, cb: () => void) => {
      if (event === 'loadedmetadata') loadedListeners.push(cb)
      if (event === 'seeked') seekedListeners.push(cb)
    }),
  }

  const mockCtx = { drawImage: vi.fn() }
  const mockCanvas = {
    width: 0,
    height: 0,
    getContext: vi.fn().mockReturnValue(mockCtx),
    toDataURL: vi.fn().mockReturnValue('data:image/jpeg;base64,abc123'),
  }

  const originalCreate = document.createElement.bind(document)
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'video') return mockVideo as unknown as HTMLVideoElement
    if (tag === 'canvas') return mockCanvas as unknown as HTMLCanvasElement
    return originalCreate(tag)
  })
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

  const file = new File([''], 'test.mp4', { type: 'video/mp4' })
  const promise = extractVideoMetadata(file)

  // Simulate browser events in sequence
  loadedListeners.forEach((cb) => cb())
  seekedListeners.forEach((cb) => cb())

  const result = await promise

  expect(result.duration).toBe(42)
  expect(result.thumbnailUrl).toBe('data:image/jpeg;base64,abc123')
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')

  vi.restoreAllMocks()
})

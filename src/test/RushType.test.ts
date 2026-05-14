import { MOCK_RUSHES, MOCK_REALISATIONS } from '../data/mock'

test('MOCK_RUSHES exists and items have required fields', () => {
  expect(MOCK_RUSHES.length).toBeGreaterThan(0)
  for (const r of MOCK_RUSHES) {
    expect(r.id).toBeTruthy()
    expect(r.name).toBeTruthy()
    expect(typeof r.duration).toBe('number')
    expect(r.thumbnailUrl).toBeDefined()
    expect(typeof r.size).toBe('number')
  }
})

test('MOCK_REALISATIONS use rushIds (not rushes)', () => {
  for (const r of MOCK_REALISATIONS) {
    expect(Array.isArray(r.rushIds)).toBe(true)
  }
})

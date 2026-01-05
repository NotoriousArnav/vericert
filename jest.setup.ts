import '@testing-library/jest-dom'

// Mock canvas to avoid native dependency issues in jsdom
jest.mock('canvas', () => ({
  createCanvas: jest.fn(() => ({
    getContext: jest.fn(() => ({})),
    toDataURL: jest.fn(() => 'data:image/png;base64,'),
  })),
}), { virtual: true })

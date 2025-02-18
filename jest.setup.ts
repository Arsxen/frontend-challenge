import '@testing-library/jest-dom'

// Mock missing features in jsdom
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
window.HTMLElement.prototype.scrollIntoView = () => {}

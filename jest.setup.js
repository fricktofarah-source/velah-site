// jest.setup.js
import '@testing-library/jest-dom';

const intersectionObserverMock = () => ({
  observe: () => null,
  disconnect: () => null,
});

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

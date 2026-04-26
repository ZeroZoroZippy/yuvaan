// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

jest.mock('ogl', () => {
  class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
      this.set(x, y, z);
    }

    set(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }

  class Renderer {
    constructor() {
      const canvas = global.document.createElement('canvas');

      this.gl = {
        canvas,
        clearColor: jest.fn(),
        getExtension: jest.fn(() => ({
          loseContext: jest.fn()
        }))
      };

      this.gl.canvas.width = 0;
      this.gl.canvas.height = 0;
    }

    setSize(width, height) {
      this.gl.canvas.width = width;
      this.gl.canvas.height = height;
    }

    render() {}
  }

  class Program {
    constructor(_gl, config = {}) {
      this.uniforms = config.uniforms || {};
    }
  }

  class Mesh {
    constructor() {}
  }

  class Triangle {
    constructor() {}
  }

  return { Renderer, Program, Mesh, Triangle, Vec3 };
});

jest.mock('lenis', () => {
  return class Lenis {
    raf() {}
    destroy() {}
  };
});

// Mock window.location for tests
delete window.location;
window.location = {
  href: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: ''
};

// Mock IntersectionObserver for lazy loading tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

window.scrollTo = jest.fn();
window.requestAnimationFrame = (callback) => setTimeout(() => callback(0), 0);
window.cancelAnimationFrame = (id) => clearTimeout(id);

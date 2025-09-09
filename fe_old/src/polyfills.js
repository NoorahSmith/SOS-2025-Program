// Polyfills for Node.js modules in browser environment
import { Buffer } from 'buffer';

// Make Buffer available globally
window.Buffer = Buffer;

// Polyfill for process
if (typeof global === 'undefined') {
  window.global = window;
}

// Polyfill for process.env
if (typeof process === 'undefined') {
  window.process = {
    env: {},
    version: '',
    versions: {},
    platform: 'browser',
    nextTick: (fn) => setTimeout(fn, 0)
  };
}

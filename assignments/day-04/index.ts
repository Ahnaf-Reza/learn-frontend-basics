/**
 * 1. DeepPartial
 * Make every property recursively optional.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

/**
 * 2. EventBus
 * A type-safe event bus.
 * Generic T represents the Event Map: { 'login': { userId: string }, 'logout': void }
 */
export class EventBus<T extends Record<string, any>> {
  // Store listeners
  private listeners: { [K in keyof T]?: Array<(payload: T[K]) => void> } = {};

  on<K extends keyof T>(event: K, callback: (payload: T[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit<K extends keyof T>(event: K, payload: T[K]): void {
    const callbacks = this.listeners[event];
    if (callbacks) {
      callbacks.forEach((callback: (payload: T[K]) => void) => callback(payload));
    }
  }
}


/**
 * 3. Type Guards
 * Implement a reliable check.
 */
export function isError(x: unknown): x is Error {
  return x instanceof Error;
}


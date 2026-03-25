/**
 * Lightweight Dependency Injection (DI) Container
 * Allows controlled registration and resolution of services.
 *
 * Supports:
 *  - Singleton lifetime: one shared instance per container
 *  - Transient lifetime: new instance on every resolve
 *  - Constructor injection via a static `dependencies` array on the class
 *  - Basic circular dependency detection
 *
 * Usage:
 *   container.register("logger", Logger, { singleton: true });
 *   container.register("userService", UserService, { singleton: true });
 *   const svc = container.resolve("userService");
 *
 * Constructor injection example:
 *   class UserService {
 *     static dependencies = ["logger"];
 *     constructor(logger) { this.logger = logger; }
 *   }
 */

class Container {
  constructor() {
    /**
     * Stores registration metadata keyed by service name.
     * Shape: Map<string, { implementation: Function, options: object }>
     */
    this._registrations = new Map();

    /**
     * Caches singleton instances keyed by service name.
     * Shape: Map<string, object>
     */
    this._instances = new Map();
  }

  /**
   * Register a service with the container.
   *
   * @param {string}   name           - Unique service identifier
   * @param {Function} implementation - Constructor function / class
   * @param {object}   [options]
   * @param {boolean}  [options.singleton=false] - True = shared instance; false = new instance each resolve
   * @throws {Error} If name or implementation is invalid, or service is already registered
   */
  register(name, implementation, options = {}) {
    if (!name || typeof name !== 'string') {
      throw new Error("Container.register: 'name' must be a non-empty string.");
    }

    if (typeof implementation !== 'function') {
      throw new Error(
        `Container.register: 'implementation' for "${name}" must be a constructor function or class.`,
      );
    }

    if (this._registrations.has(name)) {
      throw new Error(
        `Container.register: service "${name}" is already registered. Use a different name or deregister it first.`,
      );
    }

    this._registrations.set(name, {
      implementation,
      options: { singleton: false, ...options },
    });
  }

  /**
   * Resolve (instantiate) a registered service by name.
   * Recursively resolves constructor dependencies declared via a static
   * `dependencies` array on the implementation class.
   *
   * @param {string} name          - The service identifier to resolve
   * @param {Set}    [_resolving]  - Internal set used to detect circular deps (do not pass manually)
   * @returns {object} The resolved service instance
   * @throws {Error} If the service is not registered or a circular dependency is detected
   */
  resolve(name, _resolving = new Set()) {
    if (!this._registrations.has(name)) {
      throw new Error(
        `Container.resolve: service "${name}" is not registered.`,
      );
    }

    if (_resolving.has(name)) {
      const chain = [..._resolving, name].join(' → ');
      throw new Error(
        `Container.resolve: circular dependency detected: ${chain}`,
      );
    }

    const { implementation, options } = this._registrations.get(name);

    // Return cached singleton if available
    if (options.singleton && this._instances.has(name)) {
      return this._instances.get(name);
    }

    // Resolve constructor dependencies declared on the class
    const depNames = implementation.dependencies ?? [];
    _resolving.add(name);
    const resolvedDeps = depNames.map((depName) =>
      this.resolve(depName, _resolving),
    );
    _resolving.delete(name);

    const instance = new implementation(...resolvedDeps);

    if (options.singleton) {
      this._instances.set(name, instance);
    }

    return instance;
  }
}

module.exports = Container;

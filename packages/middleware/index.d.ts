
export declare type Middleware<T> = (input: T, next: () => any) => any;

export declare type ComposedMiddleware<T> = (input: T, done?: () => any) => Promise<any>;

export declare class Dispatcher<T> {
  /**
   * Use a middleware
   *
   * @param fn The middleware function
   * @public
   */
  use(fn: Middleware<T>): this;
  /**
   * Dispatch the given input and return the output
   *
   * @param input
   * @public
   */
  dispatch(input: T): Promise<any>;
}

/**
 * Compose the given middlewares
 *
 * @param fns An array of middleware functions
 * @public
 */
export declare function compose<T>(fns: Middleware<T>[]): ComposedMiddleware<T>;

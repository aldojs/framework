
export type Middleware<T> = (context: T, next: () => any) => any;
export type ComposedMiddleware<T> = (context: T, done?: () => any) => Promise<any>;

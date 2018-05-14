
import { Request, ResponseFactory } from 'aldo-http'

export interface Context {
  request: Request
  response: ResponseFactory
  [field: string]: any
}

export class ContextFactory {
  /**
   * The context store
   * 
   * @private
   */
  private _store: Context

  /**
   * Create a new context factory
   *
   * @constructor
   */
  constructor () {
    this._store = Object.create(null)
  }

  /**
   * Extend the context store by adding shared properties
   *
   * @param prop
   * @param value
   * @public
   */
  set (prop: string, value: any) {
    Reflect.defineProperty(this._store, prop, {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    })
  }

  /**
   * Extend the context store by adding per instance property
   *
   * @param prop
   * @param fn
   * @public
   */
  bind (prop: string, fn: (ctx: Context) => any) {
    var field = `_${prop}`

    Reflect.defineProperty(this._store, prop, {
      configurable: true,
      enumerable: true,
      get () {
        if ((this as Context)[field] === undefined) {
          // private property
          Reflect.defineProperty(this, field, {
            value: fn(this as Context)
          })
        }

        return (this as Context)[field]
      }
    })
  }

  /**
   * Get a value from the context store
   *
   * @param prop
   * @public
   */
  get (prop: string): any {
    return this._store[prop]
  }

  /**
   * Check if the prop is defined in the context store
   *
   * @param prop
   * @public
   */
  has (prop: string): boolean {
    return prop in this._store
  }

  /**
   * Create a new context store
   *
   * @public
   */
  create (request: Request, response: ResponseFactory): Context {
    let ctx = Object.create(this._store)

    ctx.response = response
    ctx.request = request

    return ctx
  }
}

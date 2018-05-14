
import * as assert from 'assert'
import is from '@sindresorhus/is'
import * as createDebugger from 'debug'
import { Dispatcher } from 'aldo-middleware'
import { ContextFactory, Context } from './context'
import { Request, Response, ResponseFactory, createServer, Server } from 'aldo-http'

const debug = createDebugger('aldo:application')

export type Middleware = (ctx: Context, next: () => any) => any

export default class Application {
  /**
   * The context factory
   */
  private _context = new ContextFactory()

  /**
   * The middleware dispatcher
   */
  private _dispatcher = new Dispatcher<Context>()

  /**
   * Use a middleware
   *
   * @param fn
   */
  public use (fn: Middleware) {
    assert(typeof fn === 'function', `Expect a function but got: ${is(fn)}.`)
    debug(`use middleware: ${fn.name || '<anonymous>'}`)
    this._dispatcher.use(fn)
    return this
  }

  /**
   * Return a request handler
   */
  public callback (): (req: Request, res: ResponseFactory) => Promise<Response> {
    return (request, response) => {
      let ctx = this._context.create(request, response)

      debug(`dispatching: ${request.method} ${request.url}`)

      return this._dispatcher.dispatch(ctx)
    }
  }

  /**
   * Extend the app context by adding per instance property
   *
   * @param prop
   * @param fn
   */
  public bind (prop: string, fn: (ctx: Context) => any) {
    assert(typeof fn === 'function', `Expect a function but got: ${is(fn)}.`)
    debug(`set a per-request context property: ${prop}`)
    this._context.bind(prop, fn)
    return this
  }

  /**
   * Extend the app context by adding shared properties
   *
   * @param prop
   * @param value
   */
  public set (prop: string, value: any) {
    debug(`set a shared context property: ${prop}`)
    this._context.set(prop, value)
    return this
  }

  /**
   * Get a value from the app context
   *
   * @param prop
   */
  public get (prop: string): any {
    return this._context.get(prop)
  }

  /**
   * Check if the prop is defined in the app context
   *
   * @param prop
   */
  public has (prop: string): boolean {
    return this._context.has(prop)
  }

  /**
   * Shorthand for:
   *
   *     http.createServer(app.callback()).listen(...args)
   */
  // public listen (portOrOptions: number): Server {
  //   return createServer(this.callback()).start(portOrOptions)
  // }
}

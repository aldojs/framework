
import * as assert from 'assert'
import is from '@sindresorhus/is'
import * as createDebugger from 'debug'
import { Request, createServer, Server } from 'aldo-http'
import { ContextFactory, Context as BaseContext } from './context'
import { Dispatcher, Middleware as BaseMiddleware } from 'aldo-middleware'

const debug = createDebugger('aldo:application')

export type Middleware = BaseMiddleware<Context>

export interface Context extends BaseContext {
  request: Request
}

export class Application {
  /**
   * The context factory
   * 
   * @private
   */
  private _context = new ContextFactory<Context>()

  /**
   * The middleware dispatcher
   * 
   * @private
   */
  private _dispatcher = new Dispatcher<Context>()

  /**
   * Use a middleware
   *
   * @param fn
   * @public
   */
  public use (fn: Middleware) {
    assert(typeof fn === 'function', `Expect a function but got: ${is(fn)}.`)
    debug(`use middleware: ${fn.name || '<anonymous>'}`)
    this._dispatcher.use(fn)
    return this
  }

  /**
   * Handle the incoming request
   * 
   * @param request
   * @public
   */
  public handle (request: Request): Promise<any> {
    let ctx = this._createContext(request)

    debug(`dispatching: ${request.method} ${request.url}`)

    return this._dispatcher.dispatch(ctx)
  }

  /**
   * Extend the app context by adding per instance property
   *
   * @param prop
   * @param fn
   * @public
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
   * @public
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
   * @public
   */
  public get (prop: string): any {
    return this._context.get(prop)
  }

  /**
   * Check if the prop is defined in the app context
   *
   * @param prop
   * @public
   */
  public has (prop: string): boolean {
    return this._context.has(prop)
  }

  /**
   * Shorthand for:
   *
   *     createServer(app).start(...arguments)
   * 
   * @public
   */
  public async start (...args: any[]): Promise<Server> {
    let server = createServer(this)

    await server.start(...args)

    return server
  }

  private _createContext (request: Request): Context {
    let ctx = this._context.create()

    // add the incoming request
    ctx.request = request

    return ctx
  }
}

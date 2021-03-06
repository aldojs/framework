
import * as assert from 'assert'
import is from '@sindresorhus/is'
import { compose } from './composer'
import { Middleware, ComposedMiddleware } from './types'

export class Dispatcher<T> {
  /**
   * The middleware stack
   * 
   * @private
   */
  private _middlewares: Middleware<T>[] = []

  /**
   * The composed middlewares
   * 
   * @private
   */
  private _dispatch?: ComposedMiddleware<T>

  /**
   * Use a middleware
   * 
   * @param fn The middleware function
   * @public
   */
  public use (fn: Middleware<T>): this {
    assert(is.function_(fn), `Expect a function but got: "${is(fn)}"`)
    this._middlewares.push(fn)
    return this
  }

  /**
   * Dispatch the given input and return the output
   * 
   * @param input
   * @public
   */
  public dispatch (input: T): Promise<any> {
    if (!this._dispatch) {
      this._dispatch = compose(this._middlewares)
    }

    return this._dispatch(input)
  }
}

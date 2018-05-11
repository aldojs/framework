
import * as assert from 'assert'
import is from '@sindresorhus/is'
import { Middleware, ComposedMiddleware } from './types'

/**
 * Compose the given middlewares
 * 
 * @param fns An array of middleware functions
 * @public
 */
export function compose<T> (fns: Middleware<T>[]): ComposedMiddleware<T> {
  assert(is.array(fns), `Expect an array of functions but got "${is(fns)}"`)

  for (let fn of fns) {
    assert(is.function_(fn), `Expect a function but got "${is(fn)}"`)
  }

  return (arg: T, done: (() => any) | undefined) => {
    var i = 0

    async function next (): Promise<any> {
      var fn = fns[i++]

      if (fn) return fn(arg, next)

      if (done) return done()
    }

    return next()
  }
}

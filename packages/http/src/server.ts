
import * as net from 'net'
import * as http from 'http'
import * as https from 'https'
import is from '@sindresorhus/is'
import { Request } from './request'
import { setImmediate } from 'timers'
import { Response } from './response'

export interface RequestHandler {
  (request: Request, response: (content?: any) => Response): any
}

export type EventListener = (...args: any[]) => any

export class Server {
  /**
   * Initialize a `Server` instance
   * 
   * @param native The native HTTP(S) server
   */
  public constructor (public native: http.Server | https.Server) {
  }

  /**
   * Add a `listener` for the given `event`
   * 
   * @param event The event name
   * @param fn The event listener
   * @public
   */
  public on (event: 'request', fn: RequestHandler): this
  public on (event: string, fn: EventListener): this
  public on (event: string, fn: any) {
    if (event === 'request') fn = this._wrap(fn)

    this.native.on(event, _defer(fn))

    return this
  }

  /**
   * Start a server listening for requests
   * 
   * @public
   */
  public start (portOrOptions: number | net.ListenOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // attach the error listener
      this.native.once('error', reject)

      // listening
      this.native.listen(portOrOptions, () => {
        // remove the unecessary error listener
        this.native.removeListener('error', reject)

        // resolve the promise
        resolve()
      })
    })
  }

  /**
   * Stops the server from accepting new requests
   * 
   * @public
   */
  public stop (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.native.close((err: any) => {
        err ? reject(err) : resolve()
      })
    })
  }

  /**
   * Wrap the request event listener
   * 
   * @param fn The request event listener
   * @private
   */
  private _wrap (fn: RequestHandler): (...args: any[]) => any {
    return (req: http.IncomingMessage, res: http.ServerResponse) => {
      this._getResponse(fn, req).then((response) => response.send(res))
    }
  }

  /**
   * Invoke the request handler and return the response
   * 
   * @param fn The request handler
   * @param req The incoming message
   * @private
   */
  private async _getResponse (fn: RequestHandler, req: http.IncomingMessage) {
    try {
      let output = await fn(this._makeRequest(req), Response.from)

      if (output instanceof Response) return output

      return Response.from(output)
    } catch (err) {
      // normalize
      if (! (err instanceof Error)) {
        err = new Error(`Non-error thrown: "${is(err)}"`)
      }

      // delegate
      this.native.emit('error', err)

      let status = err.status || err.statusCode
      let body = err.expose ? err.message : 'Internal Server Error'

      // support ENOENT
      if (err.code === 'ENOENT') status = 404

      return Response.from(body)
        .status(_isValid(status) ? status : 500)
        .type('text/plain; charset=utf-8')
        .set(err.headers || {})
    }
  }

  /**
   * Create a request instance
   * 
   * @private
   */
  private _makeRequest (req: http.IncomingMessage): Request {
    return Request.from(req)
  }
}

/**
 * Defer the function invocation to the next tick
 * 
 * @param fn The event listener
 * @private
 */
function _defer (fn: EventListener) {
  return (...args: any[]) => setImmediate(fn, ...args)
}

/**
 * Check if the status code is a valid number
 * 
 * @param status
 * @private
 */
function _isValid (status: any): status is number {
  return typeof status === 'number' && status >= 100 && status <= 999
}

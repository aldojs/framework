
import * as http from 'http'
import * as https from 'https'
import { Server, RequestHandler } from './server'

/**
 * Create a HTTP(S) Server
 * 
 * @param fn
 * @param options
 */
export function createServer (fn: RequestHandler, options: { tls?: https.ServerOptions } = {}): Server {
  return new Server(_createNativeServer(options.tls)).on('request', fn)
}

/**
 * Create native server
 * 
 * @param tls Secure server options
 * @private
 */
function _createNativeServer (tls?: https.ServerOptions): http.Server | https.Server {
  return tls ? https.createServer(tls) : http.createServer()
}

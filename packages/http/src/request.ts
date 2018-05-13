
import { Socket } from 'net'
import { Readable } from 'stream'
import * as parseUrl from 'parseurl'
import { is as typeis } from 'type-is'
import { IncomingHttpHeaders, IncomingMessage } from 'http'

export class Request {
  /**
   * The URL query string
   * 
   * @public
   */
  public querystring: string = ''

  /**
   * The incoming request stream
   * 
   * @public
   */
  public stream?: Readable

  /**
   * The connection socket
   * 
   * @public
   */
  public connection?: Socket

  /**
   * Returns true when requested with TLS, false otherwise
   * 
   * @public
   */
  public secure = false

  /**
   * Contruct a new request instance
   * 
   * @param url The URL path name
   * @param method The request method
   * @param headers The request headers
   * @param body The request parsed body
   */
  public constructor (
    public url: string,
    public method: string,
    public headers: IncomingHttpHeaders = {},
    public body: any = null
  ) {
  }

  /**
   * Create a response instance from the given content
   * 
   * @param
   * @public
   * @static
   */
  public static from (req: IncomingMessage): Request {
    let { pathname = '/', query = '' } = parseUrl(req) || {}
    let { method = 'GET', headers, socket } = req
    let instance = new Request(pathname, method, headers)

    instance.secure = Boolean((socket as any).encrypted)
    instance.querystring = query as string
    instance.connection = socket
    instance.stream = req

    return instance
  }

  /**
   * The request mime type, void of parameters such as "charset", or undefined
   * 
   * @public
   */
  public get type (): string | undefined {
    let type = this.headers['content-type'] as string

    if (type) return type.split(';', 1)[0].trim()
  }

  /**
   * The `Content-Length` when present
   * 
   * @public
   */
  public get length (): number | undefined {
    let len = this.headers['content-length'] as string

    if (len) return Number(len)
  }

  /**
   * Returns the request header value
   * 
   * Case insensitive name matching.
   * 
   * The `Referrer` header field is special-cased,
   * both `Referrer` and `Referer` are interchangeable.
   *
   * Examples:
   *
   *     this.get('Content-Type')
   *     // => "text/plain"
   *
   *     this.get('content-type')
   *     // => "text/plain"
   *
   *     this.get('Something')
   *     // => undefined
   * 
   * @param header
   */
  public get (header: string): string | string[] | undefined {
    switch (header = header.toLowerCase()) {
      case 'referer':
      case 'referrer':
        return this.headers['referrer'] || this.headers['referer']

      default:
        return this.headers[header]
    }
  }

  /**
   * Check if the header is present
   * 
   * Case insensitive name matching.
   * 
   * The `Referrer` header field is special-cased,
   * both `Referrer` and `Referer` are interchangeable.
   * 
   * Examples:
   * 
   *     this.has('Content-Type')
   *     // => true
   *
   *     this.has('content-type')
   *     // => true
   *
   *     this.has('Something')
   *     // => false
   * 
   * @param header
   */
  public has (header: string): boolean {
    return this.get(header) !== undefined
  }

  /**
   * Check if the incoming request contains the "Content-Type"
   * header field, and it contains any of the give mime `type`s.
   * 
   * It returns the first matching type or false otherwise
   * 
   * Examples:
   * 
   *     // With Content-Type: text/html charset=utf-8
   *     this.is('html') // => 'html'
   *     this.is('text/html') // => 'text/html'
   *     this.is('text/*', 'application/json') // => 'text/html'
   *
   *     // When Content-Type is application/json
   *     this.is('json', 'urlencoded') // => 'json'
   *     this.is('application/json') // => 'application/json'
   *     this.is('html', 'application/*') // => 'application/json'
   *
   *     this.is('html') // => false
   * 
   * @param types
   */
  public is (...types: string[]): string | false {
    return typeis(this.type as string, types)
  }
}


/// <reference types="node" />

import * as net from 'net';
import * as http from 'http';
import * as https from 'https';
import * as stream from 'stream';

export declare class Request {
  /**
   * The URL path name
   */
  url: string;

  /**
   * The request method
   */
  method: string;

  /**
   * The request headers
   */
  headers: http.IncomingHttpHeaders;

  /**
   * The request parsed body
   */
  body: any;

  /**
   * The URL query string
   *
   * @public
   */
  querystring: string;

  /**
   * The incoming request stream
   *
   * @public
   */
  stream?: stream.Readable;

  /**
   * The connection socket
   *
   * @public
   */
  connection?: net.Socket;

  /**
   * Returns true when requested with TLS, false otherwise
   *
   * @public
   */
  secure: boolean;

  /**
   * The request mime type, void of parameters such as "charset", or undefined
   *
   * @public
   */
  readonly type: string | undefined;

  /**
   * The `Content-Length` when present
   *
   * @public
   */
  readonly length: number | undefined;

  /**
   * Contruct a new request instance
   *
   * @param url The URL path name
   * @param method The request method
   * @param headers The request headers
   * @param body The request parsed body
   */
  constructor(url: string, method: string, headers?: http.IncomingHttpHeaders, body?: any);

  /**
   * Create a response instance from the given content
   *
   * @param
   * @public
   * @static
   */
  static from(req: http.IncomingMessage): Request;

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
  get(header: string): string | string[] | undefined;

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
  has(header: string): boolean;

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
  is(...types: string[]): string | false;
}

export declare class Response {
  /**
   * The response status code
   */
  statusCode: number;

  /**
   * The response status message
   */
  statusMessage: string;

  /**
   * The response body
   */
  body: any;

  /**
   * The response headers
   */
  headers: http.OutgoingHttpHeaders;

  /**
   * Initialize a new response builder
   *
   * @param content
   */
  constructor(content?: any);

  /**
   * Create a response instance from the given content
   *
   * @param content The response body
   * @public
   * @static
   */
  static from(content?: any): Response;

  /**
   * Set the response status code
   *
   * @param code The status code
   * @param message The status message
   */
  status(code: number, message?: string): this;

  /**
   * Set `Content-Type` response header.
   *
   * Will add the the charset if not present.
   *
   * Examples:
   *
   *     response.type('application/json')
   *     response.type('.html')
   *     response.type('html')
   *     response.type('json')
   *     response.type('png')
   */
  type(value: string): this;

  /**
   * Set `Content-Length` reponse header
   */
  length(value: number): this;

  /**
   * Set the `Last-Modified` response header
   */
  lastModified(value: string | Date): this;

  /**
   * Set the `ETag` of the response.
   *
   * This will normalize the quotes if necessary.
   *
   * Examples:
   *
   *     response.etag('md5hashsum')
   *     response.etag('"md5hashsum"')
   *     response.etag('W/"123456789"')
   */
  etag(value: string): this;

  /**
   * Set the `Location` response header
   */
  location(url: string): this;

  /**
   * Append `field` to the `Vary` header
   */
  vary(...headers: string[]): this;

  /**
   * Append to the `Set-Cookie` header
   */
  setCookie(cookie: string): this;

  /**
   * Check if the incoming request contains the "Content-Type"
   * header field, and it contains any of the give mime `type`s.
   *
   * It returns the first matching type or false otherwise.
   *
   * Pretty much the same as `Request.is()`
   *
   * @param types
   */
  is(...types: string[]): string | false;

  /**
   * Get the response header if present, or undefined
   *
   * @param header
   */
  get(header: string): string | number | string[] | undefined;

  /**
   * Set the response header, or pass an object of header fields.
   *
   * Examples:
   *
   *    response.set({ 'Accept': 'text/plain', 'X-API-Key': 'tobi' })
   *
   * @param headers
   */
  set(headers: {
      [field: string]: string | number | string[];
  }): this;

  /**
   * Set the response header, or pass an object of header fields.
   *
   * Examples:
   *
   *    response.set('Foo', ['bar', 'baz'])
   *    response.set('Accept', 'application/json')
   *
   * @param header
   * @param value
   */
  set(header: string, value: string | number | string[]): this;

  /**
   * Append additional header name
   *
   * Examples:
   *
   *    this.append('Link', ['<http://localhost/>', '<http://localhost:3000/>'])
   *    this.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly')
   *    this.append('Warning', '199 Miscellaneous warning')
   *
   * @param header
   * @param value
   */
  append(header: string, value: string | string[]): this;

  /**
   * Check if response header is defined
   *
   * @param header
   */
  has(header: string): boolean;

  /**
   * Remove the response header
   *
   * @param header
   */
  remove(header: string): this;

  /**
   * Reset all response headers
   *
   * @param headers
   */
  reset(headers?: {
      [field: string]: string | number | string[];
  }): this;

  /**
   * Send the response and terminate the stream
   *
   * @param res The response stream
   * @public
   */
  send(res: http.ServerResponse): void;
}

/**
 * Create a HTTP(S) Server
 *
 * @param fn The request listener
 * @param options
 */
export declare function factory(fn: RequestHandler, options?: {
  tls?: https.ServerOptions;
}): Server;

export interface RequestHandler {
  (request: Request, response: (content?: any) => Response): any;
}

export declare type EventListener = (...args: any[]) => any;

export declare class Server {
  /**
   * The native HTTP(S) server
   */
  native: http.Server | https.Server;

  /**
   * Initialize a `Server` instance
   *
   * @param native The native HTTP(S) server
   */
  constructor(native: http.Server | https.Server);

  /**
   * Add a `listener` for the given `event`
   *
   * @param event The event name
   * @param fn The event listener
   * @public
   */
  on(event: 'request', fn: RequestHandler): this;
  on(event: string, fn: EventListener): this;

  /**
   * Start a server listening for requests
   *
   * @public
   */
  start(portOrOptions: number | net.ListenOptions): Promise<void>;

  /**
   * Stops the server from accepting new requests
   *
   * @public
   */
  stop(): Promise<void>;
}

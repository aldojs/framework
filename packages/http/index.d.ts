
/// <reference types="node" />

import * as net from 'net';
import * as http from 'http';
import * as https from 'https';
import * as stream from 'stream';

export type Request = http.IncomingMessage;

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
   * Get the response header if present, or undefined
   *
   * @param header
   */
  get(header: string): string | number | string[] | undefined;

  /**
   * Pass an object of header fields
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
   * Set the response header
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

export type RequestHandler = (request: Request) => any;

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
  start(portOrOptions?: number | net.ListenOptions): Promise<Server>;

  /**
   * Stops the server from accepting new requests
   *
   * @public
   */
  stop(): Promise<void>;
}

export interface createServerOptions {
  tls?: https.ServerOptions
}

/**
 * Create a HTTP(S) Server
 * 
 * @param options Server options
 * @param fn The request handler
 * @public
 */
export function createServer (options: createServerOptions, fn: RequestHandler): Server;

/**
 * Create a HTTP(S) Server
 * 
 * @param options Server options
 */
export function createServer (options: createServerOptions): Server;

/**
 * Create a HTTP(S) Server
 * 
 * @param fn The request handler
 */
export function createServer (fn: RequestHandler): Server;

/**
 * Create a HTTP(S) Server
 */
export function createServer (): Server;

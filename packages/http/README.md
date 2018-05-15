
`Aldo-http` is an enhanced HTTP `createServer` module for Node.js.
It provides a new interface to handle the incoming requests.

`Aldo-http` exposes a [createServer](#createserver) function to create both HTTP and HTTPS servers, a [Server](#server) decorator, and a [Response](#response) class to handle responses.

## createServer

```ts
declare function createServer (options: Options, handler: RequestHandler): Server;
declare function createServer (handler: RequestHandler): Server;
declare function createServer (options: Options): Server;
declare function createServer (): Server;

declare interface Options {
  tls?: https.ServerOptions;
}
```

### HTTP server

```js
const { createServer } = require('aldo-http')

// make a new HTTP server
const server = createServer(() => 'Hello world!')

(async () => {
  try {
    // start listening on port 3000
    await server.start(3000)

    console.log('The server is started.')
  }
  catch (error) {
    // log the error
    console.error(error)
  }
})()
```

### HTTPS server

```js
const { readFileSync } = require('fs')
const { createServer } = require('aldo-http')

const options = {
  tls: {
    key: readFileSync('path/to/key/file.pem'),
    cert: readFileSync('path/to/cert/file.pem')
    
    // see `https.createServer()` for more options
  }
}

// make a HTTPS server using the TLS options
const server = createServer(options, () => 'Hello world!')

(async () => {
  // start listening on port 443
  await server.start({
    port: 443,
    exclusive: true,
    host: 'example.com'
  })
})()
```

### Request handler

The `request` event handler could be a common or an async function, or an object with a `handle` method.

Each handler will receive the `http.IncomingMessage` object as a single input, and could return anything as a response.

```ts
declare type RequestListener = (request: http.IncomingMessage) => any;
```
> Responses could be `strings`, `buffers`, `streams`, [response](#response) instances. `null` and `undefined` are considered as empty response (status 204), anything else will be serialized as `JSON`.

## Server

## Response

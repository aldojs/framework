
import 'mocha'
import * as assert from 'assert'
import { createRequest } from './_support'

describe('request.headers', () => {
  it('should return the request headers object', () => {
    const request = createRequest()

    assert(request.headers, "Should be present")
    assert.deepEqual(request.headers, {}, "Should equal an empty object")
  })

  it('should set the request header object', () => {
    const headers = {
      'X-Custom-Headerfield': 'Its one header, with headerfields'
    }

    const request = createRequest({ headers })

    assert.deepEqual(request.headers, headers, "Should equal the passed headers")
  })
})
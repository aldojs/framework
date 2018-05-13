
import 'mocha'
import * as assert from 'assert'
import { createRequest } from './_support'

describe('request.type', () => {
  it('should return type void of parameters', () => {
    const request = createRequest({
      headers: {
        'content-type': 'text/html; charset=utf-8'
      }
    })

    assert.equal(request.type, 'text/html')
  })

  describe('with no type present', () => {
    it('should return `undefined`', () => {
      const request = createRequest()

      assert.equal(request.type, undefined)
    })
  })
})


import 'mocha'
import * as assert from 'assert'
import { createRequest } from './_support'

describe('request.length', () => {
  it('should return the `content-length` value', () => {
    const request = createRequest({
      headers: {
        'content-length': '10'
      }
    })

    assert.notEqual(request.length, undefined, "Should be defined")
    assert.equal(typeof request.length, 'number', "Should be casted to number")
    assert.equal(request.length, 10, "Should equal 10")
  })

  describe('with no `content-length` header present', () => {
    it('should return `undefined`', () => {
      const request = createRequest()
  
      assert.equal(request.length, undefined, "Should equal undefined")
    })
  })
})

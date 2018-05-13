
import 'mocha'
import * as assert from 'assert'
import { createRequest } from './_support'

describe('request.get(header)', () => {
  it('should return the header value', () => {
    const request = createRequest({
      headers: {
        'host': 'http://example.com'
      }
    })

    assert.equal(request.get('HOST'), 'http://example.com')
    assert.equal(request.get('Host'), 'http://example.com')
    assert.equal(request.get('host'), 'http://example.com')
  })

  it('Should handle `referer` and `referrer`', () => {
    const request = createRequest({
      headers: {
        'referer': 'http://example.com'
      }
    })

    assert.equal(request.get('referer'), 'http://example.com')
    assert.equal(request.get('Referrer'), 'http://example.com')
  })
})

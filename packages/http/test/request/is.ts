
import 'mocha'
import * as assert from 'assert'
import { createRequest } from './_support'

describe('req.is(type)', () => {
  it('should ignore params', () => {
    const request = createRequest({
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'transfer-encoding': 'chunked'
      }
    })

    assert.equal(request.is('text/*'), 'text/html')
  })

  describe('when no content type is given', () => {
    it('should return false', () => {
      const request = createRequest({
        headers: {
          'transfer-encoding': 'chunked'
        }
      })

      assert.equal(request.is(), false)
      assert.equal(request.is('image/*'), false)
      assert.equal(request.is('text/*', 'image/*'), false)
    })
  })

  describe('when no given types', () => {
    it('should return the mime type', () => {
      const request = createRequest({
        headers: {
          'transfer-encoding': 'chunked',
          'content-type': 'image/png'
        }
      })

      assert.equal(request.is(), 'image/png')
    })
  })

  describe('when given one type', () => {
    it('should return the type or false', () => {
      const request = createRequest({
        headers: {
          'transfer-encoding': 'chunked',
          'content-type': 'image/png'
        }
      })

      assert.equal(request.is('png'), 'png')
      assert.equal(request.is('.png'), '.png')
      assert.equal(request.is('image/png'), 'image/png')
      assert.equal(request.is('image/*'), 'image/png')
      assert.equal(request.is('*/png'), 'image/png')

      assert.equal(request.is('jpeg'), false)
      assert.equal(request.is('.jpeg'), false)
      assert.equal(request.is('image/jpeg'), false)
      assert.equal(request.is('text/*'), false)
      assert.equal(request.is('*/jpeg'), false)
    })
  })

  describe('when given multiple types', () => {
    it('should return the first match or false', () => {
      const request = createRequest({
        headers: {
          'transfer-encoding': 'chunked',
          'content-type': 'image/png'
        }
      })

      assert.equal(request.is('png'), 'png')
      assert.equal(request.is('.png'), '.png')
      assert.equal(request.is('text/*', 'image/*'), 'image/png')
      assert.equal(request.is('image/*', 'text/*'), 'image/png')
      assert.equal(request.is('image/*', 'image/png'), 'image/png')
      assert.equal(request.is('image/png', 'image/*'), 'image/png')

      assert.equal(request.is('jpeg'), false)
      assert.equal(request.is('.jpeg'), false)
      assert.equal(request.is('text/*', 'application/*'), false)
      assert.equal(request.is('text/html', 'text/plain', 'application/json; charset=utf-8'), false)
    })
  })

  describe('when `Content-Type: application/x-www-form-urlencoded`', () => {
    it('should match "urlencoded"', () => {
      const request = createRequest({
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'transfer-encoding': 'chunked'
        }
      })

      assert.equal(request.is('urlencoded'), 'urlencoded')
      assert.equal(request.is('json', 'urlencoded'), 'urlencoded')
      assert.equal(request.is('urlencoded', 'json'), 'urlencoded')
    })
  })
})

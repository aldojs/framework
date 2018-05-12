
import 'mocha'
import * as assert from 'assert'
import { compose } from '../src/composer'

describe('middleware composition utility', () => {
  describe('compose(fns)', () => {
    it('should return a function', () => {
      assert(typeof compose([]) === 'function')
    })
  
    it('should only accept an array', () => {
      assert.throws(() => compose(undefined as any))
      assert.throws(() => compose(null as any))
      assert.throws(() => compose({} as any))
      assert.doesNotThrow(() => compose([]))
    })
  
    it('should only accept an array of functions', () => {
      assert.doesNotThrow(() => compose([
        () => {}, () => {}, () => {}
      ]))
  
      assert.throws(() => compose([
        () => {}, null as any, () => {}
      ]))
    })
  })
})

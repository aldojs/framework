
import 'mocha'
import * as assert from 'assert'
import { Dispatcher } from '../src/dispatcher'

describe('middleware dispatching utility', () => {
  let dispatcher: Dispatcher<{ [x: string]: any }>

  beforeEach(() => {
    dispatcher = new Dispatcher()
  })

  describe('dispacher.use(fn)', () => {
    it('should only accept functions', () => {
      assert.doesNotThrow(() => dispatcher.use(() => {}))
      assert.throws(() => dispatcher.use(null as any))
      assert.throws(() => dispatcher.use(123 as any))
    })
  })

  describe('dispatcher.dispatch(input)', () => {
    it('should work', async () => {
      dispatcher.use((_, next) => next())
      dispatcher.use((_, next) => next())
      dispatcher.use((_, next) => 123)
  
      assert.equal(await dispatcher.dispatch({}), 123)
    })

    it('should work with zero handler', async () => {
      assert.equal(await dispatcher.dispatch({}), undefined)
    })

    it('should reject on errors in a handler', async () => {
      dispatcher.use((_, next) => next())
      dispatcher.use((_, next) => { throw new Error('Ooops!') })
      dispatcher.use((_, next) => assert.fail('should not call this handler'))
  
      try {
        await dispatcher.dispatch({})
  
        assert.fail('Promise was not rejected')
      } catch (e) {
        assert.equal(e.message, 'Ooops!')
      }
    })

    it('should pass the input to all handlers', async () => {
      let data = { foo: 'bar' }

      dispatcher.use((input, next) => {
        assert.deepEqual(input, data)
        return next()
      })
      
      dispatcher.use((input, next) => {
        assert.deepEqual(input, data)
        return next()
      })
  
      await dispatcher.dispatch(data)
    })
  })
})

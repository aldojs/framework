
import { Request } from '../../src'

const basic = {
  socket: {},
  headers: {},
}

export function createRequest (source: any = {}): Request {
  return Request.from({ ...basic, ...source })
}

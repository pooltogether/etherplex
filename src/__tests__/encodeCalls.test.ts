import { encodeCalls } from '../encodeCalls'

describe('encodeCalls', () => {
  it('should encode an address and calldata', () => {
    let call = {
      caller: null,
      fd: null,
      to: "0x6012fD40A66b993a28298838Be5C341956B5f7f4",
      data: "0x69e527da",
      resolve: jest.fn(),
      reject: jest.fn()
    }
    expect(encodeCalls([call])).toBeDefined()
  })
})
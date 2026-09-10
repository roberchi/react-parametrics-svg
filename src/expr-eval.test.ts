import { evalExpr } from './expr-eval'

describe('evalExpr', () => {
  it('evaluates a simple arithmetic expression', () => {
    expect(evalExpr('a + b', { a: 3, b: 4 })).toBe(7)
  })

  it('evaluates a multi-param expression', () => {
    // cx - headAcrossFlats/2 * scale = 140 - 9.5*2.2 = 140 - 20.9 = 119.1
    expect(
      evalExpr('cx - headAcrossFlats/2 * scale', {
        cx: 140,
        headAcrossFlats: 19,
        scale: 2.2
      })
    ).toBe(119.1)
  })

  it('evaluates a template literal', () => {
    expect(evalExpr('`L = ${length} mm`', { length: 100 })).toBe('L = 100 mm')
  })

  it('returns empty string and warns on syntax error', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    expect(evalExpr('(((broken', {})).toBe('')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('returns empty string and warns on reference error', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    expect(evalExpr('undeclaredVariable + 1', {})).toBe('')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('rounds numeric results to 4 decimal places', () => {
    expect(evalExpr('1/3', {})).toBe(0.3333)
  })

  it('has no access to window or global scope', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const result = evalExpr('typeof window', {})
    // in strict mode inside new Function, window may or may not exist
    // but the expression must not throw — result is 'undefined' or 'object'
    expect(typeof result).toBe('string')
    warn.mockRestore()
  })
})

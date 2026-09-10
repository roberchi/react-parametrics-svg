/**
 * Evaluates a JavaScript expression string in a closed parameter context.
 *
 * Each key of `params` becomes a named argument of the generated function,
 * so the expression can only access the supplied parameters — it has no
 * access to `window`, `document`, or any outer scope variable.
 *
 * Numeric results are rounded to 4 decimal places to avoid floating-point
 * noise in SVG attribute strings (e.g. 0.30000000000004 → 0.3).
 *
 * Known limitation: `new Function` is blocked by a strict CSP
 * (`script-src` without `'unsafe-eval'`). If that constraint applies,
 * replace the body of this function with a safe expression parser
 * (e.g. the `expr-eval` npm package) — the public contract does not change.
 *
 * @param expr   - JavaScript expression string, e.g. `"cx - width/2 * scale"`
 * @param params - Named parameter values available inside the expression
 * @returns      - Evaluated result as a number (rounded) or string
 */
export function evalExpr(
  expr: string,
  params: Record<string, string | number>
): string | number {
  const keys = Object.keys(params)
  const values = Object.values(params)
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(...keys, `"use strict"; return (${expr});`)
    const result = fn(...values)
    return typeof result === 'number'
      ? Math.round(result * 10000) / 10000
      : String(result)
  } catch (e) {
    console.warn(`[react-parametrics-svg] expr eval error: "${expr}"`, e)
    return ''
  }
}

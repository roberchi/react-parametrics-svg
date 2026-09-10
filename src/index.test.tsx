import { ReactParametricsSVG } from '.'

describe('ReactParametricsSVG', () => {
  it('is truthy', () => {
    expect(ReactParametricsSVG).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// Helpers for integration tests
// ---------------------------------------------------------------------------

/**
 * Builds a minimal SVG string with <param> and <paramMap> elements in <defs>,
 * plus target elements. Used to simulate what react-svg would inject into the DOM.
 */
function buildSvgString(
  defsContent: string,
  bodyContent: string = '<rect id="target" width="10" height="10"/>'
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs id="params-map">${defsContent}</defs>
    ${bodyContent}
  </svg>`
}

/**
 * Calls the private loadParamsAndUpdate method via a mounted instance.
 * We reach into the component by exploiting that ReactSVG calls afterInjection
 * after DOM injection — we simulate that by manually setting svg and calling
 * the private method through any-cast.
 */
function applyParamsMap(
  svgDom: SVGSVGElement,
  props: { params: any; paramsMap?: any[] }
) {
  const instance = new (ReactParametricsSVG as any)({
    src: '',
    ...props
  })
  instance.svg = svgDom
  instance.loadParamsAndUpdate({ src: '', ...props })
}

function parseSvg(svgString: string): SVGSVGElement {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgString, 'image/svg+xml')
  return doc.documentElement as unknown as SVGSVGElement
}

// ---------------------------------------------------------------------------
// Integration tests
// ---------------------------------------------------------------------------

describe('ReactParametricsSVG expr integration', () => {
  it('expr on attributeName: sets attribute to evaluated value', () => {
    const svg = parseSvg(
      buildSvgString(
        '<paramMap target="#target" expr="a * 2" attributeName="width"/>',
        '<rect id="target" width="0" height="10"/>'
      )
    )
    applyParamsMap(svg, { params: { a: 5 } })
    const rect = svg.getElementById('target')
    expect(rect?.getAttribute('width')).toBe('10')
  })

  it('expr on innerHTML: sets innerHTML when no attributeName', () => {
    // jsdom does not support setting plain text via innerHTML on SVG elements;
    // intercept the setter directly to capture the value without touching the DOM.
    const svg = parseSvg(
      buildSvgString(
        '<paramMap target="#label" expr="`val=${x}`"/>',
        '<text id="label"></text>'
      )
    )
    const label = svg.getElementById('label')!
    let capturedHTML = ''
    Object.defineProperty(label, 'innerHTML', {
      set: (v: string) => { capturedHTML = v },
      get: () => capturedHTML,
      configurable: true
    })
    applyParamsMap(svg, { params: { x: 42 } })
    expect(capturedHTML).toBe('val=42')
  })

  it('param still works unchanged', () => {
    const svg = parseSvg(
      buildSvgString(
        '<paramMap target="#target" param="color" attributeName="fill"/>',
        '<rect id="target" fill="blue"/>'
      )
    )
    applyParamsMap(svg, { params: { color: 'red' } })
    const rect = svg.getElementById('target')
    expect(rect?.getAttribute('fill')).toBe('red')
  })

  it('expr takes precedence over param when both are present', () => {
    const svg = parseSvg(
      buildSvgString(
        '<paramMap target="#target" param="a" expr="a * 10" attributeName="width"/>',
        '<rect id="target" width="0"/>'
      )
    )
    applyParamsMap(svg, { params: { a: 3 } })
    const rect = svg.getElementById('target')
    // expr wins: 3 * 10 = 30, not param value "3"
    expect(rect?.getAttribute('width')).toBe('30')
  })

  it('missing both param and expr: does not throw and does not modify element', () => {
    const svg = parseSvg(
      buildSvgString(
        '<paramMap target="#target" attributeName="width"/>',
        '<rect id="target" width="99"/>'
      )
    )
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => applyParamsMap(svg, { params: {} })).not.toThrow()
    const rect = svg.getElementById('target')
    // attribute must remain untouched
    expect(rect?.getAttribute('width')).toBe('99')
    warn.mockRestore()
  })

  it('backward compatibility: SVG with only param renders identically', () => {
    const svgString = buildSvgString(
      `<paramMap target="#target" param="corners" attributeName="rx"/>
       <paramMap target="#target" param="corners" attributeName="ry"/>`,
      '<rect id="target" rx="0" ry="0"/>'
    )
    const svg = parseSvg(svgString)
    applyParamsMap(svg, { params: { corners: '15' } })
    const rect = svg.getElementById('target')
    expect(rect?.getAttribute('rx')).toBe('15')
    expect(rect?.getAttribute('ry')).toBe('15')
  })
})

import _, { isEqual, union } from 'lodash'
import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Props, ReactSVG } from 'react-svg'
import { evalExpr } from './expr-eval'

/*

*/
interface IParam {
  name: string
  value: string | undefined | null
}

/**
 * Maps a parameter (or expression) to an SVG element attribute.
 *
 * Exactly one of `param` or `expr` must be present.
 * If both are present, `expr` takes precedence.
 */
interface IParamMap {
  /** CSS selector for the target SVG element(s). */
  target: string

  /**
   * Name of a parameter from the `params` object.
   * The value is written to `attributeName` as-is (scalar lookup).
   * Mutually exclusive with `expr`; `expr` takes precedence if both are set.
   */
  param?: string

  /**
   * JavaScript expression evaluated in the context of all current `params`.
   * Each key of `params` is available as a local variable.
   *
   * Examples:
   *   - `"cx - headWidth / 2 * scale"`
   *   - "`L = ${length} mm`"   (template literal)
   *   - `"Math.max(a, b)"`
   *
   * Takes precedence over `param` if both are present.
   */
  expr?: string

  /**
   * SVG attribute name to set on the target element(s).
   * If omitted, the value is written to `element.innerHTML` instead.
   */
  attributeName?: string | undefined | null
}
interface IParametricsSVGProps extends Props {
  params: IParam[] | any
  paramsMap?: IParamMap[]
}

export class ReactParametricsSVG extends React.Component<IParametricsSVGProps> {
  private svg: SVGSVGElement | undefined = undefined
  render() {
    const svgProps: Props = _.omit(this.props, ['params', 'paramsMap']) as Props
    return (
      <ReactSVG
        {...svgProps}
        ref=''
        afterInjection={(err, svg) => {
          this.svg = svg
          this.loadParamsAndUpdate(this.props)
          // eslint-disable-next-line no-unused-expressions
          this.props.afterInjection?.(err, svg)
        }}
      />
    )
  }

  shouldComponentUpdate(
    nextProps: IParametricsSVGProps,
    _nextState: any
  ): boolean {
    console.log('shouldComponentUpdate')
    if (isEqual(this.props, nextProps.src)) return false
    else if (
      !isEqual(this.props, nextProps.src) &&
      isEqual(this.props.params, nextProps.params) &&
      isEqual(this.props.paramsMap, nextProps.paramsMap)
    )
      return true
    else if (this.svg) {
      this.loadParamsAndUpdate(nextProps)
      return false
    } else return false
  }

  private loadParamsAndUpdate(props: IParametricsSVGProps) {
    const params = this.svg?.getElementsByTagName('param')
    var preparedParams: IParam[] = []
    if (params && params.length > 0) {
      // prepare params => filter param over definition of the param
      for (var i = 0; i < params.length; i++) {
        const paramName = params[i].attributes.getNamedItem('param')?.nodeValue
        if (paramName) {
          const defaultValue =
            params[i].attributes.getNamedItem('default')?.nodeValue
          const propParams = this.propsToIParamArray(props.params)
          const inParam = propParams.find((p) => p.name === paramName)
          inParam
            ? preparedParams.push(inParam)
            : preparedParams.push({ name: paramName, value: defaultValue })
        }
      }
    } else preparedParams = this.propsToIParamArray(props.params)

    // load map from definition
    const paramsMap = this.svg?.getElementsByTagName('paramMap')
    var map: IParamMap[] = []
    if (paramsMap) {
      for (i = 0; i < paramsMap.length; i++) {
        const targetId =
          paramsMap[i].attributes.getNamedItem('target')?.nodeValue
        const param = paramsMap[i].attributes.getNamedItem('param')?.nodeValue
        const expr = paramsMap[i].attributes.getNamedItem('expr')?.nodeValue
        const attributeName =
          paramsMap[i].attributes.getNamedItem('attributeName')?.nodeValue
        if (targetId && (param || expr))
          map.push({
            param: param ?? undefined,
            expr: expr ?? undefined,
            target: targetId,
            attributeName: attributeName
          })
      }
    }
    if (props.paramsMap) map = union(map, props.paramsMap) // merge maps

    // build a flat params record for expr evaluation
    const paramsRecord: Record<string, string | number> = {}
    preparedParams.forEach((p) => {
      if (p.name !== undefined && p.value !== undefined && p.value !== null) {
        const num = Number(p.value)
        paramsRecord[p.name] = isNaN(num) ? p.value : num
      }
    })

    // update SVG
    map.forEach((m) => {
      if (m.expr !== undefined) {
        // expr path: evaluate expression against all params
        const value = evalExpr(m.expr, paramsRecord)
        const syntheticParam: IParam = { name: '', value: String(value) }
        if (m.target.startsWith('#'))
          this.updateElement(
            this.svg?.getElementById(m.target.substring(1)),
            m,
            syntheticParam
          )
        else if (m.target.startsWith('.'))
          this.updateElements(
            this.svg?.getElementsByClassName(m.target.substring(1)),
            m,
            syntheticParam
          )
        else
          this.updateElements(
            this.svg?.getElementsByTagName(m.target),
            m,
            syntheticParam
          )
      } else if (m.param !== undefined) {
        // param path: scalar lookup (existing behaviour — unchanged)
        const param = preparedParams.find((p) => p.name === m.param)
        if (param) {
          if (m.target.startsWith('#'))
            this.updateElement(
              this.svg?.getElementById(m.target.substring(1)),
              m,
              param
            )
          else if (m.target.startsWith('.'))
            this.updateElements(
              this.svg?.getElementsByClassName(m.target.substring(1)),
              m,
              param
            )
          else
            this.updateElements(
              this.svg?.getElementsByTagName(m.target),
              m,
              param
            )
        }
      } else {
        console.warn(
          `[react-parametrics-svg] paramMap entry has neither param nor expr`,
          m
        )
      }
    })
  }

  private updateElements(
    elems: HTMLCollectionOf<Element> | undefined,
    map: IParamMap,
    param: IParam
  ) {
    if (elems)
      for (var i = 0; i < elems.length; i++)
        this.updateElement(elems[i], map, param)
  }

  private updateElement(
    elem: Element | undefined,
    m: IParamMap,
    param: IParam
  ) {
    if (elem && m.attributeName)
      elem.setAttribute(m.attributeName, param.value || '')
    else if (elem) elem.innerHTML = param.value || ''
  }

  propsToIParamArray(params: IParam[] | any | undefined | null): IParam[] {
    if (params === undefined || params === null) return []
    if (!Array.isArray(params) && typeof params === 'object')
      return Object.keys(params).map<IParam>((key) => ({
        name: canelToDash(key),
        value: params[key]?.toString()
      }))
    else return params as IParam[]
  }
}

function canelToDash(key: string): string {
  return key.replace(/[A-Z]/g, '-$&').toLowerCase()
}

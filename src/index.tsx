import _, { isEqual, union } from 'lodash'
import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Props, ReactSVG } from 'react-svg'

/*

*/
interface IParam {
  name: string
  value: string | undefined | null
}

interface IParamMap {
  param: string
  target: string
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
        const attributeName =
          paramsMap[i].attributes.getNamedItem('attributeName')?.nodeValue
        if (targetId && param)
          map.push({
            param: param,
            target: targetId,
            attributeName: attributeName
          })
      }
    }
    if (props.paramsMap) map = union(map, props.paramsMap) // merge maps

    // update SVG
    map.forEach((m) => {
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

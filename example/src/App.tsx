import React, { useState } from 'react'
import { Stack, Text,  initializeIcons, ITextStyles, FontWeights, IStackTokens, Slider, SwatchColorPicker, Label, TextField, SpinButton, Separator, Toggle } from '@fluentui/react';
import logo from './logo.svg';
import './App.css';
import { ReactParametricsSVG } from 'react-parametrics-svg'
initializeIcons();
const boldStyle: Partial<ITextStyles> = { root: { fontWeight: FontWeights.semibold, color:'white' } };
const stackTokens: IStackTokens = { childrenGap: 15 };

const colorCellsExample = [
  { id: 'a', label: 'red', color: '#a4262c' },
  { id: 'b', label: 'orange', color: '#ca5010' },
  { id: 'c', label: 'orangeYellow', color: '#986f0b' },
  { id: 'd', label: 'yellowGreen', color: '#8cbd18' },
  { id: 'e', label: 'green', color: '#0b6a0b' },
  { id: 'f', label: 'cyan', color: '#038387' },
  { id: 'g', label: 'cyanBlue', color: '#004e8c' }
];

const App = () => {
  const [corner,setCorner] = useState(10)
  const [color,setColor] = useState('gray')
  const [outline,setOutline] = useState('red')
  const [text,setText] = useState('push')
  const [fontSize,setFontSize] = useState('10')
  const [animate,setAnimate] = useState('')
  return (
      <Stack className='App' tokens={stackTokens}>
        <Stack.Item className='App-header'>
          <Stack>
            <img src={logo} className='App-logo' alt='logo' />
            <Text variant="xxLarge" styles={boldStyle}>Welcome to your React Parametrics SVG test App</Text>   
          </Stack>       
        </Stack.Item>
        <Stack horizontal>
          <Stack.Item styles={{root:{width:400}}}>
            <Stack styles={{root:{paddingLeft:20, paddingRight:20}}}>
              <Stack.Item align='start'><Label>Button text: param <i>text-label</i></Label></Stack.Item>
              <TextField value={text} onChange={(_ev, value) => setText(value||'')} ></TextField>
              <Stack.Item align='start'><Label>Font size: param <i>font-size</i></Label></Stack.Item>
              <SpinButton min={10} max={40} value={fontSize} onChange={(_ev, value) => setFontSize(value||'10')}></SpinButton>
              <Stack.Item align='start'><Label>Background color: param <i>color</i></Label></Stack.Item>
              <Stack.Item align='center'>
                <SwatchColorPicker          
                columnCount={5}
                cellShape={'square'}
                colorCells={colorCellsExample}
                onChange={(_ev, _id, col) => setColor(col||'gray')}            
              />
              </Stack.Item>
              <Stack.Item align='start'><Label>Background color: param <i>outline</i></Label></Stack.Item>
              <Stack.Item align='center'>
                <SwatchColorPicker          
                columnCount={5}
                cellShape={'square'}
                colorCells={colorCellsExample}
                onChange={(_ev, _id, col) => setOutline(col||'red')}            
              />
              </Stack.Item>
              <Stack.Item align='start'><Label>Round corners size: param <i>corners</i></Label></Stack.Item>
              <Slider min={0} max={30} value={corner} onChange={(value)=>setCorner(value)}></Slider>
              <Stack.Item align='start'><Label>Animate via add class: param <i>animate</i></Label></Stack.Item>
              <Toggle onChange={(_ev, checked) => setAnimate(checked?'animate':'')}></Toggle>
            </Stack>
          </Stack.Item>
          <Separator vertical></Separator>
          <Stack.Item grow>
            <Stack>              
              <Text variant='medium'>Use object as parameters</Text>
              <Stack.Item align='center'>
                <ReactParametricsSVG style={{display:'flex'}} src='./button.svg' 
                params={{corners:corner, color:color, outline:outline, textLabel:text, fontSize:fontSize}}></ReactParametricsSVG>
              </Stack.Item>
              <Text variant='medium'>Use object as parameters use tag (#) and class (.) selector</Text>
              <Stack.Item align='center'>
                <ReactParametricsSVG style={{display:'flex'}} src='./button-by-tag-class.svg' 
                params={{corners:corner, color:color, outline:outline, textLabel:text, fontSize:fontSize}}></ReactParametricsSVG>
              </Stack.Item>
              <Text variant='medium'>Use IParam[] key:value as parameters</Text>
              <Stack.Item align='center'>
                <ReactParametricsSVG style={{display:'flex'}} src='./button.svg' 
                params={[{name:'corners', value:corner}, {name:'color', value:color}, {name:'outline', value:outline}, {name:'text-label', value:text}, {name:'font-size', value:fontSize}]}></ReactParametricsSVG>
              </Stack.Item>
              <Text variant='medium'>Use object as parameters and SVG without map/parms of defs</Text>
              <Stack.Item align='center'>
                <ReactParametricsSVG style={{display:'flex'}} src='./button-no-def.svg' 
                params={{corners:corner, color:color, outline:outline, textLabel:text, fontSize:fontSize}}
                paramsMap={[
                  {target:'#button_rect', param:'color', attributeName:'fill'},
                  {target:'#button_rect', param:'outline', attributeName:'stroke'},
                  {target:'#button_rect', param:'corners', attributeName:'rx'},
                  {target:'#button_rect', param:'corners', attributeName:'ry'},
                  {target:'#button_label', param:'font-size', attributeName:'font-size'},
                  {target:'#button_label', param:'text-label'}
                  ]}></ReactParametricsSVG>
              </Stack.Item>
              <Text variant='medium'>Load static resource</Text>
              <Stack.Item align='center'>
                <ReactParametricsSVG style={{width:80, height:80}} src={logo} 
                params={{color:color, animate:animate}}
                paramsMap={[
                  {target:'#logo', param:'color', attributeName:'fill'},
                  {target:'#logo', param:'animate', attributeName:'class'}
                  ]}></ReactParametricsSVG>
              </Stack.Item>
              <Text variant='medium'>With animation</Text>
              <Stack.Item align='center'>
                <ReactParametricsSVG style={{width:80, height:80}} src='./spin-animation.svg' 
                params={{color:color,transform:animate===''?'':'rotate'}}
                paramsMap={[
                  {target:'#spin', param:'transform', attributeName:'type'},
                  {target:'#arrow', param:'color', attributeName:'fill'}
                  ]}></ReactParametricsSVG>
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </Stack>)}

export default App

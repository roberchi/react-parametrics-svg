import React, { useState } from 'react'
import {
  Box,
  Chip,
  Divider,
  Paper,
  Slider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { ReactParametricsSVG } from 'react-parametrics-svg'

const COLORS = [
  { id: 'a', label: 'Rosso',    fill: '#a4262c' },
  { id: 'b', label: 'Arancio',  fill: '#ca5010' },
  { id: 'c', label: 'Verde',    fill: '#0b6a0b' },
  { id: 'd', label: 'Azzurro',  fill: '#004e8c' },
  { id: 'e', label: 'Viola',    fill: '#5c2d91' },
  { id: 'f', label: 'Grigio',   fill: '#605e5c' },
]

function ColorSwatch({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (c: string) => void
}) {
  return (
    <ToggleButtonGroup value={selected} exclusive onChange={(_, v) => v && onSelect(v)}>
      {COLORS.map((c) => (
        <ToggleButton key={c.id} value={c.fill} sx={{ p: 0.5 }} title={c.label}>
          <Box sx={{ width: 24, height: 24, bgcolor: c.fill, borderRadius: 0.5 }} />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default function ButtonTab() {
  const [text, setText] = useState('CLICK')
  const [fontSize, setFontSize] = useState(14)
  const [corner, setCorner] = useState(10)
  const [color, setColor] = useState('#004e8c')
  const [outline, setOutline] = useState('#a4262c')

  const params = { textLabel: text, fontSize, corners: corner, color, outline }

  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {/* Controls */}
      <Paper variant="outlined" sx={{ p: 2, width: 300, flexShrink: 0 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: 1.5 }}>
          PARAMETRI BUTTON
        </Typography>

        <Stack spacing={2} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Testo (param text-label)</Typography>
            <TextField
              size="small"
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{ mt: 0.5 }}
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">Font size (param font-size)</Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#4488cc', fontWeight: 700 }}>
                {fontSize}px
              </Typography>
            </Box>
            <Slider size="small" min={8} max={28} value={fontSize} onChange={(_, v) => setFontSize(v as number)} />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">Arrotondamento (param corners)</Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#4488cc', fontWeight: 700 }}>
                {corner}px
              </Typography>
            </Box>
            <Slider size="small" min={0} max={20} value={corner} onChange={(_, v) => setCorner(v as number)} />
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>Fill (param color)</Typography>
            <ColorSwatch selected={color} onSelect={setColor} />
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>Bordo (param outline)</Typography>
            <ColorSwatch selected={outline} onSelect={setOutline} />
          </Box>
        </Stack>
      </Paper>

      {/* Preview */}
      <Stack spacing={2} sx={{ flex: 1, minWidth: 280 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: 1.5 }}>
              button.svg — param scalari (oggetto)
            </Typography>
            <Chip label="PARAM" color="info" size="small" sx={{ fontSize: '0.6rem', height: 18 }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ReactParametricsSVG
              style={{ width: 220, height: 80 }}
              src="/button.svg"
              params={params}
            />
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: 1.5 }}>
              button-by-tag-class.svg — selettori # e .
            </Typography>
            <Chip label="PARAM" color="info" size="small" sx={{ fontSize: '0.6rem', height: 18 }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ReactParametricsSVG
              style={{ width: 220, height: 80 }}
              src="/button-by-tag-class.svg"
              params={params}
            />
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: 1.5 }}>
              button-no-def.svg — paramsMap da React props
            </Typography>
            <Chip label="PARAM + paramsMap prop" color="warning" size="small" sx={{ fontSize: '0.6rem', height: 18 }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ReactParametricsSVG
              style={{ width: 220, height: 80 }}
              src="/button-no-def.svg"
              params={params}
              paramsMap={[
                { target: '#button_rect', param: 'color',     attributeName: 'fill' },
                { target: '#button_rect', param: 'outline',   attributeName: 'stroke' },
                { target: '#button_rect', param: 'corners',   attributeName: 'rx' },
                { target: '#button_rect', param: 'corners',   attributeName: 'ry' },
                { target: '#button_label', param: 'font-size', attributeName: 'font-size' },
                { target: '#button_label', param: 'text-label' },
              ]}
            />
          </Box>
        </Paper>

        <Divider />
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', px: 1 }}>
          params = {JSON.stringify(params, null, 2)}
        </Typography>
      </Stack>
    </Box>
  )
}

import React, { useState } from 'react'
import {
  Box,
  Chip,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { ReactParametricsSVG } from 'react-parametrics-svg'

const COLORS = [
  { label: 'Blu',    value: '#1976d2' },
  { label: 'Verde',  value: '#2e7d32' },
  { label: 'Rosso',  value: '#c62828' },
  { label: 'Viola',  value: '#6a1b9a' },
  { label: 'Teal',   value: '#00695c' },
]

export default function AnimTab() {
  const [spinning, setSpinning] = useState(false)
  const [color, setColor] = useState('#1976d2')

  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {/* Controls */}
      <Paper variant="outlined" sx={{ p: 2, width: 260, flexShrink: 0 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: 1.5 }}>
          PARAMETRI ANIMAZIONE
        </Typography>

        <Stack spacing={2.5} sx={{ mt: 1.5 }}>
          <FormControlLabel
            control={
              <Switch
                checked={spinning}
                onChange={(e) => setSpinning(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                Spinning {spinning ? '(attivo)' : '(fermo)'}
              </Typography>
            }
          />

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Colore freccia (param color)
            </Typography>
            <ToggleButtonGroup
              value={color}
              exclusive
              onChange={(_, v) => v && setColor(v)}
              orientation="vertical"
            >
              {COLORS.map((c) => (
                <ToggleButton key={c.value} value={c.value} sx={{ justifyContent: 'flex-start', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: c.value, borderRadius: 0.5, flexShrink: 0 }} />
                  <Typography variant="caption">{c.label}</Typography>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </Paper>

      {/* Preview */}
      <Stack spacing={2} sx={{ flex: 1 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: 1.5 }}>
              spin-animation.svg — param + paramsMap prop
            </Typography>
            <Chip
              label={spinning ? 'SPINNING' : 'FERMO'}
              color={spinning ? 'success' : 'default'}
              size="small"
              sx={{ fontSize: '0.6rem', height: 18 }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <ReactParametricsSVG
                style={{ width: 120, height: 120 }}
                src="/spin-animation.svg"
                params={{ color, transform: spinning ? 'rotate' : '' }}
                paramsMap={[
                  { target: '#spin',  param: 'transform', attributeName: 'type' },
                  { target: '#arrow', param: 'color',     attributeName: 'fill' },
                ]}
              />
              <Typography variant="caption" color="text.secondary">
                spin-animation.svg
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: 1.5, mb: 1, display: 'block' }}>
            COME FUNZIONA — paramsMap da React props
          </Typography>
          <Box
            component="pre"
            sx={{
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              color: 'text.secondary',
              m: 0,
              overflowX: 'auto',
            }}
          >
{`<ReactParametricsSVG
  src="/spin-animation.svg"
  params={{ color: "${color}", transform: "${spinning ? 'rotate' : ''}" }}
  paramsMap={[
    { target: '#spin',  param: 'transform', attributeName: 'type' },
    { target: '#arrow', param: 'color',     attributeName: 'fill' },
  ]}
/>`}
          </Box>
        </Paper>
      </Stack>
    </Box>
  )
}

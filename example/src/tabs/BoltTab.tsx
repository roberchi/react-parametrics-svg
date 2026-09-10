import React, { useState } from 'react'
import {
  Box,
  Chip,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import { ReactParametricsSVG } from 'react-parametrics-svg'

// Fixed layout constants baked into SVG expressions
const CX = 180
const BEARING_Y = 130

interface BoltParams {
  d: number
  L: number
  b: number
  scale: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function ExprRow({
  name,
  expr,
  value,
}: {
  name: string
  expr: string
  value: number | string
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '90px 1fr 70px',
        gap: 1,
        alignItems: 'center',
        py: 0.3,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: '#3399bb', fontFamily: 'monospace', fontWeight: 600 }}
      >
        {name}
      </Typography>
      <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
        = {expr}
      </Typography>
      <Typography
        variant="caption"
        sx={{ fontFamily: 'monospace', color: '#4488cc', fontWeight: 700, textAlign: 'right' }}
      >
        → {typeof value === 'number' ? round2(value) : value}
      </Typography>
    </Box>
  )
}

function RefRow({ name, z }: { name: string; z: number }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 0.4,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
        {name}
      </Typography>
      <Typography
        variant="caption"
        sx={{ fontFamily: 'monospace', color: z < 0 ? '#ff8844' : '#44aa44', fontWeight: 600 }}
      >
        z = {z} mm
      </Typography>
    </Box>
  )
}

export default function BoltTab() {
  const [params, setParams] = useState<BoltParams>({ d: 12, L: 80, b: 28, scale: 2.2 })

  const { d, L, b, scale } = params

  const s = d * 1.6        // head across flats (mm)
  const k = d * 0.64       // head height (mm)

  const exprRows = [
    { name: 'head.x',      expr: 'cx - d*1.6/2*scale',    value: CX - (s / 2) * scale },
    { name: 'head.width',  expr: 'd*1.6*scale',            value: s * scale },
    { name: 'head.height', expr: 'd*0.64*scale',           value: k * scale },
    { name: 'shaft.h',     expr: '(L-b)*scale',            value: (L - b) * scale },
    { name: 'thread.y',    expr: 'bearingY+(L-b)*scale',   value: BEARING_Y + (L - b) * scale },
    { name: 'thread.h',    expr: 'b*scale',                value: b * scale },
    { name: 'label-L',     expr: '`L = ${L} mm`',          value: `L = ${L} mm` },
    { name: 'label-b',     expr: '`b = ${b} mm`',          value: `b = ${b} mm` },
    { name: 'label-s',     expr: '`s = ${Math.round(d*1.6)} mm`', value: `s = ${Math.round(s)} mm` },
  ]

  const refs = [
    { name: 'bearing-plane', z: 0 },
    { name: 'head-top',      z: -round2(k) },
    { name: 'thread-start',  z: L - b },
    { name: 'thread-end',    z: L },
    { name: 'tip',           z: L },
  ]

  function setParam(key: keyof BoltParams, value: number) {
    setParams((prev) => {
      const next = { ...prev, [key]: value }
      // b must stay <= L - 5
      if (next.b > next.L - 5) next.b = next.L - 5
      return next
    })
  }

  const svgParams = [
    { name: 'd', value: d },
    { name: 'L', value: L },
    { name: 'b', value: b },
    { name: 'scale', value: scale },
  ]

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {/* LEFT COLUMN — controls */}
      <Stack spacing={2} sx={{ width: 320, flexShrink: 0 }}>

        {/* Parametri */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography
            variant="overline"
            sx={{ color: 'text.secondary', letterSpacing: 1.5, fontSize: '0.65rem' }}
          >
            PARAMETRI BOLT
          </Typography>

          {[
            { key: 'd' as const,     label: 'diameter (d)',      min: 6,   max: 24,  step: 2,   unit: 'mm' },
            { key: 'L' as const,     label: 'length (L)',        min: 20,  max: 150, step: 5,   unit: 'mm' },
            { key: 'b' as const,     label: 'threadLength (b)',  min: 5,   max: 80,  step: 1,   unit: 'mm' },
            { key: 'scale' as const, label: 'scale (px/mm)',     min: 1.0, max: 2.5, step: 0.1, unit: '' },
          ].map(({ key, label, min, max, step, unit }) => (
            <Box key={key} sx={{ mt: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                  {label}
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#4488cc', fontWeight: 700 }}>
                  {params[key]}{unit}
                </Typography>
              </Box>
              <Slider
                size="small"
                min={min}
                max={max}
                step={step}
                value={params[key]}
                onChange={(_, v) => setParam(key, v as number)}
              />
            </Box>
          ))}
        </Paper>

        {/* Espressioni */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', letterSpacing: 1.5, fontSize: '0.65rem' }}
            >
              ESPRESSIONI
            </Typography>
            <Chip label="EXPR — NUOVO" color="success" size="small" sx={{ fontSize: '0.6rem', height: 18 }} />
            <Chip label="vs SCALARE" color="default" size="small" sx={{ fontSize: '0.6rem', height: 18 }} />
          </Box>
          {exprRows.map((r) => (
            <ExprRow key={r.name} name={r.name} expr={r.expr} value={r.value} />
          ))}
        </Paper>

        {/* Refs semantici */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography
            variant="overline"
            sx={{ color: 'text.secondary', letterSpacing: 1.5, fontSize: '0.65rem', mb: 1, display: 'block' }}
          >
            REFS SEMANTICI (MM)
          </Typography>
          {refs.map((r) => (
            <RefRow key={r.name} name={r.name} z={r.z} />
          ))}
        </Paper>
      </Stack>

      {/* RIGHT COLUMN — disegno */}
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          minWidth: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', letterSpacing: 1.5, fontSize: '0.65rem', mb: 1 }}
        >
          DISEGNO PARAMETRICO
        </Typography>

        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1,
            bgcolor: '#fafafa',
            overflow: 'auto',
          }}
        >
          <ReactParametricsSVG
            src="/bolt.svg"
            params={svgParams}
            style={{ display: 'block' }}
          />
        </Box>

        <Typography
          variant="caption"
          sx={{ mt: 1, fontFamily: 'monospace', color: 'text.disabled' }}
        >
          M{d}×{L} · s={Math.round(s)} · k={round2(k)} · scale={scale} px/mm
        </Typography>
      </Paper>
    </Box>
  )
}

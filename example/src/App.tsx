import React, { useState } from 'react'
import {
  AppBar,
  Box,
  CssBaseline,
  Tab,
  Tabs,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material'
import BoltTab from './tabs/BoltTab'
import ButtonTab from './tabs/ButtonTab'
import AnimTab from './tabs/AnimTab'

const theme = createTheme({
  palette: { mode: 'light', primary: { main: '#1976d2' } },
  typography: { fontFamily: 'Inter, system-ui, sans-serif' },
})

interface TabPanelProps {
  children: React.ReactNode
  value: number
  index: number
}
function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState(0)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            react-parametrics-svg · Demo
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Bolt CAD parametrico" />
          <Tab label="Button (param scalare)" />
          <Tab label="Animazione" />
        </Tabs>
      </Box>

      <TabPanel value={tab} index={0}><BoltTab /></TabPanel>
      <TabPanel value={tab} index={1}><ButtonTab /></TabPanel>
      <TabPanel value={tab} index={2}><AnimTab /></TabPanel>
    </ThemeProvider>
  )
}

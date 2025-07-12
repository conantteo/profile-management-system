import { MantineProvider, createTheme } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create a custom theme with swapped primary and secondary colors
// Primary color (was blue, now green)
// Secondary color (was green, now blue)
const theme = createTheme({
  colors: {
    // Make green the primary color (was secondary)
    primary: [
      '#e3fcec',
      '#c5f5d6',
      '#a5edbf',
      '#84e6a8',
      '#63de91',
      '#43d77a',
      '#22cf63',
      '#1ba651',
      '#147d3e',
      '#0c542a',
    ],
    // Make blue the secondary color (was primary)
    secondary: [
      '#e7f5ff',
      '#d0e9ff',
      '#b8dcff',
      '#9fcfff',
      '#88c2ff',
      '#70b5ff',
      '#57a9ff',
      '#4485cc',
      '#326299',
      '#213f66',
    ],
  },
  primaryColor: 'primary',
  primaryShade: 6,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>
);

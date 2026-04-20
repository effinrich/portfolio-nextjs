import './index.css';
import './lib/leaflet-setup';

// Inject Google Fonts
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Instrument+Sans:wght@300;400;500;600&display=swap';
document.head.appendChild(fontLink);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import { GenesisRoot } from './lib/genesis.jsx';
import { setupThemeBridge } from './lib/theme-bridge';

setupThemeBridge();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GenesisRoot>
      <App />
    </GenesisRoot>
  </StrictMode>,
);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import {Provider} from 'react-redux'
import { store } from './redux/store'

const rootElement = document.getElementById('root')
createRoot(rootElement!).render(
  <StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </StrictMode>,
)

// Global error/log hooks to help debug runtime errors (shows stack and promise rejections)
window.addEventListener('error', (e) => {
  // eslint-disable-next-line no-console
  console.error('[Global error handler]', e.message || e, e.error ? e.error.stack : null, e.filename, e.lineno, e.colno);
});
window.addEventListener('unhandledrejection', (e) => {
  // eslint-disable-next-line no-console
  console.error('[Unhandled rejection]', e.reason);
});

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initLook } from '@/lib/look'
import './index.css'

// route components restore scroll themselves (MainLayout, ProjectDetail); the browser's own restore would clamp against the previous page
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

requestAnimationFrame(initLook)

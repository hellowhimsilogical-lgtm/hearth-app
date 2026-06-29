import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Prompt installed PWAs to pick up the latest service worker + bundle.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    for (const reg of regs) reg.update()
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

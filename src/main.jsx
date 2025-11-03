import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminApp from './AdminApp.jsx'
import App from './App.jsx'

// Determinar si estamos en modo visor basado en los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search)
const isViewMode = urlParams.has('view') || urlParams.get('mode') === 'view'
const tournamentSlug = urlParams.get('t')

// Si estamos en modo visor y hay un slug de torneo, mostramos directamente la vista pública
// De lo contrario, mostramos la aplicación de administrador normal
const Root = () => {
  if (isViewMode && tournamentSlug) {
    return <App initialViewMode={true} viewSlug={tournamentSlug} />
  } else {
    return <AdminApp />
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)

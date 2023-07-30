import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Game from './components/game/Game'
import Admin from './components/admin/Admin'
import LoginForm from './components/loginForm/LoginForm'
import { useState } from 'react'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/game" element={<Game />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App

import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Game from './components/game/Game'
import Admin from './components/admin/Admin'

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App

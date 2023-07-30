import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Game from './components/game/Game'
import Admin from './components/admin/Admin'
import LoginForm from './components/loginForm/LoginForm'
import { useState } from 'react'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // const placeCoin = () => {
  //   const { x, y } = getRandomSafeSpot()
  //   const coinRef = ref(database, `coins/${getKeyString(x, y)}`)
  //   set(coinRef, {
  //     x,
  //     y,
  //   })
  //   console.log('coins', coins)
  //   const coinTimeOuts = [2000, 3000, 4000, 5000]
  //   setTimeout(() => {
  //     placeCoin()
  //   }, randomFromArray(coinTimeOuts))
  // }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm onLogin={setIsLoggedIn} />} />
        <Route path="/game" element={<Game />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App

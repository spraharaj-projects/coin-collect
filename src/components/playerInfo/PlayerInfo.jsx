import { useState } from 'react'
import './PlayerInfo.css'

const PlayerInfo = ({ name, setName, changeColor }) => {
  const [playerName, setPlayerName] = useState(name)
  return (
    <div className="player-info">
      <div>
        <label htmlFor="player-name">Your Name</label>
        <input
          id="player-name"
          maxLength={10}
          type="text"
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          onBlur={e => setName(playerName)}
        />
      </div>
      <div>
        <button id="player-color" onClick={changeColor}>
          Change Color
        </button>
      </div>
    </div>
  )
}

export default PlayerInfo

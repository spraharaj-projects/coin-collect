import { useEffect, useState } from 'react'
import {
  getKeyString,
  getRandomSafeSpot,
  randomFromArray,
} from '../../utils/helpers'
import { database } from '../../utils/firebase'
import { off, onChildAdded, onValue, ref, remove, set } from 'firebase/database'
import './Admin.css'
import goldMedal from '../../assets/images/gold-medal.png'

const Admin = () => {
  const [gameStatus, setGameStatus] = useState(false)
  const [coinTimeouts, setCoinTimeouts] = useState(null)
  const [players, setPlayers] = useState({})

  const placeCoin = () => {
    const { x, y } = getRandomSafeSpot()
    const coinRef = ref(database, `coins/${getKeyString(x, y)}`)
    set(coinRef, {
      x,
      y,
    })
    // const coinTimeOuts = [2000, 3000, 4000, 5000]

    // if (coinTimeout) {
    //   clearTimeout(coinTimeout)
    // }

    // const newCoinTimeout = setTimeout(() => {
    //   placeCoin()
    // }, randomFromArray(coinTimeOuts))

    // setCoinTimeout(newCoinTimeout)
  }

  useEffect(() => {
    const coinTimeOuts = [2000, 3000, 4000, 5000]
    const activeTimeouts = []

    const placeCoinRandomly = () => {
      const randomTimeout = randomFromArray(coinTimeOuts)
      const timeoutId = setTimeout(() => {
        placeCoin()
        const index = activeTimeouts.indexOf(timeoutId)
        if (index !== -1) {
          activeTimeouts.splice(index, 1)
          setCoinTimeouts([...activeTimeouts])
        }
        placeCoinRandomly()
      }, randomTimeout)

      activeTimeouts.push(timeoutId)
      setCoinTimeouts([...activeTimeouts])
    }

    if (gameStatus) {
      // Start multiple parallel timeouts
      for (let i = 0; i < 5; i++) {
        placeCoinRandomly()
      }
    } else {
      // Clear all active timeouts if game status is not "Start"
      activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId))
      setCoinTimeouts([])
    }

    // Cleanup the timeouts when the component unmounts
    return () => {
      activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId))
    }

    // if (gameStatus) {
    //   placeCoin()
    // } else {
    //   if (coinTimeout) {
    //     clearTimeout(coinTimeout)
    //     setCoinTimeout(null)
    //   }
    // }
  }, [gameStatus])

  useEffect(() => {
    const allPlayersRef = ref(database, `players`)
    const onChildaddedCallback = snapshot => {
      const addedPlayer = snapshot.val()
      setPlayers(prevPlayers => ({
        ...prevPlayers,
        [addedPlayer.id]: addedPlayer,
      }))
    }
    const onValueCallback = snapshot => {
      setPlayers({ ...snapshot.val() })
    }

    onChildAdded(allPlayersRef, onChildaddedCallback)
    onValue(allPlayersRef, onValueCallback)

    return () => {
      off(allPlayersRef, 'child_added', onChildaddedCallback)
      off(allPlayersRef, 'value', onValueCallback)
    }
  }, [])

  const delCoins = () => {
    const coinsRef = ref(database, `coins`)
    remove(coinsRef)
  }

  const handleGameStatusChange = () => {
    setGameStatus(!gameStatus)
  }

  return (
    // <div>
    //
    // </div>
    <main>
      <div id="header">
        <h1>Ranking</h1>
      </div>
      <div id="leaderboard">
        <div className="ribbon"></div>
        <table>
          <tbody>
            {Object.keys(players)
              .sort((a, b) => players[b].coins - players[a].coins)
              .map((id, index) => (
                <tr key={id}>
                  <td className="number">{index + 1}</td>
                  <td className="name">{players[id].name.toUpperCase()}</td>
                  <td className="points">
                    {players[id].coins}
                    {index === 0 ? (
                      <img
                        className="gold-medal"
                        src={goldMedal}
                        alt="gold medal"
                      />
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div id="buttons">
          <button className="continue" onClick={handleGameStatusChange}>
            {gameStatus ? 'Stop' : 'Start'}
          </button>
          <button className="continue" onClick={delCoins}>
            Clear
          </button>
        </div>
      </div>
    </main>
  )
}

export default Admin

import { useEffect, useState } from 'react'
import {
  ref,
  onValue,
  onChildAdded,
  set,
  onDisconnect,
  update,
  off,
  remove,
} from '@firebase/database'
import { auth, database } from '../../utils/firebase'
import { onAuthStateChanged, signInAnonymously } from '@firebase/auth'
import {
  createName,
  createRandomColor,
  getKeyString,
  getNextColor,
  getPlayerColorIndex,
  getRandomSafeSpot,
  isSolid,
} from '../../utils/helpers'
// import { KeyPressListener } from '../../utils/helpers/KeyPressListener'
import GameBoard from '../gameBoard/GameBoard'
import PlayerInfo from '../playerInfo/PlayerInfo'
import Player from '../player/Player'
import Coin from '../coin/Coin'
import useKeyPressListener from '../keyPressListener/useKeyPressListener'
// import KeyPressListener from '../keyPressListener/useKeyPressListener'

const Game = () => {
  const [playerId, setPlayerId] = useState(null)
  const [playerRef, setPlayerRef] = useState(null)
  const [players, setPlayers] = useState({})
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [coins, setCoins] = useState({})

  useKeyPressListener('ArrowUp', () => handleArrowPress(0, -1))
  useKeyPressListener('ArrowDown', () => handleArrowPress(0, 1))
  useKeyPressListener('ArrowRight', () => handleArrowPress(1, 0))
  useKeyPressListener('ArrowLeft', () => handleArrowPress(-1, 0))

  const attemptGrabCoin = (x, y) => {
    const key = getKeyString(x, y)
    if (coins[key]) {
      remove(ref(database, `coins/${key}`))
      const updatedCoins = { ...coins }
      delete updatedCoins[key]
      setCoins(updatedCoins)
      update(playerRef, {
        coins: players[playerId].coins + 1,
      })
    }
  }

  const handleArrowPress = (xChange = 0, yChange = 0) => {
    const newX = players[playerId].x + xChange
    const newY = players[playerId].y + yChange
    if (!isSolid(newX, newY)) {
      players[playerId].x = newX
      players[playerId].y = newY
      if (xChange === 1) {
        players[playerId].direction = 'right'
      }
      if (xChange === -1) {
        players[playerId].direction = 'left'
      }
      set(playerRef, players[playerId])
      attemptGrabCoin(newX, newY)
    }
  }

  const handleNameChange = newName => {
    const name = newName || createName()
    setPlayerName(name)
    update(playerRef, {
      name,
    })
  }

  const handleColorChange = () => {
    const skinIndex = getPlayerColorIndex(players[playerId].color)
    const nextColor = getNextColor(skinIndex)
    update(playerRef, {
      color: nextColor,
    })
  }

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
  }, [playerId])

  useEffect(() => {
    const allCoinsRef = ref(database, `coins`)
    const onClildAddedCallback = snapshot => {
      const coin = snapshot.val()
      const key = getKeyString(coin.x, coin.y)
      setCoins(prevCoins => ({
        ...prevCoins,
        [key]: { x: coin.x, y: coin.y },
      }))
    }
    const onValueCallback = snapshot => {
      setCoins({ ...snapshot.val() })
    }

    onChildAdded(allCoinsRef, onClildAddedCallback)
    onValue(allCoinsRef, onValueCallback)

    return () => {
      off(allCoinsRef, 'child_added', onClildAddedCallback)
      off(allCoinsRef, 'value', onValueCallback)
    }
  }, [playerId])

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user && user.isAnonymous) {
        setPlayerId(user.uid)
        const player = ref(database, `players/${user.uid}`)
        const name = createName()
        const color = createRandomColor()
        const { x, y } = getRandomSafeSpot()
        const playerObj = {
          id: user.uid,
          name,
          color,
          direction: 'right',
          x,
          y,
          coins: 0,
        }
        setPlayerRef(player)
        // setPlayers({ [user.uid]: playerObj })
        setPlayerName(name)
        set(player, playerObj)
        onDisconnect(player).remove()
      } else {
        console.log('Error loading user')
      }
    })

    signInAnonymously(auth)
      .then(() => setLoading(false))
      .catch(error => {
        setError(`${error.code}: ${error.message}`)
      })
  }, [])

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : playerRef ? (
        <>
          <GameBoard>
            {Object.keys(players).map(id => (
              <Player
                key={id}
                className={`Character grid-cell ${
                  id === playerId ? 'you' : ''
                }`}
                name={id === playerId ? playerName : players[id].name}
                coins={players[id].coins}
                color={players[id].color}
                direction={players[id].direction}
                x={players[id].x}
                y={players[id].y}
              />
            ))}
            {Object.keys(coins).map(id => (
              <Coin
                key={id}
                className="Coin grid-cell"
                x={coins[id].x}
                y={coins[id].y}
              />
            ))}
          </GameBoard>
          <PlayerInfo
            name={playerName}
            setName={handleNameChange}
            changeColor={handleColorChange}
          />
        </>
      ) : null}
      {error && <p>Error: {error}</p>}
    </>
  )
}

export default Game

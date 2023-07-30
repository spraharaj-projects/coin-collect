const mapData = {
  minX: 1,
  maxX: 14,
  minY: 4,
  maxY: 12,
  blockedSpaces: {
    '7x4': true,
    '1x11': true,
    '12x10': true,
    '4x7': true,
    '5x7': true,
    '6x7': true,
    '8x6': true,
    '9x6': true,
    '10x6': true,
    '7x9': true,
    '8x9': true,
    '9x9': true,
  },
}

const safeSpots = [
  { x: 1, y: 4 },
  { x: 2, y: 4 },
  { x: 1, y: 5 },
  { x: 2, y: 6 },
  { x: 2, y: 8 },
  { x: 2, y: 9 },
  { x: 4, y: 8 },
  { x: 5, y: 5 },
  { x: 5, y: 8 },
  { x: 5, y: 10 },
  { x: 5, y: 11 },
  { x: 11, y: 7 },
  { x: 12, y: 7 },
  { x: 13, y: 7 },
  { x: 13, y: 6 },
  { x: 13, y: 8 },
  { x: 7, y: 6 },
  { x: 7, y: 7 },
  { x: 7, y: 8 },
  { x: 8, y: 8 },
  { x: 10, y: 8 },
  { x: 8, y: 8 },
  { x: 11, y: 4 },
]

const namePrefix = [
  'COOL',
  'SUPER',
  'HIP',
  'SMUG',
  'COOL',
  'SILKY',
  'GOOD',
  'SAFE',
  'DEAR',
  'DAMP',
  'WARM',
  'RICH',
  'LONG',
  'DARK',
  'SOFT',
  'BUFF',
  'DOPE',
]

const animals = [
  'BEAR',
  'DOG',
  'CAT',
  'FOX',
  'LAMB',
  'LION',
  'BOAR',
  'GOAT',
  'VOLE',
  'SEAL',
  'PUMA',
  'MULE',
  'BULL',
  'BIRD',
  'BUG',
]

const playerColors = ['blue', 'red', 'orange', 'yellow', 'green', 'purple']

export const isSolid = (x, y) => {
  const blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)]
  return (
    blockedNextSpace ||
    x >= mapData.maxX ||
    x < mapData.minX ||
    y >= mapData.maxY ||
    y < mapData.minY
  )
}

export const getRandomSafeSpot = () => {
  return randomFromArray(safeSpots)
}

export const randomFromArray = array => {
  return array[Math.floor(Math.random() * array.length)]
}

export const getKeyString = (x, y) => {
  return `${x}x${y}`
}

export const createName = () => {
  const prefix = randomFromArray(namePrefix)
  const animal = randomFromArray(animals)
  return `${prefix} ${animal}`
}

export const createRandomColor = () => {
  return randomFromArray(playerColors)
}

export const getPlayerColorIndex = color => {
  return playerColors.indexOf(color)
}

export const getNextColor = index => {
  return playerColors[index + 1] || playerColors[0]
}

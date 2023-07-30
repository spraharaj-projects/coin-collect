import './Coin.css'

const Coin = ({ className, x, y }) => {
  return (
    <div
      className={className}
      style={{ transform: `translate3d(${16 * x}px, ${16 * y - 4}px, 0)` }}
    >
      <div className="Coin_shadow grid-cell"></div>
      <div className="Coin_sprite grid-cell"></div>
    </div>
  )
}

export default Coin

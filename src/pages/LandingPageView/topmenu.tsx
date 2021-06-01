import React from 'react';
import { Target } from 'react-feather';
import { Link } from 'taalswap-uikit';

const Search = () => {
    const [showResults, setShowResults] = React.useState(false)
    const onClick = () => setShowResults(true)
    return (
      <div>
        <input type="button" onClick={onClick} className='mobilenav_icon'/>
        { showResults ? <Results /> : null }
      </div>
    )
  }
  
  const Results = () => (
    <div className='hide_menu' id='results'>
    <span className='arrow_box'>-</span>
    <ul>
      <li><Link href='/' style={{color:'#00ab55',textDecoration:'none'}}><span className='home_icon'>home_icon</span>Home</Link></li>
      <li><Link href='#/swap' style={{textDecoration:'none'}}><span className='swap_icon'>swap_icon</span>Swap</Link></li>
      <li><Link href='#/pool' style={{textDecoration:'none'}}><span className='liquidity_icon'>liquidity_icon</span>Liquidity</Link></li>
      <li><Link href='http://localhost:3001/farms' style={{textDecoration:'none'}}><span className='farms_icon'>Farms_icon</span>Farms</Link></li>
      <li><Link href='/' style={{textDecoration:'none'}}><span className='connect_icon'>connect_icon</span>Coneect Wallet</Link></li>
    </ul>
    </div>
  )

  export default Search;
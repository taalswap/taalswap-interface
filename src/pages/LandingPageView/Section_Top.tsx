import React from 'react';
import { Link } from 'taalswap-uikit';


const Section_Top = () => {
    return (
      <div className='top_wrap'>
        <div className='cont'>
            <h3 className='home_title'>Boost your assets the way you&apos;re never imagined</h3>
            <p className='home_subtit'>A multi-chain AMM protocol to safeguard and increse your assets</p>
            <div className='top_buyline'>
                <div className='buy_textwrap'>
                    <p className='buy_name'>Current TVL</p>
                    <p className='buy_num'>$0,000,000,000</p>
                </div>
                <div className='buy_btnwrap'>
                    <input type="button" value='BUY HBELT' style={{cursor:'pointer'}}/>
                </div>
            </div>
            <div className='input_wrap'>
                <div className='taal_info'>
                    <ul>
                        <li>
                            <p className='tit'>TAL PRICE</p>
                            <div>
                                <span className='num'>37.3051</span>
                                <span className='name'>USD</span>
                            </div>
                        </li>
                        <li>
                            <p className='tit'>TAL market cap</p>
                            <div>
                                <span className='num'>101.5M</span>
                                <span className='name'>USD</span>
                            </div>
                        </li>
                        <li>
                            <p className='tit'>TAL circ. supply</p>
                            <div>
                                <span className='num'>2,709,061</span>
                                <span className='name'>TAL</span>
                            </div>
                            <p className='sub_text'>=BSC 2.3M / HECO 0.2M / OTHERS 0.2M</p>
                        </li>
                        <li>
                            <p className='tit'>BELT burnt</p>
                            <div>
                                <span className='num'>59,566.5887</span>
                                <span className='name'>TAL</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className='taal_portfolio'>
                    <ul>
                        <p className='portfolio_title'>MY PORTFOLIO</p>
                        <li>
                            <p className='tit'>MY Total Deposit</p>
                            <div>
                                <span className='num'>-</span>
                                <span className='name'>USD</span>
                            </div>
                        </li>
                        <li>
                            <p className='tit'>TAL Earned</p>
                            <div>
                                <span className='num'>-</span>
                                <span className='name'>TAL</span>
                            </div>
                        </li>
                        <li>
                            <p className='tit'>My Average APR</p>
                            <div>
                                <span className='num'>-</span>
                                <span className='name'>%</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
    );
  };
  
  export default Section_Top;
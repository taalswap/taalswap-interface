import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Target } from 'react-feather';
import { Link } from 'taalswap-uikit';
import Topmenu from './topmenu';
import logo_img from './images/TAAL_Logo_A_bg.svg';
import logo_imgChange from './images/TAAL_Logo.svg';

const TopBar = () => {
  const { account } = useWeb3React();
  const [scrollPosition, setScrollPosition] = useState(0);

  const frontendBaseUrl =
    process.env.REACT_APP_FRONTEND || 'http://localhost:3000';
  const interfaceBaseUrl =
    process.env.REACT_APP_INTERFACE || 'http://localhost:3000';

  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };
  useEffect(() => {
    window.addEventListener('scroll', updateScroll);
  });
  return (
    <div className={scrollPosition < 50 ? 'original_header' : 'change_header'}>
      <div className="tabbar_wrap">
        <div>
          <Link href="/">
            <img src={logo_img} alt="logo_img" className="top_logo" />
            <img
              src={logo_imgChange}
              alt="logo_img"
              className="top_logochange"
            />
          </Link>
        </div>
        <div className="top_menu">
          <div>
            <Link
              href="/"
              style={{
                color: '#00ab55',
                textDecoration: 'none',
                fontSize: '14px',
              }}
            >
              Home
            </Link>
          </div>
          <div style={{ marginLeft: '30px' }}>
            <Link
              href={`${interfaceBaseUrl}/#/swap`}
              style={{ textDecoration: 'none', fontSize: '14px' }}
            >
              Swap
            </Link>
          </div>
          <div style={{ marginLeft: '30px' }}>
            <Link
              href={`${interfaceBaseUrl}/#/liquidity`}
              style={{ textDecoration: 'none', fontSize: '14px' }}
            >
              Liquidity
            </Link>
          </div>
          <div style={{ marginLeft: '30px' }}>
            <Link
              href={`${frontendBaseUrl}/farms`}
              style={{ textDecoration: 'none', fontSize: '14px' }}
            >
              Farms
            </Link>
          </div>
          <div style={{ marginLeft: '30px' }}>
            <Link
              href={`${frontendBaseUrl}/staking`}
              style={{ textDecoration: 'none', fontSize: '14px' }}
            >
              Staking
            </Link>
          </div>
          <div style={{ marginLeft: '30px' }}>
            <Link href="/" style={{ textDecoration: 'none', fontSize: '14px' }}>
              IDO
            </Link>
          </div>
          <div>
            <input
              type="button"
              value="Connect Wallet"
              className="connect_btn"
            />
          </div>
        </div>
        <div className="mobile_menu" style={{ cursor: 'pointer' }}>
          <Topmenu />
        </div>
      </div>
    </div>
  );
};

export default TopBar;

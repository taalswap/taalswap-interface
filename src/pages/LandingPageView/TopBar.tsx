import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Target } from 'react-feather';
import { Link } from 'taalswap-uikit';
import Topmenu from './topmenu';
import logo_img from './images/TAAL_Logo.png';
import { useTranslation } from '../../contexts/Localization';

const TopBar = () => {
  const { account } = useWeb3React();
  const { t } = useTranslation();

  console.log(account);
  return (
    <div className="tabbar_wrap">
      <div>
        <Link href="http://localhost:3001/">
          <img src={logo_img} alt="logo_img" className="top_logo" />
        </Link>
      </div>
      <div className="top_menu">
        <div>
          <Link
            href="http://localhost:3001/"
            style={{ color: '#212b36', textDecoration: 'none' }}
          >
            Home
          </Link>
        </div>
        <div style={{ marginLeft: '30px' }}>
          <Link
            href="#/swap"
            style={{ color: '#212b36', textDecoration: 'none' }}
          >
            Swap
          </Link>
        </div>
        <div style={{ marginLeft: '30px' }}>
          <Link
            // href="#/pool"
            href="#/liquidity"
            style={{ color: '#212b36', textDecoration: 'none' }}
          >
            Liquidity
          </Link>
        </div>
        <div style={{ marginLeft: '30px' }}>
          <Link
            href="http://localhost:3001/farms"
            style={{ color: '#212b36', textDecoration: 'none' }}
          >
            Farms
          </Link>
        </div>
        <div>
          <input type="button" value={t('Connect Wallet')} className="connect_btn" />
        </div>
      </div>
      <div className="mobile_menu" style={{ cursor: 'pointer' }}>
        <Topmenu />
      </div>
    </div>
  );
};

export default TopBar;

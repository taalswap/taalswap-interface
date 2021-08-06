import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Target } from 'react-feather';
import { Link } from 'taalswap-uikit';
import Topmenu from './topmenu';
import logo_img from './images/TAAL_Logo.png';
import { useTranslation } from '../../contexts/Localization';

const frontendBaseUrl =
  process.env.REACT_APP_FRONTEND || 'http://localhost:3001';
const interfaceBaseUrl =
  process.env.REACT_APP_INTERFACE || 'http://localhost:3000';

const TopBar = () => {
  const { account } = useWeb3React();
  const { t } = useTranslation();

  return (
    <div className="tabbar_wrap">
      <div>
        {/* <Link href="http://localhost:3001/"> */}
        <Link href={`${frontendBaseUrl}`}>
          <img src={logo_img} alt="logo_img" className="top_logo" />
        </Link>
      </div>
      <div className="top_menu">
        <div>
          <Link
            // href="http://localhost:3001/"
            href={`${frontendBaseUrl}`}
            style={{ color: '#212b36', textDecoration: 'none' }}
          >
            Home
          </Link>
        </div>
        <div style={{ marginLeft: '30px' }}>
          <Link
            href={`${interfaceBaseUrl}/#/swap`}
            style={{ color: '#212b36', textDecoration: 'none' }}
          >
            Swap
          </Link>
        </div>
        <div style={{ marginLeft: '30px' }}>
          <Link
            // href="#/pool"
            href={`${interfaceBaseUrl}/#/liquidity`}
            style={{ color: '#212b36', textDecoration: 'none' }}
          >
            Liquidity
          </Link>
        </div>
        <div style={{ marginLeft: '30px' }}>
          <Link
            href={`${frontendBaseUrl}/farms`}
            style={{ color: '#212b36', textDecoration: 'none' }}
          >
            Farms
          </Link>
        </div>
        <div>
          <input
            type="button"
            value={t('Connect Wallet')}
            className="connect_btn"
          />
        </div>
      </div>
      <div className="mobile_menu" style={{ cursor: 'pointer' }}>
        <Topmenu />
      </div>
    </div>
  );
};

export default TopBar;

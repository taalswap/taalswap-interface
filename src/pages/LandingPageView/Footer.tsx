import React from 'react';
import { Link } from 'taalswap-uikit';
import footerlogo_img from './images/footer_Logo.png';
import facebook_icon from './images/facebook_icon.png';
import in_icon from './images/in_icon.png';
import instar_icon from './images/instar_icon.png';
import twitter_icon from './images/twitter_icon.png';

const Footer = () => {
  return (
    <div className='footer_wrap'>
    <div className='footer_cont'>
      <div className='footer_left'>
          <img src={footerlogo_img} alt="logo_img" className='footer_logo'/>
          <p>&copy; All rights reserved. Made by TaalSwap.  [Audited by HAECHI AUDIT]</p>
      </div>
      <div className='footer_menu'>
        <div>
            <Link href='/'>
                <img src={facebook_icon} alt="facebook_icon" className='facebook_icon'/>
            </Link>
        </div>
        <div style={{ marginLeft: '30px' }}>
            <Link href='/'>
                <img src={in_icon} alt="in_icon" className='in_icon'/>
            </Link>
        </div>
        <div style={{ marginLeft: '30px' }}>
            <Link href='/'>
                <img src={instar_icon} alt="instar_icon" className='instar_icon'/>
            </Link>
        </div>
        <div style={{ marginLeft: '30px' }}>
            <Link href='/'>
                <img src={twitter_icon} alt="twitter_icon" className='twitter_icon'/>
            </Link>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Footer;

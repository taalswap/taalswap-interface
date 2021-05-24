import React from 'react';
import { Link } from 'taalswap-uikit';

const TopBar = () => {
  return (
    <div
      style={{
        border: '1px solid red',
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
      }}
    >
      <div style={{ marginRight: '100px' }}>
        TopBar 파일 위치 : src/pages/LandingPageView/TopBar.tsx
      </div>
      <div>
        <Link href="/">Home</Link>
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <Link href="#/swap">Swap</Link>
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <Link href="#/pool">Liquidity</Link>
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <Link href="http://localhost:3001/farms">Farms</Link>
      </div>
    </div>
  );
};

export default TopBar;

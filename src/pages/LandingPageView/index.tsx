import React from 'react';
import styled from 'styled-components';
import TopBar from './TopBar';

const AppWrapper = styled.div`
  height: '100%';
  width: '100%';
  border: '1px solid blue';
`;

const LandingPageView = () => {
  return (
    <div style={{ border: '1px solid blue', width: '100%', height: '100%' }}>
      <div>
        <TopBar />
      </div>
      <div>Landing Page file 위치 : /src/pages/LandingPageView/index.tsx</div>
      <br />
      <br />
      <div>LandingPageView</div>
      <div>LandingPageView</div>
      <div>LandingPageView</div>
      <div>LandingPageView</div>
    </div>
  );
};

export default LandingPageView;

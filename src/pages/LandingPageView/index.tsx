import React from 'react';
import styled from 'styled-components';
import TopBar from './TopBar';
import SectionTop from './Section_Top';
import SectionBottom from './Section_Bottom';
import Footer from './Footer';
import './App.css';

const AppWrapper = styled.div`
  height: '100%';
  width: '100%';
`;

const LandingPageView = () => {
  return (
    <div className='wrap'>
        <TopBar />
        <SectionTop />
        <SectionBottom />
        <Footer />
    </div>
  );
};

export default LandingPageView;

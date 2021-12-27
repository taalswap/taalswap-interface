import React, { useEffect } from 'react';
import styled from 'styled-components';
import TeaserImg from './images/teaser_img.png'
import CheckIcon from './images/check_icon.png'

const TeaserWrapper = styled.div`
  height: 100%;
  display: block;
  width: 100%;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  z-index:9999;
`;

const TeaserBox = styled.div`
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    text-align:center;
`;

const Teaser: React.FC = () => {
    useEffect(() => {
        document.body.style.cssText = `
          position: fixed; 
          top: -${window.scrollY}px;
          overflow-y: scroll;
          width: 100%;`;
        return () => {
          const scrollY = document.body.style.top;
          document.body.style.cssText = '';
          window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        };
      }, []);

    return (
        <TeaserWrapper className='teaser_wrap'>
            <TeaserBox>
                <img src={TeaserImg} alt="teaserImg" style={{width:'50%',maxWidth:'433px'}}/>
                <p style={{fontSize:'2.6vw',color:'#fff'}}>TaalSwap coming to your wallet soon...</p>
                <ul style={{textAlign:'left',marginTop:'30px'}}>
                    <li style={{listStyle:'none',display:'flex',alignItems:'flex-start'}}>
                        <img src={CheckIcon} alt="checkIcon" style={{width:'10%',maxWidth:'40px'}}/>
                        <span style={{color:'#fff',fontSize:'1.5vw',marginLeft:'10px',lineHeight:'130%'}}>Liquidity providing starts at 12:00 PM (UTC+9) on July 7, 2021</span>
                    </li>
                    <li style={{listStyle:'none',display:'flex',alignItems:'flex-start',marginTop:'10px'}}>
                        <img src={CheckIcon} alt="checkIcon" style={{width:'10%',maxWidth:'40px'}}/>
                        <span style={{color:'#fff',fontSize:'1.5vw',marginLeft:'10px',lineHeight:'130%'}}>Rewarding starts at 12:00 PM (UTC+9) on July 21, 2021.
                        </span>
                    </li>
                    <li style={{listStyle:'none',display:'flex',alignItems:'flex-start',marginTop:'10px'}}>
                        <img src={CheckIcon} alt="checkIcon" style={{width:'10%',maxWidth:'40px'}}/>
                        <span style={{color:'#fff',fontSize:'1.5vw',marginLeft:'10px',lineHeight:'130%'}}>Partnership : <a href="https://docs.google.com/forms/d/e/1FAIpQLSf6UYO1Olnt1Mevz8Ap5sXSd2T8J2UGKxOBT5Z-hzKF7CYhSg/viewform" style={{color:'#FFC107'}}>Register here</a></span>
                    </li>
                    <li style={{listStyle:'none',display:'flex',alignItems:'flex-start',marginTop:'10px'}}>
                        <img src={CheckIcon} alt="checkIcon" style={{width:'10%',maxWidth:'40px'}}/>
                        <span style={{color:'#fff',fontSize:'1.5vw',marginLeft:'10px',lineHeight:'130%'}}>For detailed information, please visit TaalSwap docs page <a href="https://taalswap.gitbook.io/taalswap-docs-v-2-0/" style={{color:'#FFC107'}}>here</a>.</span>
                    </li>
                </ul>
            </TeaserBox>
        </TeaserWrapper>
    )
}

export default Teaser

import React from 'react';
import styled from 'styled-components';
import TeaserImg from './images/teaser_img.png'
import CheckIcon from './images/check_icon.png'

const TeaserWrapper = styled.div`
  height: 100%;
  display: block;
  width: 100%;
  position: absolute;
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
    return (
        <TeaserWrapper className='teaser_wrap'>
            <TeaserBox>
                <img src={TeaserImg} alt="teaserImg" style={{width:'50%',maxWidth:'433px'}}/>
                <p style={{fontSize:'2.6vw',color:'#fff'}}>TaalSwap coming to your wallet soon...</p>
                <ul style={{textAlign:'left',marginTop:'30px'}}>
                    <li style={{listStyle:'none',display:'flex',alignItems:'flex-start'}}>
                        <img src={CheckIcon} alt="checkIcon" style={{width:'10%',maxWidth:'40px'}}/>
                        <span style={{color:'#fff',fontSize:'1.5vw',marginLeft:'10px',lineHeight:'130%'}}>Liquidity providing starts at 12:00 PM on July 7, 2021</span>
                    </li>
                    <li style={{listStyle:'none',display:'flex',alignItems:'flex-start',marginTop:'10px'}}>
                        <img src={CheckIcon} alt="checkIcon" style={{width:'10%',maxWidth:'40px'}}/>
                        <span style={{color:'#fff',fontSize:'1.5vw',marginLeft:'10px',lineHeight:'130%'}}>Rewarding starts from Block # 12,784.890 (First block generation expected
                        at 12:00 PM on July 8, 2021.
                        </span>
                    </li>
                    <li style={{listStyle:'none',display:'flex',alignItems:'flex-start',marginTop:'10px'}}>
                        <img src={CheckIcon} alt="checkIcon" style={{width:'10%',maxWidth:'40px'}}/>
                        <span style={{color:'#fff',fontSize:'1.5vw',marginLeft:'10px',lineHeight:'130%'}}>Partnership : <a href="./" style={{color:'#FFC107'}}>Register here</a></span>
                    </li>
                </ul>
            </TeaserBox>
        </TeaserWrapper>
    )
}

export default Teaser
import React from 'react';
import { Link } from 'taalswap-uikit';
import ido_img from './images/ido_img.png';


const Section_Bottom = () => {
    return (
        <div className='bottom_wrap'> 
            <div className='cont'>
                <div className='taal_idobox'>
                    <div className='ido_textwrap'>
                        <p>Initial Taal Swap Offering</p>
                        <div>
                            <p>Fire up yourproject with <span style={{color:'#00ab55'}}>TaalSwap IDO</span>!</p>
                            <Link href='/'><input type="button" value='GO NOW' style={{cursor:'pointer'}}/></Link>
                        </div>
                    </div>
                    <div className='ido_imgwrap'>
                        <img src={ido_img} alt="ido_img" className='ido_img'/>
                    </div>
                </div>
                <div className='none'>
                    ??
                </div>
            </div>
        </div>
    );
  };
  
  export default Section_Bottom;
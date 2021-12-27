import React from 'react'
import { Link, Button } from 'taalswap-uikit'
import ido_img from './images/ido_img.png'
import { useTranslation } from '../../contexts/Localization'

const Section_Bottom = () => {
  const { t } = useTranslation()
  return (
    <div className="bottom_wrap" style={{ marginTop: '30px' }}>
      <div className="cont bottom_cont">
        <div className="taal_idobox">
          <div className="ido_textwrap">
            <p>Initial TaalSwap Offering</p>
            <div>
              <p>
                Fire up your project with <span style={{ color: '#00ab55' }}>TaalSwap IDO</span>
              </p>
              <Link href="https://ido.taalswap.finance/" target="_blank">
                <Button scale='md' height='40px' style={{fontSize:'14px'}}>
                  {t('Go Now')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="ido_imgwrap">
            <img src={ido_img} alt="ido_img" className="ido_img" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Section_Bottom

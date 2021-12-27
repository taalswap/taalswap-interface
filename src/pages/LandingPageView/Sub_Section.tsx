import React from 'react'
import styled from 'styled-components'
import AgencyLogo01 from './images/Agency_logo01.png'
import AgencyLogo02 from './images/Agency_logo02.png'

const SectionWrapper = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.subSectionbg};
`

const Usewrap = styled.li`
  background-color: ${({ theme }) => theme.colors.subSectionlibg};
  display: flex;
  justify-content: center;
  align-items: center;
`

const Txtcolor = styled.p`
  color: ${({ theme }) => theme.colors.logoColor};
`

const LandingPageView = () => {
  return (
    <SectionWrapper>
      <div className="subsection_box">
        <Txtcolor className="section_tit">Auditing Agency</Txtcolor>
        <ul>
          <Usewrap>
            <a
              href="https://taalswap.gitbook.io/taalswap-docs-v-2-0/taalswap-security/audit"
              target="_blank"
              rel="noreferrer"
              style={{ width: '100%', display: 'block' }}
            >
              <img src={AgencyLogo01} alt="LogoImg" style={{ width: '100%', maxWidth: '188px' }} />
            </a>
          </Usewrap>
          <Usewrap>
            <a
              href="https://taalswap.gitbook.io/taalswap-docs-v-2-0/taalswap-security/audit"
              target="_blank"
              rel="noreferrer"
              style={{ width: '100%', display: 'block' }}
            >
              <img src={AgencyLogo02} alt="LogoImg" style={{ width: '100%', maxWidth: '146px' }} />
            </a>
          </Usewrap>
        </ul>
      </div>
      {/* <div className='subsection_box'>
                <Txtcolor className='section_tit'>Partners</Txtcolor>
            </div>    */}
    </SectionWrapper>
  )
}

export default LandingPageView

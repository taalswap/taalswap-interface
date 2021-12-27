import React, { useState, useMemo } from 'react'
import { Input } from 'taalswap-uikit'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import { useTranslation } from 'contexts/Localization'

const StyledInput = styled(Input)`
  border-radius: 8px;
  margin-left: auto;
  box-sizing:borderbox;
  padding:0 0 0 30px;
  height:40px;
  border:1px solid rgb(74 74 104 / 10%);
  font-weight:400;
`

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`

const Container = styled.div<{ toggled: boolean }>``

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const SearchInput: React.FC<Props> = ({ onChange: onChangeCallback, placeholder = 'Search' }) => {
  const [toggled, setToggled] = useState(false)
  const [searchText, setSearchText] = useState('')

  const { t } = useTranslation()

  const debouncedOnChange = useMemo(
    () => debounce((e: React.ChangeEvent<HTMLInputElement>) => onChangeCallback(e), 500),
    [onChangeCallback],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debouncedOnChange(e)
  }

  return (
    <Container toggled={toggled}>
      <InputWrapper>
        <svg id="___Icons_ic_replace" data-name="__🥬Icons/ ic_replace" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style={{position:"absolute",top:"calc(50% - 6px)",left:"8px"}}>
          <g id="_gr" data-name="#gr">
            <rect id="Rectangle" width="16" height="16" fill="#919eab" opacity="0"/>
            <path id="Shape" d="M11.333,12a.672.672,0,0,1-.473-.2L8.6,9.54a5.3,5.3,0,0,1-3.261,1.127H5.333A5.352,5.352,0,1,1,9.54,8.6l2.267,2.26A.67.67,0,0,1,11.333,12Zm-6-10.67a4,4,0,1,0,4,4A4,4,0,0,0,5.333,1.333Z" transform="translate(2 2)" fill="#919eab"/>
          </g>
        </svg>
        <StyledInput
          value={searchText}
          onChange={onChange}
          placeholder={t(placeholder)}
          onBlur={() => setToggled(false)}
        />
      </InputWrapper>
    </Container>
  )
}

export default SearchInput

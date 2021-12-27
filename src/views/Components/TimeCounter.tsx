import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'

const CountDownItem = styled.span`
  color: ${({ theme }) => theme.colors.text};
`

const useStyles = makeStyles(() => ({
  root: {
    // display: 'flex',
    // alignItems: 'center',
  },
  countdownWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    // flexDirection: 'column',
    // flexWrap: 'nowrap',
    // width: '100%',
    // margin: '0px',
    // padding: '0px',
  },

  countdownItem: {
    fontSize: '16px',
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    margin: '0px 2px',
  },
}))

const TimeCounter = () => {
  const classes = useStyles()
  const [days, setDays] = useState('00')
  const [hours, setHours] = useState('00')
  const [minutes, setMinutes] = useState('00')
  const [seconds, setSeconds] = useState('00')

  function fillZero(width, str) {
    return str.length >= width ? str : new Array(width - str.length + 1).join('0') + str
  }

  useEffect(() => {
    try {
      const interval = setInterval(() => {
        const now = new Date()

        const thenMnt = moment('2021-07-21 12:00:00')

        setDays(parseInt(moment.duration(thenMnt.diff(now)).asDays().toString()).toString())
        setHours(moment.duration(thenMnt.diff(now)).hours().toString())
        setMinutes(moment.duration(thenMnt.diff(now)).minutes().toString())
        setSeconds(moment.duration(thenMnt.diff(now)).seconds().toString())
      }, 1000)
      return () => clearInterval(interval)
    } catch (error) {
      return null
    }
  }, [])

  return (
    <>
      <div className={classes.countdownWrapper}>
        <div className="count_Box">
          {/* {`${fillZero(2, days)} days ${fillZero(2, hours)} : ${fillZero(2, minutes)} : ${fillZero(2, seconds)} `} */}
          <CountDownItem className={classes.countdownItem}>{fillZero(2, days)}</CountDownItem>
          <CountDownItem className={classes.countdownItem}>days</CountDownItem>
          <CountDownItem className={classes.countdownItem}>{fillZero(2, hours)}</CountDownItem>
          <CountDownItem className={classes.countdownItem}>:</CountDownItem>
          <CountDownItem className={classes.countdownItem}>{fillZero(2, minutes)}</CountDownItem>
          <CountDownItem className={classes.countdownItem}>:</CountDownItem>
          <CountDownItem className={classes.countdownItem}>{fillZero(2, seconds)}</CountDownItem>
        </div>
      </div>
    </>
  )
}

export default TimeCounter

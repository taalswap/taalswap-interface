/* eslint-disable no-param-reassign */
import { useWeb3React } from '@web3-react/core'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { farmsConfig, farmsConfigKlaytn } from 'config/constants/farms'
import isArchivedPid from 'utils/farmHelpers'
import priceHelperLpsConfig from 'config/constants/priceHelperLps'
import { chain, isUndefined, parseInt } from 'lodash'
import fetchFarms from './fetchFarms'
import fetchFarmsPrices from './fetchFarmsPrices'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from './fetchFarmUser'
import { FarmsState, Farm } from '../types'
import getChainId from '../../utils/getChainId'

// const { chainId } = useWeb3React()
const chainIdStr = window.localStorage.getItem("chainId")
const chainId = getChainId()

let noAccountFarmConfig
if (chainId > 1000) {
  noAccountFarmConfig = farmsConfigKlaytn.map((farm) => ({
    ...farm,
    userData: {
      allowance: '0',
      tokenBalance: '0',
      stakedBalance: '0',
      earnings: '0',
    },
  }))
} else {
  noAccountFarmConfig = farmsConfig.map((farm) => ({
    ...farm,
    userData: {
      allowance: '0',
      tokenBalance: '0',
      stakedBalance: '0',
      earnings: '0',
    },
  }))
}

const initialState: FarmsState = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false }

// export const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))
let nonArchivedFarmsChainId
if (chainId > 1000) {
  nonArchivedFarmsChainId = farmsConfigKlaytn.filter(({ pid }) => !isArchivedPid(pid))
} else {
  nonArchivedFarmsChainId = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))
}
export const nonArchivedFarms = nonArchivedFarmsChainId

// Async thunks
export const fetchFarmsPublicDataAsync = createAsyncThunk<Farm[], number[]>(
  'farms/fetchFarmsPublicDataAsync',
  async (pids) => {
    // const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
    let farmsToFetch
    if (chainId > 1000) {
      farmsToFetch = farmsConfigKlaytn.filter((farmConfig) => pids.includes(farmConfig.pid))
    } else {
      farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
    }

    // Add price helper farms
    const farmsWithPriceHelpers = farmsToFetch.concat(priceHelperLpsConfig)

    const farms = await fetchFarms(farmsWithPriceHelpers)
    const farmsWithPrices = await fetchFarmsPrices(farms)

    // Filter out price helper LP config farms
    const farmsWithoutHelperLps = farmsWithPrices.filter((farm: Farm) => {
      return farm.pid || farm.pid === 0
    })

    return farmsWithoutHelperLps
  },
)

interface FarmUserDataResponse {
  pid: number
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
}

export const fetchFarmUserDataAsync = createAsyncThunk<FarmUserDataResponse[], { account: string; pids: number[] }>(
  'farms/fetchFarmUserDataAsync',
  async ({ account, pids }) => {
    // const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
    let farmsToFetch
    if (chainId > 1000) {
      farmsToFetch = farmsConfigKlaytn.filter((farmConfig) => pids.includes(farmConfig.pid))
    } else {
      farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
    }
    const userFarmAllowances = await fetchFarmUserAllowances(account, farmsToFetch)
    const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsToFetch)
    const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsToFetch)
    const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch)

    return userFarmAllowances.map((farmAllowance, index) => {
      return {
        pid: farmsToFetch[index].pid,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: userFarmEarnings[index],
      }
    })
  },
)

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload
      state.loadArchivedFarmsData = loadArchivedFarmsData
    },
  },
  extraReducers: (builder) => {
    // Update farms with live data
    builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((farm) => {
        const liveFarmData = action.payload.find((farmData) => farmData.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    })

    // Update farms with user data
    builder.addCase(fetchFarmUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid } = userDataEl
        const index = state.data.findIndex((farm) => farm.pid === pid)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })
  },
})

// Actions
export const { setLoadArchivedFarmsData } = farmsSlice.actions

export default farmsSlice.reducer

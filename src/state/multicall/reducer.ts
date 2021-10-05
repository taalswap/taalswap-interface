import { createReducer } from '@reduxjs/toolkit'
import {
  addMulticallListeners,
  errorFetchingMulticallResults,
  fetchingMulticallResults,
  removeMulticallListeners,
  toCallKey,
  updateMulticallResults
} from './actions'

export interface MulticallState {
  callListeners?: {
    // on a per-chain basis
    [chainId: number]: {
      // stores for each call key the listeners' preferences
      [callKey: string]: {
        // stores how many listeners there are per each blocks per fetch preference
        [blocksPerFetch: number]: number
      }
    }
  }

  callResults: {
    [chainId: number]: {
      [callKey: string]: {
        data?: string | null
        blockNumber?: number
        fetchingBlockNumber?: number
      }
    }
  }
}

const initialState: MulticallState = {
  callResults: {}
}

export default createReducer(initialState, builder =>
  builder
    .addCase(addMulticallListeners, (state, { payload: { calls, selectedChainId, options: { blocksPerFetch = 1 } = {} } }) => {
      const listeners: MulticallState['callListeners'] = state.callListeners
        ? state.callListeners
        : (state.callListeners = {})
      listeners[selectedChainId] = listeners[selectedChainId] ?? {}
      calls.forEach(call => {
        const callKey = toCallKey(call)
        listeners[selectedChainId][callKey] = listeners[selectedChainId][callKey] ?? {}
        listeners[selectedChainId][callKey][blocksPerFetch] = (listeners[selectedChainId][callKey][blocksPerFetch] ?? 0) + 1
      })
    })
    .addCase(
      removeMulticallListeners,
      (state, { payload: { selectedChainId, calls, options: { blocksPerFetch = 1 } = {} } }) => {
        const listeners: MulticallState['callListeners'] = state.callListeners
          ? state.callListeners
          : (state.callListeners = {})

        if (!listeners[selectedChainId]) return
        calls.forEach(call => {
          const callKey = toCallKey(call)
          if (!listeners[selectedChainId][callKey]) return
          if (!listeners[selectedChainId][callKey][blocksPerFetch]) return

          if (listeners[selectedChainId][callKey][blocksPerFetch] === 1) {
            delete listeners[selectedChainId][callKey][blocksPerFetch]
          } else {
            listeners[selectedChainId][callKey][blocksPerFetch]--
          }
        })
      }
    )
    .addCase(fetchingMulticallResults, (state, { payload: { chainId, fetchingBlockNumber, calls } }) => {
      state.callResults[chainId] = state.callResults[chainId] ?? {}
      calls.forEach(call => {
        const callKey = toCallKey(call)
        const current = state.callResults[chainId][callKey]
        if (!current) {
          state.callResults[chainId][callKey] = {
            fetchingBlockNumber
          }
        } else {
          if ((current.fetchingBlockNumber ?? 0) >= fetchingBlockNumber) return
          state.callResults[chainId][callKey].fetchingBlockNumber = fetchingBlockNumber
        }
      })
    })
    .addCase(errorFetchingMulticallResults, (state, { payload: { fetchingBlockNumber, chainId, calls } }) => {
      state.callResults[chainId] = state.callResults[chainId] ?? {}
      calls.forEach(call => {
        const callKey = toCallKey(call)
        const current = state.callResults[chainId][callKey]
        if (!current) return // only should be dispatched if we are already fetching
        if (current.fetchingBlockNumber === fetchingBlockNumber) {
          delete current.fetchingBlockNumber
          current.data = null
          current.blockNumber = fetchingBlockNumber
        }
      })
    })
    .addCase(updateMulticallResults, (state, { payload: { chainId, results, blockNumber } }) => {
      state.callResults[chainId] = state.callResults[chainId] ?? {}
      Object.keys(results).forEach(callKey => {
        const current = state.callResults[chainId][callKey]
        if ((current?.blockNumber ?? 0) > blockNumber) return
        state.callResults[chainId][callKey] = {
          data: results[callKey],
          blockNumber
        }
      })
    })
)

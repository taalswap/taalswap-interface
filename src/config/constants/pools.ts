import tokens from './tokens'
import { PoolCategory, PoolConfig } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.taal,
    earningToken: tokens.taal,
    contractAddress: {
      1: '0x226b1eaf01a78396e190ebd9893b0d5a120aa678',
      3: '0x0994abd73141cac0768f61cd7b01e4f010d81aa2',
      4: '0x37d9a669338aD2f9e5ae553017CD03d423b03b59',
      8217: '',     // MasterChef
      1001: '0xD49a8fF2D69Bb6e564603c2F759094a74BEe1B57',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '40',    // TaalPerBlock 변경 시 변경 필요
    sortOrder: 1,
    isFinished: false,
  }
]

export default pools

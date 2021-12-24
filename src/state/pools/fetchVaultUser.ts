import BigNumber from 'bignumber.js'
import { getCakeVaultContract } from 'utils/contractHelpers'

const cakeVaultContract = getCakeVaultContract()

const fetchVaultUser = async (account: string) => {
  try {
    const userContractResponse = await cakeVaultContract.methods.userInfo(account).call()
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime as string,
      lastUserActionTime: userContractResponse.lastUserActionTime as string,
      taalAtLastUserAction: new BigNumber(userContractResponse.taalAtLastUserAction).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      taalAtLastUserAction: null,
    }
  }
}

export default fetchVaultUser

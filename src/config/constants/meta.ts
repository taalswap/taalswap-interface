import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'TaalSwap',
  description:
    'The most popular AMM on Ethereum by user count! Earn TAL through yield farming, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by TaalSwap), and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('TaalSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('TaalSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('TaalSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('TaalSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('TaalSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('TaalSwap')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('TaalSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('TaalSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('TaalSwap')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('TaalSwap')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('TaalSwap')}`,
      }
    default:
      return null
  }
}

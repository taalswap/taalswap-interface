import { ChainId } from 'taalswap-sdk';
import { TokenList } from '@uniswap/token-lists';
import schema from '@uniswap/token-lists/src/tokenlist.schema.json';
import Ajv from 'ajv';
import contenthashToUri from './contenthashToUri';
import { parseENSAddress } from './parseENSAddress';
import uriToHttp from './uriToHttp';

// bakeryswap defaultTokenJson
import { DEFAULT_TOKEN_LIST_URL } from '../constants/lists';
import defaultTokenJson from '../constants/token/taalswap.json';
import ropstenTokenJson from '../constants/token/taalswap-ropsten.json';
import rinkebyTokenJson from '../constants/token/taalswap-rinkeby.json';
import klaytnTokenJson from '../constants/token/taalswap-klaytn.json';
import baobabTokenJson from '../constants/token/taalswap-baobab.json';

const tokenListValidator = new Ajv({ allErrors: true }).compile(schema);

/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 * @param resolveENSContentHash resolves an ens name to a contenthash
 */
export default async function getTokenList(
  listUrl: string,
  resolveENSContentHash: (ensName: string) => Promise<string>
): Promise<TokenList> {
  switch(listUrl) {
    case DEFAULT_TOKEN_LIST_URL[ChainId.MAINNET]:
      return defaultTokenJson;
    case DEFAULT_TOKEN_LIST_URL[ChainId.ROPSTEN]:
      return ropstenTokenJson;
    case DEFAULT_TOKEN_LIST_URL[ChainId.RINKEBY]:
      return rinkebyTokenJson;
    case DEFAULT_TOKEN_LIST_URL[ChainId.KLAYTN]:
      return klaytnTokenJson;
    case DEFAULT_TOKEN_LIST_URL[ChainId.BAOBAB]:
      return baobabTokenJson;
  }
  const parsedENS = parseENSAddress(listUrl);

  let urls: string[];
  if (parsedENS) {
    let contentHashUri;
    try {
      contentHashUri = await resolveENSContentHash(parsedENS.ensName);
    } catch (error) {
      console.error(`Failed to resolve ENS name: ${parsedENS.ensName}`, error);
      throw new Error(`Failed to resolve ENS name: ${parsedENS.ensName}`);
    }
    let translatedUri;
    try {
      translatedUri = contenthashToUri(contentHashUri);
    } catch (error) {
      console.error('Failed to translate contenthash to URI', contentHashUri);
      throw new Error(`Failed to translate contenthash to URI: ${contentHashUri}`);
    }
    urls = uriToHttp(`${translatedUri}${parsedENS.ensPath ?? ''}`);
  } else {
    urls = uriToHttp(listUrl);
  }
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const isLast = i === urls.length - 1;
    let response;
    try {
      response = await fetch(url);
    } catch (error) {
      console.error('Failed to fetch list', listUrl, error);
      if (isLast) throw new Error(`Failed to download list ${listUrl}`);
      // eslint-disable-next-line no-continue
      continue;
    }

    if (!response.ok) {
      if (isLast) throw new Error(`Failed to download list ${listUrl}`);
      // eslint-disable-next-line no-continue
      continue;
    }

    const json = await response.json();
    if (!tokenListValidator(json)) {
      const validationErrors: string =
        tokenListValidator.errors?.reduce<string>((memo, error) => {
          const add = `${error.dataPath} ${error.message ?? ''}`;
          return memo.length > 0 ? `${memo}; ${add}` : `${add}`;
        }, '') ?? 'unknown error';
      throw new Error(`Token list failed validation: ${validationErrors}`);
    }
    return json;
  }
  throw new Error('Unrecognized list URL protocol.');
}

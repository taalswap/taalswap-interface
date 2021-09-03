import { useEffect, useState } from 'react';
import getChainId from "../utils/getChainId";

type ApiResponse = {
  updated_at: string
  data: {
    [key: string]: {
      name: string
      symbol: string
      price: string
      price_BNB: string
    }
  }
}

// const api = 'https://api.pancakeswap.info/api/tokens'
// const api = 'https://taalswap-info-api-black.vercel.app/api/tokens';

const useGetPriceData = () => {
  const chainId = getChainId()
  const [data, setData] = useState<ApiResponse | null>(null);

  let api
  if (chainId < 1000) {
    api = 'https://taalswap-info-api-black.vercel.app/api/tokens';
  } else if (chainId === 1001) {
    api = 'https://api.taalswap.info/baobab/api/tokens';
  } else if (chainId === 8217) {
    api = 'https://api.taalswap.info/cypress/api/tokens';
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(api);
        const res: ApiResponse = await response.json();

        setData(res);

      } catch (error) {
        console.error('Unable to fetch price data:', error);
      }
    };

    fetchData();
  }, [setData, api]);

  return data
};

export default useGetPriceData;

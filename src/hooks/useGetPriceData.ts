import { useEffect, useRef, useState } from 'react';

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
const api = 'https://taalswap-api-ethereum.vercel.app/api/tokens';

const useGetPriceData = () => {
  // const talPrice = 0.0;
  // const talPriceRef = useRef(talPrice);
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(api);
        const res: ApiResponse = await response.json();

        setData(res);

        // // eslint-disable-next-line array-callback-return
        // const find = Object.entries(res.data).find(([token, item]) => {
        //   switch (token.toLowerCase()) {
        //     case '0x1e94361329257647669dde7dc8c869624aa424ea':
        //       talPriceRef.current = parseFloat(item.price);
        //       break;
        //   }
        // });
      } catch (error) {
        console.error('Unable to fetch price data:', error);
      }
    };

    fetchData();
  // }, [setData, talPrice]);
  }, [setData]);

  // return [data, talPrice];
  return data
};

export default useGetPriceData;

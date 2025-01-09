'use client';

import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';

import { POLLING_INTERVAL } from '@/config/constants';
import { getBlastYieldTokens, type BlastYieldResponse } from '@/config/yieldTokens';
import { encodeGetYieldMode, encodeGetClaimableYield } from '@/utils/yield';

import useWeb3 from './useWeb3';

export const useLoadBlastYield = (): UseQueryResult<BlastYieldResponse, Error> => {
  const { safe } = useSafeAppsSDK();
  const { web3: web3ReadOnly } = useWeb3();
  const currentChainId = safe.chainId;

  const query = useQuery<BlastYieldResponse, Error>({
    queryKey: ['blastYield', safe.safeAddress, web3ReadOnly, currentChainId],
    queryFn: async () => {
      if (!safe.safeAddress || !web3ReadOnly) return { items: [] };
      const yieldTokenArray = getBlastYieldTokens(+currentChainId);
      const calls = yieldTokenArray.map(async (token) => {
        return [
          await web3ReadOnly.call(encodeGetYieldMode(safe.safeAddress!, token)),
          await web3ReadOnly.call(encodeGetClaimableYield(safe.safeAddress!, token)).catch(() => {
            return '0';
          }),
        ];
      });

      const result = await Promise.all(calls);
      const items = result.map((value, idx) => {
        if (!value[0]) {
          throw new Error('Blast yield data fetch failed');
        }
        return {
          tokenInfo: yieldTokenArray[idx],
          mode: parseInt(value[0]),
          claimableYield: value[1],
        } as BlastYieldResponse['items'][number];
      });
      return { items };
    },
    refetchInterval: POLLING_INTERVAL,
    enabled: !!safe.safeAddress && !!web3ReadOnly,
  });

  useEffect(() => {
    if (query.error) {
      console.error('Blast yield data fetch failed', query.error.message);
    }
  }, [query.error]);

  return query;
};
export default useLoadBlastYield;

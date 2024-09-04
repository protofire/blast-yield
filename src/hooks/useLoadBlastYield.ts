'use client';

import { useEffect } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  getBlastYieldTokens,
  type BlastYieldResponse,
} from '@/config/yieldTokens';
import { encodeGetYieldMode, encodeGetClaimableYield } from '@/utils/yield';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { POLLING_INTERVAL } from '@/config/constants';
import useWeb3 from './useWeb3';

export const useLoadBlastYield = (): UseQueryResult<
  BlastYieldResponse,
  Error
> => {
  const { safe, sdk } = useSafeAppsSDK();
  const { web3: web3ReadOnly } = useWeb3();
  const currentChainId = safe.chainId;

  const query = useQuery<BlastYieldResponse, Error>({
    queryKey: [
      'blastYield',
      safe.safeAddress,
      web3ReadOnly,
      currentChainId,
    ],
    queryFn: async () => {
      if (!safe.safeAddress || !web3ReadOnly) return { items: [] };
      const yieldTokenArray = getBlastYieldTokens(+currentChainId);
      const calls = yieldTokenArray.map(async (token) => {
        return [
          // @ts-ignore
          await web3ReadOnly.call(encodeGetYieldMode(safe.safeAddress!, token)),
          await web3ReadOnly
            // @ts-ignore
            .call(encodeGetClaimableYield(safe.safeAddress!, token))
            .catch(() => {
              return '0';
            }),
        ];
      });

      const result = await Promise.all(calls);
      const items = result.map((value, idx) => {
        return {
          tokenInfo: yieldTokenArray[idx],
          mode: parseInt(value[0]),
          claimableYield: value[1],
        };
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

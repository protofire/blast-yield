import { useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { SafeAppProvider } from '@safe-global/safe-apps-provider';

function useWeb3() {
  const [web3, setWeb3] = useState<Web3Provider | undefined>();
  const { safe, sdk } = useSafeAppsSDK();

  useEffect(() => {
    const safeProvider = new SafeAppProvider(safe, sdk);
    const web3Instance = new Web3Provider(safeProvider);

    setWeb3(web3Instance);
  }, [safe, sdk]);

  return {
    web3,
  };
}

export default useWeb3;

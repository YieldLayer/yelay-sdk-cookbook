"use client";

import {createContext, useContext, ReactNode, useMemo} from 'react';
import { SDKConfig, SpoolSdk } from '@spool.fi/spool-v2-sdk';
import {JsonRpcProvider} from '@ethersproject/providers';
import {useWeb3Provider} from "@/context/web3Context";


const contractAddresses = {
  11155111: {
    ISmartVaultManager: '0x2638d6c0b4EF6Dee04050fA0B07CA62500435747',
    IDepositSwap: '0x5FB08e00DE169f041711206A0995410884080177',
    ISmartVaultFactory: '0x86BB0376929218ba1cb825cE2ebE801bFCcD8149',
    IDepositManager: '0xfA37dd47F3596681C39D3a1b55474595BB591dc9',
    IRewardManager: '0xcE7F66BD505a80129Ef25b06207Ac49620A55522',
    IStrategyRegistry: '0xf978853Db777d00b1130Ea21d8d98E8710b0Bc56',
    ISpoolLens: '0x33Df6cf08Fbb10047e318989fE687294CD45A7B4',
    IMetaVaultFactory: '0xe07a896CFD8FEdFb6d7515480853c5D5ED30EBFE',
  },
};

const config = new SDKConfig(
    process.env.NEXT_PUBLIC_SEPOLIA_SUBGRAPH_URL || '',
    'https://pricefeed.dev.spool.fi/',
    'https://rewards.dev.spool.fi/sepolia',
    'https://fastwithdraw.dev.spool.fi/sepolia/',
    contractAddresses,
);

const YelaySDKContext = createContext<SpoolSdk | null>(null);

export const useYelaySDK = () => {
  const context = useContext(YelaySDKContext);
  if (!context) {
    throw new Error('useYelaySDK must be used within a YelaySDKProvider');
  }
  return context;
};

type YelaySDKProviderProps = {
  children: ReactNode;
};

export const YelaySDKProvider = ({ children }: YelaySDKProviderProps) => {

  const { account, provider } = useWeb3Provider();
  const tempProvider = new JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || '');

  const yelaySDK = useMemo(() => {
    if (account && provider) {
      return new SpoolSdk(config, provider.getSigner());
    }
    return new SpoolSdk(config, tempProvider);
  }, [provider, account]);

  return (
    <YelaySDKContext.Provider value={yelaySDK}>
      {children}
    </YelaySDKContext.Provider>
  );
};

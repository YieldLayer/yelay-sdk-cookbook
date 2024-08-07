"use client";
import { createContext, useContext, ReactNode } from 'react';
import { SDKConfig, SpoolSdk } from '@spool.fi/spool-v2-sdk';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from 'ethers';

const pk = process.env.NEXT_PUBLIC_PK || '';
const rpc = new StaticJsonRpcProvider(
    process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
);

const signer = new Wallet(pk, rpc);

const contractAddresses = {
  11155111: {
    ISmartVaultManager: '0x2638d6c0b4EF6Dee04050fA0B07CA62500435747',
    IDepositSwap: '0x5FB08e00DE169f041711206A0995410884080177',
    ISmartVaultFactory: '0x86BB0376929218ba1cb825cE2ebE801bFCcD8149',
    IDepositManager: '0xfA37dd47F3596681C39D3a1b55474595BB591dc9',
    IRewardManager: '0xcE7F66BD505a80129Ef25b06207Ac49620A55522',
    IStrategyRegistry: '0xf978853Db777d00b1130Ea21d8d98E8710b0Bc56',
    ISpoolLens: '0x33Df6cf08Fbb10047e318989fE687294CD45A7B4',
  },
};

const config = new SDKConfig(
    process.env.NEXT_PUBLIC_SEPOLIA_SUBGRAPH_URL || '',
    'https://pricefeed.dev.spool.fi/',
    'https://rewards.dev.spool.fi/sepolia',
    'https://fastwithdraw.dev.spool.fi/sepolia/',
    contractAddresses,
);

const spoolSDK = new SpoolSdk(config, signer);

const SpoolSDKContext = createContext<SpoolSdk | null>(null);

export const useSpoolSDK = () => {
  const context = useContext(SpoolSDKContext);
  if (!context) {
    throw new Error('useSpoolSDK must be used within a SpoolSDKProvider');
  }
  return context;
};

type SpoolSDKProviderProps = {
  children: ReactNode;
};

export const SpoolSDKProvider = ({ children }: SpoolSDKProviderProps) => {
  return (
    <SpoolSDKContext.Provider value={spoolSDK}>
      {children}
    </SpoolSDKContext.Provider>
  );
};

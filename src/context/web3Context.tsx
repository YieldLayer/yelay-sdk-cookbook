"use client";

import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {Contract, ethers} from 'ethers';
import erc20ABI from '@/abis/erc20ABI';
import {TransactionReceipt} from "@ethersproject/abstract-provider";

interface Web3ContextType {
    provider: ethers.providers.Web3Provider | null;
    account: string | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    checkAllowance: (tokenAddress: string, owner: string) => Promise<string>;
    approve: (tokenAddress: string, amount: string) => Promise<TransactionReceipt>;
    latestBlock: () => Promise<number>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [account, setAccount] = useState<string | null>(null);

    useEffect(() => {
        if (window.ethereum) {
            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(newProvider);

            newProvider.listAccounts().then(accounts => {
                if (accounts.length > 0) {
                    setAccount(accounts[0].toLowerCase());
                }
            });
        } else {
            console.error('No Ethereum provider found. Install MetaMask.');
        }
    }, []);

    const connectWallet = async () => {
        if (provider) {
            try {
                const accounts = await provider.send('eth_requestAccounts', []);
                setAccount(accounts[0].toLowerCase());
            } catch (error) {
                console.error('Failed to connect wallet:', error);
            }
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
    };

    const checkAllowance = async (tokenAddress: string, owner: string): Promise<string> => {
        const contract = new Contract(tokenAddress, erc20ABI, provider?.getSigner())
        const allowance = await contract.allowance(owner, process.env.NEXT_PUBLIC_YELAY_SMART_VAULT_MANAGER_ADDRESS);
        return allowance.toString();
    };

    const approve = async (tokenAddress: string, amount: string): Promise<ethers.providers.TransactionReceipt> => {
        if (!provider) {
            throw new Error('No provider available');
        }
        const signer = provider.getSigner();
        const erc20Instance = new ethers.Contract(tokenAddress, erc20ABI, signer);
        const approveTx = await erc20Instance.approve(process.env.NEXT_PUBLIC_YELAY_SMART_VAULT_MANAGER_ADDRESS, amount);
        return await approveTx.wait();
    };

    const latestBlock = async () => {
        if (!provider) {
            throw new Error('No provider available');
        }
        return await provider.getBlockNumber();
    }

    return (
        <Web3Context.Provider value={{provider, account, connectWallet, disconnectWallet, checkAllowance, approve, latestBlock}}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3Provider = (): Web3ContextType => {
    const context = useContext(Web3Context);
    if (context === undefined) {
        throw new Error('useProvider must be used within a Web3Provider');
    }
    return context;
};

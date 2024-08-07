"use client";

import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import {useWeb3Provider} from "@/context/web3Context";
import {useSpoolSDK} from "@/context/SpoolSDKContext";
import Typography from "@mui/material/Typography";
import {Divider} from "@mui/material";
import type {UserBalanceBreakdown} from "@spool.fi/spool-v2-sdk";

interface UserBalanceBreakdownProps {
    smartVaultAddress: string;
}

const UserBalanceBreakdown: React.FC<UserBalanceBreakdownProps> = ({smartVaultAddress}) => {

    const {account} = useWeb3Provider();
    const SpoolSDK = useSpoolSDK();

    const initialBalanceBreakdown: UserBalanceBreakdown = {
        pendingAssets: {"0": 0},
        pendingDNFTs: [],
        pendingWithdrawal: "0.0",
        withdrawableAssets: {"0": 0},
        withdrawableDNFTs: [],
        claimableWNFTs: [],
        withdrawnAssets: {"0": 0},

    }

    const [balanceBreakdown, setBalanceBreakdown] = useState<UserBalanceBreakdown>(initialBalanceBreakdown);


    useEffect(() => {
        const fetchBalanceBreakdown = async () => {
            if (account) {
                console.log("account, smartVaultAddress", account, smartVaultAddress);
                const balanceBreakdown = await SpoolSDK.getUserBalanceBreakdown({
                    vaultAddress: smartVaultAddress,
                    userAddress: account.toLowerCase()
                });
                console.log(balanceBreakdown);
                setBalanceBreakdown(balanceBreakdown);
            }
        }
        fetchBalanceBreakdown()
    }, [account]);
    return (
        <>
            <Typography variant='h5'>Pending assets</Typography>
            {Object.entries(balanceBreakdown.pendingAssets).map(([key, value]) => (
                <Typography variant='body1'>{`${key}: ${value}`}</Typography>
            ))}
            <Typography variant='h5'>Pending dNFTs</Typography>
            <Box display='flex' gap={2}>
                {balanceBreakdown.pendingDNFTs.map((dNFT, index) => (
                    <Typography key={index} variant='body1'>{dNFT.nftId.toString()}</Typography>
                ))}
            </Box>
            <Divider/>
            <Typography variant='h5'>Withdrawable assets</Typography>
            {Object.entries(balanceBreakdown.withdrawableAssets).map(([key, value]) => (
                <Typography variant='body1'>{`${key}: ${value}`}</Typography>
            ))}
            <Typography variant='h5'>Withdrawable dNFTs</Typography>
            <Box display='flex' gap={2}>
                {balanceBreakdown.withdrawableDNFTs?.map((dNFT, index) => (
                    <Typography key={index} variant='body1'>{dNFT.nftId.toString()}</Typography>
                ))}
            </Box>
            <Divider/>
            <Typography variant='h5'>Pending withdrawal</Typography>
            <Typography variant='body1'>{balanceBreakdown.pendingWithdrawal}</Typography>
            <Divider/>
            <Typography variant='h5'>Claimable claimableWNFTs</Typography>
            <Typography variant='body1'>{balanceBreakdown.claimableWNFTs?.map((wNFT, index) => (
                <Typography key={index} variant='body1'>{wNFT.nftId.toString()}</Typography>
            ))}
            </Typography>
            <Divider/>
            <Typography variant='h5'>Withdrawn assets</Typography>
            <Box display='flex' gap={2}>
                {Object.entries(balanceBreakdown.withdrawnAssets).map(([key, value]) => (
                    <Typography variant='body1'>{`${key}: ${value}`}</Typography>
                ))}
            </Box>
        </>
    )
}

export default UserBalanceBreakdown;
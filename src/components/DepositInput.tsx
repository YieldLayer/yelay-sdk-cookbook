"use client";

import {useCallback, useEffect, useRef, useState} from 'react';
import {Box, Button, CircularProgress, TextField} from '@mui/material';
import {useWeb3Provider} from "@/context/web3Context";
import {useSpoolSDK} from "@/context/SpoolSDKContext";
import Typography from "@mui/material/Typography";
import {BigNumber, ethers} from "ethers";
import {parseUnits} from "ethers/lib/utils";
import {DepositBagStruct, TokenInfo} from "@spool.fi/spool-v2-sdk";

interface DepositInputProps {
    smartVaultAddress: string;
    token: TokenInfo;
}

const DepositInput: React.FC<DepositInputProps> = ({smartVaultAddress, token}) => {

    const {account, checkAllowance, approve} = useWeb3Provider();
    const SpoolSDK = useSpoolSDK();

    const [amount, setAmount] = useState('');
    const [allowance, setAllowance] = useState<string>('0');
    const [loading, setLoading] = useState(false);
    const [needsApproval, setNeedsApproval] = useState(false);

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const fetchAllowance = useCallback(async () => {
        try {
            setLoading(true);
            if (account) {
                const allowance = await checkAllowance(token.address, account);
                setAllowance(allowance);
                setNeedsApproval(BigNumber.from(allowance).lt(BigNumber.from(amount || '0').mul(BigNumber.from(10).pow(token.decimals))));
            }
        }
        catch (err) {
            console.error('Failed to fetch allowance:', err);
        }
        finally {
            setLoading(false);
        }
    }, [account, amount]);

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            fetchAllowance();
        }, 500);
    }, [amount, fetchAllowance]);

    const handleDeposit = async () => {
        console.log(`Depositing amount: ${parseUnits(amount, token.decimals).toString()}`);
        try {
            setLoading(true);
            if (!account) {
                throw new Error('No account found');
            }
            const depositBag: DepositBagStruct = {
                smartVault: smartVaultAddress,
                assets: [parseUnits(amount, token.decimals)],
                receiver: account,
                referral: ethers.constants.AddressZero,
                doFlush: false,
            };
            const tx = await SpoolSDK.mutations.swapAndDeposit.deposit(depositBag)
            await tx.wait();
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <TextField
                label="Deposit Amount"
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
            />
            {loading ? (
                <Button disabled>
                    <CircularProgress />
                </Button>
            ):(
            <Button disabled={!account || !amount || needsApproval} variant="contained" color="primary" onClick={handleDeposit}>
                Deposit
            </Button>
            )}
            <Typography variant="caption">Approved amount to deposit into this vault: {allowance?.toString()}</Typography>
        </Box>
    );
};

export default DepositInput;